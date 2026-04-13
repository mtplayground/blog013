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

if ! sqlite3 "$DB_PATH" "SELECT 1 FROM _prisma_migrations LIMIT 1;" >/dev/null 2>&1; then
  for migration in /app/prisma/migrations/*/migration.sql; do
    [ -f "$migration" ] || continue
    sqlite3 "$DB_PATH" < "$migration"
  done
fi

exec node server.js
