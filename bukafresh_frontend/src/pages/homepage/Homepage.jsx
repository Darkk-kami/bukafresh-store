import { Header } from "@/pages/homepage/component/Header";
import { Footer } from "@/pages/homepage/component/Footer";
import { Hero } from "@/pages/homepage/component/Hero";
import { HowItWorks } from "@/pages/homepage/component/HowItWorks";
import { Packages } from "@/pages/homepage/component/Packages";
import { Benefits } from "@/pages/homepage/component/Benefits";
import { Testimonials } from "@/pages/homepage/component/Testimonials";
import { FAQ } from "@/pages/homepage/component/FAQ";
import { CTA } from "@/pages/homepage/component/CTA";

const Homepage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Packages />
        <Benefits />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Homepage;
