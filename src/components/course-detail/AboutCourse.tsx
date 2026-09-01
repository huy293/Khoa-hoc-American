'use client';

import React from 'react';
import Image from 'next/image';
import styles from '@/styles/course-detail/AboutCourse.module.css';
import { WPCourse } from '@/types/wordpress';
import WpContent from '@/components/common/WpContent';

interface AboutCourseProps {
    course?: WPCourse | null;
}

export default function AboutCourse({ course }: AboutCourseProps = {}) {
    const title = course ? `About ${course.title}` : "About This Course";
    const cf = (course?.courseFields || {}) as any;
    const imgLeft = typeof cf.about_img_left === 'string' ? cf.about_img_left : (cf.about_img_left?.sourceUrl || "/images/courses/about-left.jpg");
    const imgCenter = course?.featuredImage?.node?.sourceUrl || (typeof cf.about_img_center === 'string' ? cf.about_img_center : (cf.about_img_center?.sourceUrl || "/images/courses/about-center.jpg"));
    const imgRight = typeof cf.about_img_right === 'string' ? cf.about_img_right : (cf.about_img_right?.sourceUrl || "/images/courses/about-right.jpg");
    const description = course?.content || course?.excerpt || "HydraFacial is a leading-edge professional skincare treatment that is gaining immense popularity. This comprehensive training program is designed for beauty professionals and estheticians who want to master this advanced technology. A HydraFacial treatment is a non-invasive, three-step procedure that combines deep cleansing, chemical exfoliation, extraction, and hydration. It is suitable for all skin types, including sensitive skin, and effectively addresses various skin concerns to achieve a healthy, glowing complexion.";

    return (
        <section className={styles['about-course']}>
            <div className={styles['about-course__container']}>
                {/* ── Header: Eyebrow, Gradient Line, Title ── */}
                <div className={styles['about-course__header']}>
                    <span className={styles['about-course__eyebrow']}>COURSE OVERVIEW</span>
                    <div className={styles['about-course__divider']} />
                    <h2 className={styles['about-course__title']}>{title}</h2>
                </div>

                {/* ── 3-Image Showcase (Left blurred, Center elevated with shadow, Right blurred) ── */}
                <div className={styles['about-course__showcase']}>
                    {/* Left Image (blurred) */}
                    <div className={`${styles['about-course__img-wrap']} ${styles['about-course__img-wrap--left']}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={imgLeft}
                            alt="Glowing skin beauty therapy"
                            className={styles['about-course__img']}
                        />
                        <div className={styles['about-course__img-overlay']} />
                    </div>

                    {/* Center Image (elevated with drop shadow) */}
                    <div className={`${styles['about-course__img-wrap']} ${styles['about-course__img-wrap--center']}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={imgCenter}
                            alt={course?.title || "Professional training in progress"}
                            className={styles['about-course__img']}
                        />
                    </div>

                    {/* Right Image (blurred) */}
                    <div className={`${styles['about-course__img-wrap']} ${styles['about-course__img-wrap--right']}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={imgRight}
                            alt="Treatment procedure"
                            className={styles['about-course__img']}
                        />
                        <div className={styles['about-course__img-overlay']} />
                    </div>
                </div>

                {/* ── Comprehensive Course Description ── */}
                <div className={styles['about-course__content']}>
                    {course?.content ? (
                        <div className={styles['about-course__description']}>
                            <WpContent html={course.content} />
                        </div>
                    ) : (
                        <p className={styles['about-course__description']}>
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}
