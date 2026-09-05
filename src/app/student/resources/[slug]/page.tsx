import { Metadata } from 'next';
import SinglePostContent from '@/app/(main)/[slug]/SinglePostContent';
import { getWpPostBySlug, getWpPosts } from '@/lib/wordpress-queries';
import { generateWpMetadata } from '@/lib/wordpress-seo';

export async function generateStaticParams() {
    try {
        const posts = await getWpPosts(50);
        return (posts || []).map((post) => ({
            slug: post.slug,
        }));
    } catch {
        return [];
    }
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const post = await getWpPostBySlug(slug);

    return generateWpMetadata(post?.seo, {
        title: `${post?.title || 'Tài nguyên học tập'} | Couture Beauty Academy`,
        description: post?.excerpt || 'Couture Beauty Academy – Launch Your Beauty Career!',
        url: `/student/resources/${slug}`,
    });
}

export default async function PostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const post = await getWpPostBySlug(slug);
    return <SinglePostContent post={post} />;
}