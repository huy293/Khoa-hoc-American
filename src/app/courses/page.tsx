import { Metadata } from 'next';
import CourseHero from '@/components/course/CourseHero';
import CourseSelection from '@/components/course/CourseSelection';
import OurImpact from '@/components/home/OurImpact';
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
            <OurImpact
                eyebrow="CREDIBILITY"
                title={
                    <>
                        Years of professional experience, <br />
                        certified expertise.
                    </>
                }
                description="One campus in Houston. Every lesson begins on this floor."
                linkText="ABOUT MENTORS"
                linkUrl="/about-us"
                counters={[
                    {
                        number: "10+",
                        scriptText: "Experience",
                        label: "YEARS IN THE BEAUTY INDUSTRY",
                    },
                    {
                        number: "1.500+",
                        scriptText: "Students",
                        label: "TRAINED IN MASTERED WORKSHOPS",
                    },
                    {
                        number: "20+",
                        scriptText: "Certifications",
                        label: "PROFESSIONAL & INDUSTRY",
                    },
                    {
                        number: "95%",
                        scriptText: "Satisfaction",
                        label: "POSITIVE STUDENT FEEDBACK",
                    },
                ]}
            />
            <PeopleSection />
            <Partner />
            <CourseSelection />
        </main>
    );
}

