'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/styles/dashboard/home/MyCourses.module.css';
import CourseCard from '@/components/cards/CourseCard';
import DashboardHeadings from '@/components/dashboard/DashboardHeadings';

import { WPCourse, WPCourseSection } from '@/types/wordpress';

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

/* ── Formatted Course Item for Card Grid ── */
export interface FormattedCourseCardItem {
    id: string;
    slug: string;
    image: string;
    category: string;
    rating: string;
    traineeCount: string;
    title: string;
    subtitle: string;
    progress: number;
    module: string;
    lessons: string;
    quizzes: string;
    curriculum: string[];
    sections?: WPCourseSection[];
    trainer: {
        name: string;
        avatar: string;
        rating: string;
    };
    studentsCount?: number | string;
}

/**
 * Helper: Chuyển đổi dữ liệu từ WPCourse (post_type: 'lp_course') sang FormattedCourseCardItem
 */
function formatCourse(c: WPCourse | any): FormattedCourseCardItem {
    const cf = (c.courseFields || {}) as any;
    const featuredImg =
        c.featuredImage?.node?.sourceUrl ||
        c.image ||
        '/images/courses/card-hydra.jpg';

    // 🎯 Lấy danh sách 4 Module (Section) từ mảng sections của LearnPress
    const sectionsData = (Array.isArray(c.sections) && c.sections.length > 0)
        ? c.sections
        : ((Array.isArray(cf.sections) && cf.sections.length > 0)
            ? cf.sections
            : (cf.curriculum || c.steps));

    let currList: string[] = [];
    if (Array.isArray(sectionsData) && sectionsData.length > 0) {
        currList = sectionsData.map((item: any) =>
            typeof item === 'string' ? item : (item?.title || item?.name || 'Module')
        );
    } else {
        currList = ['Theory', 'Professional Practice', 'Advanced Applications', 'Business'];
    }

    const title = c.title?.rendered || c.title || c.name || 'Hydra Facial';
    const cleanTitle = typeof title === 'string'
        ? title.replace(/&#038;/g, '&').replace(/&amp;/g, '&').replace(/&#8211;/g, '-').replace(/&#8217;/g, "'")
        : String(title);

    const subtitle =
        (typeof cf.subtitle === 'string' ? cf.subtitle : (c.subtitle || (c.excerpt ? c.excerpt.replace(/<[^>]*>/g, '').trim() : ''))) ||
        'Professional HydraFacial Training';

    const category =
        (typeof cf.category === 'string' ? cf.category : '') ||
        (typeof c.category === 'string' ? c.category : '') ||
        (typeof cf.tag === 'string' ? cf.tag : '') ||
        (typeof c.tag === 'string' ? c.tag : '') ||
        'CERTIFICATE TRAINING';

    const slug =
        c.slug ||
        cleanTitle
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') ||
        'hydra-facial';

    return {
        id: String(c.id || slug),
        slug,
        image: featuredImg,
        category,
        rating: (typeof cf.rating === 'string' ? cf.rating : (typeof c.rating === 'string' ? c.rating : '')) || '4.9/5.0',
        traineeCount: (typeof cf.traineeCount === 'string' ? cf.traineeCount : (typeof c.traineeCount === 'string' ? c.traineeCount : '')) || '(2.700+ trainee)',
        title: cleanTitle,
        subtitle,
        progress: typeof c.progress === 'number' ? c.progress : 0,
        module: (typeof cf.module === 'string' ? cf.module : (typeof c.module === 'string' ? c.module : '')) || `${currList.length || 4} modules`,
        lessons: (typeof cf.lessons === 'string' ? cf.lessons : (typeof c.lessons === 'string' ? c.lessons : '')) || '12 lessons',
        quizzes: (typeof cf.quizzes === 'string' ? cf.quizzes : (typeof c.quizzes === 'string' ? c.quizzes : '')) || '3 quizzes',
        curriculum: currList,
        sections: (Array.isArray(c.sections) && c.sections.length > 0) ? c.sections : cf.sections,
        trainer: {
            name: cf.trainer?.name || c.trainer?.name || 'Kathleen trainer',
            avatar: cf.trainer?.avatar || c.trainer?.avatar || '/images/home/kathleen.png',
            rating: cf.trainer?.rating || c.trainer?.rating || '4.9/5.0',
        },
        studentsCount: c.studentsCount || 145,
    };
}

export interface MyCoursesProps {
    tag?: string;
    title?: string;
    search?: boolean;
    seemore?: boolean;
    limit?: number;
    loadmore?: boolean;
    cardVariant?: 'student' | 'teacher';
    courses?: (WPCourse | any)[];
}

export default function MyCourses({
    tag = 'COURSES',
    title = 'My Courses',
    search = false,
    seemore = true,
    limit = 4,
    loadmore = false,
    cardVariant = 'student',
    courses,
}: MyCoursesProps = {}) {
    const [loadedCourses, setLoadedCourses] = useState<(WPCourse | any)[]>(courses || []);
    const [loading, setLoading] = useState<boolean>(!courses || courses.length === 0);

    // ⚡ Tự động fetch từ /api/courses nếu không có props courses truyền vào
    useEffect(() => {
        if (courses && courses.length > 0) {
            setLoadedCourses(courses);
            setLoading(false);
            return;
        }

        let isMounted = true;
        fetch('/api/courses')
            .then((res) => res.json())
            .then((data) => {
                if (isMounted && data.success && Array.isArray(data.courses)) {
                    setLoadedCourses(data.courses);
                }
            })
            .catch((err) => {
                console.error('Error loading courses in MyCourses:', err);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [courses]);

    const pathname = usePathname();
    const coursesUrl = pathname?.startsWith('/teacher') ? '/teacher/courses' : '/student/courses';
    const [activeTab, setActiveTab] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [visibleCount, setVisibleCount] = useState<number>(limit ?? 4);

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

    // 🎯 Format dữ liệu chuẩn LearnPress cho từng thẻ
    const formattedCourses = React.useMemo(() => {
        return loadedCourses.map(formatCourse);
    }, [loadedCourses]);

    // 🎯 Tự động sinh danh sách Tabs từ Category thực tế của LearnPress
    const dynamicTabs = React.useMemo(() => {
        const counts: Record<string, number> = {};
        formattedCourses.forEach((c) => {
            const cat = c.category.trim();
            if (cat) {
                counts[cat] = (counts[cat] || 0) + 1;
            }
        });

        const tabs = [
            { id: 'all', label: `ALL COURSE (${formattedCourses.length})` },
        ];

        Object.entries(counts).forEach(([cat, count]) => {
            tabs.push({
                id: cat.toLowerCase(),
                label: `${cat.toUpperCase()} (${count})`,
            });
        });

        return tabs;
    }, [formattedCourses]);

    const filteredCourses = formattedCourses.filter((course) => {
        const matchesSearch =
            !searchTerm ||
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.category.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesTab =
            activeTab === 'all' ||
            course.category.toLowerCase() === activeTab.toLowerCase() ||
            course.category.toLowerCase().includes(activeTab.toLowerCase()) ||
            activeTab.toLowerCase().includes(course.category.toLowerCase());

        return matchesSearch && matchesTab;
    });

    const displayedCourses = (limit || loadmore)
        ? filteredCourses.slice(0, visibleCount)
        : filteredCourses;

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
                    {dynamicTabs.map((tab) => (
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
                            <Link href={coursesUrl} className={styles['my-courses__see-more']}>
                                <span>See more</span>
                                <ChevronRightIcon />
                            </Link>
                        )}
                    </div>
                )}
            </div>

            {/* 3. 4-Column Course Cards Grid */}
            <div className={styles['my-courses__grid']}>
                {displayedCourses.length > 0 ? (
                    displayedCourses.map((course) => {
                        const courseUrl = `${coursesUrl}/${course.slug}`;

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
                                module={course.module}
                                lessons={course.lessons}
                                quizzes={course.quizzes}
                                curriculum={course.curriculum}
                                sections={course.sections}
                                trainer={course.trainer}
                                actionType="play"
                                courseUrl={courseUrl}
                                previewUrl={courseUrl}
                                variant={cardVariant}
                                studentsCount={course.studentsCount || 145}
                                onPlay={() => console.log('Continue course:', course.id)}
                            />
                        );
                    })
                ) : (
                    !loading && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0', color: '#8A7043' }}>
                            <p style={{ fontSize: '1rem', fontStyle: 'italic', margin: 0 }}>
                                Không tìm thấy khóa học nào phù hợp.
                            </p>
                        </div>
                    )
                )}
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
