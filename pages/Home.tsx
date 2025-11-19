import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Users } from 'lucide-react';
import ProcessStep from '../components/ProcessStep';
import OfferCard from '../components/OfferCard';
import ParallaxEmoji from '../components/ParallaxEmoji';
import { MOCK_OFFERS } from '../constants';
import { Offer } from '../types';

interface HomeProps {
  onNavigate: (path: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col overflow-hidden">
      {/* --- HERO SECTION --- */}
      <section className="relative py-20 md:py-32 px-6 max-w-5xl mx-auto text-center">
        {/* Parallax Background Elements */}
        <ParallaxEmoji emoji="🛡️" speedY={-0.2} speedX={0.05} seed={1} className="top-10 left-[10%] text-6xl opacity-20" />
        <ParallaxEmoji emoji="🚀" speedY={0.25} speedX={-0.1} seed={42} className="top-32 right-[5%] text-7xl opacity-20" />
        <ParallaxEmoji emoji="💼" speedY={-0.1} speedX={0.05} seed={7} className="bottom-20 left-[15%] text-5xl opacity-20" />
        <ParallaxEmoji emoji="🤝" speedY={0.15} speedX={-0.05} seed={99} className="top-1/2 right-[15%] text-6xl opacity-20" />
        <ParallaxEmoji emoji="📈" speedY={-0.3} speedX={0.15} seed={23} className="bottom-10 right-[25%] text-4xl opacity-20" />
        <ParallaxEmoji emoji="✨" speedY={0.1} speedX={0.1} seed={55} className="top-20 left-[30%] text-3xl opacity-25" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 space-y-8"
        >
          {/* Removed MVP badge pill here */}

          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-brand-black">
            One platform for all agents. <br />
            <span className="text-brand-blue">For everything.</span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Connect with verified vendors, streamline your workflow, and transact with total security. 
            Smoother, faster, easier, smarter.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <button 
              onClick={() => onNavigate('/browse')}
              className="group bg-brand-blue text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-blue-500/30 hover:bg-brand-blueDark transition-all flex items-center justify-center gap-2"
            >
              Find Services
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </button>
            <button 
              onClick={() => onNavigate('/onboarding')}
              className="px-8 py-4 rounded-full font-bold text-lg border-2 border-gray-200 hover:border-brand-black transition-colors text-brand-black bg-transparent"
            >
              Become a Vendor
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* --- DYNAMIC PROCESS FLOW --- */}
      <section className="bg-brand-blue text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-4xl font-bold mb-6">Simple, Transparent Flow.</h2>
              <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                Get up and running in minutes. Our process is designed for speed and efficiency using our asymmetric reputation engine.
              </p>
              <ul className="space-y-4">
                {[
                  "Sign in with Mobile Number + OTP",
                  "Fund Project into Secure Escrow",
                  "Chat & Receive Delivery Instantly",
                  "Unlock Verified Badges"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-lg font-medium">
                    <CheckCircle2 className="text-blue-200" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-white/20 rounded-full" />
              
              <div className="space-y-12">
                <ProcessStep 
                  icon={<Users className="text-brand-blue" />} 
                  title="Connect" 
                  desc="Message vendors freely. Build trust before you pay."
                  delay={0.1}
                />
                <ProcessStep 
                  icon={<ShieldCheck className="text-brand-blue" />} 
                  title="Fund" 
                  desc="Secure payments via Stripe. Money held until approved."
                  delay={0.3}
                />
                <ProcessStep 
                  icon={<Zap className="text-brand-blue" />} 
                  title="Deliver" 
                  desc="Receive assets in chat. T+1 payouts for vendors."
                  delay={0.5}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- MARKETPLACE PREVIEW --- */}
      <section className="py-24 px-6 bg-brand-gray">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-brand-black mb-4">Verified Professionals</h2>
            <p className="text-gray-600">Access the best leads, CRM setups, and coaching.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {MOCK_OFFERS.map(offer => (
              <OfferCard key={offer.id} offer={offer} onMessage={() => onNavigate('/inbox')} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;