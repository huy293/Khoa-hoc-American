import styles from '@/styles/home/TheCoutrueMethod.module.css';

export default function TheCoutrueMethod() {
    return (
        <section className={styles['the-coutrue-method']}>

            <div className={styles['the-coutrue-method__circle']}>
                <span className={styles['the-coutrue-method__circle-1']}>

                </span>
                <span className={styles['the-coutrue-method__circle-2']}>

                </span>
            </div>


            <div className={styles['the-coutrue-method__container']}>
                <div className={styles['the-coutrue-method__content']}>
                    {/* Left Column: Circular Video Frame & Animation */}
                    <div className={styles["the-coutrue-method__visual-wrapper"]}>
                        <div className={styles["the-coutrue-method__circle-wrapper"]}>
                            {/* Curved SVG Text "How we teach" & Outer Circle Line */}
                            <svg
                                className={styles["the-coutrue-method__curved-svg"]}
                                viewBox="0 0 520 520"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                {/* Outer ring with clean gap where the text sits */}
                                <path
                                    d="M 197, 23 A 248,248 0 1,1 23, 197"
                                    stroke="#E3CDAE"
                                    strokeWidth="1"
                                    strokeOpacity="0.75"
                                    fill="none"
                                />

                                {/* Path for text positioned right on the same circle line */}
                                <path
                                    id="howWeTeachCurve"
                                    d="M 20, 205 A 248,248 0 0,1 205, 20"
                                    fill="none"
                                />
                                <text
                                    className={styles["the-coutrue-method__curved-text"]}
                                    dominantBaseline="central"
                                >
                                    <textPath href="#howWeTeachCurve" startOffset="50%" textAnchor="middle">
                                        How we teach
                                    </textPath>
                                </text>
                            </svg>

                            {/* Circular Video Frame with soft peach gradient rim */}
                            <div className={styles["the-coutrue-method__video-frame"]}>
                                <div className={styles["the-coutrue-method__video-inner"]}>
                                    <video
                                        src="/videos/Gold_line_drawing_animation.mp4"
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        className={styles["the-coutrue-method__video"]}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Title and Course List */}
                    <div className={styles['the-coutrue-method__info-wrapper']}>
                        <h2 className={styles['the-coutrue-method__title']}>THE COUTURE METHOD</h2>
                        <ul className={styles['the-coutrue-method__list-courses']}>
                            <li className={styles['the-coutrue-method__course-item-wrapper']}>
                                <div className={styles['the-coutrue-method__list-courses__item']}>
                                    <div className={styles['the-coutrue-method__item-number-box']}>
                                        <p className={styles['the-coutrue-method__item-number']}>1</p>
                                    </div>

                                    <div className={styles['the-coutrue-method__item-text']}>
                                        <h3 className={styles['the-coutrue-method__item-title']}>We teach in the room</h3>
                                        <p className={styles['the-coutrue-method__item-desc']}>Every course is taught in person, in our Houston classrooms.</p>
                                    </div>
                                </div>
                            </li>
                            <li className={styles['the-coutrue-method__course-item-wrapper']}>
                                <div className={styles['the-coutrue-method__list-courses__item']}>
                                    <div className={styles['the-coutrue-method__item-number-box']}>
                                        <p className={styles['the-coutrue-method__item-number']}>2</p>
                                    </div>

                                    <div className={styles['the-coutrue-method__item-text']}>
                                        <h3 className={styles['the-coutrue-method__item-title']}>We teach on live models</h3>
                                        <p className={styles['the-coutrue-method__item-desc']}>Students practise on real skin under supervision</p>
                                    </div>
                                </div>
                            </li>
                            <li className={styles['the-coutrue-method__course-item-wrapper']}>
                                <div className={styles['the-coutrue-method__list-courses__item']}>
                                    <div className={styles['the-coutrue-method__item-number-box']}>
                                        <p className={styles['the-coutrue-method__item-number']}>3</p>
                                    </div>

                                    <div className={styles['the-coutrue-method__item-text']}>
                                        <h3 className={styles['the-coutrue-method__item-title']}>No certificate without assessment</h3>
                                        <p className={styles['the-coutrue-method__item-desc']}>Every course is taught in person, in our classrooms.</p>
                                    </div>
                                </div>
                            </li>
                            <li className={styles['the-coutrue-method__course-item-wrapper']}>
                                <div className={styles['the-coutrue-method__list-courses__item']}>
                                    <div className={styles['the-coutrue-method__item-number-box']}>
                                        <p className={styles['the-coutrue-method__item-number']}>4</p>
                                    </div>

                                    <div className={styles['the-coutrue-method__item-text']}>
                                        <h3 className={styles['the-coutrue-method__item-title']}>We teach in the room</h3>
                                        <p className={styles['the-coutrue-method__item-desc']}>Students learn on the same professional lines </p>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className={styles['the-coutrue-method__lines']}>
                <span className={`${styles['the-coutrue-method__line']} ${styles['the-coutrue-method__line-1']}`}></span>
                <span className={`${styles['the-coutrue-method__line']} ${styles['the-coutrue-method__line-2']}`}></span>
                <span className={`${styles['the-coutrue-method__line']} ${styles['the-coutrue-method__line-3']}`}></span>
            </div>
        </section>
    );
}