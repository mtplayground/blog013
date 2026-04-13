#!/bin/sh
set -eu

DB_PATH="/app/data/dev.db"
case "${DATABASE_URL:-}" in
  file:/*)
    DB_PATH="${DATABASE_URL#file:}"
    ;;
  file:./*)
    DB_PATH="/app/${DATABASE_URL#file:./}"
    ;;
  file:*)
    DB_PATH="/app/${DATABASE_URL#file:}"
    ;;
esac

mkdir -p "$(dirname "$DB_PATH")"

HAS_MIGRATIONS_TABLE="$(sqlite3 "$DB_PATH" "SELECT 1 FROM sqlite_master WHERE type='table' AND name='_prisma_migrations';" 2>/dev/null || true)"
HAS_POST_TABLE="$(sqlite3 "$DB_PATH" "SELECT 1 FROM sqlite_master WHERE type='table' AND name='Post';" 2>/dev/null || true)"

if [ "$HAS_MIGRATIONS_TABLE" != "1" ] && [ "$HAS_POST_TABLE" != "1" ]; then
  for migration in /app/prisma/migrations/*/migration.sql; do
    [ -f "$migration" ] || continue
    sqlite3 "$DB_PATH" < "$migration"
  done
fi

exec node server.js
