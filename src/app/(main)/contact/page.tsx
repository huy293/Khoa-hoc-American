import { Metadata } from 'next';
import ContactContent from './ContactContent';
import { getWpPageBySlug } from '@/lib/wordpress-queries';
import { generateWpMetadata } from '@/lib/wordpress-seo';
import { WPContactFields } from '@/types/wordpress';

export async function generateMetadata(): Promise<Metadata> {
    const page = await getWpPageBySlug<WPContactFields>('contact');
    return generateWpMetadata(page?.seo, {
        title: page?.title || 'Contact | Couture Beauty Academy',
        description: 'Liên hệ với chúng tôi tại Couture Beauty Academy, 6441 Westheimer Rd, Houston, TX 77057.',
        url: '/contact',
    });
}

export default async function ContactPage() {
    const page = await getWpPageBySlug<WPContactFields>('contact');
    const scf = (page?.scf || page?.acf || {}) as any;

    return (
        <main>
            <ContactContent data={scf} />
        </main>
    );
}