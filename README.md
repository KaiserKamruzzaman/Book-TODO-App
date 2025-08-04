# Book Todo App with Docker PostgreSQL

A Next.js todo application for managing your reading list, using PostgreSQL in Docker and Prisma ORM.

## 🚀 Quick Start with Docker

### Prerequisites
- [Docker](https://www.docker.com/get-started) installed on your machine
- [Node.js](https://nodejs.org/) (v18 or higher)

### Setup Instructions

1. **Clone and install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Start PostgreSQL with Docker:**
   \`\`\`bash
   npm run docker:up
   \`\`\`

3. **Set up the database:**
   \`\`\`bash
   npm run db:setup
   \`\`\`

4. **Start the development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open your browser:**
   - App: http://localhost:3000
   - pgAdmin: http://localhost:8080 (admin@example.com / admin123)
   - Prisma Studio: `npm run db:studio`

## 🐳 Docker Commands

\`\`\`bash
# Start PostgreSQL container
npm run docker:up

# Stop PostgreSQL container
npm run docker:down

# View PostgreSQL logs
npm run docker:logs

# Reset database (removes all data)
npm run docker:reset

# Complete database setup
npm run db:setup
\`\`\`

## 🗄️ Database Management

\`\`\`bash
# Open Prisma Studio (visual database editor)
npm run db:studio

# Reset database schema and data
npm run db:reset

# Generate Prisma Client after schema changes
npx prisma generate

# Apply schema changes to database
npx prisma db push
\`\`\`

## 🧪 Testing

\`\`\`bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
\`\`\`

## 📁 Project Structure

\`\`\`
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts               # Database seeding
├── docker-compose.yml        # Docker services configuration
├── init-scripts/            # PostgreSQL initialization scripts
├── __tests__/              # Test files
└── .env                    # Environment variables
\`\`\`

## 🔧 Environment Variables

Copy `.env.example` to `.env` and update the PostgreSQL password:

\`\`\`env
DATABASE_URL="postgresql://postgres:your_secure_password@localhost:5432/book_todo_db?schema=public"
\`\`\`

## 🛠️ Troubleshooting

### Database Connection Issues
\`\`\`bash
# Check if PostgreSQL container is running
docker ps

# Check PostgreSQL logs
npm run docker:logs

# Test database connection
npx prisma db pull
\`\`\`

### Port Conflicts
If port 5432 is already in use, update `docker-compose.yml`:
\`\`\`yaml
ports:
  - "5433:5432"  # Use port 5433 instead
\`\`\`

Then update your `.env`:
\`\`\`env
DATABASE_URL="postgresql://postgres:your_secure_password@localhost:5433/book_todo_db?schema=public"
