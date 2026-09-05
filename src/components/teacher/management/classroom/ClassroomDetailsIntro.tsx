'use client';

import React from 'react';
import styles from '@/styles/teacher/management/classroom/ClassroomDetailsIntro.module.css';
import ManagamentHeaderDetails from '@/components/teacher/management/ManagamentHeaderDetails';

/* ── SVG Icons ── */
const StudentsGroupIcon = () => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <path
            d="M12 14C14.2091 14 16 12.2091 16 10C16 7.79086 14.2091 6 12 6C9.79086 6 8 7.79086 8 10C8 12.2091 9.79086 14 12 14ZM21 15C22.6569 15 24 13.6569 24 12C24 10.3431 22.6569 9 21 9C19.3431 9 18 10.3431 18 12C18 13.6569 19.3431 15 21 15ZM12 17C8.68629 17 4 18.67 4 22V24C4 24.5523 4.44772 25 5 25H19C19.5523 25 20 24.5523 20 24V22C20 18.67 15.3137 17 12 17ZM21 18C20.66 18 20.29 18.02 19.91 18.06C21.19 19.14 22 20.48 22 22V24C22 24.36 21.94 24.7 21.84 25H27C27.5523 25 28 24.5523 28 24V22C28 19.33 23.97 18 21 18Z"
            fill="white"
        />
    </svg>
);

const GraduationCapIcon = () => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <path
            d="M16 6L3 13L16 20L27 14.0769V22H29V13L16 6ZM8 17.7692V23.5C8 25.5 11.5817 27 16 27C20.4183 27 24 25.5 24 23.5V17.7692L16 22.0769L8 17.7692Z"
            fill="white"
        />
    </svg>
);

const ScreenMonitorIcon = () => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <rect x="4" y="6" width="24" height="17" rx="3" stroke="white" strokeWidth="2.2" fill="none" />
        <path d="M11 26H21M16 23V26" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="16" cy="14.5" r="3" fill="white" />
    </svg>
);

const AttendanceIcon = () => (
    <svg
        width="24"
        height="24"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <rect x="5" y="5" width="22" height="22" rx="3" stroke="white" strokeWidth="2.2" fill="none" />
        <circle cx="16" cy="13" r="3" fill="white" />
        <path
            d="M10 21C10 19 12.5 17.5 16 17.5C19.5 17.5 22 19 22 21"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
);

/* ── Interfaces ── */
export interface MetricCardItem {
    id: string;
    number: string | number;
    title: string;
    icon: React.ReactNode;
}

export interface ClassroomDetailsIntroProps {
    backHref?: string;
    title?: React.ReactNode;
    description?: React.ReactNode;
    trainer?: {
        name: string;
        avatar: string;
        rating: string;
    };
    trainerName?: string;
    trainerAvatar?: string;
    trainerRating?: string | number;
    showTrainer?: boolean;
    showTrainerRating?: boolean;
    showBackButton?: boolean;
    backAriaLabel?: string;
    backIcon?: React.ReactNode;
    starIcon?: React.ReactNode;
    rightContent?: React.ReactNode;
    onBackClick?: () => void;
    journeyBadge?: string;
    journeyTitle?: React.ReactNode;
    journeyDesc?: string;
    learningProgress?: number;
    metrics?: MetricCardItem[];
}

function makeMetricCard(id: string, number: string, title: string, icon: React.ReactNode): MetricCardItem {
    return { id, number, title, icon };
}

function getInitialMetrics(): MetricCardItem[] {
    const list: MetricCardItem[] = [];
    list.push(makeMetricCard('students', '0', 'TOTAL STUDENTS', <StudentsGroupIcon />));
    list.push(makeMetricCard('completed', '0', 'TOTAL STUDENTS COMPLETED', <GraduationCapIcon />));
    list.push(makeMetricCard('progress', '0%', 'AVERAGE PROGRESS', <ScreenMonitorIcon />));
    list.push(makeMetricCard('attendance', '100%', 'ATTENDANCE', <AttendanceIcon />));
    return list;
}

export default function ClassroomDetailsIntro({
    backHref = '/teacher/management/classroom',
    title = '',
    description = '',
    trainer,
    trainerName,
    trainerAvatar,
    trainerRating,
    showTrainer = true,
    showTrainerRating = true,
    showBackButton = true,
    backAriaLabel,
    backIcon,
    starIcon,
    rightContent,
    onBackClick,
    journeyBadge = 'Course Learning Journey',
    journeyTitle,
    journeyDesc,
    learningProgress = 0,
    metrics,
}: ClassroomDetailsIntroProps) {
    const displayMetrics = metrics && metrics.length > 0 ? metrics : getInitialMetrics();
    // Gauge calculations for radius = 56 (circumference ≈ 351.86)
    const gaugeRadius = 56;
    const gaugeStrokeWidth = 14;
    const gaugeCircumference = 2 * Math.PI * gaugeRadius;
    const clampedProgress = Math.min(100, Math.max(0, learningProgress));
    const gaugeOffset = gaugeCircumference * (1 - clampedProgress / 100);

    return (
        <section className={styles['classroom-intro']} aria-label="Classroom Details Header">
            <div className={styles['classroom-intro__container']}>
                {/* 1. Top Header: Title, Description & Instructor */}
                <ManagamentHeaderDetails
                    title={title}
                    description={description}
                    backHref={backHref}
                    trainer={trainer}
                    trainerName={trainerName}
                    trainerAvatar={trainerAvatar}
                    trainerRating={trainerRating}
                    showTrainer={showTrainer}
                    showTrainerRating={showTrainerRating}
                    showBackButton={showBackButton}
                    backAriaLabel={backAriaLabel}
                    backIcon={backIcon}
                    starIcon={starIcon}
                    rightContent={rightContent}
                    onBackClick={onBackClick}
                />

                {/* 2. Main Two-Column Dashboard Grid */}
                <div className={styles['classroom-intro__grid']}>
                    {/* Left Card: Continue Your Learning Journey & Circular Gauge */}
                    <div className={styles['journey-card']}>
                        <div className={styles['journey-card__info']}>
                            <div className={styles['journey-card__badge-wrap']}>
                                <span className={styles['journey-card__badge']}>
                                    {journeyBadge}
                                </span>
                                <div className={styles['journey-card__divider']} />
                            </div>

                            <h2 className={styles['journey-card__title']}>{journeyTitle}</h2>
                            <p className={styles['journey-card__desc']}>{journeyDesc}</p>
                        </div>

                        {/* Circular Progress Gauge */}
                        <div
                            className={styles['journey-gauge']}
                            role="progressbar"
                            aria-valuenow={clampedProgress}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={`Learning progress ${clampedProgress}%`}
                        >
                            <svg
                                className={styles['journey-gauge__svg']}
                                viewBox="0 0 150 150"
                            >
                                <circle
                                    className={styles['journey-gauge__track']}
                                    cx="75"
                                    cy="75"
                                    r={gaugeRadius}
                                    strokeWidth={gaugeStrokeWidth}
                                    fill="none"
                                />
                                <circle
                                    className={styles['journey-gauge__fill']}
                                    cx="75"
                                    cy="75"
                                    r={gaugeRadius}
                                    strokeWidth={gaugeStrokeWidth}
                                    fill="none"
                                    strokeDasharray={gaugeCircumference}
                                    strokeDashoffset={gaugeOffset}
                                    strokeLinecap="round"
                                    transform="rotate(-90 75 75)"
                                />
                            </svg>
                            <div className={styles['journey-gauge__content']}>
                                <span className={styles['journey-gauge__percent']}>
                                    {clampedProgress}%
                                </span>
                                <span className={styles['journey-gauge__label']}>
                                    LEARNING
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right 2x2 Metric Cards Grid */}
                    <div className={styles['metrics-grid']}>
                        {displayMetrics.map((item) => (
                            <article key={item.id} className={styles['metric-card']}>
                                <div className={styles['metric-card__top']}>
                                    <div className={styles['metric-card__icon-box']}>
                                        {item.icon}
                                    </div>
                                    <p className={styles['metric-card__number']}>{item.number}</p>
                                </div>
                                <h3 className={styles['metric-card__title']}>{item.title}</h3>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
