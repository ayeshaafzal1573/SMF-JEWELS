import { Crown } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Crown className="h-16 w-16 text-gold mx-auto mb-4 animate-float" />
        <h2 className="font-playfair text-2xl font-bold text-gold mb-2">SMF Jewels</h2>
        <p className="text-muted-foreground">Loading luxury experience...</p>
        <div className="flex justify-center mt-4">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gold rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
            <div className="w-2 h-2 bg-gold rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
          </div>
        </div>
      </div>
    </div>
  )
}
