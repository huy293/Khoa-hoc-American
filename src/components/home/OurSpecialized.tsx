import React from 'react';
import Image from 'next/image';
import styles from '@/styles/home/OurSpecialized.module.css';

export interface SpecializedItem {
    number?: string;
    title: React.ReactNode;
    description: React.ReactNode;
}

export interface OurSpecializedProps {
    eyebrow?: React.ReactNode;
    title?: React.ReactNode;
    imageSrc?: string;
    imageAlt?: string;
    imageWidth?: number;
    imageHeight?: number;
    items?: SpecializedItem[];
    className?: string;
}

export const DEFAULT_SPECIALIZED_ITEMS: SpecializedItem[] = [
    {
        number: "01",
        title: "Facial & Skin Treatments",
        description: "From classic facials to advanced chemical peels and dermaplaning.",
    },
    {
        number: "02",
        title: "Laser Training",
        description: "Device-based treatments taught to TDLR certification standards.",
    },
    {
        number: "03",
        title: "Permanent Makeup",
        description: "Microblading, powder brows, eyeliner and lip — taught on live models.",
    },
    {
        number: "04",
        title: "License Programs",
        description: "State licensure tracks up to 750 hours, ending at the Texas exam.",
    },
];

export default function OurSpecialized({
    eyebrow = "Our Specialized Training Programs",
    title = (
        <>
            Build a career around <br />the work you love.
        </>
    ),
    imageSrc = "/images/home/license-program.png",
    imageAlt = "license-training",
    imageWidth = 480,
    imageHeight = 360,
    items = DEFAULT_SPECIALIZED_ITEMS,
    className = "",
}: OurSpecializedProps = {}) {
    const item1 = items[0] || DEFAULT_SPECIALIZED_ITEMS[0];
    const item2 = items[1] || DEFAULT_SPECIALIZED_ITEMS[1];
    const item3 = items[2] || DEFAULT_SPECIALIZED_ITEMS[2];
    const item4 = items[3] || DEFAULT_SPECIALIZED_ITEMS[3];

    return (
        <section className={`${styles["our-specialized"]} ${className}`.trim()}>
            <div className={styles["our-specialized__lines_wrapper"]}>
                <span className={`${styles["our-specialized__line"]} ${styles["our-specialized__line_1"]}`}></span>
                <span className={`${styles["our-specialized__line"]} ${styles["our-specialized__line_2"]}`}></span>
                <span className={`${styles["our-specialized__line"]} ${styles["our-specialized__line_3"]}`}></span>
            </div>

            <div className={`${styles['our-specialized__circle']} ${styles['our-specialized__circle_1']}`}>
                <span></span>
                <span></span>
            </div>
            <div className={`${styles['our-specialized__circle']} ${styles['our-specialized__circle_2']}`}>
                <span></span>
                <span></span>
            </div>
            <span className={styles['our-specialized__elip']}></span>

            <div className={styles["our-specialized__container"]}>
                <div className={styles["our-specialized__wrapper"]}>
                    {/* 1. Header Section */}
                    <div className={styles["our-specialized__header"]}>
                        {eyebrow && <p className={styles["our-specialized__eyebrow"]}>{eyebrow}</p>}
                        <span className={styles["our-specialized__divider"]}></span>
                        {title && <h2 className={styles["our-specialized__title"]}>{title}</h2>}
                    </div>

                    {/* 2. Content Grid */}
                    <div className={styles["our-specialized__content"]}>
                        {/* Left Column */}
                        <div className={styles["our-specialized__column--left"]}>
                            {/* Item 01 */}
                            {item1 && (
                                <div className={`${styles["our-specialized__item"]} ${styles["our-specialized__item--01"]}`}>
                                    <span className={styles["our-specialized__item-number"]}>{item1.number ?? "01"}</span>
                                    <div className={styles["our-specialized__item-info"]}>
                                        <h3 className={styles["our-specialized__item-title"]}>{item1.title}</h3>
                                        <p className={styles["our-specialized__item-description"]}>
                                            {item1.description}
                                        </p>
                                    </div>
                                    <div className={styles["our-specialized__item-line-wrapper"]}>
                                        <span className={styles["our-specialized__item-line"]}></span>
                                        <span className={styles["our-specialized__item-dot"]}></span>
                                    </div>
                                </div>
                            )}

                            {/* Item 03 */}
                            {item3 && (
                                <div className={`${styles["our-specialized__item"]} ${styles["our-specialized__item--03"]}`}>
                                    <span className={styles["our-specialized__item-number"]}>{item3.number ?? "03"}</span>
                                    <div className={styles["our-specialized__item-info"]}>
                                        <h3 className={styles["our-specialized__item-title"]}>{item3.title}</h3>
                                        <p className={styles["our-specialized__item-description"]}>
                                            {item3.description}
                                        </p>
                                    </div>
                                    <div className={styles["our-specialized__item-line-wrapper"]}>
                                        <span className={styles["our-specialized__item-line"]}></span>
                                        <span className={styles["our-specialized__item-dot"]}></span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Center Column */}
                        <div className={styles["our-specialized__column--center"]}>
                            {/* Image Item */}
                            {imageSrc && (
                                <div className={styles["our-specialized__image-wrapper"]}>
                                    <Image
                                        width={imageWidth}
                                        height={imageHeight}
                                        alt={imageAlt}
                                        src={imageSrc}
                                        className={styles["our-specialized__image"]}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Right Column */}
                        <div className={styles["our-specialized__column--right"]}>
                            {/* Item 02 */}
                            {item2 && (
                                <div className={`${styles["our-specialized__item"]} ${styles["our-specialized__item--02"]}`}>
                                    <div className={styles["our-specialized__item-line-wrapper"]}>
                                        <span className={styles["our-specialized__item-line"]}></span>
                                        <span className={styles["our-specialized__item-dot"]}></span>
                                    </div>
                                    <div className={styles["our-specialized__item-info"]}>
                                        <h3 className={styles["our-specialized__item-title"]}>{item2.title}</h3>
                                        <p className={styles["our-specialized__item-description"]}>
                                            {item2.description}
                                        </p>
                                    </div>
                                    <span className={styles["our-specialized__item-number"]}>{item2.number ?? "02"}</span>
                                </div>
                            )}

                            {/* Item 04 */}
                            {item4 && (
                                <div className={`${styles["our-specialized__item"]} ${styles["our-specialized__item--04"]}`}>
                                    <div className={styles["our-specialized__item-line-wrapper"]}>
                                        <span className={styles["our-specialized__item-line"]}></span>
                                        <span className={styles["our-specialized__item-dot"]}></span>
                                    </div>
                                    <div className={styles["our-specialized__item-info"]}>
                                        <h3 className={styles["our-specialized__item-title"]}>{item4.title}</h3>
                                        <p className={styles["our-specialized__item-description"]}>
                                            {item4.description}
                                        </p>
                                    </div>
                                    <span className={styles["our-specialized__item-number"]}>{item4.number ?? "04"}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}