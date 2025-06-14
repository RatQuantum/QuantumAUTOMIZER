import React from 'react';
import { Globe, Bot, Zap, Headphones, Calendar, Shield } from 'lucide-react';

const Services = () => {
  const included = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Custom-Designed Website",
      description: "Mobile-responsive, professional design tailored to your brand and optimized for conversions."
    },
    {
      icon: <Bot className="w-8 h-8" />,
      title: "AI Assistant Integration",
      description: "Intelligent chatbot trained on your business, products, and services to handle customer inquiries 24/7."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lead Capture Automation",
      description: "Automated lead generation system that captures visitor information and nurtures prospects."
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Booking Automation",
      description: "Seamless appointment scheduling system that works around the clock without your involvement."
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: "30 Days Priority Support",
      description: "Dedicated support team to ensure your website and AI assistant perform flawlessly."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Security & Performance",
      description: "Enterprise-grade security, fast loading speeds, and reliable hosting included."
    }
  ];

  return (
    <section id="services" className="py-32 bg-black text-white relative overflow-hidden">
      {/* Dramatic Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/98 to-black"></div>
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-white/2 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-white/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="max-w-8xl mx-auto px-8 relative z-10">
        {/* Dramatic Header */}
        <div className="text-center mb-24">
          <div className="w-1 h-20 bg-white mx-auto mb-8 opacity-80"></div>
          <h2 className="text-7xl md:text-8xl font-thin mb-8 tracking-tight text-white">
            Your Investment <span className="text-white/70 font-extralight">Includes</span>
          </h2>
          <p className="text-xl text-white/70 max-w-5xl mx-auto font-light leading-relaxed">
            Everything you need to transform your business with AI automation,
            <br />
            delivered in just 72 hours.
          </p>
        </div>

        {/* Services Grid with Enhanced Styling */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {included.map((service, index) => (
            <div 
              key={index} 
              className="bg-black/60 backdrop-blur-xl border border-white/10 p-10 hover:border-white/30 hover:bg-black/80 transition-all duration-700 group transform hover:scale-105 hover:shadow-2xl hover:shadow-white/10 rounded-2xl"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="bg-white w-16 h-16 flex items-center justify-center mb-8 group-hover:bg-white/90 group-hover:shadow-2xl group-hover:shadow-white/20 transition-all duration-700 transform group-hover:scale-110 rounded-xl">
                <div className="text-black">
                  {service.icon}
                </div>
              </div>
              <h3 className="text-xl font-light mb-6 text-white tracking-wide">{service.title}</h3>
              <p className="text-white/70 leading-relaxed font-light">{service.description}</p>
            </div>
          ))}
        </div>

        {/* Enhanced Value Proposition */}
        <div className="text-center bg-black/40 backdrop-blur-xl border border-white/20 p-16 mb-24 shadow-2xl shadow-black/50 rounded-3xl relative overflow-hidden">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}></div>
          </div>
          
          <div className="relative z-10">
            <div className="w-1 h-12 bg-white mx-auto mb-8 opacity-80"></div>
            <h3 className="text-4xl font-light mb-8 text-white tracking-wide">Complete AI-Powered Business Solution</h3>
            <p className="text-xl text-white/70 mb-12 max-w-5xl mx-auto font-light leading-relaxed">
              While others charge separately for design, development, AI integration, and support, 
              we deliver everything as one comprehensive package in just 72 hours.
            </p>
            <div className="grid md:grid-cols-3 gap-12 text-center">
              {[
                { number: '72', label: 'Hours to Launch' },
                { number: '24/7', label: 'AI Assistant' },
                { number: '30', label: 'Days Support' }
              ].map((stat, index) => (
                <div key={index} className="group">
                  <div className="text-6xl font-thin text-white mb-4 group-hover:text-white/90 transition-colors duration-500">{stat.number}</div>
                  <div className="text-white/70 font-light tracking-wide">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dramatic CTA Section */}
        <div className="text-center">
          <div className="bg-black/60 backdrop-blur-xl border border-white/20 p-16 max-w-6xl mx-auto shadow-2xl shadow-black/50 rounded-3xl relative overflow-hidden">
            {/* Floating Elements */}
            <div className="absolute top-8 left-8 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
            <div className="absolute bottom-8 right-8 w-2 h-2 bg-white/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            <div className="relative z-10">
              <div className="w-1 h-12 bg-white mx-auto mb-8 opacity-80"></div>
              <h3 className="text-4xl font-light mb-6 text-white tracking-wide">Ready to Automate Your Success?</h3>
              <p className="text-xl text-white/70 mb-12 font-light leading-relaxed">
                Join the businesses already using AI to work smarter, not harder.
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

export default Services;