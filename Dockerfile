# syntax=docker/dockerfile:1.4
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++ libc6-compat

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY postcss.config.mjs ./
COPY .eslintrc.js ./

# Install dependencies with better caching
RUN --mount=type=cache,target=/root/.npm \
    npm ci --only=production && \
    npm cache clean --force

# Install and rebuild bcrypt separately
RUN npm install bcrypt && \
    cd node_modules/bcrypt && \
    npm install node-addon-api && \
    npm rebuild bcrypt --build-from-source

# Builder stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN mkdir -p /app/public/uploads

RUN apk add --no-cache python3 make g++
RUN cd node_modules/bcrypt && npm install node-addon-api && npm rebuild bcrypt --build-from-source
RUN npm run setup
RUN npm run build

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8081
ENV HOSTNAME="0.0.0.0"

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install only required runtime dependencies
RUN apk add --no-cache python3 make g++

# Setup bcrypt
COPY --from=deps /app/node_modules/bcrypt ./node_modules/bcrypt
RUN cd node_modules/bcrypt && npm install node-addon-api && npm rebuild bcrypt --build-from-source

# Setup application files
RUN mkdir -p /app/public/uploads && chown -R nextjs:nodejs /app/public

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Security hardening
RUN chmod -R 555 /app
RUN chmod -R 755 /app/public/uploads

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --spider http://localhost:8081/api/health || exit 1

USER nextjs
EXPOSE 8081

CMD ["node", "server.js"] 