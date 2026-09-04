import { Metadata } from 'next';
import HeroSection from "@/components/home/HeroSection";
import WhoWeTeach from "@/components/home/WhoWeTeach";
import OurImpact from "@/components/home/OurImpact";
import OurPeople from "@/components/home/OurPeople";
import OurSpecialized from "@/components/home/OurSpecialized";
import TheCoutrueMethod from "@/components/home/TheCoutrueMethod";
import Testimonial from "@/components/home/Testimonial";
import Partner from "@/components/home/Partner";
import ReadyToStartLearing from "@/components/home/ReadyToStartLearing";
import { CtaVisit } from "@/components/sections/CtaVisit";
import { getWpPageBySlug } from "@/lib/wordpress-queries";
import { generateWpMetadata } from "@/lib/wordpress-seo";
import { WPHomeFields } from "@/types/wordpress";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getWpPageBySlug<WPHomeFields>('home');
  return generateWpMetadata(page?.seo, {
    title: page?.title || 'Couture Beauty Academy | Houston, Texas',
    description: 'Chương trình đào tạo thẩm mỹ và chăm sóc da chuyên nghiệp chuẩn quốc tế tại Houston, Texas.',
    url: '/',
  });
}

export default async function HomePage() {
  const page = await getWpPageBySlug<WPHomeFields>('home');
  const scf = (page?.scf || page?.acf || {}) as any;

  // Xử lý counters cho OurImpact (3 thẻ trên Home)
  const impactCounters = scf.impact_counters && Array.isArray(scf.impact_counters)
    ? scf.impact_counters.map((c: any) => ({
        number: c.number || '',
        scriptText: c.script_text || '',
        label: c.label || '',
      }))
    : undefined;

  // Xử lý items cho OurSpecialized (4 items)
  const specItems = scf.spec_items && Array.isArray(scf.spec_items)
    ? scf.spec_items.map((item: any, idx: number) => ({
        number: `0${idx + 1}`,
        title: item.title,
        description: item.description,
      }))
    : undefined;

  return (
    <main>
      <HeroSection data={scf} />
      <WhoWeTeach data={scf} />
      <OurImpact
        eyebrow={scf.impact_eyebrow}
        title={scf.impact_title ? <span dangerouslySetInnerHTML={{ __html: scf.impact_title }} /> : undefined}
        description={scf.impact_desc}
        linkText={scf.impact_link_text}
        linkUrl={scf.impact_link_url}
        counters={impactCounters}
      />
      <OurPeople data={scf} />
      <OurSpecialized
        eyebrow={scf.spec_eyebrow}
        title={scf.spec_title ? <span dangerouslySetInnerHTML={{ __html: scf.spec_title }} /> : undefined}
        imageSrc={typeof scf.spec_image === 'string' ? scf.spec_image : scf.spec_image?.sourceUrl}
        items={specItems}
      />
      <TheCoutrueMethod data={scf} />
      <Testimonial
        eyebrow={scf.testi_eyebrow}
        title={scf.testi_title}
        items={scf.testi_list}
      />
      <Partner logos={scf.partner_logos} />
      <ReadyToStartLearing data={scf} />
      <CtaVisit />
    </main>
  );
}
