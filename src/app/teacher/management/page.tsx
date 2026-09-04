import { Metadata } from 'next';
import ManagamentContent from '@/components/teacher/management/ManagamentContent';

export const metadata: Metadata = {
    title: 'Management | Couture Beauty Academy',
    description: 'Teach Better. Manage Smarter.',
};

export default function ManagementPage() {
    return <ManagamentContent />;
}
