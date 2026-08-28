import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CtaVisit } from '@/components/sections/CtaVisit';

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined,
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
        <Header />
        {children}
        <CtaVisit />
        <Footer />
      </body>
    </html>
  );
}
