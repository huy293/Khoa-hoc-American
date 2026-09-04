import { Metadata } from 'next';
import ManagamentContent from '@/components/teacher/management/ManagamentContent';

export const metadata: Metadata = {
    title: 'Students Management | Couture Beauty Academy',
    description: 'Teach Better. Manage Smarter.',
};

export default function StudentsManagementPage() {
    return (
        <ManagamentContent
            showProgressInCourseCard={false}
            showTrainingProcessInCourseCard={false}
        />
    );
}
