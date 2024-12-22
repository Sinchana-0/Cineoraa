import React, { useState, useEffect } from 'react';
import { Play, Info, VolumeX, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Movie } from '../types/movie';

interface FeaturedMovieProps {
  movie: Movie;
  onPlay: () => void;
  onMoreInfo: () => void;
}

export function FeaturedMovie({ movie, onPlay, onMoreInfo }: FeaturedMovieProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    setIsVideoLoaded(false);
    const timer = setTimeout(() => setIsVideoLoaded(true), 2000);
    return () => clearTimeout(timer);
  }, [movie.id]);

  return (
    <div className="relative h-[85vh] w-full">
      <div className="absolute inset-0">
        {isVideoLoaded && movie.trailerUrl ? (
          <div className="relative w-full h-full">
            <iframe
              src={`${movie.trailerUrl.replace('watch?v=', 'embed/')}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&showinfo=0&rel=0&loop=1&playlist=${movie.trailerUrl.split('v=')[1]}`}
              className="w-full h-full object-cover"
              allow="autoplay; encrypted-media"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          </div>
        ) : (
          <>
            <img
              src={movie.backdropUrl}
              alt={movie.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          </>
        )}
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-32 left-0 p-12 space-y-6 max-w-2xl"
      >
        <h1 className="text-7xl font-bold text-white vintage-text-shadow">
          {movie.title}
        </h1>
        
        <p className="text-xl text-gray-200 line-clamp-3">
          {movie.overview}
        </p>
        
        <div className="flex items-center gap-4">
          <button
            onClick={onPlay}
            className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition"
          >
            <Play className="w-6 h-6" />
            Play
          </button>
          
          <button 
            onClick={onMoreInfo}
            className="flex items-center gap-2 px-8 py-3 bg-gray-600/80 text-white rounded-lg hover:bg-gray-600 transition"
          >
            <Info className="w-6 h-6" />
            More Info
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="ml-auto p-3 rounded-full bg-black/40 hover:bg-black/60 transition"
          >
            {isMuted ? (
              <VolumeX className="w-6 h-6" />
            ) : (
              <Volume2 className="w-6 h-6" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-300">
          <span className="px-2 py-1 bg-red-600 rounded text-white">
            {movie.rating.toFixed(1)} Rating
          </span>
          <span>{movie.year}</span>
          <span>{movie.duration}</span>
          <span>{movie.language}</span>
        </div>
      </motion.div>
    </div>
  );
}