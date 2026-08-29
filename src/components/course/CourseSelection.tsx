'use client';

import React, { useState } from 'react';
import styles from '@/styles/course/CourseSelection.module.css';
import CourseCard from '@/components/cards/CourseCard';

/* ── Chevron Down Icon for Load More ── */
const ChevronDownIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

interface CourseItem {
    id: string;
    image: string;
    tag: string;
    rating: string;
    traineeCount: string;
    title: string;
    subtitle: string;
    module: string;
    lessons: string;
    quizzes: string;
    curriculum: string[];
    trainer: {
        name: string;
        avatar: string;
        rating: string;
    };
    category: string;
}

const COURSES_DATA: CourseItem[] = [
    {
        id: '1',
        image: '/images/courses/card-hydra.jpg',
        tag: 'Facial class',
        rating: '4.9/5.0',
        traineeCount: '(2.700+ trainee)',
        title: 'HYDRA FACIAL',
        subtitle: 'Professional HydraFacial Training',
        module: '4 modules',
        lessons: '12 lessons',
        quizzes: '3 quizzes',
        curriculum: ['Theory', 'Professional Practice', 'Advanced Applications', 'Business'],
        trainer: {
            name: 'Kathleen trainer',
            avatar: '/images/home/kathleen.png',
            rating: '4.9/5.0',
        },
        category: 'CERTIFICATE TRAINING',
    },
    {
        id: '2',
        image: '/images/courses/card-advance.jpg',
        tag: 'Facial class',
        rating: '4.9/5.0',
        traineeCount: '(2.700+ trainee)',
        title: 'ADVENCE FACIAL',
        subtitle: 'Professional HydraFacial Training',
        module: '4 modules',
        lessons: '12 lessons',
        quizzes: '3 quizzes',
        curriculum: ['Theory', 'Professional Practice', 'Advanced Applications', 'Business'],
        trainer: {
            name: 'Kathleen trainer',
            avatar: '/images/home/kathleen.png',
            rating: '4.9/5.0',
        },
        category: 'CERTIFICATE TRAINING',
    },
    {
        id: '3',
        image: '/images/courses/card-hydra.jpg',
        tag: 'Facial class',
        rating: '4.9/5.0',
        traineeCount: '(2.700+ trainee)',
        title: 'HYDRA FACIAL',
        subtitle: 'Professional HydraFacial Training',
        module: '4 modules',
        lessons: '12 lessons',
        quizzes: '3 quizzes',
        curriculum: ['Theory', 'Professional Practice', 'Advanced Applications', 'Business'],
        trainer: {
            name: 'Kathleen trainer',
            avatar: '/images/home/kathleen.png',
            rating: '4.9/5.0',
        },
        category: 'CERTIFICATE TRAINING',
    },
    {
        id: '4',
        image: '/images/courses/card-derma.jpg',
        tag: 'Facial class',
        rating: '4.9/5.0',
        traineeCount: '(2.700+ trainee)',
        title: 'DERMA PLANNING',
        subtitle: 'Professional HydraFacial Training',
        module: '4 modules',
        lessons: '12 lessons',
        quizzes: '3 quizzes',
        curriculum: ['Theory', 'Professional Practice', 'Advanced Applications', 'Business'],
        trainer: {
            name: 'Kathleen trainer',
            avatar: '/images/home/kathleen.png',
            rating: '4.9/5.0',
        },
        category: 'CERTIFICATE TRAINING',
    },
    {
        id: '5',
        image: '/images/courses/card-towel.jpg',
        tag: 'Facial class',
        rating: '4.9/5.0',
        traineeCount: '(2.700+ trainee)',
        title: 'HYDRA FACIAL',
        subtitle: 'Professional HydraFacial Training',
        module: '4 modules',
        lessons: '12 lessons',
        quizzes: '3 quizzes',
        curriculum: ['Theory', 'Professional Practice', 'Advanced Applications', 'Business'],
        trainer: {
            name: 'Kathleen trainer',
            avatar: '/images/home/kathleen.png',
            rating: '4.9/5.0',
        },
        category: 'CERTIFICATE TRAINING',
    },
    {
        id: '6',
        image: '/images/courses/card-advance.jpg',
        tag: 'Facial class',
        rating: '4.9/5.0',
        traineeCount: '(2.700+ trainee)',
        title: 'ADVENCE FACIAL',
        subtitle: 'Professional HydraFacial Training',
        module: '4 modules',
        lessons: '12 lessons',
        quizzes: '3 quizzes',
        curriculum: ['Theory', 'Professional Practice', 'Advanced Applications', 'Business'],
        trainer: {
            name: 'Kathleen trainer',
            avatar: '/images/home/kathleen.png',
            rating: '4.9/5.0',
        },
        category: 'CERTIFICATE TRAINING',
    },
    {
        id: '7',
        image: '/images/courses/card-hydra.jpg',
        tag: 'Facial class',
        rating: '4.9/5.0',
        traineeCount: '(2.700+ trainee)',
        title: 'HYDRA FACIAL',
        subtitle: 'Professional HydraFacial Training',
        module: '4 modules',
        lessons: '12 lessons',
        quizzes: '3 quizzes',
        curriculum: ['Theory', 'Professional Practice', 'Advanced Applications', 'Business'],
        trainer: {
            name: 'Kathleen trainer',
            avatar: '/images/home/kathleen.png',
            rating: '4.9/5.0',
        },
        category: 'CERTIFICATE TRAINING',
    },
    {
        id: '8',
        image: '/images/courses/card-derma.jpg',
        tag: 'Facial class',
        rating: '4.9/5.0',
        traineeCount: '(2.700+ trainee)',
        title: 'DERMA PLANNING',
        subtitle: 'Professional HydraFacial Training',
        module: '4 modules',
        lessons: '12 lessons',
        quizzes: '3 quizzes',
        curriculum: ['Theory', 'Professional Practice', 'Advanced Applications', 'Business'],
        trainer: {
            name: 'Kathleen trainer',
            avatar: '/images/home/kathleen.png',
            rating: '4.9/5.0',
        },
        category: 'CERTIFICATE TRAINING',
    },
];

const TABS = [
    'ALL COURSE',
    'CERTIFICATE TRAINING',
    'LASER TRAINING COURSES',
    'P.M.U TRAINING COURSES',
];

export default function CourseSelection() {
    const [activeTab, setActiveTab] = useState('CERTIFICATE TRAINING');

    return (
        <section className={styles['selection']}>
            <div className={styles['selection__container']}>
                {/* 1. Eyebrow */}
                <div className={styles['selection__eyebrow-wrapper']}>
                    <p className={styles['selection__eyebrow']}>SELECTION OF COURSE</p>
                    <div className={styles['selection__eyebrow-line']} />
                </div>

                {/* 2. Heading */}
                <h2 className={styles['selection__title']}>
                    Master Your Craft. <br />
                    Build Your Beauty Career.
                </h2>

                {/* 3. Category Filter Tabs */}
                <div className={styles['selection__tabs']}>
                    {TABS.map((tab) => {
                        const isActive = activeTab === tab;
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

                {/* 4. Course Cards Grid */}
                <div className={styles['selection__grid']}>
                    {COURSES_DATA.map((course, idx) => (
                        <CourseCard
                            key={`${course.id}-${idx}`}
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
                        />
                    ))}
                </div>

                {/* 5. Load More Action */}
                <div className={styles['selection__load-more']}>
                    <button type="button" className={styles['selection__load-more-btn']}>
                        <ChevronDownIcon />
                        <span>Load more</span>
                    </button>
                </div>
            </div>
        </section>
    );
}
