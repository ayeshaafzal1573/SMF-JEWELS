"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Save, X, Upload, Sparkles, ArrowLeft, ImagePlus, Check } from "lucide-react"

export default function NewProductPage() {
  const [activeTab, setActiveTab] = useState("general")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedDescription, setGeneratedDescription] = useState("")
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    shortDescription: "",
    sku: "",
    stock: "",
    weight: "",
    dimensions: "",
    material: "",
    featured: false,
    published: true,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProductData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setProductData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setProductData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenerateDescription = () => {
    if (!productData.name) {
      alert("Please enter a product name first")
      return
    }

    setIsGenerating(true)

    // Simulate AI generation
    setTimeout(() => {
      const luxuryDescriptions = [
        `Introducing the exquisite ${productData.name}, a testament to unparalleled craftsmanship and timeless elegance. Each piece is meticulously handcrafted by our master artisans, combining traditional techniques with contemporary design sensibilities. The result is a stunning jewelry piece that captures light from every angle, creating a mesmerizing display of brilliance that complements any occasion.`,
        `The magnificent ${productData.name} represents the pinnacle of luxury jewelry design. Created with exceptional attention to detail, this piece features the finest materials sourced from around the world. Its sophisticated silhouette and perfect proportions make it a versatile addition to any collection, effortlessly transitioning from day to evening wear while maintaining its distinctive allure.`,
        `Discover the allure of the ${productData.name}, where artistry meets innovation. This extraordinary piece embodies SMF Jewels' commitment to excellence, featuring rare gemstones set in precious metal with precision and care. The result is not merely an accessory, but a future heirloom that tells a story of elegance and refinement, designed to be treasured for generations to come.`,
      ]

      const randomDescription = luxuryDescriptions[Math.floor(Math.random() * luxuryDescriptions.length)]
      setGeneratedDescription(randomDescription)
      setProductData((prev) => ({ ...prev, description: randomDescription }))
      setIsGenerating(false)
    }, 2000)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    alert("Product saved successfully!")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" asChild>
            <a href="/admin/products">
              <ArrowLeft className="h-4 w-4" />
            </a>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
            <p className="text-muted-foreground">Create a new product listing for your store.</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button type="submit" form="product-form" className="bg-gold hover:bg-gold/90 text-black">
            <Save className="mr-2 h-4 w-4" />
            Save Product
          </Button>
        </div>
      </div>

      <form id="product-form" onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
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
                    <Label htmlFor="name">Product Name</Label>
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
                      <Label htmlFor="price">Price ($)</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        placeholder="2999"
                        value={productData.price}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={productData.category}
                        onValueChange={(value) => handleSelectChange("category", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rings">Rings</SelectItem>
                          <SelectItem value="necklaces">Necklaces</SelectItem>
                          <SelectItem value="earrings">Earrings</SelectItem>
                          <SelectItem value="bracelets">Bracelets</SelectItem>
                          <SelectItem value="watches">Watches</SelectItem>
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
                <CardContent className="space-y-4">
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
                    <div className="space-y-2">
                      <Label htmlFor="material">Material</Label>
                      <Select
                        value={productData.material}
                        onValueChange={(value) => handleSelectChange("material", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select material" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gold">Gold</SelectItem>
                          <SelectItem value="silver">Silver</SelectItem>
                          <SelectItem value="platinum">Platinum</SelectItem>
                          <SelectItem value="diamond">Diamond</SelectItem>
                          <SelectItem value="pearl">Pearl</SelectItem>
                        </SelectContent>
                      </Select>
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

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Published</Label>
                      <p className="text-sm text-muted-foreground">Make visible to customers</p>
                    </div>
                    <Switch
                      checked={productData.published}
                      onCheckedChange={(checked) => handleSwitchChange("published", checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Description Generator */}
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
                        <div className="h-4 w-4 border-2 border-gold border-t-transparent rounded-full animate-spin mr-2" />
                        Generating...
                      </div>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate with AI
                      </>
                    )}
                  </Button>
                  {generatedDescription && (
                    <div className="flex items-center text-sm text-green-600">
                      <Check className="mr-1 h-4 w-4" />
                      Description generated
                    </div>
                  )}
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
                <CardDescription>Upload high-quality images of your product</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <ImagePlus className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div className="mt-4">
                      <Button variant="outline">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Images
                      </Button>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">Drag and drop images here, or click to browse</p>
                  </div>
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
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      placeholder="100"
                      value={productData.stock}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Stock Status</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="In Stock" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="in-stock">In Stock</SelectItem>
                        <SelectItem value="low-stock">Low Stock</SelectItem>
                        <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>Optimize for search engines</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input id="metaTitle" placeholder="SEO-friendly title" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea id="metaDescription" placeholder="Brief description for search results" rows={3} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  )
}
