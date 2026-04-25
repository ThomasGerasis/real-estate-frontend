import type { Metadata } from "next";
import HeroSearchSection from "@/components/HeroSearchSection";
import ApartmentTypes from "@/components/ApartmentTypes";
import ServicesCards from "@/components/ServicesCards";
import FeaturedProperties from "@/components/FeaturedProperties";
import ParallaxSection from "@/components/ParallaxSection";
import DistrictsSection from "@/components/DistrictsSection";
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
      <DistrictsSection />
      <FeaturedProperties />
      <ApartmentTypes />
      <ParallaxSection />
      <AboutSection />
      <ServicesCards />

      {/* <Testimonials />
      <BlogSection /> */}
    </>
  );
}
