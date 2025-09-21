#!/bin/bash

# Setup script for Audiobook Application Environment

echo "🚀 Setting up Audiobook Application Environment"
echo "=============================================="

# Check if .env already exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists. Backing up to .env.backup"
    cp .env .env.backup
fi

# Copy environment example
echo "📋 Copying environment template..."
cp environment.example .env

echo "✅ Environment file created: .env"
echo ""
echo "🔧 Next steps:"
echo "1. Edit .env file with your actual values:"
echo "   - CLERK_SECRET_KEY (required)"
echo "   - DO_SPACES_KEY (required)"
echo "   - DO_SPACES_SECRET (required)"
echo "   - DO_SPACES_BUCKET (required)"
echo "   - DO_SPACES_CDN_URL (required)"
echo ""
echo "2. Start the application:"
echo "   docker-compose up -d postgres"
echo "   cd apps/backend && poetry run alembic upgrade head"
echo "   docker-compose up backend"
echo ""
echo "📖 For more details, see README.md"
