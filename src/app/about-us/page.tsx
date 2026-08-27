import { Metadata } from 'next';
import AboutUsContent from './AboutUsContent';

export const metadata: Metadata = {
    title: 'About Us | Course America',
    description: 'Tìm hiểu thêm về chúng tôi, sứ mệnh và đội ngũ phát triển.',
};

export default function AboutUsPage() {
    return (
        <main>
            <AboutUsContent />
        </main>
    );
}