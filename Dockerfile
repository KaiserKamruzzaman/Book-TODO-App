# Use Node Alpine image
FROM node:current-alpine3.22

# Set working directory
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN yarn install

# Copy prisma folder explicitly before generating
COPY prisma ./prisma

# Generate Prisma Client (now schema.prisma is present)
RUN yarn prisma generate --schema=./prisma/schema.prisma


# Copy all source code
COPY . .

# Expose the port the dev server runs on
EXPOSE 3000

# Start dev server with hot reload
CMD ["yarn", "dev"]
