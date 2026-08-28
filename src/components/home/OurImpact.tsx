import styles from "@/styles/home/OurImpact.module.css";
import HeaderText from "@/components/common/HeaderText";

export default function OurImpact() {
    return (
        <section className={styles["our-impact"]}>
            <div className={styles["our-impact__container"]}>
                {/* Top Header Row */}
                <div className={styles["our-impact__wrapper"]}>
                    <div className={styles["our-impact__header"]}>
                        <HeaderText
                            className={styles["our-impact__header-left"]}
                            eyebrow="OUR IMPACT"
                            title={<>We train the people behind the <br />treatment room</>}
                        />

                        <div className={styles["our-impact__header-right"]}>
                            <p className={styles["our-impact__description"]}>
                                One campus in Houston. Every lesson begins on this floor.
                            </p>
                            <a href="#catalog" className={styles["our-impact__link"]}>
                                <span>ACADEMY CATALOG</span>
                                <svg
                                    width="14"
                                    height="10"
                                    viewBox="0 0 14 10"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={styles["our-impact__link-icon"]}
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

                    {/* 3 Impact Cards Grid */}
                    <div className={styles["our-impact__grid"]}>
                        {/* Card 1: 27 Programs */}
                        <div className={styles["our-impact__card"]}>
                            <div className={styles["our-impact__card-decor"]}>
                                <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g filter="url(#filter0_d_383_84)">
                                        <path d="M9.99978 10L11.6781 11.2529C14.7706 13.5614 18.9039 13.9188 22.3468 12.1753C20.485 15.5556 20.6988 19.6989 22.8987 22.8696L24.0926 24.5903L22.4143 23.3374C19.3218 21.0289 15.1885 20.6715 11.7456 22.415C13.6075 19.0347 13.3936 14.8914 11.1937 11.7208L9.99978 10Z" fill="url(#paint0_linear_383_84)" />
                                    </g>
                                    <defs>
                                        <filter id="filter0_d_383_84" x="0" y="0" width="34.0928" height="34.5903" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                            <feOffset />
                                            <feGaussianBlur stdDeviation="5" />
                                            <feColorMatrix type="matrix" values="0 0 0 0 0.966346 0 0 0 0 0.830067 0 0 0 0 0.557507 0 0 0 0.8 0" />
                                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_383_84" />
                                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_383_84" result="shape" />
                                        </filter>
                                        <linearGradient id="paint0_linear_383_84" x1="9.99978" y1="10" x2="24.0926" y2="24.5903" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#E0D0AE" />
                                            <stop offset="0.45" stopColor="#DEBB74" />
                                            <stop offset="0.55" stopColor="#CFAD6D" />
                                            <stop offset="1" stopColor="#CDB688" />
                                        </linearGradient>
                                    </defs>
                                </svg>

                            </div>

                            <div className={styles["our-impact__stat"]}>
                                <span className={styles["our-impact__number"]}>27</span>
                                <span className={styles["our-impact__script"]}>Programs</span>
                            </div>

                            <div className={styles["our-impact__divider"]}>
                                <svg width="32" height="48" viewBox="0 0 32 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g filter="url(#a)"><path d="m16 10 .57 5.93A10.21 10.21 0 0 0 22 24a10.21 10.21 0 0 0-5.43 8.07L16 38l-.57-5.93A10.21 10.21 0 0 0 10 24a10.21 10.21 0 0 0 5.43-8.07z" fill="url(#b)" /></g><defs><linearGradient id="b" x1="16" y1="10" x2="16" y2="38" gradientUnits="userSpaceOnUse"><stop stopColor="#e0d0ae" /><stop offset=".45" stopColor="#debb74" /><stop offset=".55" stopColor="#cfad6d" /><stop offset="1" stopColor="#cdb688" /></linearGradient><filter id="a" x="0" y="0" width="32" height="48" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix" /><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" /><feOffset /><feGaussianBlur stdDeviation="5" /><feColorMatrix values="0 0 0 0 0.966346 0 0 0 0 0.830067 0 0 0 0 0.557507 0 0 0 0.8 0" /><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_383_81" /><feBlend in="SourceGraphic" in2="effect1_dropShadow_383_81" result="shape" /></filter></defs></svg>
                                <span className={styles["our-impact__divider-line"]}></span>
                            </div>

                            <p className={styles["our-impact__label"]}>ACROSS FOUR DISCIPLINES</p>
                        </div>

                        {/* Card 2: 2,400+ Graduates */}
                        <div className={styles["our-impact__card"]}>
                            <div className={styles["our-impact__card-decor"]}>
                                <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g filter="url(#filter0_d_383_84)">
                                        <path d="M9.99978 10L11.6781 11.2529C14.7706 13.5614 18.9039 13.9188 22.3468 12.1753C20.485 15.5556 20.6988 19.6989 22.8987 22.8696L24.0926 24.5903L22.4143 23.3374C19.3218 21.0289 15.1885 20.6715 11.7456 22.415C13.6075 19.0347 13.3936 14.8914 11.1937 11.7208L9.99978 10Z" fill="url(#paint0_linear_383_84)" />
                                    </g>
                                    <defs>
                                        <filter id="filter0_d_383_84" x="0" y="0" width="34.0928" height="34.5903" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                            <feOffset />
                                            <feGaussianBlur stdDeviation="5" />
                                            <feColorMatrix type="matrix" values="0 0 0 0 0.966346 0 0 0 0 0.830067 0 0 0 0 0.557507 0 0 0 0.8 0" />
                                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_383_84" />
                                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_383_84" result="shape" />
                                        </filter>
                                        <linearGradient id="paint0_linear_383_84" x1="9.99978" y1="10" x2="24.0926" y2="24.5903" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#E0D0AE" />
                                            <stop offset="0.45" stopColor="#DEBB74" />
                                            <stop offset="0.55" stopColor="#CFAD6D" />
                                            <stop offset="1" stopColor="#CDB688" />
                                        </linearGradient>
                                    </defs>
                                </svg>

                            </div>


                            <div className={styles["our-impact__stat"]}>
                                <span className={styles["our-impact__number"]}>2,400+</span>
                                <span className={styles["our-impact__script"]}>Graduates</span>
                            </div>

                            <div className={styles["our-impact__divider"]}>
                                <svg width="32" height="48" viewBox="0 0 32 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g filter="url(#a)"><path d="m16 10 .57 5.93A10.21 10.21 0 0 0 22 24a10.21 10.21 0 0 0-5.43 8.07L16 38l-.57-5.93A10.21 10.21 0 0 0 10 24a10.21 10.21 0 0 0 5.43-8.07z" fill="url(#b)" /></g><defs><linearGradient id="b" x1="16" y1="10" x2="16" y2="38" gradientUnits="userSpaceOnUse"><stop stopColor="#e0d0ae" /><stop offset=".45" stopColor="#debb74" /><stop offset=".55" stopColor="#cfad6d" /><stop offset="1" stopColor="#cdb688" /></linearGradient><filter id="a" x="0" y="0" width="32" height="48" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix" /><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" /><feOffset /><feGaussianBlur stdDeviation="5" /><feColorMatrix values="0 0 0 0 0.966346 0 0 0 0 0.830067 0 0 0 0 0.557507 0 0 0 0.8 0" /><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_383_81" /><feBlend in="SourceGraphic" in2="effect1_dropShadow_383_81" result="shape" /></filter></defs></svg>
                                <span className={styles["our-impact__divider-line"]}></span>
                            </div>

                            <p className={styles["our-impact__label"]}>NOW WORKING IN THE FIELD</p>
                        </div>

                        {/* Card 3: 10+ Years */}
                        <div className={styles["our-impact__card"]}>
                            <div className={styles["our-impact__card-decor"]}>
                                <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g filter="url(#filter0_d_383_84)">
                                        <path d="M9.99978 10L11.6781 11.2529C14.7706 13.5614 18.9039 13.9188 22.3468 12.1753C20.485 15.5556 20.6988 19.6989 22.8987 22.8696L24.0926 24.5903L22.4143 23.3374C19.3218 21.0289 15.1885 20.6715 11.7456 22.415C13.6075 19.0347 13.3936 14.8914 11.1937 11.7208L9.99978 10Z" fill="url(#paint0_linear_383_84)" />
                                    </g>
                                    <defs>
                                        <filter id="filter0_d_383_84" x="0" y="0" width="34.0928" height="34.5903" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                            <feOffset />
                                            <feGaussianBlur stdDeviation="5" />
                                            <feColorMatrix type="matrix" values="0 0 0 0 0.966346 0 0 0 0 0.830067 0 0 0 0 0.557507 0 0 0 0.8 0" />
                                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_383_84" />
                                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_383_84" result="shape" />
                                        </filter>
                                        <linearGradient id="paint0_linear_383_84" x1="9.99978" y1="10" x2="24.0926" y2="24.5903" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#E0D0AE" />
                                            <stop offset="0.45" stopColor="#DEBB74" />
                                            <stop offset="0.55" stopColor="#CFAD6D" />
                                            <stop offset="1" stopColor="#CDB688" />
                                        </linearGradient>
                                    </defs>
                                </svg>

                            </div>


                            <div className={styles["our-impact__stat"]}>
                                <span className={styles["our-impact__number"]}>10+</span>
                                <span className={styles["our-impact__script"]}>Years</span>
                            </div>

                            <div className={styles["our-impact__divider"]}>
                                <svg width="32" height="48" viewBox="0 0 32 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g filter="url(#a)"><path d="m16 10 .57 5.93A10.21 10.21 0 0 0 22 24a10.21 10.21 0 0 0-5.43 8.07L16 38l-.57-5.93A10.21 10.21 0 0 0 10 24a10.21 10.21 0 0 0 5.43-8.07z" fill="url(#b)" /></g><defs><linearGradient id="b" x1="16" y1="10" x2="16" y2="38" gradientUnits="userSpaceOnUse"><stop stopColor="#e0d0ae" /><stop offset=".45" stopColor="#debb74" /><stop offset=".55" stopColor="#cfad6d" /><stop offset="1" stopColor="#cdb688" /></linearGradient><filter id="a" x="0" y="0" width="32" height="48" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB"><feFlood floodOpacity="0" result="BackgroundImageFix" /><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" /><feOffset /><feGaussianBlur stdDeviation="5" /><feColorMatrix values="0 0 0 0 0.966346 0 0 0 0 0.830067 0 0 0 0 0.557507 0 0 0 0.8 0" /><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_383_81" /><feBlend in="SourceGraphic" in2="effect1_dropShadow_383_81" result="shape" /></filter></defs></svg>
                                <span className={styles["our-impact__divider-line"]}></span>
                            </div>

                            <p className={styles["our-impact__label"]}>TRAINING PROFESSIONALS</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}