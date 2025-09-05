"use client"

import { Button } from "@/components/ui/button"
import OrbBackground from "@/app/components/orb-background"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

export default function ConnectPage() {
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()

  const handleConnect = async () => {
    setIsLoading(true)
    const userEmail = searchParams.get("email")

    if (!userEmail) {
      alert("Email not found in URL. Please use the link provided in your invitation.")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/outlook/authorize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Email": userEmail,
        },
      })

      if (response.ok) {
        const data = await response.json()
        window.location.href = data.authorization_url
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.detail || "An unexpected error occurred."}`)
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Failed to connect:", error)
      alert("Failed to initiate connection. Please try again.")
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const element = document.querySelector(".fade-in-up")
    if (element) {
      element.classList.add("visible")
    }
  }, [])

  return (
    <div
      id="connect-container"
      className="relative flex flex-col items-center justify-center min-h-screen text-center px-4"
    >
      <OrbBackground containerId="connect-container" />
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[0.5px] "></div>
      <div className="relative z-10 max-w-2xl mx-auto fade-in-up">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 ">
          Connect your Microsoft 365 Account
        </h1>
        <p className="text-xl sm:text-2xl text-slate-600 mb-10 ">
          Enable Genassistant to manage your inbox and calendar by connecting your
          account.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={handleConnect}
            disabled={isLoading}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg btn-enhanced-hover"
          >
            {isLoading ? "Connecting..." : "Connect with Microsoft 365"}
          </Button>
        </div>
      </div>
    </div>
  )
}