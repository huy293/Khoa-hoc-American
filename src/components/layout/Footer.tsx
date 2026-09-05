'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from '@/styles/layout/Footer.module.css';

interface FooterLinkItem {
    label: string;
    href: string;
}

interface FooterSection {
    title: string;
    links: FooterLinkItem[];
}

const toLinks = (items: Array<[string, string]>): FooterLinkItem[] => items.map(([label, href]) => ({ label, href }));

function getInitialFooterSections(): FooterSection[] {
    const list: FooterSection[] = [];
    list.push({
        title: 'MENU',
        links: toLinks([
            ['About Us', '/about-us'],
            ['Courses', '/courses'],
            ['Contact', '/contact'],
        ]),
    });
    list.push({
        title: 'COURSES',
        links: toLinks([
            ['All Courses', '/courses'],
            ['Skin Treatments', '/courses'],
            ['Permanent Makeup', '/courses'],
            ['Laser Training', '/courses'],
        ]),
    });
    list.push({
        title: 'SHOP',
        links: toLinks([
            ['Professional Supplies', '/shop'],
            ['Skincare', '/shop'],
            ['PMU Supplies', '/shop'],
            ['Student Kits', '/shop'],
        ]),
    });
    list.push({
        title: 'RESOURCES',
        links: toLinks([
            ['Learning Resources', '/resources'],
            ['Articles & Blogs', '/resources'],
            ['Student Portal', '/student'],
        ]),
    });
    return list;
}

/* ── Send icon inline SVG (filled) ── */
const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none">
        <path
            d="M2 21L23 12L2 3V10L17 12L2 14V21Z"
            fill="#191713"
        />
    </svg>
);

/* ── Facebook SVG ── */
const FacebookIcon = () => (
    <svg width="24" height="24" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#fb-clip)">
            <path d="M18 0C8.05896 0 0 8.05896 0 18C0 26.4413 5.81184 33.5246 13.6519 35.4701V23.5008H9.94032V18H13.6519V15.6298C13.6519 9.50328 16.4246 6.6636 22.4395 6.6636C23.58 6.6636 25.5478 6.88752 26.3527 7.11072V12.0967C25.9279 12.0521 25.1899 12.0298 24.2734 12.0298C21.3221 12.0298 20.1816 13.1479 20.1816 16.0546V18H26.0611L25.051 23.5008H20.1816V35.8682C29.0945 34.7918 36.0007 27.203 36.0007 18C36 8.05896 27.941 0 18 0Z" fill="#FFF6E5"/>
        </g>
        <defs>
            <clipPath id="fb-clip">
                <rect width="36" height="36" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);

/* ── X (Twitter) SVG ── */
const XIcon = () => (
    <svg width="22" height="24" viewBox="0 0 34 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25.9621 2.85547H30.7412L20.3003 15.4907L32.5832 32.6844H22.9658L15.4331 22.2565L6.81393 32.6844H2.03195L13.1995 19.1696L1.4165 2.85547H11.2781L18.087 12.387L25.9621 2.85547ZM24.2848 29.6556H26.9329L9.83915 5.72517H6.99741L24.2848 29.6556Z" fill="#FFF6E5"/>
    </svg>
);

/* ── Instagram SVG ── */
const InstagramIcon = () => (
    <svg width="22" height="24" viewBox="0 0 34 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#ig-clip)">
            <path d="M17 3.24141C21.5422 3.24141 22.0801 3.2625 23.8664 3.34687C25.5266 3.42422 26.423 3.71953 27.0207 3.96563C27.8109 4.28906 28.382 4.68281 28.973 5.30859C29.5707 5.94141 29.9359 6.53906 30.2414 7.37578C30.4738 8.00859 30.7527 8.96484 30.8258 10.7156C30.9055 12.6141 30.9254 13.1836 30.9254 17.9859C30.9254 22.7953 30.9055 23.3648 30.8258 25.2563C30.7527 27.0141 30.4738 27.9633 30.2414 28.5961C29.9359 29.4328 29.5641 30.0375 28.973 30.6633C28.3754 31.2961 27.8109 31.6828 27.0207 32.0063C26.423 32.2523 25.5199 32.5477 23.8664 32.625C22.0734 32.7094 21.5355 32.7305 17 32.7305C12.4578 32.7305 11.9199 32.7094 10.1336 32.625C8.47344 32.5477 7.57695 32.2523 6.9793 32.0063C6.18906 31.6828 5.61797 31.2891 5.02695 30.6633C4.4293 30.0305 4.06406 29.4328 3.75859 28.5961C3.52617 27.9633 3.24727 27.007 3.17422 25.2563C3.09453 23.3578 3.07461 22.7883 3.07461 17.9859C3.07461 13.1766 3.09453 12.607 3.17422 10.7156C3.24727 8.95781 3.52617 8.00859 3.75859 7.37578C4.06406 6.53906 4.43594 5.93438 5.02695 5.30859C5.62461 4.67578 6.18906 4.28906 6.9793 3.96563C7.57695 3.71953 8.48008 3.42422 10.1336 3.34687C11.9199 3.2625 12.4578 3.24141 17 3.24141ZM17 0C12.3848 0 11.807 0.0210937 9.99414 0.105469C8.18789 0.189844 6.94609 0.499219 5.87031 0.942187C4.74805 1.40625 3.79844 2.01797 2.85547 3.02344C1.90586 4.02188 1.32812 5.02734 0.889844 6.20859C0.471484 7.35469 0.179297 8.6625 0.0996094 10.575C0.0199219 12.5016 0 13.1133 0 18C0 22.8867 0.0199219 23.4984 0.0996094 25.418C0.179297 27.3305 0.471484 28.6453 0.889844 29.7844C1.32812 30.9727 1.90586 31.9781 2.85547 32.9766C3.79844 33.975 4.74805 34.5938 5.86367 35.0508C6.94609 35.4938 8.18125 35.8031 9.9875 35.8875C11.8004 35.9719 12.3781 35.993 16.9934 35.993C21.6086 35.993 22.1863 35.9719 23.9992 35.8875C25.8055 35.8031 27.0473 35.4938 28.123 35.0508C29.2387 34.5938 30.1883 33.975 31.1313 32.9766C32.0742 31.9781 32.6586 30.9727 33.0902 29.7914C33.5086 28.6453 33.8008 27.3375 33.8805 25.425C33.9602 23.5055 33.9801 22.8938 33.9801 18.007C33.9801 13.1203 33.9602 12.5086 33.8805 10.5891C33.8008 8.67656 33.5086 7.36172 33.0902 6.22266C32.6719 5.02734 32.0941 4.02188 31.1445 3.02344C30.2016 2.025 29.252 1.40625 28.1363 0.949219C27.0539 0.50625 25.8188 0.196875 24.0125 0.1125C22.193 0.0210938 21.6152 0 17 0Z" fill="#FFF6E5"/>
            <path d="M17 8.75391C12.1789 8.75391 8.26758 12.8953 8.26758 18C8.26758 23.1047 12.1789 27.2461 17 27.2461C21.8211 27.2461 25.7324 23.1047 25.7324 18C25.7324 12.8953 21.8211 8.75391 17 8.75391ZM17 23.9977C13.8723 23.9977 11.3355 21.3117 11.3355 18C11.3355 14.6883 13.8723 12.0023 17 12.0023C20.1277 12.0023 22.6645 14.6883 22.6645 18C22.6645 21.3117 20.1277 23.9977 17 23.9977Z" fill="#FFF6E5"/>
            <path d="M28.1164 8.38809C28.1164 9.5834 27.2 10.5467 26.0777 10.5467C24.9488 10.5467 24.0391 9.57637 24.0391 8.38809C24.0391 7.19277 24.9555 6.22949 26.0777 6.22949C27.2 6.22949 28.1164 7.19981 28.1164 8.38809Z" fill="#FFF6E5"/>
        </g>
        <defs>
            <clipPath id="ig-clip">
                <rect width="34" height="36" fill="white"/>
            </clipPath>
        </defs>
    </svg>
);

export const Footer = ({ forceShow = false }: { forceShow?: boolean }) => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (email.trim()) {
            console.log('Submitted email:', email);
            setEmail('');
        }
    };

    return (
        <footer className={styles['element-footer']}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src="/images/footer-decor.png"
                alt=""
                className={styles['footer-decor']}
                aria-hidden="true"
            />

            {/* ── TOP: Newsletter ── */}
            <div className={styles['footer-top']}>
                <div className={styles['frame']}>
                    <span className={styles['stay-in-the-know']}>STAY IN THE KNOW</span>
                    <div className={styles.line} aria-hidden="true" />
                    <p className={styles['footer-newsletter']}>Notes from Couture</p>
                </div>

                <p className={styles['newsletter-subtitle']}>
                    Training dates, open days,<br />and academy updates.
                </p>

                <form className={styles['footer-form']} onSubmit={handleSubmit}>
                    <input
                        type="email"
                        className={styles['footer-input']}
                        placeholder="Email address"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit" className={styles['footer-submit-btn']} aria-label="Subscribe">
                        <SendIcon />
                    </button>
                </form>
            </div>

            {/* ── LOWER: Logo + Nav ── */}
            <div className={styles['footer-lower']}>
                <div className={styles['footer-nav-columns']}>

                    {/* Brand column */}
                    <div className={styles['brand-col']}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            className={styles.logo}
                            src="https://c.animaapp.com/GGDq1PoC/img/image-4@2x.png"
                            alt="Couture Beauty Academy"
                        />
                        <div className={styles['social-icons']}>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={styles['social-link']}>
                                <FacebookIcon />
                            </a>
                            <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X" className={styles['social-link']}>
                                <XIcon />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={styles['social-link']}>
                                <InstagramIcon />
                            </a>
                        </div>
                    </div>

                    {/* Nav columns */}
                    <div className={styles['nav-columns']}>
                        {getInitialFooterSections().map((section, idx) => (
                            <div key={idx} className={styles['nav-col']}>
                                <span className={styles['nav-heading']}>{section.title}</span>
                                {section.links.map((link, linkIdx) => (
                                    <Link
                                        href={link.href}
                                        key={linkIdx}
                                        className={styles['nav-link']}
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;