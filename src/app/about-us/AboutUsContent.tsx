import AboutUsHeroSection from "@/components/about-us/HeroSection";
import PeopleSection from "@/components/about-us/PeopleSection";
import OurSpecialized, { SpecializedItem } from "@/components/home/OurSpecialized";
import Testimonial from "@/components/home/Testimonial";

const aboutSpecializedItems: SpecializedItem[] = [
    {
        number: "01",
        title: "Expert Instructors",
        description: "Learn directly from experienced beauty professionals.",
    },
    {
        number: "02",
        title: "Industry-Focused Curriculum",
        description: "Training designed around current techniques and professional standards.",
    },
    {
        number: "03",
        title: "Hands-On Training",
        description: "Develop real skills through practical learning and live-model experience.",
    },
    {
        number: "04",
        title: "Professional Certification",
        description: "Earn recognition upon successful course completion.",
    },
];

export default function AboutUsContent() {
    return (
        <>
            <AboutUsHeroSection />
            <PeopleSection />
            <OurSpecialized
                eyebrow="WHY CHOOSE US"
                title={
                    <>
                        More Than Training <br />
                        A Foundation for Your Career.
                    </>
                }
                imageSrc="/images/more-than-training-a-foundation-for-your-career.jpg"
                imageAlt="license-training"
                imageWidth={480}
                imageHeight={360}
                items={aboutSpecializedItems}
                className=""
            />
            <Testimonial />
        </>
    );
}