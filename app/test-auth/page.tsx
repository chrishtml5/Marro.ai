"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestAuthPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const supabase = createClient()
    
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        console.log("Current user:", user)
        setUser(user)
        if (error) setError(error.message)
      } catch (err) {
        console.error("Error getting user:", err)
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change:", event, session?.user?.id)
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const testLogin = async () => {
    const supabase = createClient()
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'christian@marro.ai',
        password: 'test123'
      })
      console.log("Test login result:", { data, error })
      if (error) setError(error.message)
    } catch (err) {
      console.error("Test login error:", err)
      setError(err instanceof Error ? err.message : "Test login failed")
    }
  }

  const testSignOut = async () => {
    const supabase = createClient()
    try {
      const { error } = await supabase.auth.signOut()
      if (error) setError(error.message)
      else setUser(null)
    } catch (err) {
      console.error("Sign out error:", err)
      setError(err instanceof Error ? err.message : "Sign out failed")
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Auth Debug Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div>
            <h3 className="font-semibold mb-2">Current User:</h3>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
              {user ? JSON.stringify({
                id: user.id,
                email: user.email,
                email_confirmed_at: user.email_confirmed_at,
                created_at: user.created_at
              }, null, 2) : "No user logged in"}
            </pre>
          </div>

          <div className="space-x-2">
            <Button onClick={testLogin}>Test Login</Button>
            <Button onClick={testSignOut} variant="outline">Sign Out</Button>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Environment Check:</h3>
            <pre className="bg-gray-100 p-3 rounded text-sm">
              {JSON.stringify({
                hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
                hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
                supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + "..."
              }, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
