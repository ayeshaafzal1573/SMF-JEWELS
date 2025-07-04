"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Canvas } from "@react-three/fiber"
import { Float, Sphere } from "@react-three/drei"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Camera,
  Heart,
  ShoppingBag,
  Star,
  Package,
  Truck,
  CheckCircle,
  Clock,
  Settings,
  Bell,
  CreditCard,
  MapPin,
  Edit,
  Download,
  Eye,
  Gift,
  Award,
  TrendingUp,
} from "lucide-react"
import { Header } from "../../components/header"

// 3D Avatar Decoration
function AvatarDecoration() {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere args={[0.1, 16, 16]} position={[1, 1, 0]}>
        <meshPhysicalMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
      </Sphere>
      <Sphere args={[0.08, 16, 16]} position={[-1, 0.5, 0]}>
        <meshPhysicalMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
      </Sphere>
      <Sphere args={[0.06, 16, 16]} position={[0.5, -1, 0]}>
        <meshPhysicalMaterial color="#D4AF37" metalness={0.8} roughness={0.2} />
      </Sphere>
    </Float>
  )
}

export default function AccountPage() {
  const [cartCount, setCartCount] = useState(3)
  const [wishlistCount, setWishlistCount] = useState(12)
  const [activeTab, setActiveTab] = useState("overview")
  const [isEditing, setIsEditing] = useState(false)

  const [userProfile, setUserProfile] = useState({
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    avatar: "/placeholder.svg?height=120&width=120",
    memberSince: "January 2023",
    totalSpent: 15750,
    totalOrders: 8,
    favoriteCategory: "Diamond Rings",
    vipStatus: "Gold Member",
  })

  const recentOrders = [
    {
      id: "ORD-2024-001",
      date: "2024-01-15",
      status: "Delivered",
      total: 4999,
      items: [
        {
          name: "Eternal Diamond Solitaire Ring",
          image: "/placeholder.svg?height=60&width=60",
          price: 4999,
        },
      ],
    },
    {
      id: "ORD-2024-002",
      date: "2024-01-10",
      status: "In Transit",
      total: 1299,
      items: [
        {
          name: "Classic Pearl Necklace",
          image: "/placeholder.svg?height=60&width=60",
          price: 1299,
        },
      ],
    },
    {
      id: "ORD-2024-003",
      date: "2024-01-05",
      status: "Processing",
      total: 899,
      items: [
        {
          name: "Gold Diamond Earrings",
          image: "/placeholder.svg?height=60&width=60",
          price: 899,
        },
      ],
    },
  ]

  const wishlistItems = [
    {
      id: 1,
      name: "Vintage Rose Gold Ring",
      price: 2199,
      image: "/placeholder.svg?height=80&width=80",
      inStock: true,
    },
    {
      id: 2,
      name: "Emerald Cut Solitaire",
      price: 5499,
      image: "/placeholder.svg?height=80&width=80",
      inStock: true,
    },
    {
      id: 3,
      name: "Diamond Tennis Bracelet",
      price: 3299,
      image: "/placeholder.svg?height=80&width=80",
      inStock: false,
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "In Transit":
        return <Truck className="h-4 w-4 text-blue-500" />
      case "Processing":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <Package className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800"
      case "In Transit":
        return "bg-blue-100 text-blue-800"
      case "Processing":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Inter, sans-serif" }}>
      <Header cartCount={cartCount} wishlistCount={wishlistCount} />

      <div className="pt-24">
        {/* Profile Header */}
        <section className="py-12 bg-gradient-to-br from-[#F5F5F5] to-[#E5E5E5]">
          <div className="container mx-auto px-4">
            <motion.div
              className="flex flex-col md:flex-row items-center gap-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Avatar with 3D Decoration */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#D4AF37] shadow-xl">
                  <Avatar className="w-full h-full">
                    <AvatarImage src={userProfile.avatar || "/placeholder.svg"} alt={userProfile.name} />
                    <AvatarFallback className="text-2xl font-bold bg-[#D4AF37] text-[#111111]">
                      {userProfile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16">
                  <Canvas camera={{ position: [0, 0, 5] }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <AvatarDecoration />
                  </Canvas>
                </div>
                <Button
                  size="icon"
                  className="absolute bottom-0 right-0 rounded-full bg-[#D4AF37] hover:bg-yellow-600 text-[#111111]"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-4 mb-4">
                  <h1 className="text-4xl font-bold text-[#111111]" style={{ fontFamily: "Playfair Display, serif" }}>
                    {userProfile.name}
                  </h1>
                  <Badge className="bg-[#D4AF37] text-[#111111] font-bold">{userProfile.vipStatus}</Badge>
                </div>
                <p className="text-xl text-gray-600 mb-6">Member since {userProfile.memberSince}</p>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
                    <div className="text-3xl font-bold text-[#D4AF37]">${userProfile.totalSpent.toLocaleString()}</div>
                    <div className="text-gray-600">Total Spent</div>
                  </motion.div>
                  <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
                    <div className="text-3xl font-bold text-[#D4AF37]">{userProfile.totalOrders}</div>
                    <div className="text-gray-600">Orders Placed</div>
                  </motion.div>
                  <motion.div className="text-center" whileHover={{ scale: 1.05 }}>
                    <div className="text-3xl font-bold text-[#D4AF37]">{wishlistCount}</div>
                    <div className="text-gray-600">Wishlist Items</div>
                  </motion.div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-[#D4AF37] hover:bg-yellow-600 text-[#111111] font-bold"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white bg-transparent"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Recent Orders */}
                  <div className="lg:col-span-2">
                    <Card className="shadow-xl border-0">
                      <CardHeader>
                        <CardTitle className="text-2xl font-bold text-[#111111]">Recent Orders</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {recentOrders.map((order, index) => (
                          <motion.div
                            key={order.id}
                            className="flex items-center gap-4 p-4 bg-[#F5F5F5] rounded-lg hover:bg-[#E5E5E5] transition-colors cursor-pointer"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                          >
                            <img
                              src={order.items[0].image || "/placeholder.svg"}
                              alt={order.items[0].name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold text-[#111111]">{order.id}</h4>
                                <Badge className={`${getStatusColor(order.status)} border-0`}>
                                  {getStatusIcon(order.status)}
                                  <span className="ml-1">{order.status}</span>
                                </Badge>
                              </div>
                              <p className="text-gray-600 text-sm">{order.items[0].name}</p>
                              <p className="text-gray-500 text-xs">{order.date}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-[#D4AF37]">${order.total.toLocaleString()}</div>
                              <Button variant="ghost" size="sm" className="text-[#D4AF37] hover:text-[#111111]">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Quick Stats & Actions */}
                  <div className="space-y-6">
                    {/* VIP Benefits */}
                    <Card className="shadow-xl border-0 bg-gradient-to-br from-[#D4AF37]/10 to-[#D4AF37]/5">
                      <CardHeader>
                        <CardTitle className="text-xl font-bold text-[#111111] flex items-center gap-2">
                          <Award className="h-6 w-6 text-[#D4AF37]" />
                          VIP Benefits
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Gift className="h-5 w-5 text-[#D4AF37]" />
                          <span className="text-sm">Free gift wrapping</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Truck className="h-5 w-5 text-[#D4AF37]" />
                          <span className="text-sm">Priority shipping</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Star className="h-5 w-5 text-[#D4AF37]" />
                          <span className="text-sm">Exclusive previews</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <TrendingUp className="h-5 w-5 text-[#D4AF37]" />
                          <span className="text-sm">Personal stylist</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="shadow-xl border-0">
                      <CardHeader>
                        <CardTitle className="text-xl font-bold text-[#111111]">Quick Actions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button className="w-full bg-[#D4AF37] hover:bg-yellow-600 text-[#111111] font-bold">
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          Continue Shopping
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white bg-transparent"
                        >
                          <Heart className="mr-2 h-4 w-4" />
                          View Wishlist
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white bg-transparent"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download Invoices
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders">
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-[#111111]">Order History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {recentOrders.map((order, index) => (
                        <motion.div
                          key={order.id}
                          className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-[#111111]">{order.id}</h3>
                              <p className="text-gray-600">Placed on {order.date}</p>
                            </div>
                            <Badge className={`${getStatusColor(order.status)} border-0`}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1">{order.status}</span>
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 mb-4">
                            <img
                              src={order.items[0].image || "/placeholder.svg"}
                              alt={order.items[0].name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold text-[#111111]">{order.items[0].name}</h4>
                              <p className="text-[#D4AF37] font-bold text-lg">
                                ${order.items[0].price.toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white bg-transparent"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white bg-transparent"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Invoice
                            </Button>
                            {order.status === "Delivered" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white bg-transparent"
                              >
                                <Star className="h-4 w-4 mr-1" />
                                Review
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Wishlist Tab */}
              <TabsContent value="wishlist">
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-[#111111]">My Wishlist</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlistItems.map((item, index) => (
                        <motion.div
                          key={item.id}
                          className="group cursor-pointer"
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          whileHover={{ y: -10 }}
                        >
                          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                            <div className="relative overflow-hidden">
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-4 right-4 bg-white/80 hover:bg-white rounded-full"
                              >
                                <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                              </Button>
                              {!item.inStock && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                  <Badge variant="secondary" className="bg-white text-[#111111]">
                                    Out of Stock
                                  </Badge>
                                </div>
                              )}
                            </div>
                            <CardContent className="p-6">
                              <h3 className="font-bold text-lg text-[#111111] mb-2">{item.name}</h3>
                              <div className="flex items-center justify-between mb-4">
                                <span className="text-2xl font-bold text-[#D4AF37]">
                                  ${item.price.toLocaleString()}
                                </span>
                              </div>
                              <Button
                                className="w-full bg-[#D4AF37] hover:bg-yellow-600 text-[#111111] font-bold"
                                disabled={!item.inStock}
                              >
                                <ShoppingBag className="mr-2 h-4 w-4" />
                                {item.inStock ? "Add to Cart" : "Notify When Available"}
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card className="shadow-xl border-0">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-[#111111]">Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name" className="text-[#111111] font-semibold">
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          value={userProfile.name}
                          disabled={!isEditing}
                          className="mt-2 border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-[#111111] font-semibold">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={userProfile.email}
                          disabled={!isEditing}
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
                          value={userProfile.phone}
                          disabled={!isEditing}
                          className="mt-2 border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                        />
                      </div>
                      <div>
                        <Label htmlFor="memberSince" className="text-[#111111] font-semibold">
                          Member Since
                        </Label>
                        <Input
                          id="memberSince"
                          value={userProfile.memberSince}
                          disabled
                          className="mt-2 border-gray-200 bg-gray-50"
                        />
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex gap-4 pt-6">
                        <Button
                          onClick={() => setIsEditing(false)}
                          className="bg-[#D4AF37] hover:bg-yellow-600 text-[#111111] font-bold"
                        >
                          Save Changes
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                          className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="shadow-xl border-0">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-[#111111]">Notifications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-[#111111]">Order Updates</h4>
                          <p className="text-sm text-gray-600">Get notified about order status changes</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Toggle
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-[#111111]">New Collections</h4>
                          <p className="text-sm text-gray-600">Be first to know about new jewelry</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Toggle
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-[#111111]">Price Drops</h4>
                          <p className="text-sm text-gray-600">Get alerts for wishlist item discounts</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Toggle
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-xl border-0">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-[#111111]">Privacy & Security</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button className="w-full bg-[#D4AF37] hover:bg-yellow-600 text-[#111111] font-bold">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Manage Payment Methods
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white bg-transparent"
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        Update Addresses
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white bg-transparent"
                      >
                        <Bell className="mr-2 h-4 w-4" />
                        Privacy Settings
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white bg-transparent"
                      >
                        Delete Account
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </div>
    </div>
  )
}
