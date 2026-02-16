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
  More: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
  ),
  Building: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  Folder: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  ),
  Palette: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  ),
}

const clients = [
  { 
    id: 1, 
    name: 'Acme Corporation', 
    industry: 'Technology',
    website: 'acme.com',
    campaigns: 4, 
    brandKits: 1,
    assets: 128,
    lastActive: '2 hours ago',
    status: 'Active'
  },
  { 
    id: 2, 
    name: 'Globex Industries', 
    industry: 'Manufacturing',
    website: 'globex.com',
    campaigns: 2, 
    brandKits: 1,
    assets: 64,
    lastActive: '5 hours ago',
    status: 'Active'
  },
  { 
    id: 3, 
    name: 'Initech LLC', 
    industry: 'Software',
    website: 'initech.com',
    campaigns: 6, 
    brandKits: 2,
    assets: 256,
    lastActive: '1 day ago',
    status: 'Active'
  },
  { 
    id: 4, 
    name: 'Massive Dynamic', 
    industry: 'Research',
    website: 'massivedynamic.com',
    campaigns: 1, 
    brandKits: 1,
    assets: 32,
    lastActive: '2 days ago',
    status: 'Paused'
  },
  { 
    id: 5, 
    name: 'Soylent Corp', 
    industry: 'Food & Beverage',
    website: 'soylent.com',
    campaigns: 3, 
    brandKits: 1,
    assets: 96,
    lastActive: '3 days ago',
    status: 'Active'
  },
]

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All')

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.industry.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === 'All' || client.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-display">Clients</h1>
            <p className="text-swiss-muted mt-1">Manage your client accounts and brand assets</p>
          </div>
          <Link href="/clients/new" className="btn-primary self-start">
            <Icons.Plus />
            Add Client
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
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-swiss pl-10"
            />
          </div>
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="input-swiss w-auto"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Paused">Paused</option>
          </select>
        </div>

        {/* Clients Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredClients.map((client) => (
            <div key={client.id} className="card-swiss p-5 hover:border-swiss-black transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-swiss-black text-white flex items-center justify-center text-lg font-medium">
                    {client.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{client.name}</h3>
                    <p className="text-sm text-swiss-muted">{client.industry}</p>
                  </div>
                </div>
                <button className="p-1 text-swiss-muted hover:text-swiss-black">
                  <Icons.More />
                </button>
              </div>

              <div className="flex items-center gap-2 text-sm text-swiss-muted mb-4">
                <Icons.Building />
                <span>{client.website}</span>
              </div>

              <div className="grid grid-cols-3 gap-4 py-4 border-y border-swiss-border">
                <div className="text-center">
                  <p className="text-lg font-semibold">{client.campaigns}</p>
                  <p className="text-xs text-swiss-muted">Campaigns</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold">{client.brandKits}</p>
                  <p className="text-xs text-swiss-muted">Brand Kits</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold">{client.assets}</p>
                  <p className="text-xs text-swiss-muted">Assets</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <span className={`text-xs font-medium px-2 py-1 ${
                  client.status === 'Active' 
                    ? 'bg-lime text-swiss-black' 
                    : 'bg-swiss-surface text-swiss-muted'
                }`}>
                  {client.status}
                </span>
                <span className="text-xs text-swiss-muted">{client.lastActive}</span>
              </div>

              <div className="flex gap-2 mt-4">
                <Link 
                  href={`/clients/${client.id}/campaigns`}
                  className="flex-1 btn-secondary text-sm py-2"
                >
                  <Icons.Folder />
                  Campaigns
                </Link>
                <Link 
                  href={`/clients/${client.id}/brand-kit`}
                  className="flex-1 btn-secondary text-sm py-2"
                >
                  <Icons.Palette />
                  Brand Kit
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-swiss-surface flex items-center justify-center mx-auto mb-4">
              <Icons.Building />
            </div>
            <h3 className="text-lg font-medium mb-2">No clients found</h3>
            <p className="text-swiss-muted mb-4">Get started by adding your first client</p>
            <Link href="/clients/new" className="btn-primary">
              <Icons.Plus />
              Add Client
            </Link>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
