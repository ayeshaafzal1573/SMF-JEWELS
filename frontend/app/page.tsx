"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Star, Crown, Gem, Shield, Truck } from "lucide-react"

export default function HomePage() {
  const featuredProducts = [
    {
      id: 1,
      name: "Diamond Eternity Ring",
      price: 2999,
      originalPrice: 3499,
      image: "/placeholder.svg?height=400&width=400",
      badge: "Bestseller",
      rating: 5,
      reviews: 234,
    },
    {
      id: 2,
      name: "Pearl Drop Earrings",
      price: 899,
      image: "/placeholder.svg?height=400&width=400",
      badge: "New",
      rating: 4.9,
      reviews: 156,
    },
    {
      id: 3,
      name: "Gold Tennis Bracelet",
      price: 1799,
      image: "/placeholder.svg?height=400&width=400",
      badge: "Limited",
      rating: 4.8,
      reviews: 89,
    },
  ]

  const collections = [
    {
      name: "Engagement Rings",
      description: "Timeless symbols of eternal love",
      image: "/placeholder.svg?height=300&width=400",
      count: 45,
    },
    {
      name: "Wedding Bands",
      description: "Perfect pairs for your special day",
      image: "/placeholder.svg?height=300&width=400",
      count: 32,
    },
    {
      name: "Luxury Necklaces",
      description: "Statement pieces for every occasion",
      image: "/placeholder.svg?height=300&width=400",
      count: 28,
    },
  ]

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-20" />

        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-gold rounded-full animate-float opacity-60" />
        <div className="absolute top-40 right-32 w-6 h-6 bg-gold rounded-full animate-float-delayed opacity-40" />
        <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-gold rounded-full animate-float-delayed-2 opacity-50" />

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <div className="mb-6">
            <Crown className="h-16 w-16 text-gold mx-auto mb-4 animate-float" />
          </div>

          <h1 className="font-playfair text-6xl md:text-8xl font-bold mb-6 text-gradient-gold">SMF Jewels</h1>

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
      <section className="py-20 bg-muted/30">
        <div className="container">
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

      {/* Featured Products */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4">Featured Collection</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our most coveted pieces, each one a masterpiece of design and craftsmanship
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-gold/20"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  <div className="absolute top-4 left-4">
                    <Badge
                      className={`${
                        product.badge === "Bestseller"
                          ? "bg-red-500"
                          : product.badge === "New"
                            ? "bg-green-500"
                            : "bg-purple-500"
                      }`}
                    >
                      {product.badge}
                    </Badge>
                  </div>

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
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating) ? "fill-gold text-gold" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground ml-2">({product.reviews})</span>
                  </div>

                  <h3 className="font-semibold text-lg mb-3">{product.name}</h3>

                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gold">${product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                      <span className="text-lg text-muted-foreground line-through">
                        ${product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
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

      {/* Collections Showcase */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4">Our Collections</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore our curated collections, each designed for life's most precious moments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {collections.map((collection, index) => (
              <Card key={index} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="relative">
                  <Image
                    src={collection.image || "/placeholder.svg"}
                    alt={collection.name}
                    width={400}
                    height={300}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-playfair text-2xl font-bold mb-1">{collection.name}</h3>
                    <p className="text-sm opacity-90">{collection.description}</p>
                    <p className="text-xs mt-2 text-gold">{collection.count} pieces</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gold to-yellow-500">
        <div className="container text-center">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-4 text-black">Experience Luxury</h2>
          <p className="text-xl mb-8 text-black/80 max-w-2xl mx-auto">
            Visit our showroom or schedule a private consultation to discover the perfect piece for your collection
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="outline"
              className="border-black text-black hover:bg-black hover:text-white bg-transparent"
              asChild
            >
              <Link href="/contact">Book Consultation</Link>
            </Button>
            <Button size="lg" className="bg-black hover:bg-black/90 text-white" asChild>
              <Link href="/about">Our Story</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
              <h3 className="font-semibold mb-4">Customer Care</h3>
              <div className="space-y-2">
                <Link href="/care" className="block text-gray-400 hover:text-gold transition-colors">
                  Jewelry Care
                </Link>
                <Link href="/sizing" className="block text-gray-400 hover:text-gold transition-colors">
                  Size Guide
                </Link>
                <Link href="/warranty" className="block text-gray-400 hover:text-gold transition-colors">
                  Warranty
                </Link>
                <Link href="/returns" className="block text-gray-400 hover:text-gold transition-colors">
                  Returns
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <div className="space-y-2">
                <p className="text-gray-400">+1 (555) 123-4567</p>
                <p className="text-gray-400">info@smfjewels.com</p>
                <p className="text-gray-400">123 Luxury Ave, NYC</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SMF Jewels. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
