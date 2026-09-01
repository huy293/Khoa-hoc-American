'use client';

import React, { useState } from 'react';
import DashboardHeadings from '@/components/dashboard/DashboardHeadings';
import styles from '@/styles/dashboard/payment-history/PaymentHistoryContent.module.css';

/* ── SVG Icons ── */
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

const EyeIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
            stroke="#8A7043"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="3.2" stroke="#8A7043" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/* ── Invoice Interface & Sample Data ── */
export interface InvoiceItem {
    id: string;
    orderId: string;
    purchase: string;
    category: 'course' | 'product';
    date: string;
    payment: string;
    total: string;
    isHighlight?: boolean;
    customerName?: string;
    subtotal?: string;
    tax?: string;
}

const TABS = [
    { id: 'all', label: 'ALL INVOICES (20)' },
    { id: 'course', label: 'COURSE PURCHASE INVOICE (20)' },
    { id: 'product', label: 'PRODUCT PURCHASE INVOICE (8)' },
];

const INITIAL_INVOICES: InvoiceItem[] = [
    {
        id: 'inv-1',
        orderId: '#CBA-98421',
        purchase: 'HydraFacial + 1 item',
        category: 'product',
        date: 'Aug 25, 2026',
        payment: 'CREDIT CARD',
        total: '$556.25',
        isHighlight: false,
        customerName: 'Lalisa Moban',
        subtotal: '$515.00',
        tax: '$41.25',
    },
    {
        id: 'inv-2',
        orderId: '#CBA-98421',
        purchase: 'HydraFacial + 1 item',
        category: 'product',
        date: 'Aug 25, 2026',
        payment: 'CREDIT CARD',
        total: '$556.25',
        isHighlight: false,
        customerName: 'Lalisa Moban',
        subtotal: '$515.00',
        tax: '$41.25',
    },
    {
        id: 'inv-3',
        orderId: '#CBA-98421',
        purchase: 'HydraFacial Traning Class',
        category: 'course',
        date: 'Aug 25, 2026',
        payment: 'PAYPAL/ PAYPAL LATER/ CREDIT CARD',
        total: '$556.25',
        isHighlight: true, // background: #FFFBF4
        customerName: 'Lalisa Moban',
        subtotal: '$530.00',
        tax: '$26.25',
    },
    {
        id: 'inv-4',
        orderId: '#CBA-98421',
        purchase: 'HydraFacial + 1 item',
        category: 'product',
        date: 'Aug 25, 2026',
        payment: 'CREDIT CARD',
        total: '$556.25',
        isHighlight: false,
        customerName: 'Lalisa Moban',
        subtotal: '$515.00',
        tax: '$41.25',
    },
    {
        id: 'inv-5',
        orderId: '#CBA-98421',
        purchase: 'HydraFacial + 1 item',
        category: 'product',
        date: 'Aug 25, 2026',
        payment: 'CREDIT CARD',
        total: '$556.25',
        isHighlight: false,
        customerName: 'Lalisa Moban',
        subtotal: '$515.00',
        tax: '$41.25',
    },
    {
        id: 'inv-6',
        orderId: '#CBA-98421',
        purchase: 'HydraFacial Traning Class',
        category: 'course',
        date: 'Aug 25, 2026',
        payment: 'PAYPAL/ PAYPAL LATER/ CREDIT CARD',
        total: '$556.25',
        isHighlight: true, // background: #FFFBF4
        customerName: 'Lalisa Moban',
        subtotal: '$530.00',
        tax: '$26.25',
    },
];

export default function PaymentHistoryContent() {
    const [activeTab, setActiveTab] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);

    // Filter by Tab and Search query
    const filteredInvoices = INITIAL_INVOICES.filter((item) => {
        // Tab check
        if (activeTab !== 'all' && item.category !== activeTab) {
            return false;
        }

        // Search check
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase().trim();
        return (
            item.orderId.toLowerCase().includes(q) ||
            item.purchase.toLowerCase().includes(q) ||
            item.date.toLowerCase().includes(q) ||
            item.payment.toLowerCase().includes(q) ||
            item.total.toLowerCase().includes(q)
        );
    });

    return (
        <section className={styles['payment-history']}>
            <div className={styles['payment-history__container']}>
                {/* 1. Dashboard Heading */}
                <DashboardHeadings
                    tag="RESOURCES"
                    title="Learning Resources"
                />

                {/* 2. Navigation Row: Filter Tabs & Search Box */}
                <div className={styles['payment-history__nav-row']}>
                    <div className={styles['payment-history__tabs']}>
                        {TABS.map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`${styles['payment-history__tab-btn']} ${
                                        isActive ? styles['payment-history__tab-btn--active'] : ''
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className={styles['payment-history__search-box']}>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles['payment-history__search-input']}
                            placeholder="Search invoice..."
                            aria-label="Search invoice"
                        />
                        <span className={styles['payment-history__search-icon']}>
                            <SearchIcon />
                        </span>
                    </div>
                </div>

                {/* 3. Invoices Table */}
                <div className={styles['payment-history__table-wrapper']}>
                    <table className={styles['payment-history__table']}>
                        {/* Table Header */}
                        <thead className={styles['payment-history__thead']}>
                            <tr>
                                <th className={`${styles['payment-history__th']} ${styles['payment-history__col-id']}`}>
                                    ORDER ID CODE
                                </th>
                                <th className={`${styles['payment-history__th']} ${styles['payment-history__col-purchase']}`}>
                                    PURCHASE
                                </th>
                                <th className={`${styles['payment-history__th']} ${styles['payment-history__col-date']}`}>
                                    DATE
                                </th>
                                <th className={`${styles['payment-history__th']} ${styles['payment-history__col-payment']}`}>
                                    PAYMENT
                                </th>
                                <th className={`${styles['payment-history__th']} ${styles['payment-history__col-total']}`}>
                                    TOTAL
                                </th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody className={styles['payment-history__tbody']}>
                            {filteredInvoices.length > 0 ? (
                                filteredInvoices.map((inv) => {
                                    const isTrainingHighlight =
                                        inv.isHighlight || inv.purchase.toLowerCase().includes('traning class') || inv.purchase.toLowerCase().includes('training class');

                                    return (
                                        <tr
                                            key={inv.id}
                                            className={`${styles['payment-history__tr']} ${
                                                isTrainingHighlight ? styles['payment-history__tr--highlight'] : ''
                                            }`}
                                        >
                                            {/* Column 1: Order ID */}
                                            <td className={`${styles['payment-history__td']} ${styles['payment-history__td--id']}`}>
                                                {inv.orderId}
                                            </td>

                                            {/* Column 2: Purchase */}
                                            <td
                                                className={`${styles['payment-history__td']} ${
                                                    isTrainingHighlight
                                                        ? styles['payment-history__td--highlight-purchase']
                                                        : styles['payment-history__td--purchase']
                                                }`}
                                            >
                                                {inv.purchase}
                                            </td>

                                            {/* Column 3: Date */}
                                            <td className={`${styles['payment-history__td']} ${styles['payment-history__td--date']}`}>
                                                {inv.date}
                                            </td>

                                            {/* Column 4: Payment Method */}
                                            <td
                                                className={`${styles['payment-history__td']} ${styles['payment-history__td--payment']} ${
                                                    inv.payment.length > 15 ? styles['payment-history__td--payment-long'] : ''
                                                }`}
                                            >
                                                {inv.payment}
                                            </td>

                                            {/* Column 5: Total & Action Eye Icon */}
                                            <td className={styles['payment-history__td']}>
                                                <div className={styles['payment-history__total-cell']}>
                                                    <span className={styles['payment-history__total-price']}>
                                                        {inv.total}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        className={styles['payment-history__eye-btn']}
                                                        onClick={() => setSelectedInvoice(inv)}
                                                        title="View Invoice Detail"
                                                        aria-label={`View invoice ${inv.orderId}`}
                                                    >
                                                        <EyeIcon />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={5} className={styles['payment-history__empty']}>
                                        No invoices found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 4. Invoice Detail Modal */}
                {selectedInvoice && (
                    <div
                        className={styles['invoice-modal-backdrop']}
                        onClick={() => setSelectedInvoice(null)}
                    >
                        <div
                            className={styles['invoice-modal']}
                            onClick={(e) => e.stopPropagation()}
                            role="dialog"
                            aria-modal="true"
                            aria-label={`Invoice Detail ${selectedInvoice.orderId}`}
                        >
                            <div className={styles['invoice-modal__header']}>
                                <h3 className={styles['invoice-modal__title']}>
                                    Invoice {selectedInvoice.orderId}
                                </h3>
                                <button
                                    type="button"
                                    className={styles['invoice-modal__close-btn']}
                                    onClick={() => setSelectedInvoice(null)}
                                    aria-label="Close"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className={styles['invoice-modal__body']}>
                                <div className={styles['invoice-modal__info-row']}>
                                    <span className={styles['invoice-modal__info-label']}>Customer:</span>
                                    <span className={styles['invoice-modal__info-value']}>
                                        {selectedInvoice.customerName || 'Lalisa Moban'}
                                    </span>
                                </div>
                                <div className={styles['invoice-modal__info-row']}>
                                    <span className={styles['invoice-modal__info-label']}>Item Purchased:</span>
                                    <span className={styles['invoice-modal__info-value']}>
                                        {selectedInvoice.purchase}
                                    </span>
                                </div>
                                <div className={styles['invoice-modal__info-row']}>
                                    <span className={styles['invoice-modal__info-label']}>Payment Date:</span>
                                    <span className={styles['invoice-modal__info-value']}>
                                        {selectedInvoice.date}
                                    </span>
                                </div>
                                <div className={styles['invoice-modal__info-row']}>
                                    <span className={styles['invoice-modal__info-label']}>Payment Method:</span>
                                    <span className={styles['invoice-modal__info-value']}>
                                        {selectedInvoice.payment}
                                    </span>
                                </div>
                                <div className={styles['invoice-modal__info-row']}>
                                    <span className={styles['invoice-modal__info-label']}>Subtotal:</span>
                                    <span className={styles['invoice-modal__info-value']}>
                                        {selectedInvoice.subtotal || '$515.00'}
                                    </span>
                                </div>
                                <div className={styles['invoice-modal__info-row']}>
                                    <span className={styles['invoice-modal__info-label']}>Tax (8%):</span>
                                    <span className={styles['invoice-modal__info-value']}>
                                        {selectedInvoice.tax || '$41.25'}
                                    </span>
                                </div>
                                <div className={styles['invoice-modal__total-row']}>
                                    <span>Total Amount:</span>
                                    <span>{selectedInvoice.total}</span>
                                </div>
                            </div>

                            <div className={styles['invoice-modal__footer']}>
                                <button
                                    type="button"
                                    className={styles['invoice-modal__print-btn']}
                                    onClick={() => window.print()}
                                >
                                    Download / Print Invoice
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}