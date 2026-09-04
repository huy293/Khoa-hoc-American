'use client';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="vi">
      <body style={{ margin: 0, fontFamily: 'sans-serif', backgroundColor: '#FDFBF7' }}>
        <div style={{ padding: '80px 20px', textAlign: 'center' }}>
          <h2 style={{ color: '#8A7043', marginBottom: '16px' }}>Đã xảy ra sự cố nghiêm trọng</h2>
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
            Tải lại ứng dụng
          </button>
        </div>
      </body>
    </html>
  );
}
