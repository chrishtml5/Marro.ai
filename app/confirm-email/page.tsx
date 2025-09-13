"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/utils/supabase/client"
import { supabaseHelpers } from "@/lib/supabase-helpers"
import { CheckCircle, Mail, RefreshCw } from "lucide-react"

export default function ConfirmEmailPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [error, setError] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const supabase = createClient()

    // Clear any old localStorage data
    const clearOldData = () => {
      const keysToRemove = [
        'userProfile', 'profileData', 'clients', 'projects', 
        'timelines', 'documents', 'loginState'
      ]
      keysToRemove.forEach(key => localStorage.removeItem(key))
    }

    clearOldData()

    // Check if user is already confirmed
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || "")
        if (user.email_confirmed_at) {
          setIsConfirmed(true)
          // Redirect to dashboard after 2 seconds
          setTimeout(() => {
            router.push("/dashboard")
          }, 2000)
        }
      }
    }

    checkUser()

    // Listen for auth changes (email confirmation)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user.email_confirmed_at) {
        clearOldData() // Clear again on successful sign in
        
        // Create user profile after email confirmation
        try {
          // Try to get the name from user metadata (set during signup)
          const userName = session.user.user_metadata?.full_name || 
                          session.user.user_metadata?.name || 
                          session.user.email?.split('@')[0] || 
                          "User"
          
          await supabaseHelpers.createUserProfile({
            email: session.user.email || "",
            name: userName,
            plan: "free",
          })
          
          console.log("User profile created successfully:", userName)
        } catch (profileError) {
          // Profile might already exist, that's okay
          console.log("Profile creation skipped:", profileError)
        }
        
        setIsConfirmed(true)
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const handleResendConfirmation = async () => {
    if (!userEmail) return
    
    setIsLoading(true)
    setError("")

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: userEmail,
      })

      if (error) {
        setError(error.message)
      } else {
        alert("Confirmation email sent! Please check your inbox.")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (isConfirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={{ background: "linear-gradient(135deg, #FC4503 0%, #FF6B35 100%)" }}>
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl text-green-700">Email Confirmed!</CardTitle>
              <CardDescription>
                Your email has been successfully confirmed. Redirecting to dashboard...
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex justify-center">
                <RefreshCw className="h-6 w-6 animate-spin text-[#FC4503]" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8" style={{ background: "linear-gradient(135deg, #FC4503 0%, #FF6B35 100%)" }}>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        {/* Logo */}
        <div className="flex items-center justify-center gap-1 mb-8">
          <Image
            src="/images/marro-logo.png"
            alt="Marro"
            width={48}
            height={48}
            className="w-12 h-12 select-none pointer-events-none"
            draggable={false}
            style={{ userSelect: "none", WebkitUserDrag: "none" } as React.CSSProperties}
          />
          <span className="text-2xl font-bold text-white">Marro</span>
        </div>

        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <Mail className="h-16 w-16 text-[#FC4503]" />
            </div>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription>
              We've sent a confirmation link to{" "}
              <span className="font-medium text-[#FC4503]">{userEmail}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Click the link in your email to confirm your account and access your dashboard.
              </p>
              
              <div className="space-y-3">
                <Button
                  onClick={handleResendConfirmation}
                  disabled={isLoading || !userEmail}
                  className="w-full bg-[#FC4503]/90 hover:bg-[#FC4503] text-white"
                >
                  {isLoading ? "Sending..." : "Resend Confirmation Email"}
                </Button>
                
                <div className="text-sm text-muted-foreground">
                  <p>Didn't receive the email? Check your spam folder.</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4 text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Wrong email address?{" "}
                <Link href="/auth" className="text-[#FC4503] hover:underline">
                  Sign up again
                </Link>
              </p>
              <p className="text-sm text-muted-foreground">
                Already confirmed?{" "}
                <Link href="/login" className="text-[#FC4503] hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-white/80">
          <Link href="/" className="hover:text-white hover:underline">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
