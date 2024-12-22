import { Movie } from '../../types/movie';
import { getImageUrl } from './tmdb';

const DEFAULT_BACKDROP = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80';
const DEFAULT_POSTER = 'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80';

export const transformMovieBasic = (movie: any): Partial<Movie> => ({
  id: movie.id.toString(),
  title: movie.title || movie.name || 'Untitled',
  overview: movie.overview || 'No overview available',
  posterUrl: getImageUrl(movie.poster_path, 'w500') || DEFAULT_POSTER,
  backdropUrl: getImageUrl(movie.backdrop_path, 'original') || DEFAULT_BACKDROP,
  rating: movie.vote_average || 0,
  year: new Date(movie.release_date || movie.first_air_date || Date.now()).getFullYear(),
  language: (movie.original_language || 'en').toUpperCase(),
  popularity: movie.popularity || 0,
  voteCount: movie.vote_count || 0,
  adult: movie.adult || false,
  releaseDate: movie.release_date || movie.first_air_date || new Date().toISOString(),
  trailerUrl: '',
  duration: '0 min',
  genres: [],
  cast: [],
  director: 'Unknown'
});

export const transformMovieDetails = (
  movie: any,
  details: any,
  videos: any[],
  credits: any
): Movie => {
  const trailer = videos.find(
    (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
  ) || videos[0];

  const director = credits.crew?.find(
    (person: any) => person.job === 'Director'
  );

  const transformed = {
    ...transformMovieBasic(movie),
    trailerUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : '',
    duration: `${details.runtime || 0} min`,
    genres: details.genres?.map((g: any) => g.name) || [],
    cast: credits.cast?.slice(0, 5).map((c: any) => c.name) || [],
    director: director?.name || 'Unknown',
    similar: details.similar?.results?.map(transformMovieBasic) || [],
    recommendations: details.recommendations?.results?.map(transformMovieBasic) || []
  };

  return transformed as Movie;
};