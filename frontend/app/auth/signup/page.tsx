"use client"

import { JSX, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff, User, Mail, Lock, ArrowRight } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.")
      return
    }
setIsLoading(true)

try {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message || "Signup failed")
  }

  alert("Signup successful! 🎉")
  router.push("/auth/login")
} catch (error: any) {
  alert(error.message)
} finally {
  setIsLoading(false)
}

  }

  const renderInput = (
    id: string,
    label: string,
    type = "text",
    icon: JSX.Element
  ) => (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-gold">
        {label}
      </Label>
      <div className="relative">
        <span className="absolute left-3 top-3">{icon}</span>
        <Input
          id={id}
          name={id}
          type={type}
          placeholder={label}
          value={(formData as any)[id]}
          onChange={handleChange}
          className="pl-10 border-gold/40 focus:border-gold focus:ring-gold bg-input/70 text-foreground"
          required
        />
      </div>
    </div>
  )

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/signup.png')" }}
    >
      <div className="container flex items-center justify-center min-h-[calc(80vh-4rem)] py-2">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
          <Card className="bg-white/10 border border-white/30 backdrop-blur-[1px] shadow-2xl rounded-2xl">

              <div className="flex justify-center pt-2">
                <motion.img
                  src="/butterfly.png"
                  alt="SMF Jewels Logo"
                  className="h-12"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>

              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-playfair text-gold-dark">
                Signup
                </CardTitle>
              
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSignup} className="space-y-6">
                    {renderInput("name", "Name", "text", <User className="h-4 w-4" />)}
                

                  {renderInput("email", "Email", "email", <Mail className="h-4 w-4 " />)}

                  {/* Password */}
                  <div className="space-y-1">
                    <Label htmlFor="password" className="text-gold">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 " />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        className="pl-10 border-gold/40 focus:border-gold focus:ring-gold bg-input/70 text-foreground"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-0 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1">
                    <Label htmlFor="confirmPassword" className="text-gold">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="pl-10 border-gold/40 focus:border-gold focus:ring-gold bg-input/70 text-foreground"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    className="w-full bg-gold hover:bg-gold/90 text-black font-semibold text-lg py-3"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                        Creating Account...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        Create Account <ArrowRight className="ml-2 h-5 w-5" />
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="flex justify-center pt-0">
                <p className="text-base text-dark">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-gold hover:underline font-semibold">
                    Sign in
                  </Link>
                </p>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
