#!/bin/bash

# Setup script for saas.recipes/apps/web
# This script prepares the database, runs migrations, and creates a test user

set -e

echo "🚀 Setting up saas.recipes development environment..."
echo ""

DATABASE_URL=$(
  node -e "const { existsSync } = require('node:fs'); const { resolve } = require('node:path'); const candidates = [resolve(process.cwd(), '.env.local'), resolve(process.cwd(), '.env'), resolve(process.cwd(), '../../.env.local'), resolve(process.cwd(), '../../.env')]; for (const envPath of candidates) { if (existsSync(envPath)) process.loadEnvFile(envPath); } process.stdout.write(process.env.DATABASE_URL || process.env.POSTGRES_URL || '');"
)

if [ -z "${DATABASE_URL}" ]; then
  echo "❌ DATABASE_URL is not set. Add it to apps/web/.env or repo-root .env."
  exit 1
fi

# For non-Neon local DB URLs, start Docker postgres automatically
if [[ "${DATABASE_URL}" != *"neon.tech"* ]]; then
  if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
  fi

  echo "🐘 Starting PostgreSQL database..."
  docker compose up -d

  # Wait for PostgreSQL to be ready
  echo "⏳ Waiting for database to be ready..."
  max_attempts=30
  attempt=0
  until docker compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; do
    attempt=$((attempt + 1))
    if [ $attempt -ge $max_attempts ]; then
      echo "❌ Database failed to start after $max_attempts attempts"
      exit 1
    fi
    echo "   Waiting... (attempt $attempt/$max_attempts)"
    sleep 1
  done
  echo "✅ Database is ready!"
  echo ""
else
  echo "☁️  Neon database detected, skipping local Docker startup."
  echo ""
fi

# Run database migrations
echo "📦 Running database migrations..."
pnpm db:push
echo "✅ Migrations complete!"
echo ""

# Seed test user
echo "👤 Creating test user..."
pnpm db:seed
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Setup complete! You can now run:"
echo ""
echo "   pnpm dev"
echo ""
echo "Then sign in with:"
echo "   Email:    test@test.com"
echo "   Password: password"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
