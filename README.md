# 🎓 Khoa-hoc-American — Frontend Project

Dự án website giáo dục / đào tạo **Khoa-hoc-American** được xây dựng trên nền tảng **Next.js (App Router)** và **TypeScript**, áp dụng kiến trúc module hóa UI kết hợp **CSS Modules** & **Design Tokens** thuần túy, mang lại hiệu năng cao, chuẩn SEO và khả năng mở rộng lâu dài.

---

## 📑 Mục lục
1. [Tech Stack](#-tech-stack)
2. [Cấu trúc thư mục (Project Structure)](#-cấu-trúc-thư-mục-project-structure)
3. [Quy chuẩn đặt tên (Naming Conventions)](#-quy-chuẩn-đặt-tên-naming-conventions)
4. [Quy tắc tổ chức & Viết CSS](#-quy-tắc-tổ-chức--viết-css)
5. [Quy chuẩn Code Component & Kiến trúc Clean](#-quy-chuẩn-code-component--kiến-trúc-clean)
6. [Quy trình làm việc với Git](#-quy-trình-làm-việc-với-git)
7. [Cài đặt và Chạy dự án](#-cài-đặt-và-chạy-dự-án)

---

## 🛠 Tech Stack

| Thành phần | Công nghệ | Ghi chú |
|---|---|---|
| **Framework** | Next.js 15+ / 16 (App Router) | Server Components by default, SSR/ISR tối ưu |
| **Thư viện UI** | React 19 | React Server & Client Components |
| **Ngôn ngữ** | TypeScript 5+ | Type-safety toàn bộ props, data models, API |
| **Styling** | CSS Modules + Global Tokens | Tách biệt scope, không xung đột class |
| **Slider / Carousel** | Swiper React | Dành cho banner, danh sách khóa học, feedback |
| **Icons** | Lucide React | Bộ icon vector tối ưu bundle size |

---

## 📂 Cấu trúc thư mục (Project Structure)

```text
Khoa-hoc-American/
├── public/                       # Nơi chứa ảnh, fonts, icons tĩnh khi có
│   ├── images/
│   └── fonts/
│
├── src/
│   ├── app/                      # Next.js App Router (Mỗi folder con = 1 Route URL)
│   │   ├── layout.tsx            # Root Layout khung cơ bản
│   │   ├── page.tsx              # Trang chủ khởi tạo
│   │   └── globals.css           # File CSS dùng chung (Reset & biến màu sau này)
│   │
│   ├── components/               # Chứa các component UI (Tạo khi có thiết kế)
│   │   ├── layout/               # Header, Footer, Menu...
│   │   └── common/               # Các nút bấm, thẻ, popup dùng chung...
│   │
│   ├── styles/                   # Chứa các file .module.css tương ứng theo component
│   │   ├── layout/
│   │   └── common/
│   │
│   ├── lib/                      # Hàm xử lý logic, fetch data, SEO (viết sau)
│   ├── types/                    # Khai báo TypeScript types / interfaces khi cần
│   └── utils/                    # Các hàm tiện ích dùng chung
│
├── .gitignore                    # Bỏ qua node_modules, .next, .env
├── next.config.ts                # Cấu hình Next.js cơ bản
├── package.json                  # Dependencies Next.js + React + TypeScript
├── tsconfig.json                 # Path alias @/* trỏ về src/*
└── README.md                     # Tài liệu quy chuẩn dự án
```

---

## 🏷 Quy chuẩn đặt tên (Naming Conventions)

### 1. File Component & thư mục
* **Component UI (`.tsx`)**: Đặt theo quy tắc **PascalCase** (VD: `CourseCard.tsx`, `HeroSection.tsx`, `Header.tsx`).
* **Next.js Special Files**: Giữ nguyên tên chuẩn chữ thường theo Next.js App Router (VD: `page.tsx`, `layout.tsx`, `not-found.tsx`, `error.tsx`, `loading.tsx`, `route.ts`).
* **Thư mục Route URL**: Đặt theo dạng **kebab-case** không dấu (VD: `khoa-hoc/`, `giang-vien/`, `tin-tuc/`, `lien-he/`).

### 2. File Style CSS
* Mỗi component có file CSS riêng đặt tên theo dạng: **`[TênComponent].module.css`** (VD: `Header.module.css`, `CourseCard.module.css`).
* Được lưu trữ tương ứng trong thư mục `src/styles/[feature]/`.

### 3. File Utility, Hook, Types
* **File tiện ích / API (`.ts`)**: Đặt theo quy tắc **camelCase** (VD: `formatters.ts`, `api.ts`, `seo.ts`).
* **Custom Hooks (`.ts`)**: Bắt đầu bằng tiền tố `use` theo **camelCase** (VD: `useScroll.ts`, `useWindowSize.ts`).
* **TypeScript Types / Interfaces (`.ts`)**: Tên file theo **camelCase**, tên interface/type theo **PascalCase** (VD: `course.ts` chứa `export interface ICourse { ... }`).

---

## 🎨 Quy tắc tổ chức & Viết CSS

### 1. Hệ thống Design Tokens (`src/app/globals.css`)
Mọi màu sắc, khoảng cách, font chữ và bo góc tuân thủ biến CSS toàn cục:
```css
:root {
  /* Colors */
  --color-primary: #0F3A5D;
  --color-secondary: #D32F2F;
  --color-accent: #F7A823;
  --color-dark: #1E293B;
  --color-body: #475569;
  --color-border: #E2E8F0;
  --color-bg-light: #F8FAFC;
  --color-white: #FFFFFF;

  /* Typography */
  --font-sans: system-ui, -apple-system, sans-serif;
  --container-width: 1240px;
}
```

### 2. Sử dụng CSS Modules
* **Không viết CSS inline bừa bãi** trong JSX (`style={{ ... }}`).
* Gọi class qua object `styles` để đảm bảo encapsulation:
```tsx
import styles from '@/styles/common/Button.module.css';

export default function Button({ label }: { label: string }) {
  return <button className={styles.btn}>{label}</button>;
}
```

---

## 🧱 Quy chuẩn Code Component & Kiến trúc Clean

### 1. Nguyên tắc DRY & Tái sử dụng Component
* **Kiểm tra trước khi tạo mới**: Luôn kiểm tra xem component/layout tương tự đã tồn tại trong `src/components/common/` chưa trước khi viết mới.
* **Đưa component dùng chung ra ngoài**: Nếu một UI component xuất hiện ở $\ge 2$ trang, **phải** đặt tại `src/components/common/`, không lưu trong folder riêng của từng trang.

### 2. Server Components vs Client Components
* Mặc định mọi component là **Server Component** (chạy tại server để render HTML tĩnh và tối ưu SEO).
* Chỉ thêm chỉ thị `'use client'` ở đầu file khi:
  * Cần tương tác người dùng (`onClick`, `onChange`, `onSubmit`).
  * Sử dụng React State hoặc Effects (`useState`, `useEffect`, `useContext`).
  * Sử dụng thư viện bên thứ 3 phía trình duyệt (như Swiper, Modal trigger).

### 3. An toàn Dữ liệu (Fallback Safe Check)
Khi lặp dữ liệu mảng, **luôn luôn kiểm tra mảng an toàn** để tránh lỗi 500 sập trang do `undefined` hoặc `null`:
```tsx
// ✅ Đúng: Luôn bọc Array.isArray
const list = Array.isArray(items) ? items : [];
list.map((item) => <div key={item.id}>{item.name}</div>);
```

---

## 🔄 Quy trình làm việc với Git (Bắt buộc)

### 1. Đầu giờ làm việc (Pull Code mới nhất)
```bash
# 1. Chuyển sang nhánh chính
git checkout main

# 2. Kéo code mới nhất từ remote
git pull origin main

# 3. Chuyển về nhánh làm việc cá nhân của bạn
git checkout feature/ten-nhanh-cua-ban

# 4. Gộp code mới từ main vào nhánh của bạn
git merge main
```

### 2. Cuối giờ làm việc (Commit & Push)
```bash
# 1. Thêm file vào staging
git add .

# 2. Commit với thông điệp rõ ràng (tuân theo Conventional Commits)
git commit -m "feat(layout): hoàn thiện khung layout Header và Footer"

# 3. Push lên nhánh cá nhân trên remote
git push origin feature/ten-nhanh-cua-ban
```

---

## 🚀 Cài đặt và Chạy dự án

```bash
# 1. Clone repository
git clone https://github.com/huy293/Khoa-hoc-American.git
cd Khoa-hoc-American

# 2. Cài đặt các gói thư viện
npm install

# 3. Chạy môi trường Development
npm run dev
# Mở trình duyệt tại: http://localhost:3000
```
