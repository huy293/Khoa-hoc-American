'use client';

import React from 'react';
import Image from 'next/image';
import styles from '@/styles/course-detail/AboutCourse.module.css';

export default function AboutCourse() {
    return (
        <section className={styles['about-course']}>
            <div className={styles['about-course__container']}>
                {/* ── Header: Eyebrow, Gradient Line, Title ── */}
                <div className={styles['about-course__header']}>
                    <span className={styles['about-course__eyebrow']}>COURSE OVERVIEW</span>
                    <div className={styles['about-course__divider']} />
                    <h2 className={styles['about-course__title']}>About This Course</h2>
                </div>

                {/* ── 3-Image Showcase (Left blurred, Center elevated with shadow, Right blurred) ── */}
                <div className={styles['about-course__showcase']}>
                    {/* Left Image (blurred) */}
                    <div className={`${styles['about-course__img-wrap']} ${styles['about-course__img-wrap--left']}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/images/courses/about-left.jpg"
                            alt="Glowing skin beauty therapy"
                            className={styles['about-course__img']}
                        />
                        <div className={styles['about-course__img-overlay']} />
                    </div>

                    {/* Center Image (elevated with drop shadow) */}
                    <div className={`${styles['about-course__img-wrap']} ${styles['about-course__img-wrap--center']}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/images/courses/about-center.jpg"
                            alt="Professional HydraFacial training in progress"
                            className={styles['about-course__img']}
                        />
                    </div>

                    {/* Right Image (blurred) */}
                    <div className={`${styles['about-course__img-wrap']} ${styles['about-course__img-wrap--right']}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/images/courses/about-right.jpg"
                            alt="HydraFacial infusion treatment"
                            className={styles['about-course__img']}
                        />
                        <div className={styles['about-course__img-overlay']} />
                    </div>
                </div>

                {/* ── Comprehensive Course Description ── */}
                <div className={styles['about-course__content']}>
                    <p className={styles['about-course__description']}>
                        HydraFacial is a leading-edge professional skincare treatment that is gaining immense popularity. This comprehensive training program is designed for beauty professionals and estheticians who want to master this advanced technology. A HydraFacial treatment is a non-invasive, three-step procedure that combines deep cleansing, chemical exfoliation, extraction, and hydration. It is suitable for all skin types, including sensitive skin, and effectively addresses various skin concerns to achieve a healthy, glowing complexion.
                    </p>
                </div>
            </div>
        </section>
    );
}
