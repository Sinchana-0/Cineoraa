import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import { SplashScreen } from './components/SplashScreen';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { MovieRow } from './components/MovieRow';
import { MoviePlayer } from './components/MoviePlayer';
import { MovieDetails } from './components/MovieDetails';
import { useMovieStore } from './store/movieStore';
import { movieApi } from './services/api/movieApi';
import { Movie } from './types/movie';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 300000,
    },
  },
});

function AppContent() {
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { selectedMovie, setSelectedMovie } = useMovieStore();

  const handlePlay = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsPlaying(true);
    navigate(`/watch/${movie.id}`);
  };

  const handleMoreInfo = (movie: Movie) => {
    setSelectedMovie(movie);
    setShowDetails(true);
    navigate(`/browse/${movie.id}`);
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation onBack={() => navigate(-1)} />
      
      <HeroSection onPlay={handlePlay} onMoreInfo={handleMoreInfo} />
      
      <main className="relative z-10 -mt-32 pb-20 space-y-12">
        <MovieRow
          title="Trending Now"
          fetchMovies={movieApi.getTrending}
          onMovieClick={handleMoreInfo}
        />
        
        <MovieRow
          title="Popular Movies"
          fetchMovies={movieApi.getPopular}
          onMovieClick={handleMoreInfo}
        />
        
        <MovieRow
          title="Top Rated Shows"
          fetchMovies={movieApi.getTopRatedShows}
          onMovieClick={handleMoreInfo}
        />
        
        <MovieRow
          title="Popular TV Shows"
          fetchMovies={movieApi.getPopularShows}
          onMovieClick={handleMoreInfo}
        />

        <MovieRow
          title="Bollywood Hits"
          fetchMovies={() => movieApi.getRegionalContent('hi', 'IN')}
          onMovieClick={handleMoreInfo}
        />

        <MovieRow
          title="Korean Dramas"
          fetchMovies={() => movieApi.getRegionalContent('ko')}
          onMovieClick={handleMoreInfo}
        />

        <MovieRow
          title="Anime Collection"
          fetchMovies={() => movieApi.getRegionalContent('ja')}
          onMovieClick={handleMoreInfo}
        />
      </main>

      {isPlaying && selectedMovie && (
        <MoviePlayer
          url={selectedMovie.trailerUrl}
          onClose={() => {
            setIsPlaying(false);
            navigate(-1);
          }}
        />
      )}

      {showDetails && selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          onPlay={() => handlePlay(selectedMovie)}
          onClose={() => {
            setShowDetails(false);
            navigate(-1);
          }}
          onAddToList={() => {}}
        />
      )}

      <Toaster position="bottom-center" />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="*" element={<AppContent />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;