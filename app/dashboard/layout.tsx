import { ProfileProvider } from "@/contexts/ProfileContext"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProfileProvider>
      {children}
    </ProfileProvider>
  )
}
