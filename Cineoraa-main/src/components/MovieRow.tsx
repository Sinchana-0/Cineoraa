import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '../types/movie';
import { useQuery } from 'react-query';

interface MovieRowProps {
  title: string;
  fetchMovies: () => Promise<Movie[]>;
  onMovieClick: (movie: Movie) => void;
}

export function MovieRow({ title, fetchMovies, onMovieClick }: MovieRowProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { data: movies, isLoading } = useQuery(
    ['movies', title],
    fetchMovies,
    {
      enabled: inView,
      staleTime: 5 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    }
  );

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = current.clientWidth * 0.8;
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (isLoading || !movies) {
    return (
      <div className="py-8" ref={ref}>
        <h2 className="text-2xl font-semibold text-white mb-4 px-12">{title}</h2>
        <div className="flex gap-4 px-12 overflow-x-auto no-scrollbar">
          {[...Array(6)].map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="w-48 h-72 bg-zinc-800 rounded animate-pulse flex-shrink-0"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!movies.length) {
    return null;
  }

  return (
    <div className="py-8 group/row" ref={ref}>
      <h2 className="text-2xl font-semibold text-white mb-4 px-12">{title}</h2>
      
      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-40 w-12 h-full bg-black/30 opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 hover:bg-black/60"
        >
          <ChevronLeft className="w-8 h-8 mx-auto" />
        </button>

        <div 
          ref={scrollRef}
          className="flex gap-4 px-12 overflow-x-auto no-scrollbar scroll-smooth"
        >
          {movies.map((movie) => (
            <motion.div
              key={movie.id}
              layoutId={movie.id}
              onHoverStart={() => setHoveredId(movie.id)}
              onHoverEnd={() => setHoveredId(null)}
              className={`flex-shrink-0 cursor-pointer transition-all duration-300 ${
                hoveredId === movie.id ? 'scale-110 z-10' : ''
              }`}
              onClick={() => onMovieClick(movie)}
            >
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-48 rounded-lg shadow-lg"
                loading="lazy"
              />
              {hoveredId === movie.id && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute mt-2 p-4 bg-zinc-900/95 rounded-lg shadow-xl w-72 z-50"
                >
                  <h3 className="font-semibold mb-2">{movie.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                    <span>{movie.year}</span>
                    <span>•</span>
                    <span>{movie.duration}</span>
                    <span>•</span>
                    <span>{movie.rating.toFixed(1)} ★</span>
                  </div>
                  <p className="text-sm text-gray-300 line-clamp-2">{movie.overview}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-40 w-12 h-full bg-black/30 opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 hover:bg-black/60"
        >
          <ChevronRight className="w-8 h-8 mx-auto" />
        </button>
      </div>
    </div>
  );
}