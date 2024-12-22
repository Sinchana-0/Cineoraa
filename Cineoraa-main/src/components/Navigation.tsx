import React, { useState, useEffect } from 'react';
import { ArrowLeft, Home, Film, Search, Heart, User, Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface NavigationProps {
  onBack?: () => void;
}

export function Navigation({ onBack }: NavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showBackButton = location.pathname !== '/';

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/90 backdrop-blur-sm' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            {showBackButton && (
              <button
                onClick={onBack}
                className="text-gray-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            )}
            
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => navigate('/')}
                className={`text-gray-300 hover:text-white transition-colors ${
                  location.pathname === '/' ? 'text-white' : ''
                }`}
              >
                <Home className="w-6 h-6" />
              </button>
              
              <button
                onClick={() => navigate('/movies')}
                className={`text-gray-300 hover:text-white transition-colors ${
                  location.pathname === '/movies' ? 'text-white' : ''
                }`}
              >
                <Film className="w-6 h-6" />
              </button>
              
              <button
                onClick={() => navigate('/search')}
                className={`text-gray-300 hover:text-white transition-colors ${
                  location.pathname === '/search' ? 'text-white' : ''
                }`}
              >
                <Search className="w-6 h-6" />
              </button>
              
              <button
                onClick={() => navigate('/watchlist')}
                className={`text-gray-300 hover:text-white transition-colors ${
                  location.pathname === '/watchlist' ? 'text-white' : ''
                }`}
              >
                <Heart className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/profile')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              <User className="w-6 h-6" />
            </button>

            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden text-gray-300 hover:text-white transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {showMobileMenu && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-black/95 backdrop-blur-sm"
        >
          <div className="px-4 pt-2 pb-4 space-y-2">
            <button
              onClick={() => {
                navigate('/');
                setShowMobileMenu(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg"
            >
              Home
            </button>
            <button
              onClick={() => {
                navigate('/movies');
                setShowMobileMenu(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg"
            >
              Movies
            </button>
            <button
              onClick={() => {
                navigate('/search');
                setShowMobileMenu(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg"
            >
              Search
            </button>
            <button
              onClick={() => {
                navigate('/watchlist');
                setShowMobileMenu(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg"
            >
              My List
            </button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}