import { Metadata } from 'next';
import CourseHero from '@/components/course/CourseHero';
import CourseSelection from '@/components/course/CourseSelection';
import OurImpact from '@/components/home/OurImpact';
import PeopleSection from '@/components/about-us/PeopleSection';
import Partner from '@/components/home/Partner';
import { CtaVisit } from '@/components/sections/CtaVisit';
import { getWpCourses, getWpPageBySlug, getWpCourseCategories } from '@/lib/wordpress-queries';
import { generateWpMetadata } from '@/lib/wordpress-seo';
import { WPCoursesFields } from '@/types/wordpress';

export async function generateMetadata(): Promise<Metadata> {
    const page = await getWpPageBySlug<WPCoursesFields>('courses');
    return generateWpMetadata(page?.seo, {
        title: page?.title || 'Professional Facial And Skincare Course - Couture Beauty Academy',
        description: 'Train hands-on with certified beauty professionals who bring years of real-world experience, advanced techniques, and personalized guidance into every class.',
        url: '/courses',
    });
}

export default async function CoursePage() {
    const [page, courses, categories] = await Promise.all([
        getWpPageBySlug<WPCoursesFields>('courses'),
        getWpCourses(30),
        getWpCourseCategories(),
    ]);

    const scf = (page?.scf || page?.acf || {}) as any;

    const impactCounters = scf.impact_counters && Array.isArray(scf.impact_counters)
        ? scf.impact_counters.map((c: any) => ({
            number: c.number || '',
            scriptText: c.script_text || '',
            label: c.label || '',
        }))
        : undefined;

    return (
        <main>
            <CourseHero data={scf} />
            <OurImpact
                eyebrow={scf.impact_eyebrow || "CREDIBILITY"}
                title={scf.impact_title ? (
                    <span dangerouslySetInnerHTML={{ __html: scf.impact_title }} />
                ) : (
                    <>
                        Years of professional experience, <br />
                        certified expertise.
                    </>
                )}
                description={scf.impact_desc || "One campus in Houston. Every lesson begins on this floor."}
                linkText={scf.impact_link_text || "ABOUT MENTORS"}
                linkUrl={scf.impact_link_url || "/about-us"}
                counters={impactCounters}
            />
            <PeopleSection data={scf} />
            <Partner logos={scf.partner_logos} />
            <CourseSelection
                eyebrow={scf.selection_eyebrow}
                title={scf.selection_title}
                courses={courses}
                categories={categories}
            />
            <CtaVisit />
        </main>
    );
}

