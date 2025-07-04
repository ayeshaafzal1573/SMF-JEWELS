"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { Float, Text3D, Center } from "@react-three/drei"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  CreditCard,
  Fingerprint,
  Smartphone,
  Shield,
  Lock,
  Check,
  ChevronRight,
  ChevronLeft,
  Truck,
  Gift,
  Star,
} from "lucide-react"
import { Header } from "../../components/header"

// 3D Credit Card Component
function CreditCard3D({ cardNumber, cardName, expiryDate }: any) {
  return (
    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
      <mesh scale={[3, 1.8, 0.1]} position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshPhysicalMaterial color="#D4AF37" metalness={0.8} roughness={0.2} clearcoat={1} clearcoatRoughness={0} />
      </mesh>
      <Center position={[0, 0.2, 0.1]}>
        <Text3D font="/fonts/Geist_Bold.json" size={0.1} height={0.02}>
          {cardNumber || "•••• •••• •••• ••••"}
          <meshStandardMaterial color="#111111" />
        </Text3D>
      </Center>
      <Center position={[0, -0.2, 0.1]}>
        <Text3D font="/fonts/Geist_Regular.json" size={0.06} height={0.01}>
          {cardName || "CARDHOLDER NAME"}
          <meshStandardMaterial color="#111111" />
        </Text3D>
      </Center>
    </Float>
  )
}

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [cartCount, setCartCount] = useState(3)
  const [wishlistCount, setWishlistCount] = useState(5)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [biometricAuth, setBiometricAuth] = useState(false)
  const [formData, setFormData] = useState({
    // Shipping
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    // Payment
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })

  const cartItems = [
    {
      id: 1,
      name: "Eternal Diamond Solitaire Ring",
      price: 4999,
      quantity: 1,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 2,
      name: "Classic Pearl Necklace",
      price: 1299,
      quantity: 1,
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 3,
      name: "Gold Diamond Earrings",
      price: 899,
      quantity: 1,
      image: "/placeholder.svg?height=80&width=80",
    },
  ]

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 0 // Free shipping
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleBiometricAuth = () => {
    setBiometricAuth(true)
    setTimeout(() => {
      setCurrentStep(3)
    }, 2000)
  }

  const steps = [
    { number: 1, title: "Shipping", description: "Delivery information" },
    { number: 2, title: "Payment", description: "Secure payment" },
    { number: 3, title: "Confirmation", description: "Order review" },
  ]

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Inter, sans-serif" }}>
      <Header cartCount={cartCount} wishlistCount={wishlistCount} />

      <div className="pt-24">
        {/* Progress Steps */}
        <section className="py-8 bg-[#F5F5F5]">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center space-x-8">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  className="flex items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                        currentStep >= step.number ? "bg-[#D4AF37] text-[#111111]" : "bg-gray-200 text-gray-500"
                      }`}
                    >
                      {currentStep > step.number ? <Check className="h-6 w-6" /> : step.number}
                    </div>
                    <div className="ml-4 text-left">
                      <div className="font-semibold text-[#111111]">{step.title}</div>
                      <div className="text-sm text-gray-600">{step.description}</div>
                    </div>
                  </div>
                  {index < steps.length - 1 && <ChevronRight className="h-5 w-5 text-gray-400 mx-8" />}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Form Section */}
              <div className="lg:col-span-2">
                <AnimatePresence mode="wait">
                  {/* Step 1: Shipping */}
                  {currentStep === 1 && (
                    <motion.div
                      key="shipping"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card className="shadow-xl border-0">
                        <CardHeader>
                          <CardTitle
                            className="text-3xl font-bold text-[#111111]"
                            style={{ fontFamily: "Playfair Display, serif" }}
                          >
                            Shipping Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <Label htmlFor="firstName" className="text-[#111111] font-semibold">
                                First Name
                              </Label>
                              <Input
                                id="firstName"
                                value={formData.firstName}
                                onChange={(e) => handleInputChange("firstName", e.target.value)}
                                className="mt-2 border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                              />
                            </div>
                            <div>
                              <Label htmlFor="lastName" className="text-[#111111] font-semibold">
                                Last Name
                              </Label>
                              <Input
                                id="lastName"
                                value={formData.lastName}
                                onChange={(e) => handleInputChange("lastName", e.target.value)}
                                className="mt-2 border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="email" className="text-[#111111] font-semibold">
                              Email Address
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleInputChange("email", e.target.value)}
                              className="mt-2 border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                            />
                          </div>

                          <div>
                            <Label htmlFor="phone" className="text-[#111111] font-semibold">
                              Phone Number
                            </Label>
                            <Input
                              id="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => handleInputChange("phone", e.target.value)}
                              className="mt-2 border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                            />
                          </div>

                          <div>
                            <Label htmlFor="address" className="text-[#111111] font-semibold">
                              Street Address
                            </Label>
                            <Input
                              id="address"
                              value={formData.address}
                              onChange={(e) => handleInputChange("address", e.target.value)}
                              className="mt-2 border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                              <Label htmlFor="city" className="text-[#111111] font-semibold">
                                City
                              </Label>
                              <Input
                                id="city"
                                value={formData.city}
                                onChange={(e) => handleInputChange("city", e.target.value)}
                                className="mt-2 border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                              />
                            </div>
                            <div>
                              <Label htmlFor="state" className="text-[#111111] font-semibold">
                                State
                              </Label>
                              <Input
                                id="state"
                                value={formData.state}
                                onChange={(e) => handleInputChange("state", e.target.value)}
                                className="mt-2 border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                              />
                            </div>
                            <div>
                              <Label htmlFor="zipCode" className="text-[#111111] font-semibold">
                                ZIP Code
                              </Label>
                              <Input
                                id="zipCode"
                                value={formData.zipCode}
                                onChange={(e) => handleInputChange("zipCode", e.target.value)}
                                className="mt-2 border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end pt-6">
                            <Button
                              onClick={() => setCurrentStep(2)}
                              className="bg-[#D4AF37] hover:bg-yellow-600 text-[#111111] px-8 py-3 text-lg font-bold rounded-full"
                            >
                              Continue to Payment
                              <ChevronRight className="ml-2 h-5 w-5" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* Step 2: Payment */}
                  {currentStep === 2 && (
                    <motion.div
                      key="payment"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card className="shadow-xl border-0">
                        <CardHeader>
                          <CardTitle
                            className="text-3xl font-bold text-[#111111]"
                            style={{ fontFamily: "Playfair Display, serif" }}
                          >
                            Payment Method
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                          {/* Payment Method Selection */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <motion.button
                              className={`p-6 border-2 rounded-xl transition-all duration-300 ${
                                paymentMethod === "card"
                                  ? "border-[#D4AF37] bg-[#D4AF37]/10"
                                  : "border-gray-200 hover:border-[#D4AF37]/50"
                              }`}
                              onClick={() => setPaymentMethod("card")}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <CreditCard className="h-8 w-8 text-[#D4AF37] mx-auto mb-3" />
                              <div className="font-semibold text-[#111111]">Credit Card</div>
                            </motion.button>

                            <motion.button
                              className={`p-6 border-2 rounded-xl transition-all duration-300 ${
                                paymentMethod === "biometric"
                                  ? "border-[#D4AF37] bg-[#D4AF37]/10"
                                  : "border-gray-200 hover:border-[#D4AF37]/50"
                              }`}
                              onClick={() => setPaymentMethod("biometric")}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Fingerprint className="h-8 w-8 text-[#D4AF37] mx-auto mb-3" />
                              <div className="font-semibold text-[#111111]">Biometric Pay</div>
                            </motion.button>

                            <motion.button
                              className={`p-6 border-2 rounded-xl transition-all duration-300 ${
                                paymentMethod === "mobile"
                                  ? "border-[#D4AF37] bg-[#D4AF37]/10"
                                  : "border-gray-200 hover:border-[#D4AF37]/50"
                              }`}
                              onClick={() => setPaymentMethod("mobile")}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Smartphone className="h-8 w-8 text-[#D4AF37] mx-auto mb-3" />
                              <div className="font-semibold text-[#111111]">Mobile Pay</div>
                            </motion.button>
                          </div>

                          {/* Credit Card Form */}
                          {paymentMethod === "card" && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="space-y-6"
                            >
                              {/* 3D Credit Card */}
                              <div className="h-64 bg-gradient-to-br from-[#F5F5F5] to-[#E5E5E5] rounded-2xl">
                                <Canvas camera={{ position: [0, 0, 8] }}>
                                  <ambientLight intensity={0.5} />
                                  <pointLight position={[10, 10, 10]} />
                                  <CreditCard3D
                                    cardNumber={formData.cardNumber}
                                    cardName={formData.cardName}
                                    expiryDate={formData.expiryDate}
                                  />
                                </Canvas>
                              </div>

                              <div className="grid grid-cols-1 gap-6">
                                <div>
                                  <Label htmlFor="cardNumber" className="text-[#111111] font-semibold">
                                    Card Number
                                  </Label>
                                  <Input
                                    id="cardNumber"
                                    placeholder="1234 5678 9012 3456"
                                    value={formData.cardNumber}
                                    onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                                    className="mt-2 border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                                  />
                                </div>

                                <div>
                                  <Label htmlFor="cardName" className="text-[#111111] font-semibold">
                                    Cardholder Name
                                  </Label>
                                  <Input
                                    id="cardName"
                                    placeholder="John Doe"
                                    value={formData.cardName}
                                    onChange={(e) => handleInputChange("cardName", e.target.value)}
                                    className="mt-2 border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                  <div>
                                    <Label htmlFor="expiryDate" className="text-[#111111] font-semibold">
                                      Expiry Date
                                    </Label>
                                    <Input
                                      id="expiryDate"
                                      placeholder="MM/YY"
                                      value={formData.expiryDate}
                                      onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                                      className="mt-2 border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="cvv" className="text-[#111111] font-semibold">
                                      CVV
                                    </Label>
                                    <Input
                                      id="cvv"
                                      placeholder="123"
                                      value={formData.cvv}
                                      onChange={(e) => handleInputChange("cvv", e.target.value)}
                                      className="mt-2 border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                                    />
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {/* Biometric Payment */}
                          {paymentMethod === "biometric" && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="text-center py-12"
                            >
                              <motion.div
                                className={`w-32 h-32 mx-auto rounded-full border-4 flex items-center justify-center cursor-pointer transition-all duration-300 ${
                                  biometricAuth
                                    ? "border-green-500 bg-green-50"
                                    : "border-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20"
                                }`}
                                onClick={handleBiometricAuth}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                animate={biometricAuth ? { scale: [1, 1.1, 1] } : { scale: [1, 1.02, 1] }}
                                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                              >
                                {biometricAuth ? (
                                  <Check className="h-16 w-16 text-green-500" />
                                ) : (
                                  <Fingerprint className="h-16 w-16 text-[#D4AF37]" />
                                )}
                              </motion.div>
                              <h3 className="text-2xl font-bold text-[#111111] mt-6 mb-2">
                                {biometricAuth ? "Authentication Successful" : "Touch to Authenticate"}
                              </h3>
                              <p className="text-gray-600">
                                {biometricAuth
                                  ? "Proceeding to confirmation..."
                                  : "Use your fingerprint or Face ID to complete payment"}
                              </p>
                            </motion.div>
                          )}

                          {/* Security Features */}
                          <div className="bg-[#F5F5F5] rounded-xl p-6">
                            <div className="flex items-center gap-4 mb-4">
                              <Shield className="h-6 w-6 text-[#D4AF37]" />
                              <h4 className="font-semibold text-[#111111]">Secure Payment</h4>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Lock className="h-4 w-4 text-[#D4AF37]" />
                                <span>256-bit SSL Encryption</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4 text-[#D4AF37]" />
                                <span>PCI DSS Compliant</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-[#D4AF37]" />
                                <span>Fraud Protection</span>
                              </div>
                            </div>
                          </div>

                          {/* Navigation */}
                          <div className="flex justify-between pt-6">
                            <Button
                              variant="outline"
                              onClick={() => setCurrentStep(1)}
                              className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white px-8 py-3"
                            >
                              <ChevronLeft className="mr-2 h-5 w-5" />
                              Back to Shipping
                            </Button>
                            {paymentMethod !== "biometric" && (
                              <Button
                                onClick={() => setCurrentStep(3)}
                                className="bg-[#D4AF37] hover:bg-yellow-600 text-[#111111] px-8 py-3 text-lg font-bold rounded-full"
                              >
                                Review Order
                                <ChevronRight className="ml-2 h-5 w-5" />
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}

                  {/* Step 3: Confirmation */}
                  {currentStep === 3 && (
                    <motion.div
                      key="confirmation"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card className="shadow-xl border-0">
                        <CardHeader>
                          <CardTitle
                            className="text-3xl font-bold text-[#111111]"
                            style={{ fontFamily: "Playfair Display, serif" }}
                          >
                            Order Confirmation
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8">
                          {/* Order Summary */}
                          <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-[#111111]">Order Summary</h3>
                            {cartItems.map((item) => (
                              <div key={item.id} className="flex items-center gap-4 p-4 bg-[#F5F5F5] rounded-lg">
                                <img
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.name}
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                  <h4 className="font-semibold text-[#111111]">{item.name}</h4>
                                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                                </div>
                                <div className="text-xl font-bold text-[#D4AF37]">${item.price.toLocaleString()}</div>
                              </div>
                            ))}
                          </div>

                          {/* Shipping & Payment Info */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                              <h3 className="text-xl font-semibold text-[#111111] mb-4">Shipping Address</h3>
                              <div className="space-y-2 text-gray-600">
                                <p>
                                  {formData.firstName} {formData.lastName}
                                </p>
                                <p>{formData.address}</p>
                                <p>
                                  {formData.city}, {formData.state} {formData.zipCode}
                                </p>
                                <p>{formData.phone}</p>
                                <p>{formData.email}</p>
                              </div>
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold text-[#111111] mb-4">Payment Method</h3>
                              <div className="flex items-center gap-3">
                                {paymentMethod === "card" && <CreditCard className="h-6 w-6 text-[#D4AF37]" />}
                                {paymentMethod === "biometric" && <Fingerprint className="h-6 w-6 text-[#D4AF37]" />}
                                {paymentMethod === "mobile" && <Smartphone className="h-6 w-6 text-[#D4AF37]" />}
                                <span className="text-gray-600">
                                  {paymentMethod === "card" && `•••• •••• •••• ${formData.cardNumber.slice(-4)}`}
                                  {paymentMethod === "biometric" && "Biometric Authentication"}
                                  {paymentMethod === "mobile" && "Mobile Payment"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Place Order */}
                          <div className="text-center pt-6">
                            <Button
                              onClick={() => (window.location.href = "/order-confirmed")}
                              className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 hover:from-yellow-500 hover:to-[#D4AF37] text-[#111111] px-12 py-4 text-xl font-bold rounded-full transition-all duration-500 shadow-xl hover:shadow-2xl"
                            >
                              Place Order - ${total.toLocaleString()}
                            </Button>
                            <p className="text-sm text-gray-600 mt-4">
                              By placing this order, you agree to our Terms of Service and Privacy Policy
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <motion.div
                  className="sticky top-32"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <Card className="shadow-xl border-0">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-[#111111]">Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Cart Items */}
                      <div className="space-y-4">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold text-sm text-[#111111]">{item.name}</h4>
                              <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-lg font-bold text-[#D4AF37]">${item.price.toLocaleString()}</div>
                          </div>
                        ))}
                      </div>

                      <Separator />

                      {/* Price Breakdown */}
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-semibold">${subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping</span>
                          <span className="font-semibold text-green-600">Free</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax</span>
                          <span className="font-semibold">${tax.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-xl">
                          <span className="font-bold text-[#111111]">Total</span>
                          <span className="font-bold text-[#D4AF37]">${total.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Benefits */}
                      <div className="space-y-3 pt-4">
                        <div className="flex items-center gap-3 text-sm">
                          <Truck className="h-4 w-4 text-[#D4AF37]" />
                          <span className="text-gray-600">Free luxury shipping</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Gift className="h-4 w-4 text-[#D4AF37]" />
                          <span className="text-gray-600">Complimentary gift wrapping</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Star className="h-4 w-4 text-[#D4AF37]" />
                          <span className="text-gray-600">Lifetime warranty included</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
