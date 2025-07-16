"use client"

import { useEffect } from "react";
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Star, ShoppingBag, Trash2, Share2, ArrowRight, Filter, Grid, List } from "lucide-react"
import Link from "next/link"
import { Header } from "../../../components/header"

export default function WishlistPage() {
  const [cartCount, setCartCount] = useState(2)
  const [wishlistCount, setWishlistCount] = useState(5)
  const [viewMode, setViewMode] = useState("grid")
  const [sortBy, setSortBy] = useState("newest")
const [wishlistItems, setWishlistItems] = useState([]);


useEffect(() => {
  const fetchWishlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/wishlist/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch wishlist");

      const data = await res.json();

      // Assuming data is an array of wishlist items from backend:
      setWishlistItems(data);
      setWishlistCount(data.length);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  fetchWishlist();
}, []);

  const removeFromWishlist = (id: number) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== id))
    setWishlistCount(wishlistCount - 1)
  }

  const moveToCart = (id: number) => {
    removeFromWishlist(id)
    setCartCount(cartCount + 1)
  }

  const EmptyWishlist = () => (
    <motion.div
      className="text-center py-20"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="w-32 h-32 mx-auto mb-8 bg-[#D4AF37]/10 rounded-full flex items-center justify-center"
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <Heart className="h-16 w-16 text-[#D4AF37]" />
      </motion.div>
      <h2 className="text-4xl font-bold text-[#111111] mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
        Your Wishlist is Empty
      </h2>
      <p className="text-xl text-gray-600 mb-8">Save your favorite pieces to keep track of items you love</p>
      <Link href="/collections">
        <Button className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 hover:from-yellow-500 hover:to-[#D4AF37] text-[#111111] px-8 py-3 text-lg font-bold rounded-full">
          Discover Jewelry
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </Link>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Inter, sans-serif" }}>
      <Header cartCount={cartCount} wishlistCount={wishlistCount} />

      <div>
        {/* Header */}
        <section className="py-12 bg-gradient-to-br from-[#111111] via-gray-900 to-[#111111] text-white">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 px-6 py-2 text-lg mb-6">
                Your Favorites
              </Badge>
              <h1 className="text-6xl font-bold mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
                Wishlist
              </h1>
              <p className="text-xl text-gray-300">
                {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved for later
              </p>
            </motion.div>
          </div>
        </section>

        {wishlistItems.length === 0 ? (
          <EmptyWishlist />
        ) : (
          <>
            {/* Filters and Controls */}
            <section className="py-8 bg-[#F5F5F5] border-b">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white bg-transparent"
                    >
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-2 border border-gray-200 rounded-lg focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="name">Name A-Z</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-gray-600">{wishlistItems.length} items</span>

                    <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className={viewMode === "grid" ? "bg-[#D4AF37] text-white" : ""}
                      >
                        <Grid className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className={viewMode === "list" ? "bg-[#D4AF37] text-white" : ""}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Wishlist Items */}
            <section className="py-12">
              <div className="container mx-auto px-4">
                <div
                  className={`grid gap-8 ${
                    viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
                  }`}
                >
                  <AnimatePresence>
                    {wishlistItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{
                          opacity: 0,
                          scale: 0.8,
                          transition: { duration: 0.3 },
                        }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ y: -10 }}
                        className="group"
                      >
                        <Card
                          className={`border-0 shadow-lg hover:shadow-xl transition-all duration-500 overflow-hidden bg-white ${
                            viewMode === "list" ? "flex flex-row" : ""
                          }`}
                        >
                          <div className={`relative overflow-hidden ${viewMode === "list" ? "w-1/3" : ""}`}>
                            <motion.img
                            src={item.images?.[0]}
  alt={item.name}
                              className={`object-cover ${viewMode === "list" ? "w-full h-64" : "w-full h-80"}`}
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.5 }}
                            />

                            <Badge className="absolute top-4 left-4 bg-[#D4AF37] text-[#111111] font-bold">
                              {item.badge}
                            </Badge>

                         

                            {/* Action Buttons */}
                            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <motion.button
                                className="p-2 bg-white/90 hover:bg-white rounded-full shadow-lg"
                                onClick={() => removeFromWishlist(item.id)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </motion.button>
                              <motion.button
                                className="p-2 bg-white/90 hover:bg-white rounded-full shadow-lg"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Share2 className="h-4 w-4 text-gray-600" />
                              </motion.button>
                            </div>

                            {/* Beating Heart Animation */}
                            <motion.div
                              className="absolute bottom-4 right-4"
                              animate={{
                                scale: [1, 1.2, 1],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                              }}
                            >
                              <Heart className="h-6 w-6 text-red-500 fill-current" />
                            </motion.div>
                          </div>

                          <CardContent className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                            <h3
                              className="font-bold text-xl text-[#111111] mb-2"
                              style={{ fontFamily: "Playfair Display, serif" }}
                            >
                              {item.name}
                            </h3>

                            <div className="flex items-center mb-4">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < item.rating ? "fill-[#D4AF37] text-[#D4AF37]" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>

                            <div className="flex items-center gap-3 mb-6">
                              <span className="text-2xl font-bold text-[#D4AF37]">${item.price.toLocaleString()}</span>
                              {item.originalPrice && (
                                <span className="text-lg text-gray-400 line-through">
                                  ${item.originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>

                            <div className={`space-y-3 ${viewMode === "list" ? "flex flex-col justify-end" : ""}`}>
                              <motion.button
                                className={`w-full py-3 rounded-full font-bold transition-all duration-500 ${
                                  item.stock
                                    ? "bg-gradient-to-r from-[#D4AF37] to-yellow-500 hover:from-yellow-500 hover:to-[#D4AF37] text-[#111111] shadow-lg hover:shadow-xl"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                                onClick={() => item.stock && moveToCart(item.id)}
                                disabled={!item.stock}
                                whileHover={item.stock ? { scale: 1.02 } : {}}
                                whileTap={item.stock ? { scale: 0.98 } : {}}
                              >
                                <ShoppingBag className="mr-2 h-5 w-5 inline" />
                                {item.stock ? "Move to Cart" : "Out of Stock"}
                              </motion.button>

                              <Link href={`/products/${item.id}`}>
                                <Button
                                  variant="outline"
                                  className="w-full border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white py-3 rounded-full font-bold bg-transparent"
                                >
                                  View Details
                                </Button>
                              </Link>
                            </div>

                          
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </section>

            {/* Quick Actions */}
            <section className="py-12 bg-[#F5F5F5]">
              <div className="container mx-auto px-4">
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <h2
                    className="text-3xl font-bold text-[#111111] mb-8"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    Quick Actions
                  </h2>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
                    <Button
                      className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 hover:from-yellow-500 hover:to-[#D4AF37] text-[#111111] px-8 py-3 text-lg font-bold rounded-full flex-1"
                      onClick={() => {
                        const stockItems = wishlistItems.filter((item) => item.stock)
                        setCartCount(cartCount + stockItems.length)
                        setWishlistItems(wishlistItems.filter((item) => !item.stock))
                        setWishlistCount(wishlistItems.filter((item) => !item.stock).length)
                      }}
                    >
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      Add All to Cart
                    </Button>

                    <Button
                      variant="outline"
                      className="border-2 border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500 px-8 py-3 text-lg font-bold rounded-full flex-1 bg-transparent"
                      onClick={() => {
                        setWishlistItems([])
                        setWishlistCount(0)
                      }}
                    >
                      <Trash2 className="mr-2 h-5 w-5" />
                      Clear Wishlist
                    </Button>
                  </div>
                </motion.div>
              </div>
            </section>
          </>
        )}

      
      </div>
    </div>
  )
}
