import { ArrowRight, Clock, Truck, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/buttons";
import heroImage from "@/assets/hero-groceries.jpg";

const features = [
  { icon: Clock, label: "Weekly Delivery" },
  { icon: Truck, label: "Free Delivery" },
  { icon: Shield, label: "Quality Guaranteed" },
];

export const Hero = () => {
  const navigate = useNavigate();

  const scrollToPackages = () => {
    document.getElementById("packages")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen pt-20 overflow-hidden bg-gradient-card">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">
                Now serving Lagos
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight">
              Fresh Groceries,{" "}
              <span className="text-gradient-hero">Delivered</span> to Your Door
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg">
              Say goodbye to grocery shopping stress. BukaFresh delivers curated
              packages of fresh produce, proteins, and pantry essentials
              directly to your doorstep every week.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                variant="hero"
                className="group"
                onClick={() => navigate("/checkout")}
              >
                Start Your Subscription
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" onClick={scrollToPackages}>
                View Packages
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 pt-4">
              {features.map((feature) => (
                <div key={feature.label} className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {feature.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div
            className="relative lg:order-last animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-hero opacity-20 blur-2xl rounded-3xl" />
              <img
                src={heroImage}
                alt="Fresh groceries from BukaFresh"
                className="relative w-full h-auto rounded-3xl shadow-elevated object-cover"
              />
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-2xl shadow-card animate-float">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                  <Truck className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Next Delivery
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Saturday, 9AM - 12PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs text-muted-foreground">Scroll to explore</span>
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
        </div>
      </div>
    </section>
  );
};
