import type { Metadata } from 'next';
import Link from 'next/link';
import styles from '@/styles/login/Login.module.css';

export const metadata: Metadata = {
    title: 'Log In - Couture Beauty Academy',
    description: 'Log in to Couture Beauty Academy account',
};

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

export default function LoginPage() {
    return (
        <main className={styles['login']}>
            {/* Concentric Quarter Circles at Bottom Left */}
            <div className={styles['login__decor']} aria-hidden="true">
                <div className={styles['login__circle']} />
                <div className={styles['login__circle']} />
                <div className={styles['login__circle']} />
            </div>

            {/* Login Card */}
            <div className={styles['login__card']}>
                {/* Header */}
                <div className={styles['login__header']}>
                    <h1 className={styles['login__title']}>LOG IN</h1>
                    <p className={styles['login__switch']}>
                        New to this site ?
                        <Link href="/signup" className={styles['login__switch-link']}>
                            Sign up
                        </Link>
                    </p>
                </div>

                <hr className={styles['login__divider_1']} />

                {/* Actions */}
                <div className={styles['login__actions']}>
                    <button type="button" className={`${styles['login__btn']} ${styles['login__btn--google']}`}>
                        <span className={styles['login__btn-icon']}>
                            <GoogleIcon />
                        </span>
                        <span>Log in with Google</span>
                    </button>

                    <button type="button" className={`${styles['login__btn']} ${styles['login__btn--facebook']}`}>
                        <span className={styles['login__btn-icon']}>
                            <FacebookIcon />
                        </span>
                        <span>Log in with Facebook</span>
                    </button>

                    <div className={styles['login__divider']} role="separator">
                        <div className={styles['login__divider-line']} />
                        <span className={styles['login__divider-text']}>OR</span>
                        <div className={styles['login__divider-line']} />
                    </div>

                    <button type="button" className={`${styles['login__btn']} ${styles['login__btn--email']}`}>
                        <span>Log in with Email</span>
                    </button>
                </div>
            </div>
        </main>
    );
}
