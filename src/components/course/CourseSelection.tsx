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

export interface CourseSelectionProps {
    eyebrow?: string;
    title?: string;
    courses?: WPCourse[];
}

export default function CourseSelection({
    eyebrow = "SELECTION OF COURSE",
    title = "Master Your Craft. <br />Build Your Beauty Career.",
    courses = [],
}: CourseSelectionProps = {}) {
    const [activeTab, setActiveTab] = useState('ALL COURSE');

    // Chuyển đổi trực tiếp 100% dữ liệu từ WordPress LearnPress (lp_course)
    const mappedCourses = (courses || []).map((c) => {
        const cf = (c.courseFields || {}) as any;
        const featuredImg = c.featuredImage?.node?.sourceUrl || '/images/courses/card-hydra.jpg';
        
        // 🎯 Lấy trực tiếp danh sách Module (Section) từ mảng sections của LearnPress (GET /wp-json/learnpress/v1/courses/{id})
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

        return {
            id: c.id || c.slug,
            slug: c.slug,
            image: featuredImg,
            tag: (typeof cf.tag === 'string' ? cf.tag : '') || 'Facial class',
            rating: (typeof cf.rating === 'string' ? cf.rating : '') || '4.9/5.0',
            traineeCount: (typeof cf.traineeCount === 'string' ? cf.traineeCount : '') || '(2.700+ trainee)',
            title: c.title,
            subtitle: (typeof cf.subtitle === 'string' ? cf.subtitle : (c.excerpt ? c.excerpt.replace(/<[^>]*>/g, '').trim() : '')) || '',
            module: (typeof cf.module === 'string' ? cf.module : '') || `${currList.length || 4} modules`,
            lessons: (typeof cf.lessons === 'string' ? cf.lessons : '') || '12 lessons',
            quizzes: (typeof cf.quizzes === 'string' ? cf.quizzes : '') || '3 quizzes',
            curriculum: currList,
            sections: (Array.isArray(c.sections) && c.sections.length > 0) ? c.sections : cf.sections,
            trainer: {
                name: cf.trainer?.name || 'Kathleen trainer',
                avatar: cf.trainer?.avatar || '/images/home/kathleen.png',
                rating: cf.trainer?.rating || '4.9/5.0',
            },
            category: (typeof cf.category === 'string' ? cf.category : '') || 'CERTIFICATE TRAINING',
        };
    });

    // Tự động sinh danh sách Tabs từ Category thực tế của LearnPress
    const uniqueCategories = Array.from(
        new Set(mappedCourses.map(c => c.category).filter(Boolean))
    );
    const tabs = ['ALL COURSE', ...uniqueCategories];

    const filteredCourses = activeTab === 'ALL COURSE'
        ? mappedCourses
        : mappedCourses.filter(c =>
            c.category.trim().toLowerCase() === activeTab.trim().toLowerCase() ||
            c.category.toLowerCase().includes(activeTab.toLowerCase()) ||
            activeTab.toLowerCase().includes(c.category.toLowerCase())
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
                {tabs.length > 1 && (
                    <div className={styles['selection__tabs']}>
                        {tabs.map((tab) => {
                            const isActive = activeTab.toLowerCase() === tab.toLowerCase();
                            return (
                                <button
                                    key={tab}
                                    type="button"
                                    className={`${styles['selection__tab']} ${isActive ? styles['selection__tab--active'] : ''
                                        }`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
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
