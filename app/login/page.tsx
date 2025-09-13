"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/utils/supabase/client"
import { supabaseHelpers } from "@/lib/supabase-helpers"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [checking, setChecking] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const logoutReason = searchParams.get('logout')

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user && user.email_confirmed_at) {
          console.log("User already authenticated, redirecting to dashboard")
          router.push("/dashboard")
          return
        }
      } catch (error) {
        console.error("Auth check error:", error)
      } finally {
        setChecking(false)
      }
    }

    checkAuth()
  }, [router])

  // Show loading while checking auth
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-muted-foreground">Checking authentication...</div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const supabase = createClient()
      
      console.log("Attempting login with:", email)
      
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log("Auth response:", { data: data?.user?.id, error: authError?.message })

      if (authError) {
        console.error("Auth error:", authError)
        setError(authError.message)
        setIsLoading(false)
        return
      }

      if (!data.user) {
        setError("Login failed - no user data received")
        setIsLoading(false)
        return
      }

      // Clear any old localStorage data
      const keysToRemove = [
        'userProfile', 'profileData', 'clients', 'projects', 
        'timelines', 'documents', 'loginState'
      ]
      keysToRemove.forEach(key => localStorage.removeItem(key))

      // Check if email is confirmed
      if (!data.user.email_confirmed_at) {
        console.log("Email not confirmed, redirecting...")
        setError("Please confirm your email address before signing in.")
        // Sign out the user since they're not confirmed
        await supabase.auth.signOut()
        router.push("/confirm-email")
        setIsLoading(false)
        return
      }

      console.log("Login successful, user confirmed")

      // Don't try to create profile here - let the dashboard handle it
      // This prevents login from failing due to profile creation issues
      
      // Small delay to ensure auth state is set
      setTimeout(() => {
        router.push("/dashboard")
      }, 100)

    } catch (err) {
      console.error("Login error:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Column - Login Form */}
      <div className="flex items-center justify-center p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          {/* Logo */}
          <div className="flex items-center gap-1 mb-8">
            <Image
              src="/images/marro-logo-black.png"
              alt="Marro"
              width={48}
              height={48}
              className="w-12 h-12 select-none pointer-events-none"
              draggable={false}
              style={{ userSelect: "none", WebkitUserDrag: "none" } as React.CSSProperties}
            />
            <span className="text-2xl font-bold text-foreground">Marro</span>
          </div>

          <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <CardDescription>Sign in to your Marro account</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              {logoutReason === 'security' && (
                <div className="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-3 rounded mb-4">
                  <strong>Security Logout:</strong> You were automatically logged out for security reasons. Please sign in again.
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="christian@marro.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-gray-200 focus:border-[#FC4503] focus:ring-[#FC4503]/20 shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-gray-200 focus:border-[#FC4503] focus:ring-[#FC4503]/20 shadow-sm"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Link href="/forgot-password" className="text-sm text-[#FC4503] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#FC4503]/90 hover:bg-[#FC4503] text-white backdrop-blur-sm border border-white/20 shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
              <div className="mt-4 text-center text-sm">
                <span className="text-muted-foreground">
                  Don't have an account?{" "}
                  <Link href="/auth" className="text-[#FC4503] hover:underline">
                    Sign up
                  </Link>
                </span>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-muted-foreground">
            <Link href="/" className="text-[#FC4503] hover:underline">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column - Orange Background with Dashboard Image */}
      <div className="hidden lg:flex items-center justify-center p-12" style={{ backgroundColor: "#FC4503" }}>
        <div className="max-w-2xl w-full relative">
          <Image
            src="/images/auth-dashboard.png"
            alt="Marro Dashboard Interface"
            width={800}
            height={600}
            className="w-full h-auto object-contain rounded-lg select-none pointer-events-none"
            priority
            draggable={false}
            style={{ userSelect: "none", WebkitUserDrag: "none" } as React.CSSProperties}
          />
        </div>
      </div>
    </div>
  )
}
