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
  Zap: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  Image: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Target: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Palette: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  ),
  Check: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
}

const features = [
  {
    icon: Icons.Zap,
    title: 'AI-Powered Generation',
    description: 'Generate hundreds of ad variations in minutes using GPT 5.2 and GPT Image 1.5.'
  },
  {
    icon: Icons.Palette,
    title: 'Brand Consistency',
    description: 'Upload your brand kit to ensure every generated ad stays perfectly on-brand.'
  },
  {
    icon: Icons.Target,
    title: 'Platform Optimized',
    description: 'Automatically generate the right sizes and formats for Meta, Google, TikTok, and LinkedIn.'
  },
  {
    icon: Icons.Image,
    title: 'Visual Excellence',
    description: 'High-quality AI-generated images with Gemini 3 Nano Banana Pro integration.'
  },
]

const steps = [
  { number: '01', title: 'Upload Brand Kit', description: 'Add your logos, colors, fonts, and brand guidelines.' },
  { number: '02', title: 'Describe Campaign', description: 'Tell us your message, target audience, and platforms.' },
  { number: '03', title: 'Generate & Export', description: 'Get hundreds of variations, ready to launch.' },
]

const pricing = [
  {
    name: 'Starter',
    price: '49',
    description: 'Perfect for small teams getting started with AI ads.',
    features: ['100 AI generations/month', '3 brand kits', 'All platforms', 'Email support'],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Pro',
    price: '149',
    description: 'For growing agencies with multiple clients.',
    features: ['500 AI generations/month', 'Unlimited brand kits', 'All platforms', 'Priority support', 'API access'],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '499',
    description: 'For large teams with custom needs.',
    features: ['Unlimited generations', 'Unlimited brand kits', 'Custom AI training', 'Dedicated support', 'SSO & advanced security'],
    cta: 'Contact Sales',
    popular: false,
  },
]

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

      {/* Features */}
      <section className="py-20 bg-swiss-surface/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-label mb-4 block">Features</span>
            <h2 className="text-headline mb-4">Everything you need to scale ad creation</h2>
            <p className="text-swiss-muted max-w-2xl mx-auto">Powered by the latest AI models including GPT 5.2, GPT Image 1.5, and Gemini 3 Nano Banana Pro.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="card-swiss p-8">
                  <div className="w-12 h-12 bg-lime flex items-center justify-center mb-6">
                    <Icon />
                  </div>
                  <h3 className="text-title mb-3">{feature.title}</h3>
                  <p className="text-swiss-muted">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-label mb-4 block">How it Works</span>
            <h2 className="text-headline mb-4">From concept to campaign in 3 steps</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="w-16 h-16 bg-lime flex items-center justify-center text-2xl font-bold mb-6 mx-auto">
                  {step.number}
                </div>
                <h3 className="text-title mb-3">{step.title}</h3>
                <p className="text-swiss-muted">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-swiss-surface/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-label mb-4 block">Pricing</span>
            <h2 className="text-headline mb-4">Simple, transparent pricing</h2>
            <p className="text-swiss-muted max-w-2xl mx-auto">Start free, then scale as you grow. No hidden fees.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {pricing.map((plan) => (
              <div 
                key={plan.name} 
                className={`card-swiss p-8 ${plan.popular ? 'border-swiss-black' : ''}`}
              >
                {plan.popular && (
                  <span className="tag-accent mb-6 inline-block">Most Popular</span>
                )}
                <h3 className="text-title mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold tracking-tight">${plan.price}</span>
                  <span className="text-swiss-muted">/month</span>
                </div>
                <p className="text-swiss-muted text-sm mb-6">{plan.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <span className="text-lime mt-0.5"><Icons.Check /></span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link 
                  href={plan.name === 'Enterprise' ? '/contact' : '/dashboard'} 
                  className={plan.popular ? 'btn-primary w-full' : 'btn-secondary w-full'}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-headline mb-6">Ready to transform your ad creation?</h2>
          <p className="text-swiss-muted mb-8 max-w-xl mx-auto">
            Join thousands of marketers and agencies using AdVariant to scale their creative output.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/dashboard" className="btn-primary">
              Start Free Trial
              <Icons.ArrowRight />
            </Link>
            <Link href="/login" className="btn-secondary">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-swiss-border py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-lime flex items-center justify-center">
                <Icons.Sparkles />
              </div>
              <span className="text-lg font-bold tracking-tight">AdVariant</span>
            </div>
            <div className="flex gap-8 text-sm text-swiss-muted">
              <Link href="/dashboard" className="hover:text-swiss-black transition-colors">Dashboard</Link>
              <Link href="/login" className="hover:text-swiss-black transition-colors">Sign In</Link>
            </div>
            <p className="text-sm text-swiss-muted">
              © 2025 AdVariant. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
