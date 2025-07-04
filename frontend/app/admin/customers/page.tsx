"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, MoreHorizontal, Eye, Mail, Ban, Crown, Star, Users, UserPlus, DollarSign } from "lucide-react"

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock customer data
  const customers = [
    {
      id: "CUST-001",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      joinDate: "2023-01-15",
      orders: 12,
      totalSpent: 15299,
      status: "VIP",
      lastOrder: "2023-07-03",
    },
    {
      id: "CUST-002",
      name: "Michael Brown",
      email: "michael@example.com",
      joinDate: "2023-02-20",
      orders: 8,
      totalSpent: 8499,
      status: "Regular",
      lastOrder: "2023-07-02",
    },
    {
      id: "CUST-003",
      name: "Emily Davis",
      email: "emily@example.com",
      joinDate: "2023-03-10",
      orders: 15,
      totalSpent: 22199,
      status: "VIP",
      lastOrder: "2023-07-02",
    },
    {
      id: "CUST-004",
      name: "Robert Wilson",
      email: "robert@example.com",
      joinDate: "2023-04-05",
      orders: 3,
      totalSpent: 2899,
      status: "New",
      lastOrder: "2023-07-01",
    },
    {
      id: "CUST-005",
      name: "Lisa Anderson",
      email: "lisa@example.com",
      joinDate: "2023-05-12",
      orders: 6,
      totalSpent: 5799,
      status: "Regular",
      lastOrder: "2023-06-30",
    },
    {
      id: "CUST-006",
      name: "David Martinez",
      email: "david@example.com",
      joinDate: "2023-06-01",
      orders: 1,
      totalSpent: 599,
      status: "New",
      lastOrder: "2023-06-29",
    },
  ]

  // Filter customers based on search query
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "VIP":
        return <Crown className="h-4 w-4 text-gold" />
      case "Regular":
        return <Star className="h-4 w-4 text-blue-500" />
      case "New":
        return <UserPlus className="h-4 w-4 text-green-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">Manage your customer relationships and data.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">Export Customers</Button>
        </div>
      </div>

      {/* Customer Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                <h3 className="text-2xl font-bold">1,234</h3>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">New This Month</p>
                <h3 className="text-2xl font-bold">89</h3>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30">
                <UserPlus className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">VIP Customers</p>
                <h3 className="text-2xl font-bold">156</h3>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gold/20">
                <Crown className="h-6 w-6 text-gold" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Order Value</p>
                <h3 className="text-2xl font-bold">$1,299</h3>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30">
                <DollarSign className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Search Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-4">
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead className="text-center">Orders</TableHead>
                <TableHead className="text-right">Total Spent</TableHead>
                <TableHead>Last Order</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No customers found. Try adjusting your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer, index) => (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b last:border-0"
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-muted-foreground">{customer.email}</div>
                        <div className="text-xs text-muted-foreground">{customer.id}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getStatusIcon(customer.status)}
                        <span
                          className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${customer.status === "VIP" && "bg-gold/20 text-gold"}
                          ${customer.status === "Regular" && "bg-blue-100 text-blue-800"}
                          ${customer.status === "New" && "bg-green-100 text-green-800"}
                        `}
                        >
                          {customer.status}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{customer.joinDate}</TableCell>
                    <TableCell className="text-center">{customer.orders}</TableCell>
                    <TableCell className="text-right font-medium">${customer.totalSpent.toLocaleString()}</TableCell>
                    <TableCell>{customer.lastOrder}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Ban className="mr-2 h-4 w-4" />
                            Block Customer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <strong>{filteredCustomers.length}</strong> of <strong>{customers.length}</strong> customers
        </p>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" className="bg-muted">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
