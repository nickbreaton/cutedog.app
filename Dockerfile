# syntax = docker/dockerfile:1

ARG NODE_VERSION=20.7.0
ARG PNPM_VERSION=8.6.3

FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Node.js"

WORKDIR /app

RUN npm install -g pnpm@$PNPM_VERSION

FROM base as build

# Install dependencies
COPY --link package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod=false

# Copy application code
COPY --link . .

# Build application
RUN mkdir -p data
RUN pnpm build

# Remove development dependencies
RUN pnpm prune --prod

# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

ENV NODE_ENV="production"
ENV PASSWORD=""
ENV ORIGIN=""

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "pnpm", "start" ]
