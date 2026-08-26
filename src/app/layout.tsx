import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CtaVisit } from '@/components/sections/CtaVisit';

export const metadata: Metadata = {
  title: 'Khoa-hoc-American',
  description: 'Website khóa học giáo dục chuẩn American',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'none',
      'max-snippet': -1,
    },
  },
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
