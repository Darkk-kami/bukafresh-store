import { UserPlus, Package, CreditCard, Truck } from 'lucide-react';

const steps = [
  {
    icon: Package,
    step: '01',
    title: 'Choose Your Package',
    description: 'Select from our curated packages designed for singles, families, or corporate needs.',
  },
  {
    icon: UserPlus,
    step: '02',
    title: 'Create Account',
    description: 'Quick and easy signup with your delivery address and preferences.',
  },
  {
    icon: CreditCard,
    step: '03',
    title: 'Set Up Subscription',
    description: "Secure automated billing that charges only when you're ready for delivery.",
  },
  {
    icon: Truck,
    step: '04',
    title: 'Receive Deliveries',
    description: 'Fresh groceries arrive at your doorstep on your chosen delivery day.',
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            How BukaFresh Works
          </h2>
          <p className="text-muted-foreground">
            Get started in minutes and enjoy hassle-free grocery deliveries every week.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.step}
              className="relative group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-border -translate-x-4">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary" />
                </div>
              )}

              <div className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-card transition-shadow h-full">
                {/* Step Number */}
                <span className="text-5xl font-display font-bold text-muted-foreground/30">
                  {step.step}
                </span>

                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-hero flex items-center justify-center mt-4 mb-6 group-hover:scale-110 transition-transform">
                  <step.icon className="w-7 h-7 text-primary-foreground" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
