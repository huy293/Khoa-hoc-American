import { Metadata } from 'next';
import ResourceContent from './ResourceContent';
import { getWpPageBySlug, getWpPosts } from '@/lib/wordpress-queries';
import { generateWpMetadata } from '@/lib/wordpress-seo';
import { WPResourcesFields } from '@/types/wordpress';

export async function generateMetadata(): Promise<Metadata> {
    const page = await getWpPageBySlug<WPResourcesFields>('resources');
    return generateWpMetadata(page?.seo, {
        title: page?.title || 'Resources | Couture Beauty Academy',
        description: 'Explore expert beauty insights, articles, and learning resources from Couture Beauty Academy.',
        url: '/resources',
    });
}

export default async function ResourcesPage() {
    const [page, posts] = await Promise.all([
        getWpPageBySlug<WPResourcesFields>('resources'),
        getWpPosts(20),
    ]);

    const scf = (page?.scf || page?.acf || {}) as any;

    return (
        <main>
            <ResourceContent initialPosts={posts} data={scf} />
        </main>
    );
}