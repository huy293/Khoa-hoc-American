import styles from "@/styles/home/OurPeople.module.css";

export default function OurPeople() {
    return (
        <section className={styles["our-people"]}>
            {/* Background Decorative Large Circle & Star */}


            <div className={styles["our-people__container"]}>
                {/* 1. Header Row */}
                <div className={styles["our-people__header"]}>
                    <div className={styles["our-people__header-left"]}>
                        <p className={styles["our-people__eyebrow"]}>OUR PEOPLES</p>
                        <h2 className={styles["our-people__title"]}>Learn from the Experts</h2>
                    </div>

                    <div className={styles["our-people__header-right"]}>
                        <p className={styles["our-people__description"]}>
                            Focused training paths for skin, laser, permanent makeup, and professional licensing.
                        </p>
                        <a href="#explore" className={styles["our-people__link"]}>
                            <span>EXPLORE MORE</span>
                            <svg
                                width="14"
                                height="10"
                                viewBox="0 0 14 10"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className={styles["our-people__link-icon"]}
                            >
                                <path
                                    d="M1 5H13M13 5L9 1M13 5L9 9"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* 2. Main Content: Left Quote + Right Instructors */}
                <div className={styles["our-people__content"]}>
                    <div className={styles["our-people__circle-decor"]}>
                        <div className={styles["our-people__circle-ring"]}></div>
                        <div className={styles["our-people__circle-star"]}>
                            <svg width="32" height="48" viewBox="0 0 32 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g filter="url(#filter0_d_282_563)">
                                    <path d="M16 10L16.5698 15.9301C16.8998 19.3649 18.9425 22.4005 22 24C18.9425 25.5995 16.8998 28.6351 16.5698 32.0699L16 38L15.4302 32.0699C15.1002 28.6351 13.0575 25.5995 10 24C13.0575 22.4005 15.1002 19.3649 15.4302 15.9301L16 10Z" fill="url(#paint0_linear_282_563)" />
                                </g>
                                <defs>
                                    <filter id="filter0_d_282_563" x="0" y="0" width="32" height="48" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                        <feOffset />
                                        <feGaussianBlur stdDeviation="5" />
                                        <feColorMatrix type="matrix" values="0 0 0 0 0.966346 0 0 0 0 0.830067 0 0 0 0 0.557507 0 0 0 0.8 0" />
                                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_282_563" />
                                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_282_563" result="shape" />
                                    </filter>
                                    <linearGradient id="paint0_linear_282_563" x1="16" y1="10" x2="16" y2="38" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#E0D0AE" />
                                        <stop offset="0.45" stopColor="#DEBB74" />
                                        <stop offset="0.55" stopColor="#CFAD6D" />
                                        <stop offset="1" stopColor="#CDB688" />
                                    </linearGradient>
                                </defs>
                            </svg>

                        </div>
                    </div>
                    {/* Left Column: Quote */}
                    <div className={styles["our-people__quote-wrapper"]}>

                        <div className={styles["our-people__quote-mark"]}>
                            <svg width="39" height="31" viewBox="0 0 39 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20.3585 23.625C20.3585 19.2917 21.9528 15 25.1415 10.75C28.3302 6.41667 32.7453 2.83333 38.3868 0L39 1.75C35.1572 4.08333 32.0912 6.70833 29.8019 9.625C27.5126 12.4583 26.2453 15.2917 26 18.125C26.9811 17.2083 28.0031 16.4583 29.066 15.875C30.2107 15.2917 31.3145 15 32.3774 15C33.522 15 34.3805 15.4167 34.9528 16.25C35.5252 17 35.8113 18.0417 35.8113 19.375C35.8113 21.125 35.3208 22.9167 34.3396 24.75C33.3585 26.5 32.0912 28 30.5377 29.25C29.066 30.4167 27.4717 31 25.7547 31C23.8742 31 22.4843 30.3333 21.5849 29C20.7673 27.6667 20.3585 25.875 20.3585 23.625ZM0 23.625C0 19.2917 1.59434 15 4.78302 10.75C7.9717 6.41667 12.3868 2.83333 18.0283 0L18.6415 1.75C14.7987 4.08333 11.7327 6.70833 9.4434 9.625C7.15409 12.4583 5.88679 15.2917 5.64151 18.125C6.62264 17.2083 7.64465 16.4583 8.70755 15.875C9.8522 15.2917 10.956 15 12.0189 15C13.1635 15 14.022 15.4167 14.5943 16.25C15.1667 17 15.4528 18.0417 15.4528 19.375C15.4528 21.125 14.9623 22.9167 13.9811 24.75C13 26.5 11.7327 28 10.1792 29.25C8.70755 30.4167 7.11321 31 5.39623 31C3.51572 31 2.12579 30.3333 1.22641 29C0.408805 27.6667 0 25.875 0 23.625Z" fill="#BC7300" fillOpacity="0.8" />
                            </svg>

                        </div>
                        <p className={styles["our-people__quote-text"]}>
                            Every student leaves with
                            <br />
                            work I would sign
                            <br /> my name to.
                        </p>
                        <div className={styles["our-people__quote-divider"]}></div>
                        <p className={styles["our-people__quote-author"]}>EMILY</p>
                    </div>

                    {/* Right Column: 2 Instructors Showcase */}
                    <div className={styles["our-people__instructors-wrapper"]}>
                        {/* Soft Glow Halo */}
                        <div className={styles["our-people__glow"]}></div>

                        <div className={styles["our-people__instructors"]}>
                            {/* Instructor 1: Kathleen */}
                            <div className={styles["our-people__instructor"]}>
                                <div className={styles["our-people__instructor-image-box"]}>
                                    <img
                                        src="/images/home/kathleen.png"
                                        alt="Kathleen"
                                        className={styles["our-people__instructor-image"]}
                                    />
                                </div>

                            </div>

                            {/* Instructor 2: Emily */}
                            <div className={styles["our-people__instructor"]}>
                                <div className={styles["our-people__instructor-image-box"]}>
                                    <img
                                        src="/images/home/emily-2.png"
                                        alt="Emily"
                                        className={styles["our-people__instructor-image"]}
                                    />
                                </div>

                            </div>
                        </div>
                        <div className={styles["our-people__instructors-info-wrapper"]}>
                            <span className={styles["our-people__instructors-backgorund-blur"]}></span>
                            <div className={styles["our-people__instructor-info"]}>
                                <h3 className={styles["our-people__instructor-name"]}>Kathleen</h3>
                                <p className={styles["our-people__instructor-role"]}>Master Trainer</p>
                                <p className={styles["our-people__instructor-bio"]}>
                                    Trained at PhiBrows, Extreme Lash and Will Anthony Permanent Makeup Academy
                                </p>
                            </div>
                            <div className={styles["our-people__instructor-info"]}>
                                <h3 className={styles["our-people__instructor-name"]}>Emily</h3>
                                <p className={styles["our-people__instructor-role"]}>Master Trainer</p>
                                <p className={styles["our-people__instructor-bio"]}>
                                    Trained at PhiBrows, Extreme Lash and Will Anthony Permanent Makeup Academy
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
