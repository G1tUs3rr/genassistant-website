"use client"

import OrbBackground from "@/app/components/orb-background"
import { useEffect } from "react"

export default function ConnectedPage() {
  useEffect(() => {
    const element = document.querySelector(".fade-in-up")
    if (element) {
      element.classList.add("visible")
    }
  }, [])

  return (
    <div
      id="connected-container"
      className="relative flex flex-col items-center justify-center min-h-screen text-center px-4"
    >
      <OrbBackground containerId="connected-container" />
      <div className="absolute inset-0 bg-white/10 backdrop-blur-[0.5px] "></div>
      <div className="relative z-10 max-w-2xl mx-auto fade-in-up">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 ">
          Connection Successful!
        </h1>
        <p className="text-xl sm:text-2xl text-slate-600 mb-10 ">
          Your Microsoft 365 account has been successfully connected to
          Genassistant. You can now close this window.
        </p>
      </div>
    </div>
  )
}