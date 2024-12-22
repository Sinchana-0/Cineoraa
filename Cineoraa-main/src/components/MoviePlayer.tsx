import React from 'react';
import ReactPlayer from 'react-player';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

interface MoviePlayerProps {
  url: string;
  onClose: () => void;
}

export function MoviePlayer({ url, onClose }: MoviePlayerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
      >
        <X className="w-6 h-6" />
      </button>
      
      <div className="w-full max-w-6xl aspect-video">
        <ReactPlayer
          url={url}
          width="100%"
          height="100%"
          controls
          playing
          config={{
            youtube: {
              playerVars: { 
                showinfo: 1,
                origin: window.location.origin,
                autoplay: 1,
                modestbranding: 1,
                rel: 0
              }
            }
          }}
        />
      </div>
    </motion.div>
  );
}