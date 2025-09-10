"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import OrbBackground from "@/app/components/orb-background"
import { useEffect, Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

function ConnectPageComponent() {
  const searchParams = useSearchParams()
  const [userEmail, setUserEmail] = useState(searchParams.get("email") || "")
  const [isConnecting, setIsConnecting] = useState(false)

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://pkr3171pw1.execute-api.us-east-1.amazonaws.com/dev"

  useEffect(() => {
    const element = document.querySelector(".fade-in-up")
    if (element) {
      element.classList.add("visible")
    }
  }, [])

  const handleConnectClick = (e: React.MouseEvent) => {
    e.preventDefault()
    
    if (!userEmail.trim()) {
      alert("Please enter your email address")
      return
    }

    if (!userEmail.includes("@")) {
      alert("Please enter a valid email address")
      return
    }

    setIsConnecting(true)
    
    // Build the auth URL and redirect
    const authUrl = `${API_BASE}/auth/outlook/authorize?mode=user&email=${encodeURIComponent(userEmail.trim())}`
    window.location.href = authUrl
  }

  return (
    <div
      id="submitted-container"
      className="relative flex flex-col items-center justify-center min-h-screen text-center px-4"
    >
      <OrbBackground containerId="submitted-container" />
      <div className="relative z-10 max-w-2xl mx-auto fade-in-up">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Connect your Microsoft 365 Account
        </h1>
        <p className="text-xl sm:text-2xl text-slate-300 mb-10">
          Enable Genassistant to manage your inbox and start saving you time.
        </p>
        
        <div className="w-full max-w-lg mx-auto mb-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-lg font-medium text-slate-300 mb-3 text-left">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full px-6 py-5 text-xl bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                disabled={isConnecting}
              />
            </div>
            <Button
              onClick={handleConnectClick}
              disabled={isConnecting || !userEmail.trim()}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white px-12 py-6 text-xl font-semibold rounded-lg shadow-lg btn-enhanced-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnecting ? "Connecting..." : "Connect with Microsoft 365"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ConnectPage() {
  return (
    <Suspense fallback={<div className="bg-gray-900 min-h-screen"></div>}>
      <ConnectPageComponent />
    </Suspense>
  )
}