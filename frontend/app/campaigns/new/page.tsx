'use client'

import { useEffect, useState, Suspense } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { clientApi, campaignApi } from '@/lib/api'

const Icons = {
  ArrowLeft: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
  ChevronRight: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  Check: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
}

const platforms = [
  { id: 'meta', name: 'Meta', formats: ['Feed', 'Stories', 'Reels'] },
  { id: 'google', name: 'Google', formats: ['Display', 'Responsive'] },
  { id: 'tiktok', name: 'TikTok', formats: ['In-Feed'] },
  { id: 'linkedin', name: 'LinkedIn', formats: ['Sponsored Content'] },
]

function NewCampaignForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedClient = searchParams?.get('clientId') || ''

  const [step, setStep] = useState(1)
  const [clients, setClients] = useState<any[]>([])
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [clientId, setClientId] = useState(preselectedClient || '')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['meta', 'google'])
  const [targetAudience, setTargetAudience] = useState('')
  const [budget, setBudget] = useState('')

  useEffect(() => {
    const storedToken = localStorage.getItem('advariant_token')
    if (!storedToken) {
      router.push('/login')
      return
    }
    setToken(storedToken)
    fetchClients(storedToken)
  }, [router])

  const fetchClients = async (authToken: string) => {
    try {
      const res = await clientApi.list(authToken)
      setClients(res.clients)
      if (!preselectedClient && res.clients.length > 0) {
        setClientId(res.clients[0].id)
      }
    } catch (err) {
      console.error('Failed to fetch clients:', err)
    }
  }

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    )
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      const res = await campaignApi.create({
        clientId,
        name,
        description: description || undefined,
        platforms: selectedPlatforms,
        targetAudience: targetAudience || undefined,
        budget: budget ? parseFloat(budget) : undefined,
      }, token)
      
      router.push(`/campaigns/${res.campaign.id}/generate`)
    } catch (err: any) {
      setError(err.message || 'Failed to create campaign')
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <DashboardLayout>
        <div className="p-6 md:p-8 max-w-3xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-swiss-muted">Loading...</div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/campaigns" className="text-sm text-swiss-muted hover:text-swiss-black inline-flex items-center gap-1 mb-4">
            <Icons.ArrowLeft />
            Back to Campaigns
          </Link>
          <h1 className="text-display">New Campaign</h1>
          <p className="text-swiss-muted mt-1">Create a new campaign and generate AI-powered ads.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`w-8 h-8 flex items-center justify-center text-sm font-medium ${
              step >= s ? 'bg-lime text-swiss-black' : 'bg-swiss-surface text-swiss-muted'
            }`}>
              {step > s ? <Icons.Check /> : s}
            </div>
          ))}
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="card-swiss p-6">
            <h2 className="text-title mb-6">Campaign Details</h2>
            
            <div className="space-y-6">
              <div>
                <label className="text-label block mb-2">Client *</label>
                <select 
                  value={clientId} 
                  onChange={(e) => setClientId(e.target.value)}
                  className="input-swiss"
                  required
                >
                  <option value="">Select a client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name} ({client.company})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-label block mb-2">Campaign Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-swiss"
                  placeholder="e.g., Summer Sale 2025"
                  required
                />
              </div>

              <div>
                <label className="text-label block mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-swiss h-24 resize-none"
                  placeholder="Brief description of the campaign..."
                />
              </div>

              <div className="flex justify-end">
                <button 
                  onClick={() => setStep(2)} 
                  disabled={!clientId || !name}
                  className="btn-primary disabled:opacity-50"
                >
                  Continue
                  <Icons.ChevronRight />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Platforms & Audience */}
        {step === 2 && (
          <div className="card-swiss p-6">
            <h2 className="text-title mb-6">Platforms & Audience</h2>
            
            <div className="space-y-6">
              <div>
                <label className="text-label block mb-2">Platforms *</label>
                <div className="space-y-2">
                  {platforms.map((platform) => (
                    <label key={platform.id} className="flex items-center gap-3 p-3 border border-swiss-border cursor-pointer hover:bg-swiss-surface/30">
                      <input 
                        type="checkbox" 
                        checked={selectedPlatforms.includes(platform.id)}
                        onChange={() => togglePlatform(platform.id)}
                        className="w-4 h-4"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{platform.name}</p>
                        <p className="text-xs text-swiss-muted">{platform.formats.join(', ')}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-label block mb-2">Target Audience</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="input-swiss"
                  placeholder="e.g., Urban professionals aged 25-40"
                />
              </div>

              <div>
                <label className="text-label block mb-2">Budget ($)</label>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="input-swiss"
                  placeholder="5000"
                />
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(1)} className="btn-secondary">
                  Back
                </button>
                <button 
                  onClick={() => setStep(3)} 
                  disabled={selectedPlatforms.length === 0}
                  className="btn-primary disabled:opacity-50"
                >
                  Continue
                  <Icons.ChevronRight />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Review & Create */}
        {step === 3 && (
          <div className="card-swiss p-6">
            <h2 className="text-title mb-6">Review & Create</h2>
            
            <div className="space-y-4 mb-8">
              <div className="p-4 bg-swiss-surface/50">
                <span className="text-label">Campaign Name</span>
                <p className="font-medium mt-1">{name}</p>
              </div>
              
              <div className="p-4 bg-swiss-surface/50">
                <span className="text-label">Client</span>
                <p className="font-medium mt-1">
                  {clients.find(c => c.id === clientId)?.name || 'Unknown'}
                </p>
              </div>

              <div className="p-4 bg-swiss-surface/50">
                <span className="text-label">Platforms</span>
                <div className="flex gap-2 mt-1">
                  {selectedPlatforms.map(p => (
                    <span key={p} className="text-xs px-2 py-1 bg-white border border-swiss-border capitalize">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              {targetAudience && (
                <div className="p-4 bg-swiss-surface/50">
                  <span className="text-label">Target Audience</span>
                  <p className="text-sm mt-1">{targetAudience}</p>
                </div>
              )}

              {budget && (
                <div className="p-4 bg-swiss-surface/50">
                  <span className="text-label">Budget</span>
                  <p className="text-sm mt-1">${parseFloat(budget).toLocaleString()}</p>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep(2)} className="btn-secondary">
                Back
              </button>
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Campaign'}
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default function NewCampaignPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="p-6 md:p-8 max-w-3xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-swiss-muted">Loading...</div>
          </div>
        </div>
      </DashboardLayout>
    }>
      <NewCampaignForm />
    </Suspense>
  )
}
