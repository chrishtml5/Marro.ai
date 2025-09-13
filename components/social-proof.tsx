"use client"
import Image from "next/image"

export function SocialProof() {
  return (
    <section className="self-stretch py-16 flex flex-col justify-center items-center gap-6 overflow-hidden">
      <div className="text-center text-gray-300 text-sm font-medium leading-tight">
        Trusted by fast-growing startups
      </div>
      <div className="self-stretch grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
        {Array.from({ length: 8 }).map((_, i) => (
          <Image
            key={i}
            src={`/logos/logo0${i + 1}.svg`}
            alt={`Company Logo ${i + 1}`}
            width={400}
            height={120}
            className="w-full max-w-[400px] h-auto object-contain grayscale opacity-70 select-none pointer-events-none"
            draggable={false}
            style={{ userSelect: "none", WebkitUserDrag: "none" }}
            priority={i < 4} // Added priority loading for first 4 social proof logos (above fold)
          />
        ))}
      </div>
    </section>
  )
}
