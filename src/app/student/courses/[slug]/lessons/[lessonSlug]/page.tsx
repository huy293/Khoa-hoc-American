import CourseDetailsIntro from "@/components/dashboard/courses/CourseDetailsIntro";
import LearningContent from "@/components/dashboard/courses/LearningContent";

export async function generateStaticParams() {
    return [
        { slug: 'hydra-facial', lessonSlug: 'lesson-1' },
    ];
}

export default async function StudentLessonPage({
    params,
}: {
    params: Promise<{ slug: string; lessonSlug: string }>;
}) {
    const { slug, lessonSlug } = await params;

    return (
        <>
            <CourseDetailsIntro />
            <LearningContent />
        </>
    );
}
