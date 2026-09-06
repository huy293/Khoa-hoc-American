import { cookies } from 'next/headers';
import CertificateContent from "./CertificateContent";
import { getWpUserEnrolledCourses, getWpCourses } from "@/lib/wordpress-queries";
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "Certificates - American Plus",
    description: "Certificates that have been issued - American Plus Beauty Academy",
};

export default async function DashboardCertificatePage() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('hn_user_session')?.value;
    const enrolledCookie = cookieStore.get('hn_enrolled_courses')?.value;

    let user: any = null;
    if (sessionCookie) {
        try {
            user = JSON.parse(decodeURIComponent(sessionCookie));
        } catch {
            try {
                user = JSON.parse(sessionCookie);
            } catch {
                user = null;
            }
        }
    }

    let enrolledSlugs: string[] = [];
    if (enrolledCookie) {
        try {
            enrolledSlugs = JSON.parse(decodeURIComponent(enrolledCookie));
        } catch {
            try {
                enrolledSlugs = JSON.parse(enrolledCookie);
            } catch {
                enrolledSlugs = [];
            }
        }
    }

    const completedCookie = cookieStore.get('hn_completed_courses')?.value;
    let completedSlugs: string[] = [];
    if (completedCookie) {
        try {
            completedSlugs = JSON.parse(decodeURIComponent(completedCookie));
        } catch {
            try {
                completedSlugs = JSON.parse(completedCookie);
            } catch {
                completedSlugs = [];
            }
        }
    }

    const [enrolledCourses, allCourses] = await Promise.all([
        getWpUserEnrolledCourses({
            userId: user?.id,
            userEmail: user?.email,
            enrolledSlugs,
        }),
        getWpCourses(12),
    ]);

    return (
        <CertificateContent
            user={user}
            enrolledCourses={enrolledCourses}
            allCourses={allCourses}
            completedSlugs={completedSlugs}
        />
    );
}
