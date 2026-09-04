import { Metadata } from 'next';
import SinglePostContent from '@/app/(main)/[slug]/SinglePostContent';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    try {
        const { slug } = await params;
        const url = `https://d9g6kccb-9001.asse.devtunnels.ms/wp-json/wp/v2/posts?slug=${slug}`;
        const res = await fetch(url, { next: { revalidate: 3600 } });
        if (!res.ok) throw new Error('Fetch failed');
        const data = await res.json();
        const post = data?.[0];

        return {
            title: post?.title?.rendered || 'Chi tiết bài viết | Couture Beauty Academy',
            description: post?.excerpt?.rendered || 'Couture Beauty Academy – Launch Your Beauty Career!',
        };
    } catch {
        return {
            title: 'Chi tiết bài viết | Couture Beauty Academy',
            description: 'Couture Beauty Academy – Launch Your Beauty Career!',
        };
    }
}

export default function PostPage() {
    return <SinglePostContent />;
}