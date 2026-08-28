# 🏛️ HOMENEST HEADLESS AGENT PLAYBOOK & ARCHITECTURE MANUAL

> **DÀNH CHO AGENT TIẾP QUẢN DỰ ÁN:**
> Dự án này tuân thủ 100% kiến trúc chuẩn WordPress Headless của HomeNest (tham khảo và đồng bộ từ `homenest.com.vn` và `homenest-software`). 
> Tài liệu này cung cấp toàn bộ bản đồ kiến trúc, quy chuẩn code, vị trí các hàm quan trọng để bạn có thể **nhập cuộc và triển khai tính năng ngay lập tức** mà không cần phải nghiên cứu lại từ đầu.

---

## ⚡ 1. AGENT QUICK-START & TỔNG QUAN HỆ THỐNG

### 🎯 Thông tin cốt lõi:
- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript 5.
- **Styling**: CSS Modules (`.module.css`) + Design Tokens thuần túy, không dùng Tailwind trừ khi có yêu cầu riêng.
- **Kiến trúc**: Next.js Standalone Frontend kết nối WordPress Backend qua WPGraphQL & WP REST API.
- **Domain thực tế (Cấu hình qua `.env.local`):**
  - WordPress Backend: `NEXT_PUBLIC_WORDPRESS_URL` (Ví dụ: `https://course-amc.homenest.edu.vn`)
  - Next.js Frontend: `NEXT_PUBLIC_SITE_URL` (Ví dụ: `https://course.homenest.edu.vn`)
  - Secret xác thực: `HN_API_SECRET`
  - Cache ISR: `REVALIDATE_TIME=3600` (1 giờ)

---

## 📂 2. BẢN ĐỒ CÁC MODULE QUAN TRỌNG (SYSTEM DIRECTORY MAP)

```text
src/
├── app/                                 # App Router Routes
│   ├── api/
│   │   ├── contact/route.ts             # Proxy nhận form từ client -> gửi sang WP (Bảo mật Secret)
│   │   ├── revalidate/route.ts          # Webhook ISR làm mới cache tức thì khi WP cập nhật bài
│   │   ├── draft/route.ts               # Bật chế độ xem trước bài nháp (Draft Preview)
│   │   └── disable-draft/route.ts       # Tắt chế độ xem trước bài nháp
│   ├── courses/                         # Trang danh sách khóa học
│   │   └── [slug]/page.tsx              # Trang chi tiết khóa học (Đã có generateStaticParams & generateMetadata)
│   ├── course/[slug]/page.tsx           # Route alias đồng bộ với courses/[slug]
│   ├── shop/                            # Trang danh sách sản phẩm / khóa học mua lẻ
│   │   └── [slug]/page.tsx              # Trang chi tiết sản phẩm (Đã có generateStaticParams & generateMetadata)
│   ├── contact/                         # Trang liên hệ
│   ├── resources/                       # Trang tài nguyên & thư viện hình ảnh
│   ├── about-us/                        # Trang giới thiệu
│   ├── page.tsx                         # Trang chủ
│   ├── layout.tsx                       # Root Layout (Metadata tối giản, metadataBase động)
│   ├── sitemap.ts                       # Dynamic XML Sitemap sinh tự động từ WordPress
│   └── robots.ts                        # Dynamic robots.txt
│
├── components/
│   ├── common/
│   │   ├── WpContent.tsx                # Component chuẩn render nội dung Gutenberg HTML từ WP
│   │   └── HeaderText.tsx               # Component tiêu đề dùng chung
│   ├── home/                            # Toàn bộ components của Trang chủ
│   ├── course/                          # Components danh sách khóa học
│   ├── course-detail/                   # Components chi tiết khóa học
│   ├── layout/                          # Header, Footer, Navigation
│   └── sections/                        # CtaVisit, Banner sections...
│
├── lib/                                 # 🧠 TẦNG XỬ LÝ WORDPRESS & SEO
│   ├── wordpress.ts                     # Fetcher cốt lõi (fetchGraphQL, fetchWpRest, replaceWordpressURLs, Retry, Headers)
│   ├── wordpress-queries.ts             # Các hàm query sẵn (getWpCourses, getWpPosts, getWpPageBySlug, getWpSiteSettings, getWpMenu...)
│   ├── wordpress-seo.ts                 # Chuyển đổi Yoast / Rank Math SEO thành Next.js Metadata (generateWpMetadata, buildWpPageMetadata)
│   └── wordpress-format.ts              # Format tiền VND, ngày tháng, sanitize HTML (replaceH1WithH2, formatContentLinks, extractPlainTextExcerpt)
│
├── types/
│   └── wordpress.ts                     # TypeScript definitions (WPCourse, WPPost, WPPage, WPProduct, WPSeo, WPSiteSettings...)
│
└── styles/                              # CSS Modules tương ứng theo từng view và component
```

---

## 🛡️ 3. QUY TẮC BẤT DI BẤT DỊCH CHO MỌI AGENT

### 1. 🔒 Bảo mật biến môi trường (`.env`):
- `HN_API_SECRET` **TUYỆT ĐỐI KHÔNG ĐƯỢC CÓ TIỀN TỐ `NEXT_PUBLIC_`**. Biến này chỉ được đọc trong Server Components, Server Actions và Route Handlers (`src/app/api/`).
- Khách gửi form từ UI bắt buộc gọi qua Proxy `POST /api/contact`, không gọi thẳng sang WordPress.
- Không bao giờ hardcode domain thật trong `docker-compose.yml`, `layout.tsx`, hoặc `.env.example`.
- Không bao giờ commit file `.env.local` vào Git.

### 2. ⚡ Trang động & Static Site Generation (SSG):
- Mọi trang động `[slug]` **BẮT BUỘC** phải có:
  1. `generateStaticParams()`: Bọc trong `try/catch`, trả về `[]` nếu có lỗi để không làm sập build.
  2. `generateMetadata()`: Dùng `generateWpMetadata(data.seo, fallback)` từ `wordpress-seo.ts`.

### 3. 🌐 Giao tiếp WordPress & Cơ chế chống sập Build:
- Mọi request gửi sang WordPress dùng `fetchGraphQL()` hoặc `fetchWpRest()` trong [`src/lib/wordpress.ts`](file:///d:/HOMENEST%20-%20QUESTX/huyadmin/Khoa-hoc-American/src/lib/wordpress.ts).
- Tự động đính kèm 4 headers xác thực: `Authorization: Bearer`, `x-api-key`, `x-graphql-secret`, `x-secret-key`.
- Khi `process.env.NEXT_PHASE === 'phase-production-build'`:
  - Có khoảng trễ 150ms giữa các request để bảo vệ MySQL của WordPress.
  - Nếu fetch thất bại sau khi retry 2 lần, tự động trả về `null` hoặc `[]` để `npm run build` không bao giờ bị crash.
- Tự động chuyển đổi toàn bộ URL domain WordPress backend thành Frontend Next.js qua `replaceWordpressURLs()`.

### 4. 📝 Render nội dung Gutenberg & Chuẩn SEO:
- Khi render nội dung HTML từ WordPress (`post.content`, `course.content`, `page.content`), luôn dùng component:
  ```tsx
  import WpContent from '@/components/common/WpContent';
  
  <WpContent html={post.content} />
  ```
- Component này tự động chuyển đổi các thẻ `<h1>` bên trong bài viết thành `<h2>` (`replaceH1WithH2`) và gắn `target="_blank" rel="noopener noreferrer"` cho các link ngoài (`formatContentLinks`).

### 5. 🐳 Docker & Tối ưu hóa hệ thống:
- `next.config.ts`: Bắt buộc giữ `output: 'standalone'`, `cpus: 1`, `staticGenerationMaxConcurrency: 1` để nhường CPU/RAM cho aaPanel/VPS lúc build.
- `Dockerfile` & `docker-compose.yml`: Luôn có `NODE_OPTIONS="--dns-result-order=ipv4first"` (tránh treo kết nối IPv6) và chạy container dưới non-root user `nextjs:nodejs` (UID 1001).

---

## 🛠️ 4. HƯỚNG DẪN GỌI VÀ SỬ DỤNG DỮ LIỆU WORDPRESS MẪU

### Lấy danh sách khóa học:
```tsx
import { getWpCourses } from '@/lib/wordpress-queries';

export default async function CoursesPage() {
  const courses = await getWpCourses(20);
  return (
    <div>
      {courses.map(course => (
        <div key={course.id}>
          <h2>{course.title}</h2>
          <p>{course.courseFields?.price}</p>
        </div>
      ))}
    </div>
  );
}
```

### Lấy chi tiết bài viết / khóa học kèm SEO:
```tsx
import { getWpCourseBySlug, getWpCourses } from '@/lib/wordpress-queries';
import { generateWpMetadata } from '@/lib/wordpress-seo';
import WpContent from '@/components/common/WpContent';

export async function generateStaticParams() {
  try {
    const courses = await getWpCourses(50);
    return courses.map(c => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getWpCourseBySlug(slug);
  return generateWpMetadata(course?.seo, {
    title: course?.title,
    description: course?.excerpt,
    url: `/courses/${slug}`,
  });
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getWpCourseBySlug(slug);
  if (!course) return <div>Khóa học không tồn tại</div>;

  return (
    <main>
      <h1>{course.title}</h1>
      <WpContent html={course.content} />
    </main>
  );
}
```

### Gửi Form đăng ký từ Client Component:
```tsx
'use client';
import { useState } from 'react';

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = {
      name: 'Nguyen Van A',
      phone: '0901234567',
      email: 'a@gmail.com',
      course: 'Hydra Facial',
      message: 'Tôi muốn tư vấn khóa học',
    };

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const result = await res.json();
    setLoading(false);
    if (result.success) alert('Gửi đăng ký thành công!');
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

---

## 🎯 5. TRẠNG THÁI HIỆN TẠI & BƯỚC TIẾP THEO (NEXT STEPS)

- [x] Đã cấu hình và kiểm thử thành công kết nối WordPress Headless.
- [x] Đã thiết lập Webhook ISR Revalidate `/api/revalidate` và Form Proxy `/api/contact`.
- [x] Đã cấu hình `generateStaticParams()` và `generateMetadata()` trên dynamic routes.
- [x] Đã tối ưu Dockerfile multi-stage standalone & Docker Compose chuẩn HomeNest.
- [x] Nhánh `huy` đã được đồng bộ 100% với `origin/main` và không có lỗi TypeScript (`npx tsc --noEmit` đạt 0 lỗi).
- [ ] **Việc tiếp theo**: Kết nối dữ liệu động từ các hàm trong `src/lib/wordpress-queries.ts` vào các component hiển thị chi tiết (như Hero, Curriculum, Benefits) hoặc trang danh sách nếu phía backend đã cập nhật dữ liệu.
