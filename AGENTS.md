# 🏛️ QUY CHUẨN PHÁT TRIỂN DỰ ÁN HOMENEST HEADLESS (FOR AGENTS)

> **LƯU Ý DÀNH CHO AGENT TIẾP QUẢN SAU NÀY:**
> Dự án này tuân thủ 100% kiến trúc WordPress Headless chuẩn của HomeNest (tham khảo từ `homenest.com.vn` và `homenest-software`). Mọi thay đổi, bổ sung code hoặc refactor trong tương lai **BẮT BUỘC** phải tuân theo các nguyên tắc dưới đây.

---

## 1. ⚙️ BIẾN MÔI TRƯỜNG & NGUYÊN TẮC BẢO MẬT

1. **Chỉ có duy nhất 1 WordPress Backend và 1 Frontend:**
   - `NEXT_PUBLIC_WORDPRESS_URL`: Domain WordPress Backend (ví dụ: `https://course-amc.homenest.edu.vn`).
   - `NEXT_PUBLIC_SITE_URL`: Domain Next.js Frontend (ví dụ: `https://course.homenest.edu.vn`).
   - `REVALIDATE_TIME`: Thời gian revalidate cache mặc định (HomeNest standard: `3600`).
   - `HN_API_SECRET`: Secret Key xác thực giữa Next.js và WordPress.

2. **Quy tắc bảo mật Secret:**
   - `HN_API_SECRET` **TUYỆT ĐỐI KHÔNG ĐƯỢC CÓ TIỀN TỐ `NEXT_PUBLIC_`**. Biến này chỉ được đọc trong Server Components, Server Actions và Route Handlers (`src/app/api/`).
   - Form từ client phải gửi về Proxy [`/api/contact`](file:///d:/HOMENEST%20-%20QUESTX/huyadmin/Khoa-hoc-American/src/app/api/contact/route.ts) của Next.js, không gọi thẳng sang WordPress để tránh lộ token.
   - Không được hardcode link thật hoặc fallback domain trong [`docker-compose.yml`](file:///d:/HOMENEST%20-%20QUESTX/huyadmin/Khoa-hoc-American/docker-compose.yml), [`layout.tsx`](file:///d:/HOMENEST%20-%20QUESTX/huyadmin/Khoa-hoc-American/src/app/layout.tsx), hoặc [`.env.example`](file:///d:/HOMENEST%20-%20QUESTX/huyadmin/Khoa-hoc-American/.env.example).

---

## 2. ⚡ TRANG ĐỘNG (DYNAMIC ROUTES & SSG)

Mọi dynamic page (`[slug]`) như `courses/[slug]`, `shop/[slug]`, `blog/[slug]` **bắt buộc** phải triển khai:

1. **`generateStaticParams()`**:
   - Phải bọc trong `try/catch`, nếu lỗi hoặc WordPress offline thì trả về mảng rỗng `[]` để không làm chết quá trình build (`npm run build`).
2. **`generateMetadata()`**:
   - Sử dụng các hàm hỗ trợ trong [`src/lib/wordpress-seo.ts`](file:///d:/HOMENEST%20-%20QUESTX/huyadmin/Khoa-hoc-American/src/lib/wordpress-seo.ts) để sinh Title, Description, OpenGraph, Canonical từ Yoast / Rank Math SEO trên WordPress.
3. **`layout.tsx`**:
   - Giữ metadata ở mức tối giản, chỉ thiết lập `metadataBase: process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined`. Không hardcode text hay domain cố định.

---

## 3. 🌐 GIAO TIẾP VỚI WORDPRESS (`src/lib/wordpress.ts`)

1. **Headers xác thực:**
   - Mọi request gửi sang WordPress phải đi kèm 4 header bảo mật (`Authorization: Bearer`, `x-api-key`, `x-graphql-secret`, `x-secret-key`) tạo bởi hàm `getWpAuthHeaders()`.
2. **Cơ chế chống sập build (Resilience):**
   - Khi `process.env.NEXT_PHASE === 'phase-production-build'`, nếu fetch thất bại phải trả về `null`/`{}` thay vì throw Error.
   - Giãn cách 150ms giữa các request trong phase build để tránh làm sập MySQL/PHP của máy chủ WordPress.
   - Áp dụng timeout (`AbortSignal.timeout`) và retry 2 lần với exponential backoff.
3. **URL Replacement:**
   - Luôn sử dụng hàm `replaceWordpressURLs()` để chuyển đổi domain backend WordPress thành domain frontend Next.js trên toàn bộ payload.

---

## 4. 📝 XỬ LÝ NỘI DUNG & SEO (`src/lib/wordpress-format.ts`)

1. **Thẻ Heading:**
   - Tất cả thẻ `<h1>` bên trong nội dung bài viết từ WordPress phải được tự động chuyển thành `<h2>` qua `replaceH1WithH2()` để đảm bảo mỗi trang chỉ có duy nhất 1 thẻ H1 (chuẩn SEO Google).
2. **External Links:**
   - Mọi liên kết trỏ ra ngoài phải được tự động gắn `target="_blank"` và `rel="noopener noreferrer"` qua hàm `formatContentLinks()`.
3. **Hiển thị nội dung Gutenberg:**
   - Luôn dùng component [`<WpContent html={content} />`](file:///d:/HOMENEST%20-%20QUESTX/huyadmin/Khoa-hoc-American/src/components/common/WpContent.tsx) để render nội dung kèm styling CSS chuẩn.

---

## 5. 🐳 DOCKER & TỐI ƯU HÓA HỆ THỐNG

1. **`next.config.ts`**:
   - Bắt buộc bật `output: 'standalone'`.
   - `experimental.cpus: 1` và `experimental.staticGenerationMaxConcurrency: 1` (tiêu chuẩn HomeNest nhằm nhường tài nguyên cho aaPanel/VPS lúc build).
   - `images.minimumCacheTTL: 31536000` (cache ảnh 1 năm).
2. **`Dockerfile` & `docker-compose.yml`**:
   - Bắt buộc có biến môi trường `NODE_OPTIONS="--dns-result-order=ipv4first"` để tránh lỗi treo kết nối IPv6 trên Cloudflare/aaPanel.
   - Chạy container dưới User bảo mật non-root: `nextjs:nodejs` (UID/GID 1001).
   - Tích hợp sẵn `HEALTHCHECK` tự động.
