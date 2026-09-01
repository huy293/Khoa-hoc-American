import { Metadata } from 'next';
import ResourceContent from './ResourceContent';
import { getWpPosts } from '@/lib/wordpress-queries';

export const metadata: Metadata = {
    title: 'Resources | Couture Beauty Academy',
    description: 'Explore expert beauty insights, articles, and learning resources from Couture Beauty Academy.',
};

export default async function ResourcesPage() {
    const posts = await getWpPosts(20);

    return (
        <main>
            <ResourceContent initialPosts={posts} />
        </main>
    );
}