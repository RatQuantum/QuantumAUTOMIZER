import React from 'react';
import { Twitter, Linkedin, Github, Mail, ArrowUp } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white border-t border-white/10 relative overflow-hidden">
      {/* Subtle Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/2 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-8xl mx-auto px-8 py-20 relative z-10">
        <div className="grid lg:grid-cols-4 gap-16">
          {/* Enhanced Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-4 mb-8 group">
              <div className="w-10 h-10 bg-white flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 shadow-lg shadow-black/30 rounded-sm">
                <span className="text-black font-bold text-xl">Q</span>
              </div>
              <span className="text-white font-light text-2xl tracking-wide transition-all duration-300 group-hover:tracking-wider">QuantumAutomize</span>
            </div>
            <p className="text-white/70 mb-10 leading-relaxed font-light">
              QuantumAutomize helps businesses leverage cutting-edge AI technology to automate processes, enhance productivity, and drive innovation.
            </p>
            
            {/* Enhanced Social Links */}
            <div className="flex space-x-4">
              {[Twitter, Linkedin, Github, Mail].map((Icon, index) => (
                <a 
                  key={index}
                  href="#" 
                  className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center hover:border-white/50 hover:bg-white/5 transition-all duration-500 transform hover:scale-110 hover:shadow-lg hover:shadow-white/10 backdrop-blur-sm"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Enhanced Navigation Sections */}
          {[
            {
              title: 'Company',
              links: ['About Us', 'Careers', 'Our Team', 'News']
            },
            {
              title: 'Services',
              links: ['Web Automation', 'Conversational AI', 'Machine Learning', 'Mobile Automation']
            },
            {
              title: 'Resources',
              links: ['Blog', 'Documentation', 'Case Studies', 'Webinars']
            }
          ].map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="text-lg font-light mb-8 text-white tracking-wide">{section.title}</h3>
              <ul className="space-y-5">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href="#" 
                      className="text-white/70 hover:text-white transition-all duration-300 font-light tracking-wide relative group"
                    >
                      {link}
                      <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Legal Section */}
          <div className="lg:col-start-4 lg:row-start-1 lg:row-span-1">
            <h3 className="text-lg font-light mb-8 text-white tracking-wide">Legal</h3>
            <ul className="space-y-5">
              {['Privacy Policy', 'Terms of Service', 'Cookies'].map((item, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-white/70 hover:text-white transition-all duration-300 font-light tracking-wide relative group"
                  >
                    {item}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Enhanced Bottom Bar */}
        <div className="border-t border-white/10 mt-20 pt-10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm font-light tracking-wide">© 2025 QuantumAutomize. All rights reserved.</p>
          
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="mt-6 md:mt-0 flex items-center space-x-3 text-white/70 hover:text-white transition-all duration-500 group"
          >
            <span className="text-sm font-light tracking-wide">Back to top</span>
            <div className="w-8 h-8 border border-white/30 rounded-full flex items-center justify-center group-hover:border-white group-hover:bg-white/5 transition-all duration-500 transform group-hover:scale-110">
              <ArrowUp className="w-4 h-4" />
            </div>
          </button>
        </div>

        {/* Signature Elements */}
        <div className="text-center mt-16">
          <div className="flex justify-center items-center space-x-8 text-white/30 text-xs font-light tracking-[0.3em]">
            <span>CRAFTED</span>
            <div className="w-1 h-1 bg-white/30 rounded-full"></div>
            <span>WITH</span>
            <div className="w-1 h-1 bg-white/30 rounded-full"></div>
            <span>PRECISION</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;