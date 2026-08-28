import { Metadata } from 'next';
import ResourceContent from './ResourceContent';

export const metadata: Metadata = {
    title: 'Resources | Course America',
    description: 'Mua khóa học tại Course America',
};

export default function ResourcesPage() {
    return (
        <main>
            <ResourceContent />
        </main>
    );
}