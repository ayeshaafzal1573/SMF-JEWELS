"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, PlusCircle, Filter, MoreHorizontal, Edit, Trash, Eye, Sparkles, RefreshCw } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useDebounce } from "use-debounce"
import { toast } from "@/components/ui/use-toast"

interface Category {
  id: string
  name: string
}

interface Product {
  id: string
  _id?: string
  name: string
  price: number
  category?: Category | string
  stock: number
  status?: "In Stock" | "Low Stock" | "Out of Stock"
  featured?: boolean
  images?: string[]
}

export default function ProductsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedQuery] = useDebounce(searchQuery, 300)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

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

  const fetchCategories = useCallback(async () => {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/category/all-categories`
      const res = await fetch(apiUrl)

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      return await res.json()
    } catch (err) {
      console.error("Error fetching categories:", err)
      throw new Error(`Failed to fetch categories: ${err instanceof Error ? err.message : String(err)}`)
    }
  }, [])

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [productData, categoryData] = await Promise.all([
        fetchProducts(),
        fetchCategories()
      ])

      const mappedProducts = productData.map((product: any) => {
        const id = product._id || product.id || `temp-${Math.random().toString(36).substr(2, 9)}`
        let category: Category
        if (typeof product.category === 'string') {
          const foundCategory = categoryData.find((c: Category) => c.id === product.category || c._id === product.category)
          category = foundCategory || { id: product.category, name: 'Uncategorized' }
        } else if (product.category && typeof product.category === 'object') {
          // If category is an object, use it directly
          category = {
            id: product.category._id || product.category.id,
            name: product.category.name || 'Uncategorized'
          }
        } else {
          // Default empty category
          category = { id: '', name: 'Uncategorized' }
        }

        return {
          id,
          name: product.name || 'Unknown Product',
          price: product.price || 0,
          category,
          stock: product.stock || 0,
          status:
            product.stock === 0 ? "Out of Stock" :
              product.stock < 5 ? "Low Stock" : "In Stock",
          featured: product.featured || false,
          images: product.images || []
        }
      })

      setProducts(mappedProducts)
      setCategories(categoryData)
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
  }, [fetchProducts, fetchCategories])

  useEffect(() => {
    loadData()
  }, [loadData])



  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const token = localStorage.getItem("token") || ""
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/delete-product/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.detail || "Failed to delete product")
      }

      toast({
        title: "Success",
        description: "Product deleted successfully"
      })

      // Optimistic update
      setProducts(prev => prev.filter(p => p.id !== productId))
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete product",
        variant: "destructive"
      })
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      product.id.toLowerCase().includes(debouncedQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === "all" ||
      product.category?.id === selectedCategory

    return matchesSearch && matchesCategory
  })

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-red-500 text-center max-w-md">{error}</p>
        <Button onClick={loadData}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header and controls remain the same */}

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">
              <Skeleton className="h-6 w-1/4" />
              {[...Array(5)].map((_, i) => (
                <Skeleton key={`skeleton-${i}`} className="h-4 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>

                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-center">Stock</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No products found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product, index) => (
                    <motion.tr
                      key={`product-${product.id}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >

                      <TableCell>
                        <div className="font-medium"><img src={product.images[0]} alt="Current" className="w-10 h-10 object-cover rounded-md" />{product.name}</div>
                        {product.featured && (
                          <span className="text-xs text-gold">Featured</span>
                        )}
                      </TableCell>
                   
                      <TableCell>{product.category?.name || 'Uncategorized'}</TableCell>
                      <TableCell className="text-right">{product.price.toFixed(2)}</TableCell>
                      <TableCell className="text-center">{product.stock}</TableCell>
                      <TableCell className="text-center">
                        <div
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${product.status === "In Stock" ? "bg-green-100 text-green-800" :
                              product.status === "Low Stock" ? "bg-yellow-100 text-yellow-800" :
                                "bg-red-100 text-red-800"}`}
                        >
                          {product.status}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/admin/products/${product.id}`)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/admin/products/edit?id=${product.id}`)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDelete(product.id)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> products
        </p>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" className="bg-muted">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}