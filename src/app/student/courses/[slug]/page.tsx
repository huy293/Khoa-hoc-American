import type { Metadata } from "next";
import CourseDetailsContent from "./CourseDetailsContent";
import { getWpCourses, getWpCourseBySlug } from "@/lib/wordpress-queries";
import { generateWpMetadata } from "@/lib/wordpress-seo";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

/**
 * ⚡ generateStaticParams: Pre-render static student course pages at build time
 */
export async function generateStaticParams() {
    try {
        const courses = await getWpCourses(50);
        return courses.map((course) => ({
            slug: course.slug,
        }));
    } catch {
        return [];
    }
}

/**
 * 🔍 generateMetadata: SEO metadata for student course learning portal
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const course = await getWpCourseBySlug(slug);

    if (!course) {
        return {
            title: "Khóa học - Chi tiết đào tạo | Couture Beauty Academy",
            description: "Chương trình đào tạo làm đẹp và chăm sóc da chuyên nghiệp.",
        };
    }

    return generateWpMetadata(course.seo, {
        title: `${course.title} - Nội dung học tập | Couture Beauty Academy`,
        description: course.excerpt || "Khóa học đào tạo chuyên nghiệp tại Couture Beauty Academy.",
        image: course.featuredImage?.node?.sourceUrl,
        url: `/student/courses/${slug}`,
    });
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params;
    const course = await getWpCourseBySlug(slug);

    return <CourseDetailsContent course={course} slug={slug} />;
}