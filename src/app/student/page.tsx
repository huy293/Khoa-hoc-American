import { cookies } from 'next/headers';
import ProgressAndCertificate from '@/components/dashboard/home/ProgressAndCertificate';
import MyCourses from '@/components/dashboard/home/MyCourses';
import LearningResources from '@/components/dashboard/home/LearningResources';
import { getWpUserEnrolledCourses } from '@/lib/wordpress-queries';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('hn_user_session')?.value;
    const enrolledCookie = cookieStore.get('hn_enrolled_courses')?.value;

    let user: any = null;
    if (sessionCookie) {
        try {
            user = JSON.parse(decodeURIComponent(sessionCookie));
        } catch {
            try {
                user = JSON.parse(sessionCookie);
            } catch {
                user = null;
            }
        }
    }

    let enrolledSlugs: string[] = [];
    if (enrolledCookie) {
        try {
            enrolledSlugs = JSON.parse(decodeURIComponent(enrolledCookie));
        } catch {
            try {
                enrolledSlugs = JSON.parse(enrolledCookie);
            } catch {
                enrolledSlugs = [];
            }
        }
    }

    // 🎓 Lấy chính xác danh sách các khóa học mà học viên đã đăng ký trong LearnPress Headless WP
    const enrolledCourses = await getWpUserEnrolledCourses({
        userId: user?.id,
        userEmail: user?.email,
        enrolledSlugs,
    });

    return (
        <div>
            <ProgressAndCertificate />
            <MyCourses
                courses={enrolledCourses}
                title="My Courses"
                tag="COURSES"
            />
            <LearningResources />
        </div>
    );
}