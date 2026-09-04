"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { Footer } from "@/components/layout/Footer";
import styles from "@/styles/dashboard/DashboardLayout.module.css";

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