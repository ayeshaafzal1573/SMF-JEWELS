"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Menu,
  Crown,
  ChevronDown,
  BarChart3,
  PlusCircle,
  Sparkles,
} from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      current: pathname === "/admin/dashboard",
    },
    {
      name: "Products",
      href: "/admin/products",
      icon: <Package className="h-5 w-5" />,
      current: pathname?.startsWith("/admin/products"),
      children: [
        { name: "All Products", href: "/admin/products" },
        { name: "Add New", href: "/admin/products/new" },
        { name: "Categories", href: "/admin/products/categories" },
      ],
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: <ShoppingCart className="h-5 w-5" />,
      current: pathname?.startsWith("/admin/orders"),
    },
    {
      name: "Customers",
      href: "/admin/customers",
      icon: <Users className="h-5 w-5" />,
      current: pathname?.startsWith("/admin/customers"),
    },
    {
      name: "Analytics",
      href: "/admin/analytics",
      icon: <BarChart3 className="h-5 w-5" />,
      current: pathname?.startsWith("/admin/analytics"),
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
      current: pathname?.startsWith("/admin/settings"),
    },
  ]

  return (
    <div className="flex h-screen bg-muted/30">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r">
        <div className="p-4 border-b">
          <Link href="/" className="flex items-center space-x-2">
            <Crown className="h-6 w-6 text-gold" />
            <span className="font-playfair text-xl font-bold">SMF Admin</span>
          </Link>
        </div>

        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1 px-2">
            {navigation.map((item) => (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center px-3 py-2 rounded-md text-sm font-medium
                    ${
                      item.current
                        ? "bg-gold/10 text-gold"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }
                  `}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                  {item.children && <ChevronDown className="ml-auto h-4 w-4" />}
                </Link>

                {item.children && item.current && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={`
                          block px-3 py-2 rounded-md text-sm font-medium
                          ${
                            pathname === child.href
                              ? "bg-gold/10 text-gold"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }
                        `}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </ScrollArea>

        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start text-muted-foreground">
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <div className="p-4 border-b">
            <Link href="/" className="flex items-center space-x-2">
              <Crown className="h-6 w-6 text-gold" />
              <span className="font-playfair text-xl font-bold">SMF Admin</span>
            </Link>
          </div>

          <ScrollArea className="flex-1 py-4 h-[calc(100vh-8rem)]">
            <nav className="space-y-1 px-2">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center px-3 py-2 rounded-md text-sm font-medium
                      ${
                        item.current
                          ? "bg-gold/10 text-gold"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }
                    `}
                    onClick={() => setIsMobileNavOpen(false)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.name}</span>
                    {item.children && <ChevronDown className="ml-auto h-4 w-4" />}
                  </Link>

                  {item.children && item.current && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={`
                            block px-3 py-2 rounded-md text-sm font-medium
                            ${
                              pathname === child.href
                                ? "bg-gold/10 text-gold"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            }
                          `}
                          onClick={() => setIsMobileNavOpen(false)}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </ScrollArea>

          <div className="p-4 border-t">
            <Button variant="ghost" className="w-full justify-start text-muted-foreground">
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Header */}
        <header className="bg-card border-b h-16 flex items-center px-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileNavOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center ml-auto space-x-4">
            <Button variant="outline" size="sm" className="hidden sm:flex bg-transparent">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Product
            </Button>
            <Button size="sm" className="hidden sm:flex bg-gold hover:bg-gold/90 text-black">
              <Sparkles className="mr-2 h-4 w-4" />
              AI Generate
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
