'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/styles/dashboard/Header.module.css';

/* ── Page Info Dictionary for Dashboard Sub-pages ── */
const DASHBOARD_PAGE_INFO: Record<string, { title: string; description: string }> = {
    '/dashboard/shop': {
        title: 'Shop',
        description: 'Tools & Products for Your Professional Training',
    },
    '/dashboard/courses': {
        title: 'Courses',
        description: 'Tools & Products for Your Professional Training',
    },
    '/dashboard/schedule': {
        title: 'My Schedule',
        description: 'View your upcoming classes, exams, and training sessions',
    },
    '/dashboard/results': {
        title: 'Result',
        description: 'Track your learning assessment scores and grades',
    },
    '/dashboard/certificates': {
        title: 'My Certificate',
        description: 'View and download your official diplomas & certifications',
    },
    '/dashboard/resources': {
        title: 'Resources',
        description: 'Browse exclusive articles, guides, and learning materials',
    },
    '/dashboard/payment-history': {
        title: 'Payment History',
        description: 'Review your invoices, transactions, and order history',
    },
    '/dashboard/profile': {
        title: 'My Profile',
        description: 'Manage your personal information and student account',
    },
    '/dashboard/support': {
        title: 'Support',
        description: 'Get assistance and guidance from our support team',
    },
    '/dashboard/settings': {
        title: 'Settings',
        description: 'Manage your account preferences and security settings',
    },
};

/* ── SVG Icons ── */
const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const BellIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);

const CartIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="20" r="1.5" />
        <circle cx="18" cy="20" r="1.5" />
        <path d="M2.5 3h2.5l2.4 11.2a2 2 0 0 0 2 1.6h9.2a2 2 0 0 0 1.95-1.55l1.65-7.25H5.8" />
    </svg>
);

const ChevronRightIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

const MenuIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
);

interface HeaderProps {
    onToggleSidebar?: () => void;
    title?: string;
    description?: string;
}

export default function Header({ onToggleSidebar, title, description }: HeaderProps = {}) {
    const pathname = usePathname();
    const isDashboardHome = pathname === '/dashboard' || pathname === '/dashboard/';

    // Resolve custom or default page info for sub-routes
    const matchedPageInfo = DASHBOARD_PAGE_INFO[pathname || ''] || {
        title: title || 'Dashboard',
        description: description || 'Tools & Products for Your Professional Training',
    };

    const displayTitle = title || matchedPageInfo.title;
    const displayDescription = description || matchedPageInfo.description;

    return (
        <header className={styles['header']} role="banner">
            {/* 1. Left: Greeting (on /dashboard) OR Title & Description (on subpages) */}
            {isDashboardHome ? (
                <div className={styles['header__greeting']}>
                    <div className={styles['header__avatar-wrap']}>
                        <Image
                            src="/images/kathleen.png"
                            alt="Lalisa Moban"
                            width={48}
                            height={48}
                            className={styles['header__avatar-img']}
                            priority
                        />
                    </div>
                    <div className={styles['header__greeting-info']}>
                        <h1 className={styles['header__greeting-title']}>Hi, Lalisa Moban!</h1>
                        <p className={styles['header__greeting-desc']}>
                            Take your steps to built a successful learning habit
                        </p>
                    </div>
                </div>
            ) : (
                <div className={styles['header__page-info']}>
                    <h1 className={styles['header__page-title']}>{displayTitle}</h1>
                    <p className={styles['header__page-desc']}>{displayDescription}</p>
                </div>
            )}

            {/* 2. Right: Action Buttons & Student Profile Badge */}
            <div className={styles['header__actions']}>
                <div className={styles['header__action-group']}>
                    {onToggleSidebar && (
                        <button
                            type="button"
                            className={`${styles['header__action-btn']} ${styles['header__menu-btn']}`}
                            onClick={onToggleSidebar}
                            aria-label="Toggle menu"
                            title="Toggle navigation"
                        >
                            <MenuIcon />
                        </button>
                    )}
                    <button
                        type="button"
                        className={styles['header__action-btn']}
                        aria-label="Search"
                        onClick={() => console.log('Dashboard Search clicked')}
                    >
                        <SearchIcon />
                    </button>
                    <button
                        type="button"
                        className={styles['header__action-btn']}
                        aria-label="Notifications"
                        onClick={() => console.log('Notifications clicked')}
                    >
                        <BellIcon />
                    </button>
                    <button
                        type="button"
                        className={styles['header__action-btn']}
                        aria-label="Shopping Cart"
                        onClick={() => console.log('Cart clicked')}
                    >
                        <CartIcon />
                    </button>
                </div>

                {/* Quick Account Pill */}
                <Link
                    href="/dashboard/profile"
                    className={styles['header__profile']}
                    aria-label="User Account Profile"
                >
                    <div className={styles['header__profile-avatar-wrap']}>
                        <Image
                            src="/images/kathleen.png"
                            alt="Lalisa Moban"
                            width={36}
                            height={36}
                            className={styles['header__profile-avatar-img']}
                        />
                    </div>
                    <div className={styles['header__profile-info']}>
                        <span className={styles['header__profile-name']}>Lalisa Moban</span>
                        <span className={styles['header__profile-badge']}>Student account</span>
                    </div>
                    <span className={styles['header__profile-chevron']}>
                        <ChevronRightIcon />
                    </span>
                </Link>
            </div>
        </header>
    );
}