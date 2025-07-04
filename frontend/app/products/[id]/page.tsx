"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Float } from "@react-three/drei"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Heart,
  Star,
  Share2,
  ShoppingBag,
  Truck,
  Shield,
  RotateCcw,
  ZoomIn,
  Camera,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
} from "lucide-react"
import { Header } from "../../../components/header"
import { useParams } from "next/navigation"

// 3D Diamond Component
function ProductDiamond() {
  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
      <mesh scale={[2, 2, 2]}>
        <octahedronGeometry args={[1, 2]} />
        <meshPhysicalMaterial
          color="#ffffff"
          metalness={0.1}
          roughness={0}
          transmission={0.9}
          thickness={0.5}
          envMapIntensity={2}
          clearcoat={1}
          clearcoatRoughness={0}
        />
      </mesh>
    </Float>
  )
}

export default function ProductDetailPage() {
  const params = useParams()
  const [cartCount, setCartCount] = useState(2)
  const [wishlistCount, setWishlistCount] = useState(5)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState("")
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [showAR, setShowAR] = useState(false)

  // Mock product data
  const product = {
    id: params.id,
    name: "Eternal Diamond Solitaire Ring",
    price: 4999,
    originalPrice: 5999,
    rating: 5,
    reviews: 127,
    description:
      "A timeless classic featuring a brilliant-cut diamond in an elegant platinum setting. This solitaire ring represents the perfect union of traditional craftsmanship and contemporary design.",
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    badge: "Bestseller",
    inStock: true,
    sizes: ["5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9"],
    specifications: {
      Metal: "Platinum 950",
      "Diamond Carat": "1.5 ct",
      "Diamond Cut": "Round Brilliant",
      "Diamond Color": "D (Colorless)",
      "Diamond Clarity": "VVS1",
      "Setting Style": "Classic Solitaire",
      "Band Width": "2.5mm",
      Certificate: "GIA Certified",
    },
    features: [
      "Lifetime warranty included",
      "Free resizing within 60 days",
      "Complimentary cleaning service",
      "GIA certified diamond",
      "Ethically sourced materials",
    ],
  }

  const relatedProducts = [
    {
      id: 2,
      name: "Classic Diamond Band",
      price: 1299,
      image: "/placeholder.svg?height=300&width=300",
      rating: 5,
    },
    {
      id: 3,
      name: "Vintage Rose Gold Ring",
      price: 2199,
      image: "/placeholder.svg?height=300&width=300",
      rating: 5,
    },
    {
      id: 4,
      name: "Emerald Cut Solitaire",
      price: 5499,
      image: "/placeholder.svg?height=300&width=300",
      rating: 5,
    },
  ]

  const handleAddToCart = () => {
    setCartCount(cartCount + quantity)
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    if (!isWishlisted) {
      setWishlistCount(wishlistCount + 1)
    } else {
      setWishlistCount(wishlistCount - 1)
    }
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Inter, sans-serif" }}>
      <Header cartCount={cartCount} wishlistCount={wishlistCount} />

      <div className="pt-24">
        {/* Product Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Product Images & 3D Viewer */}
              <div className="space-y-6">
                {/* Main Image/3D Viewer */}
                <motion.div
                  className="relative aspect-square bg-[#F5F5F5] rounded-2xl overflow-hidden"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <AnimatePresence mode="wait">
                    {selectedImage === 0 ? (
                      <motion.div
                        key="3d-viewer"
                        className="w-full h-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Canvas camera={{ position: [0, 0, 8] }}>
                          <ambientLight intensity={0.5} />
                          <pointLight position={[10, 10, 10]} intensity={1} />
                          <Environment preset="studio" />
                          <ProductDiamond />
                          <OrbitControls enableZoom={true} enablePan={false} autoRotate autoRotateSpeed={1} />
                        </Canvas>
                        <div className="absolute top-4 left-4 bg-[#D4AF37] text-[#111111] px-3 py-1 rounded-full text-sm font-bold">
                          360° View
                        </div>
                      </motion.div>
                    ) : (
                      <motion.img
                        key={`image-${selectedImage}`}
                        src={product.images[selectedImage - 1]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.5 }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Image Navigation */}
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

                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-white/80 hover:bg-white rounded-full shadow-lg"
                      onClick={() => setShowAR(!showAR)}
                    >
                      <Camera className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="bg-white/80 hover:bg-white rounded-full shadow-lg">
                      <ZoomIn className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="bg-white/80 hover:bg-white rounded-full shadow-lg">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </motion.div>

                {/* Thumbnail Gallery */}
                <div className="flex gap-4 overflow-x-auto pb-2">
                  <motion.button
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === 0 ? "border-[#D4AF37]" : "border-gray-200"
                    }`}
                    onClick={() => setSelectedImage(0)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="w-full h-full bg-[#D4AF37]/10 flex items-center justify-center">
                      <RotateCcw className="h-6 w-6 text-[#D4AF37]" />
                    </div>
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

                {/* AR Try-On */}
                <AnimatePresence>
                  {showAR && (
                    <motion.div
                      className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-2xl p-6 text-center"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Camera className="h-12 w-12 text-[#D4AF37] mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-[#111111] mb-2">AR Try-On Experience</h3>
                      <p className="text-gray-600 mb-4">See how this ring looks on your hand using augmented reality</p>
                      <Button className="bg-[#D4AF37] hover:bg-yellow-600 text-[#111111]">Launch AR Experience</Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Product Info */}
              <motion.div
                className="space-y-8"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {/* Header */}
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <Badge className="bg-[#D4AF37] text-[#111111] font-bold">{product.badge}</Badge>
                    <div className="flex items-center">
                      {[...Array(product.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]" />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">({product.reviews} reviews)</span>
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
                    {product.originalPrice && (
                      <span className="text-2xl text-gray-400 line-through">
                        ${product.originalPrice.toLocaleString()}
                      </span>
                    )}
                    <Badge variant="secondary" className="text-green-600 bg-green-50">
                      Save ${(product.originalPrice! - product.price).toLocaleString()}
                    </Badge>
                  </div>

                  <p className="text-lg text-gray-600 leading-relaxed">{product.description}</p>
                </div>

                {/* Size Selection */}
                <div>
                  <h3 className="text-lg font-semibold text-[#111111] mb-4">Ring Size</h3>
                  <div className="grid grid-cols-5 gap-3">
                    {product.sizes.map((size) => (
                      <motion.button
                        key={size}
                        className={`py-3 px-4 border-2 rounded-lg font-semibold transition-all duration-300 ${
                          selectedSize === size
                            ? "border-[#D4AF37] bg-[#D4AF37] text-white"
                            : "border-gray-200 hover:border-[#D4AF37] hover:text-[#D4AF37]"
                        }`}
                        onClick={() => setSelectedSize(size)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {size}
                      </motion.button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Need help finding your size?{" "}
                    <a href="#" className="text-[#D4AF37] hover:underline">
                      Size Guide
                    </a>
                  </p>
                </div>

                {/* Quantity */}
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
                    <span className="text-sm text-gray-600">{product.inStock ? "In Stock" : "Out of Stock"}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Button
                      className="flex-1 bg-gradient-to-r from-[#D4AF37] to-yellow-500 hover:from-yellow-500 hover:to-[#D4AF37] text-[#111111] py-4 text-lg font-bold rounded-full transition-all duration-500 shadow-xl hover:shadow-2xl"
                      onClick={handleAddToCart}
                      disabled={!selectedSize}
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

                  <Button
                    variant="outline"
                    className="w-full border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white py-4 text-lg font-bold rounded-full transition-all duration-300 bg-transparent"
                  >
                    Schedule Private Viewing
                  </Button>
                </div>

                {/* Features */}
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

        {/* Product Details Tabs */}
        <section className="py-16 bg-[#F5F5F5]">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="specifications" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="specifications">Specifications</TabsTrigger>
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="care">Care Guide</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="specifications">
                <Card className="p-8">
                  <h3
                    className="text-2xl font-bold text-[#111111] mb-6"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    Technical Specifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center py-3 border-b border-gray-200">
                        <span className="font-semibold text-gray-700">{key}:</span>
                        <span className="text-[#111111]">{value}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="features">
                <Card className="p-8">
                  <h3
                    className="text-2xl font-bold text-[#111111] mb-6"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    Premium Features
                  </h3>
                  <div className="space-y-4">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="care">
                <Card className="p-8">
                  <h3
                    className="text-2xl font-bold text-[#111111] mb-6"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    Jewelry Care Instructions
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-[#111111] mb-2">Daily Care</h4>
                      <p className="text-gray-600">
                        Remove jewelry before swimming, exercising, or using cleaning products.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#111111] mb-2">Cleaning</h4>
                      <p className="text-gray-600">
                        Clean with warm soapy water and a soft brush. Professional cleaning recommended every 6 months.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#111111] mb-2">Storage</h4>
                      <p className="text-gray-600">Store in a soft pouch or jewelry box to prevent scratching.</p>
                    </div>
                  </div>
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

        {/* Related Products */}
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
                  key={product.id}
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
                        src={product.image || "/placeholder.svg"}
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
                          {[...Array(product.rating)].map((_, i) => (
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
  )
}
