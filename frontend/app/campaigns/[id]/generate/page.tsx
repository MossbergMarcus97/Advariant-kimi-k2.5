'use client'

import { useEffect, useState, Suspense } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useParams, useRouter } from 'next/navigation'
import { campaignApi, generationApi } from '@/lib/api'

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
  Wand: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  ),
}

const platforms = [
  { id: 'meta', name: 'Meta', formats: ['Feed', 'Stories', 'Reels'], selected: true },
  { id: 'google', name: 'Google', formats: ['Display', 'Responsive'], selected: true },
  { id: 'tiktok', name: 'TikTok', formats: ['In-Feed'], selected: false },
  { id: 'linkedin', name: 'LinkedIn', formats: ['Sponsored Content'], selected: false },
]

const styles = [
  { id: 'photorealistic', name: 'Photorealistic', description: 'High-quality photography look' },
  { id: 'illustrative', name: 'Illustrative', description: 'Digital illustration style' },
  { id: 'minimal', name: 'Minimal', description: 'Clean, simple design' },
  { id: 'cinematic', name: 'Cinematic', description: 'Movie poster aesthetic' },
]

const ctas = ['Shop Now', 'Learn More', 'Get Started', 'Buy Now', 'Sign Up', 'Download']

function GeneratePageContent() {
  const params = useParams()
  const router = useRouter()
  const campaignId = params?.id as string

  const [step, setStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [campaign, setCampaign] = useState<any>(null)
  const [token, setToken] = useState('')
  const [error, setError] = useState('')

  // Form state
  const [prompt, setPrompt] = useState('')
  const [headlines, setHeadlines] = useState(['', '', ''])
  const [selectedCtas, setSelectedCtas] = useState<string[]>(['Shop Now'])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['meta', 'google'])
  const [selectedStyle, setSelectedStyle] = useState('minimal')
  const [generations, setGenerations] = useState<any[]>([])
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)

  useEffect(() => {
    const storedToken = localStorage.getItem('advariant_token')
    if (!storedToken) {
      router.push('/login')
      return
    }
    setToken(storedToken)
    
    if (campaignId && campaignId !== 'new') {
      fetchCampaign(storedToken, campaignId)
      fetchGenerations(storedToken, campaignId)
    }
  }, [campaignId, router])

  const fetchCampaign = async (authToken: string, id: string) => {
    try {
      const res = await campaignApi.get(id, authToken)
      setCampaign(res.campaign)
      if (res.campaign?.description) {
        setPrompt(res.campaign.description)
      }
    } catch (err) {
      console.error('Failed to fetch campaign:', err)
    }
  }

  const fetchGenerations = async (authToken: string, id: string) => {
    try {
      const res = await generationApi.list(id, authToken)
      setGenerations(res.generations || [])
    } catch (err) {
      console.error('Failed to fetch generations:', err)
    }
  }

  const getAiSuggestions = async () => {
    if (!campaign || !token) return
    
    setLoadingSuggestions(true)
    try {
      const res = await generationApi.suggestions({
        campaignId: campaign.id,
        product: campaign.name,
        targetAudience: campaign.targetAudience || 'general audience',
        platform: selectedPlatforms[0] || 'meta',
      }, token)
      
      setAiSuggestions(res.headlines || [])
      if (res.headlines && res.headlines.length > 0) {
        setHeadlines(prev => [
          res.headlines[0] || prev[0],
          res.headlines[1] || prev[1],
          res.headlines[2] || prev[2],
        ])
      }
    } catch (err) {
      console.error('Failed to get suggestions:', err)
    } finally {
      setLoadingSuggestions(false)
    }
  }

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    )
  }

  const toggleCta = (cta: string) => {
    setSelectedCtas(prev => 
      prev.includes(cta) 
        ? prev.filter(c => c !== cta)
        : [...prev, cta]
    )
  }

  const updateHeadline = (index: number, value: string) => {
    setHeadlines(prev => prev.map((h, i) => i === index ? value : h))
  }

  const handleGenerate = async () => {
    if (!token || !campaign) return
    
    setIsGenerating(true)
    setGenerationProgress(0)
    setError('')

    try {
      // Start generation for each platform/headline combination
      const validHeadlines = headlines.filter(h => h.trim())
      
      for (const platform of selectedPlatforms) {
        for (const headline of validHeadlines.slice(0, 2)) {
          for (const cta of selectedCtas.slice(0, 2)) {
            await generationApi.create({
              campaignId: campaign.id,
              prompt: prompt || campaign.name,
              headlines: [headline],
              ctas: [cta],
              platform: platform as any,
              style: selectedStyle as any,
            }, token)
          }
        }
      }

      // Poll for results
      const interval = setInterval(async () => {
        setGenerationProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval)
            return 90
          }
          return prev + 10
        })
        
        await fetchGenerations(token, campaign.id)
      }, 2000)

      // Complete after 10 seconds
      setTimeout(() => {
        clearInterval(interval)
        setGenerationProgress(100)
        setIsGenerating(false)
        fetchGenerations(token, campaign.id)
      }, 10000)

    } catch (err: any) {
      setError(err.message || 'Generation failed')
      setIsGenerating(false)
    }
  }

  const handleRegenerate = async (generationId: string) => {
    if (!token) return
    try {
      await generationApi.regenerate(generationId, token)
      // Refresh after a delay
      setTimeout(() => {
        if (campaign) fetchGenerations(token, campaign.id)
      }, 3000)
    } catch (err) {
      console.error('Failed to regenerate:', err)
    }
  }

  const completedGenerations = generations.filter(g => g.status === 'completed')

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-64px)] flex">
        {/* Left Panel - Configuration */}
        <div className="w-96 border-r border-swiss-border bg-white overflow-y-auto">
          <div className="p-6">
            <div className="mb-6">
              <span className="text-label block mb-2">{campaign?.name || 'New Campaign'}</span>
              <h1 className="text-headline">Generate Ads</h1>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Step Indicator */}
            <div className="flex items-center gap-2 mb-6">
              {[1, 2, 3].map((s) => (
                <div key={s} className={`w-8 h-8 flex items-center justify-center text-sm font-medium ${
                  step >= s ? 'bg-lime text-swiss-black' : 'bg-swiss-surface text-swiss-muted'
                }`}>
                  {s}
                </div>
              ))}
            </div>

            {step === 1 && (
              <>
                <div className="mb-6">
                  <label className="text-label block mb-2">Campaign Message</label>
                  <textarea
                    className="input-swiss h-24 resize-none"
                    placeholder="Describe your campaign message..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-label">Headline Variations</label>
                    <button 
                      onClick={getAiSuggestions}
                      disabled={loadingSuggestions}
                      className="text-xs text-swiss-muted hover:text-swiss-black flex items-center gap-1"
                    >
                      <Icons.Wand />
                      {loadingSuggestions ? 'Thinking...' : 'AI Suggest'}
                    </button>
                  </div>
                  <div className="space-y-2">
                    {headlines.map((headline, i) => (
                      <input 
                        key={i}
                        type="text" 
                        className="input-swiss" 
                        placeholder={`Headline ${i + 1}`}
                        value={headline}
                        onChange={(e) => updateHeadline(i, e.target.value)}
                      />
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="text-label block mb-2">Call-to-Action</label>
                  <div className="grid grid-cols-2 gap-2">
                    {ctas.map((cta) => (
                      <label key={cta} className="flex items-center gap-2 p-3 border border-swiss-border cursor-pointer hover:bg-swiss-surface/30">
                        <input 
                          type="checkbox" 
                          checked={selectedCtas.includes(cta)}
                          onChange={() => toggleCta(cta)}
                          className="w-4 h-4" 
                        />
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

                <div className="mb-6">
                  <label className="text-label block mb-2">Visual Style</label>
                  <div className="space-y-2">
                    {styles.map((style) => (
                      <label 
                        key={style.id} 
                        className={`flex items-center gap-3 p-3 border cursor-pointer transition-colors ${
                          selectedStyle === style.id 
                            ? 'border-lime bg-lime/10' 
                            : 'border-swiss-border hover:bg-swiss-surface/30'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="style"
                          checked={selectedStyle === style.id}
                          onChange={() => setSelectedStyle(style.id)}
                          className="w-4 h-4"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{style.name}</p>
                          <p className="text-xs text-swiss-muted">{style.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
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
                    <p className="text-sm mt-1 truncate">{prompt || campaign?.name}</p>
                  </div>
                  
                  <div className="p-4 bg-swiss-surface/50">
                    <span className="text-label">Platforms</span>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {selectedPlatforms.map(p => (
                        <span key={p} className="text-xs px-2 py-1 bg-white border border-swiss-border capitalize">{p}</span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-swiss-surface/50">
                    <span className="text-label">Style</span>
                    <p className="text-sm mt-1 capitalize">{selectedStyle}</p>
                  </div>

                  <div className="p-4 bg-swiss-surface/50">
                    <span className="text-label">Expected Output</span>
                    <p className="text-sm mt-1">
                      {selectedPlatforms.length * headlines.filter(h => h.trim()).length * selectedCtas.length} variants
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setStep(2)} className="btn-secondary flex-1">Back</button>
                  <button 
                    onClick={handleGenerate}
                    disabled={isGenerating || selectedPlatforms.length === 0}
                    className="btn-primary flex-1 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <><Icons.Refresh /> Generating...</>
                    ) : (
                      <><Icons.Sparkles /> Generate Ads</>
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
                <p className="text-swiss-muted mb-6">Using GPT Image 1.5 & Gemini 3 Nano Banana Pro...</p>
                <div className="w-64 h-2 bg-swiss-border">
                  <div className="h-full bg-lime transition-all duration-500" style={{ width: `${generationProgress}%` }} />
                </div>
                <p className="text-sm text-swiss-muted mt-2">{generationProgress}% complete</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-title">Generated Variants ({completedGenerations.length})</h2>
                  {completedGenerations.length > 0 && (
                    <div className="flex gap-2">
                      <button className="btn-secondary text-sm">
                        <Icons.Download /> Export All
                      </button>
                    </div>
                  )}
                </div>

                {completedGenerations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-96 text-center">
                    <div className="w-20 h-20 bg-swiss-surface flex items-center justify-center mb-4">
                      <Icons.Sparkles />
                    </div>
                    <h3 className="text-title mb-2">No generations yet</h3>
                    <p className="text-swiss-muted max-w-md">
                      Configure your campaign and click Generate Ads to create AI-powered ad variations.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                    {completedGenerations.map((variant) => (
                      <div key={variant.id} className="card-swiss overflow-hidden group">
                        <div className="aspect-[4/5] bg-swiss-surface flex items-center justify-center relative">
                          {variant.imageUrl ? (
                            <img 
                              src={variant.imageUrl} 
                              alt={variant.headlines}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <>
                              <div className="absolute inset-0 bg-gradient-to-br from-swiss-surface to-white" />
                              <div className="relative z-10 text-center p-6">
                                <div className="w-16 h-16 bg-lime mx-auto mb-4" />
                                <p className="font-semibold text-sm">{JSON.parse(variant.headlines || '[""]')[0]}</p>
                                <p className="text-xs text-swiss-muted mt-2 capitalize">{variant.style} • {variant.platform}</p>
                              </div>
                            </>
                          )}
                          <div className="absolute inset-0 bg-swiss-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleRegenerate(variant.id)}
                                className="p-2 bg-white text-swiss-black"
                              >
                                <Icons.Refresh />
                              </button>
                              <button className="p-2 bg-lime text-swiss-black">
                                <Icons.Download />
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-4 border-t border-swiss-border">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm font-medium capitalize">{variant.platform}</span>
                              <span className="text-xs text-swiss-muted ml-2">{variant.style}</span>
                            </div>
                            <span className="text-lime"><Icons.Check /></span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default function GeneratePage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="h-[calc(100vh-64px)] flex items-center justify-center">
          <div className="text-swiss-muted">Loading...</div>
        </div>
      </DashboardLayout>
    }>
      <GeneratePageContent />
    </Suspense>
  )
}
