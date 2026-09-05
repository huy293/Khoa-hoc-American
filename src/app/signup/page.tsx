import type { Metadata } from 'next';
import { Suspense } from 'react';
import SignupContent from '@/components/auth/SignupContent';

export const metadata: Metadata = {
    title: 'Sign Up - Couture Beauty Academy',
    description: 'Sign up for a Couture Beauty Academy account',
};

export default function SignUpPage() {
    return (
        <Suspense fallback={null}>
            <SignupContent />
        </Suspense>
    );
}
