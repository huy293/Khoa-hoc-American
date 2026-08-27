'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from '@/styles/course/CourseSelection.module.css';

/* ── Star SVG Icon ── */
const StarIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="15"
        viewBox="0 0 16 15"
        fill="none"
        className={styles['course-card__star-icon']}
    >
        <path
            d="M7.6084 0L9.40451 5.52786H15.2169L10.5146 8.94427L12.3107 14.4721L7.6084 11.0557L2.90612 14.4721L4.70223 8.94427L-5.38826e-05 5.52786H5.81229L7.6084 0Z"
            fill="#FF9C00"
        />
    </svg>
);

/* ── Book SVG Icon ── */
const BookIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className={styles['course-card__meta-icon']}
    >
        <path
            d="M6.6665 1.33325V6.66658L8.6665 4.66659L10.6665 6.66658V1.33325M2.6665 12.9999V2.99992C2.6665 2.55789 2.8421 2.13397 3.15466 1.82141C3.46722 1.50885 3.89114 1.33325 4.33317 1.33325H12.6665C12.8433 1.33325 13.0129 1.40349 13.1379 1.52851C13.2629 1.65354 13.3332 1.82311 13.3332 1.99992V11.3333M2.6665 12.9999C2.6665 13.4419 2.8421 13.8659 3.15466 14.1784C3.46722 14.491 3.89114 14.6666 4.33317 14.6666H12.6665C12.8433 14.6666 13.0129 14.5963 13.1379 14.4713C13.2629 14.3463 13.3332 14.1767 13.3332 13.9999V11.3333M2.6665 12.9999C2.6665 12.5579 2.8421 12.134 3.15466 11.8214C3.46722 11.5088 3.89114 11.3333 4.33317 11.3333H13.3332"
            stroke="#8A7043"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

/* ── Clock SVG Icon ── */
const ClockIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className={styles['course-card__meta-icon']}
    >
        <circle cx="8" cy="8" r="6.5" stroke="#8A7043" strokeWidth="1.2" />
        <path d="M8 4.5V8L10.5 9.5" stroke="#8A7043" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
);

/* ── Timeline Dot SVG ── */
const TimelineDotIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className={styles['course-card__timeline-dot-svg']}
    >
        <circle cx="8" cy="8" r="6.5" fill="#EB943D" stroke="#FFE2A9" strokeWidth="3" />
    </svg>
);

/* ── Arrow Small Icon ── */
const ArrowSmallIcon = () => (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M1 5H13M13 5L9 1M13 5L9 9"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

/* ── Chevron Down Icon ── */
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
    lessons: string;
    duration: string;
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
        lessons: '12 lessons',
        duration: '3 weeks',
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
        lessons: '12 lessons',
        duration: '3 weeks',
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
        lessons: '12 lessons',
        duration: '3 weeks',
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
        lessons: '12 lessons',
        duration: '3 weeks',
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
        lessons: '12 lessons',
        duration: '3 weeks',
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
        lessons: '12 lessons',
        duration: '3 weeks',
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
        lessons: '12 lessons',
        duration: '3 weeks',
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
        lessons: '12 lessons',
        duration: '3 weeks',
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
                                className={`${styles['selection__tab']} ${
                                    isActive ? styles['selection__tab--active'] : ''
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
                        <div key={`${course.id}-${idx}`} className={styles['course-card']}>
                            {/* Card Image */}
                            <Link href="/courses/hydra-facial" className={styles['course-card__image-wrap']}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={course.image}
                                    alt={course.title}
                                    className={styles['course-card__image']}
                                />
                            </Link>

                            {/* Tag & Rating Row */}
                            <div className={styles['course-card__tag-rating']}>
                                <span className={styles['course-card__tag']}>{course.tag}</span>
                                <div className={styles['course-card__rating']}>
                                    <StarIcon />
                                    <span className={styles['course-card__score']}>{course.rating}</span>
                                    <span className={styles['course-card__trainee']}>
                                        {course.traineeCount}
                                    </span>
                                </div>
                            </div>

                            {/* Title & Subtitle */}
                            <Link href="/courses/hydra-facial" style={{ textDecoration: 'none' }}>
                                <h3 className={styles['course-card__title']}>{course.title}</h3>
                            </Link>
                            <p className={styles['course-card__subtitle']}>{course.subtitle}</p>

                            {/* Content Box / Training Process */}
                            <div className={styles['course-card__process-box']}>
                                <div className={styles['course-card__process-header']}>
                                    <span className={styles['course-card__process-title']}>
                                        TRAINING PROCESS
                                    </span>
                                    <div className={styles['course-card__process-meta']}>
                                        <div className={styles['course-card__meta-item']}>
                                            <BookIcon />
                                            <span>{course.lessons}</span>
                                        </div>
                                        <div className={styles['course-card__meta-item']}>
                                            <ClockIcon />
                                            <span>{course.duration}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles['course-card__process-divider']} />

                                {/* Vertical Timeline Stepper */}
                                <div className={styles['course-card__timeline']}>
                                    <div className={styles['course-card__timeline-line']} />
                                    {course.curriculum.map((step, sIdx) => (
                                        <div key={sIdx} className={styles['course-card__timeline-step']}>
                                            <div className={styles['course-card__timeline-dot-wrap']}>
                                                <TimelineDotIcon />
                                            </div>
                                            <span className={styles['course-card__timeline-text']}>
                                                {step}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className={styles['course-card__process-divider']} />

                                {/* Preview Class Link */}
                                <Link href="/courses/hydra-facial" className={styles['course-card__preview-link']}>
                                    <span>PREVIEW CLASS</span>
                                    <ArrowSmallIcon />
                                </Link>
                            </div>

                            {/* Bottom Card Footer: Trainer & CTA */}
                            <div className={styles['course-card__footer']}>
                                <div className={styles['course-card__trainer']}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={course.trainer.avatar}
                                        alt={course.trainer.name}
                                        className={styles['course-card__trainer-avatar']}
                                    />
                                    <div className={styles['course-card__trainer-info']}>
                                        <span className={styles['course-card__trainer-name']}>
                                            {course.trainer.name}
                                        </span>
                                        <div className={styles['course-card__trainer-rating']}>
                                            <StarIcon />
                                            <span>{course.trainer.rating}</span>
                                        </div>
                                    </div>
                                </div>

                                <Link href="/courses/hydra-facial" className={styles['course-card__cta-btn']} style={{ textDecoration: 'none' }}>
                                    REGISTRATION NOW!
                                </Link>
                            </div>
                        </div>
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
