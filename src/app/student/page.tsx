import ProgressAndCertificate from '@/components/dashboard/home/ProgressAndCertificate';
import MyCourses from '@/components/dashboard/home/MyCourses';
import LearningResources from '@/components/dashboard/home/LearningResources';
import { getWpCourses } from '@/lib/wordpress-queries';

export const revalidate = 3600;

export default async function DashboardPage() {
    const courses = await getWpCourses(20);

    return (
        <div>
            <ProgressAndCertificate />
            <MyCourses courses={courses} />
            <LearningResources />
        </div>
    );
}