'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import DashboardHeadings from '@/components/dashboard/DashboardHeadings';
import styles from '@/styles/dashboard/schedule/ScheduleDetailedSection.module.css';

/* ── SVG Icons ── */
const ChevronRightIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

const StudentsGroupIcon = () => (
    <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 14C14.2091 14 16 12.2091 16 10C16 7.79086 14.2091 6 12 6C9.79086 6 8 7.79086 8 10C8 12.2091 9.79086 14 12 14ZM21 15C22.6569 15 24 13.6569 24 12C24 10.3431 22.6569 9 21 9C19.3431 9 18 10.3431 18 12C18 13.6569 19.3431 15 21 15ZM12 17C8.68629 17 4 18.67 4 22V24C4 24.5523 4.44772 25 5 25H19C19.5523 25 20 24.5523 20 24V22C20 18.67 15.3137 17 12 17ZM21 18C20.66 18 20.29 18.02 19.91 18.06C21.19 19.14 22 20.48 22 22V24C22 24.36 21.94 24.7 21.84 25H27C27.5523 25 28 24.5523 28 24V22C28 19.33 23.97 18 21 18Z" fill="white" />
    </svg>
);

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
export interface ScheduleDetailItem {
    id: string;
    title: string;
    titleVariant: 'gold' | 'dark';
    time: string;
    format: 'Online' | 'On-site';
    location: string;
    trainer?: {
        name: string;
        rating: string;
        avatar: string;
    };
    studentsCount?: number | string;
    studentsLabel?: string;
}

export interface ScheduleDetailGroup {
    id: string;
    date: {
        dayName: string;
        dayNum: number;
        month: string;
    };
    badgeTheme: 'cream' | 'gray';
    items: ScheduleDetailItem[];
}

export interface ScheduleDetailedSectionProps {
    tag?: React.ReactNode;
    title?: React.ReactNode;
    seeMore?: boolean;
    seeMoreHref?: string;
    scheduleGroups?: ScheduleDetailGroup[];
    columnEnd?: 'trainer-info' | 'students-participated';
    'column-end'?: 'trainer-info' | 'students-participated';
}

export default function ScheduleDetailedSection({
    tag = 'SCHEDULE',
    title = 'Detailed class schedule',
    seeMore = false,
    seeMoreHref,
    scheduleGroups = [],
    columnEnd = 'trainer-info',
    'column-end': columnEndKebab,
}: ScheduleDetailedSectionProps = {}) {
    const activeColumnEnd = columnEndKebab || columnEnd;
    const pathname = usePathname();
    const defaultScheduleUrl = pathname?.startsWith('/teacher') ? '/teacher/schedule' : '/student/schedule';
    const targetUrl = seeMoreHref || defaultScheduleUrl;

    return (
        <section className={styles['detailed-section']} aria-label="Detailed Class Schedule">
            <div className={styles['detailed-wrapper']}>
                <div className={styles['detailed-container']}>
                    {/* Section Headings Component */}
                    <div className={styles['detailed-header']}>
                        <DashboardHeadings
                            tag={tag}
                            title={title}
                            className={styles['detailed-heading']}
                        />

                        {seeMore && (
                            <Link href={targetUrl} className={styles['detailed-see-more']}>
                                <span>See more</span>
                                <ChevronRightIcon />
                            </Link>
                        )}
                    </div>

                    {/* Schedule Groups List */}
                    <div className={styles['detailed-list']}>
                        {scheduleGroups.map((group) => (
                            <div key={group.id} className={styles['detailed-group']}>
                                {/* Left Date Badge */}
                                <div
                                    className={`${styles['detailed-date-badge']} ${group.badgeTheme === 'cream'
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
                                                    className={`${styles['detailed-item__title']} ${item.titleVariant === 'gold'
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

                                            {/* Column 3: Trainer Info or Students Participated */}
                                            {activeColumnEnd === 'students-participated' ? (
                                                <div className={styles['detailed-item__students']}>
                                                    <div className={styles['detailed-item__students-icon-box']}>
                                                        <StudentsGroupIcon />
                                                    </div>
                                                    <div className={styles['detailed-item__students-info']}>
                                                        <span className={styles['detailed-item__students-label']}>
                                                            {item.studentsLabel || 'Students participated'}
                                                        </span>
                                                        <span className={styles['detailed-item__students-count']}>
                                                            {item.studentsCount ?? 0}
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                item.trainer && (
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
                                                )
                                            )}
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
