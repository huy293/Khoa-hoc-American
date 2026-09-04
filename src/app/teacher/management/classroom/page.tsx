import { Metadata } from 'next';
import ManagamentContent from '@/components/teacher/management/ManagamentContent';

export const metadata: Metadata = {
    title: 'Classroom Management | Couture Beauty Academy',
    description: 'Teach Better. Manage Smarter.',
};

export default function ClassroomManagementPage() {
    return <ManagamentContent />;
}
