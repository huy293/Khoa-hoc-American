#!/bin/bash
# =============================================================
# deploy.sh - Script tự động Deploy trên Server aaPanel / VPS
# Sử dụng: bash scripts/deploy.sh
# =============================================================

set -e

DEPLOY_PATH="${DEPLOY_PATH:-/www/wwwroot/course.homenest.edu.vn}"
COMPOSE_FILE="$DEPLOY_PATH/docker-compose.yml"

echo "🚀 Bắt đầu deploy Khoa-hoc-American (Next.js Headless)..."
echo "📂 Thư mục deploy: $DEPLOY_PATH"
echo ""

# Kiểm tra Docker
if ! command -v docker &> /dev/null; then
  echo "❌ Docker chưa được cài đặt trên server!"
  exit 1
fi

# Chuyển vào thư mục deploy
cd "$DEPLOY_PATH" || { echo "❌ Không tìm thấy thư mục $DEPLOY_PATH"; exit 1; }

# Pull code mới nhất từ Git (nhánh main hoặc huy)
if [ -d ".git" ]; then
  echo "📥 Đang cập nhật mã nguồn mới nhất từ Git..."
  git pull origin main || git pull origin huy || true
fi

# Build & Khởi động Container
echo "🔨 Đang build và khởi động Docker container..."
docker compose up -d --build --remove-orphans

# Kiểm tra trạng thái
echo ""
echo "📊 Trạng thái containers:"
docker compose ps

# Dọn dẹp images cũ
echo ""
echo "🧹 Đang dọn dẹp các Docker image cũ..."
docker image prune -f

echo ""
echo "✅ Deploy thành công lúc: $(date '+%Y-%m-%d %H:%M:%S')"
