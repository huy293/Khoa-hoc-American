import { Metadata } from 'next';
import ContactContent from './ContactContent';

export const metadata: Metadata = {
    title: 'Contact | Course America',
    description: 'Liên hệ với chúng tôi tại Course America',
};

export default function ContactPage() {
    return (
        <main>
            <ContactContent />
        </main>
    );
}