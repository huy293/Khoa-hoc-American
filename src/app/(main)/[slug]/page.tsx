import { Metadata } from "next";
import SinglePostContent from "./SinglePostContent";
import { getWpPosts, getWpPostBySlug } from "@/lib/wordpress-queries";
import { generateWpMetadata } from "@/lib/wordpress-seo";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await getWpPostBySlug(slug);
    return generateWpMetadata(post?.seo, {
        title: `${post?.title || 'New Year - Grand Opening Courses 2026'} | Couture Beauty Academy`,
        description: post?.excerpt || "Couture Beauty Academy – Launch Your Beauty Career! Courses Now Open: Texas Esthetician License",
        url: `/${slug}`,
    });
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params;
    const post = await getWpPostBySlug(slug);
    return <SinglePostContent post={post} />;
}
