export function MarroFeaturesSection() {
  const features = [
    {
      title: "Branded Client Portals",
      tagline: "Your brand, your clients, your experience.",
      bullets: ["Custom logo, colors, and domain per client.", "Central hub for AI agents, files, and updates."],
    },
    {
      title: "Smart Client Onboarding",
      tagline: "Onboard clients in minutes, not weeks.",
      bullets: ["Automated intake forms and guided setup.", "Onboarding funnels with client-specific steps."],
    },
    {
      title: "Proposals & Contracts",
      tagline: "Close deals faster with built-in e-signatures.",
      bullets: ["Pre-built templates for AI services.", "E-signature integration for instant closure."],
    },
    {
      title: "ROI Analytics & Reporting",
      tagline: "Show value, not just work.",
      bullets: ["Track usage, revenue impact, and cost savings.", "Export polished, client-ready reports."],
    },
  ]

  return (
    <section className="px-6 py-16 md:py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Core Features (MVP)</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground italic">{feature.tagline}</p>
              <ul className="space-y-2">
                {feature.bullets.map((bullet, bulletIndex) => (
                  <li key={bulletIndex} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-foreground">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
