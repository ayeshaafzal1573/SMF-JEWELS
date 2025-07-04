"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, X, Send, Sparkles } from "lucide-react"

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: "1",
      role: "assistant" as const,
      content:
        "Hello! I'm your SMF Jewels AI assistant. I can help you find the perfect jewelry, provide care instructions, or answer any questions about our luxury collection. How can I assist you today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const quickQuestions = [
    "Show me engagement rings",
    "What's trending in jewelry?",
    "How to care for gold jewelry?",
    "Gift ideas for anniversary",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { id: Date.now().toString(), role: "user" as const, content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I'd be happy to help you find the perfect piece! Our engagement rings feature ethically sourced diamonds in platinum and gold settings. Would you like to see our most popular styles?",
        "Currently trending: minimalist gold bands, vintage-inspired pieces, and colored gemstone accents. Lab-grown diamonds are also very popular for their sustainability.",
        "For gold jewelry: Clean with warm soapy water, dry thoroughly, store separately to prevent scratching, and have it professionally cleaned annually.",
        "For anniversaries, consider: tennis bracelets for elegance, pendant necklaces for daily wear, or custom pieces with birthstones. What's your budget range?",
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant" as const,
          content: randomResponse,
        },
      ])
      setIsLoading(false)
    }, 1000)
  }

  const handleQuickQuestion = (question: string) => {
    setInput(question)
    handleSubmit({ preventDefault: () => {} } as React.FormEvent)
  }

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gold hover:bg-gold/90 text-white shadow-lg z-50 transition-all duration-300 hover:scale-110"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
        <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full animate-pulse" />
      </Button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-6">
          <Card className="w-96 h-[600px] shadow-2xl border-gold/20">
            <CardHeader className="bg-gradient-to-r from-gold to-yellow-500 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  <CardTitle className="text-lg">SMF Jewels AI</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0 flex flex-col h-full">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === "user" ? "bg-gold text-white" : "bg-muted text-foreground"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gold rounded-full animate-bounce" />
                          <div
                            className="w-2 h-2 bg-gold rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          />
                          <div
                            className="w-2 h-2 bg-gold rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Quick Questions */}
              {messages.length <= 1 && (
                <div className="p-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Quick questions:</p>
                  <div className="grid grid-cols-1 gap-2">
                    {quickQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="text-left justify-start h-auto p-2 text-xs bg-transparent"
                        onClick={() => handleQuickQuestion(question)}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about jewelry..."
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" className="bg-gold hover:bg-gold/90">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
