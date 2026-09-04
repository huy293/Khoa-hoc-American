import type { Metadata } from 'next';
import SignupContent from '@/components/auth/SignupContent';

export const metadata: Metadata = {
    title: 'Sign Up - Couture Beauty Academy',
    description: 'Sign up for a Couture Beauty Academy account',
};

export default function SignUpPage() {
    return <SignupContent />;
}
