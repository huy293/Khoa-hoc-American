'use client';

import React, { useState, useId } from 'react';
import Image from 'next/image';
import styles from '@/styles/dashboard/certificate/MyCertificationList.module.css';
import DashboardHeadings from '@/components/dashboard/common/DashboardHeadings';

/* ── SVG Icons ── */
const ViewEyeIcon = () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M2.40495 13.5939C2.30772 13.8559 2.30772 14.144 2.40495 14.4059C3.35194 16.7021 4.95939 18.6654 7.02352 20.0469C9.08765 21.4284 11.5155 22.1659 13.9993 22.1659C16.4831 22.1659 18.9109 21.4284 20.9751 20.0469C23.0392 18.6654 24.6466 16.7021 25.5936 14.4059C25.6908 14.144 25.6908 13.8559 25.5936 13.5939C24.6466 11.2978 23.0392 9.33448 20.9751 7.95298C18.9109 6.57148 16.4831 5.83398 13.9993 5.83398C11.5155 5.83398 9.08765 6.57148 7.02352 7.95298C4.95939 9.33448 3.35194 11.2978 2.40495 13.5939Z"
            stroke="#665231"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M13.9993 17.4999C15.9323 17.4999 17.4993 15.9329 17.4993 13.9999C17.4993 12.0669 15.9323 10.4999 13.9993 10.4999C12.0663 10.4999 10.4993 12.0669 10.4993 13.9999C10.4993 15.9329 12.0663 17.4999 13.9993 17.4999Z"
            stroke="#665231"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const DownloadIcon = () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M14 17.5V3.5M19.8333 11.6667L14 17.5L8.16667 11.6667M24.5 17.5V22.1667C24.5 22.7855 24.2542 23.379 23.8166 23.8166C23.379 24.2542 22.7855 24.5 22.1667 24.5H5.83333C5.21449 24.5 4.621 24.2542 4.18342 23.8166C3.74583 23.379 3.5 22.7855 3.5 22.1667V17.5"
            stroke="#665231"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const SearchIcon = () => (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M18.75 18.75L14.41 14.41M16.75 8.75C16.75 13.1683 13.1683 16.75 8.75 16.75C4.33172 16.75 0.75 13.1683 0.75 8.75C0.75 4.33172 4.33172 0.75 8.75 0.75C13.1683 0.75 16.75 4.33172 16.75 8.75Z"
            stroke="#8A7043"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const ChevronDownIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M11.9995 16.8006C11.2995 16.8006 10.5995 16.5306 10.0695 16.0006L3.54953 9.48062C3.25953 9.19062 3.25953 8.71062 3.54953 8.42063C3.83953 8.13063 4.31953 8.13063 4.60953 8.42063L11.1295 14.9406C11.6095 15.4206 12.3895 15.4206 12.8695 14.9406L19.3895 8.42063C19.6795 8.13063 20.1595 8.13063 20.4495 8.42063C20.7395 8.71062 20.7395 9.19062 20.4495 9.48062L13.9295 16.0006C13.3995 16.5306 12.6995 16.8006 11.9995 16.8006Z"
            fill="#8A7043"
        />
    </svg>
);

/* ── Certificate Data Interface Definitions ── */
export interface CertificateItem {
    id: string;
    title: string;
    courseName?: string;
    category: 'cert' | 'laser' | 'pmu' | 'all';
    image: string;
    issuedDate?: string;
    certificateNumber?: string;
    recipientName?: string;
}

export interface MyCertificationListProps {
    tag?: string;
    title?: string;
    initialCertificates?: CertificateItem[];
    limit?: number;
}

export default function MyCertificationList({
    tag = 'MY CERTIFICATE LIST',
    title = 'Certificates that have been issued',
    initialCertificates = [],
    limit = 6,
}: MyCertificationListProps) {
    const [activeTab, setActiveTab] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [visibleCount, setVisibleCount] = useState<number>(limit);
    const [previewCert, setPreviewCert] = useState<CertificateItem | null>(null);
    const searchInputId = useId();

    const tabs = React.useMemo(() => {
        const list = [];
        list.push({ id: 'all', label: `ALL COURSE (${initialCertificates.length})` });
        list.push({ id: 'cert', label: `CERTIFICATE TRAINING (${initialCertificates.filter((c) => c.category === 'cert').length})` });
        list.push({ id: 'laser', label: `LASER TRAINING COURSES (${initialCertificates.filter((c) => c.category === 'laser').length})` });
        list.push({ id: 'pmu', label: `P.M.U TRAINING COURSES (${initialCertificates.filter((c) => c.category === 'pmu').length})` });
        return list;
    }, [initialCertificates]);

    // Filter logic based on tab and search keyword
    const filteredCertificates = initialCertificates.filter((item) => {
        const matchesTab = activeTab === 'all' || item.category === activeTab;
        const matchesSearch =
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.courseName && item.courseName.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (item.certificateNumber && item.certificateNumber.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesTab && matchesSearch;
    });

    const displayedCertificates = filteredCertificates.slice(0, visibleCount);

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + 3);
    };

    const handleDownload = (cert: CertificateItem, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        // Trigger download of the certificate image
        const link = document.createElement('a');
        link.href = cert.image;
        link.download = `${cert.title.replace(/\s+/g, '_')}_${cert.certificateNumber || 'certificate'}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <section className={styles['my-certifications']} aria-label="My Certificate List Section">
            <div className={styles['my-certifications__container']}>
                {/* 1. Header: Tag & Title using DashboardHeadings */}
                <DashboardHeadings tag={tag} title={title} />

                {/* 2. Nav: Filter Tabs & Search Bar */}
                <div className={styles['my-certifications__nav-row']}>
                    <div className={styles['my-certifications__tabs']} role="tablist" aria-label="Certificate Categories">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                role="tab"
                                aria-selected={activeTab === tab.id}
                                className={`${styles['my-certifications__tab-btn']} ${
                                    activeTab === tab.id ? styles['my-certifications__tab-btn--active'] : ''
                                }`}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setVisibleCount(limit);
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className={styles['my-certifications__search-box']}>
                        <input
                            id={searchInputId}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setVisibleCount(limit);
                            }}
                            className={styles['my-certifications__search-input']}
                            aria-label="Search certificates"
                        />
                        <span className={styles['my-certifications__search-icon']}>
                            <SearchIcon />
                        </span>
                    </div>
                </div>

                {/* 3. Certificates Grid (3 columns, 56px gap) */}
                {displayedCertificates.length > 0 ? (
                    <div className={styles['my-certifications__grid']}>
                        {displayedCertificates.map((cert) => (
                            <article key={cert.id} className={styles['cert-card']}>
                                {/* Media / Certificate Image */}
                                <div
                                    className={styles['cert-card__media-wrap']}
                                    onClick={() => setPreviewCert(cert)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            setPreviewCert(cert);
                                        }
                                    }}
                                    aria-label={`View certificate ${cert.title}`}
                                >
                                    <Image
                                        src={cert.image}
                                        alt={cert.title}
                                        width={468}
                                        height={330}
                                        className={styles['cert-card__image']}
                                        loading="lazy"
                                    />
                                </div>

                                {/* Bottom Info Row: Title & Actions */}
                                <div className={styles['cert-card__info-row']}>
                                    <h3 className={styles['cert-card__title']} title={cert.title}>
                                        {cert.title}
                                    </h3>
                                    <div className={styles['cert-card__actions']}>
                                        <button
                                            type="button"
                                            className={styles['cert-card__action-btn']}
                                            onClick={() => setPreviewCert(cert)}
                                            title="View Certificate Details"
                                            aria-label="View Details"
                                        >
                                            <ViewEyeIcon />
                                        </button>
                                        <button
                                            type="button"
                                            className={styles['cert-card__action-btn']}
                                            onClick={(e) => handleDownload(cert, e)}
                                            title="Download Certificate"
                                            aria-label="Download Certificate"
                                        >
                                            <DownloadIcon />
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className={styles['my-certifications__empty']}>
                        <p>No certificates found matching your criteria.</p>
                    </div>
                )}

                {/* 4. Load More Button */}
                {visibleCount < filteredCertificates.length && (
                    <div className={styles['my-certifications__load-more-wrap']}>
                        <button
                            type="button"
                            className={styles['my-certifications__load-more-btn']}
                            onClick={handleLoadMore}
                        >
                            <span className={styles['my-certifications__load-more-icon']}>
                                <ChevronDownIcon />
                            </span>
                            Load more
                        </button>
                    </div>
                )}
            </div>

            {/* 5. Lightbox Modal Preview */}
            {previewCert && (
                <div
                    className={styles['cert-modal-backdrop']}
                    onClick={() => setPreviewCert(null)}
                    role="dialog"
                    aria-modal="true"
                >
                    <div
                        className={styles['cert-modal']}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles['cert-modal__header']}>
                            <h3 className={styles['cert-modal__title']}>
                                {previewCert.courseName || previewCert.title}
                            </h3>
                            <button
                                type="button"
                                className={styles['cert-modal__close-btn']}
                                onClick={() => setPreviewCert(null)}
                                aria-label="Close modal"
                            >
                                ✕
                            </button>
                        </div>

                        <div className={styles['cert-modal__body']}>
                            <Image
                                src={previewCert.image}
                                alt={previewCert.title}
                                width={750}
                                height={530}
                                className={styles['cert-modal__image']}
                                priority
                            />
                        </div>

                        <div className={styles['cert-modal__footer']}>
                            <div className={styles['cert-modal__meta']}>
                                <span>Issued to: <strong>{previewCert.recipientName || 'Student'}</strong></span>
                                {previewCert.certificateNumber && (
                                    <span> • No: {previewCert.certificateNumber}</span>
                                )}
                                {previewCert.issuedDate && (
                                    <span> • Date: {previewCert.issuedDate}</span>
                                )}
                            </div>
                            <div className={styles['cert-modal__actions']}>
                                <button
                                    type="button"
                                    className={styles['cert-modal__download-btn']}
                                    onClick={() => handleDownload(previewCert)}
                                >
                                    Download Image / PDF
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
