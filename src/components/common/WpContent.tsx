import React from 'react';
import { cleanWpContent } from '@/lib/wordpress-format';
import styles from '@/styles/common/WpContent.module.css';

interface WpContentProps {
  content?: string;
  html?: string;
  className?: string;
}

/**
 * Component hiển thị nội dung HTML từ WordPress Gutenberg / Classic Editor
 * Tự động làm sạch link nội bộ, tối ưu responsive cho hình ảnh và video nhúng
 */
export default function WpContent({ content, html, className = '' }: WpContentProps) {
  const rawHtml = html || content;
  if (!rawHtml) return null;

  const sanitizedContent = cleanWpContent(rawHtml);

  return (
    <div
      className={`${styles.wpContent} ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}
