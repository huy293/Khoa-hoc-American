"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar, {
    NavSection,
    DashboardIcon,
    ManagementIcon,
    ClassroomIcon,
    StudentsIcon,
    ScheduleIcon,
    ResourcesIcon,
    PaymentHistoryIcon,
} from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { Footer } from "@/components/layout/Footer";
import styles from "@/styles/dashboard/DashboardLayout.module.css";

/* ── Teacher Sidebar Navigation Sections (Khớp 100% hình ảnh) ── */
const TEACHER_NAV_SECTIONS: NavSection[] = [
    {
        id: 'main',
        items: [
            { label: 'Dashboard', href: '/teacher', icon: DashboardIcon },
            {
                label: 'Management',
                href: '/teacher/management/classroom',
                icon: ManagementIcon,
                children: [
                    { label: 'Classroom', href: '/teacher/management/classroom', icon: ClassroomIcon },
                    { label: 'Students', href: '/teacher/management/students', icon: StudentsIcon },
                ],
            },
        ],
    },
    {
        id: 'schedule',
        items: [
            { label: 'My Schedule', href: '/teacher/schedule', icon: ScheduleIcon },
        ],
    },
    {
        id: 'resources',
        items: [
            { label: 'Resources', href: '/teacher/resources', icon: ResourcesIcon },
            { label: 'Payment History', href: '/teacher/payment-history', icon: PaymentHistoryIcon },
        ],
    },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const pathname = usePathname();

    // Auto-close mobile drawer on route navigation
    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    const handleToggle = () => {
        if (typeof window !== 'undefined' && window.innerWidth <= 996) {
            setIsMobileOpen((prev) => !prev);
        } else {
            setIsCollapsed((prev) => !prev);
        }
    };

    return (
        <div className={styles['layout']}>
            {/* Backdrop for mobile drawer */}
            <div
                className={`${styles['layout__backdrop']} ${isMobileOpen ? styles['layout__backdrop--visible'] : ''}`}
                onClick={() => setIsMobileOpen(false)}
                aria-hidden="true"
            />

            {/* 1. Thanh điều hướng bên trái */}
            <Sidebar
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
                navSections={TEACHER_NAV_SECTIONS}
            />

            {/* 2. Toàn bộ khu vực nội dung chính */}
            <div
                className={`${styles['layout__main']} ${isCollapsed ? styles['layout__main--collapsed'] : ''}`}
            >
                {/* Header */}
                <Header onToggleSidebar={handleToggle} />

                {/* Body Content */}
                <main className={styles['layout__content']}>
                    {children}
                </main>

                {/* Footer */}
                <Footer forceShow />
            </div>
        </div>
    );
}