import React, { useState, useRef } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '../hooks/useDebounce';
import { useQuery } from 'react-query';
import { movieApi } from '../services/tmdb';

export function SearchBar({ onMovieSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef(null);

  const { data: results = [], isLoading } = useQuery(
    ['search', debouncedQuery],
    () => movieApi.searchMovies(debouncedQuery),
    {
      enabled: debouncedQuery.length > 0,
      staleTime: 300000,
    }
  );

  const handleOpen = () => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleClose = () => {
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className="relative">
      <button
        onClick={handleOpen}
        className="text-gray-300 hover:text-vintage-gold transition-colors"
      >
        <SearchIcon className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-0 right-0 w-96 bg-black/90 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden vintage-border"
          >
            <div className="flex items-center p-4 border-b border-vintage-gold/30">
              <SearchIcon className="w-5 h-5 text-vintage-gold" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search movies..."
                className="flex-1 bg-transparent border-none outline-none px-4 text-white placeholder-gray-400"
              />
              <button onClick={handleClose}>
                <X className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
              </button>
            </div>

            {query && (
              <div className="max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 text-center text-gray-400">Searching...</div>
                ) : results.length > 0 ? (
                  results.map((movie) => (
                    <button
                      key={movie.id}
                      onClick={() => {
                        onMovieSelect(movie);
                        handleClose();
                      }}
                      className="w-full p-4 hover:bg-vintage-red/10 transition-colors flex items-center gap-4"
                    >
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-12 h-18 object-cover rounded"
                      />
                      <div className="text-left">
                        <h3 className="font-medium text-white">{movie.title}</h3>
                        <p className="text-sm text-gray-400">{movie.year}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-400">
                    No movies found
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}