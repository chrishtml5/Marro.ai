"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Header } from "./header"
import Link from "next/link"

export function HeroSection() {
  return (
    <section
      className="flex flex-col items-center text-center relative mx-auto rounded-2xl overflow-hidden my-6 py-0 px-4
         w-full h-[400px] md:w-[1220px] md:h-[600px] lg:h-[810px] md:px-0"
    >
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          data-webkit-playsinline="true"
          data-x5-playsinline="true"
          data-x5-video-player-type="h5"
          data-x5-video-player-fullscreen="true"
          className="w-full h-full object-cover"
          style={{
            filter: "none",
            transform: "none",
            pointerEvents: "none",
          }}
          ref={(video) => {
            if (video) {
              video.playbackRate = 0.3
              video.controls = false
              video.disablePictureInPicture = true
              video.defaultMuted = true

              const playVideo = async () => {
                try {
                  await video.play()
                } catch (error) {
                  const forcePlay = () => {
                    video.play().catch(() => {})
                    document.removeEventListener("touchstart", forcePlay)
                    document.removeEventListener("click", forcePlay)
                  }
                  document.addEventListener("touchstart", forcePlay, { passive: true })
                  document.addEventListener("click", forcePlay, { passive: true })
                }
              }

              playVideo()

              video.addEventListener("loadeddata", playVideo)
              video.addEventListener("canplay", playVideo)
            }
          }}
          controls={false}
          disablePictureInPicture
        >
          <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/23e17587-a6be-4388-9e27-311afe110008-xNnXNcdAxyM3IcsxD1KOl9N1z0de0D.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 via-black/40 to-orange-800/20" />
      </div>

      <div className="absolute top-0 left-0 right-0 z-20">
        <Header />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 md:px-8 mt-16 md:mt-[120px] lg:mt-[140px] text-center">
        <div className="mb-6">
          <Badge 
            className="px-4 py-2 rounded-full font-medium text-sm shadow-2xl backdrop-blur-md border border-white/30 transition-all duration-300"
            style={{
              backgroundColor: "rgba(252, 69, 3, 0.3)",
              color: "white",
              backdropFilter: "blur(16px)",
            }}
          >
            Now in Beta
          </Badge>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-tight text-white drop-shadow-2xl mb-4 md:mb-6">
          The AI Agency Client OS
        </h1>
        <p className="text-base md:text-lg lg:text-xl font-medium leading-relaxed text-white/95 drop-shadow-lg mb-6 md:mb-8 max-w-2xl mx-auto">
          {"One platform to onboard, manage, and showcase results."}
        </p>

        <div className="pt-4">
          <Link href="/auth">
            <Button
              className="px-8 py-3 rounded-full font-medium text-base shadow-2xl hover:shadow-3xl backdrop-blur-md border border-white/30 hover:border-white/40 transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: "rgba(252, 69, 3, 0.3)",
                color: "white",
                backdropFilter: "blur(16px)",
              }}
            >
              Get Started Free
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
