---
description: Quy chuẩn kiến trúc WordPress Headless chuẩn HomeNest
alwaysApply: true
---

# HomeNest WordPress Headless Architecture Rule

Mọi agent khi làm việc trên repo này phải tuân thủ các quy tắc sau:

1. **Bảo mật biến môi trường:**
   - Chỉ có `NEXT_PUBLIC_WORDPRESS_URL` và `NEXT_PUBLIC_SITE_URL` là public.
   - `HN_API_SECRET` là secret nội bộ phía server, không bao giờ thêm `NEXT_PUBLIC_`.
   - Không hardcode domain thật vào codebase, layout.tsx, docker-compose.yml hay .env.example.

2. **Trang động (SSG & ISR):**
   - Mọi route dynamic `[slug]` phải có `generateStaticParams()` được bọc `try/catch` trả về `[]` khi lỗi.
   - Dùng `generateMetadata()` với `generateWpMetadata()` từ `src/lib/wordpress-seo.ts`.
   - `layout.tsx` metadata giữ tối giản với `metadataBase: process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined`.

3. **Giao tiếp WordPress (`src/lib/wordpress.ts`):**
   - Luôn sử dụng `fetchGraphQL` và `fetchWpRest` kèm `getWpAuthHeaders()`.
   - Giãn cách 150ms khi build và trả về fallback an toàn trong `phase-production-build` để không làm sập build.
   - Tự động thay thế WordPress URL sang Frontend URL bằng `replaceWordpressURLs()`.

4. **Nội dung & SEO:**
   - Dùng `replaceH1WithH2()` và `formatContentLinks()` khi render nội dung Gutenberg HTML.
   - Luôn sử dụng component `<WpContent html={content} />`.

5. **Docker & Build Optimization:**
   - `next.config.ts` dùng `output: 'standalone'`, `cpus: 1`, `staticGenerationMaxConcurrency: 1`, `minimumCacheTTL: 31536000`.
   - Dockerfile & docker-compose.yml luôn có `NODE_OPTIONS="--dns-result-order=ipv4first"`.
