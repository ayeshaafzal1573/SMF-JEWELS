"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Plus,
  Minus,
  Heart,
  ShoppingBag,
  Truck,
  Shield,
  Percent,
  CreditCard,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { Header } from "../../../components/header";
import { useCartStore } from "@/stores/useCartStore";
import { useWishlistStore } from "@/stores/useWishlistStore";

import Image from "next/image";
import { toast } from "react-hot-toast";

export default function CartPage() {
  const {
    cartItems,
    isLoading,
    fetchCart,
    updateCartItem,
    removeFromCart,
  } = useCartStore();

  const [promoCode, setPromoCode] = useState("");
  const [wishlistCount, setWishlistCount] = useState(5);

const { addToWishlist } = useWishlistStore();
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateQuantity = (productId: string | undefined, newQuantity: number) => {
    if (!productId) {
      console.error("Product ID is missing");
      toast.error("Product ID is missing. Cannot update cart item.");
      return;
    }
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    updateCartItem(productId, newQuantity);
  };

  // Calculate cart totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 1),
    0
  );

  const savings = cartItems.reduce(
    (sum, item) => {
      const originalPrice = Number(item.originalPrice) || Number(item.price) || 0;
      const currentPrice = Number(item.price) || 0;
      return sum + (originalPrice - currentPrice) * (item.quantity || 1);
    },
    0
  );

  const shipping = subtotal > 1000 ? 0 : 50;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const EmptyCart = () => (
    <motion.div
      className="text-center py-20"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <ShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
      <h3 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h3>
      <p className="mt-1 text-gray-500">Start adding some items to your cart</p>
      <Link href="/products">
        <Button className="mt-6 bg-[#D4AF37] hover:bg-[#D4AF37]/90">
          Continue Shopping
        </Button>
      </Link>
    </motion.div>
  );

const moveToWishlist = (productId: string) => {
  const product = cartItems.find(item => item.product_id === productId);

  if (!product) {
    toast.error("Product not found in cart.");
    return;
  }

  addToWishlist(product);
  removeFromCart(productId);
  toast.success("Moved to wishlist!");
};


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Inter, sans-serif" }}>
      <Header cartCount={cartItems.length} wishlistCount={wishlistCount} />

      <div>
        <section className="py-12 bg-[#F5F5F5]">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl font-bold text-[#111111] mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
                Shopping Cart
              </h1>
              <p className="text-xl text-gray-600">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
              </p>
            </motion.div>
          </div>
        </section>

        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-6">
                  <AnimatePresence>
                    {cartItems.map((item, index) => {
                      const productPrice = Number(item.price) || 0;
                      const originalPrice = Number(item.originalPrice) || productPrice;
                      const isOnSale = originalPrice > productPrice;

                      return (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -300 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          whileHover={{ y: -5 }}
                        >
                          <Card className="p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-0">
                            <div className="flex gap-6">
                              <div className="relative w-32 h-32">
                                <Image
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name || "Product"}
                                  fill
                                  className="object-cover rounded-lg"
                                />
                                {isOnSale && (
                                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                                    SALE
                                  </Badge>
                                )}
                              </div>

                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-4">
                                  <div>
                                    <h3 className="text-xl font-bold text-[#111111] mb-2">
                                      {item.name || "Product"}
                                    </h3>
                                    {item.size && <p className="text-gray-600">Size: {item.size}</p>}
                                    <div className="flex items-center gap-2 mt-2">
                                      <span className="text-2xl font-bold text-[#D4AF37]">
                                        ${productPrice.toFixed(2)}
                                      </span>
                                      {isOnSale && (
                                        <span className="text-lg text-gray-400 line-through">
                                          ${originalPrice.toFixed(2)}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex gap-2">
                                    <motion.button
                                      className="p-2 text-gray-400 hover:text-[#D4AF37] transition-colors"
                                      onClick={() => moveToWishlist(item.product_id)}
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      <Heart className="h-5 w-5" />
                                    </motion.button>
                                    <motion.button
                                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                      onClick={() => removeFromCart(item.product_id)}
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      <Trash2 className="h-5 w-5" />
                                    </motion.button>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center border border-gray-200 rounded-lg">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                      className="h-10 w-10"
                                      disabled={item.quantity <= 1}
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
                                      {item.quantity}
                                    </span>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                      className="h-10 w-10"
                                      disabled={item.inStock === false}
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </div>

                                  <div className="text-right">
                                    <p className="text-sm text-gray-600">Subtotal</p>
                                    <p className="text-xl font-bold text-[#111111]">
                                      ${(productPrice * item.quantity).toFixed(2)}
                                    </p>
                                  </div>
                                </div>

                                {item.inStock !== undefined && (
                                  <div className="mt-4">
                                    <div className="flex items-center gap-2">
                                      <div
                                        className={`w-2 h-2 rounded-full ${
                                          item.inStock ? "bg-green-500" : "bg-red-500"
                                        }`}
                                      ></div>
                                      <span
                                        className={`text-sm ${
                                          item.inStock ? "text-green-600" : "text-red-600"
                                        }`}
                                      >
                                        {item.inStock ? "In Stock" : "Out of Stock"}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    <Card className="p-6 border-0 shadow-lg">
                      <h3 className="text-lg font-semibold text-[#111111] mb-4">Promo Code</h3>
                      <div className="flex gap-4">
                        <Input
                          placeholder="Enter promo code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="flex-1 border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                        />
                        <Button
                          variant="outline"
                          className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white bg-transparent"
                        >
                          <Percent className="mr-2 h-4 w-4" />
                          Apply
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                </div>

                <motion.div
                  className="lg:col-span-1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <div className="sticky top-8 space-y-6">
                    <Card className="p-8 border-0 shadow-xl">
                      <h2
                        className="text-2xl font-bold text-[#111111] mb-6"
                        style={{ fontFamily: "Playfair Display, serif" }}
                      >
                        Order Summary
                      </h2>

                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-semibold">${subtotal.toFixed(2)}</span>
                        </div>

                        {savings > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Savings</span>
                            <span className="font-semibold">-${savings.toFixed(2)}</span>
                          </div>
                        )}

                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping</span>
                          <span className="font-semibold">{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax</span>
                          <span className="font-semibold">${tax.toFixed(2)}</span>
                        </div>

                        <div className="border-t pt-4">
                          <div className="flex justify-between text-xl font-bold">
                            <span className="text-[#111111]">Total</span>
                            <span className="text-[#D4AF37]">${total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {shipping > 0 && subtotal < 1000 && (
                        <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg p-4 mb-6">
                          <div className="flex items-center gap-2 text-[#D4AF37]">
                            <Truck className="h-4 w-4" />
                            <span className="text-sm font-semibold">
                              Add ${(1000 - subtotal).toFixed(2)} more for FREE shipping
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="space-y-4">
                        <Link href="/checkout">
                          <motion.button
                            className="w-full bg-gradient-to-r from-[#D4AF37] to-yellow-500 hover:from-yellow-500 hover:to-[#D4AF37] text-[#111111] py-4 text-lg font-bold rounded-full transition-all duration-500 shadow-xl hover:shadow-2xl flex items-center justify-center"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Lock className="mr-3 h-5 w-5" />
                            Secure Checkout
                          </motion.button>
                        </Link>

                        <Button
                          variant="outline"
                          className="w-full border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white py-4 text-lg font-bold rounded-full bg-transparent"
                        >
                          <CreditCard className="mr-3 h-5 w-5" />
                          Express Pay
                        </Button>
                      </div>

                      <div className="mt-6 pt-6 border-t">
                        <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-[#D4AF37]" />
                            <span>Secure Payment</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-[#D4AF37]" />
                            <span>Free Returns</span>
                          </div>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6 border-0 shadow-lg bg-[#F5F5F5]">
                      <h3 className="text-lg font-semibold text-[#111111] mb-4">Why Shop With Us</h3>
                      <div className="space-y-3">
                        {[
                          { icon: Shield, text: "Lifetime Warranty" },
                          { icon: Truck, text: "Free Insured Shipping" },
                          { icon: Heart, text: "30-Day Returns" },
                        ].map((feature, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <feature.icon className="h-5 w-5 text-[#D4AF37]" />
                            <span className="text-gray-700">{feature.text}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}