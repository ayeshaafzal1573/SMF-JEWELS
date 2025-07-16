"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/stores/useCartStore";
import toast from "react-hot-toast"; // Changed to default import
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
  Loader2,
  Link, // Added for loading spinner
} from "lucide-react";
import { Header } from "../../../components/header";
import { useParams } from "next/navigation";

// Define an interface for your product data for better type safety
interface Product {
  id: string; // From _id
  name: string;
  price: number;
  description: string;
  images: string[];
  stock: number;
  category?: { name: string };
  rating?: number; // Optional, assuming it might not always be present
  reviews?: number; // Optional
  originalPrice?: number; // Optional
  // Add any other fields your product API returns
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string; // Ensure productId is a string
  const [cartCount, setCartCount] = useState(0); // Initialize from global state if available
  const [wishlistCount, setWishlistCount] = useState(0); // Initialize from global state/fetch
  const [selectedImage, setSelectedImage] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [product, setProduct] = useState<Product | null>(null); // Use Product interface
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]); // Use Product interface

  // Effect to fetch initial cart and wishlist counts (assuming global state)
  useEffect(() => {
    // This would typically come from your global cart/wishlist stores if they hold total counts
    // For now, using placeholders until you integrate those
    const updateCounts = async () => {
      // Example: If useCartStore has a method to get total items
      // setCartCount(useCartStore.getState().items.length);
      // For wishlist, you might need to fetch the user's wishlist
      // and set the count, or get it from a global wishlist store.
    };
    updateCounts();
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${productId}`
        );
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Product not found.");
          }
          throw new Error(`Failed to fetch product with status: ${response.status}`);
        }
        const data: Product = await response.json();
        // Ensure the ID is consistent, using _id from backend if available
        const productData = { ...data, id: data._id || productId };

        if (isMounted) {
          setProduct(productData);
          if (productData.images && productData.images.length > 0) {
            setSelectedImage(1); // Set to the first product image
          }
          // Check if the product is in the user's wishlist
          const token = localStorage.getItem("token");
          if (token) {
            try {
              const wishlistRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/wishlist/status/${productId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              if (wishlistRes.ok) {
                const wishlistStatus = await wishlistRes.json();
                setIsWishlisted(wishlistStatus.isWishlisted);
                // Also fetch the total wishlist count if needed
                const totalWishlistRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/wishlist/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if(totalWishlistRes.ok) {
                    const totalWishlistData = await totalWishlistRes.json();
                    setWishlistCount(totalWishlistData.length);
                }
              }
            } catch (wishlistErr) {
              console.error("Failed to fetch wishlist status:", wishlistErr);
              // Don't block product display if wishlist status fails
            }
          }
        }
      } catch (e: any) {
        console.error("Failed to fetch product:", e);
        if (isMounted) {
          setError(e.message || "Failed to load product details.");
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
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/all`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Product[] = await response.json();
        // Filter out the current product from related products
        const filteredRelated = data.filter((p) => p.id !== productId);
        setRelatedProducts(filteredRelated.slice(0, 3)); // Limit to 3 related products
      } catch (e) {
        console.error("Failed to fetch related products:", e);
      }
    };
    fetchRelatedProducts();
  }, [productId]);

  const handleAddToCart = useCallback(async () => {
    if (!product || !product.id) {
      toast.error("An error occurred. Product data is missing.");
      return;
    }
    if (product.stock <= 0) {
      toast.error("Sorry, this item is currently out of stock. 😔");
      return;
    }

    const cartAddPromise = useCartStore.getState().addToCart({
      product_id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.images?.[0] || "/placeholder.svg",
      quantity: quantity,
      size: (product as any).size || undefined, // Cast to any if size isn't in Product interface
      originalPrice: Number(product.originalPrice) || Number(product.price),
      inStock: product.stock > 0,
    });

    toast.promise(cartAddPromise, {
      loading: "Adding to cart...",
      success: (data) => {
        setCartCount((prev) => prev + quantity);
        return `"${product.name}" added to cart successfully! 🛒`;
      },
      error: "Failed to add item to cart. Please try again. 😢",
    });
  }, [product, quantity]);

  const handleWishlist = async () => {
    if (!product || !product.id) {
      toast.error("An error occurred. Product data is missing.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in to manage your wishlist. 🔑");
      return;
    }

    const url = isWishlisted
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/wishlist/delete-from-wishlist/${product.id}`
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}/wishlist/add-to-wishlist/${product.id}`;

    const method = isWishlisted ? "DELETE" : "POST";

    const wishlistPromise = fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(async (res) => {
      if (!res.ok) {
        // Attempt to parse error message from backend
        const errorData = await res.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(errorData.message || `Failed with status ${res.status}`);
      }
      return res.json();
    });

    toast.promise(wishlistPromise, {
      loading: isWishlisted ? "Removing from wishlist..." : "Adding to wishlist...",
      success: (data) => {
        setIsWishlisted(!isWishlisted);
        setWishlistCount((prev) => (isWishlisted ? prev - 1 : prev + 1));
        return isWishlisted ? `"${product.name}" removed from wishlist! ❤️` : `"${product.name}" added to wishlist! 💖`;
      },
      error: (err) => `Failed to update wishlist: ${err.message || "Please try again."} 😔`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-xl text-gray-700 bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-[#D4AF37] mb-4" />
        <p>Loading product details... Please wait. 🚀</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-xl text-red-600 bg-white">
        <p className="text-4xl mb-4">❌</p>
        <p>Error: {error}</p>
        <p className="mt-2 text-lg text-gray-500">We couldn't load the product. Please try again later.</p>
        <Button onClick={() => window.location.reload()} className="mt-6 bg-[#D4AF37] text-white hover:bg-yellow-600">
          Reload Page
        </Button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-xl text-gray-700 bg-white">
        <p className="text-4xl mb-4">🤷‍♀️</p>
        <p>Product not found.</p>
        <p className="mt-2 text-lg text-gray-500">The item you're looking for might not exist or has been removed.</p>
        <Button onClick={() => window.location.href = "/collections"} className="mt-6 bg-[#D4AF37] text-white hover:bg-yellow-600">
          Browse All Products
        </Button>
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
                          {/* Placeholder for 3D Model */}
                          <ambientLight intensity={0.5} />
                          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow />
                          <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
                            {/* Replace with your actual 3D model component if you have one */}
                            <mesh>
                              <sphereGeometry args={[1, 32, 32]} />
                              <meshStandardMaterial color="#D4AF37" />
                            </mesh>
                          </Float>
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
                      onClick={() =>
                        setSelectedImage(
                          selectedImage > 0 ? selectedImage - 1 : product.images.length
                        )
                      }
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-white/80 hover:bg-white rounded-full shadow-lg"
                      onClick={() =>
                        setSelectedImage(
                          selectedImage < product.images.length ? selectedImage + 1 : 0
                        )
                      }
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-white/80 hover:bg-white rounded-full shadow-lg"
                    >
                      <ZoomIn className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-white/80 hover:bg-white rounded-full shadow-lg"
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </motion.div>

                <div className="flex gap-4 overflow-x-auto pb-2">
                  <motion.button
                    key="3d-view-thumb" // Unique key for the 3D thumbnail
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === 0 ? "border-[#D4AF37]" : "border-gray-200"
                    }`}
                    onClick={() => setSelectedImage(0)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src="/3d-placeholder.svg" // Placeholder for 3D view thumbnail
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
                      {product.category?.name === "Uncategorized"
                        ? "Jewelry"
                        : product.category?.name || "Uncategorized"}
                    </Badge>
                    <div className="flex items-center">
                      {[...Array(product.rating || 5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]" />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        ({product.reviews || 0} reviews)
                      </span>
                    </div>
                  </div>

                  <h1
                    className="text-4xl font-bold text-[#111111] mb-4"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    {product.name}
                  </h1>

                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-4xl font-bold text-[#D4AF37]">
                      ${product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-lg text-gray-400 line-through">
                        ${product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <p className="text-lg text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
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
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <span className="text-sm text-gray-600">
                      {product.stock > 0 ? "In Stock" : "Out of Stock"} (
                      {product.stock})
                    </span>
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
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-[#F5F5F5] rounded-lg"
                    >
                      <feature.icon className="h-5 w-5 text-[#D4AF37]" />
                      <span className="text-sm font-medium text-gray-700">
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-2">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-12 mb-8"> {/* Adjusted grid-cols */}
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="description">
                <Card className="p-8">
                  <h3
                    className="text-2xl font-bold text-[#111111] mb-6"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    Product Details
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {product.description || "No detailed description available."}
                  </p>
                  {product.shortDescription && product.shortDescription !== product.description && (
                    <p className="mt-4 text-gray-600 italic">
                        {product.shortDescription}
                    </p>
                  )}
                  <ul className="mt-4 space-y-2 text-gray-700">
                    {/* Example of displaying additional product details from API */}
                    <li><strong>SKU:</strong> {product.sku}</li>
                    <li><strong>Weight:</strong> {product.weight}g</li>
                    <li><strong>Dimensions:</strong> {product.dimensions}</li>
                    <li><strong>Stock:</strong> {product.stock} units</li>
                  </ul>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card className="p-8">
                  <h3
                    className="text-2xl font-bold text-[#111111] mb-6"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    Customer Reviews
                  </h3>
                  <div className="space-y-6">
                    {/* Using placeholder reviews; integrate actual review fetching here */}
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
                      {
                        name: "Aisha Khan",
                        rating: 4,
                        date: "3 days ago",
                        review: "Beautiful piece, though it arrived a day later than expected. Still very happy!",
                      },
                    ].map((review, index) => (
                      <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-4">
                            <span className="font-semibold text-[#111111]">
                              {review.name}
                            </span>
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
                    {product.reviews === 0 && ( // Show message if no reviews
                        <p className="text-center text-gray-500 py-4">No reviews yet. Be the first to review this product!</p>
                    )}
                  </div>
                  <Button className="mt-8 bg-gradient-to-r from-[#D4AF37] to-yellow-500 hover:from-yellow-500 hover:to-[#D4AF37] text-[#111111] px-6 py-3 font-bold rounded-full">
                    Write a Review
                  </Button>
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
              <h2
                className="text-4xl font-bold text-[#111111] mb-4"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                You May Also Like
              </h2>
              <p className="text-xl text-gray-600">
                Discover more pieces from our curated collection
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct.id}
                  className="group cursor-pointer"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <Link href={`/products/${relatedProduct.id}`}> {/* Link to related product */}
                      <div className="relative overflow-hidden">
                        <img
                          src={relatedProduct.images?.[0] || "/placeholder.svg"}
                          alt={relatedProduct.name}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          onClick={(e) => { // Prevent linking when heart is clicked
                            e.preventDefault();
                            e.stopPropagation();
                            // Add related product to wishlist functionality here
                            toast.info(`Wishlisting: ${relatedProduct.name}`);
                          }}
                        >
                          <Heart className="h-5 w-5" />
                        </Button>
                      </div>
                    </Link>
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg text-[#111111] mb-2">{relatedProduct.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-[#D4AF37]">
                          ${relatedProduct.price.toLocaleString()}
                        </span>
                        <div className="flex">
                          {[...Array(relatedProduct.rating || 5)].map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]"
                            />
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