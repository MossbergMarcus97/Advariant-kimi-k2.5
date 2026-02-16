'use client'

import Link from 'next/link'

const Icons = {
  Sparkles: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-lime flex items-center justify-center">
              <Icons.Sparkles />
            </div>
            <span className="text-xl font-bold tracking-tight">AdVariant</span>
          </Link>

          <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
          <p className="text-swiss-muted mb-8">Sign in to your account to continue</p>

          <form className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1">Email</label>
              <input type="email" className="input-swiss" placeholder="you@company.com" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Password</label>
              <input type="password" className="input-swiss" placeholder="••••••••" />
            </div>
            <Link href="/dashboard" className="btn-primary w-full text-center block">
              Sign In
            </Link>
          </form>

          <p className="text-center text-sm text-swiss-muted mt-6">
            Don't have an account?{' '}
            <a href="#" className="text-swiss-black underline">Sign up</a>
          </p>
        </div>
      </div>

      {/* Right side - Visual */}
      <div className="hidden lg:flex flex-1 bg-swiss-surface items-center justify-center">
        <div className="text-center p-12">
          <div className="w-20 h-20 bg-lime flex items-center justify-center mx-auto mb-6">
            <Icons.Sparkles />
          </div>
          <h2 className="text-2xl font-bold mb-2">Generate ads at scale</h2>
          <p className="text-swiss-muted max-w-xs mx-auto">
            Create hundreds of on-brand ad variations in minutes with AI
          </p>
        </div>
      </div>
    </div>
  )
}
