FROM node:20-alpine AS base

# --- Dependencies ---
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json bun.lock* ./
RUN npm install -g bun && bun install --frozen-lockfile

# --- Builder ---
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN npm install -g bun && bun run build
RUN npx prisma generate

# --- Production ---
FROM node:20-alpine AS runner
WORKDIR /app

# Install Caddy
RUN apk add --no-cache caddy

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV DATABASE_URL=file:/app/db/custom.db

# Copy standalone Next.js server
COPY --from=builder /app/.next/standalone ./next-service-dist/
COPY --from=builder /app/.next/static ./next-service-dist/.next/static
COPY --from=builder /app/public ./next-service-dist/public

# Copy database
COPY --from=builder /app/db ./db

# Copy Caddy config
COPY --from=builder /app/Caddyfile ./Caddyfile

# Create startup script
RUN echo '#!/bin/sh' > /app/entrypoint.sh && \
    echo 'set -e' >> /app/entrypoint.sh && \
    echo 'echo "Starting Next.js server..."' >> /app/entrypoint.sh && \
    echo 'cd /app/next-service-dist' >> /app/entrypoint.sh && \
    echo 'node server.js &' >> /app/entrypoint.sh && \
    echo 'sleep 2' >> /app/entrypoint.sh && \
    echo 'echo "Starting Caddy..."' >> /app/entrypoint.sh && \
    echo 'cd /app' >> /app/entrypoint.sh && \
    echo 'exec caddy run --config /app/Caddyfile --adapter caddyfile' >> /app/entrypoint.sh && \
    chmod +x /app/entrypoint.sh

EXPOSE 81

CMD ["sh", "/app/entrypoint.sh"]
