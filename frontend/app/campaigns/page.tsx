'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { campaignApi } from '@/lib/api'

const Icons = {
  Plus: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  Search: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Filter: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  ),
  Sparkles: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
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

const statusColors: Record<string, string> = {
  active: 'bg-lime text-swiss-black',
  draft: 'bg-swiss-surface text-swiss-muted',
  paused: 'bg-gray-200 text-gray-600',
  completed: 'bg-blue-100 text-blue-700',
}

export default function CampaignsPage() {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState('')

  useEffect(() => {
    const storedToken = localStorage.getItem('advariant_token')
    if (!storedToken) {
      router.push('/login')
      return
    }
    setToken(storedToken)
    fetchCampaigns(storedToken)
  }, [router])

  const fetchCampaigns = async (authToken: string) => {
    try {
      const res = await campaignApi.list(authToken, { status: statusFilter, search })
      setCampaigns(res.campaigns || [])
    } catch (err) {
      console.error('Failed to fetch campaigns:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) {
      fetchCampaigns(token)
    }
  }, [statusFilter, token])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (token) {
      fetchCampaigns(token)
    }
  }

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
            <h1 className="text-display">Campaigns</h1>
            <p className="text-swiss-muted mt-1">Manage and generate ads for your campaigns.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/campaigns/new" className="btn-primary">
              <Icons.Plus />
              New Campaign
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icons.Search />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-swiss pl-10"
              placeholder="Search campaigns..."
            />
          </form>
          
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-swiss"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Campaigns Table */}
        {campaigns.length === 0 ? (
          <div className="card-swiss p-12 text-center">
            <div className="w-16 h-16 bg-swiss-surface flex items-center justify-center mx-auto mb-4">
              <Icons.Sparkles />
            </div>
            <h3 className="text-title mb-2">No campaigns yet</h3>
            <p className="text-swiss-muted mb-6">Create your first campaign to start generating ads.</p>
            <Link href="/campaigns/new" className="btn-primary">
              <Icons.Plus />
              Create Campaign
            </Link>
          </div>
        ) : (
          <div className="card-swiss overflow-hidden">
            <table className="w-full">
              <thead className="bg-swiss-surface/50 border-b border-swiss-border">
                <tr>
                  <th className="text-left text-label px-6 py-4">Campaign</th>
                  <th className="text-left text-label px-6 py-4">Client</th>
                  <th className="text-left text-label px-6 py-4">Platforms</th>
                  <th className="text-left text-label px-6 py-4">Status</th>
                  <th className="text-left text-label px-6 py-4">Variants</th>
                  <th className="text-left text-label px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-swiss-border">
                {campaigns.map((campaign) => {
                  const platforms = campaign.platforms ? JSON.parse(campaign.platforms) : []
                  return (
                    <tr key={campaign.id} className="hover:bg-swiss-surface/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium">{campaign.name}</p>
                          <p className="text-sm text-swiss-muted">{campaign.description?.slice(0, 50)}...</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">{campaign.client?.name || 'Unknown'}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1 flex-wrap">
                          {platforms.map((platform: string) => (
                            <span key={platform} className="text-xs px-2 py-1 bg-swiss-surface border border-swiss-border capitalize">
                              {platform}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium px-2 py-1 ${statusColors[campaign.status] || statusColors.draft}`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">{campaign.generations?.length || 0}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Link 
                            href={`/campaigns/${campaign.id}/generate`}
                            className="btn-primary text-xs"
                          >
                            <Icons.Sparkles />
                            Generate
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
