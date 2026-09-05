import ClassroomDetailsIntro from '@/components/teacher/management/classroom/ClassroomDetailsIntro';
import LearningContent from '@/components/dashboard/courses/LearningContent';
import ResourcesContent from '@/app/teacher/resources/ResourcesContent';
import { getWpCourseBySlug, getWpCourses } from '@/lib/wordpress-queries';

export async function generateStaticParams() {
    try {
        const courses = await getWpCourses(50);
        return courses.map((c) => ({ slug: c.slug }));
    } catch {
        return [];
    }
}

export default async function ClassRoomDetailsPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const course = await getWpCourseBySlug(slug);

    const cf = (course?.courseFields || {}) as any;

    return (
        <>
            <ClassroomDetailsIntro
                title={course?.title || 'Classroom Details'}
                description={course?.excerpt ? course.excerpt.replace(/<[^>]*>/g, '').trim() : ''}
                trainerName={cf.trainer?.name}
                trainerAvatar={cf.trainer?.avatar}
                trainerRating={cf.trainer?.rating}
                learningProgress={cf.progress || 0}
            />
            <LearningContent course={course} columnEnd="progress" />
            <ResourcesContent ShowTab={false} styleSearch="style2" limit={4} />
        </>
    );
}
