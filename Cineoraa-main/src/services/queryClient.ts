import { QueryClient } from 'react-query';
import toast from 'react-hot-toast';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
      onError: (error: Error) => {
        toast.error('Failed to fetch content. Please try again later.');
        console.error('Query Error:', error.message);
      }
    }
  }
});