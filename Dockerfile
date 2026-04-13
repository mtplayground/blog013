# Self-check: cargo build --release on host is not applicable (this repository is Node.js/Next.js, not Cargo-based).
# Rust PATH A/B are not applicable; this Dockerfile uses a production Node.js multi-stage runtime build.
FROM node:20-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-bookworm-slim AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL=file:./prisma/dev.db
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npx prisma migrate deploy
RUN npm run build

FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME=0.0.0.0
ENV PORT=8080
ENV DATABASE_URL=file:/app/data/dev.db
ENV NEXT_PUBLIC_SITE_URL=http://localhost:8080

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates sqlite3 \
  && rm -rf /var/lib/apt/lists/*

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 --ingroup nodejs nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma/dev.db /app/data/dev.db
COPY start.sh /app/start.sh

RUN mkdir -p /app/data \
  && chmod +x /app/start.sh \
  && chown -R nextjs:nodejs /app

USER nextjs
EXPOSE 8080

CMD ["/app/start.sh"]
