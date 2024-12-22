import axios from 'axios';
import { Movie } from '../../types/movie';
import { transformMovieDetails } from './transformers';

const TMDB_API_KEY = '2dca580c2a14b55200e784d157207b4d';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
  headers: {
    'Accept': 'application/json'
  }
});

export const getImageUrl = (path: string, size: string = 'original') => 
  path ? `${IMAGE_BASE_URL}/${size}${path}` : '';

export const fetchMovieDetails = async (movieId: string | number): Promise<Movie | null> => {
  try {
    const [details, videos, credits] = await Promise.all([
      api.get(`/movie/${movieId}?append_to_response=similar,recommendations`),
      api.get(`/movie/${movieId}/videos`),
      api.get(`/movie/${movieId}/credits`)
    ]);

    if (!details.data) {
      throw new Error('No movie details found');
    }

    return transformMovieDetails(
      details.data,
      details.data,
      videos.data.results || [],
      credits.data
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching movie details:', {
        status: error.response?.status,
        message: error.message,
        movieId
      });
    } else {
      console.error('Error fetching movie details:', error);
    }
    return null;
  }
};

export const fetchMovies = async (endpoint: string, params = {}): Promise<Movie[]> => {
  try {
    const response = await api.get(endpoint, { params });
    const movies = await Promise.all(
      response.data.results.map(async (movie: any) => {
        const details = await fetchMovieDetails(movie.id);
        return details || transformMovieDetails(movie, movie, [], { cast: [], crew: [] });
      })
    );
    return movies.filter((movie): movie is Movie => movie !== null);
  } catch (error) {
    console.error(`Error fetching movies from ${endpoint}:`, error);
    return [];
  }
};