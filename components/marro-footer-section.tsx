export function MarroFooterSection() {
  const links = [
    { name: "Product", href: "#" },
    { name: "Pricing", href: "#" },
    { name: "Templates", href: "#" },
    { name: "Docs", href: "#" },
    { name: "Contact", href: "#" },
  ]

  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full"></div>
            <span className="text-xl font-bold text-foreground">Marro</span>
          </div>

          <nav className="flex flex-wrap justify-center gap-8">
            {links.map((link, index) => (
              <a key={index} href={link.href} className="text-muted-foreground hover:text-foreground transition-colors">
                {link.name}
              </a>
            ))}
          </nav>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">© 2024 Marro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
