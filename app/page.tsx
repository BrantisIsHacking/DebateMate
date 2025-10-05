import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, MessageSquare, TrendingUp, Users, Zap, Shield } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">DebateMate.Tech</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 text-balance">
            Master the Art of <span className="text-primary">Critical Thinking</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-pretty leading-relaxed">
            Practice debate with AI opponents, detect logical fallacies in real-time, and sharpen your argumentation
            skills. Learn how to think, not what to think.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup">
              <Button size="lg" className="text-lg px-8">
                Start Debating
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mt-6"></p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-4">Why DebateMate.Tech?</h2>
          <p className="text-xl text-center text-muted-foreground mb-12">
            The most advanced AI debate coach for students, professionals, and lifelong learners
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-border bg-card">
              <CardHeader>
                <MessageSquare className="h-12 w-12 text-primary mb-4" />
                <CardTitle>AI Debate Opponents</CardTitle>
                <CardDescription>
                  Practice against AI opponents with different personas - politicians, scientists, activists, and more.
                  Each with unique arguing styles and tones.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <Shield className="h-12 w-12 text-accent mb-4" />
                <CardTitle>Fallacy Detection</CardTitle>
                <CardDescription>
                  Real-time detection of logical fallacies in your arguments. Learn to identify ad hominem, straw man,
                  false dichotomy, and 20+ other fallacies.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-chart-3 mb-4" />
                <CardTitle>Progress Analytics</CardTitle>
                <CardDescription>
                  Track your improvement over time. See your logical fallacies reduce, argument strength increase, and
                  persuasiveness grow.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <Zap className="h-12 w-12 text-chart-4 mb-4" />
                <CardTitle>Instant Feedback</CardTitle>
                <CardDescription>
                  Get immediate feedback on clarity, evidence quality, logical consistency, and persuasiveness. Learn
                  from every debate.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <Brain className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Fact-Checking</CardTitle>
                <CardDescription>
                  AI-powered fact verification ensures your arguments are grounded in truth. Combat misinformation with
                  evidence-based reasoning.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <Users className="h-12 w-12 text-accent mb-4" />
                <CardTitle>Voice Debates</CardTitle>
                <CardDescription>
                  Practice speaking with realistic AI voices powered by ElevenLabs. Perfect for debate competitions and
                  public speaking.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-12">How It Works</h2>

          <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">
                1
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Choose Your Topic</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Select from trending topics or create your own. Pick your position (for or against) and choose your AI
                  opponent's persona.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">
                2
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Engage in Real-Time Debate</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Type or speak your arguments. The AI responds with counterarguments, challenges your logic, and pushes
                  you to think deeper.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">
                3
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Receive Instant Feedback</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  After each argument, see highlighted fallacies, weak points, and suggestions for improvement. Learn
                  what works and what doesn't.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">
                4
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Track Your Progress</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Watch your skills improve over time. See your fallacy rate drop, argument scores rise, and confidence
                  grow with detailed analytics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 bg-card/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance">
            Ready to Think Critically?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 text-pretty leading-relaxed">
            Join thousands of students and professionals sharpening their minds with AI-powered debate coaching.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="text-lg px-8">
              Start Your First Debate
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-foreground">DebateMate.Tech</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 DebateMate.Tech. Teaching critical thinking, one debate at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
