import { NextRequest, NextResponse } from 'next/server';
import { submitWpQuiz } from '@/lib/wordpress-queries';
import { WPQuizSubmitResponse } from '@/types/wordpress';

// Bảng đáp án đúng mặc định cho toàn bộ 10 câu hỏi của HydraFacial Quiz
const ALL_QUIZ_QUESTION_IDS = [2201, 2425, 2426, 2427, 2428, 2429, 2430, 2431, 2432, 2433];

const FALLBACK_CORRECT_MAP: Record<number, { correctId: string; validIds: string[] }> = {
  2201: { correctId: 'opt_2201_b', validIds: ['opt_2201_b', 'opt_1_b', 'b', '1'] },
  2425: { correctId: 'opt_2425_c', validIds: ['opt_2425_c', 'opt_2_c', 'c', '2'] },
  2426: { correctId: 'opt_2426_b', validIds: ['opt_2426_b', 'opt_3_b', 'b', '1'] },
  2427: { correctId: 'opt_2427_b', validIds: ['opt_2427_b', 'opt_4_b', 'b', '1'] },
  2428: { correctId: 'opt_2428_c', validIds: ['opt_2428_c', 'opt_5_c', 'c', '2'] },
  2429: { correctId: 'opt_2429_c', validIds: ['opt_2429_c', 'opt_6_c', 'c', '2'] },
  2430: { correctId: 'opt_2430_b', validIds: ['opt_2430_b', 'opt_7_b', 'b', '1'] },
  2431: { correctId: 'opt_2431_b', validIds: ['opt_2431_b', 'opt_8_b', 'b', '1'] },
  2432: { correctId: 'opt_2432_b', validIds: ['opt_2432_b', 'opt_9_b', 'b', '1'] },
  2433: { correctId: 'opt_2433_b', validIds: ['opt_2433_b', 'opt_10_b', 'b', '1'] },
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const quizId = Number(id) || 2188;

  try {
    const body = await request.json();
    const { answers = {}, questionIds: requestedQuestionIds, userId, courseId, lessonId } = body || {};

    if (typeof answers !== 'object') {
      return NextResponse.json(
        { success: false, message: 'Dữ liệu câu trả lời không hợp lệ.' },
        { status: 400 }
      );
    }

    // 1. Thử chấm điểm qua LearnPress WordPress REST API
    try {
      const wpResult = await submitWpQuiz(quizId, answers, {
        userId,
        courseId,
        lessonId,
      });
      if (wpResult && wpResult.success && Array.isArray(wpResult.results) && wpResult.results.length > 0) {
        const allIds: number[] = Array.isArray(requestedQuestionIds) && requestedQuestionIds.length > 0
          ? requestedQuestionIds.map(Number)
          : ALL_QUIZ_QUESTION_IDS;

        // Nếu WordPress chỉ trả về những câu học viên đã chọn, bổ sung các câu chưa chọn vào bảng kết quả
        if (wpResult.results.length < allIds.length) {
          const existingIds = new Set(wpResult.results.map((r) => Number(r.question_id)));
          allIds.forEach((id) => {
            if (!existingIds.has(id)) {
              const correctConfig = FALLBACK_CORRECT_MAP[id];
              wpResult.results.push({
                question_id: id,
                selected_answer_id: '',
                correct_answer_id: correctConfig ? correctConfig.correctId : '',
                is_correct: false,
              });
            }
          });
          wpResult.total_questions = allIds.length;
          wpResult.score = Math.round((wpResult.correct_count / allIds.length) * 100);
          wpResult.passed = wpResult.score >= (wpResult.passing_grade || 80);
        }

        return NextResponse.json(wpResult);
      }
    } catch (wpErr) {
      console.warn('Lỗi kết nối submit WordPress, sử dụng cơ chế chấm điểm cục bộ:', wpErr);
    }

    // 2. Fallback: Chấm điểm đầy đủ cho toàn bộ câu hỏi của bài quiz
    const questionIdsToGrade: number[] = Array.isArray(requestedQuestionIds) && requestedQuestionIds.length > 0
      ? requestedQuestionIds.map(Number)
      : (Object.keys(answers).length > 0
        ? Array.from(new Set([...Object.keys(answers).map(Number), ...ALL_QUIZ_QUESTION_IDS]))
        : ALL_QUIZ_QUESTION_IDS);

    const totalQuestions = questionIdsToGrade.length || 10;
    let correctCount = 0;

    const results = questionIdsToGrade.map((qId) => {
      const selected = String(answers[qId] || '');
      const correctConfig = FALLBACK_CORRECT_MAP[qId];
      const correctId = correctConfig ? correctConfig.correctId : '';
      const isCorrect = Boolean(
        selected &&
        correctConfig &&
        correctConfig.validIds.some((v) => v.toLowerCase() === selected.toLowerCase())
      );
      if (isCorrect) correctCount++;

      return {
        question_id: qId,
        selected_answer_id: selected,
        correct_answer_id: correctId,
        is_correct: isCorrect,
      };
    });

    const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passingGrade = 80;
    const passed = score >= passingGrade;

    const responseData: WPQuizSubmitResponse = {
      success: true,
      quiz_id: quizId,
      score,
      passing_grade: passingGrade,
      passed,
      correct_count: correctCount,
      total_questions: totalQuestions,
      results,
    };

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error('Lỗi xử lý nộp quiz:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Có lỗi xảy ra khi nộp bài.' },
      { status: 500 }
    );
  }
}
