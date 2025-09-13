import SmartOnboarding from "./bento/smart-onboarding"
import ProposalsContracts from "./bento/proposals-contracts"
import ProjectTracking from "./bento/project-tracking"
import CommunicationHub from "./bento/communication-hub"
import ROIAnalytics from "./bento/roi-analytics"
import BrandedPortals from "./bento/branded-portals"

const BentoCard = ({ title, description, Component }) => (
  <div className="overflow-hidden rounded-2xl border border-white/20 flex flex-col justify-start items-start relative shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
    {/* Background with blur effect */}
    <div
      className="absolute inset-0 rounded-2xl"
      style={{
        background: "rgba(231, 236, 235, 0.08)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      }}
    />
    {/* Additional subtle gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl" />

    <div className="self-stretch p-6 flex flex-col justify-start items-start gap-2 relative z-10">
      <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
        <p className="self-stretch text-foreground text-lg font-normal leading-7">
          {title} <br />
          <span className="text-muted-foreground">{description}</span>
        </p>
      </div>
    </div>
    <div className="self-stretch h-72 relative -mt-0.5 z-10">
      <Component />
    </div>
  </div>
)

export function BentoSection() {
  const cards = [
    {
      title: "Branded Client Portals",
      description:
        "A polished space with your agency's identity. Clients can access projects, files, updates, and performance in one place.",
      Component: BrandedPortals,
    },
    {
      title: "Smart Client Onboarding",
      description: "Guided workflows move clients from signup to kickoff with zero friction.",
      Component: SmartOnboarding,
    },
    {
      title: "Proposals and Contracts",
      description: "Send professional proposals with integrated signatures. Approvals are faster and easier.",
      Component: ProposalsContracts,
    },
    {
      title: "Task and Project Tracking",
      description: "Clear timelines and milestones so every client knows what is happening and when.",
      Component: ProjectTracking,
    },
    {
      title: "Client Communication Hub",
      description: "One hub for updates, feedback, and approvals. No missed messages or endless email chains.",
      Component: CommunicationHub,
    },
    {
      title: "ROI Analytics and Reporting",
      description:
        "Live dashboards that prove your value. Show hours saved, costs reduced, and revenue growth from AI agents and automations.",
      Component: ROIAnalytics,
    },
  ]

  return (
    <section
      id="features-section"
      className="w-full px-5 flex flex-col justify-center items-center overflow-visible bg-gradient-to-b from-gray-50/30 to-white"
    >
      <div className="w-full py-8 md:py-16 relative flex flex-col justify-start items-start gap-6">
        <div className="w-[547px] h-[938px] absolute top-[614px] left-[80px] origin-top-left rotate-[-33.39deg] bg-primary/10 blur-[130px] z-0" />
        <div className="self-stretch py-8 md:py-14 flex flex-col justify-center items-center gap-2 z-10">
          <div className="flex flex-col justify-start items-center gap-4">
            <h2 className="w-full max-w-[655px] text-center text-foreground text-4xl md:text-6xl font-semibold leading-tight md:leading-[66px]">
              Everything Your Clients Need
            </h2>
            <p className="w-full max-w-[600px] text-center text-muted-foreground text-lg md:text-xl font-medium leading-relaxed">
              {"One place for clients to onboard, track progress, approve work, and see results."}
            </p>
          </div>
        </div>
        <div className="self-stretch grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 z-10">
          {cards.map((card) => (
            <BentoCard key={card.title} {...card} />
          ))}
        </div>
      </div>
    </section>
  )
}
