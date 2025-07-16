import { create } from "zustand";

interface WishlistItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  image: string;
  size?: string;
}

interface WishlistState {
  wishlistItems: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  setWishlistItems: (items: WishlistItem[]) => void;
}

export const useWishlistStore = create<WishlistState>((set) => ({
  wishlistItems: [],
  addToWishlist: (item) =>
    set((state) => ({
      wishlistItems: [...state.wishlistItems, item],
    })),
  setWishlistItems: (items) => set({ wishlistItems: items }),
}));
