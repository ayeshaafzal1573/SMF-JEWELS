"use client"

import { useState } from "react"
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
import { Grid3X3, List, Heart, Star, ShoppingCart, Search, SlidersHorizontal } from "lucide-react"

export default function ShopPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("featured")

  const products = [
    {
      id: 1,
      name: "Diamond Solitaire Ring",
      price: 3299,
      originalPrice: 3999,
      image: "/placeholder.svg?height=300&width=300",
      rating: 5,
      reviews: 124,
      category: "Rings",
      material: "Diamond",
      isNew: true,
      isSale: true,
    },
    {
      id: 2,
      name: "Pearl Drop Earrings",
      price: 899,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.8,
      reviews: 89,
      category: "Earrings",
      material: "Pearl",
      isBestseller: true,
    },
    {
      id: 3,
      name: "Gold Tennis Bracelet",
      price: 2199,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.9,
      reviews: 156,
      category: "Bracelets",
      material: "Gold",
      isLimited: true,
    },
    {
      id: 4,
      name: "Sapphire Pendant Necklace",
      price: 1799,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.7,
      reviews: 67,
      category: "Necklaces",
      material: "Sapphire",
    },
    {
      id: 5,
      name: "Emerald Stud Earrings",
      price: 2899,
      image: "/placeholder.svg?height=300&width=300",
      rating: 5,
      reviews: 203,
      category: "Earrings",
      material: "Emerald",
      isNew: true,
    },
    {
      id: 6,
      name: "Platinum Wedding Band",
      price: 1299,
      image: "/placeholder.svg?height=300&width=300",
      rating: 4.9,
      reviews: 178,
      category: "Rings",
      material: "Platinum",
    },
  ]

  const categories = ["Rings", "Necklaces", "Earrings", "Bracelets", "Watches"]
  const materials = ["Diamond", "Gold", "Silver", "Platinum", "Pearl", "Sapphire", "Emerald", "Ruby"]

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category])
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    }
  }

  const handleMaterialChange = (material: string, checked: boolean) => {
    if (checked) {
      setSelectedMaterials([...selectedMaterials, material])
    } else {
      setSelectedMaterials(selectedMaterials.filter((m) => m !== material))
    }
  }

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <Label className="text-base font-semibold mb-4 block">Price Range</Label>
        <Slider value={priceRange} onValueChange={setPriceRange} max={10000} step={100} className="mb-4" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>

      {/* Categories */}
      <div>
        <Label className="text-base font-semibold mb-4 block">Categories</Label>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
              />
              <Label htmlFor={category} className="text-sm font-normal">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Materials */}
      <div>
        <Label className="text-base font-semibold mb-4 block">Materials</Label>
        <div className="space-y-3">
          {materials.map((material) => (
            <div key={material} className="flex items-center space-x-2">
              <Checkbox
                id={material}
                checked={selectedMaterials.includes(material)}
                onCheckedChange={(checked) => handleMaterialChange(material, checked as boolean)}
              />
              <Label htmlFor={material} className="text-sm font-normal">
                {material}
              </Label>
            </div>
          ))}
        </div>
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
            <h1 className="font-playfair text-4xl font-bold mb-2">Luxury Collection</h1>
            <p className="text-muted-foreground">Discover our exquisite jewelry pieces</p>
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
                Showing {products.length} of {products.length} products
              </p>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="relative">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        {product.isNew && <Badge className="bg-green-500">New</Badge>}
                        {product.isBestseller && <Badge className="bg-red-500">Bestseller</Badge>}
                        {product.isLimited && <Badge className="bg-purple-500">Limited</Badge>}
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
                                i < Math.floor(product.rating) ? "fill-gold text-gold" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground ml-2">({product.reviews})</span>
                      </div>

                      <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>

                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-bold text-gold">${product.price.toLocaleString()}</span>
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
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="flex">
                      <div className="relative w-48 h-48 flex-shrink-0">
                        <Image
                          src={product.image || "/placeholder.svg"}
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
                              {product.isBestseller && <Badge className="bg-red-500">Bestseller</Badge>}
                              {product.isLimited && <Badge className="bg-purple-500">Limited</Badge>}
                              {product.isSale && <Badge className="bg-orange-500">Sale</Badge>}
                            </div>

                            <h3 className="font-semibold text-xl mb-2">{product.name}</h3>

                            <div className="flex items-center mb-3">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < Math.floor(product.rating) ? "fill-gold text-gold" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-muted-foreground ml-2">
                                {product.rating} ({product.reviews} reviews)
                              </span>
                            </div>

                            <div className="flex items-center gap-3 mb-4">
                              <span className="text-2xl font-bold text-gold">${product.price.toLocaleString()}</span>
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
            <div className="flex justify-center mt-12">
              <div className="flex items-center gap-2">
                <Button variant="outline" disabled>
                  Previous
                </Button>
                <Button variant="default" className="bg-gold hover:bg-gold/90 text-black">
                  1
                </Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <Button variant="outline">Next</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
