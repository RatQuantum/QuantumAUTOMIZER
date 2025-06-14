import React, { useState, useEffect } from 'react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
      scrolled 
        ? 'bg-black/95 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/50' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-8xl mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4 group">
            <div className="w-10 h-10 bg-white flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 shadow-lg shadow-black/30">
              <span className="text-black font-bold text-xl">Q</span>
            </div>
            <span className="text-white font-light text-2xl tracking-wide transition-all duration-300 group-hover:tracking-wider">
              QuantumAutomize
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-12">
            {['Home', 'Features', 'Process', 'Pricing', 'What\'s Included', 'Results', 'Get Started'].map((item, index) => (
              <a 
                key={index}
                href={`#${item.toLowerCase().replace(/[^a-z0-9]/g, '')}`} 
                className="text-white/80 hover:text-white transition-all duration-500 font-light tracking-wide relative group"
              >
                {item}
                <span className="absolute -bottom-2 left-0 w-0 h-px bg-white transition-all duration-500 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* CTA Button */}
          <button className="bg-white text-black px-8 py-3 font-medium hover:bg-white/90 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-white/20 focus:outline-none focus:ring-4 focus:ring-white/20">
            🔥 Secure Your Slot
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;