import React, { useEffect, useState } from 'react';
import { Clock, Zap, Users, Calendar } from 'lucide-react';

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section id="home" className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0">
        {/* Animated Grid */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
            transform: `translate(${mousePosition.x * 0.01}px, ${mousePosition.y * 0.01}px)`
          }}
        ></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-20 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-8 text-center relative z-10">
        {/* Animated Badge */}
        <div className="inline-flex items-center space-x-3 border border-white/20 bg-black/50 backdrop-blur-xl px-6 py-4 mb-12 transform hover:scale-105 transition-all duration-700 shadow-2xl shadow-black/50">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          <span className="text-white/90 text-sm font-light tracking-[0.2em] uppercase">72-Hour Execution Guarantee</span>
        </div>

        {/* Main Headline with Staggered Animation */}
        <div className="mb-12">
          <h1 className="text-6xl md:text-8xl font-thin mb-8 leading-tight tracking-tight">
            <span className="block animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Automate Your Success:
            </span>
            <span className="block text-white animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              Custom Website +
            </span>
            <span className="block text-white/80 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              AI Assistant
            </span>
            <span className="block text-white animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
              Built in 72 Hours
            </span>
          </h1>
        </div>

        {/* Enhanced Subheadline */}
        <div className="text-xl text-white/70 mb-16 max-w-6xl mx-auto leading-relaxed font-light">
          <p className="mb-8 animate-fade-in-up" style={{ animationDelay: '1s' }}>
            Stop losing leads and wasting time on repetitive tasks. Get a professionally designed website with built-in AI that:
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 text-left max-w-5xl mx-auto mb-12">
            {[
              'Converts visitors into paying customers 24/7',
              'Instantly answers customer questions',
              'Handles support queries automatically',
              'Schedules meetings while you sleep'
            ].map((item, index) => (
              <div 
                key={index}
                className="flex items-center space-x-4 animate-fade-in-up"
                style={{ animationDelay: `${1.2 + index * 0.1}s` }}
              >
                <div className="w-2 h-2 bg-white rounded-full shadow-lg shadow-white/50"></div>
                <span className="tracking-wide">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Perfect For Section */}
        <div className="mb-16 animate-fade-in-up" style={{ animationDelay: '1.8s' }}>
          <h3 className="text-2xl font-light mb-8 text-white tracking-wide">Perfect for:</h3>
          <div className="flex flex-wrap justify-center gap-8 text-lg">
            {[
              'Small Business Owners',
              'Coaches & Consultants', 
              'Digital Creators & Course Sellers'
            ].map((item, index) => (
              <div 
                key={index}
                className="flex items-center space-x-3 bg-black/30 backdrop-blur-xl px-6 py-3 border border-white/10 hover:border-white/30 transition-all duration-500 transform hover:scale-105"
              >
                <span className="text-white">✓</span>
                <span className="text-white/90 font-light tracking-wide">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Urgency Section with Enhanced Styling */}
        <div className="border border-white/20 bg-black/40 backdrop-blur-xl p-12 mb-16 max-w-6xl mx-auto shadow-2xl shadow-black/50 animate-fade-in-up" style={{ animationDelay: '2s' }}>
          <h3 className="text-3xl font-light mb-10 text-white tracking-wide">Why Act Now:</h3>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            {[
              { icon: Clock, text: 'Limited-time 72-hour execution guarantee' },
              { icon: Users, text: 'Only 10 build slots available this month' },
              { icon: Zap, text: 'Get ahead of competitors with cutting-edge AI' },
              { icon: Calendar, text: 'Start automating your business immediately' }
            ].map((item, index) => (
              <div 
                key={index}
                className="flex items-start space-x-4 group hover:bg-white/5 p-4 transition-all duration-500 transform hover:scale-105"
              >
                <item.icon className="w-6 h-6 text-white/80 mt-1 flex-shrink-0 group-hover:text-white transition-colors duration-300" />
                <span className="text-white/70 font-light leading-relaxed tracking-wide group-hover:text-white/90 transition-colors duration-300">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced CTA Buttons */}
        <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '2.2s' }}>
          <button className="bg-white text-black px-16 py-6 font-medium text-xl hover:bg-white/90 transition-all duration-700 transform hover:scale-110 hover:shadow-2xl hover:shadow-white/30 focus:outline-none focus:ring-4 focus:ring-white/20 mb-6 tracking-wide">
            <span>🔥 Secure Your 72-Hour Build Slot</span>
          </button>
          <p className="text-white/60 mt-6 text-lg font-light tracking-wide">[Only 10 Spots Available]</p>
        </div>

        {/* Secondary CTA */}
        <button className="border border-white/30 text-white/90 px-10 py-5 font-light hover:border-white hover:bg-white/5 transition-all duration-700 transform hover:scale-105 backdrop-blur-xl tracking-wide animate-fade-in-up" style={{ animationDelay: '2.4s' }}>
          See What's Included
        </button>
      </div>

      {/* Subtle Vignette Effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/30 pointer-events-none"></div>
    </section>
  );
};

export default Hero;