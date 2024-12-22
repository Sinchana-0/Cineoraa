import axios from 'axios';

export const TMDB_API_KEY = '2dca580c2a14b55200e784d157207b4d';
export const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
    append_to_response: 'videos,credits,similar,recommendations',
  },
});

export const getImageUrl = (path: string | null, size: string = 'original'): string => {
  if (!path) return '';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};