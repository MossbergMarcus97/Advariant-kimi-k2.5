import Link from 'next/link'

const Icons = {
  Sparkles: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  ArrowRight: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  ),
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-swiss-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-lime flex items-center justify-center">
              <Icons.Sparkles />
            </div>
            <span className="text-lg font-bold tracking-tight">AdVariant</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-swiss-muted hover:text-swiss-black transition-colors">
              Sign In
            </Link>
            <Link href="/dashboard" className="btn-primary text-sm">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="tag-accent mb-6">
              <Icons.Sparkles />
              <span>AI-Powered Creative</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
              Generate on-brand ads at scale
            </h1>
            <p className="text-lg text-swiss-muted mb-8 max-w-xl">
              Upload your brand kit. Describe your campaign. Get hundreds of platform-optimized ad variations in minutes.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/dashboard" className="btn-primary">
                Start Free Trial
                <Icons.ArrowRight />
              </Link>
              <Link href="/login" className="btn-secondary">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
