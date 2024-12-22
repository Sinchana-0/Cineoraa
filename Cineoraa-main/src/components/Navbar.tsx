import React, { useState, useEffect } from 'react';
import { Search, Bell, User, Film, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SearchBar } from './SearchBar';

export function Navbar({ onMovieSelect }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/90 backdrop-blur-sm' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <Film className="w-8 h-8 text-vintage-red animate-film-reel" />
              <span className="text-2xl font-bold text-vintage-red animate-text-glow">
                CINEORA
              </span>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-gray-300 hover:text-vintage-gold transition-colors">
                Home
              </Link>
              <Link to="/movies" className="text-gray-300 hover:text-vintage-gold transition-colors">
                Movies
              </Link>
              <Link to="/genres" className="text-gray-300 hover:text-vintage-gold transition-colors">
                Genres
              </Link>
              <Link to="/watchlist" className="text-gray-300 hover:text-vintage-gold transition-colors">
                My List
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <SearchBar onMovieSelect={onMovieSelect} />
            <button className="text-gray-300 hover:text-vintage-gold transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="text-gray-300 hover:text-vintage-gold transition-colors">
              <User className="w-5 h-5" />
            </button>
            <button className="md:hidden text-gray-300 hover:text-vintage-gold transition-colors">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}