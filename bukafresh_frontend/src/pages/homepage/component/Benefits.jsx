import {
  Clock,
  Leaf,
  BadgeCheck,
  Repeat,
  HeartHandshake,
  Wallet,
} from "lucide-react";

const benefits = [
  {
    icon: Clock,
    title: "Save Time",
    description:
      "No more weekly trips to the market. We handle the shopping so you can focus on what matters.",
  },
  {
    icon: Leaf,
    title: "Always Fresh",
    description:
      "Our dark store model ensures produce goes from source to your door in the shortest time possible.",
  },
  {
    icon: BadgeCheck,
    title: "Quality Guaranteed",
    description:
      "Every item is quality-checked before delivery. Not satisfied? We'll make it right.",
  },
  {
    icon: Repeat,
    title: "Flexible Plans",
    description:
      "Pause, modify, or cancel your subscription anytime. No lock-in contracts.",
  },
  {
    icon: HeartHandshake,
    title: "Supporting Local",
    description:
      "We partner with local farmers and suppliers to bring you the best Nigerian produce.",
  },
  {
    icon: Wallet,
    title: "Budget Friendly",
    description:
      "Fixed monthly costs help you plan better. No surprise price hikes at the market.",
  },
];

const Benefits = () => {
  return (
    <section id="benefits" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            The BukaFresh Advantage
          </h2>
          <p className="text-muted-foreground">
            We've reimagined grocery shopping for the modern Nigerian lifestyle.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className="group p-8 bg-card rounded-2xl shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-hero flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 text-primary-foreground" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export { Benefits };
