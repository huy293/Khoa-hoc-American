# ==============================================================================
# 🚀 NEXT.JS 15 MULTI-STAGE DOCKERFILE (CHUẨN HOMENEST PRODUCTION)
# ==============================================================================

# Stage 1: Base image
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat
ENV NODE_OPTIONS="--dns-result-order=ipv4first"

# Stage 2: Cài đặt dependencies với Cache Mount
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline --no-audit

# Stage 3: Build source code thành bản standalone
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Khai báo Build Arguments cho biến NEXT_PUBLIC_ (được bake vào lúc build)
ARG NEXT_PUBLIC_WORDPRESS_URL
ARG NEXT_PUBLIC_SITE_URL
ARG REVALIDATE_TIME
ARG HN_API_SECRET
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG FACEBOOK_CLIENT_ID
ARG FACEBOOK_CLIENT_SECRET

ENV NEXT_PUBLIC_WORDPRESS_URL=$NEXT_PUBLIC_WORDPRESS_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV REVALIDATE_TIME=$REVALIDATE_TIME
ENV HN_API_SECRET=$HN_API_SECRET
ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
ENV FACEBOOK_CLIENT_ID=$FACEBOOK_CLIENT_ID
ENV FACEBOOK_CLIENT_SECRET=$FACEBOOK_CLIENT_SECRET
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NODE_OPTIONS="--dns-result-order=ipv4first"

# Thực hiện build Next.js Standalone
RUN npm run build

# Stage 4: Production Runner (Siêu nhẹ ~120MB, Non-root User bảo mật)
FROM node:20-alpine AS runner
WORKDIR /app

# Khai báo Build Arguments & Runtime Environment Variables
ARG NEXT_PUBLIC_WORDPRESS_URL
ARG NEXT_PUBLIC_SITE_URL
ARG REVALIDATE_TIME
ARG HN_API_SECRET
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG FACEBOOK_CLIENT_ID
ARG FACEBOOK_CLIENT_SECRET

ENV NEXT_PUBLIC_WORDPRESS_URL=$NEXT_PUBLIC_WORDPRESS_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV REVALIDATE_TIME=$REVALIDATE_TIME
ENV HN_API_SECRET=$HN_API_SECRET
ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
ENV FACEBOOK_CLIENT_ID=$FACEBOOK_CLIENT_ID
ENV FACEBOOK_CLIENT_SECRET=$FACEBOOK_CLIENT_SECRET

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--dns-result-order=ipv4first"
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Tạo User & Group riêng không có quyền root (UID/GID 1001)
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Tạo thư mục public & cache cho Next.js với phân quyền đúng
RUN mkdir -p ./public && mkdir -p .next && chown -R nextjs:nodejs .next

# Copy các thư mục cần thiết từ builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

# Khởi chạy server Next.js standalone qua node với IPv4 first
CMD ["node", "--dns-result-order=ipv4first", "server.js"]
