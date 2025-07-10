"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Keep for potential future use or specific filters
import {
  Diamond,
  Crown,
  Gem,
  Award,
  Grid,
  List,
  Search,
  Heart,
  Star,
  ArrowRight,
  Filter, // Added for filter button
  ChevronDown, // Added for dropdown icon
} from "lucide-react";
import Link from "next/link";
import { Header } from "../../../components/header";
import { useToast } from "@/components/ui/use-toast";
import { useDebounce } from "use-debounce";
import { useParams } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // For popover filters
import { Separator } from "@/components/ui/separator"; // For subtle separators in filters
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // For radio button filters
import { Label } from "@/components/ui/label"; // For labels

// --- Interfaces (Copy these from HomePage or a shared types file) ---
interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  count?: number; // Added for UI display, will be calculated on client-side
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: Category | string; // Can be Category object or just its ID string
  description: string;
  shortDescription?: string;
  sku?: string;
  stock?: number;
  weight?: string;
  dimensions?: string;
  featured: boolean;
  images: string[];
  badge?:
    | "Bestseller"
    | "New"
    | "Sale"
    | "Exclusive"
    | "Popular"
    | "Limited"
    | "Trending"
    | "Luxury"
    | "Heritage";
  rating: number;
  reviews: number;
  originalPrice?: number; // For sale products
}

// Define a static mapping for category icons (for UI display)
const staticCategoryIcons: { [key: string]: JSX.Element } = {
  All: <Diamond className="h-5 w-5" />, // Default for 'All'
  Rings: <Gem className="h-5 w-5" />,
  Necklaces: <Crown className="h-5 w-5" />,
  Earrings: <Award className="h-5 w-5" />,
  Bracelets: <Diamond className="h-5 w-5" />, // Example, use a different one if you have it
  // Add more mappings for your specific categories as needed
};

export default function SingleCollectionsPage() {
  const { toast } = useToast();
  const params = useParams();
  // Get the category slug from the URL (e.g., 'engagement-rings')
  const urlCategorySlug = params.slug as string;

  // --- State for UI interactions ---
  const [cartCount, setCartCount] = useState(2);
  const [wishlistCount, setWishlistCount] = useState(5);

  // --- State for Filters and Search ---
  // Initialize selectedCategory based on the URL slug, will be updated to name later
  const [selectedCategory, setSelectedCategory] = useState(
    urlCategorySlug || "all"
  );
  const [priceRange, setPriceRange] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);

  // --- State for API Data ---
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- API Fetching Functions ---
  const fetchCategories = useCallback(async (): Promise<Category[]> => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/category/all-categories`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch categories: ${res.statusText}`);
      }
      const data = await res.json();
      return Array.isArray(data)
        ? data.map((cat: any) => ({
            id: cat._id || cat.id,
            name: cat.name,
            slug: cat.slug || cat.name?.toLowerCase().replace(/\s/g, "-"),
            image: cat.image || null,
          }))
        : [];
    } catch (err) {
      console.error("Error fetching categories:", err);
      toast({
        title: "Error",
        description: "Failed to load categories.",
        variant: "destructive",
      });
      return [];
    }
  }, [toast]);

  const fetchProducts = useCallback(async (): Promise<Product[]> => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/all`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch products: ${res.statusText}`);
      }
      const data = await res.json();
      return Array.isArray(data)
        ? data.map((prod: any) => ({
            id: prod._id || prod.id,
            name: prod.name || "Unknown Product",
            price: prod.price || 0,
            category: prod.category,
            description: prod.description || "No description available.",
            featured: prod.featured || false,
            images:
              prod.images && Array.isArray(prod.images) && prod.images.length > 0
                ? prod.images
                : ["/placeholder.svg"],
            badge: prod.badge || (prod.featured ? "Featured" : "New"),
            rating: prod.rating || 4.5,
            reviews: prod.reviews || Math.floor(Math.random() * 500) + 50,
            originalPrice: prod.originalPrice || undefined,
          }))
        : [];
    } catch (err) {
      console.error("Error fetching products:", err);
      toast({
        title: "Error",
        description: "Failed to load products.",
        variant: "destructive",
      });
      return [];
    }
  }, [toast]);

  // --- Unified Data Loader ---
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [productData, categoryData] = await Promise.all([
        fetchProducts(), // Fetch all products initially
        fetchCategories(),
      ]);

      // Map product categories to full category objects for easier filtering
      const productsWithResolvedCategories: Product[] = productData.map(
        (product) => {
          let resolvedCategory: Category = {
            id: "",
            name: "Uncategorized",
            slug: "uncategorized",
          };

          if (typeof product.category === "string") {
            const foundCategory = categoryData.find(
              (c) => c.id === product.category
            );
            if (foundCategory) {
              resolvedCategory = foundCategory;
            }
          } else if (
            product.category &&
            typeof product.category === "object" &&
            product.category.id
          ) {
            resolvedCategory = {
              id: product.category.id,
              name: product.category.name || "Uncategorized",
              slug:
                product.category.slug ||
                product.category.name.toLowerCase().replace(/\s/g, "-"),
              image: product.category.image || null,
            };
          }
          return { ...product, category: resolvedCategory };
        }
      );

      setProducts(productsWithResolvedCategories);

      // Calculate product counts for each category for UI display
      const categoryCounts: { [key: string]: number } = {};
      productsWithResolvedCategories.forEach((p) => {
        if (typeof p.category !== "string") {
          categoryCounts[p.category.name] =
            (categoryCounts[p.category.name] || 0) + 1;
        }
      });

      const categoriesWithCounts = [
        // The "All" option for going back to a full collections view
        {
          name: "All",
          icon: staticCategoryIcons["All"],
          count: productsWithResolvedCategories.length,
          slug: "all",
          image: "/all-collections-banner.jpg",
        }, // Add a default image for 'All'
        ...categoryData.map((cat) => ({
          ...cat,
          count: categoryCounts[cat.name] || 0,
          icon: staticCategoryIcons[cat.name] || <Diamond className="h-5 w-5" />, // Use static map or default
        })),
      ];
      setCategories(categoriesWithCounts);

      // Set selectedCategory based on the URL slug AFTER categories are loaded
      const foundUrlCategory = categoriesWithCounts.find(
        (cat) => cat.slug === urlCategorySlug
      );
      if (foundUrlCategory) {
        setSelectedCategory(foundUrlCategory.name);
      } else if (urlCategorySlug !== "all") {
        // If slug doesn't match any known category and it's not "all", show a toast
        toast({
          title: "Category Not Found",
          description: `The category "${decodeURIComponent(
            urlCategorySlug
          )}" does not exist. Displaying all products.`,
          variant: "destructive",
        });
        setSelectedCategory("All"); // Default to 'All' if category not found
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unknown error occurred while loading data."
      );
    } finally {
      setLoading(false);
    }
  }, [fetchProducts, fetchCategories, toast, urlCategorySlug]);

  // --- Initial Data Load ---
  useEffect(() => {
    loadData();
  }, [loadData]);

  // --- Filtering Logic ---
  const getFilteredProducts = useCallback(() => {
    let tempProducts = [...products]; // Start with all products

    // 1. Filter by Category (this will initially filter by the URL category)
    if (selectedCategory !== "All") {
      // Use "All" as per categoriesWithCounts
      tempProducts = tempProducts.filter(
        (product) =>
          typeof product.category !== "string" &&
          product.category.name === selectedCategory
      );
    }

    // 2. Filter by Price Range
    if (priceRange !== "All") {
      tempProducts = tempProducts.filter((product) => {
        if (priceRange === "Under $1,000") return product.price < 1000;
        if (priceRange === "$1,000 - $2,500")
          return product.price >= 1000 && product.price <= 2500;
        if (priceRange === "$2,500 - $5,000")
          return product.price >= 2500 && product.price <= 5000;
        if (priceRange === "$5,000 - $10,000")
          return product.price >= 5000 && product.price <= 10000;
        if (priceRange === "Over $10,000") return product.price > 10000;
        return true;
      });
    }

    // 3. Filter by Search Query (using debounced query)
    if (debouncedSearchQuery) {
      tempProducts = tempProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase())
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
        // This sorting assumes product IDs are somewhat chronological or comparable
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

  // Find the current category object to get its image
  const currentCategory = categories.find((cat) => cat.name === selectedCategory);
  const heroBackgroundImage =
    currentCategory?.image || "/default-category-banner.jpg"; // Fallback to a default image

  // --- UI Render ---
  return (
    <div className="min-h-screen bg-white text-[#111111]">
      <Header cartCount={cartCount} wishlistCount={wishlistCount} />

      {/* Hero Section - Updated for Category Image and Glassmorphism */}
      <section
        className="relative pt-16 pb-16 bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroBackgroundImage})`,
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center text-white"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 px-6 py-2 text-lg mb-6 shadow-md">
              Luxury Collections
            </Badge>
            <h1
              className="text-6xl md:text-7xl font-bold mb-6 leading-tight drop-shadow-lg"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Discover the Art of{" "}
              <span className="block text-[#D4AF37] animate-pulse-slow">
                {selectedCategory !== "All"
                  ? `${selectedCategory} Elegance`
                  : "Timeless Luxury"}
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed font-light">
              Explore our curated collections of the world's finest jewelry, each
              piece crafted to perfection and designed to last generations.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters and Search - Redesigned with Popovers and more visual emphasis */}
      <section className="py-8 bg-[#F8F8F8] border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            {/* Category Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full lg:w-auto justify-between border-gray-300 text-gray-700 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300 px-6 py-3 rounded-full"
                >
                  <Filter className="mr-2 h-5 w-5" />
                  Categories:{" "}
                  <span className="font-semibold ml-1">{selectedCategory}</span>
                  <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0 rounded-lg shadow-xl border border-gray-100 bg-white">
                <div className="p-4">
                  <h4 className="font-bold mb-3 text-lg">Select Category</h4>
                  <Separator className="mb-4 bg-gray-200" />
                  <RadioGroup
                    value={selectedCategory}
                    onValueChange={(value) => setSelectedCategory(value)}
                  >
                    {categories.map((cat) => (
                      <div
                        key={cat.id || cat.slug}
                        className="flex items-center space-x-3 mb-2"
                      >
                        <RadioGroupItem value={cat.name} id={`cat-${cat.slug}`} />
                        <Label
                          htmlFor={`cat-${cat.slug}`}
                          className="flex items-center text-base cursor-pointer hover:text-[#D4AF37] transition-colors"
                        >
                          {cat.icon}
                          <span className="ml-2">{cat.name}</span>
                          <Badge
                            variant="secondary"
                            className="ml-auto bg-gray-100 text-gray-600 font-normal"
                          >
                            {cat.count}
                          </Badge>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </PopoverContent>
            </Popover>

            {/* Price Range Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full lg:w-auto justify-between border-gray-300 text-gray-700 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300 px-6 py-3 rounded-full"
                >
                  <List className="mr-2 h-5 w-5" />
                  Price: <span className="font-semibold ml-1">{priceRange}</span>
                  <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0 rounded-lg shadow-xl border border-gray-100 bg-white">
                <div className="p-4">
                  <h4 className="font-bold mb-3 text-lg">Filter by Price</h4>
                  <Separator className="mb-4 bg-gray-200" />
                  <RadioGroup
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value)}
                  >
                    {[
                      "All",
                      "Under $1,000",
                      "$1,000 - $2,500",
                      "$2,500 - $5,000",
                      "$5,000 - $10,000",
                      "Over $10,000",
                    ].map((range) => (
                      <div
                        key={range}
                        className="flex items-center space-x-3 mb-2"
                      >
                        <RadioGroupItem value={range} id={`price-${range}`} />
                        <Label
                          htmlFor={`price-${range}`}
                          className="text-base cursor-pointer hover:text-[#D4AF37] transition-colors"
                        >
                          {range}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </PopoverContent>
            </Popover>

            {/* Sort By Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full lg:w-auto justify-between border-gray-300 text-gray-700 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300 px-6 py-3 rounded-full"
                >
                  <Star className="mr-2 h-5 w-5" />
                  Sort By: <span className="font-semibold ml-1">{sortBy}</span>
                  <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0 rounded-lg shadow-xl border border-gray-100 bg-white">
                <div className="p-4">
                  <h4 className="font-bold mb-3 text-lg">Sort Products By</h4>
                  <Separator className="mb-4 bg-gray-200" />
                  <RadioGroup
                    value={sortBy}
                    onValueChange={(value) => setSortBy(value)}
                  >
                    {[
                      "Featured",
                      "Newest First",
                      "Price: Low to High",
                      "Price: High to Low",
                      "Best Selling",
                      "Highest Rated",
                    ].map((sortOption) => (
                      <div
                        key={sortOption}
                        className="flex items-center space-x-3 mb-2"
                      >
                        <RadioGroupItem
                          value={sortOption}
                          id={`sort-${sortOption}`}
                        />
                        <Label
                          htmlFor={`sort-${sortOption}`}
                          className="text-base cursor-pointer hover:text-[#D4AF37] transition-colors"
                        >
                          {sortOption}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </PopoverContent>
            </Popover>

            {/* Search */}
            <div className="relative flex-1 max-w-lg w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search collections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-3 pr-4 border-gray-300 focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 w-full rounded-full transition-all duration-300 shadow-sm"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-full overflow-hidden shadow-sm">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 transition-all duration-300 ${
                  viewMode === "grid"
                    ? "bg-[#D4AF37] text-white hover:bg-[#D4AF37]/90"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Grid className="h-5 w-5" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 transition-all duration-300 ${
                  viewMode === "list"
                    ? "bg-[#D4AF37] text-white hover:bg-[#D4AF37]/90"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <List className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid (Dynamic) */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2
              className="text-4xl font-bold text-[#111111]"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              {selectedCategory === "All"
                ? "All Collections"
                : `${selectedCategory} Collection`}
            </h2>
          </div>

          {loading ? (
            <div
              className={`grid gap-8 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              } animate-pulse`}
            >
              {Array.from({ length: 8 }).map((_, i) => (
                <Card
                  key={`product-skel-${i}`}
                  className={`border-0 shadow-lg rounded-xl overflow-hidden ${
                    viewMode === "list" ? "flex flex-col sm:flex-row" : ""
                  }`}
                >
                  <div
                    className={`relative overflow-hidden bg-gray-200 ${
                      viewMode === "list" ? "w-full sm:w-1/3 h-64" : "w-full h-72"
                    } rounded-t-xl sm:rounded-l-xl sm:rounded-t-none`}
                  ></div>
                  <CardContent className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-5"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                    <div className="h-10 bg-gray-200 rounded-full"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-20">
              <p className="text-xl mb-4">Error loading products: {error}</p>
              <Button
                onClick={loadData}
                className="bg-[#D4AF37] hover:bg-yellow-600 text-[#111111] px-8 py-3 rounded-full font-semibold"
              >
                Retry Loading Products
              </Button>
            </div>
          ) : filteredAndSortedProducts.length === 0 ? (
            <div className="text-center text-gray-500 py-20">
              <p className="text-2xl font-semibold mb-4">
                No products found matching your criteria.
              </p>
              <p className="text-lg mb-6">
                Try adjusting your filters or search query.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setPriceRange("All");
                }}
                className="mt-4 bg-[#D4AF37] hover:bg-yellow-600 text-[#111111] px-8 py-3 rounded-full font-semibold shadow-md"
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div
              className={`grid gap-8 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {filteredAndSortedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="group cursor-pointer"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.08 }} // Slightly reduced delay
                  whileHover={{ y: -8 }} // Reduced hover lift for subtlety
                >
                  <Link href={`/products/${product.id}`} className="block">
                    {/* Ensure Link wraps the whole card */}
                    <Card
                      className={`border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white rounded-xl group-hover:ring-2 group-hover:ring-[#D4AF37]/50 ${
                        viewMode === "list" ? "flex flex-col sm:flex-row" : ""
                      }`}
                    >
                      <div
                        className={`relative overflow-hidden ${
                          viewMode === "list"
                            ? "w-full sm:w-1/3 h-64"
                            : "w-full h-72"
                        } rounded-t-xl sm:rounded-l-xl sm:rounded-t-none`}
                      >
                        <motion.div className="absolute inset-0 bg-gradient-to-t from-[#D4AF37]/10 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <motion.img
                          src={product.images[0]} // Display the first image
                          alt={product.name}
                          className={`object-cover ${
                            viewMode === "list" ? "w-full h-full" : "w-full h-full"
                          }`}
                          whileHover={{ scale: 1.08 }} // Slightly reduced scale for subtlety
                          transition={{ duration: 0.5 }}
                        />
                        {product.badge && (
                          <Badge className="absolute top-4 left-4 bg-[#D4AF37] text-[#111111] font-bold text-sm px-3 py-1 rounded-full shadow-md">
                            {product.badge}
                          </Badge>
                        )}
                        <motion.button
                          className="absolute top-4 right-4 p-2.5 bg-white/95 hover:bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 border border-gray-100"
                          whileHover={{ scale: 1.15 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.preventDefault(); // Prevent navigating when clicking add to cart
                            setWishlistCount(wishlistCount + 1);
                            toast({
                              title: "Item Added to Wishlist!",
                              description: `${product.name} has been added to your wishlist.`,
                              duration: 2000,
                            });
                          }}
                        >
                          <Heart className="h-5 w-5 text-[#111111] hover:text-[#D4AF37] transition-colors" />
                        </motion.button>
                      </div>
                      <CardContent className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                        <h3
                          className="font-bold text-2xl text-[#111111] mb-2 leading-tight"
                          style={{ fontFamily: "Playfair Display, serif" }}
                        >
                          {product.name}
                        </h3>
                        <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                          {product.description}
                        </p>

                        <div className="flex items-center mb-4">
                          <div className="flex items-center mr-4">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < product.rating
                                    ? "fill-[#D4AF37] text-[#D4AF37]"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            ({product.reviews} reviews)
                          </span>
                        </div>

                        <div className="flex items-baseline justify-between mb-6">
                          <div className="flex items-center space-x-3">
                            <span className="text-3xl font-bold text-[#D4AF37]">
                              ${product.price.toLocaleString()}
                            </span>
                            {product.originalPrice && (
                              <span className="text-lg text-gray-400 line-through">
                                ${product.originalPrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className={`${viewMode === "list" ? "flex gap-4" : "space-y-3"}`}>
                          <motion.button
                            className="flex-1 bg-gradient-to-r from-[#111111] to-gray-800 hover:from-[#D4AF37] hover:to-yellow-600 text-white hover:text-[#111111] py-3 rounded-full font-bold transition-all duration-500 shadow-lg transform hover:-translate-y-0.5"
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={(e) => {
                              e.preventDefault(); // Prevent navigating when clicking add to cart
                              setCartCount(cartCount + 1);
                              toast({
                                title: "Item Added to Cart!",
                                description: `${product.name} has been added to your cart.`,
                                duration: 2000,
                              });
                            }}
                          >
                            Add to Cart
                          </motion.button>

                          {viewMode === "list" && (
                            <motion.button
                              className="px-6 py-3 border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white rounded-full font-bold transition-all duration-300 shadow-md transform hover:-translate-y-0.5"
                              whileHover={{ scale: 1.01 }}
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
          {filteredAndSortedProducts.length > 0 &&
            products.length > filteredAndSortedProducts.length && (
              <motion.div
                className="text-center mt-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <motion.button
                  className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 hover:from-yellow-500 hover:to-[#D4AF37] text-[#111111] px-12 py-4 text-xl font-bold rounded-full transition-all duration-500 shadow-xl hover:shadow-2xl flex items-center justify-center mx-auto"
                  whileHover={{ scale: 1.03 }} // Slightly reduced scale for subtlety
                  whileTap={{ scale: 0.97 }}
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
      <section className="py-20 bg-[#111111] text-white border-t border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2
              className="text-5xl font-bold mb-4 text-[#D4AF37] leading-tight"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              Stay Updated with Our{" "}
              <span className="block text-white">Exclusive Offers</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto font-light">
              Be the first to know about new arrivals, bespoke collections, and
              special events curated just for you.
            </p>
            <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Enter your email address"
                className="flex-1 bg-white/10 text-white border border-gray-700 py-3 px-5 rounded-full focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 placeholder-gray-400"
              />
              <Button className="bg-[#D4AF37] hover:bg-yellow-600 text-[#111111] px-8 py-3 font-bold rounded-full shadow-lg transition-all duration-300">
                Subscribe Now
              </Button>
            </div>
          </motion.div>
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
    
  );
}