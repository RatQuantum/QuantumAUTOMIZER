import React, { useState } from 'react';
import { Check, Crown, Diamond, Gem } from 'lucide-react';

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: 'Obsidian',
      icon: <Diamond className="w-8 h-8" />,
      monthlyPrice: 2499,
      annualPrice: 24990,
      description: 'Crafted for discerning professionals',
      material: 'Carbon Fiber Finish',
      features: [
        'Bespoke AI Architecture',
        'Platinum-Grade Security',
        'Concierge-Level Support',
        'Executive Dashboard',
        'Private Cloud Infrastructure',
        'Handcrafted User Experience',
        'Exclusive Beta Access'
      ],
      uniqueBenefit: 'Limited Edition - Only 100 Units Worldwide',
      cta: 'Reserve Now',
      popular: false,
      tier: 'obsidian',
      exclusivity: 'Limited to 100 clients globally'
    },
    {
      name: 'Onyx Elite',
      icon: <Crown className="w-8 h-8" />,
      monthlyPrice: 4999,
      annualPrice: 49990,
      description: 'The pinnacle of luxury automation',
      material: 'Brushed Titanium Accents',
      features: [
        'Everything in Obsidian',
        'Personal AI Architect',
        'White-Glove Implementation',
        'Quarterly Executive Reviews',
        'Custom Hardware Integration',
        'Dedicated War Room Access',
        'C-Suite Advisory Board',
        'Global 24/7 Command Center'
      ],
      uniqueBenefit: 'Personal AI Architect & C-Suite Advisory Access',
      cta: 'Acquire Now',
      popular: true,
      tier: 'onyx',
      exclusivity: 'Invitation-only membership'
    },
    {
      name: 'Midnight Sovereign',
      icon: <Gem className="w-8 h-8" />,
      monthlyPrice: 9999,
      annualPrice: 99990,
      description: 'Ultra-exclusive for industry titans',
      material: 'Hand-Polished Obsidian',
      features: [
        'Everything in Onyx Elite',
        'Proprietary AI Development Lab',
        'Global Innovation Partnership',
        'Executive Jet Consultations',
        'Private Blockchain Network',
        'Quantum-Grade Encryption',
        'Legacy Preservation Suite'
      ],
      uniqueBenefit: 'Exclusive Innovation Lab & Legacy Preservation',
      cta: 'By Invitation Only',
      popular: false,
      tier: 'sovereign',
      exclusivity: 'Maximum 12 clients worldwide'
    }
  ];

  const getPrice = (plan) => {
    return isAnnual ? `$${plan.annualPrice.toLocaleString()}` : `$${plan.monthlyPrice.toLocaleString()}`;
  };

  const getPeriod = () => {
    return isAnnual ? '/year' : '/month';
  };

  const getSavings = (plan) => {
    if (!isAnnual) return '';
    const monthlyCost = plan.monthlyPrice * 12;
    const savings = monthlyCost - plan.annualPrice;
    const percentage = Math.round((savings / monthlyCost) * 100);
    return `Save ${percentage}%`;
  };

  return (
    <section id="pricing" className="py-32 bg-black min-h-screen">
      <div className="max-w-8xl mx-auto px-8">
        {/* Luxury Header */}
        <div className="text-center mb-24">
          <div className="inline-block mb-8">
            <div className="w-1 h-16 bg-white mx-auto mb-6"></div>
            <div className="text-white/60 text-sm font-light tracking-[0.3em] uppercase mb-4">
              Luxury Collection
            </div>
          </div>
          
          <h2 className="text-7xl md:text-8xl font-thin mb-8 text-white tracking-tight">
            Midnight
            <span className="block font-extralight text-white/80">Prestige</span>
          </h2>
          
          <p className="text-xl text-white/70 max-w-4xl mx-auto mb-16 font-light leading-relaxed">
            Exclusively crafted for visionaries who demand nothing less than perfection.
            <br />
            Each piece represents the pinnacle of luxury automation technology.
          </p>

          {/* Premium Billing Toggle */}
          <div className="flex items-center justify-center space-x-8 mb-20">
            <span className={`text-lg font-light tracking-wide ${!isAnnual ? 'text-white' : 'text-white/50'}`}>
              Monthly Investment
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-10 w-20 items-center rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-black ${
                isAnnual ? 'bg-white' : 'bg-white/20 backdrop-blur-sm'
              }`}
            >
              <span
                className={`inline-block h-8 w-8 transform rounded-full transition-all duration-500 ${
                  isAnnual ? 'translate-x-11 bg-black' : 'translate-x-1 bg-white'
                }`}
              />
            </button>
            <span className={`text-lg font-light tracking-wide ${isAnnual ? 'text-white' : 'text-white/50'}`}>
              Annual Commitment
            </span>
            {isAnnual && (
              <span className="bg-white text-black px-6 py-3 rounded-full text-sm font-medium tracking-wide">
                Exclusive Savings
              </span>
            )}
          </div>
        </div>

        {/* Luxury Product Cards */}
        <div className="grid lg:grid-cols-3 gap-12 max-w-8xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-gradient-to-b from-black to-gray-900 border rounded-3xl p-12 transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:shadow-white/10 ${
                plan.popular
                  ? 'border-white shadow-2xl shadow-white/20 bg-gradient-to-b from-gray-900 to-black'
                  : 'border-white/20 hover:border-white/40'
              }`}
              style={{
                background: plan.popular 
                  ? 'linear-gradient(135deg, #1a1a1a 0%, #000000 100%)'
                  : 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
                backdropFilter: 'blur(20px)'
              }}
            >
              {/* Luxury Badge */}
              {plan.popular && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="bg-white text-black px-8 py-4 rounded-full text-sm font-bold flex items-center space-x-3 shadow-2xl">
                    <Crown className="w-5 h-5 fill-current" />
                    <span className="tracking-wide">MOST COVETED</span>
                  </div>
                </div>
              )}

              {/* Premium Header */}
              <div className="text-center mb-12">
                <div className="flex items-center justify-center mb-6">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${
                    plan.popular ? 'bg-white text-black border-white' : 'bg-black text-white border-white/30'
                  }`}>
                    {plan.icon}
                  </div>
                </div>
                
                <h3 className="text-3xl font-light mb-2 text-white tracking-wide">{plan.name}</h3>
                <div className="text-white/60 text-sm font-light tracking-[0.2em] uppercase mb-2">{plan.material}</div>
                <p className="text-white/70 mb-10 font-light">{plan.description}</p>
                
                <div className="mb-8">
                  <span className="text-6xl font-thin text-white">{getPrice(plan)}</span>
                  <span className="text-xl text-white/60 ml-3 font-light">{getPeriod()}</span>
                </div>
                
                {getSavings(plan) && (
                  <div className="text-black font-medium text-sm bg-white px-6 py-3 rounded-full inline-block tracking-wide">
                    {getSavings(plan)}
                  </div>
                )}
              </div>

              {/* Exclusivity Badge */}
              <div className={`mb-10 p-6 rounded-2xl border ${
                plan.popular ? 'border-white/30 bg-white/5' : 'border-white/20 bg-white/5'
              } backdrop-blur-sm`}>
                <div className="text-center">
                  <div className="text-xs font-light text-white/60 mb-2 tracking-[0.2em] uppercase">Exclusivity</div>
                  <div className="text-white font-light text-sm">{plan.exclusivity}</div>
                </div>
              </div>

              {/* Unique Benefit Highlight */}
              <div className={`mb-10 p-6 rounded-2xl border-2 border-dashed ${
                plan.popular ? 'border-white/50 bg-white/5' : 'border-white/30 bg-white/5'
              } backdrop-blur-sm`}>
                <div className="text-center">
                  <div className="text-xs font-light text-white/60 mb-2 tracking-[0.2em] uppercase">Signature Benefit</div>
                  <div className="text-white font-light">{plan.uniqueBenefit}</div>
                </div>
              </div>

              {/* Premium Features */}
              <ul className="space-y-5 mb-12">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start space-x-4">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                      plan.popular ? 'bg-white' : 'bg-white/20 backdrop-blur-sm'
                    }`}>
                      <Check className={`w-4 h-4 ${plan.popular ? 'text-black' : 'text-white'}`} />
                    </div>
                    <span className="text-white/90 font-light leading-relaxed tracking-wide">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Luxury CTA Button */}
              <button
                className={`w-full py-6 font-light text-lg rounded-2xl transition-all duration-500 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/20 tracking-wide ${
                  plan.popular
                    ? 'bg-white text-black hover:bg-white/90 shadow-2xl shadow-white/20'
                    : 'bg-transparent text-white border-2 border-white/30 hover:bg-white hover:text-black hover:border-white backdrop-blur-sm'
                }`}
              >
                {plan.cta}
              </button>

              {/* Luxury Guarantee */}
              <div className="text-center mt-8">
                <div className="text-sm text-white/50 font-light tracking-wide">Lifetime Craftsmanship Guarantee</div>
              </div>
            </div>
          ))}
        </div>

        {/* Ultra-Premium Bottom Section */}
        <div className="text-center mt-24">
          <div className="bg-gradient-to-r from-black via-gray-900 to-black border border-white/20 p-16 max-w-6xl mx-auto rounded-3xl backdrop-blur-sm">
            <div className="w-1 h-12 bg-white mx-auto mb-8"></div>
            <h3 className="text-4xl font-thin mb-8 text-white tracking-wide">Bespoke Creations</h3>
            <p className="text-xl text-white/70 mb-12 max-w-4xl mx-auto font-light leading-relaxed">
              For connoisseurs seeking the ultimate in personalization, our master craftsmen 
              create one-of-a-kind solutions that transcend conventional luxury.
            </p>
            <button className="bg-white text-black px-12 py-5 font-light text-lg rounded-2xl hover:bg-white/90 transition-all duration-500 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/20 tracking-wide">
              Request Private Consultation
            </button>
            <div className="text-white/50 text-sm font-light mt-6 tracking-wide">By appointment only</div>
          </div>
        </div>

        {/* Luxury Footer Elements */}
        <div className="text-center mt-20">
          <div className="flex justify-center items-center space-x-8 text-white/40 text-sm font-light tracking-[0.2em]">
            <span>HANDCRAFTED</span>
            <div className="w-1 h-1 bg-white/40 rounded-full"></div>
            <span>EXCLUSIVE</span>
            <div className="w-1 h-1 bg-white/40 rounded-full"></div>
            <span>TIMELESS</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;