import { Metadata } from 'next';
import ShopPageContent from './ShopPageContent';

export const metadata: Metadata = {
    title: 'Shop | Course America',
    description: 'Mua khóa học tại Course America',
};

export default function ShopPage() {
    return (
        <main>
            <ShopPageContent />
        </main>
    );
}