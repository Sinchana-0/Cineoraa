import { Movie } from '../../types/movie';
import { api, getImageUrl } from '../config/api';

const DEFAULT_BACKDROP = 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1920&q=80';
const DEFAULT_POSTER = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=500&q=80';

export const transformMovieData = async (movie: any): Promise<Movie> => {
  if (!movie) {
    throw new Error('Invalid movie data');
  }

  try {
    const [details, videos, credits] = await Promise.all([
      api.get(`/${movie.media_type || 'movie'}/${movie.id}`),
      api.get(`/${movie.media_type || 'movie'}/${movie.id}/videos`),
      api.get(`/${movie.media_type || 'movie'}/${movie.id}/credits`)
    ]);

    const trailer = videos.data.results.find(
      (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
    ) || videos.data.results[0];

    const director = credits.data.crew?.find(
      (person: any) => person.job === 'Director'
    );

    return {
      id: movie.id.toString(),
      title: movie.title || movie.name || 'Untitled',
      overview: movie.overview || 'No overview available',
      posterUrl: getImageUrl(movie.poster_path, 'w500') || DEFAULT_POSTER,
      backdropUrl: getImageUrl(movie.backdrop_path) || DEFAULT_BACKDROP,
      trailerUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : '',
      contentUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : '',
      rating: movie.vote_average || 0,
      year: new Date(movie.release_date || movie.first_air_date || Date.now()).getFullYear(),
      duration: `${details.data.runtime || 120} min`,
      genres: details.data.genres?.map((g: any) => g.name) || [],
      cast: credits.data.cast?.slice(0, 5).map((c: any) => c.name) || [],
      director: director?.name || 'Unknown',
      language: (movie.original_language || 'en').toUpperCase(),
      type: movie.media_type || 'movie'
    };
  } catch (error) {
    // Return fallback data if API calls fail
    return {
      id: movie.id.toString(),
      title: movie.title || movie.name || 'Untitled',
      overview: movie.overview || 'No overview available',
      posterUrl: getImageUrl(movie.poster_path, 'w500') || DEFAULT_POSTER,
      backdropUrl: getImageUrl(movie.backdrop_path) || DEFAULT_BACKDROP,
      trailerUrl: '',
      contentUrl: '',
      rating: movie.vote_average || 0,
      year: new Date(movie.release_date || movie.first_air_date || Date.now()).getFullYear(),
      duration: '120 min',
      genres: [],
      cast: [],
      director: 'Unknown',
      language: (movie.original_language || 'en').toUpperCase(),
      type: movie.media_type || 'movie'
    };
  }
};