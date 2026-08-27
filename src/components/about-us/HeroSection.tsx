import styles from "@/styles/about-us/HeroSection.module.css";

export default function AboutUsHeroSection() {
    return (
        <section className={styles["about-hero"]}>
            <div className={styles["about-hero__wrapper"]}>
                <div className={styles["about-hero__container"]}>
                    {/* Left Column: Content & Information */}
                    <div className={styles["about-hero__content"]}>
                        <p className={styles["about-hero__eyebrow"]}>Our Specialized Training Programs</p>
                        <span className={styles["about-hero__divider"]}></span>
                        <h1 className={styles["about-hero__title"]}>ABOUT COUTURE BEAUTY ACADEMY</h1>
                        <p className={styles["about-hero__description"]}>
                            Couture Beauty Academy is a professional training environment where aspiring beauty artists learn, practice, and grow with confidence. With experienced instructors, hands-on education, and a strong focus on real-world skills, the academy is dedicated to helping students build successful careers in the beauty industry.
                        </p>
                        <div className={styles["about-hero__actions"]}>
                            <a href="#contact" className={`${styles["about-hero__btn"]} ${styles["about-hero__btn--primary"]}`}>
                                CONTACT ADMISSIONS
                            </a>
                            <a href="#courses" className={`${styles["about-hero__btn"]} ${styles["about-hero__btn--secondary"]}`}>
                                Explore Our Courses
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Visual, Circles & Images */}
                    <div className={styles["about-hero__visual"]}>
                        <div className={styles["about-hero__visual-wrapper"]}>
                            <span className={`${styles["about-hero__circle"]} ${styles["about-hero__circle--1"]}`}></span>
                            <span className={`${styles["about-hero__circle"]} ${styles["about-hero__circle--2"]}`}></span>
                            <span className={`${styles["about-hero__circle"]} ${styles["about-hero__circle--3"]}`}></span>
                            <span className={`${styles["about-hero__circle"]} ${styles["about-hero__circle--4"]}`}></span>

                            <div className={styles["about-hero__image-wrapper--primary"]}>
                                <img
                                    src="/images/home/who-we-teach-1.jpg"
                                    alt="Who We Teach 1"
                                    className={`${styles["about-hero__image"]} ${styles["about-hero__image--primary"]}`}
                                />
                            </div>
                            <div className={styles["about-hero__image-wrapper--secondary"]}>
                                <img
                                    src="/images/home/who-we-teach-2.jpg"
                                    alt="Who We Teach 2"
                                    className={`${styles["about-hero__image"]} ${styles["about-hero__image--secondary"]}`}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}