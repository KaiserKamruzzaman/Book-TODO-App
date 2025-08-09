# Stage 1: Build stage
FROM node:current-alpine3.22 AS builder

WORKDIR /app

# Copy package files for dependency install
COPY package*.json ./

# Install all dependencies (including dev)
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Next.js production app
RUN yarn run build

# Stage 2: Production stage
FROM node:current-alpine3.22

WORKDIR /app

# Copy only package.json for metadata (optional)
COPY package*.json ./

# Copy node_modules and build output from builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/prisma ./prisma

# Set environment variables for production
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port your app will run on
EXPOSE 3000

# Start the app
CMD ["yarn", "start"]
