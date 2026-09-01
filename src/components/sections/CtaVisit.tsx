'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from '@/styles/sections/CtaVisit.module.css';

/**
 * Danh sách các đường dẫn (routes) được phép hiển thị CTA Visit.
 * Bạn có thể dễ dàng thêm hoặc bớt các trang tại đây.
 */
const SHOW_CTA_ROUTES = [
    '/',          // Trang chủ
    '/courses',   // Trang danh sách khóa học
    '/course',    // Chi tiết khóa học
    '/about-us',  // Trang giới thiệu
];

export const CtaVisit = () => {
    const pathname = usePathname();
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        visitDate: '',
        message: '',
    });

    // Kiểm tra xem trang hiện tại có nằm trong danh sách hiển thị hay không
    const isAllowed = Boolean(
        pathname &&
        (pathname === '/' ||
            SHOW_CTA_ROUTES.some(
                (route) => route !== '/' && (pathname === route || pathname.startsWith(`${route}/`))
            ))
    );

    if (!isAllowed) {
        return null;
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.fullName,
                    phone: form.phone,
                    email: form.email,
                    message: `Preferred visit date: ${form.visitDate || 'Not specified'}. Note: ${form.message}`,
                }),
            });
            const result = await res.json();
            if (result.success) {
                setSubmitted(true);
            }
        } catch {
            setSubmitted(true);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className={styles['cta-section']}>
            {/* Decorative concentric quarter-circles – anchored at bottom-left of section */}
            <div className={styles['circle-decor']} aria-hidden="true">
                <div className={styles.circle} />
                <div className={styles.circle} />
                <div className={styles.circle} />
            </div>

            {/* ── Left column ── */}
            <div className={styles['cta-left']}>
                <span className={styles['cta-label']}>PLAN YOUR VISIT</span>

                <h2 className={styles['cta-heading']}>
                    Come see where<br />the work begins.
                </h2>

                <p className={styles['cta-subtext']}>
                    Visit our Houston campus and experience the training environment firsthand.
                </p>

                <div className={styles['hours-block']}>
                    <p className={styles['hours-title']}>OPENING HOURS &amp; LOCATION</p>
                    <div className={styles.divider} />

                    <div className={styles['info-rows']}>
                        <div className={styles['info-row']}>
                            <span className={styles['info-label']}>MONDAY – SATURDAY</span>
                            <span className={styles['info-value']}>10:00 AM – 7:00 PM</span>
                        </div>
                        <div className={styles['info-row']}>
                            <span className={styles['info-label']}>CAMPUS</span>
                            <span className={styles['info-value']}>6441 Westheimer Rd, Houston, TX 77057</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Right column: Form card ── */}
            <div className={styles['cta-right']}>
                <div className={styles['form-card']}>
                    {submitted ? (
                        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#8A5800' }}>
                            <h3 style={{ fontSize: '24px', marginBottom: '12px' }}>Thank You!</h3>
                            <p style={{ fontSize: '15px', color: '#666' }}>Your tour request has been received. We will contact you shortly to confirm your visit time.</p>
                        </div>
                    ) : (
                        <>
                            <h3 className={styles['form-title']}>Visit the academy</h3>

                            <form className={styles['visit-form']} onSubmit={handleSubmit}>
                                <div className={styles['form-row']}>
                                    <div className={styles['field-group']}>
                                        <label className={styles.label}>FULL NAME <span className={styles.required}>*</span></label>
                                        <input
                                            className={styles.input}
                                            type="text"
                                            name="fullName"
                                            placeholder="Enter full name"
                                            value={form.fullName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className={styles['field-group']}>
                                        <label className={styles.label}>EMAIL ADDRESS <span className={styles.required}>*</span></label>
                                        <input
                                            className={styles.input}
                                            type="email"
                                            name="email"
                                            placeholder="you@example.com"
                                            value={form.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className={styles['form-row']}>
                                    <div className={styles['field-group']}>
                                        <label className={styles.label}>PHONE NUMBER <span className={styles.required}>*</span></label>
                                        <input
                                            className={styles.input}
                                            type="tel"
                                            name="phone"
                                            placeholder="Enter phone number"
                                            value={form.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className={styles['field-group']}>
                                        <label className={styles.label}>PREFERRED VISIT DATE</label>
                                        <input
                                            className={styles.input}
                                            type="text"
                                            name="visitDate"
                                            placeholder="MM / DD / YYYY"
                                            value={form.visitDate}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className={styles['field-group']}>
                                    <label className={styles.label}>MESSAGE</label>
                                    <textarea
                                        className={styles.textarea}
                                        name="message"
                                        placeholder="Tell us what you would like to learn"
                                        value={form.message}
                                        onChange={handleChange}
                                        rows={4}
                                    />
                                </div>

                                <div className={styles['submit-row']}>
                                    <button type="submit" disabled={submitting} className={styles['submit-btn']}>
                                        {submitting ? 'BOOKING...' : 'BOOK A VISIT'}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default CtaVisit;
