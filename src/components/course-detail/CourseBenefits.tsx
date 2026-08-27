'use client';

import React from 'react';
import styles from '@/styles/course-detail/CourseBenefits.module.css';

/* ── Golden Badge Medal SVG ── */
const BenefitBadgeIcon = ({ id = '1' }: { id?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="124"
        height="124"
        viewBox="0 0 124 124"
        fill="none"
        className={styles['benefit-card__icon']}
    >
        <path
            d="M109.792 95.4282L101.267 97.4433C99.3553 97.9083 97.8569 99.3549 97.4436 101.267L95.6353 108.862C94.6536 112.995 89.3836 114.287 86.6453 111.032L71.1969 93.2582C69.9569 91.8116 70.6286 89.5382 72.4886 89.0732C81.6336 86.8516 89.8486 81.7366 95.8936 74.4516C96.8753 73.2633 98.6319 73.1082 99.7169 74.1932L111.187 85.6633C115.114 89.5899 113.719 94.4982 109.792 95.4282Z"
            fill={`url(#paint0_linear_benefit_${id})`}
        />
        <path
            d="M13.9504 95.4282L22.4754 97.4433C24.387 97.9083 25.8854 99.3549 26.2987 101.267L28.107 108.862C29.0887 112.995 34.3587 114.287 37.097 111.032L52.5454 93.2582C53.7854 91.8116 53.1137 89.5382 51.2537 89.0732C42.1087 86.8516 33.8937 81.7366 27.8487 74.4516C26.867 73.2633 25.1104 73.1082 24.0254 74.1932L12.5554 85.6633C8.62869 89.5899 10.0237 94.4982 13.9504 95.4282Z"
            fill={`url(#paint1_linear_benefit_${id})`}
        />
        <path
            d="M61.9997 10.3333C42.0047 10.3333 25.833 26.5049 25.833 46.4999C25.833 53.9916 28.0547 60.8633 31.878 66.5983C37.458 74.8649 46.293 80.7033 56.5747 82.2016C58.3313 82.5116 60.1397 82.6666 61.9997 82.6666C63.8597 82.6666 65.668 82.5116 67.4247 82.2016C77.7063 80.7033 86.5413 74.8649 92.1213 66.5983C95.9447 60.8633 98.1663 53.9916 98.1663 46.4999C98.1663 26.5049 81.9947 10.3333 61.9997 10.3333ZM77.8097 45.3633L73.5213 49.6516C72.798 50.3749 72.3847 51.7699 72.643 52.8033L73.883 58.1249C74.8647 62.3099 72.643 63.9633 68.923 61.7416L63.7563 58.6933C62.8263 58.1249 61.2763 58.1249 60.3463 58.6933L55.1797 61.7416C51.4597 63.9116 49.238 62.3099 50.2197 58.1249L51.4597 52.8033C51.6663 51.8216 51.3047 50.3749 50.5813 49.6516L46.1897 45.3633C43.658 42.8316 44.4847 40.2999 47.998 39.7316L53.5263 38.8016C54.4563 38.6466 55.5413 37.8199 55.9547 36.9933L59.003 30.8966C60.6563 27.5899 63.343 27.5899 64.9963 30.8966L68.0447 36.9933C68.458 37.8199 69.543 38.6466 70.5247 38.8016L76.053 39.7316C79.5147 40.2999 80.3413 42.8316 77.8097 45.3633Z"
            fill={`url(#paint2_linear_benefit_${id})`}
        />
        <defs>
            <linearGradient
                id={`paint0_linear_benefit_${id}`}
                x1="92.0459"
                y1="73.4629"
                x2="92.0459"
                y2="112.867"
                gradientUnits="userSpaceOnUse"
            >
                <stop stopColor="#E0D0AE" />
                <stop offset="0.45" stopColor="#DEBB74" />
                <stop offset="0.55" stopColor="#CFAD6D" />
                <stop offset="1" stopColor="#CDB688" />
            </linearGradient>
            <linearGradient
                id={`paint1_linear_benefit_${id}`}
                x1="31.6963"
                y1="73.4629"
                x2="31.6963"
                y2="112.867"
                gradientUnits="userSpaceOnUse"
            >
                <stop stopColor="#E0D0AE" />
                <stop offset="0.45" stopColor="#DEBB74" />
                <stop offset="0.55" stopColor="#CFAD6D" />
                <stop offset="1" stopColor="#CDB688" />
            </linearGradient>
            <linearGradient
                id={`paint2_linear_benefit_${id}`}
                x1="61.9997"
                y1="10.3333"
                x2="61.9997"
                y2="82.6666"
                gradientUnits="userSpaceOnUse"
            >
                <stop stopColor="#E0D0AE" />
                <stop offset="0.45" stopColor="#DEBB74" />
                <stop offset="0.55" stopColor="#CFAD6D" />
                <stop offset="1" stopColor="#CDB688" />
            </linearGradient>
        </defs>
    </svg>
);

interface BenefitItem {
    id: string;
    title: string;
    description: string;
}

const BENEFITS_DATA: BenefitItem[] = [
    {
        id: 'benefit-1',
        title: 'Master Advanced Applications Technology Facial',
        description:
            'You will gain access to and become proficient in a leading global skincare technology, elevating your skills and reputation in the industry.',
    },
    {
        id: 'benefit-2',
        title: 'Increase Income and Career Opportunities',
        description:
            'Earning a HydraFacial certification makes it easier to secure positions at high-end spas and clinics or to start your own business.',
    },
    {
        id: 'benefit-3',
        title: 'Address a Wide Range of Skin Concerns',
        description:
            'The course provides the knowledge to address various skin issues, giving you confidence in consulting and treating clients.',
    },
];

export default function CourseBenefits() {
    return (
        <section className={styles['benefits-section']}>
            {/* ── 1. Header (Eyebrow, Gradient Line, Title) ── */}
            <div className={styles['benefits-section__header']}>
                <div className={styles['benefits-section__eyebrow-wrapper']}>
                    <span className={styles['benefits-section__eyebrow']}>BENEFITS OF COURSE</span>
                    <div className={styles['benefits-section__eyebrow-line']} />
                </div>
                <h2 className={styles['benefits-section__title']}>
                    What You&apos;ll Gain From
                    <br />
                    This Course
                </h2>
            </div>

            {/* ── 2. Benefits Row / Grid (3 Items) ── */}
            <div className={styles['benefits-section__content']}>
                {BENEFITS_DATA.map((item, index) => (
                    <div key={item.id} className={styles['benefit-card']}>
                        <BenefitBadgeIcon id={`${index + 1}`} />
                        <div className={styles['benefit-card__text-wrap']}>
                            <h3 className={styles['benefit-card__title']}>{item.title}</h3>
                            <p className={styles['benefit-card__description']}>{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
