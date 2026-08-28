import React from 'react';
import { cleanWpContent } from '@/lib/wordpress-format';
import styles from '@/styles/common/WpContent.module.css';

interface WpContentProps {
  content?: string;
  className?: string;
}

/**
 * Component hiển thị nội dung HTML từ WordPress Gutenberg / Classic Editor
 * Tự động làm sạch link nội bộ, tối ưu responsive cho hình ảnh và video nhúng
 */
export default function WpContent({ content, className = '' }: WpContentProps) {
  if (!content) return null;

  const sanitizedContent = cleanWpContent(content);

  return (
    <div
      className={`${styles.wpContent} ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
}
