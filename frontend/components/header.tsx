"use client"

import { useState } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, ShoppingCart, Heart, User, Menu, Sun, Moon, Sparkles, Crown } from "lucide-react"

export function Header() {
  const { theme, setTheme } = useTheme()
  const [cartCount] = useState(2)
  const [wishlistCount] = useState(5)

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Crown className="h-8 w-8 text-gold" />
          <span className="font-playfair text-2xl font-bold text-gradient-gold">SMF Jewels</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-sm font-medium hover:text-gold transition-colors">
            Home
          </Link>
          <Link href="/shop" className="text-sm font-medium hover:text-gold transition-colors">
            Shop
          </Link>
          <Link href="/collections" className="text-sm font-medium hover:text-gold transition-colors">
            Collections
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-gold transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-gold transition-colors">
            Contact
          </Link>
        </nav>

        {/* Search Bar */}
        <div className="hidden lg:flex items-center space-x-2 flex-1 max-w-md mx-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search luxury jewelry..."
              className="pl-10 pr-4 bg-muted/50 border-gold/20 focus:border-gold"
            />
            <Button
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 bg-gold hover:bg-gold/90 text-black"
            >
              <Sparkles className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="hover:bg-gold/10"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Wishlist */}
          <Button variant="ghost" size="icon" className="relative hover:bg-gold/10" asChild>
            <Link href="/wishlist">
              <Heart className="h-4 w-4" />
              {wishlistCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-gold text-black">
                  {wishlistCount}
                </Badge>
              )}
            </Link>
          </Button>

          {/* Cart */}
          <Button variant="ghost" size="icon" className="relative hover:bg-gold/10" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-4 w-4" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-gold text-black">
                  {cartCount}
                </Badge>
              )}
            </Link>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-gold/10">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/account">My Account</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/orders">Order History</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/wishlist">Wishlist</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/auth/login">Sign In</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden hover:bg-gold/10">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-8">
                {/* Mobile Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search jewelry..." className="pl-10" />
                </div>

                {/* Mobile Navigation */}
                <nav className="flex flex-col space-y-4">
                  <Link href="/" className="text-lg font-medium hover:text-gold transition-colors">
                    Home
                  </Link>
                  <Link href="/shop" className="text-lg font-medium hover:text-gold transition-colors">
                    Shop
                  </Link>
                  <Link href="/collections" className="text-lg font-medium hover:text-gold transition-colors">
                    Collections
                  </Link>
                  <Link href="/about" className="text-lg font-medium hover:text-gold transition-colors">
                    About
                  </Link>
                  <Link href="/contact" className="text-lg font-medium hover:text-gold transition-colors">
                    Contact
                  </Link>
                </nav>

                <div className="border-t pt-4">
                  <Link href="/auth/login" className="text-lg font-medium hover:text-gold transition-colors">
                    Sign In
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
