import { NextRequest, NextResponse } from 'next/server';
import { getWpQuizById } from '@/lib/wordpress-queries';
import { WPQuizDetail } from '@/types/wordpress';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const quizId = Number(id);

  if (!quizId) {
    return NextResponse.json(
      { success: false, message: 'ID bài thi không hợp lệ.' },
      { status: 400 }
    );
  }

  try {
    const wpQuiz = await getWpQuizById(quizId);
    if (wpQuiz) {
      return NextResponse.json({
        success: true,
        quiz: wpQuiz,
      });
    }
  } catch (error) {
    console.error('Không thể tải quiz từ WordPress:', error);
  }

  return NextResponse.json(
    {
      success: false,
      message: 'Không tìm thấy bài thi trên hệ thống WordPress.',
    },
    { status: 404 }
  );
}
