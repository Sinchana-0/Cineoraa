import { Movie } from '../types/movie';
import { api, fetchMovies, fetchMovieDetails } from './api/tmdb';

export const movieService = {
  // Movies
  getTrending: () => fetchMovies('/trending/movie/week'),
  getPopular: () => fetchMovies('/movie/popular'),
  getTopRated: () => fetchMovies('/movie/top_rated'),
  getUpcoming: () => fetchMovies('/movie/upcoming'),
  getNowPlaying: () => fetchMovies('/movie/now_playing'),
  
  // TV Shows
  getTrendingShows: () => fetchMovies('/trending/tv/week'),
  getPopularShows: () => fetchMovies('/tv/popular'),
  getTopRatedShows: () => fetchMovies('/tv/top_rated'),
  getAiringToday: () => fetchMovies('/tv/airing_today'),
  
  // Genres
  getActionMovies: () => fetchMovies('/discover/movie', { with_genres: 28 }),
  getComedyMovies: () => fetchMovies('/discover/movie', { with_genres: 35 }),
  getDramaMovies: () => fetchMovies('/discover/movie', { with_genres: 18 }),
  getHorrorMovies: () => fetchMovies('/discover/movie', { with_genres: 27 }),
  getSciFiMovies: () => fetchMovies('/discover/movie', { with_genres: 878 }),
  
  // Regional Content
  getBollywood: () => fetchMovies('/discover/movie', { 
    with_original_language: 'hi',
    region: 'IN',
    sort_by: 'popularity.desc'
  }),
  getKoreanDramas: () => fetchMovies('/discover/tv', {
    with_original_language: 'ko',
    sort_by: 'popularity.desc'
  }),
  getAnime: () => fetchMovies('/discover/tv', {
    with_genres: 16,
    with_original_language: 'ja',
    sort_by: 'popularity.desc'
  }),
  
  // Search and Details
  searchContent: (query: string) => 
    fetchMovies('/search/multi', { query }),
  getMovieDetails: (movieId: string) => 
    fetchMovieDetails(movieId),
  getRecommendations: (movieId: string) => 
    fetchMovies(`/movie/${movieId}/recommendations`),
  getSimilar: (movieId: string) => 
    fetchMovies(`/movie/${movieId}/similar`),
};