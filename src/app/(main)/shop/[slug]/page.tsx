import type { Metadata } from "next";
import ProductDetailContent from "./ProductDetailContent";
import { getWpProducts, getWpProductBySlug } from "@/lib/wordpress-queries";
import { generateWpMetadata, buildProductSchema } from "@/lib/wordpress-seo";
import WpJsonLd from "@/components/common/WpJsonLd";

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
        const products = await getWpProducts(50);
        return (products || []).map((product) => ({
            slug: product.slug,
        }));
    } catch {
        return [];
    }
}

/**
 * 🔍 generateMetadata: Tự động sinh SEO metadata cho từng sản phẩm từ Rank Math / WP
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const product = await getWpProductBySlug(slug);
    return generateWpMetadata(product?.seo, {
        title: product?.name ? `${product.name} | Couture Beauty Academy` : 'Couture Beauty Academy',
        description: product?.shortDescription || product?.description || `Chi tiết sản phẩm ${product?.name || slug}`,
        image: product?.image?.sourceUrl,
        url: `/shop/${slug}`,
    });
}

export default async function ProductDetailPage({ params }: PageProps) {
    const { slug } = await params;
    const product = await getWpProductBySlug(slug);
    const productSchema = buildProductSchema(product);
    const suggestedProducts = await getWpProducts(10);

    return (
        <main>
            <WpJsonLd schema={productSchema} />
            <ProductDetailContent
                slug={slug}
                initialProduct={product || undefined}
                suggestedProducts={suggestedProducts}
            />
        </main>
    );
}
