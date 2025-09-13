const testimonials = [
  {
    quote:
      "Marro became the hub our clients were asking for. Instead of sending spreadsheets and decks back and forth, they now just log in and everything is there. It cut our client email volume by more than half.",
    name: "Sophia Martinez",
    company: "Beacon Creative",
    role: "Managing Partner",
    initials: "SM",
    type: "large-teal",
  },
  {
    quote:
      "Our design team hated writing weekly status updates. Now clients check the project timeline in Marro and it is clear where things stand. Requests for update emails dropped by seventy percent.",
    name: "Daniel Rossi",
    company: "Ember Studio",
    role: "Creative Director",
    initials: "DR",
    type: "small-dark",
  },
  {
    quote:
      "SEO reports used to take us half a day every month. With Marro, we create them in minutes and clients actually review them. Our account managers save more than ten hours each month.",
    name: "Ethan Chen",
    company: "Slate Digital",
    role: "Head of Operations",
    initials: "EC",
    type: "small-dark",
  },
  {
    quote:
      "Content approvals were always the bottleneck. Marro's review and sign off flow reduced our turnaround time from five days to less than one. That speed has helped us win larger retainers.",
    name: "Priya Kapoor",
    company: "Pulse Media",
    role: "Client Success Director",
    initials: "PK",
    type: "small-dark",
  },
  {
    quote:
      "We are running multiple AI pilots with different clients, and Marro keeps each project organized in its own portal. It is the only reason we have been able to scale to twenty clients without adding another account manager.",
    name: "Amir Rahman",
    company: "Orbit Labs",
    role: "Founder",
    initials: "AR",
    type: "small-dark",
  },
  {
    quote:
      "When a client signs off on a milestone in Marro it happens instantly. That used to take days of back and forth. The e signature feature alone has saved us weeks across all projects.",
    name: "Lena Fischer",
    company: "Forge Development",
    role: "Project Manager",
    initials: "LF",
    type: "large-light",
  },
]

const TestimonialCard = ({ quote, name, company, role, initials, type }) => {
  const isLargeCard = type.startsWith("large")
  const avatarSize = isLargeCard ? 48 : 36
  const avatarBorderRadius = isLargeCard ? "rounded-[41px]" : "rounded-[30.75px]"
  const padding = isLargeCard ? "p-6" : "p-[30px]"

  let cardClasses = `flex flex-col justify-between items-start overflow-hidden rounded-[10px] shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative ${padding}`
  let quoteClasses = ""
  let nameClasses = ""
  let companyClasses = ""
  let backgroundElements = null
  let cardHeight = ""
  const cardWidth = "w-full md:w-[384px]"

  if (type === "large-teal") {
    cardClasses += " bg-[#FC4503]"
    quoteClasses += " text-white text-2xl font-medium leading-8"
    nameClasses += " text-white text-base font-normal leading-6"
    companyClasses += " text-white/60 text-base font-normal leading-6"
    cardHeight = "h-[502px]"
    backgroundElements = (
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/large-card-background.svg')", zIndex: 0 }}
      />
    )
  } else if (type === "large-light") {
    cardClasses += " bg-[rgba(231,236,235,0.12)]"
    quoteClasses += " text-foreground text-2xl font-medium leading-8"
    nameClasses += " text-foreground text-base font-normal leading-6"
    companyClasses += " text-muted-foreground text-base font-normal leading-6"
    cardHeight = "h-[502px]"
    backgroundElements = (
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: "url('/images/large-card-background.svg')", zIndex: 0 }}
      />
    )
  } else {
    cardClasses += " bg-card outline outline-1 outline-border outline-offset-[-1px]"
    quoteClasses += " text-foreground/80 text-[17px] font-normal leading-6"
    nameClasses += " text-foreground text-sm font-normal leading-[22px]"
    companyClasses += " text-muted-foreground text-sm font-normal leading-[22px]"
    cardHeight = "h-[244px]"
  }

  return (
    <div className={`${cardClasses} ${cardWidth} ${cardHeight}`}>
      {backgroundElements}
      <div className={`relative z-10 font-normal break-words ${quoteClasses}`}>{quote}</div>
      <div className="relative z-10 flex justify-start items-center gap-3">
        <div
          className={`flex items-center justify-center ${avatarBorderRadius} bg-gray-200 text-gray-700 font-medium`}
          style={{
            width: avatarSize,
            height: avatarSize,
            fontSize: isLargeCard ? "18px" : "14px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
          }}
        >
          {initials}
        </div>
        <div className="flex flex-col justify-start items-start gap-0.5">
          <div className={nameClasses}>{name}</div>
          <div className={companyClasses}>
            {role} at {company}
          </div>
        </div>
      </div>
    </div>
  )
}

export function TestimonialGridSection() {
  return (
    <section
      id="testimonials-section"
      className="w-full px-5 overflow-hidden flex flex-col justify-start py-6 md:py-8 lg:py-14 bg-gradient-to-b from-white to-gray-50/20"
    >
      <div className="self-stretch py-6 md:py-8 lg:py-14 flex flex-col justify-center items-center gap-2">
        <div className="flex flex-col justify-start items-center gap-4">
          <h2 className="text-center text-foreground text-3xl md:text-4xl lg:text-[40px] font-semibold leading-tight md:leading-tight lg:leading-[40px]">
            Client work made effortless
          </h2>
          <p className="self-stretch text-center text-muted-foreground text-sm md:text-sm lg:text-base font-medium leading-[18.20px] md:leading-relaxed lg:leading-relaxed">
            {"Hear how agencies onboard faster, collaborate seamlessly,"} <br />{" "}
            {"and show results with confidence using Marro's client OS"}
          </p>
        </div>
      </div>
      <div className="w-full pt-0.5 pb-4 md:pb-6 lg:pb-10 flex flex-col md:flex-row justify-center items-start gap-4 md:gap-4 lg:gap-6 max-w-[1100px] mx-auto">
        <div className="flex-1 flex flex-col justify-start items-start gap-4 md:gap-4 lg:gap-6">
          <TestimonialCard {...testimonials[0]} />
          <TestimonialCard {...testimonials[1]} />
        </div>
        <div className="flex-1 flex flex-col justify-start items-start gap-4 md:gap-4 lg:gap-6">
          <TestimonialCard {...testimonials[2]} />
          <TestimonialCard {...testimonials[3]} />
        </div>
        <div className="flex-1 flex flex-col justify-start items-start gap-4 md:gap-4 lg:gap-6">
          <TestimonialCard {...testimonials[4]} />
          <TestimonialCard {...testimonials[5]} />
        </div>
      </div>
    </section>
  )
}
