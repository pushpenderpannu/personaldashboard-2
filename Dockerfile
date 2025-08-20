# Stage 1: Build the React client
FROM node:18-alpine AS builder
WORKDIR /app/client
COPY client/package.json client/package-lock.json* ./
# Use --force to avoid issues with peer dependencies if they arise
RUN npm install --force
COPY client/ ./
RUN npm run build

# Stage 2: Prepare server dependencies
FROM node:18-alpine AS server_deps
WORKDIR /app/server
COPY server/package.json server/package-lock.json* ./
RUN npm install --production

# Stage 3: Final production image
FROM node:18-alpine
WORKDIR /app

# Copy server dependencies from the server_deps stage
COPY --from=server_deps /app/server/node_modules ./server/node_modules

# Copy server source code
COPY server/ ./server/

# Copy the built React app from the builder stage into the server's public directory
COPY --from=builder /app/client/build ./server/public

# Expose the port the server runs on
EXPOSE 3001

# Set the command to run the application
CMD [ "node", "server/index.js" ]
