"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, Heart, Diamond, Crown, ArrowRight, Play } from "lucide-react"
import Link from "next/link"
import { Header } from "../../components/header"

export default function AboutPage() {
  const [cartCount, setCartCount] = useState(2)
  const [wishlistCount, setWishlistCount] = useState(5)

  const milestones = [
    { year: "1980", title: "Founded", description: "SMF Jewels established in Beverly Hills" },
    { year: "1995", title: "International Expansion", description: "Opened flagship stores in London and Paris" },
    { year: "2005", title: "Master Craftsman Award", description: "Recognized for exceptional jewelry craftsmanship" },
    { year: "2015", title: "Sustainable Practices", description: "Committed to ethical sourcing and sustainability" },
    { year: "2020", title: "Digital Innovation", description: "Launched virtual consultation services" },
    { year: "2024", title: "Legacy Continues", description: "Celebrating 44 years of excellence" },
  ]

  const values = [
    {
      icon: <Diamond className="h-8 w-8" />,
      title: "Exceptional Quality",
      description: "Every piece meets the highest standards of craftsmanship and materials",
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Personal Service",
      description: "Dedicated to creating meaningful relationships with our clients",
    },
    {
      icon: <Crown className="h-8 w-8" />,
      title: "Timeless Design",
      description: "Creating pieces that transcend trends and last for generations",
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Ethical Sourcing",
      description: "Committed to responsible and sustainable jewelry practices",
    },
  ]

  const team = [
    {
      name: "Sarah Mitchell",
      role: "Master Jeweler & Founder",
      image: "/placeholder.svg?height=400&width=400",
      bio: "With over 40 years of experience, Sarah founded SMF Jewels with a vision to create timeless pieces.",
    },
    {
      name: "Marcus Chen",
      role: "Head of Design",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Marcus brings innovative design concepts while respecting traditional craftsmanship techniques.",
    },
    {
      name: "Elena Rodriguez",
      role: "Gemologist",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Elena ensures every gemstone meets our exacting standards for quality and ethical sourcing.",
    },
  ]

  const achievements = [
    { number: "44+", label: "Years of Excellence" },
    { number: "50K+", label: "Happy Clients" },
    { number: "15", label: "International Awards" },
    { number: "100%", label: "Ethical Sourcing" },
  ]

  return (
    <div className="min-h-screen bg-white overflow-x-hidden" style={{ fontFamily: "Inter, sans-serif" }}>
      <Header cartCount={cartCount} wishlistCount={wishlistCount} />

      {/* Hero Section */}
      <section className="pt-32 pb-20  bg-cover bg-center from-[#111111] via-gray-900 to-[#111111] text-white bg-[url('/contact.png?height=800&width=1600')]">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 px-6 py-2 text-lg mb-6">
              Our Story
            </Badge>
            <h1 className="text-6xl md:text-8xl font-bold mb-8" style={{ fontFamily: "Playfair Display, serif" }}>
              Crafting
              <span className="block text-[#D4AF37]">Legacy</span>
            </h1>
            <p className="text-2xl text-gray-300 leading-relaxed mb-10">
              For over four decades, SMF Jewels has been synonymous with exceptional craftsmanship, timeless design, and
              unparalleled service. Our journey began with a simple vision: to create jewelry that tells stories and
              celebrates life's most precious moments.
            </p>
            <motion.button
              className="bg-[#D4AF37] hover:bg-yellow-600 text-[#111111] px-10 py-4 text-xl font-bold rounded-full transition-all duration-300 flex items-center mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="mr-3 h-6 w-6" />
              Watch Our Story
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-[#F5F5F5]">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-[#111111] mb-6" style={{ fontFamily: "Playfair Display, serif" }}>
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do, from selecting the finest materials to crafting each piece with
              meticulous attention to detail.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                className="text-center group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                  <motion.div
                    className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#D4AF37] to-yellow-500 text-white rounded-full mb-6"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    {value.icon}
                  </motion.div>
                  <h3
                    className="text-xl font-bold text-[#111111] mb-4"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
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
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From humble beginnings to international recognition, discover the milestones that shaped SMF Jewels.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-[#D4AF37]/30"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  className={`flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? "pr-8 text-right" : "pl-8 text-left"}`}>
                    <Card className="p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div
                        className="text-3xl font-bold text-[#D4AF37] mb-2"
                        style={{ fontFamily: "Playfair Display, serif" }}
                      >
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-bold text-[#111111] mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </Card>
                  </div>

                  {/* Timeline Dot */}
                  <div className="relative z-10">
                    <div className="w-4 h-4 bg-[#D4AF37] rounded-full border-4 border-white shadow-lg"></div>
                  </div>

                  <div className="w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-[#F5F5F5]">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-[#111111] mb-6" style={{ fontFamily: "Playfair Display, serif" }}>
              Meet Our Masters
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The talented artisans and visionaries behind every SMF Jewels masterpiece.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500">
                  <div className="relative overflow-hidden">
                    <motion.img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-80 object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <CardContent className="p-8">
                    <h3
                      className="text-2xl font-bold text-[#111111] mb-2"
                      style={{ fontFamily: "Playfair Display, serif" }}
                    >
                      {member.name}
                    </h3>
                    <p className="text-[#D4AF37] font-semibold mb-4">{member.role}</p>
                    <p className="text-gray-600 leading-relaxed">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-[#111111] text-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-[#D4AF37] mb-6" style={{ fontFamily: "Playfair Display, serif" }}>
              By the Numbers
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our achievements reflect our commitment to excellence and the trust our clients place in us.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div
                  className="text-5xl md:text-6xl font-bold text-[#D4AF37] mb-4"
                  style={{ fontFamily: "Playfair Display, serif" }}
                >
                  {achievement.number}
                </div>
                <p className="text-xl text-gray-300 font-semibold">{achievement.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl font-bold text-[#111111] mb-6" style={{ fontFamily: "Playfair Display, serif" }}>
              Experience the
              <span className="block text-[#D4AF37]">SMF Difference</span>
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Visit our showroom or schedule a private consultation to discover how we can create something
              extraordinary for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/contact">
                <motion.button
                  className="bg-gradient-to-r from-[#D4AF37] to-yellow-500 hover:from-yellow-500 hover:to-[#D4AF37] text-[#111111] px-10 py-4 text-xl font-bold rounded-full transition-all duration-500 shadow-xl hover:shadow-2xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Schedule Consultation
                  <ArrowRight className="ml-3 h-6 w-6 inline" />
                </motion.button>
              </Link>
              <Link href="/collections">
                <motion.button
                  className="border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white px-10 py-4 text-xl font-bold rounded-full transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Collections
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
