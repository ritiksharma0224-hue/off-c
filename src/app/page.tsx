import HeroSection from "@/components/HeroSection";
import DropIntro from "@/components/home/DropIntro";
import CategorySection from "@/components/home/CategorySection";
import FeaturedDesigns from "@/components/home/FeaturedDesigns";
import WhyKapdology from "@/components/home/WhyKapdology";
import LookbookSection from "@/components/home/LookbookSection";
import DesignProcess from "@/components/home/DesignProcess";
import BrandStorySection from "@/components/home/BrandStorySection";
import JaipurIndiaSection from "@/components/home/JaipurIndiaSection";
import CommunitySection from "@/components/home/CommunitySection";
import FinalShopCTA from "@/components/home/FinalShopCTA";

export default function Home() {
  return (
    <>
      {/* LOCKED APPROVED HERO (DO NOT REDESIGN) */}
      <HeroSection />

      {/* SECTION 1 — DROP 001 INTRODUCTION */}
      <DropIntro />

      {/* SECTION 2 — SHOP BY CATEGORY (5-6 GARMENT CATEGORIES) */}
      <CategorySection />

      {/* SECTION 3 — FEATURED DESIGNS */}
      <FeaturedDesigns />

      {/* SECTION 4 — WHY KAPDOLOGY */}
      <WhyKapdology />

      {/* SECTION 5 — LOOKBOOK / CAMPAIGN */}
      <LookbookSection />

      {/* SECTION 6 — FROM IDEA → GARMENT (DESIGN PROCESS) */}
      <DesignProcess />

      {/* SECTION 7 — WHAT IS KAPDOLOGY? (FOUNDER & BRAND STORY) */}
      <BrandStorySection />

      {/* SECTION 8 — JAIPUR → INDIA (ORIGIN & AMBITION) */}
      <JaipurIndiaSection />

      {/* SECTION 9 — COMMUNITY / WEAR THE CULTURE */}
      <CommunitySection />

      {/* SECTION 10 — FINAL SHOP CTA */}
      <FinalShopCTA />
    </>
  );
}
