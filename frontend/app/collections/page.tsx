"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" // Assuming you have these from shadcn/ui or similar
import { Diamond, Crown, Gem, Award, Grid, List, Search, Heart, Star, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Header } from "../../components/header" // Assuming Header component path
import { useToast } from "@/components/ui/use-toast" // Assuming you have useToast
import { useDebounce } from "use-debounce" // For debouncing search input

// --- Interfaces (Copy these from HomePage or a shared types file) ---
interface Category {
  id: string
  name: string
  slug: string
  image?: string | null
  count?: number // Added for UI display, will be calculated on client-side
}

interface Product {
  id: string
  name: string
  price: number
  category: Category | string // Can be Category object or just its ID string
  description: string
  shortDescription?: string
  sku?: string
  stock?: number // Made optional as not directly used in this component's UI
  weight?: string
  dimensions?: string
  featured: boolean
  images: string[]
  badge?: "Bestseller" | "New" | "Sale" | "Exclusive" | "Popular" | "Limited" | "Trending" | "Luxury" | "Heritage" // Example badges
  rating: number
  reviews: number
  originalPrice?: number // For sale products
}

export default function CollectionsPage() {
  const { toast } = useToast()

  // --- State for UI interactions ---
  const [cartCount, setCartCount] = useState(2) // Static for now, integrate with actual cart later
  const [wishlistCount, setWishlistCount] = useState(5) // Static for now, integrate with actual wishlist later

  // --- State for Filters and Search ---
  const [selectedCategory, setSelectedCategory] = useState("all") // Changed to "all" for better initial state
  const [priceRange, setPriceRange] = useState("All")
  const [sortBy, setSortBy] = useState("featured") // Changed to lowercase for consistency
  const [viewMode, setViewMode] = useState("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300) // Debounce search input

  // --- State for API Data ---
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // --- API Fetching Functions ---

  const fetchCategories = useCallback(async (): Promise<Category[]> => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/category/all-categories`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      })

      if (!res.ok) {
        throw new Error(`Failed to fetch categories: ${res.statusText}`)
      }
      const data = await res.json()
      // Ensure 'id' is present, handling '_id' from MongoDB if applicable
      return Array.isArray(data) ? data.map((cat: any) => ({
        id: cat._id || cat.id,
        name: cat.name,
        slug: cat.slug || cat.name?.toLowerCase().replace(/\s/g, '-'),
        image: cat.image || null,
      })) : []
    } catch (err) {
      console.error("Error fetching categories:", err)
      toast({
        title: "Error",
        description: "Failed to load categories.",
        variant: "destructive",
      })
      return []
    }
  }, [toast])

  const fetchProducts = useCallback(async (): Promise<Product[]> => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/all`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      })

      if (!res.ok) {
        throw new Error(`Failed to fetch products: ${res.statusText}`)
      }
      const data = await res.json()
      return Array.isArray(data) ? data.map((prod: any) => ({
        id: prod._id || prod.id,
        name: prod.name || 'Unknown Product',
        price: prod.price || 0,
        // Category can be an ID or an object, we'll reconcile this in loadData
        category: prod.category,
        description: prod.description || 'No description available.',
        featured: prod.featured || false,
        images: prod.images && Array.isArray(prod.images) && prod.images.length > 0 ? prod.images : ["/placeholder.svg"],
        // Mocked or default values for UI specific fields if not from API
        badge: prod.badge || (prod.featured ? "Featured" : "New"),
        rating: prod.rating || 4.5,
        reviews: prod.reviews || Math.floor(Math.random() * 500) + 50,
        originalPrice: prod.originalPrice || undefined,
      })) : []
    } catch (err) {
      console.error("Error fetching products:", err)
      toast({
        title: "Error",
        description: "Failed to load products.",
        variant: "destructive",
      })
      return []
    }
  }, [toast])

  // --- Unified Data Loader ---
  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [productData, categoryData] = await Promise.all([
        fetchProducts(),
        fetchCategories(),
      ])

      // Map product categories to full category objects for easier filtering
      const productsWithResolvedCategories: Product[] = productData.map(product => {
        let resolvedCategory: Category = { id: '', name: 'Uncategorized', slug: 'uncategorized' };

        if (typeof product.category === 'string') {
          const foundCategory = categoryData.find(c => c.id === product.category);
          if (foundCategory) {
            resolvedCategory = foundCategory;
          }
        } else if (product.category && typeof product.category === 'object' && product.category.id) {
          // If category is already an object, use it directly (ensure id is present)
          resolvedCategory = {
            id: product.category.id,
            name: product.category.name || 'Uncategorized',
            slug: product.category.slug || product.category.name.toLowerCase().replace(/\s/g, '-'),
            image: product.category.image || null,
          };
        }
        return { ...product, category: resolvedCategory };
      });

      setProducts(productsWithResolvedCategories)

      // Calculate product counts for each category for UI display
      const categoryCounts: { [key: string]: number } = {};
      productsWithResolvedCategories.forEach(p => {
        if (typeof p.category !== 'string') { // Ensure it's the resolved category object
          categoryCounts[p.category.name] = (categoryCounts[p.category.name] || 0) + 1;
        }
      });

      const categoriesWithCounts = [
        { name: "All", icon: <Diamond className="h-5 w-5" />, count: productsWithResolvedCategories.length, slug: "all" },
        ...categoryData.map(cat => ({
          ...cat,
          count: categoryCounts[cat.name] || 0,
          icon: categories.find(c => c.name === cat.name)?.icon || <Diamond className="h-5 w-5" /> // Keep existing icons
        }))
      ];
      setCategories(categoriesWithCounts);

    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred while loading data.")
    } finally {
      setLoading(false)
    }
  }, [fetchProducts, fetchCategories, toast])

  // --- Initial Data Load ---
  useEffect(() => {
    loadData()
  }, [loadData])
const priceRanges = ["All", "Under 1,000", "1,000 - 2,500", "2,500 - 5,000", "5,000 - 10,000", "Over 10,000"]
 const sortOptions = [
    "Featured",
    "Price: Low to High",
    "Price: High to Low",
    "Newest First",
    "Best Selling",
    "Highest Rated",
  ]

  // --- Filtering Logic ---
  const getFilteredProducts = useCallback(() => {
    let tempProducts = [...products]; // Start with all products

    // 1. Filter by Category
    if (selectedCategory !== "all") {
      tempProducts = tempProducts.filter(
        (product) => typeof product.category !== 'string' && product.category.name === selectedCategory
      );
    }

    // 2. Filter by Price Range
    if (priceRange !== "All") {
      tempProducts = tempProducts.filter((product) => {
        if (priceRange === "Under 1,000") return product.price < 1000;
        if (priceRange === "1,000 - 2,500") return product.price >= 1000 && product.price <= 2500;
        if (priceRange === "2,500 - 5,000") return product.price >= 2500 && product.price <= 5000;
        if (priceRange === "5,000 - 10,000") return product.price >= 5000 && product.price <= 10000;
        if (priceRange === "Over 10,000") return product.price > 10000;
        return true;
      });
    }

    // 3. Filter by Search Query (using debounced query)
    if (debouncedSearchQuery) {
      tempProducts = tempProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
    }

    // 4. Sort Products
    switch (sortBy) {
      case "Price: Low to High":
        tempProducts.sort((a, b) => a.price - b.price);
        break;
      case "Price: High to Low":
        tempProducts.sort((a, b) => b.price - a.price);
        break;
      case "Newest First":
        tempProducts.sort((a, b) => b.id.localeCompare(a.id)); 
        break;
      case "Best Selling":
        tempProducts.sort((a, b) => b.reviews - a.reviews);
        break;
      case "Highest Rated":
        tempProducts.sort((a, b) => b.rating - a.rating);
        break;
      case "Featured":
      default:
        tempProducts.sort((a, b) => (b.featured ? 1 : -1) - (a.featured ? 1 : -1)); 
        break;
    }

    return tempProducts;
  }, [products, selectedCategory, priceRange, debouncedSearchQuery, sortBy]);

  const filteredAndSortedProducts = getFilteredProducts();

  // --- UI Render ---
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
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-3 border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37] w-full"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center justify-center lg:justify-end w-full lg:w-auto">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px] px-4 py-2 border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id || category.name} value={category.name}>
                      {category.name} ({category.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-[200px] px-4 py-2 border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]">
                  <SelectValue placeholder="Select Price Range" />
                </SelectTrigger>
                <SelectContent>
                  {priceRanges.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] px-4 py-2 border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

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

      {/* Category Navigation (Dynamic) */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex flex-wrap gap-4 justify-center animate-pulse">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={`cat-skel-${i}`} className="h-12 w-40 bg-gray-200 rounded-full"></div>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-4 justify-center">
              {categories.map((category, index) => (
                <motion.button
                  key={category.id || category.name} // Use ID for key if available, fallback to name
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
                  {category.icon || <Diamond className="h-5 w-5" />} {/* Fallback icon */}
                  <span className="font-medium">{category.name}</span>
                  <Badge variant="secondary" className="ml-2">
                    {category.count}
                  </Badge>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Products Grid (Dynamic) */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-[#111111]" style={{ fontFamily: "Playfair Display, serif" }}>
              {selectedCategory === "all" ? "All Collections" : selectedCategory}
            </h2>
            <p className="text-gray-600">
              Showing {filteredAndSortedProducts.length} of {products.length} products
            </p>
          </div>

          {loading ? (
            <div
              className={`grid gap-8 ${
                viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
              } animate-pulse`}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={`product-skel-${i}`} className={`border-0 shadow-lg ${viewMode === "list" ? "flex flex-row" : ""}`}>
                  <div className={`relative overflow-hidden bg-gray-200 ${viewMode === "list" ? "w-1/3 h-64" : "w-full h-80"}`}></div>
                  <CardContent className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-10 bg-gray-200 rounded-full mt-6"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-20">
              <p className="text-xl mb-4">Error loading products: {error}</p>
              <Button onClick={loadData} className="bg-[#D4AF37] hover:bg-yellow-600 text-[#111111]">
                Retry Loading Products
              </Button>
            </div>
          ) : filteredAndSortedProducts.length === 0 ? (
            <div className="text-center text-gray-500 py-20">
              <p className="text-xl">No products found matching your criteria.</p>
              <Button onClick={() => { setSearchQuery(""); setSelectedCategory("all"); setPriceRange("All"); }} className="mt-4 bg-[#D4AF37] hover:bg-yellow-600 text-[#111111]">
                Reset Filters
              </Button>
            </div>
          ) : (
            <div
              className={`grid gap-8 ${
                viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
              }`}
            >
              {filteredAndSortedProducts.map((product, index) => (
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
                          src={product.images[0]} // Display the first image
                          alt={product.name}
                          className={`object-cover ${viewMode === "list" ? "w-full h-64" : "w-full h-80"}`}
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.7 }}
                        />
                        {product.badge && (
                            <Badge className="absolute top-4 left-4 bg-[#D4AF37] text-[#111111] font-bold text-sm px-3 py-1">
                                {product.badge}
                            </Badge>
                        )}
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
                                Rs:{product.originalPrice.toLocaleString()}
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
                              e.preventDefault() // Prevent navigating when clicking add to cart
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
          )}

          {/* Load More Button - Only show if there are more products to load (implement pagination later) */}
          {filteredAndSortedProducts.length > 0 && products.length > filteredAndSortedProducts.length && (
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
                // onClick={() => { /* Implement pagination logic here */ }}
              >
                Load More Products
                <ArrowRight className="ml-3 h-6 w-6 inline" />
              </motion.button>
            </motion.div>
          )}
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