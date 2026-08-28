import type { Metadata } from "next";
import ProductDetailContent from "./ProductDetailContent";
import { getRestCustomPostType } from "@/lib/wordpress-queries";
import { WPProduct } from "@/types/wordpress";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

/**
 * ⚡ generateStaticParams: Tạo trước (Pre-render) danh sách sản phẩm lúc build
 */
export async function generateStaticParams() {
    try {
        const products = await getRestCustomPostType<WPProduct>("product", { per_page: 50 });
        return (products || []).map((product) => ({
            slug: product.slug,
        }));
    } catch {
        return [];
    }
}

/**
 * 🔍 generateMetadata: Tự động sinh SEO metadata cho từng sản phẩm
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    return {
        title: `Chi tiết sản phẩm - ${slug} | Couture Beauty Academy`,
        description: `Thông tin và thông số chi tiết sản phẩm ${slug}`,
    };
}

export default async function ProductDetailPage({ params }: PageProps) {
    const { slug } = await params;

    return <ProductDetailContent slug={slug} />;
}
