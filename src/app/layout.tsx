import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Khoa-hoc-American',
  description: 'Website khóa học giáo dục chuẩn American',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
