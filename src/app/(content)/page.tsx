
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, Users } from "lucide-react";
import { HeroSection } from "@/components/content/home/hero-section";
import BlogsSection from "@/components/content/home/blogs-section";
import MagazineLayout from "@/components/content/home/magazine-layout";
import { CTASection } from "@/components/content/cta-section";
import StorySlideshow from "@/components/content/story-slideshow";

export default async function Home() {
  return (
    <div className="min-h-screen mt-12">
      {/* Latest Stories Hero Section */}
      <HeroSection />
      <BlogsSection title="Weekly Reads" />
      <MagazineLayout title="Podcasts" />
      <StorySlideshow title="Featured UAV Analysis" />
      <BlogsSection title="The IPO train" />
      <MagazineLayout title="Listed Companies" />
      <CTASection />
    </div>
  );
}
