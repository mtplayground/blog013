# ZeroClaw Blog

Next.js + Prisma (SQLite) blog with an admin panel for authentication and post management.

## Requirements

- Node.js 20+
- npm 9+
- Docker + Docker Compose (for containerized deployment)

## Local Development

1. Install dependencies:
   ```bash
   npm ci
   ```
2. Configure environment:
   ```bash
   cp .env.example .env
   ```
3. Run migrations and seed:
   ```bash
   npx prisma migrate dev
   npm run db:seed
   ```
4. Start dev server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:8080`.

## Container Deployment

The compose stack includes a `migrate` service that applies Prisma migrations to the shared SQLite volume before `web` starts.

1. Set secure environment values (or place them in shell env/.env):
   ```bash
   export ADMIN_PASSWORD='replace-with-strong-password'
   export SESSION_SECRET='replace-with-long-random-secret'
   export NEXT_PUBLIC_SITE_URL='http://localhost:8080'
   ```
2. Build and start:
   ```bash
   docker compose up --build -d
   ```
3. Stop services (keep data):
   ```bash
   docker compose down
   ```
4. Reset services and data volume:
   ```bash
   docker compose down -v
   ```

## End-to-End Verification Checklist

Run these checks after `docker compose up --build -d`:

1. Docker build + startup:
   - `docker compose ps` shows both `migrate` completed and `web` running.
2. Admin login:
   - Open `/admin/login` and sign in with `ADMIN_PASSWORD`.
3. Create post:
   - In admin, create a published post via `/admin/posts/new`.
4. Edit post:
   - Update title/slug/content from `/admin/posts/<slug>/edit`.
5. Public rendering:
   - Verify homepage shows the post card.
   - Verify `/posts/<slug>` renders Markdown content.
6. Delete with confirmation:
   - Delete from admin dashboard and confirm prompt.
   - Verify post is removed from public pages.
7. SQLite persistence across restarts:
   - Create a post, run `docker compose restart web`, confirm post still exists.
   - Optionally run `docker compose down && docker compose up -d` and confirm data still exists.

## Verification Notes

- `npm run build` passes.
- In environments without Docker available, you can still validate app flow by running:
  ```bash
  npx prisma migrate deploy
  npm run build
  node .next/standalone/server.js
  ```
  Then exercise login/create/edit/delete/public pages manually in the browser.
