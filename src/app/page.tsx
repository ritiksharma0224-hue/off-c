import HeroSection from "@/components/HeroSection";
import BrandSnapshot from "@/components/BrandSnapshot";
import CollectionGrid from "@/components/CollectionGrid";
import LookbookGrid from "@/components/LookbookGrid";
import WhyKapdology from "@/components/WhyKapdology";
import KapdologyConcierge from "@/components/KapdologyConcierge";
import InstagramFeed from "@/components/InstagramFeed";
import CTASection from "@/components/CTASection";

export default function Home() {
  return (
    <>
      {/* Section 1: Hero Campaign */}
      <HeroSection />

      {/* Section 2: Value Propositions & Brand Snapshot */}
      <BrandSnapshot />

      {/* Section 3: Collection Cards Grid */}
      <CollectionGrid />

      {/* Section 4: Lookbook Grid / Featured Products */}
      <LookbookGrid />

      {/* Section 5: Brand Manifesto / Statement */}
      <WhyKapdology />

      {/* Section 6: Online Concierge & Support */}
      <KapdologyConcierge />

      {/* Section 7: Social Proof Feed */}
      <InstagramFeed />

      {/* Section 8: Final Call to Action */}
      <CTASection />
    </>
  );
}
