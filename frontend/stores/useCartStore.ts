import { create } from "zustand";
import axios from "@/utils/axios";
import { toast } from "react-hot-toast";

interface CartItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  originalPrice?: number;
  inStock?: boolean;
}

interface CartState {
  cartItems: CartItem[];
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (product: Omit<CartItem, 'id'>) => Promise<void>;
  updateCartItem: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const res = await axios.get("/cart/get-cart"); 
      set({ cartItems: res.data || [] }); 
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Failed to load cart");
    } finally {
      set({ isLoading: false });
    }
  },

  addToCart: async (product) => {
    try {
      await axios.post("/cart", { // Changed from "/cart/" to match your FastAPI route
        product_id: product.product_id,
        quantity: product.quantity,
      });
      await get().fetchCart();
      toast.success("Item added to cart");
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 400) {
        toast.error(err.response.data.detail);
      } else {
        toast.error(err.response?.data?.detail || "Failed to add to cart");
      }
    }
  },

  updateCartItem: async (productId, quantity) => {
    try {
      await axios.put(`/cart/update-cart/${productId}`, { quantity }); // Changed from "/cart/" to match your FastAPI route
      await get().fetchCart();
      toast.success("Cart updated");
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 400) {
        toast.error(err.response.data.detail);
      } else {
        toast.error(err.response?.data?.detail || "Failed to update cart");
      }
    }
  },

  removeFromCart: async (productId) => {
    try {
      await axios.delete(`/cart/remove-from-cart/${productId}`); // Changed from "/cart/" to match your FastAPI route
      await get().fetchCart();
      toast.success("Item removed");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Failed to remove from cart");
    }
  },
}));