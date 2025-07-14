"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/stores/useCartStore";
import { toast } from "react-hot-toast";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Float } from "@react-three/drei";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  Star,
  Share2,
  ShoppingBag,
  Truck,
  Shield,
  RotateCcw,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
} from "lucide-react";
import { Header } from "../../../components/header";
import { useParams } from "next/navigation";


export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id;
  const [cartCount, setCartCount] = useState(2);
  const [wishlistCount, setWishlistCount] = useState(5);
  const [selectedImage, setSelectedImage] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    console.log("Current product state:", product);
  }, [product]);

 useEffect(() => {
  let isMounted = true;
  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${productId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched product:", data);
      const productData = { ...data, id: data._id || productId };
      if (isMounted) {
        setProduct(productData);
        console.log("Set product state:", productData);
        if (data.images && data.images.length > 0) {
          setSelectedImage(1);
        }
      }
    } catch (e) {
      console.error("Failed to fetch product:", e);
      if (isMounted) {
        setError("Failed to load product details.");
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  if (productId) {
    fetchProduct();
  }

  return () => {
    isMounted = false;
  };
}, [productId]);
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/all`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRelatedProducts(data.slice(0, 3));
      } catch (e) {
        console.error("Failed to fetch related products:", e);
      }
    };
    fetchRelatedProducts();
  }, []);

  const handleAddToCart = useCallback(async () => {
    console.log("Product state before validation:", product);
    if (!product || !product.id) {
      toast.error("Invalid product data: missing product or product ID");
      console.log("Invalid product data:", { product });
      return;
    }
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("user_id");
    console.log("Auth details:", { token, userId });
    if (!token || !userId) {
      toast.error("Please log in to add items to cart");
      return;
    }
    try {
     await useCartStore.getState().addToCart({
  product_id: product._id,  // Instead of product.id if product._id exists
  quantity: quantity,
  name: product.name,
  price: product.price,
  image: product.images?.[0] || "/placeholder.svg",
  inStock: product.stock > 0,
});
      console.log("Item added to cart successfully");
      setCartCount((prev) => prev + quantity);
      toast.success("Item added to cart");
    } catch (e) {
      console.error("Failed to add to cart:", e);
      toast.error("Failed to add to cart");
    }
  }, [product, quantity]);

  const handleWishlist = async () => {
    if (!product || !product.id) {
      toast.error("Invalid product data");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to manage wishlist");
      return;
    }
    const endpoint = isWishlisted ? "/api/wishlist/remove" : "/api/wishlist/add";
    const method = isWishlisted ? "DELETE" : "POST";

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product.id }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setIsWishlisted(!isWishlisted);
      setWishlistCount(isWishlisted ? wishlistCount - 1 : wishlistCount + 1);
      toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
    } catch (e) {
      console.error("Failed to update wishlist:", e);
      toast.error("Failed to update wishlist");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-700">
        Loading product details... 🚀
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-red-600">
        Error: {error} ❌
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-700">
        Product not found. 🤷‍♀️
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Inter, sans-serif" }}>
      <Header cartCount={cartCount} wishlistCount={wishlistCount} />
      <div>
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div className="space-y-6">
                <motion.div
                  className="relative aspect-square bg-[#F5F5F5] rounded-2xl overflow-hidden"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <AnimatePresence mode="wait">
                    {selectedImage === 0 ? (
                      <motion.div
                        key="3d-view"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Canvas>
                        
                          <OrbitControls />
                          <Environment preset="studio" />
                        </Canvas>
                      </motion.div>
                    ) : (
                      <motion.img
                        key={`image-${selectedImage}`}
                        src={product.images[selectedImage - 1] || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.5 }}
                      />
                    )}
                  </AnimatePresence>

                  <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-white/80 hover:bg-white rounded-full shadow-lg"
                      onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : product.images.length)}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-white/80 hover:bg-white rounded-full shadow-lg"
                      onClick={() => setSelectedImage(selectedImage < product.images.length ? selectedImage + 1 : 0)}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <Button variant="ghost" size="icon" className="bg-white/80 hover:bg-white rounded-full shadow-lg">
                      <ZoomIn className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="bg-white/80 hover:bg-white rounded-full shadow-lg">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </motion.div>

                <div className="flex gap-4 overflow-x-auto pb-2">
                  <motion.button
                    key="3d-view"
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === 0 ? "border-[#D4AF37]" : "border-gray-200"
                    }`}
                    onClick={() => setSelectedImage(0)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src="/3d-placeholder.svg"
                      alt="3D View"
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                  {product.images.map((image, index) => (
                    <motion.button
                      key={index}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        selectedImage === index + 1 ? "border-[#D4AF37]" : "border-gray-200"
                      }`}
                      onClick={() => setSelectedImage(index + 1)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              </div>

              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <Badge className="bg-[#D4AF37] text-[#111111] font-bold">
                      {product.category?.name === "Uncategorized" ? "Jewelry" : product.category?.name}
                    </Badge>
                    <div className="flex items-center">
                      {[...Array(product.rating || 5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]" />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">({product.reviews || 0} reviews)</span>
                    </div>
                  </div>

                  <h1
                    className="text-4xl font-bold text-[#111111] mb-4"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    {product.name}
                  </h1>

                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-4xl font-bold text-[#D4AF37]">${product.price.toLocaleString()}</span>
                  </div>

                  <p className="text-lg text-gray-600 leading-relaxed">{product.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-[#111111] mb-4">Quantity</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="px-4 py-2 font-semibold">{quantity}</span>
                      <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <span className="text-sm text-gray-600">{product.stock > 0 ? "In Stock" : "Out of Stock"}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Button
                      className="flex-1 bg-gradient-to-r from-[#D4AF37] to-yellow-500 hover:from-yellow-500 hover:to-[#D4AF37] text-[#111111] py-4 text-lg font-bold rounded-full transition-all duration-500 shadow-xl hover:shadow-2xl"
                      onClick={handleAddToCart}
                      disabled={product.stock <= 0}
                    >
                      <ShoppingBag className="mr-3 h-5 w-5" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className={`p-4 border-2 rounded-full transition-all duration-300 ${
                        isWishlisted
                          ? "border-red-500 bg-red-50 text-red-500"
                          : "border-gray-200 hover:border-[#D4AF37] hover:text-[#D4AF37]"
                      }`}
                      onClick={handleWishlist}
                    >
                      <Heart className={`h-6 w-6 ${isWishlisted ? "fill-current" : ""}`} />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { icon: Truck, text: "Free Shipping" },
                    { icon: Shield, text: "Lifetime Warranty" },
                    { icon: RotateCcw, text: "30-Day Returns" },
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-[#F5F5F5] rounded-lg">
                      <feature.icon className="h-5 w-5 text-[#D4AF37]" />
                      <span className="text-sm font-medium text-gray-700">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-2">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="reviews" className="w-full">
              <TabsList className="grid w-full grid-cols-12 mb-8">
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="reviews">
                <Card className="p-8">
                  <h3
                    className="text-2xl font-bold text-[#111111] mb-6"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    Customer Reviews
                  </h3>
                  <div className="space-y-6">
                    {[
                      {
                        name: "Sarah Johnson",
                        rating: 5,
                        date: "2 weeks ago",
                        review:
                          "Absolutely stunning ring! The quality is exceptional and the diamond sparkles beautifully.",
                      },
                      {
                        name: "Michael Chen",
                        rating: 5,
                        date: "1 month ago",
                        review: "Perfect engagement ring. The craftsmanship is outstanding and my fiancée loves it.",
                      },
                    ].map((review, index) => (
                      <div key={index} className="border-b border-gray-200 pb-6">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-4">
                            <span className="font-semibold text-[#111111]">{review.name}</span>
                            <div className="flex">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]" />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-gray-600">{review.review}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-[#111111] mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
                You May Also Like
              </h2>
              <p className="text-xl text-gray-600">Discover more pieces from our curated collection</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map((product, index) => (
                <motion.div
                  key={product.id || index}
                  className="group cursor-pointer"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="relative overflow-hidden">
                      <img
                        src={product.images?.[0] || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      >
                        <Heart className="h-5 w-5" />
                      </Button>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg text-[#111111] mb-2">{product.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-[#D4AF37]">${product.price.toLocaleString()}</span>
                        <div className="flex">
                          {[...Array(product.rating || 5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]" />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}