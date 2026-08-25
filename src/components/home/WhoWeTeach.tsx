import styles from "@/styles/home/WhoWeTeach.module.css";

export default function WhoWeTeach() {
    return (
        <section className={styles["who-we-teach"]}>
            {/* Three line */}
            <div className={styles["who-we-teach__lines"]}>
                <span className={`${styles["who-we-teach__line"]} ${styles["who-we-teach__line--1"]}`}></span>
                <span className={`${styles["who-we-teach__line"]} ${styles["who-we-teach__line--2"]}`}></span>
                <span className={`${styles["who-we-teach__line"]} ${styles["who-we-teach__line--3"]}`}></span>
            </div>

            {/* Content wrapper */}
            <div className={styles["who-we-teach__wrapper"]}>
                <div className={styles["who-we-teach__container"]}>
                    {/* Left column: Visual & Circles */}
                    <div className={styles["who-we-teach__visual"]}>
                        <span className={`${styles["who-we-teach__circle"]} ${styles["who-we-teach__circle--1"]}`}></span>
                        <span className={`${styles["who-we-teach__circle"]} ${styles["who-we-teach__circle--2"]}`}></span>
                        <span className={`${styles["who-we-teach__circle"]} ${styles["who-we-teach__circle--3"]}`}></span>
                        <span className={`${styles["who-we-teach__circle"]} ${styles["who-we-teach__circle--4"]}`}></span>

                        <img
                            src="/images/home/who-we-teach-1.png"
                            alt="Who We Teach 1"
                            className={`${styles["who-we-teach__image"]} ${styles["who-we-teach__image--primary"]}`}
                        />
                        <img
                            src="/images/home/who-we-teach-2.png"
                            alt="Who We Teach 2"
                            className={`${styles["who-we-teach__image"]} ${styles["who-we-teach__image--secondary"]}`}
                        />
                    </div>

                    {/* Right Column: Info & Content */}
                    <div className={styles["who-we-teach__content"]}>
                        <p className={styles["who-we-teach__eyebrow"]}>WHO WE TEACH</p>
                        <span className={styles["who-we-teach__divider"]}></span>
                        <h2 className={styles["who-we-teach__title"]}>Beauty is a craft, taught by hand</h2>
                        <p className={styles["who-we-teach__description"]}>
                            Most arrive with no experience at all. They leave as ESTHETICIANS, LASER SPECIALISTS AND PERMANENT-MAKEUP ARTISTS — trained by hand, on real skin, in one room in Houston.
                        </p>

                        <ul className={styles["who-we-teach__list"]}>
                            <li className={styles["who-we-teach__list-item"]}>Hands-on, in-room instruction</li>
                            <li className={styles["who-we-teach__list-item"]}>Assessment before certification</li>
                        </ul>

                        <div className={styles["who-we-teach__footer"]}>
                            <div className={styles["who-we-teach__instructor"]}>
                                <img
                                    src="/images/home/emily.png"
                                    alt="Emily"
                                    className={styles["who-we-teach__instructor-avatar"]}
                                />
                                <div className={styles["who-we-teach__instructor-info"]}>
                                    <p className={styles["who-we-teach__instructor-name"]}>Emily</p>
                                    <p className={styles["who-we-teach__instructor-role"]}>Master trainer</p>
                                </div>
                            </div>

                            <div className={styles["who-we-teach__cta"]}>
                                <a href="#explore" className={styles["who-we-teach__link"]}>
                                    Explore more
                                </a>
                                <span className={styles["who-we-teach__link-arrow"]}></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}