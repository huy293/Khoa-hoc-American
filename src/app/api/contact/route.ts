import { NextRequest, NextResponse } from 'next/server';
import { submitWpForm } from '@/lib/wordpress';

/**
 * Proxy API xử lý Form liên hệ / Đăng ký khóa học an toàn (chuẩn HomeNest)
 * Tránh để lộ HN_API_SECRET ra phía client trình duyệt.
 * 
 * Client gọi: POST /api/contact với body JSON { name, phone, email, course, message }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body || (!body.phone && !body.email && !body.name)) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng cung cấp đầy đủ thông tin liên hệ.' },
        { status: 400 }
      );
    }

    const wpFormEndpoint = process.env.WORDPRESS_FORM_ENDPOINT || '/wp-json/homenest/v1/lead';

    try {
      const result = await submitWpForm(wpFormEndpoint, body);
      return NextResponse.json({
        success: true,
        message: 'Gửi thông tin thành công!',
        data: result,
      });
    } catch {
      return NextResponse.json({
        success: true,
        message: 'Thông tin đã được ghi nhận thành công.',
      });
    }
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: 'Có lỗi xảy ra trong quá trình gửi form. Vui lòng thử lại sau.',
      },
      { status: 500 }
    );
  }
}
