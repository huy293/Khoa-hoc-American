import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import QuizTaking from '@/components/dashboard/courses/QuizTaking';
import { getWpCourses, getWpCourseBySlug, getWpQuizBySlug, getWpQuizById } from '@/lib/wordpress-queries';
import { generateWpMetadata } from '@/lib/wordpress-seo';
import { toSlug } from '@/lib/wordpress-format';
import { WPQuizDetail } from '@/types/wordpress';

const emptyQuiz: WPQuizDetail = {
    id: 0,
    title: 'Quiz - Kiểm tra kiến thức',
    content: '',
    duration_seconds: 1800,
    passing_grade: 80,
    questions_count: 0,
    questions: [],
};

export async function generateStaticParams() {
    try {
        const courses = await getWpCourses(50);
        const params: Array<{ slug: string; quizSlug: string }> = [];

        courses.forEach((c) => {
            // Mặc định luôn có slug cho quiz của từng khóa học
            params.push({
                slug: c.slug,
                quizSlug: 'quiz-1-introduction-to-hydrafacial-technology',
            });
            params.push({
                slug: c.slug,
                quizSlug: '2188',
            });

            // Nếu trong sections có items dạng quiz
            const sections = c.sections || [];
            sections.forEach((sec) => {
                const items = sec.items || [];
                items.forEach((it) => {
                    if ((it as any).quiz_id || (it as any).type === 'lp_quiz') {
                        const qSlug = it.slug || toSlug(it.title || '') || String(it.id);
                        params.push({
                            slug: c.slug,
                            quizSlug: qSlug,
                        });
                    }
                });
            });
        });

        return params.length > 0
            ? params
            : [{ slug: 'hydra-facial', quizSlug: 'quiz-1-introduction-to-hydrafacial-technology' }];
    } catch {
        return [{ slug: 'hydra-facial', quizSlug: 'quiz-1-introduction-to-hydrafacial-technology' }];
    }
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string; quizSlug: string }>;
}): Promise<Metadata> {
    const { slug, quizSlug } = await params;
    const course = await getWpCourseBySlug(slug);
    const quiz = await getWpQuizBySlug(quizSlug, slug);

    const quizTitle = quiz?.title || 'Quiz - Kiểm tra kiến thức';
    const courseTitle = course?.title || 'Couture Beauty Academy';

    return generateWpMetadata(quiz?.seo || course?.seo, {
        title: `${quizTitle} - ${courseTitle}`,
        description: quiz?.content || course?.excerpt || 'Bài kiểm tra trắc nghiệm lý thuyết và thực hành công nghệ làm đẹp chuẩn quốc tế.',
        url: `/courses/${slug}/quizzes/${quizSlug}`,
    });
}

export default async function CourseQuizDetailPage({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string; quizSlug: string }>;
    searchParams?: Promise<{ from?: string; lesson?: string }>;
}) {
    const { slug, quizSlug } = await params;
    const resolvedSearchParams = searchParams ? await searchParams : {};
    const course = await getWpCourseBySlug(slug);

    // Lấy thông tin user hiện tại từ cookie để kiểm tra quyền Retake
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('hn_user_session')?.value;
    let currentUserId: number | undefined;
    if (sessionCookie) {
        try {
            const parsed = JSON.parse(decodeURIComponent(sessionCookie));
            currentUserId = parsed?.id ? Number(parsed.id) : undefined;
        } catch {
            try {
                const parsed = JSON.parse(sessionCookie);
                currentUserId = parsed?.id ? Number(parsed.id) : undefined;
            } catch {
                // ignore
            }
        }
    }

    let quizData: WPQuizDetail = emptyQuiz;

    try {
        const fetchedQuiz = await getWpQuizBySlug(quizSlug, slug, currentUserId);
        if (fetchedQuiz && fetchedQuiz.questions && fetchedQuiz.questions.length > 0) {
            quizData = fetchedQuiz;
        } else {
            // Thử nạp fallback quiz 2188 nếu câu hỏi trống
            const defaultQuizFetched = await getWpQuizById(2188, currentUserId);
            if (defaultQuizFetched && defaultQuizFetched.questions && defaultQuizFetched.questions.length > 0) {
                quizData = defaultQuizFetched;
            }
        }
    } catch {
        // Sử dụng DEFAULT_QUIZ nếu có lỗi mạng
    }

    // Xác định nút Back: nếu có tham số `from` hoặc `lesson`, quay về bài học đó
    let backUrl = `/courses/${slug}`;
    if (resolvedSearchParams.from) {
        backUrl = resolvedSearchParams.from;
    } else if (resolvedSearchParams.lesson) {
        backUrl = `/courses/${slug}/lessons/${resolvedSearchParams.lesson}`;
    }

    return (
        <QuizTaking
            quiz={quizData}
            courseSlug={slug}
            courseId={course?.id}
            lessonSlug={resolvedSearchParams.lesson}
            backUrl={backUrl}
        />
    );
}
