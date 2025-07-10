"use client"

import { useState, useEffect, useCallback } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import Link from "next/link"
import { Grid3X3, List, Heart, Star, ShoppingCart, Search, SlidersHorizontal, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Define Product type based on your API response mapping
interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  rating: number
  reviews: number
  category: string
  isNew?: boolean
  isSale?: boolean
  isBestseller?: boolean
  isLimited?: boolean
}

export default function ShopPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("featured")

  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [productError, setProductError] = useState<string | null>(null)

  const [categories, setCategories] = useState<string[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [categoryError, setCategoryError] = useState<string | null>(null)

  const { toast } = useToast()

  // --- Fetch Products from API ---
  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true)
    setProductError(null)
    try {
      const queryParams = new URLSearchParams()
      queryParams.append("minPrice", priceRange[0].toString())
      queryParams.append("maxPrice", priceRange[1].toString())

      // **THIS IS THE CRUCIAL PART:** Add selected categories to query params
      if (selectedCategories.length > 0) {
        // Assuming your backend expects categories as a comma-separated string
        queryParams.append("categories", selectedCategories.join(","))
      }

      queryParams.append("sortBy", sortBy)

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/all?${queryParams.toString()}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        }
      )

      if (!res.ok) {
        throw new Error(`Failed to fetch products: ${res.statusText}`)
      }
      const data = await res.json()

      const mappedProducts: Product[] = Array.isArray(data)
        ? data.map((prod: any) => ({
            id: prod._id || prod.id,
            name: prod.name || "Unknown Product",
            price: prod.price || 0,
            category: prod.category, // Ensure your backend returns the category for each product
            image:
              prod.images && Array.isArray(prod.images) && prod.images.length > 0
                ? prod.images[0]
                : "/placeholder.svg",
            rating: prod.rating || 4.5,
            reviews: prod.reviews || Math.floor(Math.random() * 500) + 50,
            originalPrice: prod.originalPrice || undefined,
            isNew: prod.isNew || false,
            isSale: prod.isSale || false,
            isBestseller: prod.isBestseller || false,
            isLimited: prod.isLimited || false,
          }))
        : []

      setProducts(mappedProducts)
    } catch (err: any) {
      console.error("Error fetching products:", err)
      setProductError(err.message || "Failed to load products.")
      setProducts([])
      toast({
        title: "Error",
        description: "Failed to load products.",
        variant: "destructive",
      })
    } finally {
      setLoadingProducts(false)
    }
  }, [priceRange, selectedCategories, sortBy, toast]) // Dependencies now correctly include selectedCategories

  // --- Fetch Categories from API ---
  const fetchCategories = useCallback(async () => {
    setLoadingCategories(true)
    setCategoryError(null)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/category/all-categories`, // Your categories API endpoint
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        }
      )

      if (!res.ok) {
        throw new Error(`Failed to fetch categories: ${res.statusText}`)
      }
      const data = await res.json()

      const fetchedCategoryNames: string[] = Array.isArray(data)
        ? data
            .map((cat: any) => (typeof cat === "string" ? cat : cat.name))
            .filter(Boolean)
        : []
      setCategories(fetchedCategoryNames)
    } catch (err: any) {
      console.error("Error fetching categories:", err)
      setCategoryError(err.message || "Failed to load categories.")
      setCategories([])
      toast({
        title: "Error",
        description: "Failed to load categories.",
        variant: "destructive",
      })
    } finally {
      setLoadingCategories(false)
    }
  }, [toast])

  // --- useEffects to trigger fetches ---
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts]) // `fetchProducts` now correctly depends on `selectedCategories`

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories((prev) => [...prev, category])
    } else {
      setSelectedCategories((prev) => prev.filter((c) => c !== category))
    }
  }

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <Label className="text-base font-semibold mb-4 block">Price Range</Label>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={10000}
          step={100}
          className="mb-4"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      {/* Categories */}
      <div>
        <Label className="text-base font-semibold mb-4 block">Categories</Label>
        {loadingCategories ? (
          <div className="flex items-center text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Loading categories...
          </div>
        ) : categoryError ? (
          <p className="text-red-500 text-sm">Error loading categories.</p>
        ) : categories.length === 0 ? (
          <p className="text-muted-foreground text-sm">No categories found.</p>
        ) : (
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked) =>
                    handleCategoryChange(category, checked as boolean)
                  }
                />
                <Label htmlFor={category} className="text-sm font-normal">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="font-playfair text-4xl font-bold mb-2">
              Luxury Collection
            </h1>
            <p className="text-muted-foreground">
              Discover our exquisite jewelry pieces
            </p>
          </div>

          <div className="flex items-center gap-4 mt-4 md:mt-0">
            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Mobile Filter */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden bg-transparent">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterSidebar />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <Card className="p-6">
              <FilterSidebar />
            </Card>
          </div>

          {/* Products */}
          <div className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-muted-foreground">
                Showing {products.length}{" "}
                {products.length === 1 ? "product" : "products"}
              </p>
            </div>

            {/* Loading, Error, and No Products States */}
            {loadingProducts ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-gold" />
                <span className="ml-2 text-gold">Loading products...</span>
              </div>
            ) : productError ? (
              <div className="flex justify-center items-center h-64 text-red-500">
                <p>Error: {productError}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="flex justify-center items-center h-64 text-muted-foreground">
                <p>No products found matching your criteria.</p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card
                    key={product.id}
                    className="group overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        {product.isNew && <Badge className="bg-green-500">New</Badge>}
                        {product.isBestseller && (
                          <Badge className="bg-red-500">Bestseller</Badge>
                        )}
                        {product.isLimited && (
                          <Badge className="bg-purple-500">Limited</Badge>
                        )}
                        {product.isSale && <Badge className="bg-orange-500">Sale</Badge>}
                      </div>

                      {/* Actions */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" variant="secondary" className="h-8 w-8">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="secondary" className="h-8 w-8">
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(product.rating)
                                  ? "fill-gold text-gold"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground ml-2">
                          ({product.reviews})
                        </span>
                      </div>

                      <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>

                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-bold text-gold">
                          ${product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1 bg-gold hover:bg-gold/90 text-black">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/products/${product.id}`}>View</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <Card
                    key={product.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="flex">
                      <div className="relative w-48 h-48 flex-shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="flex-1 p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {product.isNew && <Badge className="bg-green-500">New</Badge>}
                              {product.isBestseller && (
                                <Badge className="bg-red-500">Bestseller</Badge>
                              )}
                              {product.isLimited && (
                                <Badge className="bg-purple-500">Limited</Badge>
                              )}
                              {product.isSale && <Badge className="bg-orange-500">Sale</Badge>}
                            </div>

                            <h3 className="font-semibold text-xl mb-2">{product.name}</h3>

                            <div className="flex items-center mb-3">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < Math.floor(product.rating)
                                        ? "fill-gold text-gold"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground ml-2">
                                {product.rating} ({product.reviews} reviews)
                              </span>
                            </div>

                            <div className="flex items-center gap-3 mb-4">
                              <span className="text-2xl font-bold text-gold">
                                ${product.price.toLocaleString()}
                              </span>
                              {product.originalPrice && (
                                <span className="text-lg text-muted-foreground line-through">
                                  ${product.originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>

                            <div className="flex gap-3">
                              <Button className="bg-gold hover:bg-gold/90 text-black">
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Add to Cart
                              </Button>
                              <Button variant="outline" asChild>
                                <Link href={`/products/${product.id}`}>View Details</Link>
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Heart className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loadingProducts && products.length > 0 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2">
                  <Button variant="outline" disabled>
                    Previous
                  </Button>
                  <Button
                    variant="default"
                    className="bg-gold hover:bg-gold/90 text-black"
                  >
                    1
                  </Button>
                  <Button variant="outline">2</Button>
                  <Button variant="outline">3</Button>
                  <Button variant="outline">Next</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}