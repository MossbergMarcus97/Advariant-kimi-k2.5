'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const Icons = {
  Upload: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  ),
  Download: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  Image: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Filter: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  ),
}

const mockAssets = [
  { id: '1', name: 'Summer Sale Hero', type: 'image', campaign: 'Summer Sale 2025', platform: 'meta', created: '2 hours ago', size: '1080x1080' },
  { id: '2', name: 'Product Launch Story', type: 'image', campaign: 'Product Launch Q1', platform: 'meta', created: '5 hours ago', size: '1080x1920' },
  { id: '3', name: 'Google Display v1', type: 'image', campaign: 'Brand Awareness', platform: 'google', created: '1 day ago', size: '1200x628' },
  { id: '4', name: 'TikTok Video Thumb', type: 'image', campaign: 'Summer Sale 2025', platform: 'tiktok', created: '1 day ago', size: '1080x1920' },
  { id: '5', name: 'LinkedIn Sponsored', type: 'image', campaign: 'B2B Campaign', platform: 'linkedin', created: '2 days ago', size: '1200x628' },
  { id: '6', name: 'Instagram Carousel 1', type: 'image', campaign: 'Summer Sale 2025', platform: 'meta', created: '2 days ago', size: '1080x1080' },
]

const platformColors: Record<string, string> = {
  meta: 'bg-blue-100 text-blue-700',
  google: 'bg-red-100 text-red-700',
  tiktok: 'bg-black text-white',
  linkedin: 'bg-blue-600 text-white',
}

export default function AssetsPage() {
  const router = useRouter()
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('advariant_token')
    if (!token) {
      router.push('/login')
      return
    }
    setLoading(false)
  }, [router])

  const filteredAssets = filter === 'all' 
    ? mockAssets 
    : mockAssets.filter(a => a.platform === filter)

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-swiss-muted">Loading...</div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-display">Assets</h1>
            <p className="text-swiss-muted mt-1">Manage your generated ads and uploaded assets.</p>
          </div>
          <div className="flex gap-3">
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="input-swiss"
            >
              <option value="all">All Platforms</option>
              <option value="meta">Meta</option>
              <option value="google">Google</option>
              <option value="tiktok">TikTok</option>
              <option value="linkedin">LinkedIn</option>
            </select>
            <button className="btn-primary">
              <Icons.Upload />
              Upload
            </button>
          </div>
        </div>

        {/* Assets Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAssets.map((asset) => (
            <div key={asset.id} className="card-swiss overflow-hidden group">
              {/* Preview */}
              <div className="aspect-[4/5] bg-swiss-surface flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-swiss-surface to-white" />
                <div className="relative z-10 text-center p-6">
                  <div className="w-16 h-16 bg-lime mx-auto mb-4 flex items-center justify-center">
                    <Icons.Image />
                  </div>
                  <p className="text-xs text-swiss-muted">{asset.size}</p>
                </div>
                
                {/* Hover Actions */}
                <div className="absolute inset-0 bg-swiss-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-2">
                    <button className="p-2 bg-lime text-swiss-black">
                      <Icons.Download />
                    </button>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 border-t border-swiss-border">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-sm truncate">{asset.name}</p>
                    <p className="text-xs text-swiss-muted">{asset.campaign}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-0.5 ${platformColors[asset.platform] || 'bg-swiss-surface text-swiss-muted'}`}>
                    {asset.platform}
                  </span>
                  <span className="text-xs text-swiss-muted">{asset.created}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
