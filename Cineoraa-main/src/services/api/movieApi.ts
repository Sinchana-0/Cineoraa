import { Movie } from '../../types/movie';
import { api } from '../config/api';
import { transformMovieData } from '../transformers/movieTransformer';

const fetchContent = async (endpoint: string, params = {}): Promise<Movie[]> => {
  try {
    const response = await api.get(endpoint, { params });
    const validResults = response.data.results.filter((item: any) => 
      item && (item.media_type === 'movie' || item.media_type === 'tv' || !item.media_type)
    );
    
    const movies = await Promise.all(
      validResults.map((item: any) => transformMovieData(item).catch(() => null))
    );

    return movies.filter((movie): movie is Movie => movie !== null);
  } catch (error) {
    console.error(`Error fetching content from ${endpoint}:`, error);
    return [];
  }
};

export const movieApi = {
  getTrending: () => fetchContent('/trending/all/week'),
  getPopular: () => fetchContent('/movie/popular'),
  getTopRated: () => fetchContent('/movie/top_rated'),
  getUpcoming: () => fetchContent('/movie/upcoming'),
  getNowPlaying: () => fetchContent('/movie/now_playing'),
  getTrendingShows: () => fetchContent('/trending/tv/week'),
  getPopularShows: () => fetchContent('/tv/popular'),
  getTopRatedShows: () => fetchContent('/tv/top_rated'),
  getAiringToday: () => fetchContent('/tv/airing_today'),
  
  getMoviesByGenre: (genreId: number) => 
    fetchContent('/discover/movie', { with_genres: genreId }),
  
  getRegionalContent: (language: string, region?: string) => 
    fetchContent('/discover/movie', { 
      with_original_language: language,
      region,
      sort_by: 'popularity.desc'
    }),
  
  searchContent: (query: string) => 
    fetchContent('/search/multi', { 
      query,
      include_adult: false
    }),
  
  getMovieDetails: async (movieId: string): Promise<Movie | null> => {
    try {
      const response = await api.get(`/movie/${movieId}`);
      return transformMovieData(response.data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      return null;
    }
  },
  
  getRecommendations: (movieId: string) => 
    fetchContent(`/movie/${movieId}/recommendations`),
  
  getSimilar: (movieId: string) => 
    fetchContent(`/movie/${movieId}/similar`)
};