'use client';

import React from 'react';
import Link from 'next/link';
import styles from '@/styles/card/CourseCard.module.css';

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

/* ── Module SVG Icon ── */
const ModuleIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.3335 12.4999C2.06016 12.4999 1.8335 12.2733 1.8335 11.9999V4.66659C1.8335 1.72659 2.72683 0.833252 5.66683 0.833252H10.3335C13.2735 0.833252 14.1668 1.72659 14.1668 4.66659V11.3333C14.1668 11.4399 14.1668 11.5399 14.1602 11.6466C14.1402 11.9199 13.8935 12.1333 13.6268 12.1133C13.3535 12.0933 13.1402 11.8533 13.1602 11.5799C13.1668 11.4999 13.1668 11.4133 13.1668 11.3333V4.66659C13.1668 2.28659 12.7202 1.83325 10.3335 1.83325H5.66683C3.28016 1.83325 2.8335 2.28659 2.8335 4.66659V11.9999C2.8335 12.2733 2.60683 12.4999 2.3335 12.4999Z" fill="#8A7043" />
        <path d="M11.3335 15.1667H4.66683C3.10683 15.1667 1.8335 13.8933 1.8335 12.3333V11.9C1.8335 10.5733 2.9135 9.5 4.2335 9.5H13.6668C13.9402 9.5 14.1668 9.72667 14.1668 10V12.3333C14.1668 13.8933 12.8935 15.1667 11.3335 15.1667ZM4.2335 10.5C3.46016 10.5 2.8335 11.1267 2.8335 11.9V12.3333C2.8335 13.3467 3.6535 14.1667 4.66683 14.1667H11.3335C12.3468 14.1667 13.1668 13.3467 13.1668 12.3333V10.5H4.2335Z" fill="#8A7043" />
        <path d="M10.6668 5.16675H5.3335C5.06016 5.16675 4.8335 4.94008 4.8335 4.66675C4.8335 4.39341 5.06016 4.16675 5.3335 4.16675H10.6668C10.9402 4.16675 11.1668 4.39341 11.1668 4.66675C11.1668 4.94008 10.9402 5.16675 10.6668 5.16675Z" fill="#8A7043" />
        <path d="M8.66683 7.5H5.3335C5.06016 7.5 4.8335 7.27333 4.8335 7C4.8335 6.72667 5.06016 6.5 5.3335 6.5H8.66683C8.94016 6.5 9.16683 6.72667 9.16683 7C9.16683 7.27333 8.94016 7.5 8.66683 7.5Z" fill="#8A7043" />
    </svg>
);

/* ── Quiz SVG Icon ── */
const QuizIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.5 2.625H2.5C2.26794 2.625 2.04538 2.71719 1.88128 2.88128C1.71719 3.04538 1.625 3.26794 1.625 3.5V13.5C1.62498 13.5639 1.6413 13.6268 1.6724 13.6826C1.7035 13.7384 1.74835 13.7854 1.80271 13.819C1.85706 13.8526 1.9191 13.8718 1.98294 13.8747C2.04679 13.8776 2.11032 13.8642 2.1675 13.8356L4 12.9194L5.8325 13.8356C5.88452 13.8616 5.94186 13.8751 6 13.8751C6.05814 13.8751 6.11548 13.8616 6.1675 13.8356L8 12.9194L9.8325 13.8356C9.88452 13.8616 9.94186 13.8751 10 13.8751C10.0581 13.8751 10.1155 13.8616 10.1675 13.8356L12 12.9194L13.8325 13.8356C13.8845 13.8616 13.9419 13.875 14 13.875C14.0696 13.8751 14.1378 13.8556 14.1969 13.8188C14.2513 13.7852 14.2962 13.7383 14.3274 13.6825C14.3585 13.6267 14.3749 13.5639 14.375 13.5V3.5C14.375 3.26794 14.2828 3.04538 14.1187 2.88128C13.9546 2.71719 13.7321 2.625 13.5 2.625ZM13.625 12.8931L12.1675 12.1644C12.1155 12.1384 12.0581 12.1249 12 12.1249C11.9419 12.1249 11.8845 12.1384 11.8325 12.1644L10 13.0806L8.1675 12.1644C8.11548 12.1384 8.05814 12.1249 8 12.1249C7.94186 12.1249 7.88452 12.1384 7.8325 12.1644L6 13.0806L4.1675 12.1644C4.11548 12.1384 4.05814 12.1249 4 12.1249C3.94186 12.1249 3.88452 12.1384 3.8325 12.1644L2.375 12.8931V3.5C2.375 3.46685 2.38817 3.43505 2.41161 3.41161C2.43505 3.38817 2.46685 3.375 2.5 3.375H13.5C13.5332 3.375 13.5649 3.38817 13.5884 3.41161C13.6118 3.43505 13.625 3.46685 13.625 3.5V12.8931ZM6.33563 5.83063C6.30452 5.76822 6.25664 5.71573 6.19735 5.67903C6.13807 5.64234 6.06972 5.6229 6 5.6229C5.93028 5.6229 5.86193 5.64234 5.80265 5.67903C5.74336 5.71573 5.69548 5.76822 5.66437 5.83063L3.66438 9.83062C3.64238 9.8747 3.62928 9.92268 3.62582 9.97181C3.62237 10.021 3.62862 10.0703 3.64424 10.117C3.65985 10.1637 3.68451 10.2069 3.71681 10.2441C3.74911 10.2813 3.78843 10.3118 3.8325 10.3337C3.87657 10.3557 3.92455 10.3688 3.97369 10.3723C4.02283 10.3758 4.07216 10.3695 4.11888 10.3539C4.1656 10.3383 4.20879 10.3136 4.24598 10.2813C4.28317 10.249 4.31363 10.2097 4.33563 10.1656L4.73187 9.375H7.26813L7.66437 10.1675C7.7088 10.2565 7.78676 10.3242 7.88112 10.3558C7.97547 10.3873 8.07849 10.38 8.1675 10.3356C8.25651 10.2912 8.32423 10.2132 8.35576 10.1189C8.38729 10.0245 8.38005 9.92151 8.33562 9.8325L6.33563 5.83063ZM5.10687 8.625L6 6.83875L6.89313 8.625H5.10687ZM12.375 8C12.375 8.09946 12.3355 8.19484 12.2652 8.26517C12.1948 8.33549 12.0995 8.375 12 8.375H10.875V9.5C10.875 9.59946 10.8355 9.69484 10.7652 9.76517C10.6948 9.83549 10.5995 9.875 10.5 9.875C10.4005 9.875 10.3052 9.83549 10.2348 9.76517C10.1645 9.69484 10.125 9.59946 10.125 9.5V8.375H9C8.90054 8.375 8.80516 8.33549 8.73483 8.26517C8.66451 8.19484 8.625 8.09946 8.625 8C8.625 7.90054 8.66451 7.80516 8.73483 7.73484C8.80516 7.66451 8.90054 7.625 9 7.625H10.125V6.5C10.125 6.40054 10.1645 6.30516 10.2348 6.23484C10.3052 6.16451 10.4005 6.125 10.5 6.125C10.5995 6.125 10.6948 6.16451 10.7652 6.23484C10.8355 6.30516 10.875 6.40054 10.875 6.5V7.625H12C12.0995 7.625 12.1948 7.66451 12.2652 7.73484C12.3355 7.80516 12.375 7.90054 12.375 8Z" fill="#8A7043" />
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

/* ── Play SVG Icon ── */
const PlayIcon = () => (
    <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m3.162 19.857 2.03-4.06c.56-1.132.56-2.45 0-3.582l-2.03-4.071C1.423 4.667 5.168.992 8.61 2.812l1.797.957c.256.128.455.338.56.595l6.638 14.758a1.255 1.255 0 0 1-.56 1.622l-8.447 4.445c-3.43 1.82-7.175-1.855-5.436-5.332M19.028 18.2l-4.351-9.66c-.49-1.084.676-2.181 1.726-1.621l6.732 3.547c2.858 1.505 2.858 5.588 0 7.093l-2.38 1.248a1.26 1.26 0 0 1-1.727-.606" fill="#c28200" /></svg>
);

/* ── Students Group SVG Icon ── */
const StudentsGroupIcon = () => (
    <svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 14C14.2091 14 16 12.2091 16 10C16 7.79086 14.2091 6 12 6C9.79086 6 8 7.79086 8 10C8 12.2091 9.79086 14 12 14ZM21 15C22.6569 15 24 13.6569 24 12C24 10.3431 22.6569 9 21 9C19.3431 9 18 10.3431 18 12C18 13.6569 19.3431 15 21 15ZM12 17C8.68629 17 4 18.67 4 22V24C4 24.5523 4.44772 25 5 25H19C19.5523 25 20 24.5523 20 24V22C20 18.67 15.3137 17 12 17ZM21 18C20.66 18 20.29 18.02 19.91 18.06C21.19 19.14 22 20.48 22 22V24C22 24.36 21.94 24.7 21.84 25H27C27.5523 25 28 24.5523 28 24V22C28 19.33 23.97 18 21 18Z" fill="white" />
    </svg>
);

/* ── Laptop Device SVG Icon ── */
const LaptopDeviceIcon = () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M26.25 21H25.375V6.125C25.375 5.66087 25.1906 5.21575 24.8624 4.88756C24.5342 4.55937 24.0891 4.375 23.625 4.375H4.375C3.91087 4.375 3.46575 4.55937 3.13756 4.88756C2.80937 5.21575 2.625 5.66087 2.625 6.125V21H1.75C1.51794 21 1.29538 21.0922 1.13128 21.2563C0.967187 21.4204 0.875 21.6429 0.875 21.875C0.875 22.1071 0.967187 22.3296 1.13128 22.4937C1.29538 22.6578 1.51794 22.75 1.75 22.75H26.25C26.4821 22.75 26.7046 22.6578 26.8687 22.4937C27.0328 22.3296 27.125 22.1071 27.125 21.875C27.125 21.6429 27.0328 21.4204 26.8687 21.2563C26.7046 21.0922 26.4821 21 26.25 21ZM23.625 21H15.75V19.25C15.75 19.0179 15.8422 18.7954 16.0063 18.6313C16.1704 18.4672 16.3929 18.375 16.625 18.375H22.75C22.9821 18.375 23.2046 18.4672 23.3687 18.6313C23.5328 18.7954 23.625 19.0179 23.625 19.25V21ZM23.625 15.75C23.625 15.9821 23.5328 16.2046 23.3687 16.3687C23.2046 16.5328 22.9821 16.625 22.75 16.625C22.5179 16.625 22.2954 16.5328 22.1313 16.3687C21.9672 16.2046 21.875 15.9821 21.875 15.75V7.875H6.125V20.125C6.125 20.3571 6.03281 20.5796 5.86872 20.7437C5.70462 20.9078 5.48206 21 5.25 21C5.01794 21 4.79538 20.9078 4.63128 20.7437C4.46719 20.5796 4.375 20.3571 4.375 20.125V7C4.375 6.76794 4.46719 6.54538 4.63128 6.38128C4.79538 6.21719 5.01794 6.125 5.25 6.125H22.75C22.9821 6.125 23.2046 6.21719 23.3687 6.38128C23.5328 6.54538 23.625 6.76794 23.625 7V15.75Z" fill="#C28200" />
    </svg>

);

export interface CourseTrainer {
    name: string;
    avatar: string;
    rating: string;
}

export interface CourseCardProps {
    id?: string;
    image: string;
    imageAlt?: string;
    tag: string;
    rating: string;
    traineeCount: string;
    title: string;
    subtitle: string;
    progress?: number;
    module?: string;
    lessons: string;
    quizzes: string;
    curriculum?: string[];
    trainer?: CourseTrainer;
    actionType?: 'register' | 'play';
    ctaText?: string;
    courseUrl?: string;
    previewUrl?: string;
    showPreviewLink?: boolean;
    onPlay?: () => void;
    className?: string;
    variant?: 'student' | 'teacher';
    studentsCount?: number | string;
    studentLabel?: string;
    showProgress?: boolean;
    showTrainingProcess?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({
    image,
    imageAlt,
    tag,
    rating,
    traineeCount,
    title,
    subtitle,
    progress,
    showProgress = true,
    showTrainingProcess = true,
    module,
    lessons,
    quizzes,
    curriculum = [],
    trainer,
    actionType = 'register',
    ctaText,
    courseUrl = '/courses/hydra-facial',
    previewUrl = '/courses/hydra-facial',
    showPreviewLink = true,
    onPlay,
    className = '',
    variant = 'student',
    studentsCount = 145,
    studentLabel = 'Students participated',
}) => {
    return (
        <div className={`${styles['course-card']} ${className}`.trim()}>
            {/* Card Image */}
            <Link href={courseUrl} className={styles['course-card__image-wrap']}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={image}
                    alt={imageAlt || title}
                    className={styles['course-card__image']}
                />
            </Link>

            {/* Tag & Rating Row */}
            <div className={styles['course-card__tag-rating']}>
                <span className={styles['course-card__tag']}>{tag}</span>
                <div className={styles['course-card__rating']}>
                    <StarIcon />
                    <span className={styles['course-card__score']}>{rating}</span>
                    <span className={styles['course-card__trainee']}>{traineeCount}</span>
                </div>
            </div>

            {/* Title & Subtitle */}
            <Link href={courseUrl} style={{ textDecoration: 'none' }}>
                <h3 className={styles['course-card__title']}>{title}</h3>
            </Link>
            <p className={styles['course-card__subtitle']}>{subtitle}</p>

            {/* Optional Progress Bar */}
            {showProgress && progress !== undefined && (
                <div className={styles['course-card__progress-wrap']}>
                    <div className={styles['course-card__progress-track']}>
                        <div
                            className={styles['course-card__progress-fill']}
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <span className={styles['course-card__progress-percent']}>
                        {progress}%
                    </span>
                </div>
            )}

            {/* Content Box / Training Process */}
            {showTrainingProcess && (
                <div className={styles['course-card__process-box']}>
                    <div className={styles['course-card__process-header']}>
                        <span className={styles['course-card__process-title']}>
                            TRAINING PROCESS
                        </span>
                        <div className={styles['course-card__process-meta']}>
                            {module && (
                                <div className={styles['course-card__meta-item']}>
                                    <ModuleIcon />
                                    <span>{module}</span>
                                </div>
                            )}
                            <div className={styles['course-card__meta-item']}>
                                <BookIcon />
                                <span>{lessons}</span>
                            </div>
                            <div className={styles['course-card__meta-item']}>
                                <QuizIcon />
                                <span>{quizzes}</span>
                            </div>
                        </div>
                    </div>

                    {variant !== 'teacher' && (
                        <>
                            <div className={styles['course-card__process-divider']} />

                            {/* Vertical Timeline Stepper */}
                            <div className={styles['course-card__timeline']}>
                                <div className={styles['course-card__timeline-line']} />
                                {curriculum.map((step, sIdx) => (
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

                            {showPreviewLink && (
                                <>
                                    <div className={styles['course-card__process-divider']} />

                                    {/* Preview Class Link */}
                                    <Link href={previewUrl} className={styles['course-card__preview-link']}>
                                        <span>PREVIEW CLASS</span>
                                        <ArrowSmallIcon />
                                    </Link>
                                </>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* Bottom Card Footer: Teacher Variant vs Student Variant */}
            {variant === 'teacher' ? (
                <div className={styles['course-card__teacher-footer']}>
                    <div className={styles['course-card__students-wrap']}>
                        <div className={styles['course-card__students-icon-box']}>
                            <StudentsGroupIcon />
                        </div>
                        <div className={styles['course-card__students-info']}>
                            <span className={styles['course-card__students-label']}>
                                {studentLabel}
                            </span>
                            <span className={styles['course-card__students-count']}>
                                {studentsCount}
                            </span>
                        </div>
                    </div>

                    <Link
                        href={courseUrl}
                        className={styles['course-card__device-btn']}
                        aria-label={`View ${title}`}
                        onClick={onPlay}
                    >
                        <LaptopDeviceIcon />
                    </Link>
                </div>
            ) : (
                <div className={styles['course-card__footer']}>
                    {trainer && (
                        <div className={styles['course-card__trainer']}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={trainer.avatar}
                                alt={trainer.name}
                                className={styles['course-card__trainer-avatar']}
                            />
                            <div className={styles['course-card__trainer-info']}>
                                <span className={styles['course-card__trainer-name']}>
                                    {trainer.name}
                                </span>
                                <div className={styles['course-card__trainer-rating']}>
                                    <StarIcon />
                                    <span>{trainer.rating}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {actionType === 'play' ? (
                        <Link
                            href={courseUrl}
                            className={styles['course-card__play-btn']}
                            aria-label={`Play ${title}`}
                            onClick={onPlay}
                        >
                            <PlayIcon />
                        </Link>
                    ) : (
                        <Link
                            href={courseUrl}
                            className={styles['course-card__cta-btn']}
                            style={{ textDecoration: 'none' }}
                        >
                            {ctaText || 'REGISTRATION NOW!'}
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
};

export default CourseCard;
