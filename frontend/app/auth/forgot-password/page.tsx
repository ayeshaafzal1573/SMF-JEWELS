"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Crown, Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { Header } from "@/components/header"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate password reset email
    setTimeout(() => {
      setIsLoading(false)
      setIsSubmitted(true)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Header />

      <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
        <div className="w-full max-w-md">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Crown className="h-12 w-12 text-gold" />
                <motion.div
                  className="absolute inset-0 bg-gold/20 rounded-full blur-lg"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
              </div>
            </div>

            <Card className="border-gold/20 shadow-lg shadow-gold/5">
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-3xl font-bold font-playfair">Reset Password</CardTitle>
                <CardDescription>
                  {isSubmitted
                    ? "Check your email for reset instructions"
                    : "Enter your email to receive a password reset link"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {isSubmitted ? (
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
                        <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      We&apos;ve sent a password reset link to{" "}
                      <span className="font-medium text-foreground">{email}</span>. Please check your inbox and follow
                      the instructions to reset your password.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      If you don&apos;t see the email, check your spam folder or request another link.
                    </p>
                    <Button
                      className="mt-4 w-full bg-gold hover:bg-gold/90 text-black"
                      onClick={() => setIsSubmitted(false)}
                    >
                      Resend Email
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 border-gold/20 focus:border-gold"
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-gold hover:bg-gold/90 text-black" disabled={isLoading}>
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                          Sending reset link...
                        </div>
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>

              <CardFooter className="flex justify-center">
                <Link href="/auth/login" className="text-gold hover:underline flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to login
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
