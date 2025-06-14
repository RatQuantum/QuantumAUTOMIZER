import React, { useEffect, useRef } from 'react';
import { MessageSquare, Palette, Bot, Rocket } from 'lucide-react';

const Process = () => {
  const sectionRef = useRef(null);

  const steps = [
    {
      number: "1",
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Discovery Call",
      description: "We learn about your business, goals, and specific requirements in a 30-minute consultation.",
      timeline: "Day 1"
    },
    {
      number: "2",
      icon: <Palette className="w-8 h-8" />,
      title: "Design & Development",
      description: "Our team creates your custom website with your branding, content, and conversion optimization.",
      timeline: "Days 1-2"
    },
    {
      number: "3",
      icon: <Bot className="w-8 h-8" />,
      title: "AI Training & Integration",
      description: "We train your AI assistant on your business and integrate it seamlessly into your website.",
      timeline: "Days 2-3"
    },
    {
      number: "4",
      icon: <Rocket className="w-8 h-8" />,
      title: "Launch & Handover",
      description: "Your website goes live with full AI automation, plus training on how to manage everything.",
      timeline: "Day 3"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.process-card');
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
    <section id="process" className="py-32 bg-black text-white relative overflow-hidden" ref={sectionRef}>
      {/* Dramatic Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/98 to-black"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/3 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/2 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-8xl mx-auto px-8 relative z-10">
        {/* Dramatic Header */}
        <div className="text-center mb-24">
          <div className="w-1 h-20 bg-white mx-auto mb-8 opacity-80"></div>
          <h2 className="text-7xl md:text-8xl font-thin mb-8 tracking-tight text-white">
            How We Deliver in <span className="text-white/70 font-extralight">72 Hours</span>
          </h2>
          <p className="text-xl text-white/70 max-w-5xl mx-auto font-light leading-relaxed">
            Our proven 4-step process ensures you get a fully functional AI-powered website
            <br />
            in just 3 days, not 3 months.
          </p>
        </div>

        {/* Process Steps with Enhanced Styling */}
        <div className="relative mb-24">
          {/* Dramatic Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-y-1/2"></div>
          
          <div className="grid lg:grid-cols-4 gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative process-card opacity-0">
                {/* Floating Step Number */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 lg:relative lg:top-0 lg:left-0 lg:transform-none lg:mx-auto lg:mb-10 z-20">
                  <div className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center font-light text-2xl shadow-2xl shadow-black/50 transition-all duration-700 hover:scale-110 hover:shadow-white/20">
                    {step.number}
                  </div>
                </div>
                
                {/* Enhanced Step Content */}
                <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-10 pt-16 lg:pt-10 hover:border-white/30 hover:bg-black/80 transition-all duration-700 group transform hover:scale-105 hover:shadow-2xl hover:shadow-white/10 rounded-2xl">
                  <div className="bg-white w-16 h-16 flex items-center justify-center mb-8 mx-auto lg:mx-0 group-hover:bg-white/90 group-hover:shadow-2xl group-hover:shadow-white/20 transition-all duration-700 transform group-hover:scale-110 rounded-xl">
                    <div className="text-black">
                      {step.icon}
                    </div>
                  </div>
                  <div className="text-white/60 text-sm font-light mb-4 text-center lg:text-left tracking-[0.2em] uppercase">{step.timeline}</div>
                  <h3 className="text-2xl font-light mb-6 text-center lg:text-left text-white tracking-wide">{step.title}</h3>
                  <p className="text-white/70 leading-relaxed text-center lg:text-left font-light">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dramatic Guarantee Section */}
        <div className="text-center">
          <div className="bg-black/40 backdrop-blur-xl border border-white/20 p-16 max-w-6xl mx-auto shadow-2xl shadow-black/50 rounded-3xl relative overflow-hidden">
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                backgroundSize: '30px 30px'
              }}></div>
            </div>
            
            <div className="relative z-10">
              <div className="w-1 h-12 bg-white mx-auto mb-8 opacity-80"></div>
              <h3 className="text-4xl font-light mb-8 text-white tracking-wide">Our 72-Hour Guarantee</h3>
              <p className="text-xl text-white/80 font-light leading-relaxed max-w-4xl mx-auto">
                If we don't deliver your complete AI-powered website within 72 hours, 
                you get your money back. No questions asked.
              </p>
              
              {/* Dramatic CTA */}
              <div className="mt-12">
                <button className="bg-white text-black px-12 py-5 font-light text-lg hover:bg-white/90 transition-all duration-700 transform hover:scale-105 hover:shadow-2xl hover:shadow-white/30 focus:outline-none focus:ring-4 focus:ring-white/20 tracking-wide rounded-xl">
                  Start Your 72-Hour Journey
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;