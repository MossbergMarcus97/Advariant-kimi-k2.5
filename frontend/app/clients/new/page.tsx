'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { clientApi } from '@/lib/api'

const Icons = {
  ArrowLeft: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
}

export default function NewClientPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [website, setWebsite] = useState('')
  const [industry, setIndustry] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const token = localStorage.getItem('advariant_token')
    if (!token) {
      router.push('/login')
      return
    }

    try {
      await clientApi.create({
        name,
        company,
        email,
        phone: phone || undefined,
        website: website || undefined,
        industry: industry || undefined,
      }, token)

      router.push('/clients')
    } catch (err: any) {
      setError(err.message || 'Failed to create client')
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href="/clients" className="text-sm text-swiss-muted hover:text-swiss-black inline-flex items-center gap-1 mb-4">
            <Icons.ArrowLeft />
            Back to Clients
          </Link>
          <h1 className="text-display">Add New Client</h1>
          <p className="text-swiss-muted mt-1">Create a new client to start building campaigns.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="card-swiss p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-label block mb-2">Contact Name *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-swiss" placeholder="John Doe" required />
            </div>
            <div>
              <label className="text-label block mb-2">Company Name *</label>
              <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="input-swiss" placeholder="Acme Inc" required />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-label block mb-2">Email *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-swiss" placeholder="john@acme.com" required />
            </div>
            <div>
              <label className="text-label block mb-2">Phone</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-swiss" placeholder="+1 555-0123" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-label block mb-2">Website</label>
              <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className="input-swiss" placeholder="https://acme.com" />
            </div>
            <div>
              <label className="text-label block mb-2">Industry</label>
              <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="input-swiss">
                <option value="">Select industry</option>
                <option value="Technology">Technology</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Finance">Finance</option>
                <option value="Retail">Retail</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Education">Education</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Link href="/clients" className="btn-secondary">Cancel</Link>
            <button type="submit" disabled={loading || !name || !company || !email} className="btn-primary disabled:opacity-50">
              {loading ? 'Creating...' : 'Create Client'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
