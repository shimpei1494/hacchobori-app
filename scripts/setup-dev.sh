#!/bin/bash

# Hacchobori App Development Environment Setup Script
# This script sets up the local development environment with Docker and database

set -e  # Exit on any error

echo "🚀 Starting Hacchobori App development environment setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker and try again.${NC}"
    exit 1
fi

echo -e "${BLUE}🐳 Docker is running${NC}"

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}⚠️  .env.local not found. Creating from .env.example...${NC}"
    if [ -f .env.example ]; then
        cp .env.example .env.local
        echo -e "${YELLOW}📝 Please edit .env.local with your actual values before continuing${NC}"
        echo -e "${YELLOW}   Especially: DATABASE_URL, BETTER_AUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET${NC}"
    else
        echo -e "${RED}❌ .env.example not found. Please create .env.local manually${NC}"
        exit 1
    fi
fi

# Start Docker services
echo -e "${BLUE}🐳 Starting Docker services...${NC}"
docker-compose up -d

# Wait for PostgreSQL to be ready
echo -e "${BLUE}⏳ Waiting for PostgreSQL to be ready...${NC}"
max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
    if docker-compose exec -T postgres pg_isready -U postgres -d hacchobori_db >/dev/null 2>&1; then
        echo -e "${GREEN}✅ PostgreSQL is ready${NC}"
        break
    fi

    attempt=$((attempt + 1))
    echo -e "${YELLOW}   Attempt $attempt/$max_attempts - PostgreSQL not ready yet...${NC}"
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    echo -e "${RED}❌ PostgreSQL failed to start within expected time${NC}"
    echo -e "${RED}   Check Docker logs: docker-compose logs postgres${NC}"
    exit 1
fi

# Run database health check
echo -e "${BLUE}🔍 Running database health check...${NC}"
if npm run db:health; then
    echo -e "${GREEN}✅ Database health check passed${NC}"
else
    echo -e "${RED}❌ Database health check failed${NC}"
    exit 1
fi

# Push database schema
echo -e "${BLUE}📊 Pushing database schema...${NC}"
if npm run db:push; then
    echo -e "${GREEN}✅ Database schema pushed successfully${NC}"
else
    echo -e "${RED}❌ Failed to push database schema${NC}"
    exit 1
fi

# Seed database with sample data
echo -e "${BLUE}🌱 Seeding database with sample data...${NC}"
if npm run db:seed; then
    echo -e "${GREEN}✅ Database seeded successfully${NC}"
else
    echo -e "${YELLOW}⚠️  Database seeding failed, but setup can continue${NC}"
fi

echo -e "${GREEN}🎉 Development environment setup completed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Next steps:${NC}"
echo "   1. Edit .env.local with your actual values (if not done already)"
echo "   2. Run 'npm run dev' to start the development server"
echo "   3. Visit http://localhost:3000 to see your app"
echo "   4. Visit http://localhost:5050 to access pgAdmin (optional)"
echo ""
echo -e "${BLUE}🛠️  Useful commands:${NC}"
echo "   npm run dev           - Start development server"
echo "   npm run db:studio     - Open Drizzle Studio"
echo "   docker-compose logs   - View Docker logs"
echo "   docker-compose down   - Stop Docker services"