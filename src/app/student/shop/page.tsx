import ShopPageContent from "@/app/(main)/shop/ShopPageContent";
import { getWpProducts } from "@/lib/wordpress-queries";

export default async function DashboardShopPage() {
    const products = await getWpProducts(50);
    return (
        <ShopPageContent initialProducts={products} noMarginTop isDashboard />
    );
}

