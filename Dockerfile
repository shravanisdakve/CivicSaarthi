# Stage 1: Build the React frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install ALL deps (including devDependencies for Vite)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Production image - only runtime deps + built dist
FROM node:20-alpine AS runner

WORKDIR /app

# Copy package files and install ONLY production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built frontend from builder stage
COPY --from=builder /app/dist ./dist

# Copy server and src utilities (server.js imports from src/utils)
COPY server.js ./
COPY src/utils ./src/utils
COPY src/data ./src/data

# Cloud Run listens on PORT env var (default 8080)
ENV PORT=8080
ENV NODE_ENV=production

EXPOSE 8080

# Start the Express server (serves both API and built frontend)
CMD ["node", "server.js"]
