"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from "@/utils/supabase/client"
import { supabaseHelpers } from "@/lib/supabase-helpers"

interface ProfileData {
  name: string
  email: string
  company: string | null
  profilePicture: string | null
}

interface ProfileContextType {
  profileData: ProfileData | null
  loading: boolean
  error: string | null
  refreshProfile: () => Promise<void>
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadUserProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      
      let user = await supabaseHelpers.getUser()
      
      // If no user profile exists in database, create one from auth user
      if (!user) {
        const supabase = createClient()
        const { data: { user: authUser } } = await supabase.auth.getUser()
        
        if (authUser) {
          const userName = authUser.user_metadata?.full_name || 
                         authUser.user_metadata?.name || 
                         authUser.email?.split('@')[0] || 
                         "User"
          
          try {
            user = await supabaseHelpers.createUserProfile({
              email: authUser.email || "",
              name: userName,
              plan: "free",
            })
            console.log("User profile created successfully")
          } catch (createError) {
            console.error("Error creating user profile:", createError)
            setError("Failed to create user profile")
            return
          }
        }
      }
      
      if (user) {
        setProfileData({
          name: user.name || user.email || "User",
          email: user.email || "",
          company: user.company || null,
          profilePicture: user.profile_picture || null,
        })
      } else {
        setError("Failed to load user profile")
      }
    } catch (err) {
      console.error("Error loading user profile:", err)
      setError("Failed to load user profile")
    } finally {
      setLoading(false)
    }
  }

  const refreshProfile = async () => {
    await loadUserProfile()
  }

  useEffect(() => {
    loadUserProfile()
  }, [])

  return (
    <ProfileContext.Provider value={{ profileData, loading, error, refreshProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}
