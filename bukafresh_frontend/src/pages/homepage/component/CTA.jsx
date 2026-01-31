import { ArrowRight } from "lucide-react";
import { Button } from "@/shared/ui/buttons";
export const CTA = () => {
  return (
    <section className="py-24 bg-gradient-hero relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-20 w-64 h-64 bg-primary-foreground rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-primary-foreground rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary-foreground mb-6">
            Ready to Transform Your Grocery Experience?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Join thousands of Nigerians who've said goodbye to market stress.
            Start your subscription today and get your first delivery this
            Saturday.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="xl"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-elevated group"
            >
              Start Your Subscription
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="xl"
              variant="outline"
              className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
            >
              View All Packages
            </Button>
          </div>

          {/* Trust Elements */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-primary-foreground/70">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary-foreground" />
              <span className="text-sm">No lock-in contracts</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary-foreground" />
              <span className="text-sm">Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary-foreground" />
              <span className="text-sm">Quality guaranteed</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
