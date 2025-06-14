import React from 'react';
import { Zap, Clock, Shield, TrendingUp, Bot, Globe } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: "72-Hour Delivery",
      description: "From consultation to launch in just 3 days. No waiting months for your website."
    },
    {
      icon: <Bot className="w-8 h-8" />,
      title: "AI-Powered Automation",
      description: "Intelligent chatbot handles customer inquiries, bookings, and support automatically."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Mobile-First Design",
      description: "Responsive, professional design that converts visitors on any device."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Conversion Optimized",
      description: "Every element designed to turn visitors into leads and leads into customers."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Lead Capture",
      description: "Automated lead generation system captures and nurtures prospects 24/7."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Enterprise Security",
      description: "Bank-level security, reliable hosting, and guaranteed uptime included."
    }
  ];

  return (
    <section id="features" className="py-32 bg-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-8xl mx-auto px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-24">
          <div className="w-1 h-16 bg-white mx-auto mb-8"></div>
          <h2 className="text-6xl md:text-7xl font-thin mb-8 tracking-tight">
            Why Choose Our <span className="text-white/70">72-Hour</span> Service
          </h2>
          <p className="text-xl text-white/70 max-w-5xl mx-auto font-light leading-relaxed">
            While others take months to deliver basic websites, we provide complete AI-powered
            <br />
            business automation in just 72 hours.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="border border-white/10 bg-black/50 backdrop-blur-xl p-10 hover:border-white/30 hover:bg-black/70 transition-all duration-700 group transform hover:scale-105 hover:shadow-2xl hover:shadow-white/10"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-white w-16 h-16 flex items-center justify-center mb-8 group-hover:bg-white/90 group-hover:shadow-2xl group-hover:shadow-white/20 transition-all duration-700 transform group-hover:scale-110">
                <div className="text-black">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-light mb-6 text-white tracking-wide">{feature.title}</h3>
              <p className="text-white/70 leading-relaxed font-light">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Comparison Section */}
        <div className="border border-white/20 bg-black/40 backdrop-blur-xl p-16 shadow-2xl shadow-black/50">
          <h3 className="text-4xl font-light text-center mb-16 tracking-wide">Traditional Web Development vs. Our 72-Hour Service</h3>
          
          <div className="grid md:grid-cols-2 gap-16">
            {/* Traditional */}
            <div className="space-y-8">
              <h4 className="text-2xl font-light mb-8 text-white/60 tracking-wide">Traditional Approach</h4>
              <ul className="space-y-6">
                {[
                  '3-6 months development time',
                  'Separate costs for design, development, AI',
                  'No automation included',
                  'Limited ongoing support'
                ].map((item, index) => (
                  <li key={index} className="flex items-start space-x-4">
                    <span className="text-white/30 mt-1 text-xl">✗</span>
                    <span className="text-white/60 font-light tracking-wide">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Our Service */}
            <div className="space-y-8">
              <h4 className="text-2xl font-light mb-8 text-white tracking-wide">Our 72-Hour Service</h4>
              <ul className="space-y-6">
                {[
                  'Complete delivery in 72 hours',
                  'All-inclusive package pricing',
                  'AI automation built-in',
                  '30 days priority support included'
                ].map((item, index) => (
                  <li key={index} className="flex items-start space-x-4">
                    <span className="text-white mt-1 text-xl">✓</span>
                    <span className="text-white/90 font-light tracking-wide">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;