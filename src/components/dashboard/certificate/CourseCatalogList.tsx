'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from '@/styles/dashboard/certificate/CourseCatalogList.module.css';
import DashboardHeadings from '@/components/dashboard/common/DashboardHeadings';
import CourseCard, { CourseCardProps } from '@/components/cards/CourseCard';

/* ── SVG Icons ── */
const ChevronRightIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

const TABS = [
    { id: 'all', label: 'ALL COURSE (20)' },
    { id: 'cert', label: 'CERTIFICATE TRAINING (12)' },
    { id: 'laser', label: 'LASER TRAINING COURSES (5)' },
    { id: 'pmu', label: 'P.M.U TRAINING COURSES (3)' },
];

export interface CatalogCourseItem extends CourseCardProps {
    id: string;
    category: 'cert' | 'laser' | 'pmu' | 'all';
}

const DEFAULT_COURSES: CatalogCourseItem[] = [
    {
        id: 'course-1',
        category: 'cert',
        image: '/images/courses/card-hydra.jpg',
        tag: 'Facial class',
        rating: '4.9/5.0',
        traineeCount: '(2.700+ trainee)',
        title: 'HYDRA FACIAL',
        subtitle: 'Professional HydraFacial Training',
        module: '5 module',
        lessons: '24 lessons',
        quizzes: '4 quizzes',
        curriculum: ['Theory', 'Professional Practice', 'Advanced Applications', 'Business'],
        trainer: {
            name: 'Kathleen trainer',
            avatar: '/images/kathleen.png',
            rating: '4.9/5.0',
        },
        actionType: 'register',
        ctaText: 'REGISTARTION NOW!',
        courseUrl: '/courses/hydra-facial',
        previewUrl: '/courses/hydra-facial',
    },
    {
        id: 'course-2',
        category: 'cert',
        image: '/images/courses/card-advance.jpg',
        tag: 'Facial class',
        rating: '4.9/5.0',
        traineeCount: '(2.700+ trainee)',
        title: 'ADVENCE FACIAL',
        subtitle: 'Professional HydraFacial Training',
        module: '5 module',
        lessons: '24 lessons',
        quizzes: '4 quizzes',
        curriculum: ['Theory', 'Professional Practice', 'Advanced Applications', 'Business'],
        trainer: {
            name: 'Kathleen trainer',
            avatar: '/images/kathleen.png',
            rating: '4.9/5.0',
        },
        actionType: 'register',
        ctaText: 'REGISTARTION NOW!',
        courseUrl: '/courses/advence-facial',
        previewUrl: '/courses/advence-facial',
    },
    {
        id: 'course-3',
        category: 'cert',
        image: '/images/courses/card-hydra.jpg',
        tag: 'Facial class',
        rating: '4.9/5.0',
        traineeCount: '(2.700+ trainee)',
        title: 'HYDRA FACIAL',
        subtitle: 'Professional HydraFacial Training',
        module: '5 module',
        lessons: '24 lessons',
        quizzes: '4 quizzes',
        curriculum: ['Theory', 'Professional Practice', 'Advanced Applications', 'Business'],
        trainer: {
            name: 'Kathleen trainer',
            avatar: '/images/kathleen.png',
            rating: '4.9/5.0',
        },
        actionType: 'register',
        ctaText: 'REGISTARTION NOW!',
        courseUrl: '/courses/hydra-facial',
        previewUrl: '/courses/hydra-facial',
    },
    {
        id: 'course-4',
        category: 'cert',
        image: '/images/courses/card-derma.jpg',
        tag: 'Facial class',
        rating: '4.9/5.0',
        traineeCount: '(2.700+ trainee)',
        title: 'DERMA PLANNING',
        subtitle: 'Professional HydraFacial Training',
        module: '5 module',
        lessons: '24 lessons',
        quizzes: '4 quizzes',
        curriculum: ['Theory', 'Professional Practice', 'Advanced Applications', 'Business'],
        trainer: {
            name: 'Kathleen trainer',
            avatar: '/images/kathleen.png',
            rating: '4.9/5.0',
        },
        actionType: 'register',
        ctaText: 'REGISTARTION NOW!',
        courseUrl: '/courses/derma-planning',
        previewUrl: '/courses/derma-planning',
    },
];

export interface CourseCatalogListProps {
    tag?: string;
    title?: string;
    courses?: CatalogCourseItem[];
    seeMoreHref?: string;
}

export default function CourseCatalogList({
    tag = 'COURSES CATOLOG LIST',
    title = "Let's explore the course together!",
    courses = DEFAULT_COURSES,
    seeMoreHref = '/courses',
}: CourseCatalogListProps) {
    const [activeTab, setActiveTab] = useState<string>('cert');

    const filteredCourses = courses.filter((c) =>
        activeTab === 'all' ? true : c.category === activeTab
    );

    return (
        <section className={styles['course-catalog']} aria-label="Courses Catalog List Section">
            <div className={styles['course-catalog__container']}>
                {/* 1. Header: Tag & Title */}
                <DashboardHeadings tag={tag} title={title} />

                {/* 2. Nav: Filter Tabs & See More Link */}
                <div className={styles['course-catalog__nav-row']}>
                    <div className={styles['course-catalog__tabs']} role="tablist" aria-label="Course Category Tabs">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                role="tab"
                                aria-selected={activeTab === tab.id}
                                className={`${styles['course-catalog__tab-btn']} ${
                                    activeTab === tab.id ? styles['course-catalog__tab-btn--active'] : ''
                                }`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <Link href={seeMoreHref} className={styles['course-catalog__see-more']}>
                        <span>See more</span>
                        <span className={styles['course-catalog__see-more-icon']}>
                            <ChevronRightIcon />
                        </span>
                    </Link>
                </div>

                {/* 3. Courses Grid (4 Columns) */}
                {filteredCourses.length > 0 ? (
                    <div className={styles['course-catalog__grid']}>
                        {filteredCourses.map((course) => (
                            <CourseCard
                                key={course.id}
                                image={course.image}
                                tag={course.tag}
                                rating={course.rating}
                                traineeCount={course.traineeCount}
                                title={course.title}
                                subtitle={course.subtitle}
                                module={course.module}
                                lessons={course.lessons}
                                quizzes={course.quizzes}
                                curriculum={course.curriculum}
                                trainer={course.trainer}
                                actionType={course.actionType}
                                ctaText={course.ctaText}
                                courseUrl={course.courseUrl}
                                previewUrl={course.previewUrl}
                            />
                        ))}
                    </div>
                ) : (
                    <div className={styles['course-catalog__empty']}>
                        <p>No courses available in this category.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
