"use client"

import { useEffect, useState, useRef, FormEvent } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import gregAllenImage from "../public/greg-allen.JPG"
import hannahJImage from "../public/hannah-j.JPEG"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Mail,
  Clock,
  Brain,
  PenTool,
  ChevronRight,
  Shield,
  Zap,
  BarChart3,
  CheckCircle,
  Puzzle,
  X,
} from "lucide-react"
import OrbBackground from "./components/orb-background"

export default function LandingPage() {
  const [showFixedCTA, setShowFixedCTA] = useState(false)
  const [showLoadingShimmer, setShowLoadingShimmer] = useState(true)
  const [showOtherChallenge, setShowOtherChallenge] = useState(false)
  const ctaButtonRef = useRef<HTMLButtonElement>(null)
  const contactFormRef = useRef<HTMLElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedIssues, setSelectedIssues] = useState<string[]>([])
  const [emailProvider, setEmailProvider] = useState<string>("")
  const [teamSize, setTeamSize] = useState<string>("")
  const [emailVolume, setEmailVolume] = useState<string>("")
  const router = useRouter()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const form = event.currentTarget
    const formData = new FormData(form)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const role = formData.get("role") as string
    const otherChallenge = formData.get("challenge-other-text") as string

    const issues = [...selectedIssues]
    if (showOtherChallenge) {
      if (!otherChallenge) {
        setError("Please specify your biggest challenge when 'Other' is selected.")
        setIsSubmitting(false)
        return
      }
      // Add "Other" to the list of issues so the backend knows it was selected.
      if (!issues.includes("other")) {
        issues.push("other")
      }
    }

    if (issues.length === 0) {
      setError("Please select at least one issue.")
      setIsSubmitting(false)
      return
    }

    const data = {
      name,
      email,
      role,
      emailProvider,
      teamSize,
      emailVolume,
      issues, // Corrected from pain_points to issues
      otherChallenge: showOtherChallenge ? otherChallenge : undefined,
    }

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.message || "An unknown error occurred.")
      }

      router.push("/submitted")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Loading shimmer effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoadingShimmer(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  // Fixed CTA visibility based on scroll
  useEffect(() => {
    const throttle = (func: () => void, limit: number) => {
      let inThrottle: boolean
      return function (this: any) {
        const args = arguments
        const context = this
        if (!inThrottle) {
          func.apply(context)
          inThrottle = true
          setTimeout(() => (inThrottle = false), limit)
        }
      }
    }

    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      setShowFixedCTA(scrollY > windowHeight * 0.5)
    }

    const throttledScrollHandler = throttle(handleScroll, 500)

    window.addEventListener("scroll", throttledScrollHandler)
    return () => window.removeEventListener("scroll", throttledScrollHandler)
  }, [])

  // Intersection Observer for fade-in animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
          }
        })
      },
      { threshold: 0.1 },
    )

    const fadeElements = document.querySelectorAll(".fade-in-up")
    fadeElements.forEach((el) => observer.observe(el))

    return () => {
      fadeElements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Loading Shimmer */}
      {showLoadingShimmer && <div className="loading-shimmer" />}

      {/* Fixed CTA Button */}
      {showFixedCTA && (
        <div className="fixed-cta">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg btn-enhanced-hover"
            onClick={() => contactFormRef.current?.scrollIntoView({ behavior: "smooth" })}
          >
            Request Free Access
          </Button>
        </div>
      )}

      {/* New Value-Driven Hero Section */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8 hero-background text-white">
        {/* Ambient Data Ripple Background */}
        <div className="data-ripple-container">
          <div className="data-ripple"></div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 to-slate-800/60 z-10"></div>

        <div className="mx-auto max-w-4xl text-center relative z-20">
          {/* Microtagline */}
          <div className="mb-6">
            <span className="text-sm font-medium text-blue-300/80 tracking-wide uppercase">Impact &gt; Inbox</span>
          </div>

          {/* Main Headline */}
          <div className="mb-8">
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl leading-tight">
              <span className="hero-text-shimmer">Rescue 5 hours</span>
              <span className="block text-blue-400">a week from email.</span>
            </h1>
          </div>

          {/* Subheadline */}
          <p className="mx-auto max-w-3xl text-xl text-slate-200 leading-relaxed mb-12">
            Summarizes your inbox. Drafts replies in your voice. Delivers twice-daily digests.
            <span className="block mt-2 text-lg text-slate-300">
              Keeps you in control of everything. Enterprise-ready. Zero install. Zero friction.
            </span>
          </p>

          {/* Primary CTA */}
          <div className="mt-10">
            <Button
              ref={ctaButtonRef}
              size="lg"
              className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 text-lg font-semibold rounded-lg shadow-lg proximity-glow-btn"
              onClick={() => contactFormRef.current?.scrollIntoView({ behavior: "smooth" })}
            >
              Request Free Access <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      <div className="section-divider"></div>

      {/* Benefits Section */}
      <section id="benefits-section" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center fade-in-up">
              <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 gentle-pulse icon-background">
                <Clock className="w-8 h-8 icon-hover icon-color" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">🏃 Save Time</h3>
              <p className="text-slate-600">Cut email triage time by up to 70%.</p>
            </div>
            <div className="text-center fade-in-up" style={{ transitionDelay: "200ms" }}>
              <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 gentle-pulse icon-background">
                <Brain className="w-8 h-8 icon-hover icon-color" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">🧠 Stay Focused</h3>
              <p className="text-slate-600">Batch communication and eliminate interruptions.</p>
            </div>
            <div className="text-center fade-in-up" style={{ transitionDelay: "400ms" }}>
              <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 gentle-pulse icon-background">
                <PenTool className="w-8 h-8 icon-hover icon-color" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">✍️ Better Replies</h3>
              <p className="text-slate-600">Drafts that match your tone and context.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider"></div>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <OrbBackground />
        {/* Add a subtle backdrop to ensure text readability */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[0.5px] z-5"></div>
        <div className="mx-auto max-w-4xl relative z-10">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-slate-200">Three simple steps to transform your inbox</p>
          </div>
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-center gap-8 fade-in-up">
              <div className="flex-shrink-0 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold gentle-pulse">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Classify & Summarize</h3>
                <p className="text-slate-200">
                  Genassistant classifies and summarizes your emails, identifying what needs your attention and what can
                  be handled automatically.
                </p>
              </div>
            </div>
            <div
              className="flex flex-col md:flex-row items-center gap-8 fade-in-up"
              style={{ transitionDelay: "200ms" }}
            >
              <div className="flex-shrink-0 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold gentle-pulse">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Draft Quality Replies</h3>
                <p className="text-slate-200">
                  It drafts high-quality replies that match your tone and context, placing them directly in your Outlook
                  Drafts folder for review.
                </p>
              </div>
            </div>
            <div
              className="flex flex-col md:flex-row items-center gap-8 fade-in-up"
              style={{ transitionDelay: "400ms" }}
            >
              <div className="flex-shrink-0 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold gentle-pulse">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Daily Digests</h3>
                <p className="text-slate-200">
                  You review only what matters in one or two daily digests, keeping you informed without the constant
                  interruption.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider"></div>

      <div className="section-divider"></div>

      {/* Sample Digest Preview - Enhanced with extra padding */}
      <section id="morning-digest-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Your Morning Digest</h2>
            <p className="text-xl text-slate-600">See what your morning would look like with Genassistant</p>
          </div>
          <div className="mt-8">
            <Card
              className="max-w-2xl mx-auto shadow-lg border-0 fade-in-up digest-card"
              style={{ transitionDelay: "200ms" }}
            >
              <CardHeader className="bg-slate-800 text-white border-b border-slate-700 pt-8">
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-400" />
                  Daily Email Digest - March 15, 2025
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Good morning! Here's what happened in your inbox overnight.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4 bg-slate-900 text-white">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-sm text-slate-400">7:30 AM</div>
                  <div className="text-sm font-medium text-green-400 flex items-center">
                    <Clock className="w-4 h-4 mr-1" /> Time saved: 42 minutes
                  </div>
                </div>

                <div className="border-l-4 border-green-500 pl-4 bg-slate-800/50 p-3 rounded-r">
                  <h4 className="font-semibold text-white">✅ Handled Automatically (83 emails)</h4>
                  <p className="text-sm text-slate-300">
                    Meeting confirmations, newsletter subscriptions, and routine updates processed.
                  </p>
                  <div className="mt-2 text-xs text-slate-400">
                    <span className="inline-block bg-slate-700 rounded px-2 py-1 mr-1 mb-1">23 newsletters</span>
                    <span className="inline-block bg-slate-700 rounded px-2 py-1 mr-1 mb-1">18 notifications</span>
                    <span className="inline-block bg-slate-700 rounded px-2 py-1 mr-1 mb-1">27 marketing emails</span>
                    <span className="inline-block bg-slate-700 rounded px-2 py-1 mr-1 mb-1">15 system alerts</span>
                  </div>
                </div>

                <div className="border-l-4 border-yellow-500 pl-4 bg-slate-800/50 p-3 rounded-r">
                  <h4 className="font-semibold text-white">📝 Drafts Ready for Review (8 emails)</h4>
                  <p className="text-sm text-slate-300">All drafted and waiting in your Outlook:</p>
                  <ul className="mt-2 text-xs text-slate-300 space-y-1">
                    <li>• Client proposal response (Priority: High)</li>
                    <li>• Partnership request from TechCorp (Priority: High)</li>
                    <li>• Conference speaking opportunity (Priority: Medium)</li>
                    <li>• Team meeting follow-up (Priority: Medium)</li>
                    <li>• Vendor inquiry response (Priority: Medium)</li>
                    <li>• + 3 more routine responses</li>
                  </ul>
                </div>

                <div className="border-l-4 border-red-500 pl-4 bg-slate-800/50 p-3 rounded-r">
                  <h4 className="font-semibold text-white">🚨 Needs Your Attention (3 emails)</h4>
                  <p className="text-sm text-slate-300">
                    Urgent client escalation, board meeting agenda approval, and a personal message from the CEO.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <div className="section-divider"></div>

      {/* New Enterprise Section */}
      <section id="enterprise-section" className="py-20 px-4 sm:px-6 lg:px-8 enterprise-bg text-white">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16 fade-in-up">
            <h2 className="text-3xl font-bold text-white mb-4">Built for Enterprise, Ready for Teams</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Mobile view: A single column containing icons then text. Only visible below md. */}
            <div className="md:hidden fade-in-up">
              <div className="space-y-4 mb-6">
                {/* Mobile Icons */}
                <div className="flex items-center gap-3 min-h-14">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <span className="text-slate-200">Human-in-the-loop control</span>
                </div>
                <div className="flex items-center gap-3 min-h-14">
                  <Shield className="w-6 h-6 text-blue-400 flex-shrink-0" />
                  <span className="text-slate-200">Privacy and security first. You own your data.</span>
                </div>
                <div className="flex items-center gap-3 min-h-14">
                  <Puzzle className="w-6 h-6 text-orange-400 flex-shrink-0" />
                  <span className="text-slate-200">Nothing to install, nothing to learn, nothing to change.</span>
                </div>
                <div className="flex items-center gap-3 min-h-14">
                  <Brain className="w-6 h-6 text-purple-400 flex-shrink-0" />
                  <span className="text-slate-200">Writes intelligent replies that adapt to tone and context</span>
                </div>
                <div className="flex items-center gap-3 min-h-14">
                  <Zap className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                  <span className="text-slate-200">Fast, reliable, enterprise-ready</span>
                </div>
                <div className="flex items-center gap-3 min-h-14">
                  <BarChart3 className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <span className="text-slate-200">Metrics on time saved to track ROI</span>
                </div>
              </div>
              <p className="text-lg text-slate-200 leading-relaxed">
                Works with your inbox. Saves your team over 5 hours per inbox each week. No install. No new app. No new
                buttons. It just works.
              </p>
            </div>

            {/* Desktop view: two columns. Only visible on md and up. */}
            {/* Column 1: Text */}
            <div className="hidden md:block fade-in-up">
              <div className="space-y-6">
                <p className="text-lg text-slate-200 leading-relaxed">
                  Genassistant saves over 5 hours per inbox each week by eliminating friction — reducing interruptions,
                  summarizing your inbox, and drafting replies in your team’s voice.
                </p>
                <p className="text-lg text-slate-200 leading-relaxed">
                  Enterprise-ready and secure. No install. No new app. No new buttons to learn. It just works.
                </p>
              </div>
            </div>
            {/* Column 2: Icons */}
            <div className="hidden md:block fade-in-up" style={{ transitionDelay: "200ms" }}>
              <div className="space-y-4">
                <div className="flex items-center gap-3 min-h-14">
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <span className="text-slate-200">Human-in-the-loop control</span>
                </div>
                <div className="flex items-center gap-3 min-h-14">
                  <Shield className="w-6 h-6 text-blue-400 flex-shrink-0" />
                  <span className="text-slate-200">Privacy and security first. You own your data.</span>
                </div>
                <div className="flex items-center gap-3 min-h-14">
                  <Puzzle className="w-6 h-6 text-orange-400 flex-shrink-0" />
                  <span className="text-slate-200">Nothing to install, nothing to learn, nothing to change.</span>
                </div>
                <div className="flex items-center gap-3 min-h-14">
                  <Brain className="w-6 h-6 text-purple-400 flex-shrink-0" />
                  <span className="text-slate-200">Writes intelligent replies that adapt to tone and context</span>
                </div>
                <div className="flex items-center gap-3 min-h-14">
                  <Zap className="w-6 h-6 text-yellow-400 flex-shrink-0" />
                  <span className="text-slate-200">Fast, reliable, enterprise-ready</span>
                </div>
                <div className="flex items-center gap-3 min-h-14">
                  <BarChart3 className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <span className="text-slate-200">Metrics on time saved to track ROI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider"></div>

      {/* Testimonial Section */}
      <section id="testimonial-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-blue-50">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md fade-in-up">
              <blockquote className="text-xl font-medium text-slate-900 mb-6">
                "Email was taking me away from my primary duties. Genassistant has been a tremendous time saver."
              </blockquote>
              <div className="flex items-center">
                <Image
                  src={gregAllenImage}
                  alt="Greg Allen"
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <p className="font-semibold text-slate-900">Greg Allen</p>
                  <p className="text-slate-600">Hospital Chief of Staff</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md fade-in-up" style={{ transitionDelay: "200ms" }}>
              <blockquote className="text-xl font-medium text-slate-900 mb-6">
                "It just makes running a business smoother. I love the privacy, automation, and how it keeps everything
                organized."
              </blockquote>
              <div className="flex items-center">
                <Image
                  src={hannahJImage}
                  alt="Hannah J."
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <p className="font-semibold text-slate-900">Hannah J.</p>
                  <p className="text-slate-600">Business Owner, Juniper</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider"></div>

      {/* Contact Form Section - Enhanced with new field */}
      <section ref={contactFormRef} id="contact-form" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-12 fade-in-up">
            <h2 className="text-3xl font-bold text-blue-400 mb-4">Request Free Access</h2>
            <p className="text-xl text-slate-600">
              See what you and your team can do with an extra 5 hours each week
            </p>
          </div>
          <Card className="shadow-lg border-0 fade-in-up contact-form-card" style={{ transitionDelay: "200ms" }}>
            <CardContent className="p-8">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input id="name" name="name" type="text" required className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" name="email" type="email" required className="mt-1" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="role">Role/Title</Label>
                    <Input id="role" name="role" type="text" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="emailProvider">Email Provider *</Label>
                    <Select required name="emailProvider" onValueChange={setEmailProvider}>
                      <SelectTrigger id="emailProvider" className="mt-1">
                        <SelectValue placeholder="Select your email provider" />
                      </SelectTrigger>
                      <SelectContent className="select-content-dark">
                        <SelectItem value="outlook" className="select-item-dark">Outlook</SelectItem>
                        <SelectItem value="gmail" className="select-item-dark">Gmail</SelectItem>
                        <SelectItem value="google-workspace" className="select-item-dark">Google Workspace</SelectItem>
                        <SelectItem value="yahoo" className="select-item-dark">Yahoo</SelectItem>
                        <SelectItem value="zoho" className="select-item-dark">Zoho</SelectItem>
                        <SelectItem value="protonmail" className="select-item-dark">ProtonMail</SelectItem>
                        <SelectItem value="other" className="select-item-dark">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="teamSize">Team Size *</Label>
                    <Select required name="teamSize" onValueChange={setTeamSize}>
                      <SelectTrigger id="teamSize" className="mt-1">
                        <SelectValue placeholder="Select team size" />
                      </SelectTrigger>
                      <SelectContent className="select-content-dark">
                        <SelectItem value="personal" className="select-item-dark">Personal (1)</SelectItem>
                        <SelectItem value="2-10" className="select-item-dark">2–10</SelectItem>
                        <SelectItem value="11-50" className="select-item-dark">11–50</SelectItem>
                        <SelectItem value="51-100" className="select-item-dark">51–100</SelectItem>
                        <SelectItem value="101-200" className="select-item-dark">101–200</SelectItem>
                        <SelectItem value="201-300" className="select-item-dark">201–300</SelectItem>
                        <SelectItem value="300+" className="select-item-dark">300+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="emailVolume">Email volume on a heavy day *</Label>
                    <Select required name="emailVolume" onValueChange={setEmailVolume}>
                      <SelectTrigger id="emailVolume" className="mt-1">
                        <SelectValue placeholder="Select email volume" />
                      </SelectTrigger>
                      <SelectContent className="select-content-dark">
                        <SelectItem value="10-24" className="select-item-dark">10–24</SelectItem>
                        <SelectItem value="25-49" className="select-item-dark">25–49</SelectItem>
                        <SelectItem value="50-74" className="select-item-dark">50–74</SelectItem>
                        <SelectItem value="75-99" className="select-item-dark">75–99</SelectItem>
                        <SelectItem value="100-149" className="select-item-dark">100–149</SelectItem>
                        <SelectItem value="150+" className="select-item-dark">150+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="col-span-1 md:col-span-2">
                  <Label id="checkbox-group-label">
                    Which of the following have been an issue in the last month? (select all that apply) *
                  </Label>
                  <div
                    role="group"
                    aria-labelledby="checkbox-group-label"
                    className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2"
                  >
                    {[
                      "Inbox anxiety",
                      "Too many emails",
                      "Constant distractions",
                      "Drains my focus and energy",
                      "Hard to start or finish replies",
                      "Important emails get buried",
                      "Miss follow-ups or deadlines",
                      "Feel behind or overwhelmed",
                      "Email feels like a second job",
                    ].map((item) => {
                      const id = item.toLowerCase().replace(/\s+/g, "-")
                      return (
                        <div key={id} className="flex items-center gap-2">
                          <Checkbox
                            id={id}
                            name="challenges"
                            value={id}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedIssues((prev) => [...prev, id])
                              } else {
                                setSelectedIssues((prev) => prev.filter((issueId) => issueId !== id))
                              }
                            }}
                          />
                          <Label htmlFor={id} className="font-normal">
                            {item}
                          </Label>
                        </div>
                      )
                    })}
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="challenge-other-checkbox"
                        onCheckedChange={(checked) => {
                          setShowOtherChallenge(!!checked)
                          if (checked) {
                            setSelectedIssues((prev) => [...prev, "other"])
                          } else {
                            setSelectedIssues((prev) => prev.filter((issueId) => issueId !== "other"))
                          }
                        }}
                      />
                      <Label htmlFor="challenge-other-checkbox" className="font-bold">
                        Other
                      </Label>
                    </div>
                  </div>
                  {showOtherChallenge && (
                    <div className="mt-2">
                      <Label htmlFor="challenge-other-text">Please specify your biggest challenge...</Label>
                      <Textarea
                        id="challenge-other-text"
                        name="challenge-other-text"
                        rows={3}
                        className="mt-1"
                        required={showOtherChallenge}
                      />
                    </div>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 text-lg font-semibold btn-enhanced-hover"
                >
                  {isSubmitting ? "Submitting..." : "Request Free Access"}
                </Button>
                {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
                <p className="text-center text-xs text-slate-500 px-4">
                  Privacy first. We’ll never sell or share your information. That’s a promise.
                </p>
                <p className="text-center text-sm text-slate-500">
                  Genassistant is currently free, but infrastructure and AI hosting are not. Access capped by capacity.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer - Enhanced with disclaimer */}
      <div className="bg-[#27305C] pb-28 md:pb-0">
        <footer className="text-white py-6 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 text-center md:mb-0 md:text-left">
                <h3 className="text-2xl font-bold text-white mb-2">Genassistant</h3>
                <p className="text-slate-400">Your AI Executive Assistant for Email</p>
              </div>
              <div className="flex flex-col items-center gap-4">
                <a
                  href="mailto:support@genassistant.ai"
                  className="text-slate-400 hover:text-white flex items-center gap-2 hover:underline transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  support@genassistant.ai
                </a>
              </div>
            </div>
            <div className="border-t border-slate-800 mt-6 pt-6 text-center space-y-2">
              <p className="text-slate-400">© 2025 Genassistant. All rights reserved.</p>
              <p className="text-xs text-slate-500">
                Genassistant is not affiliated with Microsoft, Google, or any email providers. It integrates securely to work directly with your existing tools.
              </p>
              <p className="text-xs text-slate-600 mt-4 max-w-4xl mx-auto">
                Note: Time saved estimates factor in average reading and writing speeds, typical daily email volumes, and reduced time lost to context switching and distractions.
Actual savings vary by workflow and volume. Users with high email loads and strong habits may see even greater gains.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
