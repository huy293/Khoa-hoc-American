import CartPageContent from "@/app/student/cart/CartPageContent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Cart - American Plus",
    description: "Cart - American Plus",
};

export default function DashboardCartPage() {
    return (
        <>
            <CartPageContent />
        </>
    );
}
