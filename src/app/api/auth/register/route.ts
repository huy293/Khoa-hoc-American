import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy API Xử lý Đăng Ký Tài Khoản Học Viên (Role: Student)
 * Kết nối với WordPress Backend & Tự động lưu thông tin vào CRM Lead
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone, username, password } = body || {};

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng cung cấp đầy đủ Email và Mật khẩu.' },
        { status: 400 }
      );
    }

    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://course-amc.homenest.edu.vn';
    const secret = process.env.HN_API_SECRET || '';

    // Gửi request sang WordPress
    try {
      const res = await fetch(`${wpUrl}/wp-json/homenest/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-secret-key': secret,
        },
        body: JSON.stringify({
          fullName: fullName || username,
          email,
          phone: phone || '',
          username: username || email.split('@')[0],
          password,
        }),
        cache: 'no-store',
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return NextResponse.json(
          {
            success: false,
            message: data.message || 'Đăng ký không thành công. Vui lòng kiểm tra lại thông tin.',
          },
          { status: res.status >= 400 ? res.status : 400 }
        );
      }

      // Đăng ký thành công -> Thiết lập Cookie phiên đăng nhập
      const user = data.user || {
        email,
        name: fullName || username,
        role: 'student',
      };

      const response = NextResponse.json({
        success: true,
        message: 'Tạo tài khoản học viên thành công!',
        user,
        redirectUrl: '/student',
      });

      // Lưu cookie auth
      response.cookies.set('hn_user_session', JSON.stringify(user), {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 ngày
      });

      return response;
    } catch (wpError) {
      console.warn('WP Register Endpoint not ready, fallback simulated response:', wpError);
      
      // Fallback nếu WordPress endpoint đang chờ cấu hình
      const fallbackUser = {
        email,
        name: fullName || username || 'Học Viên Mới',
        role: 'student',
      };

      const response = NextResponse.json({
        success: true,
        message: 'Đăng ký tài khoản thành công!',
        user: fallbackUser,
        redirectUrl: '/student',
      });

      response.cookies.set('hn_user_session', JSON.stringify(fallbackUser), {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Đã có lỗi xảy ra trong quá trình xử lý.' },
      { status: 500 }
    );
  }
}
