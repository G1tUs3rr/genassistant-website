"use client"

import OrbBackground from "@/app/components/orb-background"
import { useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

function ConnectedPageComponent() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const element = document.querySelector(".fade-in-up")
    if (element) {
      element.classList.add("visible")
    }

    const email = searchParams.get("email")
    const notificationSent = sessionStorage.getItem("notificationSent")

    if (!notificationSent) {
      const upn = email || "Unknown"
      fetch("/api/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ upn }),
      }).then(() => {
        sessionStorage.setItem("notificationSent", "true")
      })
    }
  }, [searchParams])

  return (
    <div
      id="submitted-container"
      className="relative flex flex-col items-center justify-center min-h-screen text-center px-4"
    >
      <OrbBackground containerId="submitted-container" />
      <div className="relative z-10 max-w-2xl mx-auto fade-in-up">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Connection Successful!
        </h1>
        <p className="text-xl sm:text-2xl text-slate-300 mb-10">
          Setup is complete. Genassistant is now working behind the scenes to
          reduce distraction, and reclaim your time.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/" passHref>
            <Button
              variant="outline"
              className="w-full sm:w-auto bg-transparent hover:bg-slate-800 text-white border-slate-700 px-8 py-4 text-lg font-semibold rounded-lg shadow-lg btn-enhanced-hover"
            >
              Back to Homepage
            </Button>
          </Link>
          <a href="mailto:support@genassistant.ai">
            <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg btn-enhanced-hover">
              <Mail className="mr-2 h-5 w-5" /> Contact Support
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}

export default function ConnectedPage() {
    return (
        <Suspense fallback={<div className="bg-gray-900 min-h-screen"></div>}>
            <ConnectedPageComponent />
        </Suspense>
    )
}