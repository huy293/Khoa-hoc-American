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
    const body = await request.json().catch(() => ({}));
    const {
      answers = {},
      questionIds: requestedQuestionIds,
      userId,
      courseId,
      lessonId,
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
    const effectiveUserEmail = body?.userEmail || authUser?.email;

    if (typeof answers !== 'object') {
      return NextResponse.json(
        { success: false, message: 'Dữ liệu câu trả lời không hợp lệ.' },
        { status: 400 }
      );
    }

    // 1. Thử chấm điểm qua LearnPress WordPress REST API nếu có
    let scoredData: WPQuizSubmitResponse | null = null;
    try {
      const wpResult = await submitWpQuiz(quizId, answers, {
        userId: effectiveUserId ? Number(effectiveUserId) : undefined,
        courseId: courseId ? Number(courseId) : undefined,
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
        scoredData = wpResult;
      }
    } catch (wpErr) {
      console.warn('Lỗi kết nối submit WordPress, sử dụng cơ chế chấm điểm cục bộ:', wpErr);
    }

    // 2. Chấm điểm dự phòng đầy đủ nếu WordPress chưa hỗ trợ endpoint chấm điểm trực tiếp
    if (!scoredData) {
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

      scoredData = {
        success: true,
        quiz_id: quizId,
        score,
        passing_grade: passingGrade,
        passed,
        correct_count: correctCount,
        total_questions: totalQuestions,
        results,
      };
    }

    // 3. ĐỒNG BỘ VÀ LƯU CHÍNH THỨC VÀO LEARNPRESS TRÊN WORDPRESS
    // Đảm bảo dữ liệu xuất hiện đầy đủ trong NEXT_PUBLIC_WORDPRESS_URL/wp-admin/admin.php?page=lp-view-quiz-results
    // Chỉ đồng bộ khi có thông tin học viên hợp lệ (tránh tạo bản ghi rác user_id = 0)
    if (effectiveUserId || effectiveUserEmail) {
      try {
        const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://course-amc.homenest.edu.vn';
        const wpSecret = process.env.HN_API_SECRET || '';

        const syncPayload = {
          quizId,
          quizSlug: body?.quizSlug || '',
          courseId: courseId ? Number(courseId) : undefined,
          courseSlug: body?.courseSlug || '',
          userId: effectiveUserId ? Number(effectiveUserId) : undefined,
          userEmail: effectiveUserEmail || '',
          score: scoredData.score,
          question_correct: scoredData.correct_count,
          question_wrong: Math.max(0, scoredData.total_questions - scoredData.correct_count),
          question_empty: Math.max(0, scoredData.total_questions - Object.keys(answers).length),
          total_questions: scoredData.total_questions,
          time_spend: body?.timeSpend || '00:00',
          time_spent_seconds: body?.timeSpentSeconds || 0,
          start_time: body?.startTime || undefined,
          end_time: body?.endTime || undefined,
          graduation: scoredData.passed ? 'passed' : 'failed',
          status: 'completed',
          answers,
        };

        const wpSaveRes = await fetch(`${wpUrl}/wp-json/homenest/v1/quiz/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-secret-key': wpSecret,
            ...(wpSecret ? { Authorization: `Bearer ${wpSecret}` } : {}),
          },
          body: JSON.stringify(syncPayload),
        });

        if (wpSaveRes.ok) {
          const wpData = await wpSaveRes.json().catch(() => null);
          if (wpData?.user_item_id) {
            scoredData.user_item_id = wpData.user_item_id;
          }
          if (typeof wpData?.can_retake !== 'undefined') {
            scoredData.can_retake = Boolean(wpData.can_retake);
          }
          if (typeof wpData?.retake_count !== 'undefined') {
            scoredData.retake_count = Number(wpData.retake_count);
          }
          if (typeof wpData?.retakes_left !== 'undefined') {
            scoredData.retakes_left = Number(wpData.retakes_left);
          }
          if (typeof wpData?.attempts_count !== 'undefined') {
            scoredData.attempts_count = Number(wpData.attempts_count);
          }
          if (wpData?.time_spend) {
            scoredData.time_spend = wpData.time_spend;
          }
        } else {
          const errText = await wpSaveRes.text().catch(() => '');
          console.warn('[Quiz Submit] WordPress trả về lỗi khi lưu kết quả:', wpSaveRes.status, errText);
        }
      } catch (syncErr) {
        console.warn('[Quiz Submit] Không thể kết nối đồng bộ sang WordPress:', syncErr);
      }
    }

    if (!scoredData.time_spend && body?.timeSpend) {
      scoredData.time_spend = body.timeSpend;
    }

    // Mặc định: không có giá trị retake thì không cho phép học viên làm lại bài quiz
    if (typeof scoredData.can_retake === 'undefined') {
      scoredData.can_retake = false;
      scoredData.retake_count = 0;
      scoredData.retakes_left = 0;
    }

    return NextResponse.json(scoredData);
  } catch (error: any) {
    console.error('Lỗi xử lý nộp quiz:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Có lỗi xảy ra khi nộp bài.' },
      { status: 500 }
    );
  }
}

function currentMysqlTime(): string {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}
