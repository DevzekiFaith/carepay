"use client";

import dynamic from 'next/dynamic';
import HeroSection from "./landing/HeroSection";

// Critically above-the-fold
const ServiceCategorySection = dynamic(() => import("./landing/ServiceCategorySection"));
const InteractiveMapSection = dynamic(() => import("./landing/InteractiveMapSection"));

// Below-the-fold / Heavy sections
const FeaturesSection = dynamic(() => import("./landing/FeaturesSection"));
const WalletEscrowSection = dynamic(() => import("./landing/WalletEscrowSection"));
const HowItWorksSection = dynamic(() => import("./landing/HowItWorksSection"));
const EducationalResourcesSection = dynamic(() => import("./landing/EducationalResourcesSection"));
const TestimonialsSection = dynamic(() => import("./landing/TestimonialsSection"));
const FAQSection = dynamic(() => import("./landing/FAQSection"));
const FooterSection = dynamic(() => import("./landing/FooterSection"));

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
