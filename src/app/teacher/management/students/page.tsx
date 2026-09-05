import { Metadata } from 'next';
import ManagamentContent from '@/components/teacher/management/ManagamentContent';
import { getWpCourses, getWpTeacherStudents } from '@/lib/wordpress-queries';

export const metadata: Metadata = {
    title: 'Students Management | Couture Beauty Academy',
    description: 'Teach Better. Manage Smarter.',
};

export default async function StudentsManagementPage() {
    let courses = undefined;
    try {
        // Lấy danh sách khóa học để hiển thị trong tab filter
        const wpCourses = await getWpCourses(20);
        if (wpCourses && wpCourses.length > 0) {
            courses = wpCourses.map((c, idx) => {
                const categoriesList = Array.isArray(c.categories) ? c.categories : [];
                const firstCat = categoriesList[0] as any;
                const catSlug = firstCat?.slug || 'cert';
                let category: 'cert' | 'laser' | 'pmu' = 'cert';
                if (catSlug.includes('laser')) category = 'laser';
                else if (catSlug.includes('pmu')) category = 'pmu';

                return {
                    id: String(c.databaseId || c.id || idx),
                    title: c.title,
                    subtitle: c.excerpt || `Professional ${c.title} Training`,
                    image: c.featuredImage?.node?.sourceUrl || `/images/courses/card-hydra.jpg`,
                    rating: c.courseFields?.rating || '',
                    traineeCount: c.courseFields?.traineeCount || '',
                    progress: typeof c.progress === 'number' ? c.progress : 0,
                    modulesCount: c.sections?.length || (Array.isArray(c.courseFields?.curriculum) ? c.courseFields.curriculum.length : 0),
                    lessonsCount: parseInt(String(c.courseFields?.lessons || 0), 10) || 0,
                    quizzesCount: parseInt(String(c.courseFields?.quizzes || 0), 10) || 0,
                    studentsCount: Number((c as any).studentsCount || c.courseFields?.enrolledCount || 0),
                    tag: c.courseFields?.tag || 'CERTIFICATE',
                    classType: (idx % 2 === 0 ? 'online' : 'onsite') as 'online' | 'onsite',
                    category,
                    courseUrl: `/teacher/management/students/${c.slug}`,
                };
            });
        }
    } catch {
        // Fallback
    }

    return (
        <ManagamentContent
            courses={courses}
            showProgressInCourseCard={false}
            showTrainingProcessInCourseCard={false}
        />
    );
}

