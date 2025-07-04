"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter, Send, Calendar, Award, Shield } from "lucide-react"
import { Header } from "../../components/header"

export default function ContactPage() {
  const [cartCount, setCartCount] = useState(2)
  const [wishlistCount, setWishlistCount] = useState(5)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const services = [
    "Custom Jewelry Design",
    "Jewelry Appraisal",
    "Ring Sizing",
    "Jewelry Repair",
    "Private Consultation",
    "Bridal Consultation",
    "Investment Consultation",
  ]

  const contactInfo = [
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Visit Our Showroom",
      details: ["One Rodeo Drive, Suite 100", "Beverly Hills, CA 90210"],
      action: "Get Directions",
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Call Us",
      details: ["+1 (555) LUXURY-1", "+1 (555) 589-7921"],
      action: "Call Now",
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Us",
      details: ["concierge@smfjewels.com", "appointments@smfjewels.com"],
      action: "Send Email",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Business Hours",
      details: ["Mon-Sat: 10:00 AM - 7:00 PM", "Sunday: 12:00 PM - 5:00 PM"],
      action: "Book Appointment",
    },
  ]

  const features = [
    {
      icon: <Award className="h-8 w-8" />,
      title: "Expert Consultation",
      description: "One-on-one guidance from certified gemologists",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Lifetime Service",
      description: "Complimentary cleaning and maintenance",
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Private Appointments",
      description: "Exclusive after-hours consultations available",
    },
  ]

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "Inter, sans-serif" }}>
      <Header cartCount={cartCount} wishlistCount={wishlistCount} />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-[#111111] via-gray-900 to-[#111111] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1600')] bg-cover bg-center"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 px-6 py-2 text-lg mb-6">
              Get in Touch
            </Badge>
            <h1 className="text-6xl md:text-8xl font-bold mb-8" style={{ fontFamily: "Playfair Display, serif" }}>
              Contact
              <span className="block text-[#D4AF37]">Our Experts</span>
            </h1>
            <p className="text-2xl text-gray-300 leading-relaxed">
              Experience personalized service and expert guidance. Our team is here to help you find the perfect piece
              or create something uniquely yours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-20 bg-[#F5F5F5]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 shadow-2xl border-0 bg-white">
                <h2
                  className="text-4xl font-bold text-[#111111] mb-6"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  Send us a Message
                </h2>
                <p className="text-gray-600 mb-8 text-lg">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        className="py-3 border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37] transition-all duration-300"
                        required
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        className="py-3 border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37] transition-all duration-300"
                        required
                      />
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                      <Input
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 123-4567"
                        className="py-3 border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37] transition-all duration-300"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Service Interest</label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        className="w-full py-3 px-4 border border-gray-200 rounded-lg focus:border-[#D4AF37] focus:ring-[#D4AF37] transition-all duration-300"
                      >
                        <option value="">Select a service</option>
                        {services.map((service) => (
                          <option key={service} value={service}>
                            {service}
                          </option>
                        ))}
                      </select>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Message *</label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us about your jewelry needs or questions..."
                      rows={6}
                      className="border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37] transition-all duration-300"
                      required
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#D4AF37] to-yellow-500 hover:from-yellow-500 hover:to-[#D4AF37] text-[#111111] py-4 text-lg font-bold rounded-full transition-all duration-500 shadow-xl hover:shadow-2xl"
                    >
                      <Send className="mr-3 h-5 w-5" />
                      Send Message
                    </Button>
                  </motion.div>
                </form>
              </Card>
            </motion.div>

            {/* Store Image & Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Store Image */}
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src="/placeholder.svg?height=400&width=600"
                  alt="SMF Jewels Showroom"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8 text-white">
                  <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "Playfair Display, serif" }}>
                    Beverly Hills Showroom
                  </h3>
                  <p className="text-xl text-gray-200">Experience luxury in person</p>
                </div>
                <motion.div
                  className="absolute top-8 right-8 bg-[#D4AF37] text-[#111111] px-4 py-2 rounded-full font-bold"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  Open Now
                </motion.div>
              </div>

              {/* Contact Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className="p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-[#D4AF37]/10 rounded-full text-[#D4AF37]">{info.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-bold text-[#111111] mb-2">{info.title}</h4>
                          {info.details.map((detail, idx) => (
                            <p key={idx} className="text-gray-600 text-sm">
                              {detail}
                            </p>
                          ))}
                          <Button
                            variant="ghost"
                            className="mt-3 text-[#D4AF37] hover:text-[#111111] hover:bg-[#D4AF37]/10 p-0 h-auto font-semibold"
                          >
                            {info.action} →
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-[#111111] mb-6" style={{ fontFamily: "Playfair Display, serif" }}>
              Why Choose
              <span className="block text-[#D4AF37]">SMF Jewels</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the difference that comes with four decades of expertise and unwavering commitment to
              excellence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="text-center group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-yellow-500 text-white rounded-full mb-6"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3
                    className="text-xl font-bold text-[#111111] mb-4"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-[#F5F5F5]">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-[#111111] mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
              Find Us in Beverly Hills
            </h2>
            <p className="text-xl text-gray-600">Located in the heart of luxury shopping on Rodeo Drive</p>
          </motion.div>

          <motion.div
            className="relative rounded-2xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Map Placeholder */}
            <div className="w-full h-96 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-[#D4AF37] mx-auto mb-4" />
                <p className="text-2xl font-bold text-gray-700">Interactive Map</p>
                <p className="text-gray-600">One Rodeo Drive, Beverly Hills</p>
              </div>
            </div>

            {/* Map Overlay */}
            <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg">
              <h4 className="font-bold text-[#111111] mb-2">SMF Jewels</h4>
              <p className="text-sm text-gray-600">One Rodeo Drive, Suite 100</p>
              <p className="text-sm text-gray-600">Beverly Hills, CA 90210</p>
              <Button className="mt-3 bg-[#D4AF37] hover:bg-yellow-600 text-[#111111] text-sm">Get Directions</Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-20 bg-[#111111] text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-[#D4AF37] mb-6" style={{ fontFamily: "Playfair Display, serif" }}>
              Follow Our Journey
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Stay connected with us on social media for the latest collections, behind-the-scenes content, and
              exclusive offers.
            </p>

            <div className="flex justify-center space-x-6">
              {[
                { icon: Instagram, label: "@smfjewels", followers: "125K" },
                { icon: Facebook, label: "SMF Jewels", followers: "89K" },
                { icon: Twitter, label: "@smfjewels", followers: "45K" },
              ].map((social, index) => (
                <motion.div
                  key={index}
                  className="group cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card className="p-6 bg-white/10 backdrop-blur-sm border-0 hover:bg-[#D4AF37]/20 transition-all duration-300">
                    <social.icon className="h-8 w-8 text-[#D4AF37] mx-auto mb-3" />
                    <p className="font-semibold text-white">{social.label}</p>
                    <p className="text-sm text-gray-400">{social.followers} followers</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
