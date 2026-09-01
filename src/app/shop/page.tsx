import { Metadata } from 'next';
import ShopPageContent from './ShopPageContent';
import { getWpPageBySlug, getWpProducts } from '@/lib/wordpress-queries';
import { generateWpMetadata } from '@/lib/wordpress-seo';
import { WPShopFields } from '@/types/wordpress';

export async function generateMetadata(): Promise<Metadata> {
    const page = await getWpPageBySlug<WPShopFields>('shop');
    return generateWpMetadata(page?.seo, {
        title: page?.title || 'Shop - Professional Cosmetics & Equipment | Couture Beauty Academy',
        description: 'Explore and purchase professional cosmetics, skincare solutions, and PMU equipment.',
        url: '/shop',
    });
}

export default async function ShopPage() {
    const [page, products] = await Promise.all([
        getWpPageBySlug<WPShopFields>('shop'),
        getWpProducts(50),
    ]);

    const scf = (page?.scf || page?.acf || {}) as any;

    return (
        <main>
            <ShopPageContent initialProducts={products} bannerData={scf} />
        </main>
    );
}