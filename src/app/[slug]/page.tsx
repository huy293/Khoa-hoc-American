import { Metadata } from "next";
import SinglePostContent from "@/app/[slug]/SinglePostContent";

export const metadata: Metadata = {
    title: "New Year - Grand Opening Courses 2026 | Couture Beauty Academy",
    description: "Couture Beauty Academy – Launch Your Beauty Career! Courses Now Open: Texas Esthetician License",
    icons: {
        icon: "/icon.png",
    },
};

export default function Page() {
    return <SinglePostContent />;
}