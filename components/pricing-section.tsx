"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true)

  const pricingPlans = [
    {
      name: "Free",
      monthlyPrice: "$0",
      annualPrice: "$0",
      description: "Try before you buy.",
      features: ["1 branded client portal", "Smart onboarding forms", "Proposals and contracts", "Basic reporting"],
      buttonText: "Get Started",
      buttonClass: "bg-zinc-200 text-zinc-800 hover:bg-zinc-300 transition-colors",
    },
    {
      name: "Pro",
      monthlyPrice: "$49",
      annualPrice: "$39",
      description: "Best for growing AI agencies.",
      features: [
        "Up to 10 client portals",
        "Branded portals (logo upload)",
        "ROI analytics dashboards",
        "Task and project tracking",
        "Client communication hub",
        "Priority chat support",
      ],
      buttonText: "Start Free Trial",
      buttonClass: "bg-[#FC4503] text-white hover:bg-[#E03E00] transition-colors",
      popular: true,
    },
    {
      name: "Agency",
      monthlyPrice: "$149",
      annualPrice: "$119",
      description: "Unlimited scale and full control.",
      features: [
        "Unlimited client portals",
        "Full white-label branding (logo, domain, colors)",
        "Advanced permissions",
        "Dedicated success manager",
        "SLA-backed uptime",
        "Priority onboarding + phone support",
      ],
      buttonText: "Talk to Sales",
      buttonClass: "bg-zinc-200 text-zinc-800 hover:bg-zinc-300 transition-colors",
    },
  ]

  return (
    <section
      id="pricing-section"
      className="w-full px-5 overflow-hidden flex flex-col justify-start items-center my-0 py-8 md:py-14 bg-gradient-to-b from-gray-50/20 to-white"
    >
      <div className="self-stretch relative flex flex-col justify-center items-center gap-2 py-0">
        <div className="flex flex-col justify-start items-center gap-4">
          <h2 className="text-center text-foreground text-4xl md:text-5xl font-semibold leading-tight md:leading-[40px]">
            Pricing built for every AI Agency
          </h2>
          <p className="self-stretch text-center text-muted-foreground text-sm font-medium leading-tight">
            Choose a plan that fits your workflow, from freelancers just starting out to growing agencies and larger
            teams.
          </p>
        </div>
        <div className="pt-4">
          <div className="p-0.5 bg-muted rounded-lg outline outline-1 outline-[#0307120a] outline-offset-[-1px] flex justify-start items-center gap-1 md:mt-0">
            <button
              onClick={() => setIsAnnual(true)}
              className={`pl-2 pr-1 py-1 flex justify-start items-start gap-2 rounded-md ${isAnnual ? "bg-accent shadow-[0px_1px_1px_-0.5px_rgba(0,0,0,0.08)]" : ""}`}
            >
              <span
                className={`text-center text-sm font-medium leading-tight ${isAnnual ? "text-accent-foreground" : "text-zinc-400"}`}
              >
                Annually
              </span>
            </button>
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-2 py-1 flex justify-start items-start rounded-md ${!isAnnual ? "bg-accent shadow-[0px_1px_1px_-0.5px_rgba(0,0,0,0.08)]" : ""}`}
            >
              <span
                className={`text-center text-sm font-medium leading-tight ${!isAnnual ? "text-accent-foreground" : "text-zinc-400"}`}
              >
                Monthly
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="self-stretch px-5 flex flex-col md:flex-row justify-start items-start gap-4 md:gap-6 mt-6 max-w-[1100px] mx-auto">
        {pricingPlans.map((plan) => (
          <div
            key={plan.name}
            className={`flex-1 p-4 overflow-hidden rounded-xl flex flex-col justify-start items-start gap-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-[580px] md:min-h-[520px] ${plan.popular ? "bg-white border-2 border-[#FC4503]" : "bg-gradient-to-b from-gray-50/5 to-gray-50/0"}`}
            style={plan.popular ? {} : { outline: "1px solid hsl(var(--border))", outlineOffset: "-1px" }}
          >
            <div className="self-stretch flex flex-col justify-start items-start gap-6">
              <div className="self-stretch flex flex-col justify-start items-start gap-8">
                <div
                  className={`w-full h-5 text-sm font-medium leading-tight ${plan.popular ? "text-foreground" : "text-foreground"}`}
                >
                  {plan.name}
                  {plan.popular && (
                    <div className="ml-2 px-2 overflow-hidden rounded-full justify-center items-center gap-2.5 inline-flex mt-0 py-0.5 bg-[#FC4503]">
                      <div className="text-center text-white text-xs font-medium leading-tight break-words">
                        Most Popular
                      </div>
                    </div>
                  )}
                </div>
                <div className="self-stretch flex flex-col justify-start items-start gap-1">
                  <div className="flex justify-start items-center gap-1.5">
                    <div
                      className={`relative h-10 flex items-center text-3xl font-medium leading-10 ${plan.popular ? "text-foreground" : "text-foreground"}`}
                    >
                      {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    </div>
                    {plan.name !== "Free" && (
                      <div
                        className={`text-center text-sm font-medium leading-tight ${plan.popular ? "text-muted-foreground" : "text-muted-foreground"}`}
                      >
                        /month
                        {isAnnual && plan.name !== "Free" && (
                          <div className="text-xs text-muted-foreground">billed annually</div>
                        )}
                      </div>
                    )}
                  </div>
                  <div
                    className={`self-stretch text-sm font-medium leading-tight ${plan.popular ? "text-muted-foreground" : "text-muted-foreground"}`}
                  >
                    {plan.description}
                  </div>
                </div>
              </div>
              <Button
                className={`self-stretch px-5 py-2 rounded-[40px] flex justify-center items-center ${plan.buttonClass}`}
              >
                <div className="px-1.5 flex justify-center items-center gap-2">
                  <span className="text-center text-sm font-medium leading-tight">{plan.buttonText}</span>
                </div>
              </Button>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              <div
                className={`self-stretch text-sm font-medium leading-tight ${plan.popular ? "text-muted-foreground" : "text-muted-foreground"}`}
              >
                {plan.name === "Free" ? "Includes:" : "Everything in Free, plus:"}
              </div>
              <div className="self-stretch flex flex-col justify-start items-start gap-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="self-stretch flex justify-start items-center gap-2">
                    <div className="w-4 h-4 flex items-center justify-center">
                      <Check
                        className={`w-full h-full ${plan.popular ? "text-[#FC4503]" : "text-muted-foreground"}`}
                        strokeWidth={2}
                      />
                    </div>
                    <div
                      className={`leading-tight font-normal text-sm text-left ${plan.popular ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {feature}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
