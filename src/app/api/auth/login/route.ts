import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy API Xử lý Đăng Nhập & Phân Luồng Role (Student vs Teacher)
 * Kết nối với WordPress Backend (Ultimate Member / WP Auth)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body || {};

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng nhập đầy đủ tên đăng nhập / email và mật khẩu.' },
        { status: 400 }
      );
    }

    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://course-amc.homenest.edu.vn';
    const secret = process.env.HN_API_SECRET || '';

    // Gửi request xác thực sang WordPress
    try {
      const res = await fetch(`${wpUrl}/wp-json/homenest/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-secret-key': secret,
        },
        body: JSON.stringify({ username, password }),
        cache: 'no-store',
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return NextResponse.json(
          {
            success: false,
            message: data.message || 'Tài khoản hoặc mật khẩu không chính xác.',
          },
          { status: res.status >= 400 ? res.status : 401 }
        );
      }

      // Xác thực thành công -> Lấy thông tin user và role
      const displayName = data.user?.displayName || username;
      const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=AF8861&color=ffffff&size=150&bold=true`;

      // Phân quyền 100% dựa vào Role thực tế từ WordPress Database, không check theo tên tài khoản
      const userRole = data.user?.role || 'student';
      const isTeacherRole =
        userRole === 'teacher' ||
        userRole === 'instructor' ||
        userRole === 'administrator';

      const user = {
        ...data.user,
        username: data.user?.username || username,
        displayName: displayName,
        role: isTeacherRole ? 'teacher' : userRole,
        avatar: data.user?.avatar || defaultAvatar,
      };

      const redirectUrl = isTeacherRole ? '/teacher' : '/student';

      const response = NextResponse.json({
        success: true,
        message: 'Đăng nhập thành công!',
        user,
        redirectUrl,
      });

      // Lưu cookie phiên đăng nhập
      response.cookies.set('hn_user_session', JSON.stringify(user), {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 ngày
      });

      return response;
    } catch (wpError) {
      console.error('WP Login error:', wpError);
      return NextResponse.json(
        { success: false, message: 'Không thể kết nối với máy chủ xác thực WordPress. Vui lòng kiểm tra lại kết nối.' },
        { status: 502 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Đã có lỗi xảy ra trong quá trình đăng nhập.' },
      { status: 500 }
    );
  }
}
