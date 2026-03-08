# === Base Stage ===
FROM node:24-slim AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# === Builder Stage (Dev) ===
FROM base AS builder
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Built-in Next.js build is not needed for dev, but we'll leave the source here
# In dev, docker-compose will mount the source and run `npm run dev`

# === Production Runner Stage ===
# FROM builder AS production-builder
# RUN npm run build

# FROM node:24-slim AS runner
# WORKDIR /app
# ENV NODE_ENV=production
# ENV NEXT_TELEMETRY_DISABLED=1

# COPY --from=production-builder /app/.next/standalone ./
# COPY --from=production-builder /app/.next/static ./.next/static
# COPY --from=production-builder /app/public ./public

# EXPOSE 3000

CMD ["npm", "run", "dev"]