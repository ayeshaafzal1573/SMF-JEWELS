// In store/cart.ts
import { create } from "zustand";
import axios from "@/utils/axios";
import { toast } from "react-hot-toast";
import axiosInstance from "@/utils/axios";

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
  addToCart: (product: Omit<CartItem, "id">) => Promise<void>;
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
    const userId = localStorage.getItem("user_id");
    if (!userId) {
      toast.error("User ID not found. Please log in.");
      return;
    }
  const payload = {
  user_id: userId,
  product_id: product.product_id, 
  quantity: Math.max(1, parseInt(product.quantity, 10)),
};

await axiosInstance.post("/cart/", {
  user_id,
  product_id,
  quantity,
});


    await get().fetchCart();
    toast.success("Item added to cart");
  } catch (err: any) {
    console.error("Add to cart error:", err.response?.data);
    if (err.response?.status === 401) {
      toast.error("Please log in to add items to cart");
    } else if (err.response?.status === 404) {
      toast.error(err.response.data.detail || "Product not found");
    } else if (err.response?.status === 422) {
      toast.error(err.response.data.detail || "Invalid request data");
      console.log("Validation errors:", JSON.stringify(err.response.data, null, 2));
    } else {
      toast.error(err.response?.data?.detail || "Failed to add to cart");
    }
  }
},
  updateCartItem: async (productId, quantity) => {
    try {
      await axios.put(`/cart/update-cart/${productId}`, { quantity });
      await get().fetchCart();
      toast.success("Cart updated");
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 401) {
        toast.error("Please log in to update cart");
      } else if (err.response?.status === 404) {
        toast.error(err.response.data.detail || "Cart item not found");
      } else {
        toast.error(err.response?.data?.detail || "Failed to update cart");
      }
    }
  },

  removeFromCart: async (productId) => {
    try {
      await axios.delete(`/cart/remove-from-cart/${productId}`);
      await get().fetchCart();
      toast.success("Item removed");
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 401) {
        toast.error("Please log in to remove items from cart");
      } else {
        toast.error(err.response?.data?.detail || "Failed to remove from cart");
      }
    }
  },
}));