import React, { useState } from 'react';
import styles from '@/styles/layout/Footer.module.css';

const FOOTER_SECTIONS = [
    {
        title: 'MENU',
        links: ['About', 'Instructors', 'Contact'],
    },
    {
        title: 'COURSES',
        links: ['All Courses', 'Skin Treatments', 'Skin Technology', 'Brows & Lashes'],
    },
    {
        title: 'SHOP',
        links: [
            'Professional Skincare',
            'PMU Supplies',
            'Lash & Brow Supplies',
            'Student Kits',
            'Studio & Content Equipment',
        ],
    },
    {
        title: 'RESOURCES',
        links: ['Blog', 'Gallery', 'FAQ', 'Ebooks'],
    },
];

export const Footer = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (email.trim()) {
            console.log('Submitted email:', email);
            // Xử lý gửi email tại đây
            setEmail('');
        }
    };

    return (
        <footer className={styles['element-footer']}>
            <img
                className={styles['ellipse']}
                src="https://c.animaapp.com/GGDq1PoC/img/ellipse-6.svg"
                alt="Decorative ellipse"
            />

            {/* Top Section / Newsletter */}
            <div className={styles['footer-top']}>
                <div className={styles['frame']}>
                    <div className={styles['text-wrapper']}>STAY IN THE KNOW</div>
                    <img
                        className={styles['line']}
                        src="https://c.animaapp.com/GGDq1PoC/img/line-3.svg"
                        alt="Divider line"
                    />
                    <div className={styles['footer-newsletter']}>Notes from Couture</div>
                </div>

                <p className={styles['div']}>Training dates, open days, and academy updates.</p>

                <form className={styles['footer-newsletter-2']} onSubmit={handleSubmit}>
                    <input
                        type="email"
                        className={`${styles['footer-newsletter-3']} ${styles['footer-input']}`}
                        placeholder="Email address"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit" className={styles['footer-submit-btn']} aria-label="Subscribe">
                        <img
                            className={styles['material-symbols']}
                            src="https://c.animaapp.com/GGDq1PoC/img/material-symbols-light-send.svg"
                            alt="Send icon"
                        />
                    </button>
                </form>
            </div>

            {/* Lower Section / Navigation */}
            <div className={styles['footer-lower']}>
                <div className={styles['footer-nav-columns']}>
                    <div className={styles['frame-2']}>
                        <img
                            className={styles['image']}
                            src="https://c.animaapp.com/GGDq1PoC/img/image-4@2x.png"
                            alt="Brand Logo"
                        />
                        <img
                            className={styles['img']}
                            src="https://c.animaapp.com/GGDq1PoC/img/frame-45.svg"
                            alt="Social icons"
                        />
                    </div>

                    <div className={styles['frame-3']}>
                        {FOOTER_SECTIONS.map((section, idx) => (
                            <div key={idx} className={styles['div-2']}>
                                <div className={section.title === 'MENU' ? styles['menu'] : styles['text-wrapper-3']}>
                                    {section.title}
                                </div>
                                {section.links.map((link, linkIdx) => (
                                    <a
                                        href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                                        key={linkIdx}
                                        className={styles['text-wrapper-2']}
                                    >
                                        {link}
                                    </a>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <img
                className={styles['star']}
                src="https://c.animaapp.com/GGDq1PoC/img/star-1.svg"
                alt="Decorative star"
            />
        </footer>
    );
};

export default Footer;