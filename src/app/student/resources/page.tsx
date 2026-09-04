import { Metadata } from "next";
import ResourcesContent from "./ResourcesContent";

export const metadata: Metadata = {
    title: "Tài nguyên - Đại học Khoa học Ứng dụng",
    description: "Tài nguyên - Đại học Khoa học Ứng dụng",
}

export default function ResourcesPage() {
    return (
        <>
            <ResourcesContent />
        </>
    )
}