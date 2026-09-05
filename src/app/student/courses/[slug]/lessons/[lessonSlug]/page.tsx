import type { Metadata } from "next";
import LessonDetailContent from "@/components/dashboard/courses/LessonDetailContent";
import { getWpCourses, getWpCourseBySlug, getWpLessonBySlug } from "@/lib/wordpress-queries";
import { generateWpMetadata } from "@/lib/wordpress-seo";

import { toSlug } from "@/lib/wordpress-format";

export async function generateStaticParams() {
    try {
        const courses = await getWpCourses(50);
        const params: Array<{ slug: string; lessonSlug: string }> = [];
        courses.forEach((c) => {
            const sections = c.sections || [];
            sections.forEach((sec) => {
                const items = sec.items || [];
                items.forEach((it, idx) => {
                    const itemTitle = it.title || `Lesson ${idx + 1}`;
                    const itemSlug = it.slug || toSlug(itemTitle) || String(it.id || `lesson-${idx + 1}`);
                    params.push({
                        slug: c.slug,
                        lessonSlug: itemSlug,
                    });
                    if (it.id && String(it.id) !== itemSlug) {
                        params.push({
                            slug: c.slug,
                            lessonSlug: String(it.id),
                        });
                    }
                });
            });
            params.push({ slug: c.slug, lessonSlug: "lesson-1" });
        });
        return params.length > 0 ? params : [{ slug: "hydra-facial", lessonSlug: "lesson-1" }];
    } catch {
        return [{ slug: "hydra-facial", lessonSlug: "lesson-1" }];
    }
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string; lessonSlug: string }>;
}): Promise<Metadata> {
    const { slug, lessonSlug } = await params;
    const course = await getWpCourseBySlug(slug);
    const lesson = await getWpLessonBySlug(lessonSlug, course);

    const lessonTitle = lesson?.title || `Bài học ${lessonSlug}`;
    const courseTitle = course?.title || 'Couture Beauty Academy';

    return generateWpMetadata(lesson?.seo || course?.seo, {
        title: `${lessonTitle} - ${courseTitle}`,
        description: lesson?.excerpt || course?.excerpt,
        image: lesson?.featuredImage?.node?.sourceUrl || course?.featuredImage?.node?.sourceUrl,
        url: `/student/courses/${slug}/lessons/${lessonSlug}`,
    });
}

export default async function StudentLessonPage({
    params,
}: {
    params: Promise<{ slug: string; lessonSlug: string }>;
}) {
    const { slug, lessonSlug } = await params;
    const course = await getWpCourseBySlug(slug);
    const lesson = await getWpLessonBySlug(lessonSlug, course);

    return (
        <LessonDetailContent
            course={course}
            lesson={lesson}
            slug={slug}
            lessonSlug={lessonSlug}
            isStudent={true}
        />
    );
}


