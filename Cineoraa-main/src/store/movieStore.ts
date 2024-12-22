import create from 'zustand';
import { Movie } from '../types/movie';

interface MovieStore {
  selectedMovie: Movie | null;
  setSelectedMovie: (movie: Movie | null) => void;
  watchlist: Movie[];
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: string) => void;
}

export const useMovieStore = create<MovieStore>((set) => ({
  selectedMovie: null,
  setSelectedMovie: (movie) => set({ selectedMovie: movie }),
  watchlist: [],
  addToWatchlist: (movie) =>
    set((state) => ({
      watchlist: [...state.watchlist, movie],
    })),
  removeFromWatchlist: (movieId) =>
    set((state) => ({
      watchlist: state.watchlist.filter((m) => m.id !== movieId),
    })),
}));