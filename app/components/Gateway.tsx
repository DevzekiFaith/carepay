"use client";

import HeroSection from "./landing/HeroSection";
import ServiceCategorySection from "./landing/ServiceCategorySection";
import InteractiveMapSection from "./landing/InteractiveMapSection";
import FeaturesSection from "./landing/FeaturesSection";
import WalletEscrowSection from "./landing/WalletEscrowSection";
import HowItWorksSection from "./landing/HowItWorksSection";
import EducationalResourcesSection from "./landing/EducationalResourcesSection";
import TestimonialsSection from "./landing/TestimonialsSection";
import FAQSection from "./landing/FAQSection";
import FooterSection from "./landing/FooterSection";

export default function Gateway() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-all duration-300 antialiased overflow-x-hidden selection:bg-brand-primary/30 selection:text-white">
      <HeroSection />
      <ServiceCategorySection />
      <InteractiveMapSection />
      <FeaturesSection />
      <WalletEscrowSection />
      <HowItWorksSection />
      <EducationalResourcesSection />
      <TestimonialsSection />
      <FAQSection />
      <FooterSection />
    </div>
  );
}
