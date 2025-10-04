import { Header } from "@/components/header"
import { StatsCards } from "@/components/stats-cards"
import { RecentDebates } from "@/components/recent-debates"
import { SkillProgress } from "@/components/skill-progress"
import { QuickActions } from "@/components/quick-actions"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <section className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            Welcome back, <span className="text-primary">Debater</span>
          </h1>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl">
            Continue your journey to master critical thinking and persuasive communication.
          </p>
        </section>

        {/* Stats Overview */}
        <StatsCards />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 space-y-6">
            <RecentDebates />
          </div>
          <div className="space-y-6">
            <SkillProgress />
            <QuickActions />
          </div>
        </div>
      </main>
    </div>
  )
}
