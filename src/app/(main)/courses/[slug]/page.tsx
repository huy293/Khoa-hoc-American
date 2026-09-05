import React from 'react';
import type { Metadata } from 'next';
import CourseDetailHero from '@/components/course-detail/CourseDetailHero';
import AboutCourse from '@/components/course-detail/AboutCourse';
import TrainingCurriculum from '@/components/course-detail/TrainingCurriculum';
import CourseBenefits from '@/components/course-detail/CourseBenefits';
import { CtaVisit } from '@/components/sections/CtaVisit';
import { getWpCourses, getWpCourseBySlug } from '@/lib/wordpress-queries';
import { generateWpMetadata, buildCourseSchema } from '@/lib/wordpress-seo';
import WpJsonLd from '@/components/common/WpJsonLd';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * ⚡ generateStaticParams: Tạo trước (Pre-render / SSG) các trang khóa học tĩnh lúc build
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
 * 🔍 generateMetadata: Tự động sinh thẻ Meta SEO động theo từng khóa học từ WordPress
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await getWpCourseBySlug(slug);

  if (!course) {
    return {
      title: 'Khóa học làm đẹp - Couture Beauty Academy',
      description: 'Chương trình đào tạo làm đẹp và chăm sóc da chuyên nghiệp chuẩn quốc tế.',
    };
  }

  return generateWpMetadata(course.seo, {
    title: `${course.title} - Couture Beauty Academy`,
    description: course.excerpt || 'Chương trình đào tạo thẩm mỹ và chăm sóc da chuyên nghiệp.',
    image: course.featuredImage?.node?.sourceUrl,
    url: `/courses/${slug}`,
  });
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const course = await getWpCourseBySlug(slug);
  const courseSchema = buildCourseSchema(course);
  
  return (
    <main>
      <WpJsonLd schema={courseSchema} />
      <CourseDetailHero courseSlug={slug} course={course} />
      <AboutCourse course={course} />
      <TrainingCurriculum course={course} />
      <CourseBenefits
        courseTitle={course?.title}
        benefits={(course?.courseFields as any)?.benefits}
      />
      <CtaVisit />
    </main>
  );
}
