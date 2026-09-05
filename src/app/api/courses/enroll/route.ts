import { NextRequest, NextResponse } from 'next/server';

/**
 * 🎓 Proxy API Xử lý Đăng Ký (Enroll) Khóa Học với LearnPress Headless
 * Bảo mật: Chỉ Server mới đọc HN_API_SECRET và gửi request sang WordPress
 */
export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get('hn_user_session');

    // 1. Kiểm tra xác thực đăng nhập của học viên
    if (!sessionCookie || !sessionCookie.value) {
      return NextResponse.json(
        {
          success: false,
          requireLogin: true,
          message: 'Vui lòng đăng nhập để tham gia khóa học.',
        },
        { status: 401 }
      );
    }

    let user: any = null;
    try {
      user = JSON.parse(decodeURIComponent(sessionCookie.value));
    } catch {
      try {
        user = JSON.parse(sessionCookie.value);
      } catch {
        return NextResponse.json(
          {
            success: false,
            requireLogin: true,
            message: 'Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.',
          },
          { status: 401 }
        );
      }
    }

    const body = await req.json().catch(() => ({}));
    const { courseId, courseSlug } = body || {};

    if (!courseId && !courseSlug) {
      return NextResponse.json(
        { success: false, message: 'Thiếu thông tin khóa học.' },
        { status: 400 }
      );
    }

    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://course-amc.homenest.edu.vn';
    const secret = process.env.HN_API_SECRET || '';

    // 2. Gửi request Enroll sang WordPress LearnPress Headless API
    const enrollEndpoints = [
      '/wp-json/lp/v1/courses/enroll-course',
      '/wp-json/learnpress/v1/courses/enroll',
    ];

    let enrollSuccess = false;
    let redirectDataUrl = '';

    for (const ep of enrollEndpoints) {
      try {
        const wpRes = await fetch(`${wpUrl}${ep}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-secret-key': secret,
            'x-api-key': secret,
            'Authorization': `Bearer ${secret}`,
          },
          body: JSON.stringify({
            id: courseId,
            course_id: courseId,
            user_id: user.id || user.userId,
            user_email: user.email,
          }),
          cache: 'no-store',
        });

        const wpData = await wpRes.json().catch(() => null);

        if (wpRes.ok && (wpData?.status === 'success' || wpData?.success || wpData?.data)) {
          enrollSuccess = true;
          redirectDataUrl = wpData?.data?.redirect || '';
          break;
        }
      } catch (err) {
        console.warn(`LearnPress enroll attempt on ${ep} failed:`, err);
      }
    }

    // 3. Cập nhật danh sách khóa học đã đăng ký trong cookie hn_enrolled_courses
    const existingEnrolledCookie = req.cookies.get('hn_enrolled_courses')?.value;
    let enrolledList: string[] = [];
    if (existingEnrolledCookie) {
      try {
        enrolledList = JSON.parse(decodeURIComponent(existingEnrolledCookie));
      } catch {
        enrolledList = [];
      }
    }

    const targetSlug = String(courseSlug || courseId);
    if (!enrolledList.includes(targetSlug)) {
      enrolledList.push(targetSlug);
    }
    if (courseId && !enrolledList.includes(String(courseId))) {
      enrolledList.push(String(courseId));
    }

    const finalRedirect = `/student/courses/${targetSlug}`;

    const response = NextResponse.json({
      success: true,
      message: 'Đăng ký khóa học thành công!',
      redirectUrl: finalRedirect,
      wpRedirect: redirectDataUrl || undefined,
    });

    response.cookies.set('hn_enrolled_courses', JSON.stringify(enrolledList), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 ngày
    });

    return response;
  } catch (error: any) {
    console.error('Error during course enrollment:', error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Đã có lỗi xảy ra trong quá trình đăng ký khóa học.',
      },
      { status: 500 }
    );
  }
}
