# === Base Stage ===
FROM node:24-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install && npm install -g @nestjs/cli

# === Builder Stage (Dev) ===
FROM base AS builder
COPY . .
# For dev, src is copied but docker-compose will mount it.

# === Production Runner Stage ===
FROM builder AS production-builder
RUN npm run build

FROM node:24-alpine AS runner
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=production-builder /app/dist ./dist

EXPOSE 4000
CMD ["npm", "run", "start:dev"]
