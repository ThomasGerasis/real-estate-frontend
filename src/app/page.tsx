import type { Metadata } from "next";
import HeroSearchSection from "@/components/HeroSearchSection";
import ApartmentTypes from "@/components/ApartmentTypes";
import ServicesCards from "@/components/ServicesCards";
import FeaturedProperties from "@/components/FeaturedProperties";
import CitiesSection from "@/components/CitiesSection";
import AboutSection from "@/components/AboutSection";
import { Testimonials } from "@/components/Testimonials";
import BlogSection from "@/components/BlogSection";
import { settingService } from "@/lib/api";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await settingService.getAllSettings();
  return {
    title: settings.seo_meta_title || settings.site_name,
    description: settings.seo_meta_description,
    keywords: settings.seo_meta_keywords,
  };
}

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
