"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function Header() {
  const navItems = [
    { name: "Features", href: "#features-section" },
    { name: "Pricing", href: "#pricing-section" },
    { name: "Testimonials", href: "#testimonials-section" },
  ]

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.substring(1)
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      const headerHeight = 80
      const elementTop = targetElement.getBoundingClientRect().top + window.pageYOffset
      const offsetTop = elementTop - headerHeight
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      })
    }
  }

  return (
    <header className="w-full py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-1">
            <Image
              src="/images/marro-logo.png"
              alt="Marro"
              width={40}
              height={40}
              className="w-10 h-10 select-none pointer-events-none"
              draggable={false}
              style={{ userSelect: "none", WebkitUserDrag: "none" } as React.CSSProperties}
              priority
            />
            <span className="text-white text-xl font-semibold tracking-tight">Marro</span>
          </Link>
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={(e) => handleScroll(e, item.href)}
                className="text-white/70 hover:text-white px-4 py-2 rounded-full font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button className="bg-white/10 text-white hover:bg-white/20 border border-white/20 px-6 py-2 rounded-full font-medium shadow-sm backdrop-blur-sm transition-all duration-200">
                {"Login"}
              </Button>
            </Link>
            <Link href="/auth">
              <Button
                variant="default"
                className="bg-white/10 text-white hover:bg-white/20 border border-white/20 px-6 py-2 rounded-full font-medium shadow-sm backdrop-blur-sm transition-all duration-200"
              >
                {"Sign up"}
              </Button>
            </Link>
          </div>
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-foreground">
                <Menu className="h-7 w-7" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="bg-background border-t border-border text-foreground">
              <SheetHeader>
                <SheetTitle className="text-left text-xl font-semibold text-foreground">Navigation</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-6">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleScroll(e, item.href)}
                    className="text-[#888888] hover:text-foreground justify-start text-lg py-2"
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="flex gap-3 mt-4">
                  <Link href="/auth" className="flex-1">
                    <Button className="w-full bg-white/10 text-foreground hover:bg-white/20 border border-white/20 px-6 py-2 rounded-full font-medium shadow-sm backdrop-blur-sm">
                      Sign Up
                    </Button>
                  </Link>
                  <Link href="/login" className="flex-1">
                    <Button className="w-full bg-white/10 text-foreground hover:bg-white/20 border border-white/20 px-6 py-2 rounded-full font-medium shadow-sm backdrop-blur-sm">
                      Login
                    </Button>
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
