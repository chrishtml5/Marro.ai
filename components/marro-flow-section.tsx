export function MarroFlowSection() {
  const steps = [
    {
      number: "01",
      title: "Invite",
      description: "Send branded invitations to clients with custom onboarding flows",
    },
    {
      number: "02",
      title: "Collaborate",
      description: "Work together in real-time with AI agents, file sharing, and progress tracking",
    },
    {
      number: "03",
      title: "Report",
      description: "Generate comprehensive ROI reports showing measurable business impact",
    },
  ]

  return (
    <section className="px-6 py-16 md:py-24 bg-muted/30">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Simple 3-Step Process</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-primary-foreground rounded-full text-xl font-bold mb-4">
              {step.number}
            </div>
            <h3 className="text-2xl font-bold text-foreground">{step.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
