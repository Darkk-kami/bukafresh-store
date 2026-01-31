import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Adaobi Okonkwo',
    role: 'Busy Professional, Lagos',
    content: 'BukaFresh has been a game-changer for me. As a lawyer with crazy hours, I no longer have to worry about finding time to shop. The quality is consistent, and I love that I can budget my grocery expenses.',
    rating: 5,
    avatar: 'AO',
  },
  {
    name: 'Emeka & Nkechi Eze',
    role: 'Family of 5, Lekki',
    content: 'The Standard package is perfect for our family. The kids love the fruits, and we appreciate the variety of proteins. Saturday deliveries fit our schedule perfectly.',
    rating: 5,
    avatar: 'EE',
  },
  {
    name: 'TechHub Ventures',
    role: 'Corporate Client, Victoria Island',
    content: 'We switched our office pantry to BukaFresh\'s corporate plan. The custom invoicing and reliable restocks have simplified our operations significantly. Highly recommend for offices!',
    rating: 5,
    avatar: 'TV',
  },
];

export const Testimonials = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground">
            Join thousands of satisfied customers who've made BukaFresh their grocery partner.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="relative bg-card rounded-2xl p-8 shadow-soft hover:shadow-card transition-shadow"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 left-8">
                <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center">
                  <Quote className="w-5 h-5 text-primary-foreground" />
                </div>
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4 pt-2">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                ))}
              </div>

              {/* Content */}
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-foreground">
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
