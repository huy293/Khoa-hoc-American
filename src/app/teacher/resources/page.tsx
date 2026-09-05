import { Metadata } from "next";
import ResourcesContent from "./ResourcesContent";
import { getWpResources, getWpPosts } from "@/lib/wordpress-queries";

export const metadata: Metadata = {
    title: "Tài nguyên & Giáo trình Giảng viên | Couture Beauty Academy",
    description: "Kho tài liệu, giáo trình và tài liệu giảng dạy chuyên ngành thẩm mỹ y khoa",
};

export default async function TeacherResourcesPage() {
    let initialResources = undefined;
    try {
        // Ưu tiên endpoint tài liệu học tập chuyên biệt (/homenest/v1/resources)
        const wpResources = await getWpResources({});
        if (wpResources && wpResources.length > 0) {
            initialResources = wpResources.map((r, idx) => {
                const catSlug = r.category || 'cert';
                let category: 'all' | 'cert' | 'laser' | 'pmu' = 'cert';
                if (catSlug.includes('laser')) category = 'laser';
                else if (catSlug.includes('pmu')) category = 'pmu';

                return {
                    id: r.id || String(idx),
                    category,
                    image: `/images/gallery/image-${(idx % 10) + 1}.jpg`,
                    title: r.title,
                    description: r.description || 'Tài liệu kiến thức chuyên sâu từ giảng viên chuyên ngành.',
                    author: {
                        name: r.courseTitle || 'Couture Beauty Academy',
                        avatar: '/images/thomas-nguyen.png',
                        date: r.updatedAt ? new Date(r.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    },
                };
            });
        } else {
            // Fallback sang blog posts
            const posts = await getWpPosts(20);
            if (posts && posts.length > 0) {
                initialResources = posts.map((p, idx) => {
                    const catSlug = p.categories?.nodes?.[0]?.slug || 'cert';
                    let category: 'all' | 'cert' | 'laser' | 'pmu' = 'cert';
                    if (catSlug.includes('laser')) category = 'laser';
                    else if (catSlug.includes('pmu')) category = 'pmu';

                    return {
                        id: String(p.databaseId || p.id || idx),
                        category,
                        image: p.featuredImage?.node?.sourceUrl || `/images/gallery/image-${(idx % 10) + 1}.jpg`,
                        title: p.title,
                        description: p.excerpt ? p.excerpt.replace(/<[^>]*>/g, '').slice(0, 150) + '...' : 'Tài liệu kiến thức chuyên sâu từ giảng viên chuyên ngành.',
                        author: {
                            name: p.author?.node?.name || 'Thy Anh Pham Nguyen',
                            avatar: p.author?.node?.avatar?.url || '/images/thomas-nguyen.png',
                            date: p.date ? new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        },
                    };
                });
            }
        }
    } catch {
        // Fallback to default resources in component
    }

    return <ResourcesContent initialResources={initialResources} />;
}
