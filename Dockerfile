# syntax=docker/dockerfile:1.4
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++ libc6-compat ffmpeg

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY postcss.config.mjs ./
COPY .eslintrc.js ./

# Install dependencies with better caching
RUN --mount=type=cache,target=/root/.npm \
    npm install --omit=dev && \
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

# Create necessary directories
RUN mkdir -p /app/public/uploads/videos
RUN mkdir -p /app/public/uploads/images
RUN mkdir -p /app/public/uploads/pdfs
RUN mkdir -p /app/public/uploads/excel
RUN mkdir -p /app/.next/static/videos

RUN apk add --no-cache python3 make g++ ffmpeg
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
RUN apk add --no-cache python3 make g++ ffmpeg

# Setup bcrypt
COPY --from=deps /app/node_modules/bcrypt ./node_modules/bcrypt
RUN cd node_modules/bcrypt && npm install node-addon-api && npm rebuild bcrypt --build-from-source

# Setup application files and directories
RUN mkdir -p /app/public/uploads/videos && \
    mkdir -p /app/public/uploads/images && \
    mkdir -p /app/public/uploads/pdfs && \
    mkdir -p /app/public/uploads/excel && \
    mkdir -p /app/.next/static/videos && \
    chown -R nextjs:nodejs /app/public/uploads && \
    chmod -R 755 /app/public/uploads

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Security hardening with proper permissions for video directories
RUN chmod -R 555 /app && \
    chmod -R 755 /app/public/uploads/videos && \
    chmod -R 755 /app/public/uploads/images && \
    chmod -R 755 /app/public/uploads/pdfs && \
    chmod -R 755 /app/public/uploads/excel

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --spider http://localhost:8081/api/health || exit 1

USER nextjs
EXPOSE 8081

CMD ["node", "server.js"] 