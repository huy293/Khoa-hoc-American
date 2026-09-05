'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/styles/layout/Header.module.css';

/* ── SVG Icons ── */
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
            d="M18.75 18.75L14.41 14.41M16.75 8.75C16.75 13.1683 13.1683 16.75 8.75 16.75C4.33172 16.75 0.75 13.1683 0.75 8.75C0.75 4.33172 4.33172 0.75 8.75 0.75C13.1683 0.75 16.75 4.33172 16.75 8.75Z"
            stroke="#8A7043"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path
            d="M0.75 0.75H2.75L3.82085 5.75M3.82085 5.75L5.41 13.17C5.50758 13.6249 5.76067 14.0315 6.12571 14.3199C6.49075 14.6082 6.94491 14.7603 7.41 14.75H17.19C17.6452 14.7493 18.0865 14.5933 18.441 14.3078C18.7956 14.0224 19.0421 13.6245 19.14 13.18L20.79 5.75H3.82085ZM7.7 19.7C7.7 20.2523 7.25228 20.7 6.7 20.7C6.14772 20.7 5.7 20.2523 5.7 19.7C5.7 19.1477 6.14772 18.7 6.7 18.7C7.25228 18.7 7.7 19.1477 7.7 19.7ZM18.7 19.7C18.7 20.2523 18.2523 20.7 17.7 20.7C17.1477 20.7 16.7 20.2523 16.7 19.7C16.7 19.1477 17.1477 18.7 17.7 18.7C18.2523 18.7 18.7 19.1477 18.7 19.7Z"
            stroke="#8A7043"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 18 20" fill="none">
        <path
            d="M8.75 10.75C11.5114 10.75 13.75 8.51142 13.75 5.75C13.75 2.98858 11.5114 0.75 8.75 0.75C5.98858 0.75 3.75 2.98858 3.75 5.75C3.75 8.51142 5.98858 10.75 8.75 10.75ZM8.75 10.75C10.8717 10.75 12.9066 11.5929 14.4069 13.0931C15.9071 14.5934 16.75 16.6283 16.75 18.75M8.75 10.75C6.62827 10.75 4.59344 11.5929 3.09315 13.0931C1.59285 14.5934 0.75 16.6283 0.75 18.75"
            stroke="#8A7043"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const MenuIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 6H20M4 12H20M4 18H20" stroke="#8A7043" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CloseIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18M6 6L18 18" stroke="#8A7043" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

interface NavItem {
    label: string;
    href: string;
}

const NAV_ITEMS: NavItem[] = [
    { label: 'HOME', href: '/' },
    { label: 'COURSES', href: '/courses' },
    { label: 'SHOP', href: '/shop' },
    { label: 'ABOUT', href: '/about-us' },
    { label: 'RESOURCES', href: '/resources' },
    { label: 'CONTACT', href: '/contact' },
];

export const Header = () => {
    const pathname = usePathname();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [userHref, setUserHref] = useState('/login');

    useEffect(() => {
        try {
            const match = document.cookie.match(/hn_user_session=([^;]+)/);
            if (match) {
                const user = JSON.parse(decodeURIComponent(match[1]));
                const isTeacher =
                    user.role === 'teacher' ||
                    user.role === 'instructor' ||
                    user.role === 'administrator';
                setUserHref(isTeacher ? '/teacher' : '/student');
            } else {
                setUserHref('/login');
            }
        } catch {
            setUserHref('/login');
        }
    }, [pathname]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent body scrolling when mobile drawer is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    return (
        <header
            className={`${styles['header']} ${isScrolled ? styles['header--scrolled'] : ''}`}
            role="banner"
        >
            <div className={styles['header__container']}>
                {/* 1. Left: Logo */}
                <Link href="/" className={styles['header__logo-link']} aria-label="Couture Beauty Academy Home">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/images/logo-couture.png"
                        alt="Couture Beauty Academy"
                        className={styles['header__logo']}
                    />
                </Link>

                {/* 2. Center: Desktop Navigation Links */}
                <nav className={styles['header__nav']} aria-label="Main Navigation">
                    <ul className={styles['header__nav-list']}>
                        {NAV_ITEMS.map((item) => {
                            const isActive =
                                item.href === '/'
                                    ? pathname === '/'
                                    : item.href === '/courses'
                                        ? pathname === '/courses' || pathname?.startsWith('/course')
                                        : pathname === item.href || pathname?.startsWith(`${item.href}/`);
                            return (
                                <li key={item.label} className={styles['header__nav-item']}>
                                    <Link
                                        href={item.href}
                                        className={`${styles['header__nav-link']} ${isActive ? styles['header__nav-link--active'] : ''
                                            }`}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* 3. Right: Action Buttons (Search, Cart, User) + Mobile Toggle */}
                <div className={styles['header__actions']}>
                    <button
                        type="button"
                        className={styles['header__action-btn']}
                        aria-label="Search"
                        onClick={() => console.log('Search clicked')}
                    >
                        <SearchIcon />
                    </button>

                    <button
                        type="button"
                        className={styles['header__action-btn']}
                        aria-label="Shopping Cart"
                        onClick={() => console.log('Cart clicked')}
                    >
                        <CartIcon />
                    </button>

                    <Link
                        href={userHref}
                        className={styles['header__action-btn']}
                        aria-label="User Account"
                    >
                        <UserIcon />
                    </Link>

                    {/* Mobile Hamburger Button */}
                    <button
                        type="button"
                        className={`${styles['header__action-btn']} ${styles['header__mobile-toggle']}`}
                        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={isMobileMenuOpen}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer Menu */}
            <div
                className={`${styles['header__mobile-drawer']} ${isMobileMenuOpen ? styles['header__mobile-drawer--open'] : ''
                    }`}
                aria-hidden={!isMobileMenuOpen}
            >
                <div className={styles['header__mobile-content']}>
                    <div className={styles['header__mobile-top']}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/images/logo-couture.png"
                            alt="Couture Beauty Academy"
                            className={styles['header__mobile-logo']}
                        />
                        <button
                            type="button"
                            className={styles['header__action-btn']}
                            aria-label="Close menu"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <CloseIcon />
                        </button>
                    </div>

                    <ul className={styles['header__mobile-nav-list']}>
                        {NAV_ITEMS.map((item) => {
                            const isActive =
                                item.href === '/'
                                    ? pathname === '/'
                                    : item.href === '/courses'
                                        ? pathname === '/courses' || pathname?.startsWith('/course')
                                        : pathname === item.href || pathname?.startsWith(`${item.href}/`);
                            return (
                                <li key={item.label} className={styles['header__mobile-nav-item']}>
                                    <Link
                                        href={item.href}
                                        className={`${styles['header__mobile-nav-link']} ${isActive ? styles['header__mobile-nav-link--active'] : ''
                                            }`}
                                        onClick={() => {
                                            setIsMobileMenuOpen(false);
                                        }}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>

            {/* Mobile Backdrop */}
            {isMobileMenuOpen && (
                <div
                    className={styles['header__backdrop']}
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-hidden="true"
                />
            )}
        </header>
    );
};

export default Header;
