# ----------------------------------------------
# Stage 1: Builder
# ----------------------------------------------
FROM node:18-alpine AS builder

# Set the working directory to /app in the container
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache libc6-compat

# Enable corepack and install pnpm
RUN corepack enable && \
    corepack prepare pnpm@10.4.1 --activate

RUN corepack install -g pnpm@10.4.1

# ------------------------------------------------
# Copy monorepo root files for dependency installation
# ------------------------------------------------
# These files include the monorepo config and lockfile, adjust if needed.
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* tsconfig.base.json ./

# Copy all workspace source code first
COPY packages ./packages
COPY www ./www

# Install all dependencies (this installs dependencies for all workspaces)
RUN pnpm install --frozen-lockfile

# Build packages in the correct order
RUN pnpm --filter "@instantdb/core" build && \
    pnpm --filter "@instantdb/admin" build && \
    pnpm --filter "./packages/*" --filter="!@instantdb/core" --filter="!@instantdb/admin" build

# Install workspace dependencies explicitly with production=false
WORKDIR /app
RUN pnpm install --filter "./www..." --prod false

# Change working directory to the Next.js app directory
WORKDIR /app/www

# Build the Next.js application for production
RUN pnpm run build

# ----------------------------------------------
# Stage 2: Runner
# ----------------------------------------------
FROM node:18-alpine AS runner

# Set working directory
WORKDIR /app

# Install production dependencies
RUN apk add --no-cache libc6-compat

# Enable corepack and install pnpm
RUN corepack enable && \
    corepack prepare pnpm@10.4.1 --activate

# Copy necessary workspace files for production
COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/www ./www/

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Set working directory to www folder
WORKDIR /app/www

# Expose the port that Next.js uses (default is 3000)
EXPOSE 3000

# Set Node.js environment to production
ENV NODE_ENV=production

# Command to start the Next.js application in production mode
CMD ["pnpm", "start"]
