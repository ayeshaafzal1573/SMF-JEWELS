"use client"

import { useState, useRef, ChangeEvent,useEffect} from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Save, X, Upload, Sparkles, ArrowLeft, ImagePlus, Check, Loader2 } from "lucide-react"
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

export default function NewProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
   const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
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
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/category/all-categories`);
        if (!res.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive",
        });
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProductData(prev => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setProductData(prev => ({ ...prev, [name]: checked }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setProductData(prev => ({ ...prev, [name]: value }))
  }


  const handleGenerateDescription = () => {
    if (!productData.name) {
      toast({
        title: "Error",
        description: "Please enter a product name first",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    setTimeout(() => {
      const luxuryDescriptions = [
        `Introducing the exquisite ${productData.name}, a testament to unparalleled craftsmanship and timeless elegance.`,
        `The magnificent ${productData.name} represents the pinnacle of luxury jewelry design.`,
        `Discover the allure of the ${productData.name}, where artistry meets innovation.`
      ]

      const randomDescription = luxuryDescriptions[Math.floor(Math.random() * luxuryDescriptions.length)]
      setProductData(prev => ({ ...prev, description: randomDescription }))
      setIsGenerating(false)
      
      toast({
        title: "Success",
        description: "AI description generated successfully",
      })
    }, 2000)
  }

  // This is the missing handler that was causing the error
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      
      // Validate number of files (max 5)
      if (files.length + selectedImages.length > 5) {
        toast({
          title: "Error",
          description: "You can upload a maximum of 5 images",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 5MB each)
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

      setSelectedImages(prev => [...prev, ...files])
      
      // Create preview URLs
      const newPreviews = files.map(file => URL.createObjectURL(file))
      setImagePreviews(prev => [...prev, ...newPreviews])
    }
  }

  const removeImage = (index: number) => {
    const newImages = [...selectedImages]
    newImages.splice(index, 1)
    setSelectedImages(newImages)
    
    const newPreviews = [...imagePreviews]
    URL.revokeObjectURL(newPreviews[index]) // Clean up memory
    newPreviews.splice(index, 1)
    setImagePreviews(newPreviews)
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validate required fields
  if (!productData.name || !productData.price || !productData.category || !productData.stock) {
    toast({
      title: "Error",
      description: "Please fill all required fields",
      variant: "destructive",
    });
    return;
  }

  // Validate at least one image
  if (selectedImages.length === 0) {
    toast({
      title: "Error",
      description: "Please upload at least one product image",
      variant: "destructive",
    });
    return;
  }

  setIsSubmitting(true);

  try {
    const token = localStorage.getItem("token") || "";
    const formData = new FormData();
    
    // Append all product data
    formData.append("name", productData.name);
    formData.append("price", productData.price);
    formData.append("category", productData.category);
    formData.append("description", productData.description);
    formData.append("shortDescription", productData.shortDescription);
    formData.append("sku", productData.sku);
    formData.append("stock", productData.stock);
    formData.append("weight", productData.weight);
    formData.append("dimensions", productData.dimensions);
    formData.append("featured", productData.featured.toString());

    // Append each image file
    selectedImages.forEach((file) => {
      formData.append("images", file);  // Note: field name must be "images" to match backend
    });

    // Debug: Log FormData contents
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/add-product`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        // Don't set Content-Type header - let browser set it with boundary
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || "Failed to add product");
    }

    const data = await response.json();
    
    toast({
      title: "Success",
      description: "Product created successfully!",
    });
    
    router.push("/admin/products");
  } catch (err: any) {
    console.error("Submission error:", err);
    toast({
      title: "Error",
      description: err.message || "An unexpected error occurred",
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};

// Separate function to handle image uploads
const uploadImages = async (images: File[], token: string): Promise<string[]> => {
  const formData = new FormData();
  images.forEach(file => formData.append("files", file));

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to upload images");
  }

  return await response.json();
};
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
            <p className="text-muted-foreground">Create a new product listing for your store.</p>
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
            disabled={isSubmitting}
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
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select
  value={productData.category}
  onValueChange={(value) => handleSelectChange("category", value)}
  required
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
                    disabled={isGenerating || !productData.name}
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
                      />
                      <Button 
                        variant="outline" 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
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