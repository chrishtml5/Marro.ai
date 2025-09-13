"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { supabaseHelpers } from "@/lib/supabase-helpers"
import { HeroSection } from "@/components/hero-section"
import { BentoSection } from "@/components/bento-section"
import { SocialProof } from "@/components/social-proof"
import { TestimonialGridSection } from "@/components/testimonial-grid-section"
import { LargeTestimonial } from "@/components/large-testimonial"
import { PricingSection } from "@/components/pricing-section"
import { FooterSection } from "@/components/footer-section"

export default function LandingPage() {
  const [checking, setChecking] = useState(true)
  const router = useRouter()

  // Security: Auto-logout users who navigate back to homepage
  useEffect(() => {
    const checkAndLogout = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          console.log("User found on homepage, logging out for security")
          // Auto-logout for security
          await supabaseHelpers.logout()
          return
        }
      } catch (error) {
        console.error("Homepage auth check error:", error)
      } finally {
        setChecking(false)
      }
    }

    checkAndLogout()
  }, [])

  // Show loading while checking/logging out
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-muted-foreground">Checking authentication...</div>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <SocialProof />
      <BentoSection />
      <TestimonialGridSection />
      <LargeTestimonial />
      <PricingSection />
      <FooterSection />
    </div>
  )
}
