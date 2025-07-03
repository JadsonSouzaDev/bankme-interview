# Build stage
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy monorepo configuration files
COPY package*.json ./
COPY turbo.json ./

# Copy workspace configuration
COPY apps/backend/package*.json ./apps/backend/
COPY packages/shared/package*.json ./packages/shared/

# Install dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY apps/backend ./apps/backend
COPY packages/shared ./packages/shared

# Build shared package first
WORKDIR /app/packages/shared
RUN npm run build

# Generate Prisma client and build backend
WORKDIR /app/apps/backend
RUN npx prisma generate
RUN npm run build

# Return to root directory
WORKDIR /app

# Production stage
FROM node:22-alpine AS production

# Install dumb-init for process management
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Set working directory
WORKDIR /app

# Copy configuration files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/turbo.json ./

# Copy dependencies
COPY --from=builder /app/node_modules ./node_modules

# Copy built code
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/generated ./apps/backend/generated
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist

# Copy necessary files
COPY --from=builder /app/apps/backend/prisma ./apps/backend/prisma
COPY --from=builder /app/apps/backend/package.json ./apps/backend/
COPY --from=builder /app/packages/shared/package.json ./packages/shared/

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Startup command
ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "-c", "cd /app/apps/backend && npx prisma migrate deploy && cd /app && node apps/backend/dist/main"] 