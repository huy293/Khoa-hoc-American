import { cookies } from "next/headers";
import { Metadata } from "next";
import PaymentHistoryContent from "./PaymentHistoryContent";
import { getWpUserOrders } from "@/lib/wordpress-queries";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "Payment History | Couture Beauty Academy",
    description: "Payment History | Couture Beauty Academy",
};

export default async function PaymentHistoryPage() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('hn_user_session')?.value;

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

    const orders = await getWpUserOrders({
        userId: user?.id,
        userEmail: user?.email,
    });

    return <PaymentHistoryContent initialOrders={orders} user={user} />;
}