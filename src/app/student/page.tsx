'use client';

import ProgressAndCertificate from '@/components/dashboard/home/ProgressAndCertificate';
import MyCourses from '@/components/dashboard/home/MyCourses';
import LearningResources from '@/components/dashboard/home/LearningResources';

export default function DashboardPage() {
    return (
        <div>
            <ProgressAndCertificate />
            <MyCourses />
            <LearningResources />
        </div>
    );
}