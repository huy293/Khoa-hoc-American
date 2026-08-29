import { Metadata } from 'next';
import CourseHero from '@/components/course/CourseHero';
import CourseSelection from '@/components/course/CourseSelection';
import PeopleSection from '@/components/about-us/PeopleSection';
import Partner from '@/components/home/Partner';

export const metadata: Metadata = {
    title: 'Professional Facial And Skincare Course - Couture Beauty Academy',
    description:
        'Train hands-on with certified beauty professionals who bring years of real-world experience, advanced techniques, and personalized guidance into every class.',
};

export default function CoursePage() {
    return (
        <main>
            <CourseHero />
            <PeopleSection />
            <Partner />
            <CourseSelection />
        </main>
    );
}
