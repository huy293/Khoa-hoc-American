import CertificateContent from "@/app/dashboard/certificate/CertificateContent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Certificates - American Plus",
    description: "Certificates that have been issued - American Plus Beauty Academy",
};

export default function DashboardCertificatePage() {
    return (
        <>
            <CertificateContent />
        </>
    );
}
