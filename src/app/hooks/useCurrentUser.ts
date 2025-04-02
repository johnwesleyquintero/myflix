import { useCallback } from 'react';
import axios from 'axios';

export default function useCurrentUser() {
  return {
    data: {
      favoriteIds: [] as string[]
    },
    mutate: () => {}
  };
}