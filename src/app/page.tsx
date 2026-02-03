import HeroSearchSection from "@/components/HeroSearchSection";
import ApartmentTypes from "@/components/ApartmentTypes";
import ServicesCards from "@/components/ServicesCards";
import FeaturedProperties from "@/components/FeaturedProperties";
import CitiesSection from "@/components/CitiesSection";
import AboutSection from "@/components/AboutSection";
import { Testimonials } from "@/components/Testimonials";
import BlogSection from "@/components/BlogSection";

export default function Home() {
  return (
    <>
      <HeroSearchSection />
      <CitiesSection />
      <FeaturedProperties />
      <ApartmentTypes />
      <AboutSection />
      <ServicesCards />
      {/* <Testimonials />
      <BlogSection /> */}
    </>
  );
}
