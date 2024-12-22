import React from 'react';
import { Play, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { Movie } from '../types/movie';

interface MovieHeroProps {
  movie: Movie;
  onPlay: () => void;
}

export function MovieHero({ movie, onPlay }: MovieHeroProps) {
  return (
    <div className="relative h-[80vh] w-full">
      <div className="absolute inset-0">
        <img
          src={movie.backdropUrl}
          alt={movie.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-0 left-0 p-12 space-y-6"
      >
        <h1 className="text-6xl font-bold text-white max-w-2xl">
          {movie.title}
        </h1>
        
        <div className="flex items-center gap-4 text-sm text-gray-300">
          <span>{movie.year}</span>
          <span>{movie.duration}</span>
          <span>{movie.rating.toFixed(1)}/10</span>
          <span>{movie.language}</span>
        </div>

        <p className="text-lg text-gray-200 max-w-xl line-clamp-3">
          {movie.overview}
        </p>
        
        <div className="flex items-center gap-4">
          <button
            onClick={onPlay}
            className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded hover:bg-gray-200 transition"
          >
            <Play className="w-5 h-5" />
            Play Trailer
          </button>
          
          <button className="flex items-center gap-2 px-8 py-3 bg-gray-600/80 text-white rounded hover:bg-gray-600 transition">
            <Info className="w-5 h-5" />
            More Info
          </button>
        </div>
      </motion.div>
    </div>
  );
}