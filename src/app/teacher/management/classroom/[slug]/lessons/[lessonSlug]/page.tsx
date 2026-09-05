import TablePayment from "@/components/dashboard/payment-history/TablePayment";
import ManagamentHeaderDetails from "@/components/teacher/management/ManagamentHeaderDetails";
import { getWpCourseBySlug, getWpLessonBySlug, getWpCourses } from "@/lib/wordpress-queries";

export async function generateStaticParams() {
    try {
        const courses = await getWpCourses(20);
        return courses.map((c) => ({
            slug: c.slug,
            lessonSlug: 'lesson-1',
        }));
    } catch {
        return [{ slug: 'hydra-facial', lessonSlug: 'lesson-1' }];
    }
}

export default async function LessonDetailsClassroomPage({
    params,
}: {
    params: Promise<{ slug: string; lessonSlug: string }>;
}) {
    const { slug, lessonSlug } = await params;
    const [course, lesson] = await Promise.all([
        getWpCourseBySlug(slug),
        getWpLessonBySlug(lessonSlug),
    ]);

    const title = lesson?.title ? `${course?.title ? course.title + ' - ' : ''}${lesson.title}` : "Module 01_lessons 01:";
    const description = lesson?.excerpt || course?.excerpt || "Learn the essential techniques behind professional deep cleansing and exfoliation. This lesson covers proper skin preparation, product application, handpiece control, and key safety considerations to help you perform the treatment with confidence and precision.";
    const trainerName = course?.courseFields?.instructor || "Kathleen trainer";

    return (
        <section style={{ padding: '36px 60px 48px', backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1670px', margin: '0 auto' }}>
                <ManagamentHeaderDetails
                    title={title}
                    description={description}
                    backHref={`/teacher/management/classroom/${slug}`}
                    trainer={{
                        name: trainerName,
                        avatar: course?.courseFields?.trainer?.avatar || '/images/kathleen.png',
                        rating: course?.courseFields?.trainer?.rating || course?.courseFields?.rating || '5.0/5.0',
                    }}
                    showTrainer
                    showTrainerRating
                    showBackButton
                    backAriaLabel="Back to classroom management"
                />
                <div style={{ marginTop: '40px' }}>
                    <TablePayment
                        variant="submission"
                        col1Title="NAME STUDENT"
                        col2Title="SUBMITTED AT"
                        col3Title="SCORE"
                        col4Title="ATTEMPTS"
                        col5Title="STATUS"
                    />
                </div>
            </div>
        </section>
    );
}