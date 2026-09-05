'use client';

import React, { useState } from 'react';
import styles from '@/styles/dashboard/schedule/MyScheduleSection.module.css';

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

const CheckIcon = ({ className }: { className?: string }) => (
    <svg
        className={className}
        width="11"
        height="11"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <path
            d="M2.5 6.2L4.8 8.5L9.5 3.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const ChevronDownIcon = ({ className }: { className?: string }) => (
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
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

/* ── Timetable Types & Static Data ── */
type EventCategory = 'onsite' | 'online' | 'class-schedule';

interface ScheduleEventItem {
    id: string;
    dayNumber: number; // 14, 15, 16, 17, 18, 19, 20
    category: EventCategory;
    title: string;
    subtitle?: string;
    timeLabel: string;
    startMinuteFrom9AM: number; // 0 for 09:00, 240 for 13:00
    durationMinutes: number; // 80 for 09:00-10:20 (1h20m), 200 for 13:00-16:20 (3h20m)
}

const TIME_SLOTS = Array.from({ length: 13 }, (_, i) => `${String(i + 8).padStart(2, '0')}:00`);
const PIXELS_PER_HOUR = 60;
const PIXELS_PER_MINUTE = PIXELS_PER_HOUR / 60;

export interface MyScheduleSectionProps {
    events?: ScheduleEventItem[];
}

export default function MyScheduleSection({ events }: MyScheduleSectionProps = {}) {
    // Filter toggles
    const [filterOnsite, setFilterOnsite] = useState(true);
    const [filterOnline, setFilterOnline] = useState(true);
    const [filterClassSchedule, setFilterClassSchedule] = useState(true);

    const today = React.useMemo(() => new Date(), []);
    const [selectedCalendarDay, setSelectedCalendarDay] = useState<number>(today.getDate());

    const weekDays = React.useMemo(() => {
        const currentDayOfWeek = today.getDay();
        const sunday = new Date(today);
        sunday.setDate(today.getDate() - currentDayOfWeek);

        const days = [];
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        for (let i = 0; i < 7; i++) {
            const d = new Date(sunday);
            d.setDate(sunday.getDate() + i);
            days.push({
                dayNum: d.getDate(),
                dayName: dayNames[i],
                isActive: d.toDateString() === today.toDateString(),
            });
        }
        return days;
    }, [today]);

    const miniCalendarDays = React.useMemo(() => {
        const year = today.getFullYear();
        const month = today.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days: (number | null)[] = [];
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }
        return days;
    }, [today]);

    const activeEvents = events || [];

    // Filter events based on checkboxes
    const filteredEvents = activeEvents.filter((evt) => {
        if (evt.category === 'onsite' && !filterOnsite) return false;
        if (evt.category === 'online' && !filterOnline) return false;
        if (evt.category === 'class-schedule' && !filterClassSchedule) return false;
        return true;
    });

    const getCategoryClassName = (category: EventCategory) => {
        switch (category) {
            case 'onsite':
                return styles['schedule-event--blue'];
            case 'online':
                return styles['schedule-event--green'];
            case 'class-schedule':
                return styles['schedule-event--orange'];
            default:
                return '';
        }
    };

    return (
        <section className={styles['schedule-section']} aria-label="My Schedule Section">
            <div className={styles['schedule-wrapper']}>
                <div className={styles['schedule-container']}>
                    {/* ══════════════════════════════════════════
                   1. Left Column: Timetable Main Section
                   ══════════════════════════════════════════ */}
                    <div className={styles['schedule-main']}>
                        {/* Header: Date Range, Title & Month Dropdown */}
                        <div className={styles['schedule-header']}>
                            <div className={styles['schedule-header__left']}>
                                <p className={styles['schedule-header__subtitle']}>February, 14-20</p>
                                <h1 className={styles['schedule-header__title']}>My schedule</h1>
                            </div>

                            <button
                                type="button"
                                className={styles['schedule-header__dropdown-btn']}
                                aria-label="Select Month"
                            >
                                <span>February</span>
                                <ChevronDownIcon className={styles['schedule-header__dropdown-arrow']} />
                            </button>
                        </div>

                        {/* Timetable Weekly Matrix */}
                        <div className={styles['schedule-timetable']}>
                            <div className={styles['schedule-grid']}>
                                {/* Days Header Row */}
                                <div className={styles['schedule-grid__header']}>
                                    <div
                                        className={`${styles['schedule-grid__header-cell']} ${styles['schedule-grid__header-cell--time']}`}
                                    >
                                        <span className={styles['schedule-grid__week-label']}>Week</span>
                                    </div>

                                    {weekDays.map((day) => (
                                        <div
                                            key={day.dayNum}
                                            className={`${styles['schedule-grid__header-cell']} ${day.isActive ? styles['schedule-grid__header-cell--active'] : ''
                                                }`}
                                        >
                                            <span className={styles['schedule-grid__day-num']}>{day.dayNum}</span>
                                            <span className={styles['schedule-grid__day-name']}>{day.dayName}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Timetable Body (Scrollable Container) */}
                                <div className={styles['schedule-grid__body-scroll']}>
                                    <div className={styles['schedule-grid__body']}>
                                        {/* Left Time Axis (08:00 - 20:00) */}
                                        <div className={styles['schedule-grid__time-column']}>
                                            {TIME_SLOTS.map((time, index) => (
                                                <div
                                                    key={time}
                                                    className={styles['schedule-grid__time-label']}
                                                    style={{ top: `${index * PIXELS_PER_HOUR}px` }}
                                                >
                                                    <span>{time}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Background Horizontal Lines & Golden Time Line */}
                                        <div className={styles['schedule-grid__row-lines']}>
                                            {TIME_SLOTS.map((time, index) => (
                                                <div
                                                    key={time}
                                                    className={styles['schedule-grid__row-line']}
                                                    style={{ top: `${index * PIXELS_PER_HOUR}px` }}
                                                />
                                            ))}
                                            <div className={styles['schedule-grid__current-time-line']} />
                                        </div>

                                        {/* 7 Day Columns with Event Cards */}
                                        {weekDays.map((day) => {
                                            const dayEvents = filteredEvents.filter(
                                                (evt) => evt.dayNumber === day.dayNum
                                            );

                                            return (
                                                <div key={day.dayNum} className={styles['schedule-grid__day-column']}>
                                                    {dayEvents.map((evt) => {
                                                        const topPx = evt.startMinuteFrom9AM * PIXELS_PER_MINUTE;
                                                        const heightPx = Math.max(
                                                            evt.durationMinutes * PIXELS_PER_MINUTE,
                                                            60
                                                        );

                                                        return (
                                                            <div
                                                                key={evt.id}
                                                                className={`${styles['schedule-event']} ${getCategoryClassName(
                                                                    evt.category
                                                                )}`}
                                                                style={{
                                                                    top: `${topPx}px`,
                                                                    height: `${heightPx}px`,
                                                                }}
                                                                role="article"
                                                                aria-label={`${evt.title} at ${evt.timeLabel}`}
                                                            >
                                                                <div className={styles['schedule-event__content']}>
                                                                    <h4 className={styles['schedule-event__title']}>
                                                                        {evt.title}
                                                                    </h4>
                                                                    {evt.subtitle && (
                                                                        <p className={styles['schedule-event__subtitle']}>
                                                                            {evt.subtitle}
                                                                        </p>
                                                                    )}
                                                                </div>

                                                                <div className={styles['schedule-event__time']}>
                                                                    <ClockIcon
                                                                        className={styles['schedule-event__clock-icon']}
                                                                    />
                                                                    <span>{evt.timeLabel}</span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ══════════════════════════════════════════
                   2. Right Column: Aside Panel (#FFFCF6)
                   ══════════════════════════════════════════ */}
                    <aside className={styles['schedule-aside']} aria-label="Schedule Sidebar Details">
                        {/* Card 1: Mini Calendar */}
                        <div className={styles['mini-calendar']}>
                            <div className={styles['mini-calendar__header']}>
                                <button
                                    type="button"
                                    className={styles['mini-calendar__nav-btn']}
                                    aria-label="Previous Month"
                                >
                                    &#8249;
                                </button>
                                <h3 className={styles['mini-calendar__month-title']}>
                                    {today.toLocaleDateString('en-US', { month: 'long' })}
                                </h3>
                                <button
                                    type="button"
                                    className={styles['mini-calendar__nav-btn']}
                                    aria-label="Next Month"
                                >
                                    &#8250;
                                </button>
                            </div>

                            {/* Calendar Table Container */}
                            <div className={styles['mini-calendar__body']}>
                                {/* Weekdays */}
                                <div className={styles['mini-calendar__weekdays']}>
                                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((wd, i) => (
                                        <span key={i} className={styles['mini-calendar__weekday']}>
                                            {wd}
                                        </span>
                                    ))}
                                </div>

                                {/* Days Grid */}
                                <div className={styles['mini-calendar__days-grid']}>
                                    {miniCalendarDays.map((d, index) => {
                                        if (d === null) {
                                            return <div key={`empty-${index}`} className={styles['mini-calendar__day-cell']} />;
                                        }

                                        const isSelected = selectedCalendarDay === d;

                                        return (
                                            <div key={d} className={styles['mini-calendar__day-cell']}>
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedCalendarDay(d)}
                                                    className={`${styles['mini-calendar__day-btn']} ${isSelected ? styles['mini-calendar__day-btn--active'] : ''
                                                        }`}
                                                    aria-label={`Select day ${d}`}
                                                >
                                                    {d}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Card 2: Calendar Details (Legend / Filter Toggles) */}
                        <div className={styles['calendar-details']}>
                            <h3 className={styles['calendar-details__title']}>Calendar Details</h3>

                            <ul className={styles['calendar-details__list']}>
                                {/* Blue Filter: On-site */}
                                <li
                                    className={styles['calendar-details__item']}
                                    onClick={() => setFilterOnsite((prev) => !prev)}
                                    role="checkbox"
                                    aria-checked={filterOnsite}
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === ' ' || e.key === 'Enter') {
                                            e.preventDefault();
                                            setFilterOnsite((prev) => !prev);
                                        }
                                    }}
                                >
                                    <div
                                        className={`${styles['calendar-details__checkbox']} ${styles['calendar-details__checkbox--blue']
                                            } ${!filterOnsite ? styles['calendar-details__checkbox--unchecked'] : ''}`}
                                    >
                                        {filterOnsite && (
                                            <CheckIcon className={styles['calendar-details__check-icon']} />
                                        )}
                                    </div>
                                    <span className={styles['calendar-details__label']}>
                                        Class start schedule (On-site)
                                    </span>
                                </li>

                                {/* Green Filter: Online */}
                                <li
                                    className={styles['calendar-details__item']}
                                    onClick={() => setFilterOnline((prev) => !prev)}
                                    role="checkbox"
                                    aria-checked={filterOnline}
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === ' ' || e.key === 'Enter') {
                                            e.preventDefault();
                                            setFilterOnline((prev) => !prev);
                                        }
                                    }}
                                >
                                    <div
                                        className={`${styles['calendar-details__checkbox']} ${styles['calendar-details__checkbox--green']
                                            } ${!filterOnline ? styles['calendar-details__checkbox--unchecked'] : ''}`}
                                    >
                                        {filterOnline && (
                                            <CheckIcon className={styles['calendar-details__check-icon']} />
                                        )}
                                    </div>
                                    <span className={styles['calendar-details__label']}>
                                        Class start schedule (Online)
                                    </span>
                                </li>

                                {/* Orange Filter: Class Schedule */}
                                <li
                                    className={styles['calendar-details__item']}
                                    onClick={() => setFilterClassSchedule((prev) => !prev)}
                                    role="checkbox"
                                    aria-checked={filterClassSchedule}
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === ' ' || e.key === 'Enter') {
                                            e.preventDefault();
                                            setFilterClassSchedule((prev) => !prev);
                                        }
                                    }}
                                >
                                    <div
                                        className={`${styles['calendar-details__checkbox']} ${styles['calendar-details__checkbox--orange']
                                            } ${!filterClassSchedule ? styles['calendar-details__checkbox--unchecked'] : ''}`}
                                    >
                                        {filterClassSchedule && (
                                            <CheckIcon className={styles['calendar-details__check-icon']} />
                                        )}
                                    </div>
                                    <span className={styles['calendar-details__label']}>Class Schedule</span>
                                </li>
                            </ul>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    );
}
