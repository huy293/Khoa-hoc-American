import styles from "@/styles/about-us/PeopleSection.module.css";
import ButtonStyle1 from "@/components/common/ButtonStyle1";
import { WPAboutFields, WPInstructorCard } from "@/types/wordpress";

interface PeopleSectionProps {
    data?: Partial<WPAboutFields>;
}

export default function PeopleSection({ data }: PeopleSectionProps = {}) {
    const eyebrow = data?.instructor_eyebrow || data?.about_instructors_eyebrow || "MEET YOUR INSTRUCTOR";
    const title = data?.instructor_title || data?.about_instructors_title || "Meet Teaching & Training Team";
    const description = data?.instructor_desc || data?.about_instructors_desc || "Advanced Skincare · Facial Techniques · Beauty Aesthetics · Professional Practice";
    const rawCards = data?.instructor_cards || data?.about_instructors;
    const cards: WPInstructorCard[] = (rawCards && rawCards.length > 0) ? rawCards : [];

    if (cards.length === 0) return null;

    return (
        <section className={styles["about-people"]}>
            {/* Background Decorative Large Ring & Star */}
            <div className={styles["about-people__circle-decor"]}>
                <div className={styles["about-people__circle-star"]}>
                    <span className={styles["about-people__circle-ring"]}></span>
                    <svg
                        width="32"
                        height="48"
                        viewBox="0 0 32 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={styles["about-people__circle-star-icon"]}
                    >
                        <g filter="url(#about_people_star_filter)">
                            <path
                                d="m16 38-.57-5.93A10.21 10.21 0 0 0 10 24a10.21 10.21 0 0 0 5.43-8.07L16 10l.57 5.93A10.21 10.21 0 0 0 22 24a10.21 10.21 0 0 0-5.43 8.07z"
                                fill="url(#about_people_star_grad)"
                            />
                        </g>
                        <defs>
                            <linearGradient
                                id="about_people_star_grad"
                                x1="22"
                                y1="24"
                                x2="10"
                                y2="24"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#ffa200" />
                                <stop offset="1" stopColor="#ffe8c0" />
                            </linearGradient>
                            <filter
                                id="about_people_star_filter"
                                x="0"
                                y="0"
                                width="32"
                                height="48"
                                filterUnits="userSpaceOnUse"
                                colorInterpolationFilters="sRGB"
                            >
                                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                <feColorMatrix
                                    in="SourceAlpha"
                                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                                    result="hardAlpha"
                                />
                                <feOffset />
                                <feGaussianBlur stdDeviation="5" />
                                <feColorMatrix
                                    values="0 0 0 0 0.966346 0 0 0 0 0.830067 0 0 0 0 0.557507 0 0 0 0.8 0"
                                />
                                <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_523_1467" />
                                <feBlend in="SourceGraphic" in2="effect1_dropShadow_523_1467" result="shape" />
                            </filter>
                        </defs>
                    </svg>
                </div>
            </div>
            <div className={styles["about-people__wrapper"]}>
                <div className={styles["about-people__container"]}>
                    {/* 1. Header Row */}
                    <div className={styles["about-people__header"]}>
                        <div className={styles["about-people__header-left"]}>
                            <p className={styles["about-people__eyebrow"]}>{eyebrow}</p>
                            <span className={styles["about-people__divider"]}></span>
                            <h2
                                className={styles["about-people__title"]}
                                dangerouslySetInnerHTML={{ __html: title }}
                            />
                        </div>

                        <div className={styles["about-people__header-right"]}>
                            <p className={styles["about-people__description"]}>
                                {description}
                            </p>
                            <div className={styles["about-people__cta"]}>
                                <ButtonStyle1 text="About Us" />
                            </div>
                        </div>
                    </div>

                    {/* 2. Content / Grid Area */}
                    <div className={styles["about-people__content"]}>
                        <div className={styles["about-people__grid"]}>
                            {cards.map((person, idx) => {
                                const imgSrc = typeof person.image === 'string' ? person.image : (person.image?.sourceUrl || (idx === 0 ? "/images/thomas-nguyen.png" : "/images/kathleen.png"));
                                const tagsList = Array.isArray(person.tags) ? person.tags : [];

                                return (
                                    <div key={idx} className={styles["about-people__card"]}>
                                        {/* Top: Quote Box */}
                                        <div className={styles["about-people__quote-box"]}>
                                            <svg
                                                width="39"
                                                height="31"
                                                viewBox="0 0 39 31"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className={styles["about-people__quote-icon"]}
                                            >
                                                <path
                                                    d="M20.3585 23.625C20.3585 19.2917 21.9528 15 25.1415 10.75C28.3302 6.41667 32.7453 2.83333 38.3868 0L39 1.75C35.1572 4.08333 32.0912 6.70833 29.8019 9.625C27.5126 12.4583 26.2453 15.2917 26 18.125C26.9811 17.2083 28.0031 16.4583 29.066 15.875C30.2107 15.2917 31.3145 15 32.3774 15C33.522 15 34.3805 15.4167 34.9528 16.25C35.5252 17 35.8113 18.0417 35.8113 19.375C35.8113 21.125 35.3208 22.9167 34.3396 24.75C33.3585 26.5 32.0912 28 30.5377 29.25C29.066 30.4167 27.4717 31 25.7547 31C23.8742 31 22.4843 30.3333 21.5849 29C20.7673 27.6667 20.3585 25.875 20.3585 23.625ZM0 23.625C0 19.2917 1.59434 15 4.78302 10.75C7.9717 6.41667 12.3868 2.83333 18.0283 0L18.6415 1.75C14.7987 4.08333 11.7327 6.70833 9.4434 9.625C7.15409 12.4583 5.88679 15.2917 5.64151 18.125C6.62264 17.2083 7.64465 16.4583 8.70755 15.875C9.8522 15.2917 10.956 15 12.0189 15C13.1635 15 14.022 15.4167 14.5943 16.25C15.1667 17 15.4528 18.0417 15.4528 19.375C15.4528 21.125 14.9623 22.9167 13.9811 24.75C13 26.5 11.7327 28 10.1792 29.25C8.70755 30.4167 7.11321 31 5.39623 31C3.51572 31 2.12579 30.3333 1.22641 29C0.408805 27.6667 0 25.875 0 23.625Z"
                                                    fill="#BC7300"
                                                    fillOpacity="0.8"
                                                />
                                            </svg>

                                            <h3 className={styles["about-people__quote-text"]}>
                                                {person.quote_text}
                                            </h3>
                                            <span className={styles["about-people__quote-divider"]}></span>
                                            <p className={styles["about-people__quote-author"]}>
                                                {person.quote_author}
                                            </p>
                                        </div>

                                        {/* Bottom: Profile Info & Image */}
                                        <div className={styles["about-people__profile-box"]}>
                                            <div className={styles["about-people__profile-info"]}>
                                                <p className={styles["about-people__profile-name"]}>{person.name}</p>
                                                <p className={styles["about-people__profile-role"]}>{person.role}</p>
                                                <p className={styles["about-people__profile-bio"]}>{person.bio}</p>
                                                {tagsList.length > 0 && (
                                                    <ul className={styles["about-people__profile-tags"]}>
                                                        {tagsList.map((tag, tIdx) => (
                                                            <li key={tIdx} className={styles["about-people__profile-tag"]}>
                                                                <span>★</span> {tag}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>

                                            <div className={styles["about-people__profile-image-box"]}>
                                                <img
                                                    src={imgSrc}
                                                    alt={person.name}
                                                    className={styles["about-people__profile-image"]}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}