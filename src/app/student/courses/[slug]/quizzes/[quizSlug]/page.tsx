import type { Metadata } from 'next';
import QuizTaking from '@/components/dashboard/courses/QuizTaking';
import { getWpCourses, getWpCourseBySlug, getWpQuizBySlug, getWpQuizById } from '@/lib/wordpress-queries';
import { generateWpMetadata } from '@/lib/wordpress-seo';
import { toSlug } from '@/lib/wordpress-format';
import { WPQuizDetail } from '@/types/wordpress';

// Bộ dữ liệu quiz chuẩn dự phòng
const DEFAULT_QUIZ: WPQuizDetail = {
    id: 2188,
    title: 'QUIZZ 01: INTRODUCTION TO HYDRAFACIAL TECHNOLOGY',
    content:
        'Learn the essential techniques behind professional deep cleansing and exfoliation. This lesson covers proper skin preparation, product application, handpiece control, and key safety considerations to help you perform the treatment with confidence and precision.',
    duration_seconds: 1800,
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

    let quizData: WPQuizDetail = DEFAULT_QUIZ;

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
