import React, { useEffect, useRef } from 'react';
import { Star, Clock, TrendingUp, Users } from 'lucide-react';

const Testimonials = () => {
  const sectionRef = useRef(null);

  const results = [
    {
      metric: "300%",
      description: "Average increase in lead generation",
      icon: <TrendingUp className="w-6 h-6" />
    },
    {
      metric: "24/7",
      description: "Customer support without hiring staff",
      icon: <Clock className="w-6 h-6" />
    },
    {
      metric: "85%",
      description: "Reduction in manual customer inquiries",
      icon: <Users className="w-6 h-6" />
    }
  ];
  
  const testimonials = [
    {
      rating: 5,
      text: "I was skeptical about the 72-hour promise, but they delivered exactly on time. My new website with AI assistant has already booked 12 new clients in the first week!",
      author: "Sarah Mitchell",
      position: "Business Coach",
      result: "12 new clients in week 1"
    },
    {
      rating: 5,
      text: "The AI handles 90% of my customer questions automatically. I'm finally free to focus on growing my business instead of answering the same questions all day.",
      author: "David Chen",
      position: "Course Creator",
      result: "90% automated support"
    },
    {
      rating: 5,
      text: "Best investment I've made for my consulting business. The AI books meetings while I sleep, and I wake up to a full calendar. It's like having a 24/7 sales assistant.",
      author: "Maria Rodriguez",
      position: "Marketing Consultant",
      result: "Full calendar on autopilot"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.testimonial-card');
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('animate-fade-in-up');
              }, index * 200);
            });
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="testimonials" className="py-32 bg-black text-white relative overflow-hidden" ref={sectionRef}>
      {/* Dramatic Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-white/2 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-white/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-8xl mx-auto px-8 relative z-10">
        {/* Dramatic Header */}
        <div className="text-center mb-24">
          <div className="w-1 h-20 bg-white mx-auto mb-8 opacity-80"></div>
          <h2 className="text-7xl md:text-8xl font-thin mb-8 tracking-tight text-white">
            Real Results in <span className="text-white/70 font-extralight">72 Hours</span>
          </h2>
          <p className="text-xl text-white/70 max-w-5xl mx-auto font-light leading-relaxed">
            See what our clients achieved immediately after launching their AI-powered websites.
          </p>
        </div>

        {/* Enhanced Results Metrics */}
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {results.map((result, index) => (
            <div 
              key={index} 
              className="text-center bg-black/60 backdrop-blur-xl border border-white/10 p-10 hover:border-white/30 hover:bg-black/80 transition-all duration-700 transform hover:scale-105 hover:shadow-2xl hover:shadow-white/10 rounded-2xl group"
            >
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-white/90 group-hover:shadow-2xl group-hover:shadow-white/20 transition-all duration-700 transform group-hover:scale-110">
                <div className="text-black">
                  {result.icon}
                </div>
              </div>
              <div className="text-5xl font-thin text-white mb-4 group-hover:text-white/90 transition-colors duration-500">{result.metric}</div>
              <p className="text-white/70 font-light">{result.description}</p>
            </div>
          ))}
        </div>

        {/* Enhanced Testimonials */}
        <div className="grid lg:grid-cols-3 gap-8 mb-24">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="testimonial-card opacity-0 bg-black/60 backdrop-blur-xl border border-white/10 p-10 hover:border-white/30 hover:bg-black/80 transition-all duration-700 transform hover:scale-105 hover:shadow-2xl hover:shadow-white/10 rounded-2xl"
            >
              {/* Enhanced Rating */}
              <div className="flex items-center space-x-1 mb-8">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current text-white hover:scale-110 transition-transform duration-300" />
                ))}
              </div>

              {/* Enhanced Result Badge */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3 mb-8 inline-block rounded-full">
                <span className="text-white font-light text-sm tracking-wide">{testimonial.result}</span>
              </div>

              {/* Testimonial Text */}
              <p className="text-white/80 leading-relaxed mb-10 font-light">
                "{testimonial.text}"
              </p>

              {/* Enhanced Author */}
              <div className="border-t border-white/20 pt-8">
                <div className="font-light text-white text-lg tracking-wide">{testimonial.author}</div>
                <div className="text-white/60 text-sm font-light tracking-wide">{testimonial.position}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Dramatic Final CTA */}
        <div className="text-center">
          <div className="bg-black/40 backdrop-blur-xl border border-white/20 p-16 max-w-6xl mx-auto shadow-2xl shadow-black/50 rounded-3xl relative overflow-hidden">
            {/* Floating Elements */}
            <div className="absolute top-8 left-8 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
            <div className="absolute top-16 right-12 w-1 h-1 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-8 right-8 w-2 h-2 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
            
            <div className="relative z-10">
              <div className="w-1 h-12 bg-white mx-auto mb-8 opacity-80"></div>
              <h3 className="text-4xl font-light mb-8 text-white tracking-wide">Join These Success Stories</h3>
              <p className="text-xl text-white/70 mb-12 font-light leading-relaxed">
                Don't wait months for results. Start automating your business in 72 hours.
              </p>
              <button className="bg-white text-black px-16 py-6 font-light text-xl hover:bg-white/90 transition-all duration-700 transform hover:scale-110 hover:shadow-2xl hover:shadow-white/30 focus:outline-none focus:ring-4 focus:ring-white/20 mb-6 tracking-wide rounded-xl">
                🔥 Secure Your 72-Hour Build Slot
              </button>
              <p className="text-white/60 text-lg font-light tracking-wide">[Only 10 Spots Available This Month]</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;