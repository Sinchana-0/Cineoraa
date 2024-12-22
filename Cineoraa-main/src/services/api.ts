import axios from 'axios';
import { Movie } from '../types/movie';

const TMDB_API_KEY = '2dca580c2a14b55200e784d157207b4d';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
    append_to_response: 'videos,credits,similar,recommendations',
  },
});

export const getImageUrl = (path: string, size: string = 'original') => 
  path ? `${IMAGE_BASE_URL}/${size}${path}` : '';

const transformMovieData = async (movie: any): Promise<Movie> => {
  try {
    const details = await api.get(`/movie/${movie.id}`);
    const videos = await api.get(`/movie/${movie.id}/videos`);
    const credits = await api.get(`/movie/${movie.id}/credits`);

    const trailer = videos.data.results.find(
      (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
    ) || videos.data.results[0];

    const director = credits.data.crew.find(
      (person: any) => person.job === 'Director'
    );

    return {
      id: movie.id.toString(),
      title: movie.title || movie.name,
      overview: movie.overview,
      posterUrl: getImageUrl(movie.poster_path, 'w500'),
      backdropUrl: getImageUrl(movie.backdrop_path, 'original'),
      trailerUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : '',
      contentUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : '',
      rating: movie.vote_average || 0,
      year: new Date(movie.release_date || movie.first_air_date).getFullYear(),
      duration: `${details.data.runtime || 120} min`,
      genres: details.data.genres?.map((g: any) => g.name) || [],
      cast: credits.data.cast?.slice(0, 5).map((c: any) => c.name) || [],
      director: director?.name || 'Unknown',
      language: (movie.original_language || 'en').toUpperCase(),
      type: movie.media_type || 'movie'
    };
  } catch (error) {
    // Fallback data if API calls fail
    return {
      id: movie.id.toString(),
      title: movie.title || movie.name,
      overview: movie.overview || '',
      posterUrl: getImageUrl(movie.poster_path, 'w500'),
      backdropUrl: getImageUrl(movie.backdrop_path, 'original'),
      trailerUrl: '',
      contentUrl: '',
      rating: movie.vote_average || 0,
      year: new Date(movie.release_date || movie.first_air_date).getFullYear(),
      duration: '120 min',
      genres: [],
      cast: [],
      director: 'Unknown',
      language: (movie.original_language || 'en').toUpperCase(),
      type: movie.media_type || 'movie'
    };
  }
};

export const fetchTrending = async () => {
  try {
    const response = await api.get('/trending/all/week');
    const movies = await Promise.all(
      response.data.results.map(transformMovieData)
    );
    return movies;
  } catch (error) {
    console.error('Error fetching trending:', error);
    return [];
  }
};

export const fetchIndianContent = async () => {
  try {
    const response = await api.get('/discover/movie', {
      params: {
        with_original_language: 'hi,te,ta,ml,bn,kn',
        sort_by: 'popularity.desc',
      }
    });
    const movies = await Promise.all(
      response.data.results.map(transformMovieData)
    );
    return movies;
  } catch (error) {
    console.error('Error fetching Indian content:', error);
    return [];
  }
};

export const fetchKidsContent = async () => {
  try {
    const response = await api.get('/discover/movie', {
      params: {
        with_genres: '16,10751',
        include_adult: false
      }
    });
    const movies = await Promise.all(
      response.data.results.map(transformMovieData)
    );
    return movies;
  } catch (error) {
    console.error('Error fetching kids content:', error);
    return [];
  }
};

export const fetchTVShows = async () => {
  try {
    const response = await api.get('/discover/tv', {
      params: {
        sort_by: 'popularity.desc',
        include_adult: false
      }
    });
    const shows = await Promise.all(
      response.data.results.map(transformMovieData)
    );
    return shows;
  } catch (error) {
    console.error('Error fetching TV shows:', error);
    return [];
  }
};

export const searchMovies = async (query: string) => {
  try {
    const response = await api.get('/search/multi', {
      params: {
        query,
        include_adult: false
      }
    });
    const results = await Promise.all(
      response.data.results
        .filter((item: any) => item.media_type !== 'person')
        .map(transformMovieData)
    );
    return results;
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
};

export const fetchRecommendations = async (movieId: string) => {
  try {
    const response = await api.get(`/movie/${movieId}/recommendations`);
    const movies = await Promise.all(
      response.data.results.map(transformMovieData)
    );
    return movies;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
};