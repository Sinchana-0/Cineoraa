import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Film } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 vintage-gradient flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_20%,black_100%)] opacity-40" />
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            transition: { 
              duration: 1,
              ease: [0.22, 1, 0.36, 1]
            }
          }}
          className="text-center z-10"
        >
          <motion.div
            animate={{ 
              rotate: 360,
              transition: { 
                duration: 3,
                ease: "linear",
                repeat: Infinity
              }
            }}
            className="mb-8"
          >
            <Film className="w-32 h-32 text-vintage-red filter drop-shadow-[0_0_15px_rgba(255,40,0,0.7)]" />
          </motion.div>

          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ 
              y: 0, 
              opacity: 1,
              transition: { delay: 0.5 }
            }}
            className="text-7xl font-bold text-white mb-4 tracking-wider text-shadow-glow"
          >
            CINEORA
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ 
              scaleX: 1,
              transition: { delay: 0.8, duration: 0.8 }
            }}
            className="h-[2px] bg-vintage-gold mx-auto w-48 mb-4"
          />

          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ 
              y: 0, 
              opacity: 1,
              transition: { delay: 1 }
            }}
            className="text-2xl text-vintage-gold italic font-light tracking-wide"
          >
            The Aura of Cinema
          </motion.p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}