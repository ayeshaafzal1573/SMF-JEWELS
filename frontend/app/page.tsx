"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Star, Crown, Gem, Shield, Truck } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useDebounce } from "use-debounce"

// --- Interfaces ---
interface Category {
  id: string
  name: string
  slug: string
  image?: string | null
}

interface Product {
  id: string
  name: string
  price: number
  category: Category | string // Can be Category object or just its ID string
  description?: string
  shortDescription?: string
  sku?: string
  stock: number
  weight?: string
  dimensions?: string
  featured: boolean
  images: string[]
  // Add properties needed for UI display, typically not directly from backend Product model
  status: "Out of Stock" | "Low Stock" | "In Stock"
  badge?: "Bestseller" | "New" | "Sale" // Example badges
  rating: number
  reviews: number
  originalPrice?: number // For sale products
}

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([]) // Renamed featuredProducts to products as it seems to be the main product list
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedQuery] = useDebounce(searchQuery, 300)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false) // This state isn't currently used, can be removed if not needed.

  // --- Data Fetching Functions ---

  // Refactored fetchCategories to return data, not set state directly
  const fetchCategories = useCallback(async (): Promise<Category[]> => {
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/category/all-categories`, {
        method: "GET",
        headers: headers,
        cache: "no-store",
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const result = await res.json()
      return Array.isArray(result) ? result : []
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast({
        title: "Error",
        description: "Failed to load categories. Please try again.",
        variant: "destructive",
      })
      return [] // Return empty array on error
    }
  }, [toast])

  // fetchProducts already returns data, so it's good as is.
  const fetchProducts = useCallback(async () => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/all`
      const res = await fetch(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data = await res.json()
      return Array.isArray(data) ? data : []
    } catch (err) {
      console.error("Error fetching products:", err)
      throw new Error(`Failed to fetch products: ${err instanceof Error ? err.message : String(err)}`)
    }
  }, [])

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [productData, categoryData] = await Promise.all([
        fetchProducts(), 
        fetchCategories(),
      ])
      setCategories(categoryData)
      const mappedProducts: Product[] = productData.map((product: any) => {
        const id = product._id || product.id || `temp-${Math.random().toString(36).substr(2, 9)}`

        let productCategory: Category = { id: '', name: 'Uncategorized', slug: 'uncategorized' };

        if (typeof product.category === 'string') {
          const foundCategory = categoryData.find((c: Category) => c.id === product.category || (c as any)._id === product.category);
          if (foundCategory) {
            productCategory = foundCategory;
          }
        } else if (product.category && typeof product.category === 'object') {
          productCategory = {
            id: product.category._id || product.category.id || id, 
            name: product.category.name || 'Uncategorized',
            slug: product.category.slug || product.category.name?.toLowerCase().replace(/\s/g, '-') || 'uncategorized',
            image: product.category.image || null, 
          };
        }

        return {
          id,
          name: product.name || 'Unknown Product',
          price: product.price || 0,
          category: productCategory,
          stock: product.stock || 0,
          status:
            product.stock === 0 ? "Out of Stock" :
            product.stock < 5 ? "Low Stock" : "In Stock",
          featured: product.featured || false,
          images: product.images || [],
          badge: product.badge || (product.featured ? "Featured" : "New"),
          rating: product.rating || 4.5, 
          reviews: product.reviews || 120, 
          originalPrice: product.originalPrice || undefined,
        }
      })

      setProducts(mappedProducts)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data")
      toast({
        title: "Error",
        description: "Failed to load products data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [fetchProducts, fetchCategories, toast]) //
  useEffect(() => {
    loadData()
  }, [loadData])

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      product.id.toLowerCase().includes(debouncedQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === "all" ||
      (typeof product.category !== 'string' && product.category?.id === selectedCategory)

    return matchesSearch && matchesCategory
  })
  const displayedFeaturedProducts = filteredProducts.filter(p => p.featured).slice(0, 3); 
  return (
    <div className="min-h-screen">
      <Header />
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-600 to-black">
        <div className="absolute inset-0 bg-[url('/hero-section.png?height=1080&width=1920')] bg-cover bg-center opacity-100" />
        {/* Animated Orbs for a touch of luxury */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-gold rounded-full animate-float opacity-60" />
        <div className="absolute top-40 right-32 w-6 h-6 bg-gold rounded-full animate-float-delayed opacity-40" />
        <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-gold rounded-full animate-float-delayed-2 opacity-50" />

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <div className="mb-6">
            <img src="/butterfly.png" alt="SMF Jewels Logo" className="h-16 text-gold mx-auto mb-4 animate-float" />
          </div>

          <h1 className="font-playfair text-6xl md:text-8xl font-bold mb-4 text-gradient-gold">SMF Jewels</h1>

          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Discover the finest collection of handcrafted luxury jewelry. Each piece tells a story of elegance,
            craftsmanship, and timeless beauty.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gold hover:bg-gold/90 text-black font-semibold px-8 py-4 text-lg" asChild>
              <Link href="/shop">
                Explore Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-gold text-gold hover:bg-gold hover:text-black px-8 py-4 text-lg bg-transparent"
              asChild
            >
              <Link href="/collections">View Collections</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8 text-gold" />
              </div>
              <h3 className="font-semibold mb-2">Premium Quality</h3>
              <p className="text-sm text-muted-foreground">Handcrafted with the finest materials</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-gold" />
              </div>
              <h3 className="font-semibold mb-2">Lifetime Warranty</h3>
              <p className="text-sm text-muted-foreground">Protected for generations</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gem className="h-8 w-8 text-gold" />
              </div>
              <h3 className="font-semibold mb-2">Certified Authentic</h3>
              <p className="text-sm text-muted-foreground">Every piece comes with certification</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-gold" />
              </div>
              <h3 className="font-semibold mb-2">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">Complimentary worldwide delivery</p>
            </div>
          </div>
        </div>
      </section>

  

      {/* Collections Showcase */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4">Our Category Collection</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore our curated collections, each designed for life's most precious moments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {loading ? (
              // Basic Skeleton Loader for Categories
              Array.from({ length: 2 }).map((_, index) => (
                <Card key={`category-skeleton-${index}`} className="group overflow-hidden animate-pulse">
                  <div className="w-full h-64 bg-gray-200"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="h-6 bg-gray-300 rounded w-1/2 mb-1"></div>
                  </div>
                </Card>
              ))
            ) : error ? (
              <div className="col-span-full text-center text-red-500">
                <p>Error loading categories: {error}</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="col-span-full text-center text-gray-500">
                <p>No categories found.</p>
              </div>
            ) : (
              categories.map((category) => (
                <Card key={category.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                  <Link href={`/collections/${category.slug}`}> {/* Link to category slug */}
                    <div className="relative">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        width={400}
                        height={300}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="font-playfair text-2xl font-bold mb-1">{category.name}</h3>
                      </div>
                    </div>
                  </Link>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>
    {/* Featured Products */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4">Featured Collection</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our most coveted pieces, each one a masterpiece of design and craftsmanship
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              // Basic Skeleton Loader for Products
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={`skeleton-${index}`} className="group overflow-hidden border-gold/20 animate-pulse">
                  <div className="w-full h-80 bg-gray-200"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-2/3 mb-3"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))
            ) : error ? (
              <div className="col-span-full text-center text-red-500">
                <p>Error: {error}</p>
                <Button onClick={loadData} className="mt-4">Retry Load Data</Button>
              </div>
            ) : displayedFeaturedProducts.length === 0 ? (
              <div className="col-span-full text-center text-gray-500">
                <p>No featured products found.</p>
              </div>
            ) : (
              displayedFeaturedProducts.map((product) => (
                <Card
                  key={product.id}
                  className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-gold/20"
                >
                  <div className="relative overflow-hidden">
                    <Image
                      src={product.images[0] || "/placeholder.svg"} // Use the first image from the array
                      alt={product.name}
                      width={400}
                      height={400}
                      className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {product.badge && (
                      <div className="absolute top-4 left-4">
                        <Badge
                          className={`${product.badge === "Bestseller"
                            ? "bg-red-500"
                            : product.badge === "New"
                              ? "bg-green-500"
                              : "bg-purple-500" // Default for "Sale" or "Featured"
                            }`}
                        >
                          {product.badge}
                        </Badge>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button className="bg-gold hover:bg-gold/90 text-black" asChild>
                        <Link href={`/products/${product.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i} // Unique key for mapped elements
                            className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-gold text-gold" : "text-gray-300"
                              }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground ml-2">({product.reviews})</span>
                    </div>

                    <h3 className="font-semibold text-lg mb-3">{product.name}</h3>

                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gold">Rs:{product.price.toLocaleString()}</span>
                      {product.originalPrice && (
                        <span className="text-lg text-muted-foreground line-through">
                          ${product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              className="border-gold text-gold hover:bg-gold hover:text-black bg-transparent"
              asChild
            >
              <Link href="/shop">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
   {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gold to-yellow-200">
        <div className="container text-center">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4 text-black">Experience Luxury</h2>
          <p className="text-xl mb-8 text-black/80 max-w-2xl mx-auto">
            Visit our showroom or schedule a private consultation to discover the perfect piece for your collection
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
          
            <Button size="lg" className="bg-black hover:bg-black/90 text-white" asChild>
              <Link href="/about">Our Story</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Crown className="h-8 w-8 text-gold" />
                <span className="font-playfair text-2xl font-bold text-gold">SMF Jewels</span>
              </div>
              <p className="text-gray-400 mb-4">
                Crafting timeless elegance since 1985. Every piece tells a story of luxury and sophistication.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/shop" className="block text-gray-400 hover:text-gold transition-colors">
                  Shop
                </Link>
                <Link href="/collections" className="block text-gray-400 hover:text-gold transition-colors">
                  Collections
                </Link>
                <Link href="/about" className="block text-gray-400 hover:text-gold transition-colors">
                  About
                </Link>
                <Link href="/contact" className="block text-gray-400 hover:text-gold transition-colors">
                  Contact
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <div className="space-y-2">
                <p className="text-gray-400">+923-472284368</p>
                <p className="text-gray-400">smfjewels178@gmail.com</p>
                <p className="text-gray-400">Shamsi Society</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SMF Jewels. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
    // </GoogleOAuthProvider>
  )
}