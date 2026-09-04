import { Metadata } from 'next';
import AboutUsContent from './AboutUsContent';
import { CtaVisit } from '@/components/sections/CtaVisit';
import { getWpPageBySlug } from '@/lib/wordpress-queries';
import { generateWpMetadata } from '@/lib/wordpress-seo';
import { WPAboutFields } from '@/types/wordpress';

export async function generateMetadata(): Promise<Metadata> {
    const page = await getWpPageBySlug<WPAboutFields>('about');
    return generateWpMetadata(page?.seo, {
        title: page?.title || 'About Us | Couture Beauty Academy',
        description: 'Tìm hiểu thêm về chúng tôi, sứ mệnh và đội ngũ phát triển tại Houston, Texas.',
        url: '/about-us',
    });
}

export default async function AboutUsPage() {
    const page = await getWpPageBySlug<WPAboutFields>('about');
    const scf = (page?.scf || page?.acf || {}) as any;

    return (
        <main>
            <AboutUsContent data={scf} />
            <CtaVisit />
        </main>
    );
}