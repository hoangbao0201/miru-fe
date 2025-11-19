# ---------- BUILD STAGE ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Copy minimal files
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# ---------- RUNNER STAGE ----------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Chỉ copy những gì cần thiết
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Clean cache Next.js
RUN rm -rf /app/node_modules/.cache

EXPOSE 3000
CMD ["yarn", "start"]

HEALTHCHECK --interval=5s --timeout=2s --start-period=3s --retries=10 \
  CMD wget -qO- http://localhost:3000/ || exit 1