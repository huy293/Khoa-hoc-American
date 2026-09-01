import { Metadata } from 'next';
import ShopPageContent from './ShopPageContent';
import { getWpProducts } from '@/lib/wordpress-queries';

export const metadata: Metadata = {
    title: 'Shop - Professional Cosmetics & Equipment | Couture Beauty Academy',
    description: 'Explore and purchase professional cosmetics, skincare solutions, and PMU equipment.',
};

export default async function ShopPage() {
    const products = await getWpProducts(50);

    return (
        <main>
            <ShopPageContent initialProducts={products} />
        </main>
    );
}