'use client';

import React, { useState, useEffect } from "react";
import MyCertificationList, { CertificateItem } from "@/components/dashboard/certificate/MyCertificationList";
import CourseCatalogList, { CatalogCourseItem } from "@/components/dashboard/certificate/CourseCatalogList";
import { useAuthUser } from "@/lib/auth-client";
import { WPCourse } from "@/types/wordpress";

interface CertificateContentProps {
    user?: any;
    enrolledCourses?: WPCourse[];
    allCourses?: WPCourse[];
    completedSlugs?: string[];
}

export default function CertificateContent({
    user: initialUser,
    enrolledCourses = [],
    allCourses = [],
    completedSlugs = [],
}: CertificateContentProps) {
    const { user: clientUser, displayName } = useAuthUser();
    const activeUser = clientUser || initialUser;
    const studentName = displayName || activeUser?.displayName || activeUser?.name || 'Học viên';

    // Đồng bộ danh sách khóa học hoàn thành từ localStorage phía client
    const [clientCompletedSlugs, setClientCompletedSlugs] = useState<string[]>([]);

    useEffect(() => {
        try {
            const saved = localStorage.getItem('lp_completed_courses');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    setClientCompletedSlugs(parsed.map(String));
                }
            }
        } catch {
            // LocalStorage không khả dụng
        }
    }, []);

    // 🎓 Lọc CHÍNH XÁC những khóa học mà học viên đã HOÀN THÀNH trong LearnPress Headless
    const isCourseCompleted = (course: any) => {
        const prog = Number(course.progress ?? course.courseFields?.progress ?? 0);
        const stat = String(course.status || '').toLowerCase();
        const grad = String(course.graduation || '').toLowerCase();
        const isCompletedFlag = Boolean(course.isCompleted);

        // 1. Hoàn thành từ dữ liệu WordPress LearnPress API
        const isWpCompleted =
            isCompletedFlag ||
            prog >= 100 ||
            stat === 'completed' ||
            stat === 'finished' ||
            grad === 'passed' ||
            grad === 'completed';

        // 2. Hoàn thành được lưu trong Cookie / Session (hn_completed_courses)
        const idStr = String(course.id || '');
        const slugStr = String(course.slug || '');
        const dbIdStr = String(course.databaseId || '');

        const isCookieCompleted =
            completedSlugs.includes(slugStr) ||
            completedSlugs.includes(idStr) ||
            (dbIdStr !== '' && completedSlugs.includes(dbIdStr));

        // 3. Hoàn thành được lưu trong LocalStorage (lp_completed_courses)
        const isLocalCompleted =
            clientCompletedSlugs.includes(slugStr) ||
            clientCompletedSlugs.includes(idStr) ||
            (dbIdStr !== '' && clientCompletedSlugs.includes(dbIdStr));

        return isWpCompleted || isCookieCompleted || isLocalCompleted;
    };

    // Chỉ lấy khóa học thực sự hoàn thành từ enrolledCourses
    const completedCourses = enrolledCourses.filter(isCourseCompleted);

    // Chuyển đổi các khóa học đã hoàn thành thành chứng chỉ hợp lệ
    const dynamicCertificates: CertificateItem[] = completedCourses.map((course: any, idx: number) => {
        const catSlug = (course.categories?.[0]?.slug || course.categories?.nodes?.[0]?.slug || '').toLowerCase();
        const courseTitleLower = (course.title || '').toLowerCase();
        let category: 'cert' | 'laser' | 'pmu' | 'all' = 'cert';
        if (catSlug.includes('laser') || courseTitleLower.includes('laser')) {
            category = 'laser';
        } else if (catSlug.includes('pmu') || courseTitleLower.includes('pmu')) {
            category = 'pmu';
        }

        const issuedDate = course.completedDate
            ? new Date(course.completedDate).toLocaleDateString('en-GB')
            : (course.date ? new Date(course.date).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB'));

        return {
            id: `cert-${course.id || course.slug || idx}`,
            title: `Certification ${course.title}`,
            courseName: course.title,
            category,
            image: '/images/mau-certificate.jpg',
            issuedDate,
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
            {/* Danh sách chứng chỉ đã cấp */}
            <MyCertificationList
                initialCertificates={dynamicCertificates}
                enrolledCourses={enrolledCourses}
            />

            {/* Danh mục toàn bộ khóa học để học viên khám phá */}
            <div id="course-catalog">
                <CourseCatalogList courses={catalogCourses.length > 0 ? catalogCourses : undefined} />
            </div>
        </>
    );
}