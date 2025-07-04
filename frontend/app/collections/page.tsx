"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Diamond, Crown, Gem, Award, Grid, List, Search, Heart, Star, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Header } from "../../components/header"

export default function CollectionsPage() {
  const [cartCount, setCartCount] = useState(2)
  const [wishlistCount, setWishlistCount] = useState(5)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [priceRange, setPriceRange] = useState("All")
  const [sortBy, setSortBy] = useState("Featured")
  const [viewMode, setViewMode] = useState("grid")
  const [searchQuery, setSearchQuery] = useState("")

  const categories = [
    { name: "All", icon: <Diamond className="h-5 w-5" />, count: 450 },
    { name: "Engagement Rings", icon: <Diamond className="h-5 w-5" />, count: 150 },
    { name: "Necklaces", icon: <Crown className="h-5 w-5" />, count: 120 },
    { name: "Earrings", icon: <Gem className="h-5 w-5" />, count: 90 },
    { name: "Bracelets", icon: <Award className="h-5 w-5" />, count: 60 },
    { name: "Bridal Sets", icon: <Diamond className="h-5 w-5" />, count: 30 },
  ]

  const priceRanges = ["All", "Under $1,000", "$1,000 - $2,500", "$2,500 - $5,000", "$5,000 - $10,000", "Over $10,000"]

  const sortOptions = [
    "Featured",
    "Price: Low to High",
    "Price: High to Low",
    "Newest First",
    "Best Selling",
    "Highest Rated",
  ]

  const products = [
    {
      id: 1,
      name: "Eternal Diamond Solitaire",
      price: 4999,
      originalPrice: 5999,
      image: "/placeholder.svg?height=500&width=500",
      badge: "Bestseller",
      rating: 5,
      category: "Engagement Rings",
      description: "A timeless classic featuring a brilliant-cut diamond",
      reviews: 127,
    },
    {
      id: 2,
      name: "Royal Pearl Collection",
      price: 2499,
      image: "/placeholder.svg?height=500&width=500",
      badge: "New",
      rating: 5,
      category: "Necklaces",
      description: "Lustrous pearls in an elegant gold setting",
      reviews: 89,
    },
    {
      id: 3,
      name: "Infinity Gold Bracelet",
      price: 1899,
      image: "/placeholder.svg?height=500&width=500",
      badge: "Limited",
      rating: 5,
      category: "Bracelets",
      description: "Symbolic infinity design in 18k gold",
      reviews: 156,
    },
    {
      id: 4,
      name: "Celestial Sapphire Set",
      price: 3299,
      image: "/placeholder.svg?height=500&width=500",
      badge: "Exclusive",
      rating: 5,
      category: "Bridal Sets",
      description: "Stunning sapphires with diamond accents",
      reviews: 203,
    },
    {
      id: 5,
      name: "Classic Diamond Studs",
      price: 1299,
      image: "/placeholder.svg?height=500&width=500",
      badge: "Popular",
      rating: 5,
      category: "Earrings",
      description: "Timeless diamond stud earrings",
      reviews: 342,
    },
    {
      id: 6,
      name: "Vintage Rose Gold Ring",
      price: 2199,
      image: "/placeholder.svg?height=500&width=500",
      badge: "Heritage",
      rating: 5,
      category: "Engagement Rings",
      description: "Vintage-inspired rose gold engagement ring",
      reviews: 98,
    },
    {
      id: 7,
      name: "Emerald Tennis Necklace",
      price: 5499,
      image: "/placeholder.svg?height=500&width=500",
      badge: "Luxury",
      rating: 5,
      category: "Necklaces",
      description: "Exquisite emerald tennis necklace",
      reviews: 67,
    },
    {
      id: 8,
      name: "Diamond Hoop Earrings",
      price: 899,
      image: "/placeholder.svg?height=500&width=500",
      badge: "Trending",
      rating: 4,
      category: "Earrings",
      description: "Modern diamond hoop earrings",
      reviews: 234,
    },
  ]

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Inter, sans-serif" }}>
      <Header cartCount={cartCount} wishlistCount={wishlistCount} />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-[#111111] via-gray-900 to-[#111111] text-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 px-6 py-2 text-lg mb-6">
              Luxury Collections
            </Badge>
            <h1 className="text-6xl md:text-8xl font-bold mb-6" style={{ fontFamily: "Playfair Display, serif" }}>
              Discover
              <span className="block text-[#D4AF37]">Excellence</span>
            </h1>
            <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Explore our curated collections of the world's finest jewelry, each piece crafted to perfection and
              designed to last generations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-[#F5F5F5] border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-3 border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:border-[#D4AF37] focus:ring-[#D4AF37]"
              >
                {categories.map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>

              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:border-[#D4AF37] focus:ring-[#D4AF37]"
              >
                {priceRanges.map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:border-[#D4AF37] focus:ring-[#D4AF37]"
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              {/* View Mode Toggle */}
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

      {/* Category Navigation */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category, index) => (
              <motion.button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex items-center gap-3 px-6 py-3 rounded-full border-2 transition-all duration-300 ${
                  selectedCategory === category.name
                    ? "border-[#D4AF37] bg-[#D4AF37] text-white"
                    : "border-gray-200 hover:border-[#D4AF37] hover:text-[#D4AF37]"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.icon}
                <span className="font-medium">{category.name}</span>
                <Badge variant="secondary" className="ml-2">
                  {category.count}
                </Badge>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-[#111111]" style={{ fontFamily: "Playfair Display, serif" }}>
              {selectedCategory === "All" ? "All Collections" : selectedCategory}
            </h2>
            <p className="text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>

          <div
            className={`grid gap-8 ${
              viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
            }`}
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Link href={`/products/${product.id}`}>
                  <Card
                    className={`border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white group-hover:ring-2 group-hover:ring-[#D4AF37]/30 ${
                      viewMode === "list" ? "flex flex-row" : ""
                    }`}
                  >
                    <div className={`relative overflow-hidden ${viewMode === "list" ? "w-1/3" : ""}`}>
                      <motion.div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/10 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <motion.img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className={`object-cover ${viewMode === "list" ? "w-full h-64" : "w-full h-80"}`}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.7 }}
                      />
                      <Badge className="absolute top-4 left-4 bg-[#D4AF37] text-[#111111] font-bold text-sm px-3 py-1">
                        {product.badge}
                      </Badge>
                      <motion.button
                        className="absolute top-4 right-4 p-3 bg-white/95 hover:bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.preventDefault()
                          setWishlistCount(wishlistCount + 1)
                        }}
                      >
                        <Heart className="h-5 w-5 text-[#111111] hover:text-[#D4AF37] transition-colors" />
                      </motion.button>
                    </div>
                    <CardContent className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                      <h3
                        className="font-bold text-xl text-[#111111] mb-2"
                        style={{ fontFamily: "Playfair Display, serif" }}
                      >
                        {product.name}
                      </h3>
                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">{product.description}</p>

                      <div className="flex items-center mb-4">
                        <div className="flex items-center mr-4">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < product.rating ? "fill-[#D4AF37] text-[#D4AF37]" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                      </div>

                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl font-bold text-[#D4AF37]">${product.price.toLocaleString()}</span>
                          {product.originalPrice && (
                            <span className="text-lg text-gray-400 line-through">
                              ${product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className={`${viewMode === "list" ? "flex gap-4" : "space-y-3"}`}>
                        <motion.button
                          className="flex-1 bg-gradient-to-r from-[#111111] to-gray-800 hover:from-[#D4AF37] hover:to-yellow-600 text-white hover:text-[#111111] py-3 rounded-full font-bold transition-all duration-500"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={(e) => {
                            e.preventDefault()
                            setCartCount(cartCount + 1)
                          }}
                        >
                          Add to Cart
                        </motion.button>

                        {viewMode === "list" && (
                          <motion.button
                            className="px-6 py-3 border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white rounded-full font-bold transition-all duration-300"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            Quick View
                          </motion.button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Load More Button */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.button
              className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 hover:from-yellow-500 hover:to-[#D4AF37] text-[#111111] px-12 py-4 text-xl font-bold rounded-full transition-all duration-500 shadow-xl hover:shadow-2xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Load More Products
              <ArrowRight className="ml-3 h-6 w-6 inline" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-[#111111] text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4 text-[#D4AF37]" style={{ fontFamily: "Playfair Display, serif" }}>
              Stay Updated
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Be the first to know about new arrivals, exclusive offers, and special events.
            </p>
            <div className="max-w-md mx-auto flex gap-4">
              <Input placeholder="Enter your email address" className="flex-1 bg-white text-[#111111] border-0 py-3" />
              <Button className="bg-[#D4AF37] hover:bg-yellow-600 text-[#111111] px-8 py-3 font-bold">Subscribe</Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
