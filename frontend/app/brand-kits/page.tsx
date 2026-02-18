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
  Palette: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  ),
  Image: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  Type: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h7" />
    </svg>
  ),
}

const mockBrandKits = [
  {
    id: '1',
    name: 'Acme Corp Brand',
    client: 'Acme Corp',
    colors: ['#D4FF00', '#000000', '#FFFFFF', '#616161'],
    fonts: { heading: 'Inter', body: 'Inter' },
    logoCount: 3,
  },
  {
    id: '2',
    name: 'Globex Industries',
    client: 'Globex Industries',
    colors: ['#0066FF', '#FF6600', '#FFFFFF', '#1A1A1A'],
    fonts: { heading: 'Montserrat', body: 'Open Sans' },
    logoCount: 2,
  },
]

export default function BrandKitsPage() {
  const router = useRouter()
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('advariant_token')
    if (!token) {
      router.push('/login')
      return
    }
    fetchClients(token)
  }, [router])

  const fetchClients = async (token: string) => {
    try {
      const res = await clientApi.list(token)
      setClients(res.clients)
    } catch (err) {
      console.error('Failed to fetch clients:', err)
    } finally {
      setLoading(false)
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
            <h1 className="text-display">Brand Kits</h1>
            <p className="text-swiss-muted mt-1">Manage brand colors, fonts, and logos for your clients.</p>
          </div>
          <Link href="/brand-kits/new" className="btn-primary">
            <Icons.Plus />
            New Brand Kit
          </Link>
        </div>

        {/* Brand Kits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockBrandKits.map((kit) => (
            <div key={kit.id} className="card-swiss p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-swiss-surface flex items-center justify-center">
                  <Icons.Palette />
                </div>
                <span className="text-xs text-swiss-muted">{kit.logoCount} logos</span>
              </div>

              <h3 className="text-title mb-1">{kit.name}</h3>
              <p className="text-swiss-muted text-sm mb-4">{kit.client}</p>

              {/* Color Palette */}
              <div className="mb-4">
                <p className="text-xs text-swiss-muted mb-2">Colors</p>
                <div className="flex gap-2">
                  {kit.colors.map((color) => (
                    <div
                      key={color}
                      className="w-8 h-8 border border-swiss-border"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Fonts */}
              <div className="mb-6">
                <p className="text-xs text-swiss-muted mb-2">Typography</p>
                <div className="space-y-1 text-sm">
                  <p><span className="text-swiss-muted">Heading:</span> {kit.fonts.heading}</p>
                  <p><span className="text-swiss-muted">Body:</span> {kit.fonts.body}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Link href={`/brand-kits/${kit.id}`} className="flex-1 btn-secondary text-sm text-center">
                  Edit
                </Link>
                <Link href={`/campaigns/new?brandKitId=${kit.id}`} className="flex-1 btn-primary text-sm text-center">
                  Use
                </Link>
              </div>
            </div>
          ))}

          {/* Add New Card */}
          <Link href="/brand-kits/new" className="card-swiss p-6 border-dashed border-2 border-swiss-border hover:border-swiss-black hover:bg-swiss-surface/30 transition-colors flex flex-col items-center justify-center text-center min-h-[320px]">
            <div className="w-16 h-16 bg-lime flex items-center justify-center mb-4">
              <Icons.Plus />
            </div>
            <h3 className="text-title mb-2">Create Brand Kit</h3>
            <p className="text-swiss-muted text-sm">Add colors, fonts, and logos</p>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}
