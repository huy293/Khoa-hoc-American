import type { Metadata } from "next";
import ProductDetailContent from "./ProductDetailContent";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    return {
        title: `Product - ${slug}`,
        description: `Chi tiết sản phẩm ${slug}`,
    };
}

export default async function ProductDetailPage({ params }: PageProps) {
    const { slug } = await params;

    return <ProductDetailContent slug={slug} />;
}
