#!/bin/bash
# Run migrations against Supabase
# Usage: ./scripts/migrate.sh <migration-file.sql>
# Requires DB password - get it from Supabase Dashboard → Project Settings → Database

set -e

PROJECT_REF="bfernoltlgadixahvtca"
MIGRATION_FILE="$1"

if [ -z "$MIGRATION_FILE" ]; then
  echo "Usage: $0 <migration-file.sql>"
  exit 1
fi

if [ ! -f "$MIGRATION_FILE" ]; then
  echo "File not found: $MIGRATION_FILE"
  exit 1
fi

echo "Enter Supabase database password (from Dashboard → Project Settings → Database):"
read -s DB_PASSWORD
echo

PGPASSWORD="$DB_PASSWORD" psql \
  -h "db.$PROJECT_REF.supabase.co" \
  -p 5432 \
  -U postgres \
  -d postgres \
  -f "$MIGRATION_FILE"

echo "Migration applied: $MIGRATION_FILE"
