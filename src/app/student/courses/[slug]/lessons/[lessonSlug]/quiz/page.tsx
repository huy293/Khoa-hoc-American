import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import QuizTaking from '@/components/dashboard/courses/QuizTaking';
import { getWpCourses, getWpCourseBySlug, getWpLessonBySlug, getWpQuizById } from '@/lib/wordpress-queries';
import { generateWpMetadata } from '@/lib/wordpress-seo';
import { toSlug } from '@/lib/wordpress-format';
import { WPQuizDetail } from '@/types/wordpress';

// Bộ dữ liệu quiz chuẩn fallback cho HydraFacial
const DEFAULT_QUIZ: WPQuizDetail = {
    id: 2188,
    title: 'QUIZZ 01: INTRODUCTION TO HYDRAFACIAL TECHNOLOGY',
    content:
        'Learn the essential techniques behind professional deep cleansing and exfoliation. This lesson covers proper skin preparation, product application, handpiece control, and key safety considerations to help you perform the treatment with confidence and precision.',
    duration_seconds: 1800, // 30:00
    passing_grade: 80,
    questions_count: 5,
    questions: [
        {
            id: 2201,
            title: 'WHAT IS THE MAIN PURPOSE OF THE CLEANSING AND EXFOLIATION STEP IN A HYDRAFACIAL TREATMENT?',
            content: '',
            type: 'single_choice',
            options: [
                { id: 'opt_1_a', title: 'Tighten facial muscles' },
                { id: 'opt_1_b', title: 'Remove dead skin cells and surface impurities' },
                { id: 'opt_1_c', title: 'Reduce facial movement' },
                { id: 'opt_1_d', title: 'Close the pores' },
            ],
        },
        {
            id: 2425,
            title: 'WHAT IS THE PRIMARY MECHANISM OF THE HYDRAFACIAL VORTEX-FUSION TECHNOLOGY?',
            content: '',
            type: 'single_choice',
            options: [
                { id: 'opt_2_a', title: 'High-frequency ultrasonic soundwaves' },
                { id: 'opt_2_b', title: 'Micro-focused electrical stimulation' },
                { id: 'opt_2_c', title: 'Spiral tip creating a vortex effect to dislodge impurities while infusing serums' },
                { id: 'opt_2_d', title: 'Thermal coagulation of epidermal layers' },
            ],
        },
        {
            id: 2428,
            title: 'WHICH ACID IS COMMONLY USED IN HYDRAFACIAL PEEL SOLUTIONS FOR GENTLE RESURFACING?',
            content: '',
            type: 'single_choice',
            options: [
                { id: 'opt_3_a', title: 'Trichloroacetic acid (TCA 35%)' },
                { id: 'opt_3_b', title: 'Glycolic and Salicylic Acid blend' },
                { id: 'opt_3_c', title: 'Pure Carbolic Acid (Phenol)' },
                { id: 'opt_3_d', title: 'Pure Hydrochloric Acid' },
            ],
        },
        {
            id: 2430,
            title: 'WHAT IS THE PRIMARY FUNCTION OF THE SKIN BARRIER (STRATUM CORNEUM) PROTECTED DURING TREATMENT?',
            content: '',
            type: 'single_choice',
            options: [
                { id: 'opt_4_a', title: 'Facilitating trans-epidermal water evaporation' },
                { id: 'opt_4_b', title: 'Protecting against pathogens, chemicals, and preventing excessive transepidermal water loss' },
                { id: 'opt_4_c', title: 'Generating melanin deposits rapidly' },
                { id: 'opt_4_d', title: 'Absorbing ultraviolet radiation entirely' },
            ],
        },
        {
            id: 2431,
            title: 'WHICH STEP IN THE HYDRAFACIAL PROTOCOL DELIVERS ANTIOXIDANTS, PEPTIDES, AND HYALURONIC ACID?',
            content: '',
            type: 'single_choice',
            options: [
                { id: 'opt_5_a', title: 'Vortex-Extraction' },
                { id: 'opt_5_b', title: 'Vortex-Exfoliation' },
                { id: 'opt_5_c', title: 'Vortex-Fusion / Protect & Infuse' },
                { id: 'opt_5_d', title: 'Acid Peel Application' },
            ],
        },
    ],
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

    redirect(`/courses/${slug}/quizzes/${quizSlug}?from=${encodeURIComponent(`/student/courses/${slug}/lessons/${lessonSlug}`)}&lesson=${lessonSlug}`);
}

