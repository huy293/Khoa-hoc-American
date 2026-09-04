'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div style={{ padding: '80px 20px', textAlign: 'center' }}>
      <h2 style={{ color: '#8A7043', marginBottom: '16px' }}>Đã xảy ra lỗi hệ thống</h2>
      <p style={{ color: '#666', marginBottom: '24px' }}>Vui lòng thử tải lại trang.</p>
      <button
        onClick={() => reset()}
        style={{
          padding: '12px 24px',
          backgroundColor: '#8A7043',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 600,
        }}
      >
        Thử lại
      </button>
    </div>
  );
}
