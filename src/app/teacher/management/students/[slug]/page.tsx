import React from 'react';
import ManagamentHeaderDetails from '@/components/teacher/management/ManagamentHeaderDetails';
import TablePayment from '@/components/dashboard/payment-history/TablePayment';
import { getWpCourseBySlug, getWpCourses } from '@/lib/wordpress-queries';

export async function generateStaticParams() {
    try {
        const courses = await getWpCourses(50);
        return courses.map((c) => ({ slug: c.slug }));
    } catch {
        return [{ slug: 'hydra-facial' }];
    }
}

export default async function StudentDetailsPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const course = await getWpCourseBySlug(slug);

    const title = course?.title ? course.title.toUpperCase() : 'CHI TIẾT TIẾN ĐỘ HỌC VIÊN';
    const description = course?.excerpt?.replace(/<[^>]*>/g, '').trim() || course?.courseFields?.subtitle || 'Theo dõi chi tiết tiến độ học tập, nộp bài tập và điểm thi của từng học viên trong khóa học.';
    const trainerObj = course?.courseFields?.trainer;
    const trainerName = trainerObj?.name || course?.courseFields?.instructor || (course as any)?.author?.name || 'American Master Trainer';
    const trainerAvatar = trainerObj?.avatar || (course as any)?.author?.avatar || '/images/kathleen.png';
    const trainerRating = trainerObj?.rating || course?.courseFields?.rating || (course?.rating ? `${course.rating}/5.0` : '5.0/5.0');

    return (
        <section style={{ padding: '36px 60px 48px', backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1670px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '40px' }}>
                {/* 1. Header Details: Back button, Title, Description & Trainer info */}
                <ManagamentHeaderDetails
                    title={title}
                    description={description}
                    backHref="/teacher/management/students"
                    trainer={{
                        name: trainerName,
                        avatar: trainerAvatar,
                        rating: trainerRating,
                    }}
                    showTrainer
                    showTrainerRating
                    showBackButton
                    backAriaLabel="Back to students management"
                />

                {/* 2. Students Progress Table (6 columns matching screenshot) */}
                <TablePayment
                    variant="students"
                    col1Title="NAME STUDENT"
                    col2Title="PROGRESS"
                    col3Title="CURRENT LESSON"
                    col4Title="ASSIGNMENTS"
                    col5Title="LAST ACTIVE"
                    col6Title="QUIZ AVG."
                />
            </div>
        </section>
    );
}

