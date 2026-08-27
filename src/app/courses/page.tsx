import { Metadata } from 'next';
import CourseHero from '@/components/course/CourseHero';
import CourseSelection from '@/components/course/CourseSelection';

export const metadata: Metadata = {
    title: 'Professional Facial And Skincare Course - Couture Beauty Academy',
    description:
        'Train hands-on with certified beauty professionals who bring years of real-world experience, advanced techniques, and personalized guidance into every class.',
};

export default function CoursePage() {
    return (
        <main>
            <CourseHero />
            <CourseSelection />
        </main>
    );
}
