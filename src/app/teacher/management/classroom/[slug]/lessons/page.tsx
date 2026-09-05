import Link from 'next/link';
import { getWpCourseBySlug, getWpCourses } from '@/lib/wordpress-queries';
import ManagamentHeaderDetails from '@/components/teacher/management/ManagamentHeaderDetails';

export async function generateStaticParams() {
    try {
        const courses = await getWpCourses(20);
        return courses.map((c) => ({ slug: c.slug }));
    } catch {
        return [{ slug: 'hydra-facial' }];
    }
}

export default async function ClassroomLessonsPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const course = await getWpCourseBySlug(slug);

    const sections = course?.sections || course?.courseFields?.curriculum || [];
    const trainerName = course?.courseFields?.instructor || 'Kathleen trainer';

    return (
        <section style={{ padding: '36px 60px 48px', backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1670px', margin: '0 auto' }}>
                <ManagamentHeaderDetails
                    title={course?.title || 'Classroom Lessons'}
                    description={course?.excerpt || 'Manage lessons and track student submissions for this course.'}
                    backHref={`/teacher/management/classroom/${slug}`}
                    trainer={{
                        name: trainerName,
                        avatar: course?.courseFields?.trainer?.avatar || '/images/kathleen.png',
                        rating: course?.courseFields?.trainer?.rating || course?.courseFields?.rating || '5.0/5.0',
                    }}
                    showTrainer
                    showTrainerRating
                    showBackButton
                    backAriaLabel="Back to classroom"
                />

                <div style={{ marginTop: '40px' }}>
                    {sections.length > 0 ? (
                        sections.map((section: any, sIdx: number) => (
                            <div key={sIdx} style={{ marginBottom: '32px' }}>
                                <h3 style={{
                                    fontSize: '14px',
                                    fontWeight: 700,
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                    color: '#333',
                                    marginBottom: '12px',
                                    paddingBottom: '8px',
                                    borderBottom: '1px solid #E5E5E5',
                                }}>
                                    Module {sIdx + 1}: {section.title || `Section ${sIdx + 1}`}
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {(section.items || []).map((item: any, iIdx: number) => {
                                        const lessonSlug = item.slug || `lesson-${iIdx + 1}`;
                                        return (
                                            <Link
                                                key={iIdx}
                                                href={`/teacher/management/classroom/${slug}/lessons/${lessonSlug}`}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: '14px 20px',
                                                    backgroundColor: '#FAFAFA',
                                                    border: '1px solid #EBEBEB',
                                                    borderRadius: '8px',
                                                    textDecoration: 'none',
                                                    color: '#333',
                                                    transition: 'background 0.2s',
                                                }}
                                            >
                                                <span style={{ fontWeight: 600, fontSize: '13px' }}>
                                                    Lesson {iIdx + 1}: {item.title || `Lesson ${iIdx + 1}`}
                                                </span>
                                                <span style={{
                                                    fontSize: '11px',
                                                    color: '#AF8861',
                                                    fontWeight: 700,
                                                    letterSpacing: '0.06em',
                                                    textTransform: 'uppercase',
                                                }}>
                                                    View Submissions →
                                                </span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    ) : (
                        // Fallback khi chưa có lesson data từ WP
                        <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                            <p style={{ fontSize: '15px', marginBottom: '8px' }}>Chưa có bài học nào được thiết lập cho khóa học này.</p>
                            <p style={{ fontSize: '13px' }}>Vui lòng thêm bài học trong WordPress Admin → LearnPress.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
