import { NextResponse } from 'next/server';
import { getWpCourses } from '@/lib/wordpress-queries';

export const dynamic = 'force-dynamic';

/**
 * ⚡ GET /api/courses: Lấy danh sách khóa học LearnPress (lp_course) an toàn cho Client Components
 */
export async function GET() {
  try {
    const courses = await getWpCourses(50);
    return NextResponse.json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error('API /api/courses error:', error);
    return NextResponse.json(
      {
        success: false,
        courses: [],
        message: 'Không thể tải danh sách khóa học.',
      },
      { status: 500 }
    );
  }
}
