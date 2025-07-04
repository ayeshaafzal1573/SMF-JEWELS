"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { Float, Sparkles } from "@react-three/drei"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle,
  Download,
  Share2,
  Star,
  Truck,
  Calendar,
  MapPin,
  Phone,
  Instagram,
  Facebook,
  Twitter,
  Heart,
  Sparkle,
  Package,
  Award,
  Clock,
} from "lucide-react"
import { Header } from "../../components/header"

// 3D Gift Box Component
function GiftBox3D({ isOpen }: { isOpen: boolean }) {
  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
      <group>
        {/* Box Base */}
        <mesh position={[0, -0.5, 0]} scale={[2, 1, 2]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshPhysicalMaterial color="#D4AF37" metalness={0.8} roughness={0.2} clearcoat={1} clearcoatRoughness={0} />
        </mesh>

        {/* Box Lid */}
        <motion.mesh
          position={[0, isOpen ? 1 : 0, 0]}
          rotation={isOpen ? [0, 0, 0.2] : [0, 0, 0]}
          scale={[2.1, 0.2, 2.1]}
          animate={{
            y: isOpen ? 1 : 0,
            rotateZ: isOpen ? 0.2 : 0,
          }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshPhysicalMaterial color="#D4AF37" metalness={0.8} roughness={0.2} clearcoat={1} clearcoatRoughness={0} />
        </motion.mesh>

        {/* Ribbon */}
        <mesh position={[0, 0, 0]} scale={[2.2, 1.2, 0.1]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#8B0000" />
        </mesh>
        <mesh position={[0, 0, 0]} scale={[0.1, 1.2, 2.2]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#8B0000" />
        </mesh>

        {/* Sparkles */}
        {isOpen && <Sparkles count={50} scale={[4, 4, 4]} size={3} speed={0.5} color="#D4AF37" />}
      </group>
    </Float>
  )
}

// Floating Particles Component
function FloatingParticles() {
  return (
    <>
      {[...Array(20)].map((_, i) => (
        <Float
          key={i}
          speed={Math.random() * 2 + 1}
          rotationIntensity={Math.random()}
          floatIntensity={Math.random() * 2}
        >
          <mesh
            position={[(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10]}
            scale={Math.random() * 0.1 + 0.05}
          >
            <sphereGeometry args={[1, 8, 8]} />
            <meshPhysicalMaterial color="#D4AF37" metalness={0.8} roughness={0.2} transparent opacity={0.7} />
          </mesh>
        </Float>
      ))}
    </>
  )
}

export default function OrderConfirmedPage() {
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(5)
  const [showUnboxing, setShowUnboxing] = useState(false)
  const [showSocialShare, setShowSocialShare] = useState(false)
  const [aiMessage, setAiMessage] = useState("")

  // Mock order data
  const orderData = {
    orderNumber: "SMF-2024-001",
    orderDate: "January 15, 2024",
    estimatedDelivery: "January 22, 2024",
    total: 7197,
    items: [
      {
        id: 1,
        name: "Eternal Diamond Solitaire Ring",
        price: 4999,
        quantity: 1,
        image: "/placeholder.svg?height=100&width=100",
        category: "Diamond Rings",
      },
      {
        id: 2,
        name: "Classic Pearl Necklace",
        price: 1299,
        quantity: 1,
        image: "/placeholder.svg?height=100&width=100",
        category: "Necklaces",
      },
      {
        id: 3,
        name: "Gold Diamond Earrings",
        price: 899,
        quantity: 1,
        image: "/placeholder.svg?height=100&width=100",
        category: "Earrings",
      },
    ],
    shippingAddress: {
      name: "Sarah Johnson",
      address: "123 Luxury Lane",
      city: "Beverly Hills",
      state: "CA",
      zipCode: "90210",
      phone: "+1 (555) 123-4567",
    },
  }

  // AI-generated personalized message
  useEffect(() => {
    const generateAIMessage = () => {
      const messages = [
        `Dear ${orderData.shippingAddress.name}, your exquisite diamond solitaire ring represents eternal love and commitment. To maintain its brilliance, clean gently with warm soapy water and store in a soft cloth pouch. The timeless elegance of your pearl necklace requires special care - avoid contact with perfumes and cosmetics, and wipe gently with a damp cloth after each wear.`,
        `Congratulations on your stunning jewelry selection! Your diamond pieces are certified conflict-free and ethically sourced. For optimal care, we recommend professional cleaning every 6 months and storing each piece separately to prevent scratching. Your investment in luxury jewelry reflects impeccable taste and will be treasured for generations.`,
        `Thank you for choosing SMF Jewels for your special occasion. Your curated collection showcases exceptional craftsmanship and timeless design. Each piece comes with our lifetime warranty and complimentary annual maintenance. We're honored to be part of your jewelry journey and look forward to serving you again.`,
      ]
      setAiMessage(messages[Math.floor(Math.random() * messages.length)])
    }

    generateAIMessage()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowUnboxing(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleSocialShare = (platform: string) => {
    const shareText = `Just ordered beautiful jewelry from SMF Jewels! ✨ #SMFJewels #LuxuryJewelry`
    const shareUrl = window.location.origin

    switch (platform) {
      case "instagram":
        // Instagram doesn't support direct URL sharing, so we'll copy to clipboard
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
        alert("Share text copied to clipboard! Paste it in your Instagram story.")
        break
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
        )
        break
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
        )
        break
    }
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Inter, sans-serif" }}>
      <Header cartCount={cartCount} wishlistCount={wishlistCount} />

      <div className="pt-24">
        {/* Hero Section with 3D Animation */}
        <section className="py-16 bg-gradient-to-br from-[#F5F5F5] to-[#E5E5E5] overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* 3D Gift Box Animation */}
              <motion.div
                className="h-96 relative"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
              >
                <Canvas camera={{ position: [0, 0, 8] }}>
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} intensity={1} />
                  <pointLight position={[-10, -10, -10]} intensity={0.5} />
                  <GiftBox3D isOpen={showUnboxing} />
                  <FloatingParticles />
                </Canvas>

                {/* Celebration Overlay */}
                <AnimatePresence>
                  {showUnboxing && (
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {[...Array(15)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-[#D4AF37] rounded-full"
                          initial={{
                            x: "50%",
                            y: "50%",
                            scale: 0,
                          }}
                          animate={{
                            x: `${Math.random() * 100}%`,
                            y: `${Math.random() * 100}%`,
                            scale: [0, 1, 0],
                          }}
                          transition={{
                            duration: 2,
                            delay: i * 0.1,
                            ease: "easeOut",
                          }}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Success Message */}
              <motion.div
                className="text-center lg:text-left"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <motion.div
                  className="flex items-center justify-center lg:justify-start gap-4 mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.5, type: "spring", stiffness: 200 }}
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-green-500" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-[#111111]" style={{ fontFamily: "Playfair Display, serif" }}>
                      Order Confirmed!
                    </h1>
                    <p className="text-xl text-gray-600">Thank you for your purchase</p>
                  </div>
                </motion.div>

                <motion.div
                  className="space-y-4 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <div className="flex items-center justify-center lg:justify-start gap-3">
                    <Package className="h-5 w-5 text-[#D4AF37]" />
                    <span className="text-lg">Order #{orderData.orderNumber}</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start gap-3">
                    <Calendar className="h-5 w-5 text-[#D4AF37]" />
                    <span className="text-lg">Estimated delivery: {orderData.estimatedDelivery}</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start gap-3">
                    <Award className="h-5 w-5 text-[#D4AF37]" />
                    <span className="text-lg">Total: ${orderData.total.toLocaleString()}</span>
                  </div>
                </motion.div>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                >
                  <Button
                    onClick={() => setShowSocialShare(true)}
                    className="bg-[#D4AF37] hover:bg-yellow-600 text-[#111111] font-bold px-8 py-3 rounded-full"
                  >
                    <Share2 className="mr-2 h-5 w-5" />
                    Share Your Joy
                  </Button>
                  <Button
                    variant="outline"
                    className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white px-8 py-3 rounded-full bg-transparent"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download Receipt
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Order Details */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Order Summary */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Card className="shadow-xl border-0 mb-8">
                    <CardHeader>
                      <CardTitle
                        className="text-3xl font-bold text-[#111111]"
                        style={{ fontFamily: "Playfair Display, serif" }}
                      >
                        Your Order
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {orderData.items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          className="flex items-center gap-6 p-4 bg-[#F5F5F5] rounded-lg"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-[#111111]">{item.name}</h3>
                            <p className="text-gray-600">Category: {item.category}</p>
                            <p className="text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-2xl font-bold text-[#D4AF37]">${item.price.toLocaleString()}</div>
                        </motion.div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* AI-Generated Care Instructions */}
                  <Card className="shadow-xl border-0 bg-gradient-to-br from-[#D4AF37]/10 to-[#D4AF37]/5">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-[#111111] flex items-center gap-3">
                        <Sparkle className="h-6 w-6 text-[#D4AF37]" />
                        AI-Personalized Care Guide
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <motion.p
                        className="text-gray-700 leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1 }}
                      >
                        {aiMessage}
                      </motion.p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Shipping & Next Steps */}
              <div className="space-y-8">
                {/* Shipping Information */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <Card className="shadow-xl border-0">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-[#111111]">Shipping Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-[#D4AF37] mt-1" />
                        <div>
                          <p className="font-semibold text-[#111111]">{orderData.shippingAddress.name}</p>
                          <p className="text-gray-600">{orderData.shippingAddress.address}</p>
                          <p className="text-gray-600">
                            {orderData.shippingAddress.city}, {orderData.shippingAddress.state}{" "}
                            {orderData.shippingAddress.zipCode}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-[#D4AF37]" />
                        <span className="text-gray-600">{orderData.shippingAddress.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Truck className="h-5 w-5 text-[#D4AF37]" />
                        <span className="text-gray-600">Express Delivery</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-[#D4AF37]" />
                        <span className="text-gray-600">2-3 Business Days</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* What's Next */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <Card className="shadow-xl border-0">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-[#111111]">What's Next?</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
                          <span className="text-gray-700">Order confirmation email sent</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
                          <span className="text-gray-700">Jewelry being carefully prepared</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          <span className="text-gray-500">Shipping notification</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                          <span className="text-gray-500">Delivery to your door</span>
                        </div>
                      </div>

                      <Separator className="my-4" />

                      <Button className="w-full bg-[#D4AF37] hover:bg-yellow-600 text-[#111111] font-bold">
                        <Package className="mr-2 h-4 w-4" />
                        Track Your Order
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Continue Shopping */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <Card className="shadow-xl border-0">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-[#111111]">Continue Your Journey</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white bg-transparent"
                        onClick={() => (window.location.href = "/collections")}
                      >
                        <Heart className="mr-2 h-4 w-4" />
                        Explore More Collections
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white bg-transparent"
                        onClick={() => (window.location.href = "/account")}
                      >
                        <Star className="mr-2 h-4 w-4" />
                        View Your Account
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Share Modal */}
        <AnimatePresence>
          {showSocialShare && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSocialShare(false)}
            >
              <motion.div
                className="bg-white rounded-2xl p-8 max-w-md w-full"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3
                  className="text-2xl font-bold text-[#111111] mb-6 text-center"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Share Your Joy
                </h3>

                <div className="space-y-4">
                  <Button
                    onClick={() => handleSocialShare("instagram")}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 rounded-full"
                  >
                    <Instagram className="mr-3 h-5 w-5" />
                    Share on Instagram
                  </Button>

                  <Button
                    onClick={() => handleSocialShare("facebook")}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-full"
                  >
                    <Facebook className="mr-3 h-5 w-5" />
                    Share on Facebook
                  </Button>

                  <Button
                    onClick={() => handleSocialShare("twitter")}
                    className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 rounded-full"
                  >
                    <Twitter className="mr-3 h-5 w-5" />
                    Share on Twitter
                  </Button>
                </div>

                <Button
                  variant="outline"
                  onClick={() => setShowSocialShare(false)}
                  className="w-full mt-6 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white"
                >
                  Close
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
