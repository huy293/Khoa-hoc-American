'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from '@/styles/dashboard/home/MyCourses.module.css';
import CourseCard from '@/components/cards/CourseCard';
import DashboardHeadings from '@/components/dashboard/DashboardHeadings';

/* ── SVG Icons ── */
const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.75 18.75L14.41 14.41M16.75 8.75C16.75 13.1683 13.1683 16.75 8.75 16.75C4.33172 16.75 0.75 13.1683 0.75 8.75C0.75 4.33172 4.33172 0.75 8.75 0.75C13.1683 0.75 16.75 4.33172 16.75 8.75Z" stroke="#8A7043" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ChevronRightIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

/* ── Types & Mock Data ── */
interface CourseItem {
    id: string;
    slug?: string;
    image: string;
    category: string;
    rating: string;
    traineeCount: string;
    title: string;
    subtitle: string;
    progress: number;
    modulesCount: number;
    lessonsCount: number;
    quizzesCount: number;
    steps: string[];
    trainer: {
        name: string;
        avatar: string;
        rating: string;
    };
}

const TABS = [
    { id: 'all', label: 'ALL COURSE (20)' },
    { id: 'cert', label: 'CERTIFICATE TRAINING (12)' },
    { id: 'laser', label: 'LASER TRAINING COURSES (5)' },
    { id: 'pmu', label: 'P.M.U TRAINING COURSES (3)' },
];

const COURSES: CourseItem[] = [
    {
        id: '1',
        image: '/images/courses/card-hydra.jpg',
        category: 'Facial class',
        rating: '4.9/5.0',
        traineeCount: '(2.700+ trainee)',
        title: 'HYDRA FACIAL',
        subtitle: 'Professional HydraFacial Training',
        progress: 85,
        modulesCount: 5,
        lessonsCount: 24,
        quizzesCount: 4,
        steps: ['Theory', 'Professional Practice', 'Advanced Applications', 'Business'],
        trainer: {
            name: 'Kathleen trainer',
            avatar: '/images/kathleen.png',
            rating: '4.9/5.0',
        },
    },
    {
        id: '2',
        image: '/images/courses/card-advance.jpg',
        category: 'Facial class',
        rating: '4.9/5.0',
        traineeCount: '(2.700+ trainee)',
        title: 'ADVENCE FACIAL',
        subtitle: 'Professional HydraFacial Training',
        progress: 0,
        modulesCount: 5,
        lessonsCount: 24,
        quizzesCount: 4,
        steps: ['Theory', 'Professional Practice', 'Advanced Applications', 'Business'],
        trainer: {
            name: 'Kathleen trainer',
            avatar: '/images/kathleen.png',
            rating: '4.9/5.0',
        },
    },
    {
        id: '3',
        image: '/images/courses/card-derma.jpg',
        category: 'Facial class',
        rating: '4.9/5.0',
        traineeCount: '(2.700+ trainee)',
        title: 'DERMA PLANNING',
        subtitle: 'Professional HydraFacial Training',
        progress: 0,
        modulesCount: 5,
        lessonsCount: 24,
        quizzesCount: 4,
        steps: ['Theory', 'Professional Practice', 'Advanced Applications', 'Business'],
        trainer: {
            name: 'Kathleen trainer',
            avatar: '/images/kathleen.png',
            rating: '4.9/5.0',
        },
    },
    {
        id: '4',
        image: '/images/courses/card-towel.jpg',
        category: 'Facial class',
        rating: '4.9/5.0',
        traineeCount: '(2.700+ trainee)',
        title: 'DERMA PLANNING',
        subtitle: 'Professional HydraFacial Training',
        progress: 0,
        modulesCount: 5,
        lessonsCount: 24,
        quizzesCount: 4,
        steps: ['Theory', 'Professional Practice', 'Advanced Applications', 'Business'],
        trainer: {
            name: 'Kathleen trainer',
            avatar: '/images/kathleen.png',
            rating: '4.9/5.0',
        },
    },
    {
        id: '5',
        image: '/images/courses/card-hydra.jpg',
        category: 'Laser class',
        rating: '4.8/5.0',
        traineeCount: '(1.900+ trainee)',
        title: 'LASER RESURFACING',
        subtitle: 'Advanced Laser Skin Therapy',
        progress: 40,
        modulesCount: 6,
        lessonsCount: 28,
        quizzesCount: 5,
        steps: ['Theory', 'Clinical Safety', 'Practical Application', 'Post-Treatment Care'],
        trainer: {
            name: 'Kathleen trainer',
            avatar: '/images/kathleen.png',
            rating: '4.9/5.0',
        },
    },
    {
        id: '6',
        image: '/images/courses/card-advance.jpg',
        category: 'P.M.U class',
        rating: '4.9/5.0',
        traineeCount: '(3.200+ trainee)',
        title: 'MICROBLADING PRO',
        subtitle: 'Semi-Permanent Makeup Mastery',
        progress: 10,
        modulesCount: 4,
        lessonsCount: 18,
        quizzesCount: 3,
        steps: ['Color Theory', 'Brow Mapping', 'Blade Technique', 'Hygiene'],
        trainer: {
            name: 'Kathleen trainer',
            avatar: '/images/kathleen.png',
            rating: '4.9/5.0',
        },
    },
    {
        id: '7',
        image: '/images/courses/card-derma.jpg',
        category: 'Facial class',
        rating: '5.0/5.0',
        traineeCount: '(1.400+ trainee)',
        title: 'CHEMICAL PEEL MASTER',
        subtitle: 'Acid Formulations & Peeling Procedures',
        progress: 60,
        modulesCount: 5,
        lessonsCount: 22,
        quizzesCount: 4,
        steps: ['Skin Chemistry', 'Superficial Peels', 'Medium Depth', 'Recovery'],
        trainer: {
            name: 'Kathleen trainer',
            avatar: '/images/kathleen.png',
            rating: '4.9/5.0',
        },
    },
    {
        id: '8',
        image: '/images/courses/card-towel.jpg',
        category: 'Facial class',
        rating: '4.8/5.0',
        traineeCount: '(950+ trainee)',
        title: 'SKIN ANATOMY & PHYSIOLOGY',
        subtitle: 'Fundamental Science for Estheticians',
        progress: 100,
        modulesCount: 4,
        lessonsCount: 16,
        quizzesCount: 4,
        steps: ['Epidermis & Dermis', 'Cellular Turnover', 'Skin Types', 'Consultation'],
        trainer: {
            name: 'Kathleen trainer',
            avatar: '/images/kathleen.png',
            rating: '4.9/5.0',
        },
    },
    {
        id: '9',
        image: '/images/courses/card-towel.jpg',
        category: 'Facial class',
        rating: '4.8/5.0',
        traineeCount: '(950+ trainee)',
        title: 'SKIN ANATOMY & PHYSIOLOGY',
        subtitle: 'Fundamental Science for Estheticians',
        progress: 100,
        modulesCount: 4,
        lessonsCount: 16,
        quizzesCount: 4,
        steps: ['Epidermis & Dermis', 'Cellular Turnover', 'Skin Types', 'Consultation'],
        trainer: {
            name: 'Kathleen trainer',
            avatar: '/images/kathleen.png',
            rating: '4.9/5.0',
        },
    },
    {
        id: '10',
        image: '/images/courses/card-towel.jpg',
        category: 'Facial class',
        rating: '4.8/5.0',
        traineeCount: '(950+ trainee)',
        title: 'SKIN ANATOMY & PHYSIOLOGY',
        subtitle: 'Fundamental Science for Estheticians',
        progress: 100,
        modulesCount: 4,
        lessonsCount: 16,
        quizzesCount: 4,
        steps: ['Epidermis & Dermis', 'Cellular Turnover', 'Skin Types', 'Consultation'],
        trainer: {
            name: 'Kathleen trainer',
            avatar: '/images/kathleen.png',
            rating: '4.9/5.0',
        },
    },
    {
        id: '11',
        image: '/images/courses/card-towel.jpg',
        category: 'Facial class',
        rating: '4.8/5.0',
        traineeCount: '(950+ trainee)',
        title: 'SKIN ANATOMY & PHYSIOLOGY',
        subtitle: 'Fundamental Science for Estheticians',
        progress: 100,
        modulesCount: 4,
        lessonsCount: 16,
        quizzesCount: 4,
        steps: ['Epidermis & Dermis', 'Cellular Turnover', 'Skin Types', 'Consultation'],
        trainer: {
            name: 'Kathleen trainer',
            avatar: '/images/kathleen.png',
            rating: '4.9/5.0',
        },
    },
    {
        id: '12',
        image: '/images/courses/card-towel.jpg',
        category: 'Facial class',
        rating: '4.8/5.0',
        traineeCount: '(950+ trainee)',
        title: 'SKIN ANATOMY & PHYSIOLOGY',
        subtitle: 'Fundamental Science for Estheticians',
        progress: 100,
        modulesCount: 4,
        lessonsCount: 16,
        quizzesCount: 4,
        steps: ['Epidermis & Dermis', 'Cellular Turnover', 'Skin Types', 'Consultation'],
        trainer: {
            name: 'Kathleen trainer',
            avatar: '/images/kathleen.png',
            rating: '4.9/5.0',
        },
    },
];

interface MyCoursesProps {
    tag?: string;
    title?: string;
    search?: boolean;
    seemore?: boolean;
    limit?: number;
    loadmore?: boolean;
}

export default function MyCourses({
    tag = 'COURSES',
    title = 'My Courses',
    search = false,
    seemore = true,
    limit = 4,
    loadmore = false,
}: MyCoursesProps = {}) {
    const [activeTab, setActiveTab] = useState('cert');
    const [searchTerm, setSearchTerm] = useState('');
    const [visibleCount, setVisibleCount] = useState<number>(limit ?? (loadmore ? 4 : COURSES.length));

    const tabsRef = React.useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const handleTabsWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        if (e.deltaY !== 0 && tabsRef.current) {
            tabsRef.current.scrollLeft += e.deltaY;
        }
    };

    const handleTabsMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!tabsRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - tabsRef.current.offsetLeft);
        setScrollLeft(tabsRef.current.scrollLeft);
    };

    const handleTabsMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging || !tabsRef.current) return;
        e.preventDefault();
        const x = e.pageX - tabsRef.current.offsetLeft;
        const walk = (x - startX) * 1.5;
        tabsRef.current.scrollLeft = scrollLeft - walk;
    };

    const handleTabsMouseUpOrLeave = () => {
        setIsDragging(false);
    };

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + (limit ?? 4));
    };

    const filteredCourses = COURSES.filter((course) => {
        const matchesSearch =
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.category.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const displayedCourses = limit || loadmore ? filteredCourses.slice(0, visibleCount) : filteredCourses;

    return (
        <section className={styles['my-courses']} aria-label="My Courses Section">
            {/* 1. Header: Tag & Title */}
            <DashboardHeadings
                tag={tag}
                title={title}
                className={styles['my-courses__header']}
            />

            {/* 2. Filter Tabs & See more / Search */}
            <div className={styles['my-courses__nav-row']}>
                <div
                    ref={tabsRef}
                    className={styles['my-courses__tabs']}
                    role="tablist"
                    onWheel={handleTabsWheel}
                    onMouseDown={handleTabsMouseDown}
                    onMouseMove={handleTabsMouseMove}
                    onMouseUp={handleTabsMouseUpOrLeave}
                    onMouseLeave={handleTabsMouseUpOrLeave}
                >
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            role="tab"
                            aria-selected={activeTab === tab.id}
                            className={`${styles['my-courses__tab-btn']} ${activeTab === tab.id ? styles['my-courses__tab-btn--active'] : ''
                                }`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {(search || seemore) && (
                    <div className={styles['my-courses__nav-right']}>
                        {search && (
                            <div className={styles['my-courses__search-box']}>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={styles['my-courses__search-input']}
                                />
                                <SearchIcon />
                            </div>
                        )}

                        {seemore && (
                            <Link href="/dashboard/courses" className={styles['my-courses__see-more']}>
                                <span>See more</span>
                                <ChevronRightIcon />
                            </Link>
                        )}
                    </div>
                )}
            </div>

            {/* 3. 4-Column Course Cards Grid */}
            <div className={styles['my-courses__grid']}>
                {displayedCourses.map((course) => {
                    const slug =
                        course.slug ||
                        course.title
                            .toLowerCase()
                            .trim()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/(^-|-$)/g, '') ||
                        'hydra-facial';
                    const courseUrl = `/dashboard/courses/${slug}`;

                    return (
                        <CourseCard
                            key={course.id}
                            image={course.image}
                            tag={course.category}
                            rating={course.rating}
                            traineeCount={course.traineeCount}
                            title={course.title}
                            subtitle={course.subtitle}
                            progress={course.progress}
                            module={`${course.modulesCount} module`}
                            lessons={`${course.lessonsCount} lessons`}
                            quizzes={`${course.quizzesCount} quizzes`}
                            curriculum={course.steps}
                            trainer={course.trainer}
                            actionType="play"
                            courseUrl={courseUrl}
                            previewUrl={courseUrl}
                            onPlay={() => console.log('Continue course:', course.id)}
                        />
                    );
                })}
            </div>

            {/* 4. Load More Button */}
            {loadmore && filteredCourses.length > visibleCount && (
                <div className={styles['my-courses__load-more-wrapper']}>
                    <button
                        type="button"
                        className={styles['my-courses__load-more-btn']}
                        onClick={handleLoadMore}
                    >
                        <svg
                            className={styles['my-courses__load-more-icon']}
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M6 9L12 15L18 9"
                                stroke="#8A7043"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span>Load more</span>
                    </button>
                </div>
            )}
        </section>
    );
}
