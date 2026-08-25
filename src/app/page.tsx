import HeroSection from "@/components/home/HeroSection";
import WhoWeTeach from "@/components/home/WhoWeTeach";
import OurImpact from "@/components/home/OurImpact";
import OurPeople from "@/components/home/OurPeople";
import OurSpecialized from "@/components/home/OurSpecialized";
import TheCoutrueMethod from "@/components/home/TheCoutrueMethod";
import Testimonial from "@/components/home/Testimonial";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <WhoWeTeach />
      <OurImpact />
      <OurPeople />
      <OurSpecialized />
      <TheCoutrueMethod />
      <Testimonial />
    </main>
  );
}
