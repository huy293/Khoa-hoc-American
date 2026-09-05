'use client';

import React, { useState } from 'react';
import styles from '@/styles/course/CourseSelection.module.css';
import CourseCard from '@/components/cards/CourseCard';
import { WPCourse } from '@/types/wordpress';

/* ── Chevron Down Icon for Load More ── */
const ChevronDownIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export interface CourseCategoryOption {
    id?: number | string;
    name: string;
    slug?: string;
}

export interface CourseSelectionProps {
    eyebrow?: string;
    title?: string;
    courses?: WPCourse[];
    categories?: CourseCategoryOption[];
}

interface ExtractedCategory {
    name: string;
    slug: string;
}

/**
 * 🎯 Trích xuất chính xác toàn bộ danh mục từ taxonomy=course_category của LearnPress / WordPress
 */
function extractCourseCategories(c: WPCourse): ExtractedCategory[] {
    const cf = (c.courseFields || {}) as any;
    const catMap = new Map<string, ExtractedCategory>();

    const addCat = (name?: string, slug?: string) => {
        if (!name || typeof name !== 'string') return;
        const cleanName = name
            .replace(/&#038;/g, '&')
            .replace(/&amp;/g, '&')
            .replace(/&#8211;/g, '-')
            .replace(/&#8217;/g, "'")
            .trim();
        if (!cleanName) return;

        const cleanSlug = (slug && typeof slug === 'string' && slug.trim())
            ? slug.trim().toLowerCase()
            : cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        const key = cleanSlug || cleanName.toLowerCase();
        if (!catMap.has(key)) {
            catMap.set(key, { name: cleanName, slug: cleanSlug });
        }
    };

    // 1. Lấy từ terms _embedded['wp:term'] (taxonomy: course_category hoặc lp_course_category)
    const terms: any[] = (c as any)._embedded?.['wp:term'] ? (c as any)._embedded['wp:term'].flat() : [];
    terms.forEach((t: any) => {
        if (t && (t.taxonomy === 'course_category' || t.taxonomy === 'lp_course_category')) {
            addCat(t.name, t.slug);
        }
    });

    // 2. Lấy từ c.categories (LearnPress REST API hoặc parseWpCourse)
    if (Array.isArray(c.categories) && c.categories.length > 0) {
        c.categories.forEach((cat: any) => {
            if (typeof cat === 'string') {
                addCat(cat);
            } else if (cat && typeof cat === 'object') {
                addCat(cat.name, cat.slug);
            }
        });
    }

    // 3. Lấy từ cf.categories
    if (Array.isArray(cf.categories) && cf.categories.length > 0) {
        cf.categories.forEach((cat: any) => {
            if (typeof cat === 'string') {
                addCat(cat);
            } else if (cat && typeof cat === 'object') {
                addCat(cat.name, cat.slug);
            }
        });
    }

    // 4. Fallback từ cf.category hoặc c.category
    if (catMap.size === 0) {
        if (typeof cf.category === 'string' && cf.category.trim()) {
            addCat(cf.category);
        } else if (typeof (c as any).category === 'string' && (c as any).category.trim()) {
            addCat((c as any).category);
        }
    }

    return Array.from(catMap.values());
}

export default function CourseSelection({
    eyebrow = "SELECTION OF COURSE",
    title = "Master Your Craft. <br />Build Your Beauty Career.",
    courses = [],
    categories = [],
}: CourseSelectionProps = {}) {
    const [activeTab, setActiveTab] = useState<string>('all');

    // Chuyển đổi trực tiếp 100% dữ liệu từ WordPress LearnPress (lp_course)
    const mappedCourses = (courses || []).map((c) => {
        const cf = (c.courseFields || {}) as any;
        const featuredImg = c.featuredImage?.node?.sourceUrl || (c as any).featured_image_url || '/images/courses/card-hydra.jpg';
        
        // 🎯 Lấy trực tiếp danh sách Module (Section) từ LearnPress
        const sectionsData = (Array.isArray(c.sections) && c.sections.length > 0)
            ? c.sections
            : ((Array.isArray(cf.sections) && cf.sections.length > 0)
                ? cf.sections
                : cf.curriculum);

        let currList: string[] = [];
        if (Array.isArray(sectionsData) && sectionsData.length > 0) {
            currList = sectionsData.map((item: any) =>
                typeof item === 'string' ? item : (item?.title || item?.name || 'Module')
            );
        }

        const courseCats = extractCourseCategories(c);
        const primaryCat = courseCats[0]?.name || '';

        return {
            id: c.id || c.slug,
            slug: c.slug,
            image: featuredImg,
            tag: (typeof cf.tag === 'string' && cf.tag.trim()) ? cf.tag.trim() : primaryCat,
            rating: (typeof cf.rating === 'string' && cf.rating.trim()) ? cf.rating.trim() : undefined,
            traineeCount: (typeof cf.traineeCount === 'string' && cf.traineeCount.trim()) ? cf.traineeCount.trim() : undefined,
            title: c.title,
            subtitle: (typeof cf.subtitle === 'string' && cf.subtitle.trim())
                ? cf.subtitle.trim()
                : (c.excerpt ? c.excerpt.replace(/<[^>]*>/g, '').trim() : ''),
            module: (typeof cf.module === 'string' && cf.module.trim())
                ? cf.module.trim()
                : (currList.length > 0 ? `${currList.length} modules` : undefined),
            lessons: (typeof cf.lessons === 'string' && cf.lessons.trim()) ? cf.lessons.trim() : undefined,
            quizzes: (typeof cf.quizzes === 'string' && cf.quizzes.trim()) ? cf.quizzes.trim() : undefined,
            curriculum: currList.length > 0 ? currList : undefined,
            sections: (Array.isArray(c.sections) && c.sections.length > 0) ? c.sections : cf.sections,
            trainer: cf.trainer?.name ? {
                name: cf.trainer.name,
                avatar: cf.trainer.avatar || undefined,
                rating: cf.trainer.rating || undefined,
            } : undefined,
            categories: courseCats,
        };
    });

    // 🎯 Tự động sinh danh sách Tabs chuẩn từ taxonomy course_category của LearnPress Headless
    const allCategoriesMap = new Map<string, ExtractedCategory>();

    // 1. Nạp từ categories truyền từ prop (nếu có từ getWpCourseCategories)
    if (Array.isArray(categories) && categories.length > 0) {
        categories.forEach(cat => {
            if (cat && cat.name) {
                const cleanName = cat.name.trim();
                const cleanSlug = cat.slug || cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                const key = cleanSlug || cleanName.toLowerCase();
                if (!allCategoriesMap.has(key)) {
                    allCategoriesMap.set(key, { name: cleanName, slug: cleanSlug });
                }
            }
        });
    }

    // 2. Nạp thêm các category có trong danh sách khóa học thực tế
    mappedCourses.forEach(c => {
        c.categories.forEach(cat => {
            const key = cat.slug || cat.name.toLowerCase();
            if (!allCategoriesMap.has(key)) {
                allCategoriesMap.set(key, cat);
            }
        });
    });

    const categoryTabs = React.useMemo<ExtractedCategory[]>(() => {
        return [
            { name: 'ALL COURSE', slug: 'all' },
            ...Array.from(allCategoriesMap.values()),
        ];
    }, [allCategoriesMap]);

    // 🎯 Lọc khóa học chính xác theo taxonomy course_category
    const filteredCourses = activeTab === 'all'
        ? mappedCourses
        : mappedCourses.filter(c =>
            c.categories.some(cat =>
                cat.slug.toLowerCase() === activeTab.toLowerCase() ||
                cat.name.trim().toLowerCase() === activeTab.trim().toLowerCase()
            )
        );

    return (
        <section className={styles['selection']}>
            <div className={styles['selection__container']}>
                {/* 1. Eyebrow */}
                <div className={styles['selection__eyebrow-wrapper']}>
                    <p className={styles['selection__eyebrow']}>{eyebrow}</p>
                    <div className={styles['selection__eyebrow-line']} />
                </div>

                {/* 2. Heading */}
                <h2
                    className={styles['selection__title']}
                    dangerouslySetInnerHTML={{ __html: title }}
                />

                {/* 3. Category Filter Tabs */}
                {categoryTabs.length > 1 && (
                    <div className={styles['selection__tabs']}>
                        {categoryTabs.map((tab) => {
                            const isActive =
                                activeTab === tab.slug ||
                                activeTab.toLowerCase() === tab.name.toLowerCase();
                            return (
                                <button
                                    key={tab.slug || tab.name}
                                    type="button"
                                    className={`${styles['selection__tab']} ${
                                        isActive ? styles['selection__tab--active'] : ''
                                    }`}
                                    onClick={() => setActiveTab(tab.slug)}
                                >
                                    {tab.name}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* 4. Course Cards Grid */}
                <div className={styles['selection__grid']}>
                    {filteredCourses.map((course, idx) => (
                        <CourseCard
                            key={`${course.id}-${idx}`}
                            courseUrl={course.slug ? `/courses/${course.slug}` : undefined}
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
                            sections={course.sections}
                            trainer={course.trainer}
                        />
                    ))}
                </div>

                {/* 5. Load More Action */}
                {filteredCourses.length > 8 && (
                    <div className={styles['selection__load-more']}>
                        <button type="button" className={styles['selection__load-more-btn']}>
                            <ChevronDownIcon />
                            <span>Load more</span>
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
