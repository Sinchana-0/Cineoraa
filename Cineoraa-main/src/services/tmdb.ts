import axios from 'axios';
import { Movie } from '../types/movie';

const TMDB_API_KEY = '2dca580c2a14b55200e784d157207b4d';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export const getImageUrl = (path: string, size: string = 'original') => 
  path ? `${IMAGE_BASE_URL}/${size}${path}` : '';

const fetchMovieDetails = async (movieId: number) => {
  const [details, videos, credits, similar, recommendations] = await Promise.all([
    api.get(`/movie/${movieId}`),
    api.get(`/movie/${movieId}/videos`),
    api.get(`/movie/${movieId}/credits`),
    api.get(`/movie/${movieId}/similar`),
    api.get(`/movie/${movieId}/recommendations`)
  ]);

  const trailer = videos.data.results.find(
    (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
  ) || videos.data.results[0];

  const director = credits.data.crew.find(
    (person: any) => person.job === 'Director'
  );

  return {
    details: details.data,
    trailer,
    director,
    cast: credits.data.cast,
    similar: similar.data.results,
    recommendations: recommendations.data.results
  };
};

export const transformMovieData = async (movie: any): Promise<Movie> => {
  try {
    const { details, trailer, director, cast, similar, recommendations } = 
      await fetchMovieDetails(movie.id);

    return {
      id: movie.id.toString(),
      title: movie.title || movie.name,
      overview: movie.overview,
      posterUrl: getImageUrl(movie.poster_path, 'w500'),
      backdropUrl: getImageUrl(movie.backdrop_path, 'original'),
      trailerUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : '',
      rating: movie.vote_average,
      year: new Date(movie.release_date || movie.first_air_date).getFullYear(),
      duration: `${details.runtime || 120} min`,
      genres: details.genres?.map((g: any) => g.name) || [],
      cast: cast?.slice(0, 5).map((c: any) => c.name) || [],
      director: director?.name || 'Unknown',
      language: (movie.original_language || 'en').toUpperCase(),
      popularity: movie.popularity,
      voteCount: movie.vote_count,
      adult: movie.adult,
      releaseDate: movie.release_date || movie.first_air_date,
      similar: similar?.map((m: any) => ({
        id: m.id.toString(),
        title: m.title || m.name,
        posterUrl: getImageUrl(m.poster_path, 'w500'),
        year: new Date(m.release_date || m.first_air_date).getFullYear(),
      })),
      recommendations: recommendations?.map((m: any) => ({
        id: m.id.toString(),
        title: m.title || m.name,
        posterUrl: getImageUrl(m.poster_path, 'w500'),
        year: new Date(m.release_date || m.first_air_date).getFullYear(),
      }))
    };
  } catch (error) {
    console.error('Error transforming movie data:', error);
    return {
      id: movie.id.toString(),
      title: movie.title || movie.name,
      overview: movie.overview || '',
      posterUrl: getImageUrl(movie.poster_path, 'w500'),
      backdropUrl: getImageUrl(movie.backdrop_path, 'original'),
      trailerUrl: '',
      rating: movie.vote_average || 0,
      year: new Date(movie.release_date || movie.first_air_date).getFullYear(),
      duration: '120 min',
      genres: [],
      cast: [],
      director: 'Unknown',
      language: (movie.original_language || 'en').toUpperCase(),
      popularity: movie.popularity || 0,
      voteCount: movie.vote_count || 0,
      adult: movie.adult || false,
      releaseDate: movie.release_date || movie.first_air_date,
      similar: [],
      recommendations: []
    };
  }
};

const fetchContent = async (endpoint: string, params = {}) => {
  try {
    const response = await api.get(endpoint, { params });
    const content = await Promise.all(
      response.data.results.map(transformMovieData)
    );
    return content;
  } catch (error) {
    console.error(`Error fetching content from ${endpoint}:`, error);
    return [];
  }
};

export const movieApi = {
  // Movies
  getTrending: () => fetchContent('/trending/movie/week'),
  getPopular: () => fetchContent('/movie/popular'),
  getTopRated: () => fetchContent('/movie/top_rated'),
  getUpcoming: () => fetchContent('/movie/upcoming'),
  getNowPlaying: () => fetchContent('/movie/now_playing'),
  
  // TV Shows
  getTrendingShows: () => fetchContent('/trending/tv/week'),
  getPopularShows: () => fetchContent('/tv/popular'),
  getTopRatedShows: () => fetchContent('/tv/top_rated'),
  getAiringToday: () => fetchContent('/tv/airing_today'),
  
  // Genres
  getActionMovies: () => fetchContent('/discover/movie', { with_genres: 28 }),
  getComedyMovies: () => fetchContent('/discover/movie', { with_genres: 35 }),
  getDramaMovies: () => fetchContent('/discover/movie', { with_genres: 18 }),
  getHorrorMovies: () => fetchContent('/discover/movie', { with_genres: 27 }),
  getSciFiMovies: () => fetchContent('/discover/movie', { with_genres: 878 }),
  
  // Regional Content
  getBollywood: () => fetchContent('/discover/movie', { 
    with_original_language: 'hi',
    region: 'IN'
  }),
  getKoreanDramas: () => fetchContent('/discover/tv', {
    with_original_language: 'ko'
  }),
  getAnime: () => fetchContent('/discover/tv', {
    with_genres: 16,
    with_original_language: 'ja'
  }),
  
  // Search and Details
  searchContent: (query: string) => 
    fetchContent('/search/multi', { query }),
  getMovieDetails: (movieId: string) => 
    api.get(`/movie/${movieId}`).then(res => transformMovieData(res.data)),
  getRecommendations: (movieId: string) => 
    fetchContent(`/movie/${movieId}/recommendations`),
  getSimilar: (movieId: string) => 
    fetchContent(`/movie/${movieId}/similar`),
};