"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import OrbBackground from "@/app/components/orb-background"
import { useEffect } from "react"

export default function SubmittedPage() {
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Genassistant",
          text: "Reclaim your inbox with this AI executive assistant.",
          url: window.location.origin,
        })
        .catch((err) => console.error("Error sharing:", err))
    } else {
      navigator.clipboard
        .writeText(window.location.origin)
        .then(() => alert("Link copied to clipboard!"))
        .catch((err) => console.error("Failed to copy:", err))
    }
  }

  // Trigger fade-in animation on mount
  useEffect(() => {
    const element = document.querySelector(".fade-in-up")
    if (element) {
      element.classList.add("visible")
    }
  }, [])

  return (
    <div
      id="submitted-container"
      className="relative flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center px-4"
    >
      <OrbBackground containerId="submitted-container" />
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[0.5px] z-5"></div>
      <div className="relative z-10 max-w-2xl mx-auto fade-in-up">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 drop-shadow-sm">
          Thanks! You’re on the list.
        </h1>
        <p className="text-xl sm:text-2xl text-slate-600 mb-10 drop-shadow-sm">Impact &gt; Inbox</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={handleShare}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg btn-enhanced-hover"
          >
            Share
          </Button>
          <Link href="/" passHref>
            <Button
              variant="outline"
              className="w-full sm:w-auto bg-transparent hover:bg-slate-100 text-slate-700 border-slate-300 px-8 py-4 text-lg font-semibold rounded-lg shadow-lg btn-enhanced-hover"
            >
              Back to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}