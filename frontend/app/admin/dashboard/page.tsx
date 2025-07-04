"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  DollarSign,
  Users,
  ShoppingBag,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Package,
  Crown,
  Sparkles,
  BarChart3,
  PieChart,
  LineChart,
} from "lucide-react"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data
  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1%",
      trend: "up",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      title: "New Customers",
      value: "117",
      change: "+10.3%",
      trend: "up",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "Total Orders",
      value: "2,345",
      change: "+12.2%",
      trend: "up",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "-0.4%",
      trend: "down",
      icon: <TrendingUp className="h-5 w-5" />,
    },
  ]

  const topProducts = [
    {
      name: "Diamond Solitaire Ring",
      category: "Rings",
      price: "$2,999",
      sales: 42,
      trend: "up",
    },
    {
      name: "Gold Chain Necklace",
      category: "Necklaces",
      price: "$1,299",
      sales: 38,
      trend: "up",
    },
    {
      name: "Pearl Earrings",
      category: "Earrings",
      price: "$899",
      sales: 27,
      trend: "down",
    },
    {
      name: "Silver Bracelet",
      category: "Bracelets",
      price: "$599",
      sales: 24,
      trend: "up",
    },
  ]

  const recentOrders = [
    {
      id: "ORD-7352",
      customer: "Sarah Johnson",
      date: "2023-07-03",
      status: "Completed",
      total: "$3,299",
    },
    {
      id: "ORD-7351",
      customer: "Michael Brown",
      date: "2023-07-02",
      status: "Processing",
      total: "$1,499",
    },
    {
      id: "ORD-7350",
      customer: "Emily Davis",
      date: "2023-07-02",
      status: "Shipped",
      total: "$2,199",
    },
    {
      id: "ORD-7349",
      customer: "Robert Wilson",
      date: "2023-07-01",
      status: "Completed",
      total: "$899",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Admin. Here&apos;s an overview of your store.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">Download Report</Button>
          <Button className="bg-gold hover:bg-gold/90 text-black">
            <Sparkles className="mr-2 h-4 w-4" />
            AI Insights
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">{stat.icon}</div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>{stat.change}</span>
                    {stat.trend === "up" ? (
                      <ArrowUp className="ml-1 h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDown className="ml-1 h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Chart */}
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
                <CardDescription>Daily revenue for the past 30 days</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                  <LineChart className="h-16 w-16 text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Revenue Chart Visualization</span>
                </div>
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>Best selling products this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product) => (
                    <div key={product.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                          <Package className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium">{product.price}</span>
                        <div className="flex items-center">
                          <span className="text-sm">{product.sales}</span>
                          {product.trend === "up" ? (
                            <ArrowUp className="ml-1 h-4 w-4 text-green-500" />
                          ) : (
                            <ArrowDown className="ml-1 h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left font-medium p-4 pl-0">Order ID</th>
                      <th className="text-left font-medium p-4">Customer</th>
                      <th className="text-left font-medium p-4">Date</th>
                      <th className="text-left font-medium p-4">Status</th>
                      <th className="text-left font-medium p-4">Total</th>
                      <th className="text-right font-medium p-4 pr-0">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="p-4 pl-0">
                          <div className="flex items-center">
                            <Crown className="mr-2 h-4 w-4 text-gold" />
                            {order.id}
                          </div>
                        </td>
                        <td className="p-4">{order.customer}</td>
                        <td className="p-4">{order.date}</td>
                        <td className="p-4">
                          <div
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${order.status === "Completed" && "bg-green-100 text-green-800"}
                            ${order.status === "Processing" && "bg-blue-100 text-blue-800"}
                            ${order.status === "Shipped" && "bg-yellow-100 text-yellow-800"}
                          `}
                          >
                            {order.status}
                          </div>
                        </td>
                        <td className="p-4">{order.total}</td>
                        <td className="p-4 pr-0 text-right">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Analytics</CardTitle>
              <CardDescription>Detailed sales performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="flex flex-col items-center text-center">
                <BarChart3 className="h-16 w-16 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">Analytics visualization would appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>Download and manage reports</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="flex flex-col items-center text-center">
                <PieChart className="h-16 w-16 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">Reports would appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>System Notifications</CardTitle>
              <CardDescription>Important alerts and updates</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="flex flex-col items-center text-center">
                <p className="text-muted-foreground">No new notifications</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
