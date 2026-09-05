'use client';

import React, { useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import styles from '@/styles/teacher/management/ManagamentContent.module.css';
import CourseCard from '@/components/cards/CourseCard';

/* ── SVG Icons ── */
const SearchIcon = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <path
            d="M18.75 18.75L14.41 14.41M16.75 8.75C16.75 13.1683 13.1683 16.75 8.75 16.75C4.33172 16.75 0.75 13.1683 0.75 8.75C0.75 4.33172 4.33172 0.75 8.75 0.75C13.1683 0.75 16.75 4.33172 16.75 8.75Z"
            stroke="#8A7043"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const ChevronDownIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <path
            d="M3.5 6L8 10.5L12.5 6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

/* ── Types & Configuration ── */
export interface TeacherCourseItem {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    imageAlt?: string;
    tag?: string;
    rating: string;
    traineeCount: string;
    progress: number;
    modulesCount: number;
    lessonsCount: number;
    quizzesCount: number;
    studentsCount?: number | string;
    classType?: 'online' | 'onsite';
    category?: 'cert' | 'laser' | 'pmu';
    courseUrl?: string;
}

export interface ManagamentContentProps {
    initialClassTab?: string;
    initialFilterTab?: string;
    courses?: TeacherCourseItem[];
    showProgressInCourseCard?: boolean;
    showTrainingProcessInCourseCard?: boolean;
    /** Backward compatibility alias */
    showProgress?: boolean;
    showTrainingProcess?: boolean;
}

export default function ManagamentContent({
    initialClassTab = 'all',
    initialFilterTab = 'all',
    courses = [],
    showProgressInCourseCard,
    showTrainingProcessInCourseCard,
    showProgress,
    showTrainingProcess,
}: ManagamentContentProps = {}) {
    const pathname = usePathname();
    const isStudentsPage = pathname?.includes('/management/students');
    const resolvedShowProgress =
        showProgressInCourseCard !== undefined ? showProgressInCourseCard : showProgress;
    const resolvedShowTrainingProcess =
        showTrainingProcessInCourseCard !== undefined ? showTrainingProcessInCourseCard : showTrainingProcess;

    const effectiveShowProgress = resolvedShowProgress !== undefined ? resolvedShowProgress : !isStudentsPage;
    const effectiveShowTrainingProcess = resolvedShowTrainingProcess !== undefined ? resolvedShowTrainingProcess : !isStudentsPage;

    const [activeClassTab, setActiveClassTab] = useState<string>(initialClassTab);
    const [activeFilterTab, setActiveFilterTab] = useState<string>(initialFilterTab);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [displayCount, setDisplayCount] = useState<number>(8);

    const classTabs = useMemo(() => {
        const counts: Record<string, number> = {
            all: courses.length,
            online: courses.filter((c) => c.classType === 'online').length,
            onsite: courses.filter((c) => c.classType === 'onsite').length,
        };
        const configs = [
            'all|ALL CLASS|All Courses',
            'online|ONLINE CLASS|Online Courses',
            'onsite|ON-SITE CLASS|On-site Courses',
        ];
        return configs.map((cfg) => {
            const [id, label, title] = cfg.split('|');
            return { id, label: `${label} (${counts[id] || 0})`, title };
        });
    }, [courses]);

    const filterTabs = useMemo(() => {
        const counts: Record<string, number> = {
            all: courses.length,
            cert: courses.filter((c) => c.category === 'cert').length,
            laser: courses.filter((c) => c.category === 'laser').length,
            pmu: courses.filter((c) => c.category === 'pmu').length,
        };
        const configs = [
            'all|ALL COURSE',
            'cert|CERTIFICATE TRAINING',
            'laser|LASER TRAINING COURSES',
            'pmu|P.M.U TRAINING COURSES',
        ];
        return configs.map((cfg) => {
            const [id, label] = cfg.split('|');
            return { id, label: `${label} (${counts[id] || 0})` };
        });
    }, [courses]);

    // Current category heading title
    const currentClassTitle = useMemo(() => {
        const found = classTabs.find((t) => t.id === activeClassTab);
        return found ? found.title : 'All Courses';
    }, [classTabs, activeClassTab]);

    // Filter courses based on active tabs & search query
    const filteredCourses = useMemo(() => {
        return courses.filter((course) => {
            // Search query filter
            if (searchQuery.trim() !== '') {
                const query = searchQuery.toLowerCase();
                const matchTitle = course.title.toLowerCase().includes(query);
                const matchSubtitle = course.subtitle.toLowerCase().includes(query);
                const matchTag = course.tag ? course.tag.toLowerCase().includes(query) : false;
                if (!matchTitle && !matchSubtitle && !matchTag) {
                    return false;
                }
            }

            // Class type filter (if 'all', include all)
            if (activeClassTab !== 'all' && course.classType && course.classType !== activeClassTab) {
                return false;
            }

            // Sub-category filter (if 'all', include all)
            if (activeFilterTab !== 'all' && course.category && course.category !== activeFilterTab) {
                return false;
            }

            return true;
        });
    }, [courses, searchQuery, activeClassTab, activeFilterTab]);

    const visibleCourses = useMemo(() => {
        return filteredCourses.slice(0, displayCount);
    }, [filteredCourses, displayCount]);

    const handleLoadMore = () => {
        setDisplayCount((prev) => prev + 4);
    };

    return (
        <section className={styles['management']} aria-label="Teacher Course Management">
            <div className={styles['management__wrapper']}>
                <div className={styles['management__container']}>
                    <div className={styles['management__content']}>
                        {/* 1: Top Header & Class Category Tabs */}
                        <div className={styles['management__top']}>
                            <div className={styles['management__header']}>
                                <div className={styles['management__tag-wrap']}>
                                    <span className={styles['management__tag']}>MANAGEMENT</span>
                                </div>
                                <div className={styles['management__divider']} />
                                <h1 className={styles['management__title']}>
                                    Teach Better. Manage Smarter.
                                </h1>
                            </div>

                            {/* Level 1 Tabs */}
                            <div className={styles['management__class-nav']}>
                                <div className={styles['management__class-tabs']} role="tablist">
                                    {classTabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            role="tab"
                                            aria-selected={activeClassTab === tab.id}
                                            className={`${styles['management__class-tab']} ${activeClassTab === tab.id
                                                    ? styles['management__class-tab--active']
                                                    : ''
                                                }`}
                                            onClick={() => setActiveClassTab(tab.id)}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 2: Middle Filter & Search Section */}
                        <div className={styles['management__middle']}>
                            <h2 className={styles['management__courses-title']}>
                                {currentClassTitle}
                            </h2>

                            <div className={styles['management__filter-row']}>
                                {/* Level 2 Tabs */}
                                <div className={styles['management__filter-tabs']} role="tablist">
                                    {filterTabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            role="tab"
                                            aria-selected={activeFilterTab === tab.id}
                                            className={`${styles['management__filter-tab']} ${activeFilterTab === tab.id
                                                    ? styles['management__filter-tab--active']
                                                    : ''
                                                }`}
                                            onClick={() => setActiveFilterTab(tab.id)}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Search Box */}
                                <div className={styles['management__search-box']}>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder=""
                                        aria-label="Search courses"
                                        className={styles['management__search-input']}
                                    />
                                    <span className={styles['management__search-icon']} aria-hidden="true">
                                        <SearchIcon />
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* 3: Course Grid & Load More */}
                        <div className={styles['management__grid-wrap']}>
                            {visibleCourses.length > 0 ? (
                                <div className={styles['management__grid']}>
                                    {visibleCourses.map((course) => (
                                        <CourseCard
                                            key={course.id}
                                            image={course.image}
                                            imageAlt={course.imageAlt || course.title}
                                            tag={course.tag}
                                            rating={course.rating}
                                            traineeCount={course.traineeCount}
                                            title={course.title}
                                            subtitle={course.subtitle}
                                            progress={course.progress}
                                            showProgress={effectiveShowProgress}
                                            showTrainingProcess={effectiveShowTrainingProcess}
                                            module={`${course.modulesCount} module`}
                                            lessons={`${course.lessonsCount} lessons`}
                                            quizzes={`${course.quizzesCount} quizzes`}
                                            courseUrl={course.courseUrl || '/courses/hydra-facial'}
                                            variant="teacher"
                                            studentsCount={course.studentsCount ?? 0}
                                            studentLabel="Students participated"
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className={styles['management__empty']}>
                                    No courses found matching your criteria.
                                </div>
                            )}

                            {filteredCourses.length > visibleCourses.length && (
                                <button
                                    type="button"
                                    className={styles['management__load-more']}
                                    onClick={handleLoadMore}
                                >
                                    <ChevronDownIcon />
                                    <span>Load more</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export { ManagamentContent as ManagementContent };