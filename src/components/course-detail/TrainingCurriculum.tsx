'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from '@/styles/course-detail/TrainingCurriculum.module.css';

/* ── SVGs ── */
const TimelineNodeActive = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={styles['timeline-node-icon']}>
        <circle cx="12" cy="12" r="10.5" fill="#EB943D" stroke="#FFE2A9" strokeWidth="3" />
    </svg>
);

const ModuleBookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62" fill="none" className={styles['module-icon']}>
        <path
            d="M52.9587 41.3333V47.7917C52.9587 52.7775 48.9028 56.8333 43.917 56.8333H18.0837C13.0978 56.8333 9.04199 52.7775 9.04199 47.7917V46.1125C9.04199 42.0567 12.3487 38.75 16.4045 38.75H50.3753C51.7962 38.75 52.9587 39.9125 52.9587 41.3333Z"
            fill="#D8B068"
        />
        <path
            d="M40.042 5.16663H21.9587C11.6253 5.16663 9.04199 7.74996 9.04199 18.0833V37.665C11.0053 35.9341 13.5887 34.875 16.4045 34.875H50.3753C51.7962 34.875 52.9587 33.7125 52.9587 32.2916V18.0833C52.9587 7.74996 50.3753 5.16663 40.042 5.16663ZM33.5837 27.7708H20.667C19.6078 27.7708 18.7295 26.8925 18.7295 25.8333C18.7295 24.7741 19.6078 23.8958 20.667 23.8958H33.5837C34.6428 23.8958 35.5212 24.7741 35.5212 25.8333C35.5212 26.8925 34.6428 27.7708 33.5837 27.7708ZM41.3337 18.7291H20.667C19.6078 18.7291 18.7295 17.8508 18.7295 16.7916C18.7295 15.7325 19.6078 14.8541 20.667 14.8541H41.3337C42.3928 14.8541 43.2712 15.7325 43.2712 16.7916C43.2712 17.8508 42.3928 18.7291 41.3337 18.7291Z"
            fill="#D8B068"
        />
    </svg>
);

const NumberCircle01 = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 49 49" fill="none" className={styles['lesson-number-icon']}>
        <path
            d="M24.375 0C19.5541 0 14.8414 1.42957 10.833 4.10793C6.82454 6.78629 3.70033 10.5931 1.85545 15.0471C0.0105613 19.501 -0.472145 24.402 0.46837 29.1303C1.40888 33.8586 3.73038 38.2018 7.13928 41.6107C10.5482 45.0196 14.8914 47.3411 19.6197 48.2816C24.348 49.2222 29.249 48.7394 33.7029 46.8946C38.1569 45.0497 41.9637 41.9255 44.6421 37.917C47.3204 33.9086 48.75 29.1959 48.75 24.375C48.7432 17.9124 46.1729 11.7165 41.6032 7.14681C37.0335 2.57709 30.8376 0.00682458 24.375 0ZM27.1875 35.625C27.1875 36.1223 26.99 36.5992 26.6383 36.9508C26.2867 37.3025 25.8098 37.5 25.3125 37.5C24.8152 37.5 24.3383 37.3025 23.9867 36.9508C23.6351 36.5992 23.4375 36.1223 23.4375 35.625V16.6406L20.7281 18.4477C20.5232 18.5843 20.2933 18.6793 20.0516 18.7271C19.8099 18.7749 19.5612 18.7746 19.3196 18.7263C19.078 18.678 18.8483 18.5826 18.6436 18.4455C18.4389 18.3084 18.2632 18.1323 18.1266 17.9273C17.9899 17.7224 17.895 17.4925 17.8472 17.2508C17.7994 17.0091 17.7996 16.7604 17.8479 16.5188C17.8962 16.2772 17.9917 16.0475 18.1288 15.8428C18.2658 15.6381 18.4419 15.4624 18.6469 15.3258L24.2719 11.5758C24.5535 11.3879 24.8807 11.2797 25.2189 11.2628C25.557 11.2459 25.8934 11.3209 26.1923 11.4797C26.4913 11.6386 26.7417 11.8754 26.9169 12.1651C27.0921 12.4547 27.1856 12.7865 27.1875 13.125V35.625Z"
            fill="#B7B2AA"
        />
    </svg>
);

const PlayIconOrange = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 42 42" fill="none">
        <g clipPath="url(#clip_play)">
            <path
                d="M4.74289 29.7849L7.78789 23.6949C8.62789 21.9974 8.62789 20.0199 7.78789 18.3224L4.74289 12.2149C2.13539 6.99989 7.75289 1.48739 12.9154 4.21739L15.6104 5.65239C15.9954 5.84489 16.2929 6.15989 16.4504 6.54489L26.4079 28.6824C26.8104 29.5924 26.4429 30.6599 25.5679 31.1149L12.8979 37.7824C7.75289 40.5124 2.13539 34.9999 4.74289 29.7849Z"
                fill="#F09E1C"
            />
            <path
                d="M28.5422 27.3L22.0147 12.81C21.2797 11.1825 23.0297 9.53755 24.6047 10.3775L34.7022 15.6975C38.9897 17.955 38.9897 24.08 34.7022 26.3375L31.1322 28.21C30.1697 28.7 28.9972 28.2975 28.5422 27.3Z"
                fill="#F09E1C"
            />
        </g>
        <defs>
            <clipPath id="clip_play">
                <rect width="42" height="42" fill="white" />
            </clipPath>
        </defs>
    </svg>
);

const LockIconRed = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 36 36" fill="none">
        <path
            d="M17.9997 26.025C19.35 26.025 20.4447 24.9303 20.4447 23.58C20.4447 22.2297 19.35 21.135 17.9997 21.135C16.6494 21.135 15.5547 22.2297 15.5547 23.58C15.5547 24.9303 16.6494 26.025 17.9997 26.025Z"
            fill="#D0442F"
        />
        <path
            d="M27.42 14.295V12.42C27.42 8.37 26.445 3 18 3C9.555 3 8.58 8.37 8.58 12.42V14.295C4.38 14.82 3 16.95 3 22.185V24.975C3 31.125 4.875 33 11.025 33H24.975C31.125 33 33 31.125 33 24.975V22.185C33 16.95 31.62 14.82 27.42 14.295ZM18 28.11C15.495 28.11 13.47 26.07 13.47 23.58C13.47 21.075 15.51 19.05 18 19.05C20.49 19.05 22.53 21.09 22.53 23.58C22.53 26.085 20.505 28.11 18 28.11ZM11.025 14.16C10.905 14.16 10.8 14.16 10.68 14.16V12.42C10.68 8.025 11.925 5.1 18 5.1C24.075 5.1 25.32 8.025 25.32 12.42V14.175C25.2 14.175 25.095 14.175 24.975 14.175H11.025V14.16Z"
            fill="#D0442F"
        />
    </svg>
);

const DotDividerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" className={styles['meta-dot']}>
        <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="#595349" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ChevronDownIcon = ({ isOpen }: { isOpen: boolean }) => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
    >
        <path d="M6 9L12 15L18 9" stroke="#A2711B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 6H16.5M16.5 6L11.5 1M16.5 6L11.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

interface ModuleLesson {
    id: string;
    number: string;
    title: string;
    videos: number;
    exercises: number;
    duration: string;
    isLocked?: boolean;
}

interface CurriculumModule {
    id: string;
    moduleNumber: string;
    title: string;
    lessonsCount: string;
    lessons: ModuleLesson[];
}

const MODULES_DATA: CurriculumModule[] = [
    {
        id: 'module-01',
        moduleNumber: 'Module 01: Theory',
        title: 'Theory',
        lessonsCount: '3 lessons',
        lessons: [
            {
                id: 'l1',
                number: '01',
                title: 'Introduction to HydraFacial Technology',
                videos: 2,
                exercises: 1,
                duration: '45 min',
                isLocked: false,
            },
            {
                id: 'l2',
                number: '02',
                title: 'Structure & Working Principles of HydraFacial Machine',
                videos: 3,
                exercises: 1,
                duration: '60 min',
                isLocked: true,
            },
            {
                id: 'l3',
                number: '03',
                title: "HydraFacial's Exclusive Serums and Specialized Tips",
                videos: 2,
                exercises: 2,
                duration: '50 min',
                isLocked: true,
            },
        ],
    },
    {
        id: 'module-02',
        moduleNumber: 'Module 02: Professional Practice',
        title: 'Professional Practice',
        lessonsCount: '4 lessons',
        lessons: [
            {
                id: 'l4',
                number: '04',
                title: 'Sterilization Protocols & Machine Setup',
                videos: 2,
                exercises: 1,
                duration: '40 min',
                isLocked: true,
            },
            {
                id: 'l5',
                number: '05',
                title: 'Live Model Step-by-Step Execution',
                videos: 4,
                exercises: 2,
                duration: '90 min',
                isLocked: true,
            },
        ],
    },
    {
        id: 'module-03',
        moduleNumber: 'Module 03: Advanced Applications',
        title: 'Advanced Applications',
        lessonsCount: '3 lessons',
        lessons: [
            {
                id: 'l6',
                number: '06',
                title: 'Customized Treatment for Sensitive & Acne Skin',
                videos: 3,
                exercises: 1,
                duration: '55 min',
                isLocked: true,
            },
        ],
    },
    {
        id: 'module-04',
        moduleNumber: 'Module 04: Business & Consultation',
        title: 'Business',
        lessonsCount: '2 lessons',
        lessons: [
            {
                id: 'l7',
                number: '07',
                title: 'Client Consultation & Menu Pricing Strategy',
                videos: 2,
                exercises: 1,
                duration: '45 min',
                isLocked: true,
            },
        ],
    },
];

export default function TrainingCurriculum() {
    const [openModuleId, setOpenModuleId] = useState<string>('module-01');

    const toggleModule = (id: string) => {
        setOpenModuleId(prev => (prev === id ? '' : id));
    };

    return (
        <section className={styles['training-section']}>
            <div className={styles['training-section__container']}>
                {/* ── LEFT BOX: Timeline Card with gradient and drop shadow ── */}
                <div className={styles['training-left']}>
                    <h3 className={styles['training-left__heading']}>TRAINING PROCESS</h3>

                    <div className={styles['timeline']}>
                        {/* 1. Theory */}
                        <div className={styles['timeline__item']}>
                            <div className={styles['timeline__indicator']}>
                                <TimelineNodeActive />
                                <div className={styles['timeline__line']} />
                            </div>
                            <div className={styles['timeline__content']}>
                                <h4 className={styles['timeline__title']}>Theory</h4>
                                <ul className={styles['timeline__bullets']}>
                                    <li>An overview of HydraFacial technology and its history.</li>
                                    <li>The structure and working principles of the HydraFacial machine.</li>
                                    <li>A detailed analysis of HydraFacial&apos;s exclusive serums and specialized tips.</li>
                                </ul>
                            </div>
                        </div>

                        {/* 2. Professional Practice */}
                        <div className={styles['timeline__item']}>
                            <div className={styles['timeline__indicator']}>
                                <TimelineNodeActive />
                                <div className={styles['timeline__line']} />
                            </div>
                            <div className={styles['timeline__content']}>
                                <h4 className={styles['timeline__title']}>Professional Practice</h4>
                            </div>
                        </div>

                        {/* 3. Advanced Applications */}
                        <div className={styles['timeline__item']}>
                            <div className={styles['timeline__indicator']}>
                                <TimelineNodeActive />
                                <div className={styles['timeline__line']} />
                            </div>
                            <div className={styles['timeline__content']}>
                                <h4 className={styles['timeline__title']}>Advanced Applications</h4>
                            </div>
                        </div>

                        {/* 4. Business */}
                        <div className={styles['timeline__item']}>
                            <div className={styles['timeline__indicator']}>
                                <TimelineNodeActive />
                            </div>
                            <div className={styles['timeline__content']}>
                                <h4 className={styles['timeline__title']}>Business</h4>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT BOX: Module Dropdown Accordions & Action Buttons ── */}
                <div className={styles['training-right']}>
                    <div className={styles['modules-list']}>
                        {MODULES_DATA.map(moduleItem => {
                            const isOpen = openModuleId === moduleItem.id;

                            return (
                                <div
                                    key={moduleItem.id}
                                    className={`${styles['module-card']} ${isOpen ? styles['module-card--open'] : ''}`}
                                >
                                    {/* Module Header / Trigger */}
                                    <button
                                        type="button"
                                        className={styles['module-card__header']}
                                        onClick={() => toggleModule(moduleItem.id)}
                                        aria-expanded={isOpen}
                                    >
                                        <div className={styles['module-card__header-left']}>
                                            <ModuleBookIcon />
                                            <span className={styles['module-card__module-title']}>
                                                {moduleItem.moduleNumber}
                                            </span>
                                        </div>
                                        <div className={styles['module-card__header-right']}>
                                            <ChevronDownIcon isOpen={isOpen} />
                                        </div>
                                    </button>

                                    {/* Module Lessons Dropdown Content */}
                                    {isOpen && (
                                        <div className={styles['module-card__body']}>
                                            {moduleItem.lessons.map(lesson => (
                                                <div key={lesson.id} className={styles['lesson-item']}>
                                                    <div className={styles['lesson-item__left']}>
                                                        <NumberCircle01 />
                                                        <div className={styles['lesson-item__info']}>
                                                            <h5 className={styles['lesson-item__title']}>
                                                                {lesson.title}
                                                            </h5>
                                                            <div className={styles['lesson-item__meta']}>
                                                                <span>{lesson.videos} videos</span>
                                                                <DotDividerIcon />
                                                                <span>{lesson.exercises} exercise</span>
                                                                <DotDividerIcon />
                                                                <span>{lesson.duration}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className={styles['lesson-item__right']}>
                                                        {lesson.isLocked ? (
                                                            <LockIconRed />
                                                        ) : (
                                                            <PlayIconOrange />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* ── 2 Action Buttons (Outlined & Dark) ── */}
                    <div className={styles['training-actions']}>
                        <Link
                            href="#preview-class"
                            className={`${styles['training-btn']} ${styles['training-btn--primary']}`}
                        >
                            <span>PREVIEW CLASS</span>
                            <ArrowRightIcon />
                        </Link>
                        <Link
                            href="#register"
                            className={`${styles['training-btn']} ${styles['training-btn--secondary']}`}
                        >
                            <span>REGISTRATION NOW!</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
