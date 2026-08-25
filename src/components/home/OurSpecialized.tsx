import Image from 'next/image';
import styles from '@/styles/home/OurSpecialized.module.css';

export default function OurSpecialized() {
    return (
        <section className={styles["our-specialized"]}>
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
            <span className={styles['our-specialized__elip']}>

            </span>



            <div className={styles["our-specialized__container"]}>
                <div className={styles["our-specialized__wrapper"]}>
                    {/* 1. Header Section */}
                    <div className={styles["our-specialized__header"]}>
                        <p className={styles["our-specialized__eyebrow"]}>Our Specialized Training Programs</p>
                        <span className={styles["our-specialized__divider"]}></span>
                        <h2 className={styles["our-specialized__title"]}>
                            Build a career around <br />the work you love.
                        </h2>
                    </div>

                    {/* 2. Content Grid */}
                    <div className={styles["our-specialized__content"]}>
                        {/* Left Column */}
                        <div className={styles["our-specialized__column--left"]}>
                            {/* Item 01 */}
                            <div className={`${styles["our-specialized__item"]} ${styles["our-specialized__item--01"]}`}>
                                <span className={styles["our-specialized__item-number"]}>01</span>
                                <div className={styles["our-specialized__item-info"]}>
                                    <h3 className={styles["our-specialized__item-title"]}>Facial & Skin Treatments</h3>
                                    <p className={styles["our-specialized__item-description"]}>
                                        From classic facials to advanced chemical peels and dermaplaning.
                                    </p>
                                </div>
                                <div className={styles["our-specialized__item-line-wrapper"]}>
                                    <span className={styles["our-specialized__item-line"]}></span>
                                    <span className={styles["our-specialized__item-dot"]}></span>
                                </div>
                            </div>

                            {/* Item 03 */}
                            <div className={`${styles["our-specialized__item"]} ${styles["our-specialized__item--03"]}`}>
                                <span className={styles["our-specialized__item-number"]}>03</span>
                                <div className={styles["our-specialized__item-info"]}>
                                    <h3 className={styles["our-specialized__item-title"]}>Permanent Makeup</h3>
                                    <p className={styles["our-specialized__item-description"]}>
                                        Microblading, powder brows, eyeliner and lip — taught on live models.
                                    </p>
                                </div>
                                <div className={styles["our-specialized__item-line-wrapper"]}>
                                    <span className={styles["our-specialized__item-line"]}></span>
                                    <span className={styles["our-specialized__item-dot"]}></span>
                                </div>
                            </div>
                        </div>

                        {/* Center Column */}
                        <div className={styles["our-specialized__column--center"]}>
                            {/* Image Item */}
                            <div className={styles["our-specialized__image-wrapper"]}>
                                <Image
                                    width={480}
                                    height={360}
                                    alt='license-training'
                                    src="/images/home/license-program.png"
                                    className={styles["our-specialized__image"]}
                                />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className={styles["our-specialized__column--right"]}>
                            {/* Item 02 */}
                            <div className={`${styles["our-specialized__item"]} ${styles["our-specialized__item--02"]}`}>
                                <div className={styles["our-specialized__item-line-wrapper"]}>
                                    <span className={styles["our-specialized__item-line"]}></span>
                                    <span className={styles["our-specialized__item-dot"]}></span>
                                </div>
                                <div className={styles["our-specialized__item-info"]}>
                                    <h3 className={styles["our-specialized__item-title"]}>Laser Training</h3>
                                    <p className={styles["our-specialized__item-description"]}>
                                        Device-based treatments taught to TDLR certification standards.
                                    </p>
                                </div>
                                <span className={styles["our-specialized__item-number"]}>02</span>
                            </div>



                            {/* Item 04 */}
                            <div className={`${styles["our-specialized__item"]} ${styles["our-specialized__item--04"]}`}>
                                <div className={styles["our-specialized__item-line-wrapper"]}>
                                    <span className={styles["our-specialized__item-line"]}></span>
                                    <span className={styles["our-specialized__item-dot"]}></span>
                                </div>
                                <div className={styles["our-specialized__item-info"]}>
                                    <h3 className={styles["our-specialized__item-title"]}>License Programs</h3>
                                    <p className={styles["our-specialized__item-description"]}>
                                        State licensure tracks up to 750 hours, ending at the Texas exam.
                                    </p>
                                </div>
                                <span className={styles["our-specialized__item-number"]}>04</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}