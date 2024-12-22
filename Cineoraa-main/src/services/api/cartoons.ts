import { api } from './tmdb';
import { transformMovieBasic } from './transformers';

// Cartoon/Animation specific genre IDs from TMDb
const ANIMATION_ID = 16;
const FAMILY_ID = 10751;

export const cartoonService = {
  getPopularCartoons: async () => {
    try {
      const response = await api.get('/discover/tv', {
        params: {
          with_genres: ANIMATION_ID,
          sort_by: 'popularity.desc',
          include_adult: false
        }
      });
      return response.data.results.map(transformMovieBasic);
    } catch (error) {
      console.error('Error fetching cartoons:', error);
      return [];
    }
  },

  getClassicCartoons: async () => {
    try {
      const response = await api.get('/discover/tv', {
        params: {
          with_genres: `${ANIMATION_ID},${FAMILY_ID}`,
          'first_air_date.lte': '2000-12-31',
          'sort_by': 'vote_average.desc',
          'vote_count.gte': 100
        }
      });
      return response.data.results.map(transformMovieBasic);
    } catch (error) {
      console.error('Error fetching classic cartoons:', error);
      return [];
    }
  },

  getAnimeShows: async () => {
    try {
      const response = await api.get('/discover/tv', {
        params: {
          with_genres: ANIMATION_ID,
          with_original_language: 'ja',
          sort_by: 'popularity.desc'
        }
      });
      return response.data.results.map(transformMovieBasic);
    } catch (error) {
      console.error('Error fetching anime:', error);
      return [];
    }
  }
};