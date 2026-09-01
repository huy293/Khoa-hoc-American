import React from 'react';
import Link from 'next/link';
import styles from '@/styles/course/CourseHero.module.css';
import { WPCoursesFields } from '@/types/wordpress';

interface CourseHeroProps {
    data?: Partial<WPCoursesFields>;
}

/* ── Check SVG Icon ── */
const CheckIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className={styles['course-hero__badge-icon']}
    >
        <path
            d="M21.8011 9.99999C22.2578 12.2413 21.9323 14.5714 20.879 16.6018C19.8256 18.6322 18.108 20.24 16.0126 21.1573C13.9172 22.0746 11.5707 22.2458 9.3644 21.6424C7.15807 21.0389 5.22529 19.6974 3.88838 17.8414C2.55146 15.9854 1.89122 13.7272 2.01776 11.4434C2.14431 9.15952 3.04998 6.98808 4.58375 5.29116C6.11752 3.59424 8.18668 2.47442 10.4462 2.11844C12.7056 1.76247 15.0189 2.19185 17.0001 3.33499M9.0001 11L12.0001 14L22.0001 3.99999"
            stroke="#9F6500"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

/* ── Arrow SVG Icon for Button ── */
const ArrowRightIcon = () => (
    <svg
        className={styles['course-hero__btn-icon']}
        width="18"
        height="12"
        viewBox="0 0 18 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M1 6H16.5M16.5 6L11.5 1M16.5 6L11.5 11"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default function CourseHero({ data }: CourseHeroProps = {}) {
    const eyebrow = data?.course_hero_eyebrow || "Build Your Career with Confidence";
    const title = data?.course_hero_title || "Professional Facial <br />And Skincare Course";
    const badge1 = data?.course_hero_badge_1 || "Learn From Experts";
    const badge2 = data?.course_hero_badge_2 || "Master the Art of Beauty.";
    const description = data?.course_hero_description || "Train hands-on with certified beauty professionals who bring years of real-world experience, advanced techniques, and personalized guidance into every class.";
    const btn1Text = data?.course_hero_btn_1_text || "ABOUT THE COURSE";
    const btn1Link = data?.course_hero_btn_1_link || "#about-course";
    const btn2Text = data?.course_hero_btn_2_text || "REGISTER FOR THE COURSE";
    const btn2Link = data?.course_hero_btn_2_link || "#register";
    const bgImage = typeof data?.course_hero_bg === 'string' ? data.course_hero_bg : (data?.course_hero_bg?.sourceUrl || "/images/courses/course-hero-bg.jpg");

    return (
        <section className={styles['course-hero']}>
            {/* Background Image */}
            <div className={styles['course-hero__bg-wrapper']}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={bgImage}
                    alt="Professional Facial And Skincare Course Classroom"
                    className={styles['course-hero__bg-img']}
                />
            </div>

            {/* Left 50% Linear Gradient Overlay */}
            <div className={styles['course-hero__gradient-overlay']} />

            {/* Hero Main Content */}
            <div className={styles['course-hero__container']}>
                <div className={styles['course-hero__content']}>
                    {/* Eyebrow */}
                    <p className={styles['course-hero__eyebrow']}>
                        {eyebrow}
                    </p>

                    {/* Title */}
                    <h1
                        className={styles['course-hero__title']}
                        dangerouslySetInnerHTML={{ __html: title }}
                    />

                    {/* Feature Badges */}
                    <div className={styles['course-hero__badges']}>
                        <div className={styles['course-hero__badge']}>
                            <CheckIcon />
                            <span>{badge1}</span>
                        </div>
                        <div className={styles['course-hero__badge']}>
                            <CheckIcon />
                            <span>{badge2}</span>
                        </div>
                    </div>

                    {/* Description */}
                    <p className={styles['course-hero__description']}>
                        {description}
                    </p>

                    {/* 2 Buttons */}
                    <div className={styles['course-hero__actions']}>
                        <Link
                            href={btn1Link}
                            className={`${styles['course-hero__btn']} ${styles['course-hero__btn--primary']}`}
                        >
                            {btn1Text}
                        </Link>
                        <Link
                            href={btn2Link}
                            className={`${styles['course-hero__btn']} ${styles['course-hero__btn--secondary']}`}
                        >
                            <span>{btn2Text}</span>
                            <ArrowRightIcon />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
