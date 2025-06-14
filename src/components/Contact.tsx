import React from 'react';
import { Mail, Phone, Clock, Users, Zap } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="py-32 bg-black text-white relative overflow-hidden">
      {/* Dramatic Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/98 to-black"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/2 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="max-w-8xl mx-auto px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20">
          {/* Left Column - Enhanced */}
          <div>
            <div className="w-1 h-16 bg-white mb-8 opacity-80"></div>
            <h2 className="text-6xl md:text-7xl font-thin mb-8 tracking-tight text-white">
              Secure Your
              <br />
              <span className="text-white/70 font-extralight">
                72-Hour Build Slot
              </span>
            </h2>
            
            <p className="text-xl text-white/70 mb-16 leading-relaxed font-light">
              Only 10 build slots available this month. Don't miss your
              <br />
              chance to automate your business in just 72 hours.
            </p>

            {/* Enhanced Urgency Indicators */}
            <div className="space-y-8 mb-16">
              {[
                { icon: Clock, title: '72-Hour Guarantee', desc: 'Your website launches in 3 days or money back' },
                { icon: Users, title: 'Limited Availability', desc: 'Only 10 build slots remaining this month' },
                { icon: Zap, title: 'Immediate Results', desc: 'Start automating your business this week' }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-6 group hover:bg-white/5 p-4 transition-all duration-500 transform hover:scale-105 rounded-xl">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center group-hover:bg-white/90 group-hover:shadow-2xl group-hover:shadow-white/20 transition-all duration-500 transform group-hover:scale-110">
                    <item.icon className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <div className="text-white font-light text-lg tracking-wide">{item.title}</div>
                    <div className="text-white/60 text-sm font-light">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Contact Info */}
            <div className="space-y-8 mb-16">
              {[
                { icon: Mail, label: 'Email', value: 'rat@quantumautomize.com' },
                { icon: Phone, label: 'Phone', value: '+91 6383169392' }
              ].map((contact, index) => (
                <div key={index} className="flex items-center space-x-6 group hover:bg-white/5 p-4 transition-all duration-500 transform hover:scale-105 rounded-xl">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center group-hover:bg-white/90 group-hover:shadow-2xl group-hover:shadow-white/20 transition-all duration-500 transform group-hover:scale-110">
                    <contact.icon className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <div className="text-white/60 text-sm font-light tracking-wide">{contact.label}</div>
                    <div className="font-light text-white text-lg tracking-wide">{contact.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Immediate Action */}
            <div className="bg-black/60 backdrop-blur-xl border border-white/20 p-8 rounded-2xl hover:border-white/30 hover:bg-black/80 transition-all duration-500">
              <h3 className="text-2xl font-light mb-6 text-white tracking-wide">Ready to Start Today?</h3>
              <p className="text-white/70 mb-8 font-light leading-relaxed">
                Book your discovery call now and we'll begin building your AI-powered website immediately.
              </p>
              <button className="w-full bg-white text-black py-5 font-light text-lg hover:bg-white/90 hover:shadow-2xl hover:shadow-white/20 transition-all duration-500 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/20 tracking-wide rounded-xl">
                🔥 Book Discovery Call Now
              </button>
            </div>
          </div>

          {/* Right Column - Enhanced Contact Form */}
          <div className="bg-black/60 backdrop-blur-xl border border-white/20 p-12 rounded-3xl hover:border-white/30 hover:bg-black/80 transition-all duration-500">
            <div className="mb-12">
              <div className="w-1 h-8 bg-white mb-6"></div>
              <h3 className="text-3xl font-light mb-4 text-white tracking-wide">Get Your Build Slot</h3>
              <p className="text-white/70 font-light">Fill out this form to secure one of the 10 remaining slots this month.</p>
            </div>
            
            <form className="space-y-8">
              {[
                { label: 'Full Name *', type: 'text', placeholder: 'Your full name' },
                { label: 'Email Address *', type: 'email', placeholder: 'your@email.com' },
                { label: 'Phone Number *', type: 'tel', placeholder: 'Your phone number' }
              ].map((field, index) => (
                <div key={index}>
                  <label className="block text-sm font-light mb-3 text-white tracking-wide">{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full bg-black/80 backdrop-blur-sm border border-white/20 px-6 py-4 text-white placeholder-white/50 focus:outline-none focus:border-white/50 focus:bg-black/90 transition-all duration-500 rounded-xl font-light"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-light mb-3 text-white tracking-wide">Business Type *</label>
                <select className="w-full bg-black/80 backdrop-blur-sm border border-white/20 px-6 py-4 text-white focus:outline-none focus:border-white/50 focus:bg-black/90 transition-all duration-500 rounded-xl font-light">
                  <option value="">Select your business type</option>
                  <option value="coach">Coach/Consultant</option>
                  <option value="creator">Digital Creator</option>
                  <option value="course">Course Seller</option>
                  <option value="service">Service Business</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-light mb-3 text-white tracking-wide">Tell us about your business</label>
                <textarea
                  rows={4}
                  placeholder="What do you do and what are your main goals?"
                  className="w-full bg-black/80 backdrop-blur-sm border border-white/20 px-6 py-4 text-white placeholder-white/50 focus:outline-none focus:border-white/50 focus:bg-black/90 resize-none transition-all duration-500 rounded-xl font-light"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-white text-black py-5 font-light text-lg hover:bg-white/90 hover:shadow-2xl hover:shadow-white/20 transition-all duration-500 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/20 tracking-wide rounded-xl"
              >
                🔥 Secure My 72-Hour Build Slot
              </button>
              
              <p className="text-white/60 text-sm text-center font-light tracking-wide">
                We'll contact you within 2 hours to schedule your discovery call
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;