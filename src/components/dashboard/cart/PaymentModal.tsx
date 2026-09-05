"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import styles from "@/styles/dashboard/cart/PaymentModal.module.css";

export interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    subtotal?: number;
    shippingFee?: number;
    memberDiscount?: number;
    total?: number;
    onSave?: (data: CheckoutData) => void;
}

export interface RecipientFormData {
    firstName: string;
    lastName: string;
    email: string;
    streetAddress: string;
    countryCode: string;
    phoneNumber: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

export interface CardFormData {
    cardNumber: string;
    expiryDate: string;
    cardHolder: string;
    cvv: string;
}

export interface CheckoutData {
    recipient: RecipientFormData;
    payment: CardFormData;
}

const countryCodes = Object.entries({
    "+64": "NZ (+64)",
    "+1": "US (+1)",
    "+84": "VN (+84)",
    "+61": "AU (+61)",
    "+44": "UK (+44)",
    "+1-CA": "CA (+1)",
}).map(([code, label]) => ({ code, label }));

const countries = [
    "United States",
    "New Zealand",
    "Vietnam",
    "Australia",
    "United Kingdom",
    "Canada",
    "Singapore",
    "Germany",
    "France",
    "Japan",
];

export default function PaymentModal({
    isOpen,
    onClose,
    subtotal = 0,
    shippingFee = 0,
    memberDiscount = 0,
    total = 0,
    onSave,
}: PaymentModalProps) {
    const [step, setStep] = useState<1 | 2 | 3>(1);

    const [recipientData, setRecipientData] = useState<RecipientFormData>({
        firstName: "",
        lastName: "",
        email: "",
        streetAddress: "",
        countryCode: "+64",
        phoneNumber: "",
        city: "",
        state: "",
        postalCode: "",
        country: "United States",
    });

    const [cardData, setCardData] = useState<CardFormData>({
        cardNumber: "",
        expiryDate: "",
        cardHolder: "",
        cvv: "",
    });

    const [paymentMethods, setPaymentMethods] = useState<Array<{ id: string; title: string; description: string; instructions?: string }>>([]);
    const [selectedMethod, setSelectedMethod] = useState<string>('');

    const { items, clearCart } = useCart();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderId, setOrderId] = useState<string | number>('');

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            setStep(1);
            setIsSubmitting(false);
            window.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";

            // Lấy danh sách cổng thanh toán đang kích hoạt từ WooCommerce
            fetch('/api/payment-methods')
                .then((res) => res.json())
                .then((data) => {
                    if (data?.success && Array.isArray(data.methods) && data.methods.length > 0) {
                        setPaymentMethods(data.methods);
                        setSelectedMethod(data.methods[0].id);
                    }
                })
                .catch(() => {});
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleRecipientChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setRecipientData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCardData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const fullName = `${recipientData.firstName} ${recipientData.lastName}`.trim() || 'Valued Customer';
        const fullAddress = `${recipientData.streetAddress}, ${recipientData.city}, ${recipientData.state} ${recipientData.postalCode}, ${recipientData.country}`.trim();
        const fullPhone = `${recipientData.countryCode} ${recipientData.phoneNumber}`.trim();

        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: fullName,
                    phone: fullPhone,
                    email: recipientData.email,
                    address: fullAddress,
                    payment_method: selectedMethod,
                    items: items,
                    total: total,
                }),
            });

            const data = await res.json().catch(() => null);
            if (data?.order_id) {
                setOrderId(data.order_id);
            }
        } catch (err) {
            console.warn('Checkout network attempt error:', err);
        } finally {
            setIsSubmitting(false);
            setStep(3);
            clearCart();
            if (onSave) {
                onSave({
                    recipient: recipientData,
                    payment: cardData,
                });
            }
        }
    };

    return (
        <div className={styles["modal-overlay"]} onClick={onClose}>
            <div
                className={styles["modal-card"]}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-step-title"
            >
                {/* 1. Top Header */}
                <div className={styles["modal-header"]}>
                    <span className={styles["modal-header__title"]}>
                        Payment information
                    </span>
                    <button
                        type="button"
                        className={styles["modal-header__close-btn"]}
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M18 6L6 18M6 6L18 18"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>

                {/* 2. Modal Body */}
                <div className={styles["modal-body"]}>
                    {/* ================= STEP 1: RECIPIENT INFORMATION ================= */}
                    {step === 1 && (
                        <div className={styles["recipient-card"]}>
                            <h2
                                id="modal-step-title"
                                className={styles["recipient-card__title"]}
                            >
                                Recipient information
                            </h2>

                            <hr />

                            <form onSubmit={handleNext} className={styles["form-form"]}>
                                {/* Row 1: First Name & Last Name */}
                                <div className={styles["form-row"]}>
                                    <div className={styles["form-group"]}>
                                        <label className={styles["form-label"]}>
                                            FIRST NAME
                                            <span className={styles["form-label__required"]}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={recipientData.firstName}
                                            onChange={handleRecipientChange}
                                            placeholder="Enter frist name"
                                            className={styles["form-input"]}
                                            required
                                        />
                                    </div>

                                    <div className={styles["form-group"]}>
                                        <label className={styles["form-label"]}>
                                            LAST NAME
                                            <span className={styles["form-label__required"]}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={recipientData.lastName}
                                            onChange={handleRecipientChange}
                                            placeholder="Enter last name"
                                            className={styles["form-input"]}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Row 2: Email Address */}
                                <div className={styles["form-group"]}>
                                    <label className={styles["form-label"]}>
                                        EMAIL ADDRESS
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={recipientData.email}
                                        onChange={handleRecipientChange}
                                        placeholder="you@example.com"
                                        className={styles["form-input"]}
                                    />
                                </div>

                                {/* Row 3: Street Address */}
                                <div className={styles["form-group"]}>
                                    <label className={styles["form-label"]}>
                                        STREET ADDRESS
                                        <span className={styles["form-label__required"]}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="streetAddress"
                                        value={recipientData.streetAddress}
                                        onChange={handleRecipientChange}
                                        placeholder=""
                                        className={styles["form-input"]}
                                        required
                                    />
                                </div>

                                {/* Row 4: Phone Number */}
                                <div className={styles["form-group"]}>
                                    <label className={styles["form-label"]}>
                                        PHONE NUMBER
                                        <span className={styles["form-label__required"]}>*</span>
                                    </label>
                                    <div className={styles["phone-field"]}>
                                        <div className={styles["phone-select-wrapper"]}>
                                            <select
                                                name="countryCode"
                                                value={recipientData.countryCode}
                                                onChange={handleRecipientChange}
                                                className={styles["phone-select"]}
                                            >
                                                {countryCodes.map((c) => (
                                                    <option key={c.code} value={c.code}>
                                                        {c.code}
                                                    </option>
                                                ))}
                                            </select>
                                            <span className={styles["select-arrow"]}>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </span>
                                        </div>
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={recipientData.phoneNumber}
                                            onChange={handleRecipientChange}
                                            placeholder=""
                                            className={styles["form-input"]}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Row 5: City & Region/ State/ Province */}
                                <div className={styles["form-row"]}>
                                    <div className={styles["form-group"]}>
                                        <label className={styles["form-label"]}>
                                            CITY
                                            <span className={styles["form-label__required"]}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={recipientData.city}
                                            onChange={handleRecipientChange}
                                            placeholder=""
                                            className={styles["form-input"]}
                                            required
                                        />
                                    </div>

                                    <div className={styles["form-group"]}>
                                        <label className={styles["form-label"]}>
                                            REGION/ STATE/ PROVINCE
                                            <span className={styles["form-label__required"]}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={recipientData.state}
                                            onChange={handleRecipientChange}
                                            placeholder=""
                                            className={styles["form-input"]}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Row 6: Postal/ Zip Code & Country */}
                                <div className={styles["form-row"]}>
                                    <div className={styles["form-group"]}>
                                        <label className={styles["form-label"]}>
                                            POSTAL/ ZIP CODE
                                        </label>
                                        <input
                                            type="text"
                                            name="postalCode"
                                            value={recipientData.postalCode}
                                            onChange={handleRecipientChange}
                                            placeholder="Enter number"
                                            className={styles["form-input"]}
                                        />
                                    </div>

                                    <div className={styles["form-group"]}>
                                        <label className={styles["form-label"]}>
                                            COUNTRY
                                            <span className={styles["form-label__required"]}>*</span>
                                        </label>
                                        <div className={styles["select-wrapper"]}>
                                            <select
                                                name="country"
                                                value={recipientData.country}
                                                onChange={handleRecipientChange}
                                                className={styles["select-input"]}
                                                required
                                            >
                                                {countries.map((c) => (
                                                    <option key={c} value={c}>
                                                        {c}
                                                    </option>
                                                ))}
                                            </select>
                                            <span className={styles["select-arrow"]}>
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className={styles["modal-actions"]}>
                                    <button type="submit" className={styles["btn-next"]}>
                                        NEXT
                                    </button>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className={styles["btn-edit"]}
                                    >
                                        EDIT
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* ================= STEP 2: PAYMENT STEP ================= */}
                    {step === 2 && (
                        <div className={styles["recipient-card"]}>
                            <h2
                                id="modal-step-title"
                                className={styles["recipient-card__title"]}
                            >
                                Payment
                            </h2>

                            <hr />

                            {/* Order Cost Summary */}
                            <div className={styles["payment-summary"]}>
                                <div className={styles["payment-summary__row"]}>
                                    <span className={styles["payment-summary__label"]}>
                                        Total order cost:
                                    </span>
                                    <span className={styles["payment-summary__value"]}>
                                        $ {subtotal.toFixed(2)}
                                    </span>
                                </div>

                                <div className={styles["payment-summary__row"]}>
                                    <span className={styles["payment-summary__label"]}>
                                        Estimated shipping fee:
                                    </span>
                                    <span className={styles["payment-summary__value"]}>
                                        $ {shippingFee.toFixed(2)}
                                    </span>
                                </div>

                                <div className={styles["payment-summary__row"]}>
                                    <span className={styles["payment-summary__label"]}>
                                        Member offers:
                                    </span>
                                    <div className={styles["payment-summary__offer-wrap"]}>
                                        <span className={styles["payment-summary__offer-tag"]}>
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M21.1744 9.63937C20.8209 9.27 20.4553 8.88937 20.3175 8.55469C20.19 8.24813 20.1825 7.74 20.175 7.24781C20.1609 6.33281 20.1459 5.29594 19.425 4.575C18.7041 3.85406 17.6672 3.83906 16.7522 3.825C16.26 3.8175 15.7519 3.81 15.4453 3.6825C15.1116 3.54469 14.73 3.17906 14.3606 2.82562C13.7137 2.20406 12.9787 1.5 12 1.5C11.0213 1.5 10.2872 2.20406 9.63937 2.82562C9.27 3.17906 8.88937 3.54469 8.55469 3.6825C8.25 3.81 7.74 3.8175 7.24781 3.825C6.33281 3.83906 5.29594 3.85406 4.575 4.575C3.85406 5.29594 3.84375 6.33281 3.825 7.24781C3.8175 7.74 3.81 8.24813 3.6825 8.55469C3.54469 8.88844 3.17906 9.27 2.82562 9.63937C2.20406 10.2862 1.5 11.0213 1.5 12C1.5 12.9787 2.20406 13.7128 2.82562 14.3606C3.17906 14.73 3.54469 15.1106 3.6825 15.4453C3.81 15.7519 3.8175 16.26 3.825 16.7522C3.83906 17.6672 3.85406 18.7041 4.575 19.425C5.29594 20.1459 6.33281 20.1609 7.24781 20.175C7.74 20.1825 8.24813 20.19 8.55469 20.3175C8.88844 20.4553 9.27 20.8209 9.63937 21.1744C10.2862 21.7959 11.0213 22.5 12 22.5C12.9787 22.5 13.7128 21.7959 14.3606 21.1744C14.73 20.8209 15.1106 20.4553 15.4453 20.3175C15.7519 20.19 16.26 20.1825 16.7522 20.175C17.6672 20.1609 18.7041 20.1459 19.425 19.425C20.1459 18.7041 20.1609 17.6672 20.175 16.7522C20.1825 16.26 20.19 15.7519 20.3175 15.4453C20.4553 15.1116 20.8209 14.73 21.1744 14.3606C21.7959 13.7137 22.5 12.9787 22.5 12C22.5 11.0213 21.7959 10.2872 21.1744 9.63937ZM16.2806 10.2806L11.0306 15.5306C10.961 15.6004 10.8783 15.6557 10.7872 15.6934C10.6962 15.7312 10.5986 15.7506 10.5 15.7506C10.4014 15.7506 10.3038 15.7312 10.2128 15.6934C10.1217 15.6557 10.039 15.6004 9.96937 15.5306L7.71937 13.2806C7.57864 13.1399 7.49958 12.949 7.49958 12.75C7.49958 12.551 7.57864 12.3601 7.71937 12.2194C7.86011 12.0786 8.05098 11.9996 8.25 11.9996C8.44902 11.9996 8.63989 12.0786 8.78063 12.2194L10.5 13.9397L15.2194 9.21937C15.2891 9.14969 15.3718 9.09442 15.4628 9.0567C15.5539 9.01899 15.6515 8.99958 15.75 8.99958C15.8485 8.99958 15.9461 9.01899 16.0372 9.0567C16.1282 9.09442 16.2109 9.14969 16.2806 9.21937C16.3503 9.28906 16.4056 9.37178 16.4433 9.46283C16.481 9.55387 16.5004 9.65145 16.5004 9.75C16.5004 9.84855 16.481 9.94613 16.4433 10.0372C16.4056 10.1282 16.3503 10.2109 16.2806 10.2806Z"
                                                    fill="currentColor"
                                                />
                                            </svg>
                                            <span>Offers Students</span>
                                        </span>
                                        <span className={styles["payment-summary__offer-val"]}>
                                            $ -{memberDiscount.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <div className={styles["payment-summary__total-row"]}>
                                    <span className={styles["payment-summary__total-label"]}>
                                        Total :
                                    </span>
                                    <span className={styles["payment-summary__total-value"]}>
                                        $ {total.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <hr />

                            {/* Payment Method & Card Inputs */}
                            <form onSubmit={handleSave} className={styles["form-form"]}>
                                <div className={styles["payment-method-section"]}>
                                    <h3 className={styles["payment-method__title"]}>
                                        SELECT A PAYMENT METHOD:
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
                                        {paymentMethods.map((pm) => {
                                            const isSelected = selectedMethod === pm.id;
                                            return (
                                                <label
                                                    key={pm.id}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'flex-start',
                                                        gap: '12px',
                                                        padding: '12px 16px',
                                                        borderRadius: '8px',
                                                        border: isSelected ? '1.5px solid #AF8861' : '1px solid #E5E5E5',
                                                        backgroundColor: isSelected ? '#FAF7F2' : '#FFFFFF',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.2s',
                                                    }}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="paymentMethod"
                                                        value={pm.id}
                                                        checked={isSelected}
                                                        onChange={() => setSelectedMethod(pm.id)}
                                                        style={{ marginTop: '3px', accentColor: '#AF8861' }}
                                                    />
                                                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <span style={{ fontWeight: 600, fontSize: '13px', color: '#1A1A1A' }}>
                                                                {pm.title}
                                                            </span>
                                                            {pm.id === 'credit_card' && (
                                                                <div style={{ display: 'flex', gap: '6px' }}>
                                                                    <svg width="32" height="20" viewBox="0 0 44 26" fill="none">
                                                                        <rect width="44" height="26" rx="3" fill="#00579F" />
                                                                        <path d="M18.8 18H16.4L17.9 8H20.3L18.8 18ZM28.5 8.2C28 8 27.2 7.8 26.1 7.8C23.5 7.8 21.6 9.2 21.6 11.2C21.6 12.7 22.9 13.5 23.9 14C24.9 14.5 25.3 14.8 25.3 15.3C25.3 16 24.4 16.3 23.6 16.3C22.4 16.3 21.7 16.1 20.7 15.6L20.2 17.6C21.1 18 22.3 18.3 23.5 18.3C26.3 18.3 28.1 16.9 28.1 14.8C28.1 13.1 27 12.3 25.8 11.7C24.8 11.2 24.3 10.9 24.3 10.4C24.3 10 24.8 9.6 25.8 9.6C26.6 9.6 27.3 9.8 27.9 10L28.5 8.2ZM36 18H38.2L36.3 8H34.3C33.8 8 33.3 8.3 33.1 8.8L28.8 18H31.3L31.8 16.6H35L36 18ZM32.5 14.8L33.8 11.1L34.6 14.8H32.5ZM14.1 8H11.7C11.1 8 10.7 8.3 10.5 8.8L6.8 18H9.3L9.8 16.6H12.9L14.1 8Z" fill="white" />
                                                                    </svg>
                                                                    <svg width="30" height="20" viewBox="0 0 40 26" fill="none">
                                                                        <rect width="40" height="26" rx="3" fill="#252525" />
                                                                        <circle cx="16" cy="13" r="7.5" fill="#EB001B" />
                                                                        <circle cx="24" cy="13" r="7.5" fill="#F79E1B" fillOpacity="0.92" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {pm.description && (
                                                            <span style={{ fontSize: '11px', color: '#666', marginTop: '3px' }}>
                                                                {pm.description}
                                                            </span>
                                                        )}
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* TH1: Chọn Chuyển khoản ngân hàng (BACS) */}
                                {selectedMethod === 'bacs' && (
                                    <div style={{
                                        padding: '16px',
                                        backgroundColor: '#F8F9FA',
                                        borderRadius: '8px',
                                        border: '1px solid #EAEAEA',
                                        marginTop: '16px',
                                        fontSize: '12px',
                                        color: '#333',
                                        lineHeight: 1.6
                                    }}>
                                        <div style={{ fontWeight: 700, color: '#AF8861', marginBottom: '8px', fontSize: '13px' }}>
                                            🏦 THÔNG TIN TÀI KHOẢN HỌC VIỆN:
                                        </div>
                                        <div><strong>Ngân hàng:</strong> Vietcombank (Chi nhánh Houston / HCM)</div>
                                        <div><strong>Số tài khoản:</strong> 98420 6688 9999</div>
                                        <div><strong>Chủ tài khoản:</strong> COUTURE BEAUTY ACADEMY</div>
                                        <div><strong>Nội dung:</strong> {recipientData.phoneNumber ? `CBA ${recipientData.phoneNumber}` : 'CBA - [SĐT của bạn]'}</div>
                                        <div style={{ marginTop: '8px', fontSize: '11px', color: '#777', fontStyle: 'italic' }}>
                                            * Sau khi hoàn tất chuyển khoản, đơn hàng sẽ được kích hoạt tự động sau 5-10 phút.
                                        </div>
                                    </div>
                                )}

                                {/* TH2: Chọn Thẻ tín dụng (Credit Card / Stripe) */}
                                {(selectedMethod === 'credit_card' || selectedMethod === 'stripe') && (
                                    <>
                                        {/* Card Row 1: Card Number & Expiry Date */}
                                        <div className={styles["form-row"]} style={{ marginTop: '16px' }}>
                                            <div className={styles["form-group"]}>
                                                <label className={styles["form-label"]}>
                                                    CARD NUMBER
                                                    <span className={styles["form-label__required"]}>*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="cardNumber"
                                                    value={cardData.cardNumber}
                                                    onChange={handleCardChange}
                                                    placeholder="4532 •••• •••• ••••"
                                                    className={styles["form-input"]}
                                                    required
                                                />
                                            </div>

                                            <div className={styles["form-group"]}>
                                                <label className={styles["form-label"]}>
                                                    EXPIRY DATE
                                                    <span className={styles["form-label__required"]}>*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="expiryDate"
                                                    value={cardData.expiryDate}
                                                    onChange={handleCardChange}
                                                    placeholder="MM/YY"
                                                    className={styles["form-input"]}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Card Row 2: Card Holder & CVV */}
                                        <div className={styles["form-row"]}>
                                            <div className={styles["form-group"]}>
                                                <label className={styles["form-label"]}>
                                                    CARD HOLDER
                                                    <span className={styles["form-label__required"]}>*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    name="cardHolder"
                                                    value={cardData.cardHolder}
                                                    onChange={handleCardChange}
                                                    placeholder="NAME ON CARD"
                                                    className={styles["form-input"]}
                                                    required
                                                />
                                            </div>

                                            <div className={styles["form-group"]}>
                                                <label className={styles["form-label"]}>
                                                    CVV
                                                    <span className={styles["form-label__required"]}>*</span>
                                                </label>
                                                <input
                                                    type="password"
                                                    name="cvv"
                                                    maxLength={4}
                                                    value={cardData.cvv}
                                                    onChange={handleCardChange}
                                                    placeholder="CVV"
                                                    className={styles["form-input"]}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* TH3: Chọn COD */}
                                {selectedMethod === 'cod' && (
                                    <div style={{
                                        padding: '16px',
                                        backgroundColor: '#F8F9FA',
                                        borderRadius: '8px',
                                        border: '1px solid #EAEAEA',
                                        marginTop: '16px',
                                        fontSize: '13px',
                                        color: '#333'
                                    }}>
                                        📦 Bạn sẽ thanh toán bằng tiền mặt khi nhận hàng tại địa chỉ đã cung cấp.
                                    </div>
                                )}

                                {/* Action Button Save */}
                                <button type="submit" className={styles["btn-save"]} disabled={isSubmitting}>
                                    {isSubmitting ? 'PROCESSING ORDER...' : 'CONFIRM & PAY'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* ================= STEP 3: PAYMENT SUCCESS SCREEN ================= */}
                    {step === 3 && (
                        <div className={styles["success-view"]}>
                            <div className={styles["success-icon-wrapper"]}>
                                <Image
                                    src="/images/success.png"
                                    alt="Payment Successful"
                                    width={160}
                                    height={160}
                                    className={styles["success-icon"]}
                                    priority
                                />
                            </div>
                            <h2 className={styles["success-title"]}>
                                Payment Successful
                            </h2>
                            <p className={styles["success-desc"]}>
                                Thank you for your purchase! {orderId ? `Your Order Code is #${orderId}.` : ''} Your order will be processed and delivered to you soon.
                            </p>
                            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'center' }}>
                                <button
                                    type="button"
                                    className={styles["btn-save"]}
                                    onClick={onClose}
                                    style={{ maxWidth: '240px' }}
                                >
                                    DONE
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

