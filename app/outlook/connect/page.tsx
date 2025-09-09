"use client"

import { Button } from "@/components/ui/button"
import OrbBackground from "@/app/components/orb-background"
import { useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

function ConnectPageComponent() {
  const searchParams = useSearchParams()
  const userEmail = searchParams.get("email")

  const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://pkr3171pw1.execute-api.us-east-1.amazonaws.com/dev"
  const authUrl = userEmail
    ? `${API_BASE}/auth/outlook/authorize?mode=user&email=${encodeURIComponent(
        userEmail
      )}`
    : "#"

  useEffect(() => {
    const element = document.querySelector(".fade-in-up")
    if (element) {
      element.classList.add("visible")
    }
  }, [])

  const handleConnectClick = (e: React.MouseEvent) => {
    if (!userEmail) {
      e.preventDefault()
      alert(
        "Email not found in URL. Please use the link provided in your invitation."
      )
    }
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
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href={authUrl} passHref legacyBehavior>
            <a
              onClick={handleConnectClick}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg btn-enhanced-hover no-underline flex items-center justify-center"
            >
              Connect with Microsoft 365
            </a>
          </Link>
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