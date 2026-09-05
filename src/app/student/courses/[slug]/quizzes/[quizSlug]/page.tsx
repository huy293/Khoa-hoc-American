import type { Metadata } from 'next';
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
            params.push({
                slug: c.slug,
                quizSlug: 'quiz-1-introduction-to-hydrafacial-technology',
            });
            params.push({
                slug: c.slug,
                quizSlug: '2188',
            });

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
        url: `/student/courses/${slug}/quizzes/${quizSlug}`,
    });
}

export default async function StudentQuizDetailPage({
    params,
    searchParams,
}: {
    params: Promise<{ slug: string; quizSlug: string }>;
    searchParams?: Promise<{ from?: string; lesson?: string }>;
}) {
    const { slug, quizSlug } = await params;
    const resolvedSearchParams = searchParams ? await searchParams : {};
    const course = await getWpCourseBySlug(slug);

    let quizData: WPQuizDetail = emptyQuiz;

    try {
        const fetchedQuiz = await getWpQuizBySlug(quizSlug, slug);
        if (fetchedQuiz && fetchedQuiz.questions && fetchedQuiz.questions.length > 0) {
            quizData = fetchedQuiz;
        } else {
            const defaultQuizFetched = await getWpQuizById(2188);
            if (defaultQuizFetched && defaultQuizFetched.questions && defaultQuizFetched.questions.length > 0) {
                quizData = defaultQuizFetched;
            }
        }
    } catch {
        // Fallback
    }

    // Xác định backUrl: quay về đúng bài học trong student dashboard
    let backUrl = `/student/courses/${slug}`;
    if (resolvedSearchParams.from) {
        backUrl = resolvedSearchParams.from;
    } else if (resolvedSearchParams.lesson) {
        backUrl = `/student/courses/${slug}/lessons/${resolvedSearchParams.lesson}`;
    }

    return (
        <QuizTaking
            quiz={quizData}
            courseSlug={slug}
            lessonSlug={resolvedSearchParams.lesson}
            backUrl={backUrl}
        />
    );
}
