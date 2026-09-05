import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import QuizTaking from '@/components/dashboard/courses/QuizTaking';
import { getWpCourses, getWpCourseBySlug, getWpLessonBySlug, getWpQuizById } from '@/lib/wordpress-queries';
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
        const params: Array<{ slug: string; lessonSlug: string }> = [];
        courses.forEach((c) => {
            const sections = c.sections || [];
            sections.forEach((sec) => {
                const items = sec.items || [];
                items.forEach((it, idx) => {
                    const itemTitle = it.title || `Lesson ${idx + 1}`;
                    const itemSlug = it.slug || toSlug(itemTitle) || String(it.id || `lesson-${idx + 1}`);
                    params.push({
                        slug: c.slug,
                        lessonSlug: itemSlug,
                    });
                });
            });
            params.push({ slug: c.slug, lessonSlug: 'lesson-1' });
        });
        return params.length > 0 ? params : [{ slug: 'hydra-facial', lessonSlug: 'lesson-1' }];
    } catch {
        return [{ slug: 'hydra-facial', lessonSlug: 'lesson-1' }];
    }
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string; lessonSlug: string }>;
}): Promise<Metadata> {
    const { slug, lessonSlug } = await params;
    const course = await getWpCourseBySlug(slug);
    const lesson = await getWpLessonBySlug(lessonSlug, course);

    const quizTitle = lesson?.quiz?.title || 'Quiz - Kiểm tra kiến thức';
    const courseTitle = course?.title || 'Couture Beauty Academy';

    return generateWpMetadata(lesson?.seo || course?.seo, {
        title: `${quizTitle} - ${courseTitle}`,
        description: 'Bài kiểm tra trắc nghiệm lý thuyết và thực hành công nghệ chăm sóc da chuẩn quốc tế.',
        url: `/student/courses/${slug}/lessons/${lessonSlug}/quiz`,
    });
}

export default async function StudentQuizPage({
    params,
}: {
    params: Promise<{ slug: string; lessonSlug: string }>;
}) {
    const { slug, lessonSlug } = await params;
    const course = await getWpCourseBySlug(slug);
    const lesson = await getWpLessonBySlug(lessonSlug, course);

    const embeddedQuiz = lesson?.quiz ?? null;
    let quizSlug = 'quiz-1-introduction-to-hydrafacial-technology';
    if (embeddedQuiz?.slug) {
        quizSlug = embeddedQuiz.slug;
    } else if (embeddedQuiz?.permalink) {
        const cleanPerm = embeddedQuiz.permalink.replace(/\/+$/, '');
        const seg = cleanPerm.split('/').pop();
        if (seg) quizSlug = seg;
    } else if (embeddedQuiz?.title) {
        quizSlug = toSlug(embeddedQuiz.title);
    } else if (lesson?.quiz_id || embeddedQuiz?.id) {
        quizSlug = String(lesson?.quiz_id || embeddedQuiz?.id);
    }

    redirect(`/student/courses/${slug}/quizzes/${quizSlug}?from=${encodeURIComponent(`/student/courses/${slug}/lessons/${lessonSlug}`)}&lesson=${lessonSlug}`);
}

