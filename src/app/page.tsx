import { PublicNavbar } from "@/components/public/navbar";
import { Hero } from "@/components/public/hero";
import { Features } from "@/components/public/features";
import { HowItWorks } from "@/components/public/how-it-works";
import { CSSubjectsSection } from "@/components/public/cs-subjects";
import { AIInterviewDemo } from "@/components/public/ai-interview-demo";
import { EnglishPracticeDemo } from "@/components/public/english-practice-demo";
import { Pricing } from "@/components/public/pricing";
import { FAQ } from "@/components/public/faq";
import { PublicFooter } from "@/components/public/footer";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicNavbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <CSSubjectsSection />
        <AIInterviewDemo />
        <EnglishPracticeDemo />
        <Pricing />
        <FAQ />
      </main>
      <PublicFooter />
    </div>
  );
}
