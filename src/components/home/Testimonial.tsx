'use client';

import { useState } from 'react';
import styles from '@/styles/home/Testimonial.module.css';
import { WPTestimonialItem } from '@/types/wordpress';

export interface TestimonialProps {
    eyebrow?: string;
    title?: string;
    items?: WPTestimonialItem[];
}

export default function Testimonial({
    eyebrow = "STUDENT STORIES",
    title = "Most of them started <br />with no experience",
    items = [],
}: TestimonialProps = {}) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const activeList = items || [];
    if (activeList.length === 0) return null;

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? activeList.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === activeList.length - 1 ? 0 : prev + 1));
    };

    const currentStory = activeList[currentIndex] || activeList[0] || { name: "", role: "", comment: "" };
    const avatarUrl = typeof currentStory.avatar === 'string' ? currentStory.avatar : (currentStory.avatar?.sourceUrl || "/images/home/jasmine_lee.jpg");

    return (
        <section className={styles["testimonial"]}>
            {/* Background Decorative Rings */}
            <div className={`${styles['testimonial__circle']} ${styles['testimonial__circle_1']}`}>
                <span></span>
                <span></span>
            </div>

            <div className={`${styles['testimonial__circle']} ${styles['testimonial__circle_2']}`}>
                <span></span>
                <span></span>
            </div>

            {/* <span className={styles['testimonial__elip']}></span> */}

            <div className={styles["testimonial__container"]}>
                <div className={styles["testimonial__wrapper"]}>
                    {/* Left Card: Student Stories & Testimonials */}
                    <div className={styles["testimonial__card"]}>
                        <div className={styles["testimonial__header"]}>
                            <p className={styles["testimonial__eyebrow"]}>{eyebrow}</p>
                            <span className={styles["testimonial__eyebrow-line"]}></span>
                            <h2
                                className={styles["testimonial__title"]}
                                dangerouslySetInnerHTML={{ __html: title }}
                            />
                        </div>

                        {/* Quote Box */}
                        <div className={styles["testimonial__quote-box"]}>
                            <div className={styles["testimonial__quote-mark"]}>
                                <svg width="39" height="31" viewBox="0 0 39 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.3585 23.625C20.3585 19.2917 21.9528 15 25.1415 10.75C28.3302 6.41667 32.7453 2.83333 38.3868 0L39 1.75C35.1572 4.08333 32.0912 6.70833 29.8019 9.625C27.5126 12.4583 26.2453 15.2917 26 18.125C26.9811 17.2083 28.0031 16.4583 29.066 15.875C30.2107 15.2917 31.3145 15 32.3774 15C33.522 15 34.3805 15.4167 34.9528 16.25C35.5252 17 35.8113 18.0417 35.8113 19.375C35.8113 21.125 35.3208 22.9167 34.3396 24.75C33.3585 26.5 32.0912 28 30.5377 29.25C29.066 30.4167 27.4717 31 25.7547 31C23.8742 31 22.4843 30.3333 21.5849 29C20.7673 27.6667 20.3585 25.875 20.3585 23.625ZM0 23.625C0 19.2917 1.59434 15 4.78302 10.75C7.9717 6.41667 12.3868 2.83333 18.0283 0L18.6415 1.75C14.7987 4.08333 11.7327 6.70833 9.4434 9.625C7.15409 12.4583 5.88679 15.2917 5.64151 18.125C6.62264 17.2083 7.64465 16.4583 8.70755 15.875C9.8522 15.2917 10.956 15 12.0189 15C13.1635 15 14.022 15.4167 14.5943 16.25C15.1667 17 15.4528 18.0417 15.4528 19.375C15.4528 21.125 14.9623 22.9167 13.9811 24.75C13 26.5 11.7327 28 10.1792 29.25C8.70755 30.4167 7.11321 31 5.39623 31C3.51572 31 2.12579 30.3333 1.22641 29C0.408805 27.6667 0 25.875 0 23.625Z" fill="#paint0_linear_282_665)" />
                                    <defs>
                                        <linearGradient id="paint0_linear_282_665" x1="19.5" y1="0" x2="19.5" y2="31" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#E0D0AE" />
                                            <stop offset="0.45" stopColor="#DEBB74" />
                                            <stop offset="0.55" stopColor="#CFAD6D" />
                                            <stop offset="1" stopColor="#CDB688" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <p className={styles["testimonial__quote-text"]}>
                                {currentStory.comment}
                            </p>
                        </div>

                        {/* Footer: Author info + Prev/Next buttons */}
                        <div className={styles["testimonial__footer"]}>
                            <div className={styles["testimonial__author"]}>
                                <div className={styles["testimonial__avatar-box"]}>
                                    <img
                                        src={avatarUrl}
                                        alt={currentStory.name}
                                        className={styles["testimonial__avatar"]}
                                    />
                                </div>
                                <div className={styles["testimonial__author-info"]}>
                                    <h4 className={styles["testimonial__author-name"]}>
                                        {currentStory.name}
                                    </h4>
                                    <p className={styles["testimonial__author-role"]}>
                                        <span className={styles["testimonial__author-dash"]}>— </span>
                                        {currentStory.role}
                                    </p>
                                </div>
                            </div>

                            <div className={styles["testimonial__nav"]}>
                                <button
                                    type="button"
                                    className={styles["testimonial__nav-btn"]}
                                    onClick={handlePrev}
                                    aria-label="Previous story"
                                >
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M15 19L8 12L15 5"
                                            stroke="#8A5800"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    className={styles["testimonial__nav-btn"]}
                                    onClick={handleNext}
                                    aria-label="Next story"
                                >
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M9 5L16 12L9 19"
                                            stroke="#8A5800"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Visual Collage */}
                    <div className={styles["testimonial__visual"]}>
                        {/* Rating Floating Card */}
                        <div className={`${styles["testimonial__visual-wrap"]} ${styles["testimonial__visual-wrap__1"]}`}>
                            <div className={styles["testimonial__badge-rating"]}>
                                <span className={styles["testimonial__rating-score"]}>4.9/5</span>
                                <div className={styles["testimonial__rating-stars"]}>
                                    ★★★★★
                                </div>
                                <span className={styles["testimonial__rating-label"]}>
                                    GOOGLE RATING · 180 REVIEWS
                                </span>
                            </div>
                        </div>

                        {/* Top Right Graduate Image */}
                        <div className={`${styles["testimonial__visual-wrap"]} ${styles["testimonial__visual-wrap__2"]}`}>
                            <div className={styles["testimonial__image-wrapper--primary"]}>
                                <img
                                    src="/images/home/student-stories-1.jpg"
                                    alt="Student graduation"
                                    className={styles["testimonial__image--primary"]}
                                />
                            </div>
                        </div>


                        {/* Bottom Group Graduate Image */}
                        <div className={`${styles["testimonial__visual-wrap"]} ${styles["testimonial__visual-wrap__3"]}`}>
                            <div className={styles["testimonial__image-wrapper--secondary"]}>
                                <img
                                    src="/images/home/student-stories-2.jpg"
                                    alt="Student group graduation"
                                    className={styles["testimonial__image--secondary"]}
                                />
                            </div>
                        </div>

                        {/* Dark Floating Graduates Badge */}
                        <div className={`${styles["testimonial__visual-wrap"]} ${styles["testimonial__visual-wrap__4"]}`}>
                            <div className={styles["testimonial__badge-graduates"]}>
                                <span className={styles["testimonial__graduates-count"]}>1,200+</span>
                                <span className={styles["testimonial__graduates-label"]}>
                                    GRADUATES SINCE 2015
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}