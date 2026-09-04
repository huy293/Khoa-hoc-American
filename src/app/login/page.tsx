import type { Metadata } from 'next';
import LoginContent from '@/components/auth/LoginContent';

export const metadata: Metadata = {
    title: 'Log In - Couture Beauty Academy',
    description: 'Log in to Couture Beauty Academy account',
};

export default function LoginPage() {
    return <LoginContent />;
}
