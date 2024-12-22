import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, Volume2, VolumeX } from 'lucide-react';
import { useQuery } from 'react-query';
import { movieApi } from '../services/api/movieApi';
import { Movie } from '../types/movie';

interface HeroSectionProps {
  onPlay: (movie: Movie) => void;
  onMoreInfo: (movie: Movie) => void;
}

export function HeroSection({ onPlay, onMoreInfo }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const { data: trendingMovies = [] } = useQuery(
    'trending-hero',
    () => movieApi.getTrending(),
    {
      staleTime: 5 * 60 * 1000,
      select: (movies) => movies.slice(0, 5),
    }
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % trendingMovies.length);
    }, 15000);

    return () => clearInterval(timer);
  }, [trendingMovies.length]);

  const currentMovie = trendingMovies[currentIndex];

  if (!currentMovie) return null;

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {currentMovie.trailerUrl ? (
            <div className="relative w-full h-full">
              <iframe
                src={`${currentMovie.trailerUrl.replace('watch?v=', 'embed/')}?autoplay=1&mute=${
                  isMuted ? 1 : 0
                }&controls=0&showinfo=0&rel=0&loop=1&playlist=${currentMovie.trailerUrl.split('v=')[1]}`}
                className="w-full h-full object-cover"
                allow="autoplay; encrypted-media"
              />
            </div>
          ) : (
            <img
              src={currentMovie.backdropUrl}
              alt={currentMovie.title}
              className="w-full h-full object-cover"
            />
          )}

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-[20%] left-[5%] max-w-2xl space-y-8"
          >
            <h1 className="text-7xl font-bold text-white vintage-text-shadow tracking-wide">
              {currentMovie.title}
            </h1>

            <p className="text-xl text-gray-200 line-clamp-3">
              {currentMovie.overview}
            </p>

            <div className="flex items-center gap-4">
              <button
                onClick={() => onPlay(currentMovie)}
                className="flex items-center gap-2 px-8 py-4 bg-vintage-red text-white rounded-lg hover:bg-vintage-red/90 transition transform hover:scale-105"
              >
                <Play className="w-6 h-6" />
                Play Now
              </button>

              <button
                onClick={() => onMoreInfo(currentMovie)}
                className="flex items-center gap-2 px-8 py-4 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition transform hover:scale-105"
              >
                <Info className="w-6 h-6" />
                More Info
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="ml-4 p-3 rounded-full bg-black/40 hover:bg-black/60 transition"
              >
                {isMuted ? (
                  <VolumeX className="w-6 h-6" />
                ) : (
                  <Volume2 className="w-6 h-6" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-300">
              <span className="px-3 py-1 bg-vintage-red rounded-full">
                {currentMovie.rating.toFixed(1)} Rating
              </span>
              <span>{currentMovie.year}</span>
              <span>{currentMovie.duration}</span>
              <span className="uppercase">{currentMovie.language}</span>
            </div>
          </motion.div>

          {/* Progress indicators */}
          <div className="absolute bottom-[10%] left-[5%] flex gap-2">
            {trendingMovies.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-12 h-1 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-vintage-red' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}