import { cookies } from 'next/headers';
import MyCourses from "@/components/dashboard/home/MyCourses";
import LearningResources from "@/components/dashboard/home/LearningResources";
import { getWpUserEnrolledCourses } from "@/lib/wordpress-queries";

export const dynamic = 'force-dynamic';

export default async function StudentCoursesPage() {
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

    const [enrolledCourses, wpPosts] = await Promise.all([
        getWpUserEnrolledCourses({
            userId: user?.id,
            userEmail: user?.email,
            enrolledSlugs,
        }),
        import('@/lib/wordpress-queries').then(m => m.getWpPosts(4)),
    ]);

    const dynamicResources = wpPosts.map((p) => ({
        id: String(p.id || p.slug),
        image: p.featuredImage?.node?.sourceUrl || '/images/gallery/image-1.jpg',
        title: p.title,
        description: p.excerpt ? p.excerpt.replace(/<[^>]*>/g, '').trim() : 'Tài liệu và cẩm nang kiến thức chuyên sâu.',
        author: {
            name: p.author?.node?.name || 'Couture Beauty Academy',
            avatar: p.author?.node?.avatar?.url || '/images/thomas-nguyen.png',
            date: p.date ? new Date(p.date).toLocaleDateString('vi-VN') : 'Mới cập nhật',
        },
        category: 'cert',
    }));

    return (
        <>
            <MyCourses
                tag="MY COURSES LIST"
                title="Khóa Học Của Tôi"
                search={true}
                seemore={false}
                limit={8}
                loadmore={true}
                courses={enrolledCourses}
            />
            <LearningResources
                tag='RESOURCES'
                title='Related Documents'
                filterTab={false}
                seemore={false}
                limit={4}
                resources={dynamicResources}
            />
        </>
    );
}
