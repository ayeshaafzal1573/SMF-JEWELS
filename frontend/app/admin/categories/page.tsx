// app/admin/categories/page.tsx
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Plus, Edit, Trash2, Save, X, ArrowLeft, Upload, Loader2 } from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
  image?: string | null
}

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<Partial<Category>>({
    name: "",
    slug: "",
    image: "",
  })
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  
  const { toast } = useToast()
  const router = useRouter()

  const getAuthToken = () => {
    return localStorage.getItem("token")
  }

  const fetchCategories = async () => {
    setLoading(true)
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
        if (res.status === 401 || res.status === 403) {
          toast({
            title: "Authentication Required",
            description: "Please log in to view categories.",
            variant: "destructive",
          })
          router.push("/admin/login")
          return
        }
        throw new Error("Failed to fetch categories")
      }

      const result = await res.json()
      setCategories(result)
    } catch (error) {
      console.error("Error fetching categories:", error)
      toast({
        title: "Error",
        description: "Failed to load categories. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCurrentCategory((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImageFile(e.target.files[0])
    } else {
      setSelectedImageFile(null)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setCurrentCategory((prev) => ({
      ...prev,
      name: value,
      slug: generateSlug(value),
    }))
  }

  const handleAddEditCategory = async () => {
    if (!currentCategory.name || !currentCategory.slug) {
      toast({
        title: "Validation Error",
        description: "Category name and slug are required.",
        variant: "destructive",
      })
      return
    }

    const token = getAuthToken()
    if (!token) {
      toast({
        title: "Authentication Error",
        description: "You are not logged in. Please log in to perform this action.",
        variant: "destructive",
      })
      router.push("/admin/login")
      return
    }

    setIsSubmitting(true)
    try {
      let res
      let method
      let url

      const formData = new FormData()
      formData.append("name", currentCategory.name)
      formData.append("slug", currentCategory.slug)

      if (selectedImageFile) {
        formData.append("image", selectedImageFile)
      } else if (currentCategory.image && isEditMode) {
        formData.append("image_url_existing", currentCategory.image)
      }

      if (isEditMode && currentCategory.id) {
        method = "PUT"
        url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/category/update-category/${currentCategory.id}`
      } else {
        method = "POST"
        url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/category/add-category`
      }

      res = await fetch(url, {
        method: method,
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      })

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          toast({
            title: "Authorization Error",
            description: "You don't have permission to perform this action. Please log in with an admin account.",
            variant: "destructive",
          })
          router.push("/admin/login")
          return
        }
        const errorData = await res.json()
        throw new Error(errorData.message || `Failed to ${isEditMode ? "update" : "add"} category`)
      }

      toast({
        title: "Success",
        description: `Category ${isEditMode ? "updated" : "added"} successfully!`,
      })
      setIsDialogOpen(false)
      setCurrentCategory({ name: "", slug: "", image: "" })
      setSelectedImageFile(null)
      fetchCategories()
    } catch (error: any) {
      console.error("Error saving category:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save category. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      return
    }

    const token = getAuthToken()
    if (!token) {
      toast({
        title: "Authentication Error",
        description: "You are not logged in. Please log in to perform this action.",
        variant: "destructive",
      })
      router.push("/admin/login")
      return
    }

    setIsDeleting(id)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/category/delete-category/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          toast({
            title: "Authorization Error",
            description: "You don't have permission to delete categories. Please log in with an admin account.",
            variant: "destructive",
          })
          router.push("/admin/login")
          return
        }
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to delete category")
      }

      toast({
        title: "Success",
        description: "Category deleted successfully!",
      })
      fetchCategories()
    } catch (error: any) {
      console.error("Error deleting category:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete category. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const openAddDialog = () => {
    setIsEditMode(false)
    setCurrentCategory({ name: "", slug: "", image: "" })
    setSelectedImageFile(null)
    setIsDialogOpen(true)
  }

  const openEditDialog = (category: Category) => {
    setIsEditMode(true)
    setCurrentCategory(category)
    setSelectedImageFile(null)
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" asChild>
            <a href="/admin/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </a>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Categories</h1>
            <p className="text-muted-foreground">Add, edit, or delete product categories.</p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gold hover:bg-gold/90 text-black" onClick={openAddDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{isEditMode ? "Edit Category" : "Add New Category"}</DialogTitle>
              <DialogDescription>
                {isEditMode ? "Update the details of this category." : "Create a new category for your products."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="categoryName">Category Name</Label>
                <Input
                  id="categoryName"
                  name="name"
                  value={currentCategory.name || ""}
                  onChange={handleNameChange}
                  placeholder="e.g., Rings, Necklaces"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categorySlug">Slug</Label>
                <Input
                  id="categorySlug"
                  name="slug"
                  value={currentCategory.slug || ""}
                  onChange={handleInputChange}
                  placeholder="e.g., rings, necklaces"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryImage">Category Image</Label>
                <Input
                  id="categoryImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                />
                {isEditMode && currentCategory.image && !selectedImageFile && (
                  <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
                    <img src={currentCategory.image} alt="Current" className="w-10 h-10 object-cover rounded-md" />
                    Current Image
                  </div>
                )}
                {selectedImageFile && (
                  <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Selected: {selectedImageFile.name}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button 
                type="submit" 
                onClick={handleAddEditCategory} 
                className="bg-gold hover:bg-gold/90 text-black"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditMode ? "Saving..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {isEditMode ? "Save Changes" : "Create Category"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
          <CardDescription>A list of all your product categories.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              <span>Loading categories...</span>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No categories found. Click "Add New Category" to get started!
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category.slug}</TableCell>
                    <TableCell>
                      {category.image ? (
                        <img src={category.image} alt={category.name} className="w-10 h-10 object-cover rounded-md" />
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => openEditDialog(category)}
                          disabled={isDeleting === category.id}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          onClick={() => handleDeleteCategory(category.id)}
                          disabled={isDeleting === category.id}
                        >
                          {isDeleting === category.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}