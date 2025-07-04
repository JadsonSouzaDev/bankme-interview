# Multi-stage build to optimize image size
FROM node:22-alpine AS base

# Install dependencies needed for build
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Copy monorepo configuration files
COPY package*.json ./
COPY turbo.json ./
COPY apps/frontend/package*.json ./apps/frontend/
COPY packages/shared/package*.json ./packages/shared/

# Install monorepo dependencies
RUN npm ci

# Build stage
FROM base AS builder

# Copy source code
COPY . .

# Remove frontend test files
RUN rm -rf apps/frontend/src/__tests__

# Build frontend
RUN npm run build --workspace=frontend

# Production stage
FROM node:22-alpine AS runner

# Install wget for healthcheck
RUN apk add --no-cache wget

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/apps/frontend/public ./apps/frontend/public
COPY --from=builder /app/apps/frontend/.next/standalone ./
COPY --from=builder /app/apps/frontend/.next/static ./apps/frontend/.next/static

# Set user
USER nextjs

# Expose port
EXPOSE 3000

# Environment variables
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Command to start the application
CMD ["node", "apps/frontend/server.js"] 