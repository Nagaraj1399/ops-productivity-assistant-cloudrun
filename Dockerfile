# ========================================================
# Dockerfile for Lab 3: Personal Productivity Assistant
# Multi-Stage Optimized for Google Cloud Run Deployment
# ========================================================

# Stage 1: Build & Bundle
FROM node:22-slim AS builder

WORKDIR /app

# Install build essentials for native dependencies if needed
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package manifests
COPY package*.json ./

# Install all dependencies (including devDependencies required for compilation)
RUN npm install

# Copy application source code
COPY . .

# Run production build (Vite client build + esbuild server bundling)
RUN npm run build

# Stage 2: Production Runner
FROM node:22-slim AS runner

WORKDIR /app

# Set production environment variables
ENV NODE_ENV=production
# Google Cloud Run dynamically passes the PORT environment variable (default: 8080)
ENV PORT=8080

# Create application user for rootless container execution
USER node

# Copy package manifests for runtime dependencies
COPY --chown=node:node package*.json ./

# Install only production dependencies
RUN npm install --omit=dev --ignore-scripts && npm cache clean --force

# Copy compiled production artifacts from builder
COPY --chown=node:node --from=builder /app/dist ./dist

# Document the container port (Cloud Run overrides at runtime)
EXPOSE 8080

# Start server using bundled CommonJS server file
CMD ["node", "dist/server.cjs"]
