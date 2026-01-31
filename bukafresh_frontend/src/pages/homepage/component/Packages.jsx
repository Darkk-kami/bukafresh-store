import { Check, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/ui/buttons";
import { cn } from "@/shared/utils/cn";

const packages = [
  {
    name: "Essentials",
    price: "55,000",
    period: "/month",
    description: "Perfect for singles and young couples starting out",
    features: [
      "Local rice, beans, garri, yam",
      "Fresh vegetables & fruits",
      "Frozen chicken & fish",
      "Basic oils & seasonings",
      "Saturday delivery",
    ],
    popular: false,
    variant: "outline",
  },
  {
    name: "Standard",
    price: "110,000",
    period: "/month",
    description: "Complete kit for families of 3-5 members",
    features: [
      "Everything in Essentials",
      "Premium proteins selection",
      "Imported dairy products",
      "Household essentials",
      "Flexible delivery days",
      "Priority support",
    ],
    popular: true,
    variant: "hero",
  },
  {
    name: "Premium",
    price: "250,000",
    period: "/month",
    description: "Curated gourmet selection for discerning households",
    features: [
      "Everything in Standard",
      "Imported gourmet items",
      "Specialty ingredients",
      "Wine & beverages",
      "Any-day delivery",
      "Dedicated concierge",
      "Custom substitutions",
    ],
    popular: false,
    variant: "premium",
  },
];

export const Packages = () => {
  const navigate = useNavigate();

  const handleGetStarted = (packageName) => {
    navigate(`/checkout?package=${packageName.toLowerCase()}`);
  };

  return (
    <section id="packages" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            Subscription Plans
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Choose Your Perfect Package
          </h2>
          <p className="text-muted-foreground">
            Flexible plans designed to match your household size and lifestyle.
            Weekly delivery options available at additional cost.
          </p>
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={cn(
                "relative rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2",
                pkg.popular
                  ? "bg-gradient-hero text-primary-foreground shadow-elevated"
                  : "bg-card border border-border shadow-soft hover:shadow-card",
              )}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 px-4 py-1 bg-accent rounded-full">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-semibold">Most Popular</span>
                </div>
              )}

              {/* Package Header */}
              <div className="mb-6">
                <h3
                  className={cn(
                    "text-2xl font-display font-bold mb-2",
                    pkg.popular ? "text-primary-foreground" : "text-foreground",
                  )}
                >
                  {pkg.name}
                </h3>
                <p
                  className={cn(
                    "text-sm",
                    pkg.popular
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground",
                  )}
                >
                  {pkg.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-sm opacity-70">₦</span>
                <span
                  className={cn(
                    "text-4xl font-display font-bold",
                    pkg.popular ? "text-primary-foreground" : "text-foreground",
                  )}
                >
                  {pkg.price}
                </span>
                <span
                  className={cn(
                    "text-sm",
                    pkg.popular
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground",
                  )}
                >
                  {pkg.period}
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div
                      className={cn(
                        "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                        pkg.popular
                          ? "bg-primary-foreground/20"
                          : "bg-primary/10",
                      )}
                    >
                      <Check
                        className={cn(
                          "w-3 h-3",
                          pkg.popular
                            ? "text-primary-foreground"
                            : "text-primary",
                        )}
                      />
                    </div>
                    <span
                      className={cn(
                        "text-sm",
                        pkg.popular
                          ? "text-primary-foreground/90"
                          : "text-foreground",
                      )}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                variant={pkg.popular ? "secondary" : pkg.variant}
                className={cn(
                  "w-full",
                  pkg.popular &&
                    "bg-primary-foreground text-primary hover:bg-primary-foreground/90",
                )}
                size="lg"
                onClick={() => handleGetStarted(pkg.name)}
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>

        {/* Corporate Note */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Need a custom solution for your business?{" "}
            <a
              href="#contact"
              className="text-primary font-semibold hover:underline"
            >
              Contact us for Corporate Plans
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};
