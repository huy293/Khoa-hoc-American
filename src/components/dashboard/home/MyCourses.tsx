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
    image?: string;
    category?: string;
    categories: string[];
    categorySlugs: string[];
    rating?: string;
    traineeCount?: string;
    title: string;
    subtitle?: string;
    progress?: number;
    module?: string;
    lessons?: string;
    quizzes?: string;
    curriculum: string[];
    sections?: WPCourseSection[];
    trainer?: {
        name: string;
        avatar?: string;
        rating?: string;
    };
    studentsCount?: number | string;
}

/**
 * Helper: Chuyển đổi dữ liệu từ WPCourse (post_type: 'lp_course') sang FormattedCourseCardItem
 * Chỉ lấy dữ liệu thực tế từ API/WordPress, không gán giá trị hardcode giả lập.
 */
function formatCourse(c: WPCourse | any): FormattedCourseCardItem {
    const cf = (c.courseFields || {}) as any;
    const featuredImg =
        c.featuredImage?.node?.sourceUrl ||
        c.featured_image_url ||
        c.image ||
        '';

    // 🎯 Lấy danh sách Module (Section) từ mảng sections của LearnPress nếu có
    const sectionsData = (Array.isArray(c.sections) && c.sections.length > 0)
        ? c.sections
        : ((Array.isArray(cf.sections) && cf.sections.length > 0)
            ? cf.sections
            : (Array.isArray(cf.curriculum) && cf.curriculum.length > 0
                ? cf.curriculum
                : (Array.isArray(c.steps) && c.steps.length > 0 ? c.steps : [])));

    let currList: string[] = [];
    if (Array.isArray(sectionsData) && sectionsData.length > 0) {
        currList = sectionsData
            .map((item: any) =>
                typeof item === 'string' ? item : (item?.title || item?.name || '')
            )
            .filter(Boolean);
    }

    const title = c.title?.rendered || c.title || c.name || '';
    const cleanTitle = typeof title === 'string'
        ? title.replace(/&#038;/g, '&').replace(/&amp;/g, '&').replace(/&#8211;/g, '-').replace(/&#8217;/g, "'").trim()
        : String(title || '');

    const subtitle =
        (typeof cf.subtitle === 'string' && cf.subtitle.trim()
            ? cf.subtitle.trim()
            : (typeof c.subtitle === 'string' && c.subtitle.trim()
                ? c.subtitle.trim()
                : (c.excerpt ? c.excerpt.replace(/<[^>]*>/g, '').trim() : '')));

    // 🎯 Lấy chính xác danh mục từ taxonomy course_category của WordPress
    const terms: any[] = c._embedded?.['wp:term'] ? c._embedded['wp:term'].flat() : [];
    const wpCourseCats = terms
        .filter((t: any) => t && (t.taxonomy === 'course_category' || t.taxonomy === 'lp_course_category'))
        .map((t: any) => ({
            name: typeof t.name === 'string' ? t.name.trim() : '',
            slug: typeof t.slug === 'string' ? t.slug.trim() : '',
        }))
        .filter((t: any) => Boolean(t.name));

    const parsedCats = Array.isArray(c.categories) && c.categories.length > 0
        ? c.categories.map((cat: any) => ({
            name: typeof cat === 'string' ? cat.trim() : (cat?.name ? String(cat.name).trim() : ''),
            slug: typeof cat === 'object' && cat?.slug ? String(cat.slug).trim() : '',
        })).filter((cat: any) => Boolean(cat.name))
        : (Array.isArray(cf.categories) && cf.categories.length > 0
            ? cf.categories.map((cat: any) => ({
                name: typeof cat === 'string' ? cat.trim() : (cat?.name ? String(cat.name).trim() : ''),
                slug: typeof cat === 'object' && cat?.slug ? String(cat.slug).trim() : '',
            })).filter((cat: any) => Boolean(cat.name))
            : []);

    const allCatObjs = wpCourseCats.length > 0 ? wpCourseCats : parsedCats;
    const categoriesList = allCatObjs.map((cat: any) => String(cat.name || ''));
    const categorySlugsList = allCatObjs.map((cat: any) => String(cat.slug || cat.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'));

    // Fallback nếu có trường cf.category hoặc c.category mà chưa có trong terms
    if (categoriesList.length === 0) {
        const fallbackCat = (typeof cf.category === 'string' && cf.category.trim())
            ? cf.category.trim()
            : (typeof c.category === 'string' && c.category.trim() ? c.category.trim() : '');
        if (fallbackCat) {
            categoriesList.push(fallbackCat);
            categorySlugsList.push(fallbackCat.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
        }
    }

    const primaryCategory = categoriesList[0] || '';

    const slug =
        c.slug ||
        cleanTitle
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') ||
        String(c.id || '');

    const rating = (typeof cf.rating === 'string' && cf.rating.trim())
        ? cf.rating.trim()
        : (typeof c.rating === 'string' && c.rating.trim() ? c.rating.trim() : '');

    const traineeCount = (typeof cf.traineeCount === 'string' && cf.traineeCount.trim())
        ? cf.traineeCount.trim()
        : (typeof c.traineeCount === 'string' && c.traineeCount.trim() ? c.traineeCount.trim() : '');

    const progress = typeof c.progress === 'number'
        ? c.progress
        : (typeof cf.progress === 'number' ? cf.progress : undefined);

    const moduleText = (typeof cf.module === 'string' && cf.module.trim())
        ? cf.module.trim()
        : (typeof c.module === 'string' && c.module.trim()
            ? c.module.trim()
            : (currList.length > 0 ? `${currList.length} modules` : ''));

    const lessonsText = (typeof cf.lessons === 'string' && cf.lessons.trim())
        ? cf.lessons.trim()
        : (typeof c.lessons === 'string' && c.lessons.trim() ? c.lessons.trim() : '');

    const quizzesText = (typeof cf.quizzes === 'string' && cf.quizzes.trim())
        ? cf.quizzes.trim()
        : (typeof c.quizzes === 'string' && c.quizzes.trim() ? c.quizzes.trim() : '');

    const trainerName = cf.trainer?.name || c.trainer?.name || '';
    const trainerAvatar = cf.trainer?.avatar || c.trainer?.avatar || '';
    const trainerRating = cf.trainer?.rating || c.trainer?.rating || '';

    const trainer = trainerName
        ? {
            name: trainerName,
            avatar: trainerAvatar,
            rating: trainerRating,
        }
        : undefined;

    const studentsCount = c.studentsCount ?? cf.studentsCount ?? undefined;

    return {
        id: String(c.id || slug),
        slug,
        image: featuredImg,
        category: primaryCategory,
        categories: categoriesList,
        categorySlugs: categorySlugsList,
        rating,
        traineeCount,
        title: cleanTitle,
        subtitle,
        progress,
        module: moduleText,
        lessons: lessonsText,
        quizzes: quizzesText,
        curriculum: currList,
        sections: (Array.isArray(c.sections) && c.sections.length > 0) ? c.sections : cf.sections,
        trainer,
        studentsCount,
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

    // 🎯 Tự động sinh danh sách Tabs chính xác từ taxonomy course_category của WordPress
    const dynamicTabs = React.useMemo(() => {
        const categoryMap = new Map<string, { id: string; label: string; count: number }>();

        formattedCourses.forEach((course) => {
            const courseCats = course.categories.length > 0
                ? course.categories
                : (course.category ? [course.category] : []);

            courseCats.forEach((catName) => {
                const trimmed = catName.trim();
                if (!trimmed) return;

                const normalizedKey = trimmed.toLowerCase();
                const existing = categoryMap.get(normalizedKey);
                if (existing) {
                    existing.count += 1;
                } else {
                    categoryMap.set(normalizedKey, {
                        id: normalizedKey,
                        label: trimmed.toUpperCase(),
                        count: 1,
                    });
                }
            });
        });

        const tabs: Array<{ id: string; label: string }> = [];
        tabs.push({ id: 'all', label: `ALL COURSE (${formattedCourses.length})` });

        categoryMap.forEach((item) => {
            tabs.push({
                id: item.id,
                label: `${item.label} (${item.count})`,
            });
        });

        return tabs;
    }, [formattedCourses]);

    const filteredCourses = formattedCourses.filter((course) => {
        const matchesSearch =
            !searchTerm ||
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            Boolean(course.subtitle && course.subtitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
            Boolean(course.category && course.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
            course.categories.some((cat) => cat.toLowerCase().includes(searchTerm.toLowerCase()));

        const currentTab = activeTab.trim().toLowerCase();

        // 🎯 Lọc CHÍNH XÁC theo taxonomy course_category:
        // - 'all': hiển thị tất cả các khóa học
        // - tab cụ thể: khóa học PHẢI thuộc taxonomy course_category đó (so khớp exact match name hoặc slug)
        const matchesTab =
            currentTab === 'all' ||
            course.categories.some((cat) => cat.trim().toLowerCase() === currentTab) ||
            course.categorySlugs.some((slug) => slug.trim().toLowerCase() === currentTab);

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
                                studentsCount={course.studentsCount}
                                onPlay={() => console.log('Continue course:', course.id)}
                            />
                        );
                    })
                ) : (
                    !loading && (
                        <div className={styles['my-courses__empty-state']}>
                            <div className={styles['my-courses__empty-icon']}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#AF8861" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                                    <line x1="12" y1="6" x2="12" y2="12" />
                                    <line x1="9" y1="9" x2="15" y2="9" />
                                </svg>
                            </div>
                            <h3 className={styles['my-courses__empty-title']}>
                                {searchTerm ? 'Không tìm thấy khóa học phù hợp' : 'Bạn chưa đăng ký khóa học nào'}
                            </h3>
                            <p className={styles['my-courses__empty-desc']}>
                                {searchTerm
                                    ? `Không có khóa học nào khớp với từ khóa "${searchTerm}". Vui lòng thử tìm kiếm khác.`
                                    : 'Hãy khám phá danh sách các khóa học chuyên nghiệp để bắt đầu lộ trình đào tạo và cấp bằng của bạn.'}
                            </p>
                            {!searchTerm && (
                                <Link href="/courses" className={styles['my-courses__empty-btn']}>
                                    Khám phá khóa học ngay &rarr;
                                </Link>
                            )}
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
