'use client';

import React from "react";
import MyCertificationList, { CertificateItem } from "@/components/dashboard/certificate/MyCertificationList";
import CourseCatalogList, { CatalogCourseItem } from "@/components/dashboard/certificate/CourseCatalogList";
import { useAuthUser } from "@/lib/auth-client";
import { WPCourse } from "@/types/wordpress";

interface CertificateContentProps {
    user?: any;
    enrolledCourses?: WPCourse[];
    allCourses?: WPCourse[];
}

export default function CertificateContent({
    user: initialUser,
    enrolledCourses = [],
    allCourses = [],
}: CertificateContentProps) {
    const { user: clientUser, displayName } = useAuthUser();
    const activeUser = clientUser || initialUser;
    const studentName = displayName || activeUser?.displayName || activeUser?.name || 'Học viên';

    // Build dynamic certificates from enrolled courses (or from allCourses if newly registered)
    const baseCourses = enrolledCourses.length > 0 ? enrolledCourses : allCourses.slice(0, 3);
    const dynamicCertificates: CertificateItem[] = baseCourses.map((course: any, idx: number) => {
        const catSlug = (course.categories?.[0]?.slug || course.categories?.nodes?.[0]?.slug || '').toLowerCase();
        const courseTitleLower = (course.title || '').toLowerCase();
        let category: 'cert' | 'laser' | 'pmu' | 'all' = 'cert';
        if (catSlug.includes('laser') || courseTitleLower.includes('laser')) {
            category = 'laser';
        } else if (catSlug.includes('pmu') || courseTitleLower.includes('pmu')) {
            category = 'pmu';
        }

        return {
            id: `cert-${course.id || course.slug || idx}`,
            title: `Certification ${course.title}`,
            courseName: course.title,
            category,
            image: '/images/mau-certificate.jpg',
            issuedDate: course.date ? new Date(course.date).toLocaleDateString('en-GB') : '29/09/2026',
            certificateNumber: `CBA-2026-${String(course.databaseId || idx + 101).padStart(3, '0')}FH-${3930 + idx}`,
            recipientName: studentName,
        };
    });

    // Map allCourses to CatalogCourseItem
    const catalogCourses: CatalogCourseItem[] = allCourses.map((c: any) => {
        const catSlug = (c.categories?.[0]?.slug || c.categories?.nodes?.[0]?.slug || '').toLowerCase();
        const catName = c.categories?.[0]?.name || c.categories?.nodes?.[0]?.name || 'Facial class';
        const courseTitleLower = (c.title || '').toLowerCase();
        let category: 'cert' | 'laser' | 'pmu' | 'all' = 'cert';
        if (catSlug.includes('laser') || courseTitleLower.includes('laser')) {
            category = 'laser';
        } else if (catSlug.includes('pmu') || courseTitleLower.includes('pmu')) {
            category = 'pmu';
        }

        const totalLessons = c.sections?.reduce((acc: number, s: any) => acc + (s.items?.length || 0), 0) || (c.courseFields?.totalLessons ? Number(c.courseFields.totalLessons) : 24);
        const curriculumTitles: string[] = Array.isArray(c.sections) && c.sections.length > 0
            ? c.sections.map((s: any) => String(s.title || s.name || 'Lesson')).slice(0, 4)
            : ['Theory', 'Practice', 'Advanced', 'Business'];

        const courseRating = c.courseFields?.rating || (c.rating ? `${c.rating}/5.0` : '5.0/5.0');
        const courseTrainees = c.courseFields?.traineeCount || (c.studentsCount ? `(${c.studentsCount} trainees)` : '(Enrolling)');
        const authorName = c.courseFields?.trainer?.name || c.author?.node?.name || c.author?.name || 'American Master Trainer';
        const authorAvatar = c.courseFields?.trainer?.avatar || c.author?.node?.avatar?.url || '/images/kathleen.png';

        return {
            id: String(c.id || c.slug),
            category,
            image: c.featuredImage?.node?.sourceUrl || '/images/courses/card-hydra.jpg',
            tag: catName,
            rating: courseRating,
            traineeCount: courseTrainees,
            title: c.title,
            subtitle: c.excerpt ? String(c.excerpt).replace(/<[^>]*>/g, '').slice(0, 50) + '...' : (c.courseFields?.subtitle || 'Professional Training'),
            module: `${c.sections?.length || 5} module`,
            lessons: `${totalLessons} lessons`,
            quizzes: `${c.courseFields?.quizzes || '4'} quizzes`,
            curriculum: curriculumTitles,
            trainer: {
                name: authorName,
                avatar: authorAvatar,
                rating: courseRating,
            },
            actionType: 'register',
            ctaText: 'REGISTRATION NOW!',
            courseUrl: `/courses/${c.slug}`,
            previewUrl: `/courses/${c.slug}`,
        };
    });

    return (
        <>
            <MyCertificationList initialCertificates={dynamicCertificates} />
            <CourseCatalogList courses={catalogCourses.length > 0 ? catalogCourses : undefined} />
        </>
    );
}