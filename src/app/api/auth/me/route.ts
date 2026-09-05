import { NextRequest, NextResponse } from 'next/server';
import { WPAuthUser } from '@/types/wordpress';

/**
 * Sinh URL avatar mặc định dựa trên tên và tông màu thương hiệu Couture (#AF8861)
 */
function generateDefaultAvatar(name?: string): string {
  const cleanName = (name || 'User').trim();
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}&background=AF8861&color=ffffff&size=150&bold=true`;
}

/**
 * 👤 API Route: Lấy thông tin người dùng đang đăng nhập (Current User)
 * Đọc từ Cookie phiên đăng nhập 'hn_user_session' và đồng bộ avatar/profile mới nhất từ WordPress.
 */
export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get('hn_user_session');

    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json(
        { success: false, user: null, message: 'Chưa đăng nhập' },
        { status: 401 }
      );
    }

    let user: WPAuthUser | null = null;
    try {
      user = JSON.parse(decodeURIComponent(sessionCookie.value));
    } catch {
      try {
        user = JSON.parse(sessionCookie.value);
      } catch {
        return NextResponse.json(
          { success: false, user: null, message: 'Phiên đăng nhập không hợp lệ' },
          { status: 401 }
        );
      }
    }

    if (!user) {
      return NextResponse.json(
        { success: false, user: null, message: 'Không tìm thấy thông tin người dùng' },
        { status: 401 }
      );
    }

    const displayName = user.displayName || user.name || user.username || 'Học viên';

    // 1. Nếu cookie cũ chưa có avatar, cấp avatar dựa trên tên
    if (!user.avatar || user.avatar.trim() === '' || user.avatar.includes('kathleen')) {
      user.avatar = generateDefaultAvatar(displayName);
    }

    // 2. Thử đồng bộ avatar thực tế từ WordPress Headless (nếu backend đang chạy và có ID)
    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL;
    const secret = process.env.HN_API_SECRET;

    if (wpUrl && user.id && secret) {
      try {
        const wpRes = await fetch(`${wpUrl}/wp-json/homenest/v1/auth/me?userId=${user.id}`, {
          headers: {
            'Content-Type': 'application/json',
            'x-secret-key': secret,
          },
          next: { revalidate: 60 },
        });

        if (wpRes.ok) {
          const wpData = await wpRes.json();
          if (wpData?.success && wpData?.user) {
            const isTeacher =
              wpData.user.role === 'teacher' ||
              wpData.user.role === 'instructor' ||
              wpData.user.role === 'administrator' ||
              (user.username && (user.username.toLowerCase().includes('teacher') || user.username.toLowerCase().includes('giangvien')));

            user = {
              ...user,
              ...wpData.user,
              role: isTeacher ? 'teacher' : (wpData.user.role || 'student'),
              avatar: wpData.user.avatar || user.avatar,
            };
          }
        }
      } catch {
        // WordPress offline / chưa kết nối -> dùng avatar mặc định đã sinh
      }
    }

    const response = NextResponse.json({
      success: true,
      user,
    });

    // Cập nhật lại Cookie với đầy đủ thông tin avatar mới
    response.cookies.set('hn_user_session', JSON.stringify(user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, user: null, message: 'Lỗi server khi lấy thông tin người dùng' },
      { status: 500 }
    );
  }
}
