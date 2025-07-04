"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  ShoppingBag,
  User,
  Heart,
  Star,
  ArrowRight,
  Instagram,
  Facebook,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Component() {
  const featuredProducts = [
    {
      id: 1,
      name: "Diamond Eternity Ring",
      price: 2499,
      originalPrice: 2999,
      image: "/placeholder.svg?height=400&width=400",
      badge: "Bestseller",
    },
    {
      id: 2,
      name: "Pearl Drop Earrings",
      price: 899,
      image: "/placeholder.svg?height=400&width=400",
      badge: "New",
    },
    {
      id: 3,
      name: "Gold Tennis Bracelet",
      price: 1799,
      image: "/placeholder.svg?height=400&width=400",
      badge: "Limited",
    },
    {
      id: 4,
      name: "Sapphire Pendant Necklace",
      price: 1299,
      image: "/placeholder.svg?height=400&width=400",
      badge: "Exclusive",
    },
  ]

  const collections = [
    {
      name: "Bridal Collection",
      description: "Timeless pieces for your special day",
      image: "/placeholder.svg?height=500&width=600",
      itemCount: "120+ pieces",
    },
    {
      name: "Diamond Classics",
      description: "Brilliant diamonds in classic settings",
      image: "/placeholder.svg?height=500&width=600",
      itemCount: "85+ pieces",
    },
    {
      name: "Modern Minimalist",
      description: "Clean lines and contemporary elegance",
      image: "/placeholder.svg?height=500&width=600",
      itemCount: "65+ pieces",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="container mx-auto px-4">
          {/* Top Bar */}
          <div className="flex items-center justify-between py-2 text-sm text-gray-600 border-b border-gray-50">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <Phone className="h-3 w-3 mr-1" />
                +1 (555) 123-4567
              </span>
              <span className="flex items-center">
                <Mail className="h-3 w-3 mr-1" />
                hello@smfjewels.com
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="#" className="hover:text-amber-600 transition-colors">
                Track Order
              </Link>
              <Link href="#" className="hover:text-amber-600 transition-colors">
                Size Guide
              </Link>
              <Link href="#" className="hover:text-amber-600 transition-colors">
                Care Instructions
              </Link>
            </div>
          </div>

          {/* Main Header */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                <span className="text-amber-600">SMF</span> Jewels
              </Link>
              <nav className="hidden md:flex items-center space-x-8">
                <Link href="#" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">
                  Collections
                </Link>
                <Link href="#" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">
                  Rings
                </Link>
                <Link href="#" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">
                  Necklaces
                </Link>
                <Link href="#" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">
                  Earrings
                </Link>
                <Link href="#" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">
                  Bracelets
                </Link>
                <Link href="#" className="text-gray-700 hover:text-amber-600 transition-colors font-medium">
                  Custom
                </Link>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="Search jewelry..." className="pl-10 w-64 border-gray-200 focus:border-amber-600" />
              </div>
              <Button variant="ghost" size="icon" className="hover:bg-amber-50">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-amber-50">
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-amber-50 relative">
                <ShoppingBag className="h-5 w-5" />
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-amber-600 text-white text-xs">
                  2
                </Badge>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[80vh] bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/placeholder.svg?height=800&width=1600"
            alt="Luxury jewelry collection"
            fill
            className="object-cover opacity-40"
          />
        </div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Timeless
              <span className="block text-amber-400">Elegance</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">
              Discover our exquisite collection of handcrafted jewelry, where every piece tells a story of luxury and
              sophistication.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-lg">
                Shop Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg bg-transparent"
              >
                Book Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Pieces</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Handpicked selections from our master craftsmen, each piece representing the pinnacle of jewelry artistry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <Card
                key={product.id}
                className="group cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4 bg-amber-600 text-white">{product.badge}</Badge>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 hover:bg-white"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-amber-600">${product.price.toLocaleString()}</span>
                      {product.originalPrice && (
                        <span className="text-lg text-gray-400 line-through">
                          ${product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Collections</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our carefully curated collections, each designed to capture different moments and moods in life.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {collections.map((collection, index) => (
              <Card
                key={index}
                className="group cursor-pointer border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={collection.image || "/placeholder.svg"}
                    alt={collection.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{collection.name}</h3>
                    <p className="text-gray-200 mb-2">{collection.description}</p>
                    <span className="text-amber-400 font-semibold">{collection.itemCount}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Our Legacy</h2>
              <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                For over three decades, SMF Jewels has been synonymous with exceptional craftsmanship and timeless
                design. Our master artisans combine traditional techniques with contemporary innovation to create pieces
                that transcend trends.
              </p>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                Every piece in our collection is meticulously crafted using only the finest materials - from ethically
                sourced diamonds to precious metals that meet the highest standards of purity and quality.
              </p>
              <Button
                size="lg"
                variant="outline"
                className="border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white bg-transparent"
              >
                Learn Our Story
              </Button>
            </div>
            <div className="relative">
              <Image
                src="/placeholder.svg?height=600&width=500"
                alt="Jewelry craftsman at work"
                width={500}
                height={600}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
            <p className="text-xl text-gray-600">Trusted by thousands of satisfied customers worldwide</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                location: "New York, NY",
                text: "The engagement ring I purchased exceeded all expectations. The craftsmanship is absolutely stunning, and the customer service was exceptional throughout the entire process.",
                rating: 5,
              },
              {
                name: "Michael Chen",
                location: "Los Angeles, CA",
                text: "I've been a customer for over 10 years, and SMF Jewels never disappoints. The quality is consistently outstanding, and their designs are truly unique.",
                rating: 5,
              },
              {
                name: "Emma Rodriguez",
                location: "Miami, FL",
                text: "The custom necklace they created for my anniversary was perfect. The attention to detail and personal service made the experience unforgettable.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index} className="p-8 border-0 shadow-lg bg-white">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-500 text-sm">{testimonial.location}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Stay Connected</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Be the first to know about new collections, exclusive offers, and jewelry care tips.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <Input placeholder="Enter your email address" className="flex-1 bg-white text-gray-900 border-0" />
            <Button className="bg-amber-600 hover:bg-amber-700 px-8">Subscribe</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                <span className="text-amber-600">SMF</span> Jewels
              </h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Crafting timeless elegance since 1990. Your trusted partner for life's most precious moments.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="hover:bg-amber-600">
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-amber-600">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-amber-600">
                  <Twitter className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg">Collections</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-amber-600 transition-colors">
                    Engagement Rings
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-amber-600 transition-colors">
                    Wedding Bands
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-amber-600 transition-colors">
                    Necklaces
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-amber-600 transition-colors">
                    Earrings
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-amber-600 transition-colors">
                    Bracelets
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg">Customer Care</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-amber-600 transition-colors">
                    Size Guide
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-amber-600 transition-colors">
                    Care Instructions
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-amber-600 transition-colors">
                    Warranty
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-amber-600 transition-colors">
                    Returns
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-amber-600 transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg">Visit Our Showroom</h4>
              <div className="text-gray-400 space-y-3">
                <p className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  123 Luxury Lane
                  <br />
                  Beverly Hills, CA 90210
                </p>
                <p className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  +1 (555) 123-4567
                </p>
                <p className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  hello@smfjewels.com
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} SMF Jewels. All rights reserved. | Privacy Policy | Terms of Service
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
