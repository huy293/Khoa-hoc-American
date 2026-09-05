'use client';

import React from 'react';
import styles from '@/styles/dashboard/home/ProgressAndCertificate.module.css';

/* ── SVG Icons ── */
const LessonBookIcon = () => (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M41 32v5c0 3.86-3.14 7-7 7H14c-3.86 0-7-3.14-7-7v-1.3c0-3.14 2.56-5.7 5.7-5.7H39c1.1 0 2 .9 2 2M31 4H17C9 4 7 6 7 14v15.16A8.6 8.6 0 0 1 12.7 27H39c1.1 0 2-.9 2-2V14c0-8-2-10-10-10m-5 17.5H16c-.82 0-1.5-.68-1.5-1.5s.68-1.5 1.5-1.5h10c.82 0 1.5.68 1.5 1.5s-.68 1.5-1.5 1.5m6-7H16c-.82 0-1.5-.68-1.5-1.5s.68-1.5 1.5-1.5h16c.82 0 1.5.68 1.5 1.5s-.68 1.5-1.5 1.5" fill="#c28200" /></svg>
);

const PlayIcon = () => (
    <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m3.162 19.857 2.03-4.06c.56-1.132.56-2.45 0-3.582l-2.03-4.071C1.423 4.667 5.168.992 8.61 2.812l1.797.957c.256.128.455.338.56.595l6.638 14.758a1.255 1.255 0 0 1-.56 1.622l-8.447 4.445c-3.43 1.82-7.175-1.855-5.436-5.332M19.028 18.2l-4.351-9.66c-.49-1.084.676-2.181 1.726-1.621l6.732 3.547c2.858 1.505 2.858 5.588 0 7.093l-2.38 1.248a1.26 1.26 0 0 1-1.727-.606" fill="#c28200"></path></svg>
);

const GraduationCapIcon = () => (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M33 38.857a22 22 0 0 0 3-1.45V45a1.5 1.5 0 1 1-3 0zm2.205-16.58-10.5-5.601a1.5 1.5 0 0 0-1.41 2.648L32.062 24l3.188-1.7zm12-5.601-22.5-12a1.5 1.5 0 0 0-1.41 0l-22.5 12a1.5 1.5 0 0 0 0 2.648L6 22.1v9.08c-.002.736.27 1.447.761 1.996C9.218 35.912 14.721 40.5 24 40.5c3.077.025 6.13-.532 9-1.643V24.5l-.937-.5L24 28.3 8.218 19.874 4.688 18 24 7.7 43.313 18l-3.522 1.875h-.011L35.25 22.3a1.5 1.5 0 0 1 .75 1.3v13.807a21.7 21.7 0 0 0 5.239-4.232c.491-.549.763-1.26.761-1.997V22.1l5.205-2.777a1.5 1.5 0 0 0 0-2.647" /></svg>
);

const ViewEyeIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const DownloadIcon = () => (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
);

import Link from 'next/link';
import { WPCourse } from '@/types/wordpress';

export interface CertificateItem {
    id: string;
    type: string;
    title: string;
    issuedDate: string;
}

export interface ProgressAndCertificateProps {
    enrolledCourses?: WPCourse[];
    certificates?: CertificateItem[];
}

export default function ProgressAndCertificate({
    enrolledCourses = [],
    certificates = [],
}: ProgressAndCertificateProps = {}) {
    const activeCourse = enrolledCourses[0] || null;
    const progressPercent = activeCourse ? ((activeCourse as any).progress ?? 0) : 0;
    const radius = 48;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

    const courseTitle = activeCourse?.title || "Khóa học chuyên sâu";
    const courseDesc = activeCourse?.excerpt?.replace(/<[^>]*>/g, '').trim() ||
        activeCourse?.courseFields?.subtitle ||
        "Tiếp tục hành trình học tập, rèn luyện kỹ năng lâm sàng và nắm vững quy trình làm đẹp chuẩn quốc tế.";

    const firstSection = activeCourse?.sections?.[0];
    const firstLesson = firstSection?.items?.[0];
    const moduleName = firstSection?.title
        ? (firstSection.title.startsWith('Module') ? firstSection.title : `Module 01: ${firstSection.title}`)
        : "Lộ trình đào tạo";
    const lessonName = firstLesson?.title || "Bài học kế tiếp";
    const lessonSlug = firstLesson?.slug || String(firstLesson?.id || 'lesson-1');
    const resumeUrl = activeCourse ? `/student/courses/${activeCourse.slug}/lessons/${lessonSlug}` : '/student/courses';

    return (
        <section className={styles['section']} aria-label="Learning Progress & Certificates">
            {/* ══════════════════════════════════════════
               1. Left: Continue Your Learning Journey
               ══════════════════════════════════════════ */}
            <div className={styles['progress-card']}>
                <div className={styles['progress-card__top']}>
                    <div className={styles['progress-card__content']}>
                        <span className={styles['progress-card__tag']}>
                            Continue Your Learning Journey
                        </span>
                        <span className={styles['progress-card__divider']}>
                        </span>
                        <h2 className={styles['progress-card__title']}>
                            {courseTitle}
                        </h2>
                        <p className={styles['progress-card__desc']}>
                            {courseDesc}
                        </p>
                    </div>

                    {/* Circular Progress Gauge */}
                    <div className={styles['progress-card__gauge-wrap']}>
                        <svg className={styles['progress-card__gauge-svg']} viewBox="0 0 120 120">
                            <circle
                                cx="60"
                                cy="60"
                                r={radius}
                                className={styles['progress-card__gauge-bg']}
                            />
                            <circle
                                cx="60"
                                cy="60"
                                r={radius}
                                className={styles['progress-card__gauge-bar']}
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                            />
                        </svg>
                        <div className={styles['progress-card__gauge-center']}>
                            <span className={styles['progress-card__gauge-percent']}>
                                {progressPercent}%
                            </span>
                            <span className={styles['progress-card__gauge-label']}>
                                LEARNING
                            </span>
                        </div>
                    </div>
                </div>

                {/* Current Lesson Bar */}
                <div className={styles['progress-card__lesson']}>
                    <div className={styles['progress-card__lesson-left']}>
                        <div className={styles['progress-card__lesson-icon-wrap']}>
                            <LessonBookIcon />
                        </div>
                        <div className={styles['progress-card__lesson-info']}>
                            <span className={styles['progress-card__lesson-module']}>
                                {moduleName}
                            </span>
                            <span className={styles['progress-card__lesson-title']}>
                                {lessonName}
                            </span>
                        </div>
                    </div>

                    <Link
                        href={resumeUrl}
                        className={styles['progress-card__play-btn']}
                        aria-label={`Tiếp tục bài học: ${lessonName}`}
                    >
                        <PlayIcon />
                    </Link>
                </div>
            </div>

            {/* ══════════════════════════════════════════
               2. Right: My Certificate
               ══════════════════════════════════════════ */}
            <div className={styles['cert-card']}>
                <div className={styles['cert-card__header']}>
                    <h2 className={styles['cert-card__title']}>My Certificate</h2>
                    <div className={styles['cert-card__counter']}>
                        <span className={styles['cert-card__counter-icon']}>
                            <GraduationCapIcon />
                        </span>
                        <span>{certificates.length}</span>
                    </div>
                </div>

                <div className={styles['cert-card__list']}>
                    {certificates.length > 0 ? (
                        certificates.map((cert) => (
                            <div key={cert.id} className={styles['cert-card__item']}>
                                <div className={styles['cert-card__item-main']}>
                                    <div className={styles['cert-card__item-icon']}>
                                        <GraduationCapIcon />
                                    </div>
                                    <div className={styles['cert-card__item-content']}>
                                        <span className={styles['cert-card__item-tag']}>
                                            {cert.type}
                                        </span>
                                        <h3 className={styles['cert-card__item-name']}>
                                            {cert.title}
                                        </h3>
                                    </div>
                                </div>

                                <hr className={styles['cert-card__item-divider']} />

                                <div className={styles['cert-card__item-footer']}>
                                    <span className={styles['cert-card__item-date']}>
                                        {cert.issuedDate}
                                    </span>
                                    <div className={styles['cert-card__item-actions']}>
                                        <button
                                            type="button"
                                            className={styles['cert-card__action-btn']}
                                            aria-label={`View certificate ${cert.title}`}
                                            onClick={() => console.log('View certificate', cert.id)}
                                        >
                                            <ViewEyeIcon />
                                        </button>
                                        <button
                                            type="button"
                                            className={styles['cert-card__action-btn']}
                                            aria-label={`Download certificate ${cert.title}`}
                                            onClick={() => console.log('Download certificate', cert.id)}
                                        >
                                            <DownloadIcon />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: '24px', textAlign: 'center', color: '#888' }}>
                            <p style={{ margin: '0 0 12px', fontSize: '14px' }}>Chưa có chứng chỉ nào được cấp.</p>
                            <Link href="/student/certificate" style={{ color: '#c28200', textDecoration: 'underline', fontSize: '13px' }}>
                                Xem danh mục chứng chỉ &rarr;
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
