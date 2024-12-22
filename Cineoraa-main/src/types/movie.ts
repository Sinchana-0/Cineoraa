export interface Movie {
  id: string;
  title: string;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
  rating: number;
  year: number;
  duration: string;
  genres: string[];
  cast: string[];
  director: string;
  language: string;
  popularity: number;
  voteCount: number;
  adult: boolean;
  releaseDate: string;
  similar?: {
    id: string;
    title: string;
    posterUrl: string;
    year: number;
  }[];
  recommendations?: {
    id: string;
    title: string;
    posterUrl: string;
    year: number;
  }[];
}