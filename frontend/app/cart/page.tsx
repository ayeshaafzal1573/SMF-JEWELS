"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Trash2,
  Plus,
  Minus,
  Heart,
  ShoppingBag,
  Truck,
  Shield,
  ArrowRight,
  Gift,
  Percent,
  CreditCard,
  Lock,
} from "lucide-react"
import Link from "next/link"
import { Header } from "../../components/header"

export default function CartPage() {
  const [cartCount, setCartCount] = useState(2)
  const [wishlistCount, setWishlistCount] = useState(5)
  const [promoCode, setPromoCode] = useState("")
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Eternal Diamond Solitaire Ring",
      price: 4999,
      originalPrice: 5999,
      image: "/placeholder.svg?height=200&width=200",
      quantity: 1,
      size: "7",
      inStock: true,
    },
    {
      id: 2,
      name: "Royal Pearl Collection Necklace",
      price: 2499,
      image: "/placeholder.svg?height=200&width=200",
      quantity: 1,
      size: "18 inches",
      inStock: true,
    },
  ])

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id)
      return
    }
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
    setCartCount(cartCount - 1)
  }

  const moveToWishlist = (id: number) => {
    removeItem(id)
    setWishlistCount(wishlistCount + 1)
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const savings = cartItems.reduce(
    (sum, item) => sum + ((item.originalPrice || item.price) - item.price) * item.quantity,
    0,
  )
  const shipping = subtotal > 1000 ? 0 : 50
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const EmptyCart = () => (
    <motion.div
      className="text-center py-20"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="w-32 h-32 mx-auto mb-8 bg-[#D4AF37]/10 rounded-full flex items-center justify-center"
        animate={{
          rotate: [0, 10, -10, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <ShoppingBag className="h-16 w-16 text-[#D4AF37]" />
      </motion.div>
      <h2 className="text-4xl font-bold text-[#111111] mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
        Your Cart is Empty
      </h2>
      <p className="text-xl text-gray-600 mb-8">Discover our exquisite collection of luxury jewelry</p>
      <Link href="/collections">
        <Button className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 hover:from-yellow-500 hover:to-[#D4AF37] text-[#111111] px-8 py-3 text-lg font-bold rounded-full">
          Start Shopping
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </Link>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Inter, sans-serif" }}>
      <Header cartCount={cartCount} wishlistCount={wishlistCount} />

      <div className="pt-24">
        {/* Header */}
        <section className="py-12 bg-[#F5F5F5]">
          <div className="container mx-auto px-4">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl font-bold text-[#111111] mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
                Shopping Cart
              </h1>
              <p className="text-xl text-gray-600">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
              </p>
            </motion.div>
          </div>
        </section>

        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-6">
                  <AnimatePresence>
                    {cartItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{
                          opacity: 0,
                          x: -300,
                          transition: { duration: 0.3 },
                        }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                      >
                        <Card className="p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-0">
                          <div className="flex gap-6">
                            {/* Product Image */}
                            <div className="relative">
                              <motion.img
                                src={item.image}
                                alt={item.name}
                                className="w-32 h-32 object-cover rounded-lg"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                              />
                              {item.originalPrice && (
                                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">SALE</Badge>
                              )}
                            </div>

                            {/* Product Details */}
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h3
                                    className="text-xl font-bold text-[#111111] mb-2"
                                    style={{ fontFamily: "Playfair Display, serif" }}
                                  >
                                    {item.name}
                                  </h3>
                                  <p className="text-gray-600">Size: {item.size}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className="text-2xl font-bold text-[#D4AF37]">
                                      ${item.price.toLocaleString()}
                                    </span>
                                    {item.originalPrice && (
                                      <span className="text-lg text-gray-400 line-through">
                                        ${item.originalPrice.toLocaleString()}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                  <motion.button
                                    className="p-2 text-gray-400 hover:text-[#D4AF37] transition-colors"
                                    onClick={() => moveToWishlist(item.id)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <Heart className="h-5 w-5" />
                                  </motion.button>
                                  <motion.button
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    onClick={() => removeItem(item.id)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <Trash2 className="h-5 w-5" />
                                  </motion.button>
                                </div>
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center border border-gray-200 rounded-lg">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="h-10 w-10"
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="h-10 w-10"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>

                                <div className="text-right">
                                  <p className="text-sm text-gray-600">Subtotal</p>
                                  <p className="text-xl font-bold text-[#111111]">
                                    ${(item.price * item.quantity).toLocaleString()}
                                  </p>
                                </div>
                              </div>

                              {/* Stock Status */}
                              <div className="mt-4">
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-2 h-2 rounded-full ${item.inStock ? "bg-green-500" : "bg-red-500"}`}
                                  ></div>
                                  <span className={`text-sm ${item.inStock ? "text-green-600" : "text-red-600"}`}>
                                    {item.inStock ? "In Stock" : "Out of Stock"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Promo Code */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    <Card className="p-6 border-0 shadow-lg">
                      <h3 className="text-lg font-semibold text-[#111111] mb-4">Promo Code</h3>
                      <div className="flex gap-4">
                        <Input
                          placeholder="Enter promo code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="flex-1 border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                        />
                        <Button
                          variant="outline"
                          className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white bg-transparent"
                        >
                          <Percent className="mr-2 h-4 w-4" />
                          Apply
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                </div>

                {/* Order Summary */}
                <motion.div
                  className="lg:col-span-1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <div className="sticky top-8 space-y-6">
                    <Card className="p-8 border-0 shadow-xl">
                      <h2
                        className="text-2xl font-bold text-[#111111] mb-6"
                        style={{ fontFamily: "Playfair Display, serif" }}
                      >
                        Order Summary
                      </h2>

                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-semibold">${subtotal.toLocaleString()}</span>
                        </div>

                        {savings > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Savings</span>
                            <span className="font-semibold">-${savings.toLocaleString()}</span>
                          </div>
                        )}

                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping</span>
                          <span className="font-semibold">{shipping === 0 ? "FREE" : `$${shipping}`}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax</span>
                          <span className="font-semibold">${tax.toFixed(2)}</span>
                        </div>

                        <div className="border-t pt-4">
                          <div className="flex justify-between text-xl font-bold">
                            <span className="text-[#111111]">Total</span>
                            <span className="text-[#D4AF37]">${total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {shipping > 0 && (
                        <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg p-4 mb-6">
                          <div className="flex items-center gap-2 text-[#D4AF37]">
                            <Truck className="h-4 w-4" />
                            <span className="text-sm font-semibold">
                              Add ${(1000 - subtotal).toFixed(2)} more for FREE shipping
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="space-y-4">
                        <Link href="/checkout">
                          <motion.button
                            className="w-full bg-gradient-to-r from-[#D4AF37] to-yellow-500 hover:from-yellow-500 hover:to-[#D4AF37] text-[#111111] py-4 text-lg font-bold rounded-full transition-all duration-500 shadow-xl hover:shadow-2xl flex items-center justify-center"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Lock className="mr-3 h-5 w-5" />
                            Secure Checkout
                          </motion.button>
                        </Link>

                        <Button
                          variant="outline"
                          className="w-full border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white py-4 text-lg font-bold rounded-full bg-transparent"
                        >
                          <CreditCard className="mr-3 h-5 w-5" />
                          Express Pay
                        </Button>
                      </div>

                      <div className="mt-6 pt-6 border-t">
                        <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-[#D4AF37]" />
                            <span>Secure Payment</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-[#D4AF37]" />
                            <span>Free Returns</span>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Gift Options */}
                    <Card className="p-6 border-0 shadow-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <Gift className="h-6 w-6 text-[#D4AF37]" />
                        <h3 className="text-lg font-semibold text-[#111111]">Gift Options</h3>
                      </div>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
                          />
                          <span className="text-gray-700">Gift wrapping (+$25)</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-[#D4AF37] focus:ring-[#D4AF37]"
                          />
                          <span className="text-gray-700">Include gift message</span>
                        </label>
                      </div>
                    </Card>

                    {/* Security Features */}
                    <Card className="p-6 border-0 shadow-lg bg-[#F5F5F5]">
                      <h3 className="text-lg font-semibold text-[#111111] mb-4">Why Shop With Us</h3>
                      <div className="space-y-3">
                        {[
                          { icon: Shield, text: "Lifetime Warranty" },
                          { icon: Truck, text: "Free Insured Shipping" },
                          { icon: Heart, text: "30-Day Returns" },
                        ].map((feature, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <feature.icon className="h-5 w-5 text-[#D4AF37]" />
                            <span className="text-gray-700">{feature.text}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        )}

        {/* Recommended Products */}
        {cartItems.length > 0 && (
          <section className="py-16 bg-[#F5F5F5]">
            <div className="container mx-auto px-4">
              <motion.div
                className="text-center mb-12"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2
                  className="text-4xl font-bold text-[#111111] mb-4"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Complete Your Look
                </h2>
                <p className="text-xl text-gray-600">Perfectly paired pieces to complement your selection</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    id: 3,
                    name: "Diamond Tennis Bracelet",
                    price: 1899,
                    image: "/placeholder.svg?height=300&width=300",
                    rating: 5,
                  },
                  {
                    id: 4,
                    name: "Pearl Drop Earrings",
                    price: 899,
                    image: "/placeholder.svg?height=300&width=300",
                    rating: 5,
                  },
                  {
                    id: 5,
                    name: "Gold Chain Necklace",
                    price: 1299,
                    image: "/placeholder.svg?height=300&width=300",
                    rating: 5,
                  },
                ].map((product, index) => (
                  <motion.div
                    key={product.id}
                    className="group cursor-pointer"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -10 }}
                  >
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-white">
                      <div className="relative overflow-hidden">
                        <motion.img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-64 object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <Heart className="h-5 w-5" />
                        </Button>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="font-bold text-lg text-[#111111] mb-2">{product.name}</h3>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-2xl font-bold text-[#D4AF37]">${product.price.toLocaleString()}</span>
                          <div className="flex">
                            {[...Array(product.rating)].map((_, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: i * 0.1 }}
                              >
                                <div className="h-4 w-4 bg-[#D4AF37] rounded-full mr-1"></div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                        <Button
                          className="w-full bg-[#111111] hover:bg-[#D4AF37] text-white hover:text-[#111111] py-3 rounded-full font-bold transition-all duration-300"
                          onClick={() => setCartCount(cartCount + 1)}
                        >
                          Add to Cart
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
