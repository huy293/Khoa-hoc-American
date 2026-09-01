'use client';

import React from "react";
import MyCertificationList from "@/components/dashboard/certificate/MyCertificationList";
import CourseCatalogList from "@/components/dashboard/certificate/CourseCatalogList";

export default function CertificateContent() {
    return (
        <>
            <MyCertificationList />
            <CourseCatalogList />
        </>
    );
}