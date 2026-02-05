#!/bin/bash

# Setup script for saas.recipes/apps/web
# This script starts the local database, runs migrations, and creates a test user

set -e

echo "🚀 Setting up saas.recipes development environment..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker is not running. Please start Docker and try again."
  exit 1
fi

# Start PostgreSQL container
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
