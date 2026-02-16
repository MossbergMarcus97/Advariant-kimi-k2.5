'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Link from 'next/link'

const Icons = {
  ArrowLeft: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  ),
  Check: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
}

const clients = [
  { id: 1, name: 'Acme Corporation' },
  { id: 2, name: 'Globex Industries' },
  { id: 3, name: 'Initech LLC' },
]

const objectives = [
  { id: 'awareness', name: 'Brand Awareness', desc: 'Reach people more likely to pay attention to your ads' },
  { id: 'consideration', name: 'Consideration', desc: 'Reach people likely to engage with your content' },
  { id: 'conversions', name: 'Conversions', desc: 'Reach people likely to take action' },
]

export default function NewCampaignPage() {
  const [step, setStep] = useState(1)

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/campaigns" className="p-2 hover:bg-swiss-surface transition-colors">
            <Icons.ArrowLeft />
          </Link>
          <div>
            <h1 className="text-display">New Campaign</h1>
          </div>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          <div className={`w-8 h-8 flex items-center justify-center text-sm font-medium ${
            step >= 1 ? 'bg-lime text-swiss-black' : 'bg-swiss-surface text-swiss-muted'
          }`}>1</div>
          <div className="h-px flex-1 bg-swiss-border"></div>
          <div className={`w-8 h-8 flex items-center justify-center text-sm font-medium ${
            step >= 2 ? 'bg-lime text-swiss-black' : 'bg-swiss-surface text-swiss-muted'
          }`}>2</div>
          <div className="h-px flex-1 bg-swiss-border"></div>
          <div className={`w-8 h-8 flex items-center justify-center text-sm font-medium ${
            step >= 3 ? 'bg-lime text-swiss-black' : 'bg-swiss-surface text-swiss-muted'
          }`}>3</div>
        </div>

        <div className="card-swiss p-8">
          {step === 1 && (
            <>
              <h2 className="text-headline mb-6">Campaign Details</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="text-label block mb-2">Campaign Name</label>
                  <input type="text" className="input-swiss" placeholder="e.g., Summer Sale 2025" />
                </div>

                <div>
                  <label className="text-label block mb-2">Client</label>
                  <select className="input-swiss">
                    <option value="">Select a client...</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-label block mb-2">Description</label>
                  <textarea className="input-swiss h-24 resize-none" placeholder="Briefly describe this campaign..." />
                </div>
              </div>

              <div className="flex justify-end mt-8">
                <button onClick={() => setStep(2)} className="btn-primary">
                  Continue
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-headline mb-6">Objective</h2>
              
              <div className="space-y-4">
                {objectives.map((obj) => (
                  <label key={obj.id} className="flex items-start gap-4 p-4 border border-swiss-border cursor-pointer hover:bg-swiss-surface/30 transition-colors">
                    <input type="radio" name="objective" value={obj.id} className="mt-1" />
                    <div>
                      <p className="font-medium">{obj.name}</p>
                      <p className="text-sm text-swiss-muted">{obj.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex justify-between mt-8">
                <button onClick={() => setStep(1)} className="btn-secondary">
                  Back
                </button>
                <button onClick={() => setStep(3)} className="btn-primary">
                  Continue
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h2 className="text-headline mb-6">Review & Create</h2>
              
              <div className="space-y-4 mb-8">
                <div className="p-4 bg-swiss-surface/50">
                  <span className="text-label">Campaign Name</span>
                  <p className="mt-1">Summer Sale 2025</p>
                </div>
                <div className="p-4 bg-swiss-surface/50">
                  <span className="text-label">Client</span>
                  <p className="mt-1">Acme Corporation</p>
                </div>
                <div className="p-4 bg-swiss-surface/50">
                  <span className="text-label">Objective</span>
                  <p className="mt-1">Conversions</p>
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={() => setStep(2)} className="btn-secondary">
                  Back
                </button>
                <Link href="/campaigns/1/generate" className="btn-primary">
                  Create & Generate Ads
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
