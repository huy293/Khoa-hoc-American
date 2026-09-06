import { NextRequest, NextResponse } from 'next/server';
import { finishWpCourse, getWpCourseBySlug } from '@/lib/wordpress-queries';

/**
 * 🎓 POST /api/courses/complete
 * API Đánh dấu Hoàn thành Khóa học trong LearnPress Headless & cấp chứng chỉ
 */
export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get('hn_user_session')?.value;
    let user: any = null;
    if (sessionCookie) {
      try {
        user = JSON.parse(decodeURIComponent(sessionCookie));
      } catch {
        try {
          user = JSON.parse(sessionCookie);
        } catch {
          user = null;
        }
      }
    }

    const body = await req.json().catch(() => ({}));
    const { courseId, courseSlug } = body || {};

    if (!courseId && !courseSlug) {
      return NextResponse.json(
        { success: false, message: 'Thiếu thông tin khóa học (courseId hoặc courseSlug).' },
        { status: 400 }
      );
    }

    let effectiveCourseId = Number(courseId) || 0;
    if (!effectiveCourseId && courseSlug) {
      try {
        const cData = await getWpCourseBySlug(courseSlug);
        if (cData?.id) {
          effectiveCourseId = Number(cData.id);
        }
      } catch {
        // ignore
      }
    }

    // 1. Gửi lệnh hoàn thành khóa học sang WordPress LearnPress
    try {
      await finishWpCourse(effectiveCourseId, {
        userId: user?.id,
        userEmail: user?.email,
        courseSlug,
      });
    } catch (err) {
      console.warn('Lỗi gọi finishWpCourse sang WordPress:', err);
    }

    // 2. Cập nhật danh sách khóa học hoàn thành vào cookie hn_completed_courses
    const existingCompletedCookie = req.cookies.get('hn_completed_courses')?.value;
    let completedList: string[] = [];
    if (existingCompletedCookie) {
      try {
        completedList = JSON.parse(decodeURIComponent(existingCompletedCookie));
      } catch {
        try {
          completedList = JSON.parse(existingCompletedCookie);
        } catch {
          completedList = [];
        }
      }
    }

    const targetSlug = String(courseSlug || courseId);
    if (targetSlug && !completedList.includes(targetSlug)) {
      completedList.push(targetSlug);
    }
    if (courseId && !completedList.includes(String(courseId))) {
      completedList.push(String(courseId));
    }

    // 3. Đảm bảo khóa học cũng nằm trong hn_enrolled_courses
    const existingEnrolledCookie = req.cookies.get('hn_enrolled_courses')?.value;
    let enrolledList: string[] = [];
    if (existingEnrolledCookie) {
      try {
        enrolledList = JSON.parse(decodeURIComponent(existingEnrolledCookie));
      } catch {
        try {
          enrolledList = JSON.parse(existingEnrolledCookie);
        } catch {
          enrolledList = [];
        }
      }
    }
    if (targetSlug && !enrolledList.includes(targetSlug)) {
      enrolledList.push(targetSlug);
    }

    const response = NextResponse.json({
      success: true,
      message: 'Chúc mừng bạn đã hoàn thành khóa học và được cấp chứng chỉ!',
      certificateUrl: '/student/certificate',
      courseSlug: targetSlug,
    });

    response.cookies.set('hn_completed_courses', JSON.stringify(completedList), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 năm
    });

    response.cookies.set('hn_enrolled_courses', JSON.stringify(enrolledList), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    });

    return response;
  } catch (error: any) {
    console.error('Lỗi khi hoàn thành khóa học:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Có lỗi xảy ra khi hoàn thành khóa học.' },
      { status: 500 }
    );
  }
}
