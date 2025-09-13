import { Button } from "@/components/ui/button"

export function MarroPricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for getting started",
      features: ["1 client portal", "Basic onboarding", "Email support", "Core reporting"],
      cta: "Start Free",
      popular: false,
    },
    {
      name: "Team",
      price: "$49/mo",
      description: "For growing agencies",
      features: ["5 client portals", "Advanced onboarding", "Priority support", "Custom branding", "ROI analytics"],
      cta: "Start Free",
      popular: true,
    },
    {
      name: "Agency",
      price: "Custom",
      description: "For enterprise teams",
      features: [
        "Unlimited portals",
        "White-label solution",
        "Dedicated support",
        "Custom integrations",
        "Advanced analytics",
      ],
      cta: "Talk to Sales",
      popular: false,
    },
  ]

  return (
    <section className="px-6 py-16 md:py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Pricing</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`bg-card border rounded-2xl p-8 shadow-sm relative ${plan.popular ? "border-primary shadow-lg scale-105" : "border-border"}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center space-y-4 mb-8">
              <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
              <div className="text-3xl font-bold text-foreground">{plan.price}</div>
              <p className="text-muted-foreground">{plan.description}</p>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0"></div>
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              className={`w-full rounded-full py-3 font-medium ${
                plan.name === "Starter"
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                  : plan.name === "Agency"
                    ? "border-2 border-foreground text-foreground hover:bg-foreground hover:text-background bg-transparent"
                    : "bg-primary hover:bg-primary/90 text-primary-foreground"
              }`}
              variant={plan.name === "Agency" ? "outline" : "default"}
            >
              {plan.cta}
            </Button>
          </div>
        ))}
      </div>
    </section>
  )
}
