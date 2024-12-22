import { useQuery } from 'react-query';
import { Movie } from '../types/movie';
import * as api from '../services/api';

const STALE_TIME = 5 * 60 * 1000; // 5 minutes
const CACHE_TIME = 30 * 60 * 1000; // 30 minutes

export function useTrendingMovies() {
  return useQuery<Movie[], Error>(
    ['trending'],
    api.fetchTrending,
    {
      staleTime: STALE_TIME,
      cacheTime: CACHE_TIME,
      retry: 2,
    }
  );
}

export function useIndianMovies() {
  return useQuery<Movie[], Error>(
    ['indian'],
    api.fetchIndianContent,
    {
      staleTime: STALE_TIME,
      cacheTime: CACHE_TIME,
      retry: 2,
    }
  );
}

export function useKidsContent() {
  return useQuery<Movie[], Error>(
    ['kids'],
    api.fetchKidsContent,
    {
      staleTime: STALE_TIME,
      cacheTime: CACHE_TIME,
      retry: 2,
    }
  );
}

export function useTVShows() {
  return useQuery<Movie[], Error>(
    ['tv'],
    api.fetchTVShows,
    {
      staleTime: STALE_TIME,
      cacheTime: CACHE_TIME,
      retry: 2,
    }
  );
}