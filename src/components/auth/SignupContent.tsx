'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '@/styles/login/Login.module.css';

/* ── Google Multi-Color SVG Icon ── */
const GoogleIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
        />
        <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
        />
        <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            fill="#FBBC05"
        />
        <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            fill="#EA4335"
        />
    </svg>
);

/* ── Facebook SVG Icon ── */
const FacebookIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#1877F2" />
        <path
            d="M14.5 12.06h-1.8v6.94h-2.87v-6.94H8.5v-2.44h1.33V7.95c0-1.32.63-3.38 3.38-3.38l2.48.01v2.37h-1.8c-.29 0-.7.15-.7.76v1.91h2.53l-.22 2.44z"
            fill="#FFFFFF"
        />
    </svg>
);

export default function SignupContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const err = searchParams?.get('error');
        if (err === 'google_failed' || err === 'token_exchange_failed') {
            setErrorMsg('Đăng ký / Đăng nhập bằng Google không thành công. Vui lòng thử lại.');
        } else if (err === 'facebook_failed') {
            setErrorMsg('Đăng ký / Đăng nhập bằng Facebook không thành công. Vui lòng thử lại.');
        } else if (err === 'config_missing') {
            setErrorMsg('Hệ thống xác thực chưa được cấu hình đầy đủ.');
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (password !== confirmPassword) {
            setErrorMsg('Mật khẩu xác nhận không khớp.');
            return;
        }

        if (password.length < 6) {
            setErrorMsg('Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fullName,
                    email,
                    phone,
                    password,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                setErrorMsg(data.message || 'Đăng ký không thành công. Vui lòng thử lại.');
                setLoading(false);
                return;
            }

            setSuccessMsg('Đăng ký tài khoản học viên thành công! Đang chuyển hướng...');
            setTimeout(() => {
                router.push(data.redirectUrl || '/student');
            }, 1000);
        } catch {
            setErrorMsg('Lỗi kết nối máy chủ. Vui lòng thử lại sau.');
            setLoading(false);
        }
    };

    return (
        <main className={styles['login']}>
            {/* Concentric Quarter Circles at Bottom Left */}
            <div className={styles['login__decor']} aria-hidden="true">
                <div className={styles['login__circle']} />
                <div className={styles['login__circle']} />
                <div className={styles['login__circle']} />
            </div>

            {/* Signup Card */}
            <div className={styles['login__card']}>
                {/* Header */}
                <div className={styles['login__header']}>
                    <h1 className={styles['login__title']}>SIGN UP</h1>
                    <p className={styles['login__switch']}>
                        Already a member ?
                        <Link href="/login" className={styles['login__switch-link']}>
                            Log in
                        </Link>
                    </p>
                </div>

                <hr className={styles['login__divider_1']} />

                {errorMsg && <div className={`${styles['login__alert']} ${styles['login__alert--error']}`}>{errorMsg}</div>}
                {successMsg && <div className={`${styles['login__alert']} ${styles['login__alert--success']}`}>{successMsg}</div>}

                {/* Email Signup Form vs Social Options */}
                {showEmailForm ? (
                    <form onSubmit={handleSubmit} className={styles['login__form']}>
                        <div className={styles['login__input-group']}>
                            <label className={styles['login__label']}>Họ và Tên</label>
                            <input
                                type="text"
                                className={styles['login__input']}
                                placeholder="Nhập họ và tên đầy đủ"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>

                        <div className={styles['login__input-group']}>
                            <label className={styles['login__label']}>Email</label>
                            <input
                                type="email"
                                className={styles['login__input']}
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className={styles['login__input-group']}>
                            <label className={styles['login__label']}>Số Điện Thoại (Tùy chọn)</label>
                            <input
                                type="tel"
                                className={styles['login__input']}
                                placeholder="0901234567"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        <div className={styles['login__input-group']}>
                            <label className={styles['login__label']}>Mật Khẩu</label>
                            <div className={styles['login__input-wrapper']}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className={styles['login__input']}
                                    placeholder="Tối thiểu 6 ký tự"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className={styles['login__toggle-pw']}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? 'Ẩn' : 'Hiện'}
                                </button>
                            </div>
                        </div>

                        <div className={styles['login__input-group']}>
                            <label className={styles['login__label']}>Xác Nhận Mật Khẩu</label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className={styles['login__input']}
                                placeholder="Nhập lại mật khẩu"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className={`${styles['login__btn']} ${styles['login__btn--submit']}`}
                            disabled={loading}
                        >
                            {loading ? 'Đang tạo tài khoản...' : 'TẠO TÀI KHOẢN HỌC VIÊN'}
                        </button>

                        <button
                            type="button"
                            className={styles['login__back-to-social']}
                            onClick={() => {
                                setShowEmailForm(false);
                                setErrorMsg('');
                            }}
                        >
                            ← Quay lại đăng ký khác
                        </button>
                    </form>
                ) : (
                    <div className={styles['login__actions']}>
                        <button
                            type="button"
                            className={`${styles['login__btn']} ${styles['login__btn--google']}`}
                            onClick={() => {
                                window.location.href = '/api/auth/google';
                            }}
                        >
                            <span className={styles['login__btn-icon']}>
                                <GoogleIcon />
                            </span>
                            <span>Sign up with Google</span>
                        </button>

                        <button
                            type="button"
                            className={`${styles['login__btn']} ${styles['login__btn--facebook']}`}
                            onClick={() => {
                                window.location.href = '/api/auth/facebook';
                            }}
                        >
                            <span className={styles['login__btn-icon']}>
                                <FacebookIcon />
                            </span>
                            <span>Sign up with Facebook</span>
                        </button>

                        <div className={styles['login__divider']} role="separator">
                            <div className={styles['login__divider-line']} />
                            <span className={styles['login__divider-text']}>OR</span>
                            <div className={styles['login__divider-line']} />
                        </div>

                        <button
                            type="button"
                            className={`${styles['login__btn']} ${styles['login__btn--email']}`}
                            onClick={() => setShowEmailForm(true)}
                        >
                            <span>Sign up with Email</span>
                        </button>
                    </div>
                )}

                {/* Public Profile Checkbox Notice */}
                <div className={styles['login__checkbox-wrapper']}>
                    <label className={styles['login__checkbox-label']}>
                        <input type="checkbox" className={styles['login__checkbox']} defaultChecked />
                        <span className={styles['login__checkbox-custom']} />
                        <span className={styles['login__checkbox-text']}>
                            Sign up to this site with a public profile.{' '}
                            <a href="#read-more" className={styles['login__read-more']}>
                                Read more
                            </a>
                        </span>
                    </label>
                </div>
            </div>
        </main>
    );
}
