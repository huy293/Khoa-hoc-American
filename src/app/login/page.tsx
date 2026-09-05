import type { Metadata } from 'next';
import { Suspense } from 'react';
import LoginContent from '@/components/auth/LoginContent';

export const metadata: Metadata = {
    title: 'Log In - Couture Beauty Academy',
    description: 'Log in to Couture Beauty Academy account',
};

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginContent />
        </Suspense>
    );
}
