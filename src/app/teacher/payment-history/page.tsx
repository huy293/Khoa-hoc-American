import { Metadata } from "next";
import PaymentHistoryContent, { InvoiceItem } from "./PaymentHistoryContent";
import { getWpUserOrders } from "@/lib/wordpress-queries";

export const metadata: Metadata = {
    title: "Payment History | Couture Beauty Academy",
    description: "Payment History | Couture Beauty Academy",
};

export default async function PaymentHistoryPage() {
    let initialInvoices: InvoiceItem[] | undefined = undefined;
    try {
        const orders = await getWpUserOrders();
        if (orders && orders.length > 0) {
            initialInvoices = orders.map((ord, idx) => ({
                id: String(ord.id || `inv-${idx}`),
                orderId: ord.orderId || `#CBA-${ord.id || 98420 + idx}`,
                purchase: ord.purchase || 'Course & Supplies',
                category: ord.category || 'course',
                date: ord.date || 'Aug 25, 2026',
                payment: ord.payment || 'CREDIT CARD',
                total: ord.total || '$556.25',
                isHighlight: ord.isHighlight ?? (ord.category === 'course'),
                customerName: ord.customerName || 'Teacher Account',
                subtotal: ord.subtotal || '$515.00',
                tax: ord.tax || '$41.25',
            }));
        }
    } catch {
        // Fallback
    }

    return <PaymentHistoryContent initialInvoices={initialInvoices} />;
}