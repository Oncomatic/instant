# ----------------------------------------------
# Stage 1: Builder
# ----------------------------------------------
FROM node:18-alpine AS builder

# Set the working directory to /app in the container
WORKDIR /app

# Enable corepack so pnpm is available
RUN corepack enable

# ------------------------------------------------
# Copy monorepo root files for dependency installation
# ------------------------------------------------
# These files include the monorepo config and lockfile, adjust if needed.
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./

# Install all dependencies (this installs dependencies for all workspaces)
RUN pnpm install

# ------------------------------------------------
# Copy the workspace source code
# ------------------------------------------------
COPY www ./www
COPY packages ./packages

# Install workspace dependencies explicitly
WORKDIR /app
RUN pnpm install --filter ./www

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

# Copy the built Next.js application from the builder stage
COPY --from=builder /app/www ./

# Expose the port that Next.js uses (default is 3000)
EXPOSE 3000

# Set Node.js environment to production
ENV NODE_ENV=production

# Command to start the Next.js application.
# It is assumed that the "start" script in package.json runs "next start".
CMD ["pnpm", "start"]
