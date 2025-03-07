FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++ 

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY .eslintrc.js ./
COPY postcss.config.mjs ./

# Install dependencies
RUN npm ci
# Install node-addon-api locally and rebuild bcrypt
RUN cd node_modules/bcrypt && npm install node-addon-api && npm rebuild bcrypt --build-from-source

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Install build dependencies and rebuild bcrypt
RUN apk add --no-cache python3 make g++
RUN cd node_modules/bcrypt && npm install node-addon-api && npm rebuild bcrypt --build-from-source
RUN npm run setup
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install runtime dependencies
RUN apk add --no-cache python3 make g++

# Create directory structure and copy bcrypt
RUN mkdir -p /app/node_modules
COPY --from=deps /app/node_modules/bcrypt ./node_modules/bcrypt
RUN cd node_modules/bcrypt && npm install node-addon-api && npm rebuild bcrypt --build-from-source

RUN mkdir -p /app/public/uploads && chown -R nextjs:nodejs /app/public

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"] 