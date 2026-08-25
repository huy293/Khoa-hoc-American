import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '70vh',
      textAlign: 'center',
      padding: '40px 20px',
      fontFamily: 'var(--font-sans)',
    }}>
      <h1 style={{ fontSize: '48px', color: '#191713', marginBottom: '16px' }}>404</h1>
      <p style={{ fontSize: '18px', color: '#4A453D', marginBottom: '24px' }}>
        Trang bạn tìm kiếm không tồn tại.
      </p>
      <Link
        href="/"
        style={{
          padding: '12px 28px',
          backgroundColor: '#BC7300',
          color: '#FFFFFF',
          borderRadius: '8px',
          fontWeight: 600,
          textDecoration: 'none',
        }}
      >
        Trở về trang chủ
      </Link>
    </div>
  );
}
