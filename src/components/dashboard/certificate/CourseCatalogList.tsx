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

export interface CatalogCourseItem extends CourseCardProps {
    id: string;
    category: 'cert' | 'laser' | 'pmu' | 'all';
}

export interface CourseCatalogListProps {
    tag?: string;
    title?: string;
    courses?: CatalogCourseItem[];
    seeMoreHref?: string;
}

export default function CourseCatalogList({
    tag = 'COURSES CATOLOG LIST',
    title = "Let's explore the course together!",
    courses = [],
    seeMoreHref = '/courses',
}: CourseCatalogListProps) {
    const [activeTab, setActiveTab] = useState<string>('cert');

    const tabs = React.useMemo(() => {
        const list = [];
        list.push({ id: 'all', label: `ALL COURSE (${courses.length})` });
        list.push({ id: 'cert', label: `CERTIFICATE TRAINING (${courses.filter((c) => c.category === 'cert').length})` });
        list.push({ id: 'laser', label: `LASER TRAINING COURSES (${courses.filter((c) => c.category === 'laser').length})` });
        list.push({ id: 'pmu', label: `P.M.U TRAINING COURSES (${courses.filter((c) => c.category === 'pmu').length})` });
        return list;
    }, [courses]);

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
                        {tabs.map((tab) => (
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
