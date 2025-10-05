import Link from "next/link"
import { Brain } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Brain className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-foreground">DebateMate.Tech</span>
        </Link>
      </div>
    </header>
  )
}