import AboutUsHeroSection from "@/components/about-us/HeroSection";
import PeopleSection from "@/components/about-us/PeopleSection";
import OurSpecialized, { SpecializedItem } from "@/components/home/OurSpecialized";
import Testimonial from "@/components/home/Testimonial";
import { WPAboutFields } from "@/types/wordpress";

interface AboutUsContentProps {
    data?: Partial<WPAboutFields>;
}

export default function AboutUsContent({ data }: AboutUsContentProps = {}) {
    const specItems: SpecializedItem[] = (data?.about_spec_items && data.about_spec_items.length > 0)
        ? data.about_spec_items.map((item, idx) => ({
            number: `0${idx + 1}`,
            title: item.title,
            description: item.description,
        }))
        : [];

    const specImage = typeof data?.about_spec_image === 'string'
        ? data.about_spec_image
        : (data?.about_spec_image?.sourceUrl || "/images/more-than-training-a-foundation-for-your-career.jpg");

    return (
        <>
            <AboutUsHeroSection data={data} />
            <PeopleSection data={data} />
            {specItems.length > 0 && (
                <OurSpecialized
                    eyebrow={data?.about_spec_eyebrow || "WHY CHOOSE US"}
                    title={data?.about_spec_title ? (
                        <span dangerouslySetInnerHTML={{ __html: data.about_spec_title }} />
                    ) : (
                        <>
                            More Than Training <br />
                            A Foundation for Your Career.
                        </>
                    )}
                    imageSrc={specImage}
                    imageAlt="license-training"
                    imageWidth={480}
                    imageHeight={360}
                    items={specItems}
                    className=""
                />
            )}
            <Testimonial
                eyebrow={data?.testi_eyebrow}
                title={data?.testi_title}
                items={data?.testi_list}
            />
        </>
    );
}