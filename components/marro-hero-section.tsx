import { Button } from "@/components/ui/button"

export function MarroHeroSection() {
  return (
    <section className="px-6 py-16 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-8">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Marro: The AI Client OS
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              One place for clients to onboard, track progress, approve work, and see results.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-3 text-lg font-medium shadow-lg"
            >
              Get a Demo
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-foreground text-foreground hover:bg-foreground hover:text-background rounded-full px-8 py-3 text-lg font-medium bg-transparent"
            >
              See Example
            </Button>
          </div>

          {/* Trust Row */}
          <div className="pt-8">
            <p className="text-sm text-muted-foreground mb-4">Trusted by agencies and teams worldwide</p>
            <div className="flex items-center gap-6 opacity-60">
              <div className="w-20 h-8 bg-muted rounded flex items-center justify-center text-xs font-medium">
                AGENCY
              </div>
              <div className="w-20 h-8 bg-muted rounded flex items-center justify-center text-xs font-medium">TEAM</div>
              <div className="w-20 h-8 bg-muted rounded flex items-center justify-center text-xs font-medium">
                STUDIO
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Dashboard Illustration */}
        <div className="relative">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-full"></div>
                <div className="text-sm font-medium">Client Dashboard</div>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-muted rounded-lg p-3 h-16"></div>
                <div className="bg-muted rounded-lg p-3 h-16"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
