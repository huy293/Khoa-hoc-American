import React from 'react';
import Image from 'next/image';
import DashboardHeadings from '@/components/dashboard/DashboardHeadings';
import styles from '@/styles/dashboard/schedule/ScheduleDetailedSection.module.css';

/* ── SVG Icons ── */
const ClockIcon = ({ className }: { className?: string }) => (
    <svg
        className={className}
        width="13"
        height="13"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <circle cx="7" cy="7" r="5.8" stroke="currentColor" strokeWidth="1.2" />
        <path
            d="M7 3.5V7L9.3 8.2"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const BuildingIcon = ({ className }: { className?: string }) => (
    <svg
        className={className}
        width="14"
        height="14"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <path
            d="M2 14H14M3.5 14V6.5M12.5 14V6.5M6.5 14V6.5M9.5 14V6.5M1.5 6.5L8 2L14.5 6.5H1.5Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const LocationPinIcon = ({ className }: { className?: string }) => (
    <svg
        className={className}
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <path
            d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <circle cx="12" cy="9" r="2.8" stroke="currentColor" strokeWidth="1.5" />
    </svg>
);

const StarIcon = ({ className }: { className?: string }) => (
    <svg
        className={className}
        width="12"
        height="12"
        viewBox="0 0 14 14"
        fill="#F79E1B"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <path
            d="M7 1L8.85 4.76L13 5.37L10 8.29L10.71 12.42L7 10.47L3.29 12.42L4 8.29L1 5.37L5.15 4.76L7 1Z"
            fill="#F79E1B"
            stroke="#F79E1B"
            strokeWidth="0.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

/* ── Data Interfaces ── */
interface ScheduleDetailItem {
    id: string;
    title: string;
    titleVariant: 'gold' | 'dark';
    time: string;
    format: 'Online' | 'On-site';
    location: string;
    trainer: {
        name: string;
        rating: string;
        avatar: string;
    };
}

interface ScheduleDetailGroup {
    id: string;
    date: {
        dayName: string;
        dayNum: number;
        month: string;
    };
    badgeTheme: 'cream' | 'gray';
    items: ScheduleDetailItem[];
}

const SCHEDULE_GROUPS: ScheduleDetailGroup[] = [
    {
        id: 'group-1',
        date: {
            dayName: 'Tue',
            dayNum: 16,
            month: 'February',
        },
        badgeTheme: 'cream',
        items: [
            {
                id: 'item-1-1',
                title: 'HydraFacial lesson 1 Online',
                titleVariant: 'gold',
                time: '09:00 - 10:20',
                format: 'Online',
                location: 'Online/ VOD',
                trainer: {
                    name: 'Kathleen trainer',
                    rating: '4.9/5.0',
                    avatar: '/images/kathleen.png',
                },
            },
            {
                id: 'item-1-2',
                title: 'Class Schedule HydraFacial lesson 1 Online',
                titleVariant: 'gold',
                time: '13:00 - 16:20',
                format: 'On-site',
                location: 'Couture Beauty Academy - Training Room 02',
                trainer: {
                    name: 'Kathleen trainer',
                    rating: '4.9/5.0',
                    avatar: '/images/kathleen.png',
                },
            },
        ],
    },
    {
        id: 'group-2',
        date: {
            dayName: 'Tue',
            dayNum: 16,
            month: 'February',
        },
        badgeTheme: 'gray',
        items: [
            {
                id: 'item-2-1',
                title: 'HydraFacial lesson 1 Online',
                titleVariant: 'dark',
                time: '09:00 - 10:20',
                format: 'Online',
                location: 'Online/ VOD',
                trainer: {
                    name: 'Kathleen trainer',
                    rating: '4.9/5.0',
                    avatar: '/images/kathleen.png',
                },
            },
        ],
    },
];

export default function ScheduleDetailedSection() {
    return (
        <section className={styles['detailed-section']} aria-label="Detailed Class Schedule">
            <div className={styles['detailed-wrapper']}>
                <div className={styles['detailed-container']}>
                    {/* Section Headings Component */}
                    <DashboardHeadings
                        tag="SCHEDULE"
                        title="Detailed class schedule"
                        className={styles['detailed-heading']}
                    />

                    {/* Schedule Groups List */}
                    <div className={styles['detailed-list']}>
                        {SCHEDULE_GROUPS.map((group) => (
                            <div key={group.id} className={styles['detailed-group']}>
                                {/* Left Date Badge */}
                                <div
                                    className={`${styles['detailed-date-badge']} ${
                                        group.badgeTheme === 'cream'
                                            ? styles['detailed-date-badge--cream']
                                            : styles['detailed-date-badge--gray']
                                    }`}
                                >
                                    <span className={styles['detailed-date-badge__day-name']}>
                                        {group.date.dayName}
                                    </span>
                                    <span className={styles['detailed-date-badge__day-num']}>
                                        {group.date.dayNum}
                                    </span>
                                    <span className={styles['detailed-date-badge__month']}>
                                        {group.date.month}
                                    </span>
                                </div>

                                {/* Right Content Items */}
                                <div className={styles['detailed-group__content']}>
                                    {group.items.map((item) => (
                                        <div key={item.id} className={styles['detailed-item']}>
                                            {/* Column 1: Course Info & Pills */}
                                            <div className={styles['detailed-item__course']}>
                                                <h3
                                                    className={`${styles['detailed-item__title']} ${
                                                        item.titleVariant === 'gold'
                                                            ? styles['detailed-item__title--gold']
                                                            : styles['detailed-item__title--dark']
                                                    }`}
                                                >
                                                    {item.title}
                                                </h3>

                                                <div className={styles['detailed-item__badges']}>
                                                    <span className={styles['detailed-item__badge']}>
                                                        <ClockIcon
                                                            className={styles['detailed-item__badge-icon']}
                                                        />
                                                        <span>{item.time}</span>
                                                    </span>

                                                    <span className={styles['detailed-item__badge']}>
                                                        <BuildingIcon
                                                            className={styles['detailed-item__badge-icon']}
                                                        />
                                                        <span>{item.format}</span>
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Column 2: Location / Format */}
                                            <div className={styles['detailed-item__location']}>
                                                <LocationPinIcon
                                                    className={styles['detailed-item__location-icon']}
                                                />
                                                <p className={styles['detailed-item__location-text']}>
                                                    {item.location}
                                                </p>
                                            </div>

                                            {/* Column 3: Trainer Info */}
                                            <div className={styles['detailed-item__trainer']}>
                                                <div
                                                    className={styles['detailed-item__trainer-avatar-wrap']}
                                                >
                                                    <Image
                                                        src={item.trainer.avatar}
                                                        alt={item.trainer.name}
                                                        width={40}
                                                        height={40}
                                                        className={styles['detailed-item__trainer-avatar']}
                                                    />
                                                </div>

                                                <div className={styles['detailed-item__trainer-info']}>
                                                    <h4 className={styles['detailed-item__trainer-name']}>
                                                        {item.trainer.name}
                                                    </h4>
                                                    <div
                                                        className={styles['detailed-item__trainer-rating']}
                                                    >
                                                        <StarIcon
                                                            className={styles['detailed-item__star-icon']}
                                                        />
                                                        <span>{item.trainer.rating}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
