import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/ui/accordion";

const faqs = [
  {
    question: "What areas do you deliver to?",
    answer:
      "We currently deliver across major areas in Lagos including Lekki, Victoria Island, Ikoyi, Surulere, Yaba, and Ikeja. We're expanding to other urban centers soon. Enter your address during signup to confirm coverage.",
  },
  {
    question: "How does the subscription work?",
    answer:
      "Choose your package, set up your account, and authorize monthly billing. We automatically charge your account before each delivery cycle. You can pause, modify, or cancel anytime from your dashboard.",
  },
  {
    question: "Can I customize my package contents?",
    answer:
      "Yes! Premium subscribers get full customization options. Standard and Essentials packages allow substitutions through our add-on system. You can also purchase extra items as one-time add-ons.",
  },
  {
    question: "What if I receive poor quality items?",
    answer:
      "Quality is our priority. If any item doesn't meet your expectations, report it through the app within 24 hours, and we'll either replace it in your next delivery or credit your account.",
  },
  {
    question: "Can I skip a delivery week?",
    answer:
      "Absolutely. You can pause deliveries for up to 4 weeks at a time through your dashboard. Your subscription resumes automatically after the pause period.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept bank transfers, card payments, and direct debit mandates through our secure payment partner. For corporate accounts, we offer invoice-based billing.",
  },
  {
    question: "Is there a minimum commitment period?",
    answer:
      "No lock-in contracts. You can cancel your subscription at any time. Cancellations take effect after your current billing cycle ends.",
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground">
            Everything you need to know about BukaFresh.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card rounded-xl px-6 shadow-soft border-none"
              >
                <AccordionTrigger className="text-left font-display font-semibold text-foreground hover:text-primary hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Still have questions?{" "}
            <a
              href="mailto:hello@bukafresh.ng"
              className="text-primary font-semibold hover:underline"
            >
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};
