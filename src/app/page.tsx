import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedProperties from "@/components/FeaturedProperties";
import BlogSection from "@/components/BlogSection";
import { Testimonials } from "@/components/Testimonials";
import { Faq } from "@/components/Faq";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <FeaturedProperties />
      <Testimonials />
      <BlogSection />
      <Faq />
    </>
  );
}
