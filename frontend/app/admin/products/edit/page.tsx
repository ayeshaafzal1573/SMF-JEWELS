"use client"

import { useState, useRef, ChangeEvent, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Save, X, Upload, Sparkles, ArrowLeft, ImagePlus, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

type ProductData = {
    name: string
    price: string
    category: string
    description: string
    shortDescription: string
    sku: string
    stock: string
    weight: string
    dimensions: string
    featured: boolean
}

type Category = {
    id: string
    name: string
}

export default function EditProductPage() {
    const router = useRouter()
    const { toast } = useToast()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const searchParams = useSearchParams()
    const productId = searchParams.get("id")

    const [categories, setCategories] = useState<Category[]>([])
    const [isLoadingCategories, setIsLoadingCategories] = useState(true)
    const [isLoadingProduct, setIsLoadingProduct] = useState(true)
    const [activeTab, setActiveTab] = useState("general")
    const [isGenerating, setIsGenerating] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedImages, setSelectedImages] = useState<File[]>([])
    const [imagePreviews, setImagePreviews] = useState<string[]>([])

    const [productData, setProductData] = useState<ProductData>({
        name: "",
        price: "",
        category: "",
        description: "",
        shortDescription: "",
        sku: "",
        stock: "",
        weight: "",
        dimensions: "",
        featured: false,
    })

    // Redirect if productId is missing
    useEffect(() => {
        if (!productId) {
            router.push("/admin/products")
        }
    }, [productId, router])

    // Fetch product data
    useEffect(() => {
        if (!productId) return

        const fetchProduct = async () => {
            try {
                setIsLoadingProduct(true)
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${productId}`)
                if (!res.ok) throw new Error("Failed to fetch product")

                const data = await res.json()
                setProductData({
                    name: data.name,
                    price: data.price.toString(),
                    category: data.category?.id || "",
                    description: data.description,
                    shortDescription: data.shortDescription,
                    sku: data.sku,
                    stock: data.stock.toString(),
                    weight: data.weight,
                    dimensions: data.dimensions,
                    featured: data.featured,
                })
                setImagePreviews(data.images || [])
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to load product data.",
                    variant: "destructive",
                })
            } finally {
                setIsLoadingProduct(false)
            }
        }

        fetchProduct()
    }, [productId, toast])

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/category/all-categories`)
                if (!res.ok) throw new Error("Failed to fetch categories")
                const data = await res.json()
                setCategories(data)
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to load categories",
                    variant: "destructive",
                })
            } finally {
                setIsLoadingCategories(false)
            }
        }

        fetchCategories()
    }, [toast])

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setProductData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSwitchChange = (name: string, checked: boolean) => {
        setProductData((prev) => ({ ...prev, [name]: checked }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setProductData((prev) => ({ ...prev, [name]: value }))
    }
const handleGenerateDescription = async () => {
    if (!productData.name) {
        toast({
            title: "Error",
            description: "Please enter a product name first",
            variant: "destructive",
        })
        return
    }

    setIsGenerating(true)
    try {
        const token = localStorage.getItem("token") || ""
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/ai/generate-description`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                productName: productData.name,
                category: categories.find(c => c.id === productData.category)?.name || "jewelry"
            })
        })

        if (!response.ok) {
            throw new Error("Failed to generate description")
        }

        const { description } = await response.json()
        setProductData(prev => ({ ...prev, description }))

        toast({ 
            title: "Success", 
            description: "AI description generated successfully" 
        })
    } catch (error) {
        toast({
            title: "Error",
            description: "Failed to generate description",
            variant: "destructive",
        })
    } finally {
        setIsGenerating(false)
    }
}

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files)

            if (files.length + selectedImages.length > 5) {
                toast({
                    title: "Error",
                    description: "You can upload a maximum of 5 images",
                    variant: "destructive",
                })
                return
            }

            for (const file of files) {
                if (file.size > 5 * 1024 * 1024) {
                    toast({
                        title: "Error",
                        description: `File ${file.name} is too large (max 5MB)`,
                        variant: "destructive",
                    })
                    return
                }
            }

            setSelectedImages((prev) => [...prev, ...files])
            const previews = files.map((file) => URL.createObjectURL(file))
            setImagePreviews((prev) => [...prev, ...previews])
        }
    }

    const removeImage = (index: number) => {
        const newImages = [...selectedImages]
        newImages.splice(index, 1)
        setSelectedImages(newImages)

        const newPreviews = [...imagePreviews]
        URL.revokeObjectURL(newPreviews[index])
        newPreviews.splice(index, 1)
        setImagePreviews(newPreviews)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!productData.name || !productData.price || !productData.category || !productData.stock) {
            toast({
                title: "Error",
                description: "Please fill all required fields",
                variant: "destructive",
            })
            return
        }

        setIsSubmitting(true)

        try {
            const token = localStorage.getItem("token") || ""
            const formData = new FormData()

            // Append all product data
            Object.entries(productData).forEach(([key, value]) => {
                formData.append(key, value.toString())
            })

            // Append existing image URLs if they're strings (not File objects)
            const existingImages = imagePreviews.filter(img => typeof img === "string")
            if (existingImages.length > 0) {
                formData.append("existing_images", existingImages.join(","))
            }

            // Append new images
            selectedImages.forEach((file) => {
                formData.append("images", file)
            })

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/update-product/${productId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            })

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}))
                throw new Error(errorData.message || "Failed to update product")
            }

            toast({ 
                title: "Success", 
                description: "Product updated successfully! Redirecting..." 
            })
            
            // Wait a moment before redirecting to show the success message
            setTimeout(() => {
                router.push("/admin/products")
            }, 1500)
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.message || "An unexpected error occurred",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!productId) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-center text-sm">Redirecting to products page...</p>
            </div>
        )
    }

    if (isLoadingProduct) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading product data...</span>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
                        <p className="text-muted-foreground">Edit product listing for your store.</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => router.push("/admin/products")}
                        disabled={isSubmitting}
                    >
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        form="product-form"
                        className="bg-gold hover:bg-gold/90 text-black"
                        disabled={isSubmitting || isLoadingProduct}
                    >
                        {isSubmitting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="mr-2 h-4 w-4" />
                        )}
                        {isSubmitting ? "Saving..." : "Save Product"}
                    </Button>
                </div>
            </div>

            <form id="product-form" onSubmit={handleSubmit}>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="media">Media</TabsTrigger>
                        <TabsTrigger value="inventory">Inventory</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="space-y-6 mt-6">
                        <div className="grid gap-6 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Basic Information</CardTitle>
                                    <CardDescription>Essential product details</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Product Name *</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            placeholder="Diamond Solitaire Ring"
                                            value={productData.name}
                                            onChange={handleChange}
                                            required
                                            disabled={isLoadingProduct}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="price">Price ($) *</Label>
                                            <Input
                                                id="price"
                                                name="price"
                                                type="number"
                                                placeholder="2999"
                                                value={productData.price}
                                                onChange={handleChange}
                                                required
                                                min="0"
                                                step="0.01"
                                                disabled={isLoadingProduct}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="category">Category *</Label>
                                            <Select
                                                value={productData.category}
                                                onValueChange={(value) => handleSelectChange("category", value)}
                                                required
                                                disabled={isLoadingCategories || isLoadingProduct}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {isLoadingCategories ? (
                                                        <div className="flex justify-center p-4">
                                                            <Loader2 className="h-5 w-5 animate-spin" />
                                                        </div>
                                                    ) : (
                                                        categories.map((category) => (
                                                            <SelectItem key={category.id} value={category.id}>
                                                                {category.name}
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="shortDescription">Short Description</Label>
                                        <Textarea
                                            id="shortDescription"
                                            name="shortDescription"
                                            placeholder="A brief description for product listings..."
                                            value={productData.shortDescription}
                                            onChange={handleChange}
                                            rows={2}
                                            disabled={isLoadingProduct}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Product Details</CardTitle>
                                    <CardDescription>Additional product specifications</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="sku">SKU</Label>
                                            <Input
                                                id="sku"
                                                name="sku"
                                                placeholder="RING-001"
                                                value={productData.sku}
                                                onChange={handleChange}
                                                disabled={isLoadingProduct}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="weight">Weight (g)</Label>
                                            <Input
                                                id="weight"
                                                name="weight"
                                                type="number"
                                                placeholder="5.2"
                                                value={productData.weight}
                                                onChange={handleChange}
                                                min="0"
                                                step="0.1"
                                                disabled={isLoadingProduct}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="dimensions">Dimensions</Label>
                                            <Input
                                                id="dimensions"
                                                name="dimensions"
                                                placeholder="20mm x 15mm"
                                                value={productData.dimensions}
                                                onChange={handleChange}
                                                disabled={isLoadingProduct}
                                            />
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label>Featured Product</Label>
                                            <p className="text-sm text-muted-foreground">Show on homepage</p>
                                        </div>
                                        <Switch
                                            checked={productData.featured}
                                            onCheckedChange={(checked) => handleSwitchChange("featured", checked)}
                                            disabled={isLoadingProduct}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Sparkles className="mr-2 h-5 w-5 text-gold" />
                                    Product Description
                                </CardTitle>
                                <CardDescription>Write a detailed description or use AI to generate one</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleGenerateDescription}
                                        disabled={isGenerating || !productData.name || isLoadingProduct}
                                        className="border-gold text-gold hover:bg-gold/10 bg-transparent"
                                    >
                                        {isGenerating ? (
                                            <div className="flex items-center">
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Generating...
                                            </div>
                                        ) : (
                                            <>
                                                <Sparkles className="mr-2 h-4 w-4" />
                                                Generate with AI
                                            </>
                                        )}
                                    </Button>
                                </div>

                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Enter a detailed product description..."
                                    value={productData.description}
                                    onChange={handleChange}
                                    rows={6}
                                    className="min-h-[150px]"
                                    disabled={isLoadingProduct}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="media" className="space-y-6 mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Product Images</CardTitle>
                                <CardDescription>Upload high-quality images of your product (Max 5 images)</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4">
                                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                                        <ImagePlus className="mx-auto h-12 w-12 text-muted-foreground" />
                                        <div className="mt-4">
                                            <input
                                                type="file"
                                                id="image-upload"
                                                multiple
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                accept="image/*"
                                                ref={fileInputRef}
                                                max={5}
                                                disabled={isLoadingProduct}
                                            />
                                            <Button
                                                variant="outline"
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={isLoadingProduct}
                                            >
                                                <Upload className="mr-2 h-4 w-4" />
                                                Upload Images
                                            </Button>
                                        </div>
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            Recommended size: 800x800px, Max file size: 5MB
                                        </p>
                                    </div>

                                    {imagePreviews.length > 0 && (
                                        <div className="grid grid-cols-3 gap-4 mt-4">
                                            {imagePreviews.map((preview, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={preview}
                                                        alt={`Preview ${index + 1}`}
                                                        className="rounded-md object-cover w-full h-40"
                                                    />
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
                                                        onClick={() => removeImage(index)}
                                                        disabled={isLoadingProduct}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="inventory" className="space-y-6 mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Inventory Management</CardTitle>
                                <CardDescription>Track stock levels and availability</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="stock">Stock Quantity *</Label>
                                        <Input
                                            id="stock"
                                            name="stock"
                                            type="number"
                                            placeholder="100"
                                            value={productData.stock}
                                            onChange={handleChange}
                                            required
                                            min="0"
                                            disabled={isLoadingProduct}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </form>
        </div>
    )
}