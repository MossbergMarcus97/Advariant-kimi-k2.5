'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Link from 'next/link'

const Icons = {
  Plus: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  Search: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Filter: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  ),
  More: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
  ),
  Target: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Image: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Zap: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  Play: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Pause: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
}

const campaigns = [
  {
    id: 1,
    name: 'Summer Sale 2025',
    client: 'Acme Corporation',
    objective: 'Conversions',
    platforms: ['Meta', 'Google'],
    status: 'Active',
    variants: 48,
    generated: 156,
    created: '2025-01-15',
    lastModified: '2 hours ago',
  },
  {
    id: 2,
    name: 'Product Launch Q1',
    client: 'Initech LLC',
    objective: 'Awareness',
    platforms: ['Meta', 'TikTok', 'LinkedIn'],
    status: 'Draft',
    variants: 12,
    generated: 0,
    created: '2025-01-10',
    lastModified: '1 day ago',
  },
  {
    id: 3,
    name: 'Brand Awareness Campaign',
    client: 'Globex Industries',
    objective: 'Awareness',
    platforms: ['Google', 'LinkedIn'],
    status: 'Active',
    variants: 36,
    generated: 128,
    created: '2025-01-05',
    lastModified: '3 days ago',
  },
  {
    id: 4,
    name: 'Holiday Special',
    client: 'Soylent Corp',
    objective: 'Conversions',
    platforms: ['Meta', 'Google', 'TikTok'],
    status: 'Paused',
    variants: 24,
    generated: 96,
    created: '2024-12-20',
    lastModified: '1 week ago',
  },
  {
    id: 5,
    name: 'New Feature Announcement',
    client: 'Initech LLC',
    objective: 'Consideration',
    platforms: ['LinkedIn', 'Twitter'],
    status: 'Active',
    variants: 18,
    generated: 72,
    created: '2025-01-08',
    lastModified: '5 days ago',
  },
]

export default function CampaignsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.client.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'All' || campaign.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-display">Campaigns</h1>
            <p className="text-swiss-muted mt-1">Create and manage your ad campaigns</p>
          </div>
          <Link href="/campaigns/new" className="btn-primary self-start">
            <Icons.Plus />
            New Campaign
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-swiss-muted">
              <Icons.Search />
            </div>
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-swiss pl-10"
            />
          </div>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-swiss w-auto"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Paused">Paused</option>
          </select>
        </div>

        {/* Campaigns Table */}
        <div className="card-swiss overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-swiss-border bg-swiss-surface/50">
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-swiss-muted px-5 py-4">Campaign</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-swiss-muted px-5 py-4">Client</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-swiss-muted px-5 py-4">Objective</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-swiss-muted px-5 py-4">Platforms</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-swiss-muted px-5 py-4">Status</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-swiss-muted px-5 py-4">Variants</th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-swiss-muted px-5 py-4">Last Modified</th>
                  <th className="px-5 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-swiss-border">
                {filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-swiss-surface/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-medium">{campaign.name}</div>
                      <div className="text-xs text-swiss-muted">Created {campaign.created}</div>
                    </td>
                    <td className="px-5 py-4 text-sm">{campaign.client}</td>
                    <td className="px-5 py-4">
                      <span className="text-xs px-2 py-1 bg-swiss-surface">{campaign.objective}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1">
                        {campaign.platforms.map((platform) => (
                          <span key={platform} className="text-xs px-2 py-1 border border-swiss-border">
                            {platform}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-medium px-2 py-1 ${
                        campaign.status === 'Active' 
                          ? 'bg-lime text-swiss-black' 
                          : campaign.status === 'Draft'
                          ? 'bg-swiss-surface text-swiss-muted'
                          : 'bg-swiss-text text-white'
                      }`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-sm font-medium">{campaign.variants}</div>
                      {campaign.generated > 0 && (
                        <div className="text-xs text-swiss-muted">{campaign.generated} generated</div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-sm text-swiss-muted">{campaign.lastModified}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {campaign.status === 'Active' ? (
                          <button className="p-2 text-swiss-muted hover:text-swiss-black" title="Pause">
                            <Icons.Pause />
                          </button>
                        ) : (
                          <button className="p-2 text-swiss-muted hover:text-swiss-black" title="Activate">
                            <Icons.Play />
                          </button>
                        )}
                        <Link 
                          href={`/campaigns/${campaign.id}/generate`}
                          className="p-2 text-swiss-muted hover:text-lime"
                          title="Generate Ads"
                        >
                          <Icons.Zap />
                        </Link>
                        <button className="p-2 text-swiss-muted hover:text-swiss-black">
                          <Icons.More />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredCampaigns.length === 0 && (
          <div className="text-center py-16 card-swiss mt-4">
            <div className="w-16 h-16 bg-swiss-surface flex items-center justify-center mx-auto mb-4">
              <Icons.Target />
            </div>
            <h3 className="text-lg font-medium mb-2">No campaigns found</h3>
            <p className="text-swiss-muted mb-4">Create your first campaign to get started</p>
            <Link href="/campaigns/new" className="btn-primary">
              <Icons.Plus />
              Create Campaign
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
