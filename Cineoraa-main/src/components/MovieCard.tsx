import React from 'react';
import { motion } from 'framer-motion';
import { Play, Info } from 'lucide-react';
import { Movie } from '../types/movie';

interface MovieCardProps {
  movie: Movie;
  onPlay: () => void;
  onMoreInfo: () => void;
}

export function MovieCard({ movie, onPlay, onMoreInfo }: MovieCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="relative group cursor-pointer"
    >
      <img
        src={movie.posterUrl}
        alt={movie.title}
        className="w-full rounded-lg shadow-lg transition-transform duration-300"
        loading="lazy"
      />
      
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 rounded-lg flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={onPlay}
            className="flex items-center gap-2 px-4 py-2 bg-vintage-red text-white rounded-full"
          >
            <Play className="w-4 h-4" />
            Play
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={onMoreInfo}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-full"
          >
            <Info className="w-4 h-4" />
            More Info
          </motion.button>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
        <h3 className="text-white font-semibold vintage-text-shadow">{movie.title}</h3>
        <p className="text-gray-300 text-sm">{movie.year}</p>
      </div>
    </motion.div>
  );
}