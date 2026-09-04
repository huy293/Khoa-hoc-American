'use client';

import { useState } from "react";
import HeaderText from "@/components/common/HeaderText";
import styles from "@/styles/contact/ContactContent.module.css";
import { ChevronDown } from "lucide-react";
import { WPContactFields } from "@/types/wordpress";

interface ContactContentProps {
    data?: Partial<WPContactFields>;
}

export default function ContactContent({ data }: ContactContentProps = {}) {
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const eyebrow = data?.contact_eyebrow || data?.contact_hero_eyebrow || "CONTACT";
    const title = data?.contact_title || data?.contact_hero_title || "HOW WE CAN HELP?";
    const description = data?.contact_description || data?.contact_hero_desc || "Visit our Houston campus and experience the training environment firsthand.";
    const scheduleTitle = data?.contact_schedule_title || "OPENING HOURS & LOCATION";
    const hoursLabel = data?.contact_hours_label || "MONDAY – SATURDAY";
    const hoursVal = data?.contact_schedule_hours || data?.contact_hours_val || "10:00 AM – 7:00 PM";
    const campusLabel = data?.contact_campus_label || "CAMPUS";
    const campusVal = data?.contact_campus_address || data?.contact_campus_val || "6441 Westheimer Rd, Houston, TX 77057";

    const fbLink = data?.contact_facebook || data?.contact_social_facebook || "#";
    const instaLink = data?.contact_instagram || data?.contact_social_instagram || "#";
    const twLink = data?.contact_twitter || data?.contact_social_twitter || "#";

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        const formEl = e.currentTarget;
        const formData = new FormData(formEl);
        const payload = {
            name: `${formData.get('firstName') || ''} ${formData.get('lastName') || ''}`.trim(),
            phone: formData.get('phone') || '',
            email: formData.get('email') || '',
            message: `Selected program: ${formData.get('program') || ''}. Preferred date: ${formData.get('month') || ''}/${formData.get('day') || ''}/${formData.get('year') || ''} at ${formData.get('time') || ''}`,
        };

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
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
        <>
            <section className={styles['contact']}>
                <img className={styles['contact__background']} src="/images/background-contact-page.jpg" alt="Contact Background" />
                <div className={styles['contact__wrapper']}>
                    <div className={styles['contact__container']}>
                        {/* Left Column: Info & Schedule */}
                        <div className={styles['contact__info']}>
                            <div className={styles['contact__title']}>
                                <HeaderText
                                    className={styles['contact__header-text']}
                                    eyebrow={eyebrow}
                                    title={title}
                                    titleClassName="contact__header-title"
                                />
                                <p className={styles['contact__description']}>
                                    {description}
                                </p>
                            </div>

                            <div className={styles['contact__schedule']}>
                                <p className={styles['contact__schedule-title']}>{scheduleTitle}</p>
                                <hr className={styles['contact__schedule-divider']} />
                                <ul className={styles['contact__schedule-list']}>
                                    <li className={styles['contact__schedule-item']}>
                                        <span className={styles['contact__schedule-label']}>{hoursLabel}</span>
                                        <span className={styles['contact__schedule-value']}>{hoursVal}</span>
                                    </li>
                                    <li className={styles['contact__schedule-item']}>
                                        <span className={styles['contact__schedule-label']}>{campusLabel}</span>
                                        <span className={styles['contact__schedule-value']}>{campusVal}</span>
                                    </li>
                                </ul>
                            </div>

                            <div className={styles['contact__socials']}>
                                <a href={fbLink} target="_blank" rel="noopener noreferrer" className={styles['contact__social-link']} aria-label="Facebook">
                                    <svg className={styles['contact__social-icon']} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M30 16.0843C30 8.3531 23.7313 2.08435 16 2.08435C8.26875 2.08435 2 8.3531 2 16.0843C2 23.0718 7.11875 28.8637 13.8125 29.915V20.1325H10.2569V16.0843H13.8125V13C13.8125 9.49185 15.9031 7.55247 19.1006 7.55247C20.6325 7.55247 22.235 7.82623 22.235 7.82623V11.2718H20.4688C18.7306 11.2718 18.1869 12.3506 18.1869 13.4593V16.0843H22.0694L21.4494 20.1325H18.1875V29.9162C24.8813 28.8656 30 23.0737 30 16.0843Z" fill="#8A7043" />
                                    </svg>
                                </a>
                                <a href={instaLink} target="_blank" rel="noopener noreferrer" className={styles['contact__social-link']} aria-label="Instagram">
                                    <svg className={styles['contact__social-icon']} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M21.8331 4.33313C23.3789 4.33774 24.8601 4.95385 25.9531 6.04689C27.0462 7.13993 27.6623 8.62109 27.6669 10.1669V21.8331C27.6623 23.3789 27.0462 24.8601 25.9531 25.9531C24.8601 27.0462 23.3789 27.6623 21.8331 27.6669H10.1669C8.62109 27.6623 7.13993 27.0462 6.04689 25.9531C4.95385 24.8601 4.33774 23.3789 4.33313 21.8331V10.1669C4.33774 8.62109 4.95385 7.13993 6.04689 6.04689C7.13993 4.95385 8.62109 4.33774 10.1669 4.33313H21.8331ZM21.8331 2H10.1669C5.675 2 2 5.675 2 10.1669V21.8331C2 26.325 5.675 30 10.1669 30H21.8331C26.325 30 30 26.325 30 21.8331V10.1669C30 5.675 26.325 2 21.8331 2Z" fill="#8A7043" />
                                        <path d="M23.584 10.1669C23.2379 10.1669 22.8995 10.0642 22.6117 9.87194C22.324 9.67965 22.0996 9.40634 21.9672 9.08657C21.8347 8.7668 21.8001 8.41493 21.8676 8.07546C21.9351 7.736 22.1018 7.42418 22.3465 7.17943C22.5913 6.93469 22.9031 6.76802 23.2426 6.7005C23.582 6.63297 23.9339 6.66763 24.2537 6.80008C24.5735 6.93254 24.8468 7.15684 25.0391 7.44462C25.2313 7.73241 25.334 8.07075 25.334 8.41687C25.3345 8.64682 25.2896 8.87461 25.2018 9.08715C25.114 9.29969 24.9851 9.49281 24.8225 9.65541C24.6599 9.81801 24.4668 9.9469 24.2543 10.0347C24.0417 10.1224 23.8139 10.1674 23.584 10.1669Z" fill="#8A7043" />
                                        <path d="M16 11.3331C16.923 11.3331 17.8253 11.6068 18.5928 12.1196C19.3602 12.6324 19.9584 13.3613 20.3116 14.2141C20.6649 15.0668 20.7573 16.0052 20.5772 16.9105C20.3971 17.8157 19.9527 18.6473 19.3 19.3C18.6473 19.9527 17.8157 20.3971 16.9105 20.5772C16.0052 20.7573 15.0668 20.6649 14.2141 20.3116C13.3613 19.9584 12.6324 19.3602 12.1196 18.5928C11.6068 17.8253 11.3331 16.923 11.3331 16C11.3345 14.7627 11.8266 13.5764 12.7015 12.7015C13.5764 11.8266 14.7627 11.3344 16 11.3331ZM16 9C14.6155 9 13.2622 9.41054 12.111 10.1797C10.9599 10.9489 10.0627 12.0421 9.53285 13.3212C9.00303 14.6003 8.86441 16.0078 9.13451 17.3656C9.4046 18.7235 10.0713 19.9708 11.0503 20.9497C12.0292 21.9287 13.2765 22.5954 14.6344 22.8655C15.9922 23.1356 17.3997 22.997 18.6788 22.4672C19.9579 21.9373 21.0511 21.0401 21.8203 19.889C22.5895 18.7378 23 17.3845 23 16C23 14.1435 22.2625 12.363 20.9497 11.0503C19.637 9.7375 17.8565 9 16 9Z" fill="#8A7043" />
                                    </svg>
                                </a>
                                <a href={twLink} target="_blank" rel="noopener noreferrer" className={styles['contact__social-link']} aria-label="Twitter">
                                    <svg className={styles['contact__social-icon']} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M31 6.84376C29.8747 7.33273 28.684 7.65487 27.4656 7.80001C28.746 7.05025 29.709 5.85911 30.1737 4.45001C28.9632 5.15788 27.641 5.65455 26.2638 5.91876C25.6838 5.31097 24.9863 4.82745 24.2137 4.4976C23.4411 4.16775 22.6095 3.99846 21.7694 4.00001C18.3681 4.00001 15.6156 6.71251 15.6156 10.0563C15.6132 10.5214 15.6665 10.9851 15.7744 11.4375C13.3354 11.3232 10.9472 10.701 8.76249 9.6108C6.57777 8.52059 4.64468 6.98636 3.08687 5.10626C2.54036 6.02759 2.25133 7.07879 2.25 8.15001C2.25 10.25 3.34562 12.1063 5 13.1938C4.01983 13.1705 3.05974 12.9111 2.20125 12.4375V12.5125C2.20125 15.45 4.32625 17.8938 7.13875 18.45C6.60986 18.591 6.06486 18.6624 5.5175 18.6625C5.12911 18.6632 4.74161 18.6255 4.36062 18.55C5.1425 20.9563 7.41813 22.7063 10.1138 22.7563C7.92336 24.4443 5.23414 25.3567 2.46875 25.35C1.97789 25.3493 1.48748 25.3201 1 25.2625C3.81324 27.0589 7.0834 28.0091 10.4213 28C21.7563 28 27.9487 18.7688 27.9487 10.7625C27.9487 10.5 27.9419 10.2375 27.9294 9.98126C29.1313 9.1263 30.1711 8.06383 31 6.84376Z" fill="#8A7043" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Right Column: Form Container */}
                        <div className={styles['contact__form-col']}>
                            <div className={styles['contact__form-wrapper']}>
                                <div className={styles['contact__form-card']}>
                                    {submitted ? (
                                        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#8A5800' }}>
                                            <h3 style={{ fontSize: '24px', marginBottom: '12px' }}>Thank You!</h3>
                                            <p style={{ fontSize: '16px', color: '#666' }}>Your inquiry has been submitted successfully. Our team will contact you shortly.</p>
                                        </div>
                                    ) : (
                                        <form className={styles['contact__form']} onSubmit={handleSubmit}>
                                            {/* Row 1: First Name & Last Name */}
                                            <div className={styles['contact__form-row']}>
                                                <div className={styles['contact__form-group']}>
                                                    <label className={styles['contact__form-label']}>FIRST NAME *</label>
                                                    <input
                                                        type="text"
                                                        name="firstName"
                                                        className={styles['contact__form-input']}
                                                        placeholder="Enter first name"
                                                        required
                                                    />
                                                </div>
                                                <div className={styles['contact__form-group']}>
                                                    <label className={styles['contact__form-label']}>LAST NAME *</label>
                                                    <input
                                                        type="text"
                                                        name="lastName"
                                                        className={styles['contact__form-input']}
                                                        placeholder="Enter last name"
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            {/* Row 2: Email Address */}
                                            <div className={styles['contact__form-group']}>
                                                <label className={styles['contact__form-label']}>EMAIL ADDRESS *</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    className={styles['contact__form-input']}
                                                    placeholder="you@example.com"
                                                    required
                                                />
                                            </div>

                                            {/* Row 3: Phone Number */}
                                            <div className={styles['contact__form-group']}>
                                                <label className={styles['contact__form-label']}>PHONE NUMBER *</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    className={styles['contact__form-input']}
                                                    placeholder="(832) 000-0000"
                                                    required
                                                />
                                            </div>

                                            {/* Row 4: Schedule a Tour */}
                                            <div className={styles['contact__form-group']}>
                                                <label className={styles['contact__form-label']}>
                                                    WOULD YOU LIKE TO SCHEDULE A TOUR? (CALL US: 832 425 6230) *
                                                </label>
                                                <div className={styles['contact__form-select-wrapper']}>
                                                    <select name="tour" className={styles['contact__form-select']} defaultValue="yes">
                                                        <option value="yes">Yes, I would love to schedule an in-person tour</option>
                                                        <option value="no">No, just need online information</option>
                                                        <option value="call">Please call me to schedule</option>
                                                    </select>
                                                    <ChevronDown className={styles['contact__form-select-icon']} size={18} />
                                                </div>
                                            </div>

                                            {/* Row 5: Date and Time */}
                                            <div className={styles['contact__form-group']}>
                                                <label className={styles['contact__form-label']}>
                                                    WHAT DATE AND TIME YOU LIKE TO COME ( MONDAY TO SAT: 10:00AM TO 6:00PM) *
                                                </label>
                                                <div className={styles['contact__form-datetime-grid']}>
                                                    <div className={styles['contact__form-datetime-col']}>
                                                        <span className={styles['contact__form-sublabel']}>Month</span>
                                                        <div className={styles['contact__form-select-wrapper']}>
                                                            <select name="month" className={styles['contact__form-select']} defaultValue="1">
                                                                <option value="1">January</option>
                                                                <option value="2">February</option>
                                                                <option value="3">March</option>
                                                                <option value="4">April</option>
                                                                <option value="5">May</option>
                                                                <option value="6">June</option>
                                                                <option value="7">July</option>
                                                                <option value="8">August</option>
                                                                <option value="9">September</option>
                                                                <option value="10">October</option>
                                                                <option value="11">November</option>
                                                                <option value="12">December</option>
                                                            </select>
                                                            <ChevronDown className={styles['contact__form-select-icon']} size={16} />
                                                        </div>
                                                    </div>

                                                    <div className={styles['contact__form-datetime-col']}>
                                                        <span className={styles['contact__form-sublabel']}>Day</span>
                                                        <input
                                                            type="number"
                                                            name="day"
                                                            min="1"
                                                            max="31"
                                                            defaultValue="15"
                                                            className={styles['contact__form-input']}
                                                            placeholder="Day"
                                                        />
                                                    </div>

                                                    <div className={styles['contact__form-datetime-col']}>
                                                        <span className={styles['contact__form-sublabel']}>Year</span>
                                                        <input
                                                            type="number"
                                                            name="year"
                                                            min="2026"
                                                            max="2030"
                                                            defaultValue="2026"
                                                            className={styles['contact__form-input']}
                                                            placeholder="Year"
                                                        />
                                                    </div>

                                                    <div className={styles['contact__form-datetime-col']}>
                                                        <span className={styles['contact__form-sublabel']}>Time</span>
                                                        <input
                                                            type="time"
                                                            name="time"
                                                            className={styles['contact__form-input']}
                                                            defaultValue="10:00"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Row 6: Program of Interest */}
                                            <div className={styles['contact__form-group']}>
                                                <label className={styles['contact__form-label']}>
                                                    TELL US WHAT PROGRAM YOU LIKE TO LEARN? *
                                                </label>
                                                <textarea
                                                    name="program"
                                                    className={styles['contact__form-textarea']}
                                                    placeholder="Share them with us"
                                                    rows={4}
                                                    required
                                                ></textarea>
                                            </div>

                                            {/* Row 7: Submit Button */}
                                            <button type="submit" disabled={submitting} className={styles['contact__form-submit']}>
                                                {submitting ? 'SENDING...' : 'SEND'}
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}