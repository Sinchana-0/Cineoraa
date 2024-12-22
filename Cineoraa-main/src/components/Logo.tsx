import React from 'react';
import { Film } from 'lucide-react';
import { motion } from 'framer-motion';

export function Logo() {
  return (
    <motion.div 
      className="flex items-center gap-2"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        animate={{ 
          rotate: 360,
          transition: { 
            duration: 20,
            ease: "linear",
            repeat: Infinity
          }
        }}
      >
        <Film className="w-8 h-8 text-vintage-red filter drop-shadow-[0_0_8px_rgba(255,40,0,0.7)]" />
      </motion.div>
      <span className="text-2xl font-bold font-playfair text-vintage-red vintage-text-shadow">
        CINEORA
      </span>
    </motion.div>
  );
}