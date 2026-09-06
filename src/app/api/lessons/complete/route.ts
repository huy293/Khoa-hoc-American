import { NextRequest, NextResponse } from 'next/server';
import { completeWpLesson } from '@/lib/wordpress-queries';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      lessonId,
      lessonSlug,
      courseId,
      courseSlug,
      userId,
      userEmail,
    } = body || {};

    // Đọc thông tin người dùng từ Cookie phiên đăng nhập hn_user_session
    const sessionCookie = request.cookies.get('hn_user_session')?.value;
    let authUser: any = null;
    if (sessionCookie) {
      try {
        authUser = JSON.parse(decodeURIComponent(sessionCookie));
      } catch {
        try {
          authUser = JSON.parse(sessionCookie);
        } catch {
          authUser = null;
        }
      }
    }

    const effectiveUserId = userId || authUser?.id;
    const effectiveUserEmail = userEmail || authUser?.email;

    const result = await completeWpLesson(lessonId, courseId, {
      userId: effectiveUserId ? Number(effectiveUserId) : undefined,
      userEmail: effectiveUserEmail,
      courseSlug,
      lessonSlug,
    });

    return NextResponse.json({
      ...result,
      success: result.success ?? true,
    });
  } catch (error: any) {
    console.error('Lỗi khi hoàn thành bài học:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Lỗi server khi hoàn thành bài học.' },
      { status: 500 }
    );
  }
}
