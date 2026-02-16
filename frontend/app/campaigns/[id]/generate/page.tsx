'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'

const Icons = {
  Sparkles: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  Upload: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  ),
  Check: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  Refresh: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  Download: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  ChevronRight: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
}

const platforms = [
  { id: 'meta', name: 'Meta', formats: ['Feed', 'Stories', 'Reels'], selected: true },
  { id: 'google', name: 'Google', formats: ['Display', 'Responsive'], selected: true },
  { id: 'tiktok', name: 'TikTok', formats: ['In-Feed'], selected: false },
  { id: 'linkedin', name: 'LinkedIn', formats: ['Sponsored Content'], selected: false },
]

const generatedVariants = [
  { id: 1, style: 'Modern Minimal', headline: 'Transform Your Workflow', status: 'complete' },
  { id: 2, style: 'Bold & Bright', headline: 'Work Smarter, Not Harder', status: 'complete' },
  { id: 3, style: 'Professional', headline: 'Enterprise Solutions', status: 'complete' },
  { id: 4, style: 'Playful', headline: 'Make Work Fun Again', status: 'complete' },
  { id: 5, style: 'Luxury', headline: 'Premium Experience', status: 'generating' },
  { id: 6, style: 'Tech Forward', headline: 'Innovation at Scale', status: 'generating' },
]

export default function GeneratePage() {
  const [step, setStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)

  const handleGenerate = () => {
    setIsGenerating(true)
    setGenerationProgress(0)
    
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsGenerating(false)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-64px)] flex">
        {/* Left Panel - Configuration */}
        <div className="w-96 border-r border-swiss-border bg-white overflow-y-auto">
          <div className="p-6">
            <div className="mb-6">
              <span className="text-label block mb-2">Summer Sale 2025</span>
              <h1 className="text-headline">Generate Ads</h1>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center gap-2 mb-6">
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

            {step === 1 && (
              <>
                <div className="mb-6">
                  <label className="text-label block mb-2">Campaign Message</label>
                  <textarea
                    className="input-swiss h-24 resize-none"
                    placeholder="Describe your campaign message..."
                    defaultValue="Summer Sale - Up to 50% off on all products. Limited time offer."
                  />
                </div>

                <div className="mb-6">
                  <label className="text-label block mb-2">Headline Variations</label>
                  <div className="space-y-2">
                    <input type="text" className="input-swiss" defaultValue="Summer Sale: 50% Off Everything" />
                    <input type="text" className="input-swiss" defaultValue="Limited Time: Free Shipping" />
                    <input type="text" className="input-swiss" placeholder="Add another headline..." />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="text-label block mb-2">Call-to-Action</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Shop Now', 'Learn More', 'Get Started', 'Buy Now'].map((cta) => (
                      <label key={cta} className="flex items-center gap-2 p-3 border border-swiss-border cursor-pointer hover:bg-swiss-surface/30">
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                        <span className="text-sm">{cta}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button onClick={() => setStep(2)} className="btn-primary w-full">
                  Continue
                  <Icons.ChevronRight />
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div className="mb-6">
                  <label className="text-label block mb-2">Platforms</label>
                  <div className="space-y-2">
                    {platforms.map((platform) => (
                      <label key={platform.id} className="flex items-center gap-3 p-3 border border-swiss-border cursor-pointer hover:bg-swiss-surface/30">
                        <input type="checkbox" defaultChecked={platform.selected} className="w-4 h-4" />
                        <div className="flex-1">
                          <p className="font-medium">{platform.name}</p>
                          <p className="text-xs text-swiss-muted">{platform.formats.join(', ')}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="text-label block mb-2">Reference Images</label>
                  <div className="border border-dashed border-swiss-border p-6 text-center hover:bg-swiss-surface/30 transition-colors cursor-pointer">
                    <Icons.Upload />
                    <p className="text-sm mt-2">Drop images here or click to upload</p>
                    <p className="text-xs text-swiss-muted mt-1">JPG, PNG up to 10MB</p>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="text-label block mb-2">Visual Style</label>
                  <select className="input-swiss">
                    <option>Brand Aligned (Default)</option>
                    <option>Modern & Minimal</option>
                    <option>Bold & Energetic</option>
                    <option>Luxury & Premium</option>
                    <option>Playful & Fun</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setStep(1)} className="btn-secondary flex-1">
                    Back
                  </button>
                  <button onClick={() => setStep(3)} className="btn-primary flex-1">
                    Review
                    <Icons.ChevronRight />
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="mb-6 space-y-4">
                  <div className="p-4 bg-swiss-surface/50">
                    <span className="text-label">Message</span>
                    <p className="text-sm mt-1">Summer Sale - Up to 50% off on all products...</p>
                  </div>
                  
                  <div className="p-4 bg-swiss-surface/50">
                    <span className="text-label">Platforms</span>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs px-2 py-1 bg-white border border-swiss-border">Meta</span>
                      <span className="text-xs px-2 py-1 bg-white border border-swiss-border">Google</span>
                    </div>
                  </div>

                  <div className="p-4 bg-swiss-surface/50">
                    <span className="text-label">Expected Output</span>
                    <p className="text-sm mt-1">48 variants across 2 platforms</p>
                    <p className="text-xs text-swiss-muted">12 headlines × 2 CTAs × 2 formats</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setStep(2)} className="btn-secondary flex-1">
                    Back
                  </button>
                  <button 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="btn-primary flex-1 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <Icons.Refresh />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Icons.Sparkles />
                        Generate Ads
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="flex-1 bg-swiss-surface/30 overflow-y-auto">
          <div className="p-6">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center h-full py-20">
                <div className="w-20 h-20 bg-lime flex items-center justify-center mb-6">
                  <Icons.Sparkles />
                </div>
                <h2 className="text-headline mb-2">Generating Your Ads</h2>
                <p className="text-swiss-muted mb-6">This may take a minute...</p>
                <div className="w-64 h-2 bg-swiss-border">
                  <div 
                    className="h-full bg-lime transition-all duration-500"
                    style={{ width: `${generationProgress}%` }}
                  />
                </div>
                <p className="text-sm text-swiss-muted mt-2">{generationProgress}% complete</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-title">Generated Variants</h2>
                  <div className="flex gap-2">
                    <button className="btn-secondary text-sm">
                      <Icons.Refresh />
                      Regenerate
                    </button>
                    <button className="btn-primary text-sm">
                      <Icons.Download />
                      Export All
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                  {generatedVariants.map((variant) => (
                    <div key={variant.id} className="card-swiss overflow-hidden group">
                      <div className="aspect-[4/5] bg-swiss-surface flex items-center justify-center relative">
                        {variant.status === 'complete' ? (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-br from-swiss-surface to-white" />
                            <div className="relative z-10 text-center p-6">
                              <div className="w-16 h-16 bg-lime mx-auto mb-4" />
                              <p className="font-semibold">{variant.headline}</p>
                              <p className="text-xs text-swiss-muted mt-2">{variant.style}</p>
                            </div>
                            <div className="absolute inset-0 bg-swiss-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="flex gap-2">
                                <button className="p-2 bg-white text-swiss-black">
                                  <Icons.Refresh />
                                </button>
                                <button className="p-2 bg-lime text-swiss-black">
                                  <Icons.Download />
                                </button>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center text-swiss-muted">
                            <Icons.Sparkles />
                            <p className="text-sm mt-2">Generating...</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4 border-t border-swiss-border">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{variant.style}</span>
                          {variant.status === 'complete' && (
                            <span className="text-lime">
                              <Icons.Check />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
