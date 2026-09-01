import styles from "@/styles/about-us/HeroSection.module.css";
import { WPAboutFields } from "@/types/wordpress";

interface AboutUsHeroSectionProps {
    data?: Partial<WPAboutFields>;
}

export default function AboutUsHeroSection({ data }: AboutUsHeroSectionProps = {}) {
    const eyebrow = data?.about_hero_eyebrow || "Our Specialized Training Programs";
    const title = data?.about_hero_title || "ABOUT COUTURE BEAUTY ACADEMY";
    const description = data?.about_hero_description || data?.about_hero_desc || "Couture Beauty Academy is a professional training environment where aspiring beauty artists learn, practice, and grow with confidence. With experienced instructors, hands-on education, and a strong focus on real-world skills, the academy is dedicated to helping students build successful careers in the beauty industry.";
    const btn1Text = data?.about_hero_btn_1_text || "CONTACT ADMISSIONS";
    const btn1Link = data?.about_hero_btn_1_link || "/contact";
    const btn2Text = data?.about_hero_btn_2_text || "Explore Our Courses";
    const btn2Link = data?.about_hero_btn_2_link || "/courses";

    const rawImg1 = data?.about_hero_image_1 || data?.about_hero_img_1;
    const rawImg2 = data?.about_hero_image_2 || data?.about_hero_img_2;
    const img1 = typeof rawImg1 === 'string' ? rawImg1 : (rawImg1?.sourceUrl || "/images/home/who-we-teach-1.jpg");
    const img2 = typeof rawImg2 === 'string' ? rawImg2 : (rawImg2?.sourceUrl || "/images/home/who-we-teach-2.jpg");

    return (
        <section className={styles["about-hero"]}>
            <div className={styles["about-hero__wrapper"]}>
                <div className={styles["about-hero__container"]}>
                    {/* Left Column: Content & Information */}
                    <div className={styles["about-hero__content"]}>
                        <p className={styles["about-hero__eyebrow"]}>{eyebrow}</p>
                        <span className={styles["about-hero__divider"]}></span>
                        <h1
                            className={styles["about-hero__title"]}
                            dangerouslySetInnerHTML={{ __html: title }}
                        />
                        <p className={styles["about-hero__description"]}>
                            {description}
                        </p>
                        <div className={styles["about-hero__actions"]}>
                            <a href={btn1Link} className={`${styles["about-hero__btn"]} ${styles["about-hero__btn--primary"]}`}>
                                {btn1Text}
                            </a>
                            <a href={btn2Link} className={`${styles["about-hero__btn"]} ${styles["about-hero__btn--secondary"]}`}>
                                {btn2Text}
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
                                    src={img1}
                                    alt="Who We Teach 1"
                                    className={`${styles["about-hero__image"]} ${styles["about-hero__image--primary"]}`}
                                />
                            </div>
                            <div className={styles["about-hero__image-wrapper--secondary"]}>
                                <img
                                    src={img2}
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