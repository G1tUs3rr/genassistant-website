"use client"

import { Button } from "@/components/ui/button"
import OrbBackground from "@/app/components/orb-background"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

export default function ConnectPage() {
  const searchParams = useSearchParams()
  const userEmail = searchParams.get("email")

  // Construct the authorization URL on the client side
  const authUrl = userEmail
    ? `/api/auth/outlook/authorize?mode=user&email=${encodeURIComponent(
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