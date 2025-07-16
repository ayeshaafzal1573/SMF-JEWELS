import { create } from "zustand";
import axios from "@/utils/axios";
import { toast } from "react-hot-toast";
import axiosInstance from "@/utils/axios";
import { debounce } from "lodash";

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
      const transformedItems = res.data.map((item: any) => ({
        id: item._id,
        product_id: item.product_id,
        name: item.product?.name || "Unknown Product",
        price: Number(item.product?.price) || 0,
        quantity: item.quantity || 1,
        image: item.product?.images?.[0] || "/placeholder.svg",
        size: item.product?.size || undefined,
        originalPrice: Number(item.product?.originalPrice) || Number(item.product?.price) || 0,
        inStock: item.product?.stock > 0,
      }));
      console.log("Transformed cart items:", transformedItems);
      set({ cartItems: transformedItems || [] });
    } catch (err: any) {
      console.error("Fetch cart error:", err);
      toast.error(err.response?.data?.detail || "Failed to load cart");
    } finally {
      set({ isLoading: false });
    }
  },

  addToCart: async (product: Omit<CartItem, "id">) => {
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        toast.error("User ID not found. Please log in.");
        return;
      }
      if (!product.product_id || product.product_id === "undefined" || !/^[0-9a-fA-F]{24}$/.test(product.product_id)) {
        console.error("Invalid product_id:", product);
        toast.error("Invalid or missing product ID. Cannot add to cart.");
        return;
      }
      const payload = {
        user_id: userId,
        product_id: product.product_id,
        name: product.name || "Unknown Product",
        price: Number(product.price) || 0,
        image: product.image || "/placeholder.svg",
        quantity: Math.max(1, Number(product.quantity) || 1),
        size: product.size || undefined,
        originalPrice: Number(product.originalPrice) || Number(product.price) || 0,
        inStock: product.inStock !== undefined ? product.inStock : true,
      };
      console.log("Adding to cart:", payload);
      await axiosInstance.post("/cart/", payload);
      await get().fetchCart();
      toast.success("Item added to cart");
    } catch (err: any) {
      console.error("Add to cart error:", err.response?.data);
      if (err.response?.status === 401) {
        toast.error("Please log in to add items to cart");
      } else if (err.response?.status === 404) {
        toast.error(err.response.data.detail || "Product not found");
      } else if (err.response?.status === 422) {
        toast.error(err.response.data.detail || "Invalid product ID or request data");
        console.log("Validation errors:", JSON.stringify(err.response.data, null, 2));
      } else {
        toast.error(err.response?.data?.detail || "Failed to add to cart");
      }
    }
  },

  updateCartItem: debounce(async (productId: string, quantity: number) => {
    if (!productId || productId === "undefined") {
      console.error("Invalid productId for update:", productId);
      toast.error("Invalid product ID. Cannot update cart.");
      return;
    }
    const previousCart = get().cartItems;
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.product_id === productId ? { ...item, quantity } : item
      ),
    }));
    try {
      await axios.put(`/cart/update-cart/${productId}`, { quantity });
      toast.success("Cart updated");
    } catch (err: any) {
      set({ cartItems: previousCart });
      console.error("Update error:", err);
      if (err.response?.status === 401) {
        toast.error("Please log in to update cart");
      } else if (err.response?.status === 404) {
        toast.error(err.response.data.detail || "Cart item not found");
      } else {
        toast.error(err.response?.data?.detail || "Failed to update cart");
      }
      await get().fetchCart();
    }
  }, 300),

  removeFromCart: debounce(async (productId: string) => {
    if (!productId || productId === "undefined") {
      console.error("Invalid productId for remove:", productId);
      toast.error("Invalid product ID. Cannot remove from cart.");
      return;
    }
    const previousCart = get().cartItems;
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.product_id !== productId),
    }));
    try {
      console.log("Removing product_id:", productId);
      await axios.delete(`/cart/remove-from-cart/${productId}`);
      toast.success("Item removed");
    } catch (err: any) {
      set({ cartItems: previousCart });
      console.error("Remove error:", err);
      if (err.response?.status === 401) {
        toast.error("Please log in to remove items from cart");
      } else {
        toast.error(err.response?.data?.detail || "Failed to remove from cart");
      }
      await get().fetchCart();
    }
  }, 300),
}));