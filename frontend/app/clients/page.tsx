'use client'

import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { clientApi } from '@/lib/api'

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
  Building: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  Campaign: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
    </svg>
  ),
  Image: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  More: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
  ),
}

export default function ClientsPage() {
  const router = useRouter()
  const [clients, setClients] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState('')

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
    } catch (err) {
      console.error('Failed to fetch clients:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(search.toLowerCase()) ||
    client.company.toLowerCase().includes(search.toLowerCase())
  )

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
            <h1 className="text-display">Clients</h1>
            <p className="text-swiss-muted mt-1">Manage your clients and their brand assets.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/clients/new" className="btn-primary">
              <Icons.Plus />
              Add Client
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icons.Search />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-swiss pl-10"
              placeholder="Search clients..."
            />
          </div>
        </div>

        {/* Clients Grid */}
        {filteredClients.length === 0 ? (
          <div className="card-swiss p-12 text-center">
            <div className="w-16 h-16 bg-swiss-surface flex items-center justify-center mx-auto mb-4">
              <Icons.Building />
            </div>
            <h3 className="text-title mb-2">No clients yet</h3>
            <p className="text-swiss-muted mb-6">Get started by adding your first client.</p>
            <Link href="/clients/new" className="btn-primary">
              <Icons.Plus />
              Add Client
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <div key={client.id} className="card-swiss p-6 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-swiss-black text-white flex items-center justify-center text-lg font-medium">
                    {client.name?.charAt(0) || client.company?.charAt(0) || '?'}
                  </div>
                  <button className="text-swiss-muted hover:text-swiss-black opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icons.More />
                  </button>
                </div>
                
                <h3 className="text-title mb-1">{client.name}</h3>
                <p className="text-swiss-muted text-sm mb-4">{client.company}</p>
                
                <div className="flex items-center gap-4 text-sm text-swiss-muted mb-4">
                  <span className="flex items-center gap-1">
                    <Icons.Campaign />
                    {client.campaignCount || 0} campaigns
                  </span>
                  <span className="flex items-center gap-1">
                    <Icons.Image />
                    {client.brandKitCount || 0} brand kits
                  </span>
                </div>

                <div className="flex gap-2">
                  <Link 
                    href={`/clients/${client.id}`} 
                    className="flex-1 btn-secondary text-sm text-center"
                  >
                    View
                  </Link>
                  <Link 
                    href={`/campaigns/new?clientId=${client.id}`} 
                    className="flex-1 btn-primary text-sm text-center"
                  >
                    New Campaign
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
