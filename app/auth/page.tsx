"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/utils/supabase/client"
import { supabaseHelpers } from "@/lib/supabase-helpers"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [checking, setChecking] = useState(true)
  const router = useRouter()

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
      
      // Sign up with Supabase Auth
      const fullName = `${firstName} ${lastName}`.trim()
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            name: fullName,
            first_name: firstName,
            last_name: lastName,
          }
        }
      })

      if (authError) {
        setError(authError.message)
        return
      }

      if (authData.user) {
        // Clear any old localStorage data
        const keysToRemove = [
          'userProfile', 'profileData', 'clients', 'projects', 
          'timelines', 'documents', 'loginState'
        ]
        keysToRemove.forEach(key => localStorage.removeItem(key))

        // Don't create profile yet - wait for email confirmation
        // Profile will be created after email is confirmed
        
        // Redirect to email confirmation page
        router.push("/confirm-email")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Column - Sign Up Form */}
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
              <CardTitle className="text-2xl">Create an account</CardTitle>
              <CardDescription>Get started with your free Marro account</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      placeholder="Christian"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="border-gray-200 focus:border-[#FC4503] focus:ring-[#FC4503]/20 shadow-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      placeholder="Garcia"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="border-gray-200 focus:border-[#FC4503] focus:ring-[#FC4503]/20 shadow-sm"
                    />
                  </div>
                </div>
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
                <Button
                  type="submit"
                  className="w-full bg-[#FC4503]/90 hover:bg-[#FC4503] text-white backdrop-blur-sm border border-white/20 shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
              </form>
              <div className="mt-4 text-center text-sm">
                <span className="text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="text-[#FC4503] hover:underline">
                    Sign in
                  </Link>
                </span>
              </div>
              <div className="mt-2 text-center text-sm">
                <span className="text-muted-foreground">
                  By signing up, you agree to our{" "}
                  <Link href="/terms" className="text-[#FC4503] hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-[#FC4503] hover:underline">
                    Privacy Policy
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
