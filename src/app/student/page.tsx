import { cookies } from 'next/headers';
import ProgressAndCertificate from '@/components/dashboard/home/ProgressAndCertificate';
import MyCourses from '@/components/dashboard/home/MyCourses';
import LearningResources from '@/components/dashboard/home/LearningResources';
import { getWpUserEnrolledCourses, getWpPosts } from '@/lib/wordpress-queries';

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

    const completedCookie = cookieStore.get('hn_completed_courses')?.value;
    let completedSlugs: string[] = [];
    if (completedCookie) {
        try {
            completedSlugs = JSON.parse(decodeURIComponent(completedCookie));
        } catch {
            try {
                completedSlugs = JSON.parse(completedCookie);
            } catch {
                completedSlugs = [];
            }
        }
    }

    // 🎓 Lấy danh sách khóa học và tài nguyên thực tế từ WordPress Headless
    const [enrolledCourses, wpPosts] = await Promise.all([
        getWpUserEnrolledCourses({
            userId: user?.id,
            userEmail: user?.email,
            enrolledSlugs,
        }),
        getWpPosts(4),
    ]);

    // 📜 Chỉ cấp chứng chỉ khi học viên đã thực sự hoàn thành khóa học
    const completedCertificates = enrolledCourses
        .filter((c) => {
            const prog = Number(c.progress ?? c.courseFields?.progress ?? 0);
            const isWpCompleted = Boolean(c.isCompleted) || prog >= 100 || c.status === 'completed' || c.status === 'finished' || c.graduation === 'passed' || c.graduation === 'completed';
            const isCookieCompleted = completedSlugs.includes(String(c.slug)) || completedSlugs.includes(String(c.id));
            return isWpCompleted || isCookieCompleted;
        })
        .map((c, idx) => ({
            id: `cert-${c.id || c.slug || idx}`,
            type: 'CERTIFICATE',
            title: `Certification ${c.title}`,
            issuedDate: c.completedDate
                ? new Date(c.completedDate).toLocaleDateString('en-GB')
                : (c.date ? new Date(c.date).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB')),
        }));

    const dynamicResources = wpPosts.map((p) => ({
        id: String(p.id || p.slug),
        image: p.featuredImage?.node?.sourceUrl || '/images/gallery/image-1.jpg',
        title: p.title,
        description: p.excerpt ? p.excerpt.replace(/<[^>]*>/g, '').trim() : 'Tài nguyên và cẩm nang kiến thức chuyên sâu.',
        author: {
            name: p.author?.node?.name || 'Couture Beauty Academy',
            avatar: p.author?.node?.avatar?.url || '/images/thomas-nguyen.png',
            date: p.date ? new Date(p.date).toLocaleDateString('vi-VN') : 'Mới cập nhật',
        },
        category: 'cert',
    }));

    return (
        <div>
            <ProgressAndCertificate
                enrolledCourses={enrolledCourses}
                certificates={completedCertificates}
            />
            <MyCourses
                courses={enrolledCourses}
                title="My Courses"
                tag="COURSES"
            />
            <LearningResources resources={dynamicResources} />
        </div>
    );
}