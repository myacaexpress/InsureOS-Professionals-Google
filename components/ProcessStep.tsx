import React from 'react';
import { motion } from 'framer-motion';

interface ProcessStepProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  delay?: number;
}

const ProcessStep: React.FC<ProcessStepProps> = ({ icon, title, desc, delay = 0 }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay, duration: 0.5 }}
      className="relative flex gap-6 items-start"
    >
      <div className="relative z-10 bg-white text-brand-blue p-4 rounded-2xl shadow-xl shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-blue-100 mt-1 text-sm leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
};

export default ProcessStep;
