import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface FavoritesState {
  favoriteMap: Record<string, true>;
  toggleFavorite: (productId: string) => void;
  clearFavorites: () => void;
  isFavorite: (productId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteMap: {},
      toggleFavorite: (productId) => {
        if (!productId) {
          return;
        }

        const current = get().favoriteMap;
        const next = { ...current };

        if (next[productId]) {
          delete next[productId];
        } else {
          next[productId] = true;
        }

        set({ favoriteMap: next });
      },
      clearFavorites: () => set({ favoriteMap: {} }),
      isFavorite: (productId) => Boolean(get().favoriteMap[productId])
    }),
    {
      name: 'innovation-brindes-favorites',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
