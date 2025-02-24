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
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./

# Copy all workspace source code first
COPY packages ./packages
COPY www ./www

# Install all dependencies (this installs dependencies for all workspaces)
RUN pnpm install --frozen-lockfile

# Build all packages first
RUN pnpm --filter "./packages/*" build

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

# Enable corepack in the runner stage
RUN corepack enable && \
    corepack prepare pnpm@10.4.1 --activate

# Copy the built Next.js application from the builder stage
COPY --from=builder /app/www ./

# Expose the port that Next.js uses (default is 3000)
EXPOSE 3000

# Set Node.js environment to production
ENV NODE_ENV=production

# Command to start the Next.js application.
# It is assumed that the "start" script in package.json runs "next start".
CMD ["pnpm", "start"]
