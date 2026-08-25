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
                        <div className={styles["who-we-teach__visual-wrapper"]}>
                            <span className={`${styles["who-we-teach__circle"]} ${styles["who-we-teach__circle--1"]}`}></span>
                            <span className={`${styles["who-we-teach__circle"]} ${styles["who-we-teach__circle--2"]}`}></span>
                            <span className={`${styles["who-we-teach__circle"]} ${styles["who-we-teach__circle--3"]}`}></span>
                            <span className={`${styles["who-we-teach__circle"]} ${styles["who-we-teach__circle--4"]}`}></span>

                            <div className={styles["who-we-teach__image-wrapper--primary"]}>
                                <img
                                    src="/images/home/who-we-teach-1.jpg"
                                    alt="Who We Teach 1"
                                    className={`${styles["who-we-teach__image"]} ${styles["who-we-teach__image--primary"]}`}
                                />
                            </div>
                            <div className={styles["who-we-teach__image-wrapper--secondary"]}>
                                <img
                                    src="/images/home/who-we-teach-2.jpg"
                                    alt="Who We Teach 2"
                                    className={`${styles["who-we-teach__image"]} ${styles["who-we-teach__image--secondary"]}`}
                                />
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Info & Content */}
                    <div className={styles["who-we-teach__content"]}>
                        <div className={styles["who-we-teach__header"]}>
                            <p className={styles["who-we-teach__eyebrow"]}>WHO WE TEACH</p>
                            <span className={styles["who-we-teach__divider"]}></span>
                            <h2 className={styles["who-we-teach__title"]}>Beauty is a craft, <br />taught by hand</h2>
                        </div>
                        <p className={styles["who-we-teach__description"]}>
                            Most arrive with no experience at all. They leave as ESTHETICIANS, LASER SPECIALISTS AND PERMANENT-MAKEUP ARTISTS — trained by hand, on real skin, in one room in Houston.
                        </p>

                        <ul className={styles["who-we-teach__list"]}>
                            <li className={styles["who-we-teach__list-item"]}>
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.0827 17.2107L18.6107 8.68267L17.6667 7.73867L10.0827 15.3227L6.28267 11.5227L5.33867 12.4667L10.0827 17.2107ZM12.004 24C10.3453 24 8.78533 23.6853 7.324 23.056C5.86356 22.4258 4.59289 21.5707 3.512 20.4907C2.43111 19.4107 1.57556 18.1413 0.945333 16.6827C0.315111 15.224 0 13.6644 0 12.004C0 10.3436 0.315111 8.78356 0.945333 7.324C1.57467 5.86356 2.42844 4.59289 3.50667 3.512C4.58489 2.43111 5.85467 1.57556 7.316 0.945333C8.77733 0.315111 10.3373 0 11.996 0C13.6547 0 15.2147 0.315111 16.676 0.945333C18.1364 1.57467 19.4071 2.42889 20.488 3.508C21.5689 4.58711 22.4244 5.85689 23.0547 7.31733C23.6849 8.77778 24 10.3373 24 11.996C24 13.6547 23.6853 15.2147 23.056 16.676C22.4267 18.1373 21.5716 19.408 20.4907 20.488C19.4098 21.568 18.1404 22.4236 16.6827 23.0547C15.2249 23.6858 13.6653 24.0009 12.004 24Z" fill="url(#paint0_linear_282_451)" />
                                    <defs>
                                        <linearGradient id="paint0_linear_282_451" x1="12" y1="0" x2="12" y2="24" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#F4DEAE" />
                                            <stop offset="1" stopColor="#BB7D11" />
                                        </linearGradient>
                                    </defs>
                                </svg>

                                <span> Hands-on, in-room instruction</span></li>
                            <li className={styles["who-we-teach__list-item"]}>
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.0827 17.2107L18.6107 8.68267L17.6667 7.73867L10.0827 15.3227L6.28267 11.5227L5.33867 12.4667L10.0827 17.2107ZM12.004 24C10.3453 24 8.78533 23.6853 7.324 23.056C5.86356 22.4258 4.59289 21.5707 3.512 20.4907C2.43111 19.4107 1.57556 18.1413 0.945333 16.6827C0.315111 15.224 0 13.6644 0 12.004C0 10.3436 0.315111 8.78356 0.945333 7.324C1.57467 5.86356 2.42844 4.59289 3.50667 3.512C4.58489 2.43111 5.85467 1.57556 7.316 0.945333C8.77733 0.315111 10.3373 0 11.996 0C13.6547 0 15.2147 0.315111 16.676 0.945333C18.1364 1.57467 19.4071 2.42889 20.488 3.508C21.5689 4.58711 22.4244 5.85689 23.0547 7.31733C23.6849 8.77778 24 10.3373 24 11.996C24 13.6547 23.6853 15.2147 23.056 16.676C22.4267 18.1373 21.5716 19.408 20.4907 20.488C19.4098 21.568 18.1404 22.4236 16.6827 23.0547C15.2249 23.6858 13.6653 24.0009 12.004 24Z" fill="url(#paint0_linear_282_451)" />
                                    <defs>
                                        <linearGradient id="paint0_linear_282_451" x1="12" y1="0" x2="12" y2="24" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#F4DEAE" />
                                            <stop offset="1" stopColor="#BB7D11" />
                                        </linearGradient>
                                    </defs>
                                </svg>

                                <span>Assessment before certification</span>

                            </li>
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
                                    <span>Explore more</span>
                                    <svg
                                        width="1.5em"
                                        viewBox="0 0 18 12"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M1 6H16.5M16.5 6L11.5 1M16.5 6L11.5 1M16.5 6L11.5 11"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}