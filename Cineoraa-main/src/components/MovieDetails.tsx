import React from 'react';
import { motion } from 'framer-motion';
import { Play, Plus, ThumbsUp, X, Star } from 'lucide-react';
import { Movie } from '../types/movie';
import { useQuery } from 'react-query';
import { movieApi } from '../services/tmdb';

interface MovieDetailsProps {
  movie: Movie;
  onPlay: () => void;
  onClose: () => void;
  onAddToList: () => void;
}

export function MovieDetails({ movie, onPlay, onClose, onAddToList }: MovieDetailsProps) {
  const { data: recommendations } = useQuery(
    ['recommendations', movie.id],
    () => movieApi.getRecommendations(movie.id),
    {
      staleTime: 300000,
      retry: 2
    }
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-40 overflow-y-auto"
    >
      <div className="container mx-auto px-4 py-16">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="bg-zinc-900 rounded-lg overflow-hidden">
          <div className="relative h-96">
            <img
              src={movie.backdropUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900" />
          </div>
          
          <div className="p-8 -mt-32 relative">
            <h2 className="text-4xl font-bold mb-4">{movie.title}</h2>
            
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={onPlay}
                className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded hover:bg-gray-200 transition"
              >
                <Play className="w-5 h-5" />
                Play Trailer
              </button>
              
              <button
                onClick={onAddToList}
                className="flex items-center gap-2 p-3 rounded-full bg-zinc-800 hover:bg-zinc-700"
                title="Add to My List"
              >
                <Plus className="w-5 h-5" />
              </button>
              
              <button 
                className="flex items-center gap-2 p-3 rounded-full bg-zinc-800 hover:bg-zinc-700"
                title="Rate"
              >
                <ThumbsUp className="w-5 h-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-4 text-sm text-gray-300 mb-4">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    {movie.rating.toFixed(1)}
                  </span>
                  <span>{movie.year}</span>
                  <span>{movie.duration}</span>
                  <span>{movie.language}</span>
                </div>
                
                <p className="text-gray-300">{movie.overview}</p>
              </div>
              
              <div>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-400">Cast: </span>
                    {movie.cast.join(', ')}
                  </p>
                  <p>
                    <span className="text-gray-400">Director: </span>
                    {movie.director}
                  </p>
                  <p>
                    <span className="text-gray-400">Genres: </span>
                    {movie.genres.join(', ')}
                  </p>
                </div>
              </div>
            </div>

            {recommendations && recommendations.length > 0 && (
              <div className="mt-8">
                <h3 className="text-2xl font-semibold mb-4">More Like This</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {recommendations.map((movie) => (
                    <div 
                      key={movie.id} 
                      className="space-y-2 cursor-pointer"
                      onClick={() => {
                        onClose();
                        setTimeout(() => {
                          window.location.href = `/movie/${movie.id}`;
                        }, 300);
                      }}
                    >
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full rounded-lg transition-transform duration-300 hover:scale-105"
                      />
                      <p className="text-sm font-medium">{movie.title}</p>
                      <p className="text-xs text-gray-400">{movie.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}