'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { dashboardApi, clientApi, campaignApi } from '@/lib/api'

const Icons = {
  Plus: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  ArrowRight: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  ),
  Users: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  Campaign: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
    </svg>
  ),
  Image: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Zap: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
}

interface DashboardStats {
  activeCampaigns: number
  totalGenerations: number
  totalClients: number
  totalBrandKits: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [token, setToken] = useState<string>('')
  const [stats, setStats] = useState<DashboardStats>({
    activeCampaigns: 0,
    totalGenerations: 0,
    totalClients: 0,
    totalBrandKits: 0,
  })
  const [clients, setClients] = useState<any[]>([])
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('advariant_token')
    const storedUser = localStorage.getItem('advariant_user')
    
    if (!storedToken) {
      router.push('/login')
      return
    }
    
    setToken(storedToken)
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    // Fetch dashboard data
    const fetchData = async () => {
      try {
        const [statsRes, clientsRes, campaignsRes] = await Promise.all([
          dashboardApi.stats(storedToken),
          clientApi.list(storedToken),
          campaignApi.list(storedToken),
        ])
        
        setStats({
          activeCampaigns: statsRes.activeCampaigns || 0,
          totalGenerations: statsRes.totalGenerations || 0,
          totalClients: statsRes.totalClients || 0,
          totalBrandKits: statsRes.totalBrandKits || 0,
        })
        setClients(clientsRes.clients.slice(0, 4))
        setCampaigns(campaignsRes.campaigns?.slice(0, 3) || [])
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const statItems = [
    { name: 'Active Clients', value: stats.totalClients.toString(), change: '+0', icon: Icons.Users },
    { name: 'Campaigns', value: campaigns.length.toString(), change: '+0', icon: Icons.Campaign },
    { name: 'Ads Generated', value: stats.totalGenerations.toString(), change: '+0', icon: Icons.Image },
    { name: 'Brand Kits', value: stats.totalBrandKits.toString(), change: '+0', icon: Icons.Zap },
  ]

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
            <h1 className="text-display">Dashboard</h1>
            <p className="text-swiss-muted mt-1">
              Welcome back, {user?.firstName || user?.email?.split('@')[0] || 'there'}. Here&apos;s what&apos;s happening.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/campaigns/new" className="btn-primary">
              <Icons.Plus />
              New Campaign
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statItems.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.name} className="card-swiss p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-lime flex items-center justify-center">
                    <Icon />
                  </div>
                  <span className="text-xs font-medium text-lime bg-lime/10 px-2 py-1">
                    {stat.change}
                  </span>
                </div>
                <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                <p className="text-sm text-swiss-muted">{stat.name}</p>
              </div>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Clients */}
          <div className="card-swiss">
            <div className="flex items-center justify-between p-5 border-b border-swiss-border">
              <h2 className="text-title">Recent Clients</h2>
              <Link href="/clients" className="text-sm text-swiss-muted hover:text-swiss-black inline-flex items-center gap-1">
                View all
                <Icons.ArrowRight />
              </Link>
            </div>
            <div className="divide-y divide-swiss-border">
              {clients.length === 0 ? (
                <div className="p-8 text-center text-swiss-muted">
                  No clients yet. <Link href="/clients/new" className="text-swiss-black underline">Add your first client</Link>
                </div>
              ) : (
                clients.map((client) => (
                  <div key={client.id} className="p-5 flex items-center justify-between hover:bg-swiss-surface/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-swiss-black text-white flex items-center justify-center text-sm font-medium">
                        {client.name?.charAt(0) || client.company?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="font-medium">{client.name}</p>
                        <p className="text-sm text-swiss-muted">{client.company}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{client.campaignCount || 0} campaigns</p>
                      <p className="text-xs text-swiss-muted">{client.brandKitCount || 0} brand kits</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t border-swiss-border bg-swiss-surface/30">
              <Link href="/clients/new" className="btn-secondary w-full">
                <Icons.Plus />
                Add New Client
              </Link>
            </div>
          </div>

          {/* Recent Campaigns */}
          <div className="card-swiss">
            <div className="flex items-center justify-between p-5 border-b border-swiss-border">
              <h2 className="text-title">Recent Campaigns</h2>
              <Link href="/campaigns" className="text-sm text-swiss-muted hover:text-swiss-black inline-flex items-center gap-1">
                View all
                <Icons.ArrowRight />
              </Link>
            </div>
            <div className="divide-y divide-swiss-border">
              {campaigns.length === 0 ? (
                <div className="p-8 text-center text-swiss-muted">
                  No campaigns yet. <Link href="/campaigns/new" className="text-swiss-black underline">Create your first campaign</Link>
                </div>
              ) : (
                campaigns.map((campaign) => (
                  <div key={campaign.id} className="p-5 hover:bg-swiss-surface/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">{campaign.name}</p>
                        <p className="text-sm text-swiss-muted">{campaign.client?.name || 'Unknown client'}</p>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 ${
                        campaign.status === 'active' 
                          ? 'bg-lime text-swiss-black' 
                          : campaign.status === 'draft'
                          ? 'bg-swiss-surface text-swiss-muted'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {campaign.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-swiss-muted">
                      <span>{campaign.generations?.length || 0} variants</span>
                      <span>•</span>
                      <span>{campaign.platforms ? JSON.parse(campaign.platforms).join(', ') : 'No platforms'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t border-swiss-border bg-swiss-surface/30">
              <Link href="/campaigns/new" className="btn-secondary w-full">
                <Icons.Plus />
                Create Campaign
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 card-swiss p-6">
          <h2 className="text-title mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link href="/clients/new" className="flex items-center gap-4 p-4 border border-swiss-border hover:border-swiss-black hover:bg-swiss-surface/30 transition-colors">
              <div className="w-12 h-12 bg-lime flex items-center justify-center">
                <Icons.Plus />
              </div>
              <div>
                <p className="font-medium">Add Client</p>
                <p className="text-sm text-swiss-muted">New client or brand</p>
              </div>
            </Link>
            <Link href="/brand-kits" className="flex items-center gap-4 p-4 border border-swiss-border hover:border-swiss-black hover:bg-swiss-surface/30 transition-colors">
              <div className="w-12 h-12 bg-swiss-surface flex items-center justify-center">
                <Icons.Image />
              </div>
              <div>
                <p className="font-medium">Brand Kits</p>
                <p className="text-sm text-swiss-muted">Manage brand assets</p>
              </div>
            </Link>
            <Link href="/campaigns" className="flex items-center gap-4 p-4 border border-swiss-border hover:border-swiss-black hover:bg-swiss-surface/30 transition-colors">
              <div className="w-12 h-12 bg-swiss-surface flex items-center justify-center">
                <Icons.Campaign />
              </div>
              <div>
                <p className="font-medium">All Campaigns</p>
                <p className="text-sm text-swiss-muted">View and manage</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
