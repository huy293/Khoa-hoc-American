import type { Metadata } from 'next';
import './globals.css';
import { Footer } from '@/components/layout/Footer';
import { CtaVisit } from '@/components/sections/CtaVisit';

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
      <body>
        {children}
        <CtaVisit />
        <Footer />
      </body>
    </html>
  );
}
