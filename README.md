# 🎓 Khoa-hoc-American — Frontend Project (HomeNest Headless)

Dự án website đào tạo & làm đẹp chuyên nghiệp **Khoa-hoc-American** được xây dựng trên nền tảng **Next.js 15 (App Router)**, **React 19** và **TypeScript 5**, tuân thủ 100% kiến trúc chuẩn **WordPress Headless** của HomeNest (tham khảo từ `homenest.com.vn` và `homenest-software`).

---

## 📑 Mục lục
1. [Tech Stack](#-tech-stack)
2. [Cấu trúc thư mục (Project Structure)](#-cấu-trúc-thư-mục-project-structure)
3. [Kiến trúc WordPress Headless](#-kiến-trúc-wordpress-headless)
4. [Biến môi trường (.env)](#-biến-môi-trường-env)
5. [Quy chuẩn Code & SEO](#-quy-chuẩn-code--seo)
6. [Docker & Triển khai Production](#-docker--triển-khai-production)
7. [Cài đặt và Chạy cục bộ](#-cài-đặt-và-chạy-cục-bộ)

---

## 🛠 Tech Stack

| Thành phần | Công nghệ | Ghi chú |
|---|---|---|
| **Framework** | Next.js 15+ (App Router) | Server Components, Standalone build, SSR/ISR/SSG |
| **Thư viện UI** | React 19 | Server & Client Components |
| **Ngôn ngữ** | TypeScript 5+ | Type-safe 100% data models, props, query APIs |
| **Styling** | CSS Modules (`.module.css`) + CSS Variables | Scoped styling, tối ưu hiệu năng render |
| **CMS Backend** | WordPress Headless | Kết nối qua WPGraphQL & WP REST API |
| **Icons** | Lucide React | Vector icons tối ưu |
| **Container** | Docker Multi-stage Build | Output standalone siêu nhẹ (~120MB), Non-root user |

---

## 📂 Cấu trúc thư mục (Project Structure)

```text
Khoa-hoc-American/
├── public/                       # Assets tĩnh (images, fonts, banners)
│   ├── images/
│   └── fonts/
│
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API Routes (contact proxy, ISR revalidate, draft mode)
│   │   ├── courses/              # Danh sách và chi tiết khóa học ([slug])
│   │   ├── course/               # Route alias đồng bộ với courses
│   │   ├── shop/                 # Danh sách và chi tiết sản phẩm ([slug])
│   │   ├── contact/              # Trang liên hệ
│   │   ├── resources/            # Trang tài nguyên & thư viện ảnh
│   │   ├── about-us/             # Trang giới thiệu
│   │   ├── layout.tsx            # Root Layout
│   │   ├── page.tsx              # Trang chủ
│   │   ├── sitemap.ts            # Dynamic XML Sitemap
│   │   └── robots.ts             # Dynamic robots.txt
│   │
│   ├── components/               # UI Components
│   │   ├── common/               # Component dùng chung (WpContent, HeaderText...)
│   │   ├── home/                 # Component trang chủ
│   │   ├── course/               # Component danh sách khóa học
│   │   ├── course-detail/        # Component chi tiết khóa học
│   │   └── layout/               # Header, Footer
│   │
│   ├── lib/                      # Tầng kết nối WordPress & SEO
│   │   ├── wordpress.ts          # Core Fetcher (GraphQL, REST, Auth headers, Retry, URL replacing)
│   │   ├── wordpress-queries.ts  # Pre-built queries (courses, posts, pages, menu, settings)
│   │   ├── wordpress-seo.ts      # Chuyển đổi Yoast/RankMath SEO sang Next.js Metadata
│   │   └── wordpress-format.ts   # Format tiền VND, ngày tháng, sanitize HTML Gutenberg
│   │
│   ├── types/                    # TypeScript interfaces (WPCourse, WPPost, WPPage, WPSeo...)
│   └── styles/                   # CSS Modules tương ứng
│
├── AGENTS.md                     # 🏛️ Hướng dẫn quy chuẩn kiến trúc cho AI Agents
├── Dockerfile                    # Multi-stage build standalone siêu nhẹ
├── docker-compose.yml            # Khởi chạy Docker container
├── next.config.ts                # Tối ưu hóa Next.js (cpus: 1, standalone, cache headers)
└── package.json                  # Scripts & Dependencies
```

---

## 🌐 Kiến trúc WordPress Headless

1. **Bảo mật 4 lớp Header**:
   - `Authorization: Bearer <SECRET>`
   - `x-api-key: <SECRET>`
   - `x-graphql-secret: <SECRET>`
   - `x-secret-key: <SECRET>`
2. **Chống sập build**: Trong `phase-production-build`, nếu WordPress phản hồi chậm hoặc lỗi, hệ thống tự động fallback an toàn mà không làm dừng quá trình build.
3. **Giãn cách request**: 150ms delay giữa các lượt fetch lúc build để bảo vệ CPU/MySQL của máy chủ WordPress.
4. **Thay thế URL động**: Tự động chuyển đổi toàn bộ đường dẫn WordPress Backend sang Frontend URL qua `replaceWordpressURLs()`.

---

## 🔑 Biến môi trường (.env)

Tạo file `.env.local` tại thư mục gốc:

```env
# Domain WordPress Backend (Bắt buộc có NEXT_PUBLIC_)
NEXT_PUBLIC_WORDPRESS_URL=https://course-amc.homenest.edu.vn

# Domain Frontend Next.js (Bắt buộc có NEXT_PUBLIC_)
NEXT_PUBLIC_SITE_URL=https://course.homenest.edu.vn

# Thời gian revalidate cache mặc định (giây)
REVALIDATE_TIME=3600

# Secret Key xác thực giữa Next.js và WordPress (TUYỆT ĐỐI KHÔNG CÓ TIỀN TỐ NEXT_PUBLIC_)
HN_API_SECRET=your_super_secret_key_here
```

---

## 🚀 Cài đặt và Chạy dự án

```bash
# 1. Cài đặt dependencies
npm install

# 2. Chạy môi trường phát triển (Development)
npm run dev

# 3. Kiểm tra Types & Build bản Production
npx tsc --noEmit
npm run build

# 4. Khởi chạy Production
npm start
```

---

## 🐳 Docker Deployment

```bash
# Khởi chạy bằng Docker Compose
docker compose up -d --build
```
