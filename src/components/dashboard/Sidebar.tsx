'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from '@/styles/dashboard/Sidebar.module.css';

/* ── SVG Icons ── */
export const DashboardIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 10.5L12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 20v-9.5z" />
        <path d="M9 21V12h6v9" />
    </svg>
);

export const CoursesIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 3v6l3-2 3 2V3" />
        <path d="M8 15h8" />
    </svg>
);

export const ShopIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="20" r="1.5" />
        <circle cx="18" cy="20" r="1.5" />
        <path d="M2.5 3h2.5l2.4 11.2a2 2 0 0 0 2 1.6h9.2a2 2 0 0 0 1.95-1.55l1.65-7.25H5.8" />
    </svg>
);

export const ScheduleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="17" rx="2.5" />
        <line x1="16" y1="2" x2="16" y2="5" />
        <line x1="8" y1="2" x2="8" y2="5" />
        <line x1="3" y1="9.5" x2="21" y2="9.5" />
        <text x="12" y="17.5" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="currentColor" stroke="none" fontFamily="inherit">12</text>
    </svg>
);

export const ResultIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
        <text x="12" y="15.5" textAnchor="middle" fontSize="9" fontWeight="700" fill="currentColor" stroke="none" fontFamily="inherit">A+</text>
    </svg>
);

export const CertificateIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="13" height="16" rx="2" />
        <circle cx="16.5" cy="15.5" r="3.5" />
        <path d="M16.5 19l1.5 2.5-1.5-1-1.5 1 1.5-2.5" />
        <line x1="6.5" y1="8" x2="12.5" y2="8" />
        <line x1="6.5" y1="12" x2="10.5" y2="12" />
    </svg>
);

export const ResourcesIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
        <rect x="2.5" y="3" width="19" height="5" rx="1.5" />
        <path d="M10 12h4" />
    </svg>
);

export const PaymentHistoryIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="14" rx="2.5" />
        <line x1="3" y1="9.5" x2="21" y2="9.5" />
        <rect x="15" y="13.5" width="3" height="2" rx="0.5" fill="currentColor" stroke="none" />
    </svg>
);

export const ManagementIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="12" cy="10" r="3" />
        <path d="M7 18c0-2 2-3.5 5-3.5s5 1.5 5 3.5" />
    </svg>
);

export const ClassroomIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="13" rx="2" />
        <path d="M8 21h8" />
        <path d="M12 16v5" />
    </svg>
);

export const StudentsIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
);

export const SupportIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
);

export const MainSiteIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
);

export const SettingsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
);

const ExternalIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 9.75a.75.75 0 1 1-1.5 0V5.561l-6.218 6.22a.75.75 0 1 1-1.062-1.062L18.44 4.5h-4.19a.75.75 0 1 1 0-1.5h6a.75.75 0 0 1 .75.75zM17.25 12a.75.75 0 0 0-.75.75v6.75h-12v-12h6.75a.75.75 0 1 0 0-1.5H4.5A1.5 1.5 0 0 0 3 7.5v12A1.5 1.5 0 0 0 4.5 21h12a1.5 1.5 0 0 0 1.5-1.5v-6.75a.75.75 0 0 0-.75-.75" fill="#8c8983" />
    </svg>
);

const ChevronRightIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
    </svg>
);

const ToggleIcon = ({ isCollapsed }: { isCollapsed: boolean }) => {
    if (isCollapsed) {
        return (
            <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ transform: 'scaleX(-1)' }}
            >
                <path
                    d="M24.194 24.465h-2.46V8.889h2.46zM15.6 9.105c.309-.267.765-.027.765.405v14.337c0 .428-.453.668-.765.404l-8.31-7.169a.547.547 0 0 1 0-.808z"
                    fill="#000"
                    fillOpacity=".5"
                />
            </svg>
        );
    }
    return (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M24.194 24.465h-2.46V8.889h2.46zM15.6 9.105c.309-.267.765-.027.765.405v14.337c0 .428-.453.668-.765.404l-8.31-7.169a.547.547 0 0 1 0-.808z"
                fill="#000"
                fillOpacity=".5"
            />
        </svg>
    );
};

/* ── Types & Navigation Config ── */
export interface NavItem {
    label: string;
    href: string;
    icon: React.ComponentType<any>;
    children?: NavItem[];
}

export interface NavSection {
    id: string;
    items: NavItem[];
}

/* ── Default Teacher Navigation (Khớp 100% hình thiết kế của Teacher) ── */
export const DEFAULT_TEACHER_NAV_SECTIONS: NavSection[] = [
    {
        id: 'main',
        items: [
            { label: 'Dashboard', href: '/teacher', icon: DashboardIcon },
            {
                label: 'Management',
                href: '/teacher/management/classroom',
                icon: ManagementIcon,
                children: [
                    { label: 'Classroom', href: '/teacher/management/classroom', icon: ClassroomIcon },
                    { label: 'Students', href: '/teacher/management/students', icon: StudentsIcon },
                ],
            },
        ],
    },
    {
        id: 'academic',
        items: [
            { label: 'My Schedule', href: '/teacher/schedule', icon: ScheduleIcon },
        ],
    },
    {
        id: 'resources',
        items: [
            { label: 'Resources', href: '/teacher/resources', icon: ResourcesIcon },
            { label: 'Payment History', href: '/teacher/payment-history', icon: PaymentHistoryIcon },
        ],
    },
];

/* ── Default Student Navigation ── */
export const DEFAULT_STUDENT_NAV_SECTIONS: NavSection[] = [
    {
        id: 'main',
        items: [
            { label: 'Dashboard', href: '/student', icon: DashboardIcon },
            { label: 'Courses', href: '/student/courses', icon: CoursesIcon },
        ],
    },
    {
        id: 'shop',
        items: [
            { label: 'Shop', href: '/student/shop', icon: ShopIcon },
        ],
    },
    {
        id: 'academic',
        items: [
            { label: 'My Schedule', href: '/student/schedule', icon: ScheduleIcon },
            { label: 'Result', href: '/student/results', icon: ResultIcon },
            { label: 'My Certificate', href: '/student/certificate', icon: CertificateIcon },
        ],
    },
    {
        id: 'resources',
        items: [
            { label: 'Resources', href: '/student/resources', icon: ResourcesIcon },
            { label: 'Payment History', href: '/student/payment-history', icon: PaymentHistoryIcon },
        ],
    },
];

/* ── Default Bottom Navigation Items ── */
export const DEFAULT_BOTTOM_NAV_ITEMS: NavItem[] = [
    { label: 'Support', href: '/support', icon: SupportIcon },
    { label: 'Back to Main Site', href: '/', icon: MainSiteIcon },
    { label: 'Settings', href: '/settings', icon: SettingsIcon },
];

export interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
    isMobileOpen?: boolean;
    setIsMobileOpen?: (open: boolean | ((prev: boolean) => boolean)) => void;
    navSections?: NavSection[];
    bottomNavItems?: NavItem[];
}

export default function Sidebar({
    isCollapsed,
    setIsCollapsed,
    isMobileOpen = false,
    setIsMobileOpen,
    navSections: propNavSections,
    bottomNavItems: propBottomNavItems,
}: SidebarProps) {
    const pathname = usePathname();
    const [isMobile, setIsMobile] = useState(false);

    const isTeacher = pathname?.startsWith('/teacher');
    const basePath = isTeacher ? '/teacher' : '/student';

    // Resolved Nav Sections
    const navSections =
        propNavSections ||
        (isTeacher ? DEFAULT_TEACHER_NAV_SECTIONS : DEFAULT_STUDENT_NAV_SECTIONS);

    // Resolved Bottom Items
    const bottomNavItems =
        propBottomNavItems || [
            { label: 'Support', href: `${basePath}/support`, icon: SupportIcon },
            { label: 'Back to Main Site', href: '/', icon: MainSiteIcon },
            { label: 'Settings', href: `${basePath}/settings`, icon: SettingsIcon },
        ];

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 996);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isItemActive = (href: string) => {
        if (!pathname) return false;
        if (href === '/teacher' || href === '/student' || href === '/dashboard') {
            return pathname === href || pathname === `${href}/`;
        }
        return pathname === href || pathname.startsWith(`${href}/`);
    };

    const handleToggleClick = () => {
        if (typeof window !== 'undefined' && window.innerWidth <= 996) {
            if (setIsMobileOpen) {
                setIsMobileOpen(false);
            }
        } else {
            setIsCollapsed((prev) => !prev);
        }
    };

    const handleNavClick = () => {
        if (isMobile && setIsMobileOpen) {
            setIsMobileOpen(false);
        }
    };

    // Only apply collapsed mode on desktop (> 996px)
    const showCollapsed = isCollapsed && !isMobile;

    return (
        <aside
            className={`${styles['sidebar']} ${showCollapsed ? styles['sidebar--collapsed'] : ''} ${
                isMobileOpen ? styles['sidebar--mobile-open'] : ''
            }`}
            aria-label="Dashboard Sidebar Navigation"
        >
            <div className={styles['sidebar__container']}>
                {/* 1. Header / Logo */}
                <div className={styles['sidebar__header']}>
                    <Link
                        href="/"
                        className={styles['sidebar__logo-link']}
                        aria-label="Couture Beauty Academy"
                        onClick={handleNavClick}
                    >
                        {showCollapsed ? (
                            <div className={styles['sidebar__logo-icon-wrap']}>
                                <Image
                                    src="/images/logo-couture.png"
                                    alt="CBA Logo"
                                    width={36}
                                    height={36}
                                    className={styles['sidebar__logo-mini']}
                                    priority
                                />
                            </div>
                        ) : (
                            <Image
                                src="/images/logo-couture.png"
                                alt="Couture Beauty Academy Logo"
                                width={180}
                                height={42}
                                className={styles['sidebar__logo-img']}
                                priority
                            />
                        )}
                    </Link>
                </div>

                {/* 2. Main Navigation with Dividers */}
                <nav className={styles['sidebar__nav']}>
                    {navSections.map((section, sectionIdx) => (
                        <React.Fragment key={section.id}>
                            <ul className={styles['sidebar__group']}>
                                {section.items.map((item) => {
                                    const Icon = item.icon;
                                    const hasChildren = Boolean(item.children && item.children.length > 0);
                                    const active = isItemActive(item.href);

                                    return (
                                        <li key={item.href} className={styles['sidebar__nav-item']}>
                                            <Link
                                                href={item.href}
                                                className={`${styles['sidebar__nav-link']} ${
                                                    active && !hasChildren ? styles['sidebar__nav-link--active'] : ''
                                                }`}
                                                title={showCollapsed ? item.label : undefined}
                                                onClick={handleNavClick}
                                            >
                                                <span className={styles['sidebar__nav-icon']}>
                                                    <Icon />
                                                </span>
                                                {!showCollapsed && (
                                                    <span className={styles['sidebar__nav-text']}>
                                                        {item.label}
                                                    </span>
                                                )}
                                            </Link>

                                            {/* Submenu for children (e.g. Classroom, Students) */}
                                            {hasChildren && (
                                                <ul className={styles['sidebar__sub-group']}>
                                                    {item.children!.map((child) => {
                                                        const ChildIcon = child.icon;
                                                        const childActive = isItemActive(child.href);

                                                        return (
                                                            <li key={child.href} className={styles['sidebar__sub-nav-item']}>
                                                                <Link
                                                                    href={child.href}
                                                                    className={`${styles['sidebar__nav-link']} ${styles['sidebar__nav-link--sub']} ${
                                                                        childActive ? styles['sidebar__nav-link--active'] : ''
                                                                    }`}
                                                                    title={showCollapsed ? child.label : undefined}
                                                                    onClick={handleNavClick}
                                                                >
                                                                    {!showCollapsed && (
                                                                        <span className={styles['sidebar__sub-chevron']}>
                                                                            <ChevronRightIcon />
                                                                        </span>
                                                                    )}
                                                                    <span className={styles['sidebar__nav-icon']}>
                                                                        <ChildIcon />
                                                                    </span>
                                                                    {!showCollapsed && (
                                                                        <span className={styles['sidebar__nav-text']}>
                                                                            {child.label}
                                                                        </span>
                                                                    )}
                                                                </Link>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                            {sectionIdx < navSections.length - 1 && (
                                <hr className={styles['sidebar__divider']} />
                            )}
                        </React.Fragment>
                    ))}
                </nav>

                {/* 3. Footer Area: Profile Card, Support/Settings, Toggle Button */}
                <div className={styles['sidebar__footer']}>
                    {/* User Profile Card */}
                    <Link
                        href={`${basePath}/profile`}
                        className={styles['sidebar__profile']}
                        title={showCollapsed ? 'Lalisa Moban (lalisa382931@gmail.com)' : undefined}
                        onClick={handleNavClick}
                    >
                        <div className={styles['sidebar__avatar-wrap']}>
                            <Image
                                src="/images/kathleen.png"
                                alt="Lalisa Moban"
                                width={36}
                                height={36}
                                className={styles['sidebar__avatar-img']}
                            />
                        </div>
                        {!showCollapsed && (
                            <>
                                <div className={styles['sidebar__profile-details']}>
                                    <span className={styles['sidebar__profile-name']}>Lalisa Moban</span>
                                    <span className={styles['sidebar__profile-email']}>lalisa382931@gmail.com</span>
                                </div>
                                <span className={styles['sidebar__profile-action']}>
                                    <ExternalIcon />
                                </span>
                            </>
                        )}
                    </Link>

                    <hr className={styles['sidebar__divider']} />

                    {/* Support & Settings */}
                    <ul className={styles['sidebar__group']}>
                        {bottomNavItems.map((item) => {
                            const Icon = item.icon;
                            const active = isItemActive(item.href);

                            return (
                                <li key={item.href} className={styles['sidebar__nav-item']}>
                                    <Link
                                        href={item.href}
                                        className={`${styles['sidebar__nav-link']} ${
                                            active ? styles['sidebar__nav-link--active'] : ''
                                        }`}
                                        title={showCollapsed ? item.label : undefined}
                                        onClick={handleNavClick}
                                    >
                                        <span className={styles['sidebar__nav-icon']}>
                                            <Icon />
                                        </span>
                                        {!showCollapsed && (
                                            <span className={styles['sidebar__nav-text']}>
                                                {item.label}
                                            </span>
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    <hr className={styles['sidebar__divider']} />

                    {/* Toggle Collapse Button */}
                    <div className={styles['sidebar__toggle-wrap']}>
                        <button
                            type="button"
                            className={styles['sidebar__toggle-btn']}
                            onClick={handleToggleClick}
                            aria-label={showCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
                            title={isMobile ? 'Đóng menu' : (showCollapsed ? 'Mở rộng' : 'Thu gọn')}
                        >
                            <ToggleIcon isCollapsed={showCollapsed} />
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}