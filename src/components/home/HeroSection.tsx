import styles from "@/styles/home/HeroSection.module.css";

export default function HeroSection() {
    return (
        <section className={styles["hero"]}>
            {/* 1. Background image */}
            <img
                src="/images/home/hero_section_background.png"
                alt="Hero Background"
                className={styles["hero__background"]}
            />

            {/* 2. Content wrapper */}
            <div className={styles["hero__wrapper"]}>
                <div className={styles["hero__container"]}>
                    {/* 3. Left column: Content info */}
                    <div className={styles["hero__content"]}>
                        <div className={styles["hero__eyebrow"]}>
                            <div className={styles["hero__eyebrow-text"]}>
                                HOUSTON, TEXAS · EST. 2015
                            </div>
                            <div className={styles["hero__eyebrow-divider"]}>
                                <svg width="376" height="48" viewBox="0 0 376 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <line x1="10" y1="24" x2="366" y2="24" stroke="url(#paint0_linear_282_410)" strokeWidth="2" />
                                    <g filter="url(#filter0_d_282_410)">
                                        <path d="M187.5 10L188.07 15.9301C188.4 19.3649 190.443 22.4005 193.5 24C190.443 25.5995 188.4 28.6351 188.07 32.0699L187.5 38L186.93 32.0699C186.6 28.6351 184.557 25.5995 181.5 24C184.557 22.4005 186.6 19.3649 186.93 15.9301L187.5 10Z" fill="url(#paint1_linear_282_410)" />
                                    </g>
                                    <defs>
                                        <filter id="filter0_d_282_410" x="171.5" y="0" width="32" height="48" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                            <feOffset />
                                            <feGaussianBlur stdDeviation="5" />
                                            <feColorMatrix type="matrix" values="0 0 0 0 0.966346 0 0 0 0 0.830067 0 0 0 0 0.557507 0 0 0 0.8 0" />
                                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_282_410" />
                                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_282_410" result="shape" />
                                        </filter>
                                        <linearGradient id="paint0_linear_282_410" x1="10" y1="25.5" x2="366" y2="25.5" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#DDD6C9" stopOpacity="0.5" />
                                            <stop offset="0.5" stopColor="#EFC879" />
                                            <stop offset="1" stopColor="#FAE9D3" stopOpacity="0.5" />
                                        </linearGradient>
                                        <linearGradient id="paint1_linear_282_410" x1="187.5" y1="10" x2="187.5" y2="38" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#E0D0AE" />
                                            <stop offset="0.45" stopColor="#DEBB74" />
                                            <stop offset="0.55" stopColor="#CFAD6D" />
                                            <stop offset="1" stopColor="#CDB688" />
                                        </linearGradient>
                                    </defs>
                                </svg>

                            </div>
                        </div>

                        <img
                            src="/images/home/coutrue-beauty-academy_logo.png"
                            alt="Couture Beauty Academy"
                            className={styles["hero__logo"]}
                        />

                        <p className={styles["hero__description"]}>
                            Couture Beauty Academy is a professional beauty & aesthetic training institution in Houston — home to estheticians, laser specialists and permanent-makeup artists.
                        </p>

                        <div className={styles["hero__actions"]}>
                            <a
                                href="#contact"
                                className={`${styles["hero__btn"]} ${styles["hero__btn--primary"]}`}
                            >
                                CONTACT ADMISSIONS
                            </a>
                            <a
                                href="#discover"
                                className={`${styles["hero__btn"]} ${styles["hero__btn--secondary"]}`}
                            >
                                <span>DISCOVER THE ACADEMY</span>
                                <svg
                                    className={styles["hero__btn-icon"]}
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
                            </a>
                        </div>
                    </div>

                    {/* 4. Right column: Visual / Member Image */}
                    <div className={styles["hero__visual"]}>
                        <div className={styles["hero__image-frame"]}>
                            <div className={styles["hero__image-radial-glow"]}></div>
                            <img
                                src="/images/home/coutrue-beauty-academy_member.png"
                                alt="Couture Beauty Academy Member"
                                className={styles["hero__image"]}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}