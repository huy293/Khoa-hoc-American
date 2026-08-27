import React from 'react';
import type { Metadata } from 'next';
import CourseDetailHero from '@/components/course-detail/CourseDetailHero';
import AboutCourse from '@/components/course-detail/AboutCourse';
import TrainingCurriculum from '@/components/course-detail/TrainingCurriculum';
import CourseBenefits from '@/components/course-detail/CourseBenefits';

export const metadata: Metadata = {
    title: 'HYDRA FACIAL - Couture Beauty Academy',
    description:
        'Master professional HydraFacial techniques through theory, hands-on practice, live-model training, and advanced treatment protocols.',
};

export default function CourseDetailPage() {
    return (
        <main>
            <CourseDetailHero />
            <AboutCourse />
            <TrainingCurriculum />
            <CourseBenefits />
        </main>
    );
}
