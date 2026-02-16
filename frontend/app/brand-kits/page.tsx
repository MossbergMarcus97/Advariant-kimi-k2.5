'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import Link from 'next/link'

const Icons = {
  Plus: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  ),
  Palette: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  ),
  Edit: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  Check: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
}

const brandKits = [
  {
    id: 1,
    name: 'Acme Corporation',
    client: 'Acme Corporation',
    colors: ['#FF6B35', '#004E89', '#FFFFFF'],
    fonts: ['Montserrat', 'Open Sans'],
    logo: true,
    lastModified: '2 days ago',
  },
  {
    id: 2,
    name: 'Globex Industries',
    client: 'Globex Industries',
    colors: ['#1A365D', '#2B6CB0', '#E2E8F0'],
    fonts: ['Inter', 'Roboto'],
    logo: true,
    lastModified: '1 week ago',
  },
  {
    id: 3,
    name: 'Initech Brand',
    client: 'Initech LLC',
    colors: ['#D4FF00', '#000000', '#F7F7F7'],
    fonts: ['Söhne', 'Inter'],
    logo: true,
    lastModified: '3 days ago',
  },
]

export default function BrandKitsPage() {
  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-display">Brand Kits</h1>
            <p className="text-swiss-muted mt-1">Manage brand guidelines, colors, and assets</p>
          </div>
          <Link href="/brand-kits/new" className="btn-primary self-start">
            <Icons.Plus />
            New Brand Kit
          </Link>
        </div>

        {/* Brand Kits Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {brandKits.map((kit) => (
            <div key={kit.id} className="card-swiss overflow-hidden">
              {/* Color Preview */}
              <div className="flex h-16">
                {kit.colors.map((color, i) => (
                  <div 
                    key={i} 
                    className="flex-1"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-title">{kit.name}</h3>
                    <p className="text-sm text-swiss-muted">{kit.client}</p>
                  </div>
                  <button className="p-2 text-swiss-muted hover:text-swiss-black">
                    <Icons.Edit />
                  </button>
                </div>

                {/* Colors */}
                <div className="mb-4">
                  <span className="text-label block mb-2">Colors</span>
                  <div className="flex gap-2">
                    {kit.colors.map((color, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <div 
                          className="w-6 h-6 border border-swiss-border"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-xs text-swiss-muted font-mono">{color}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fonts */}
                <div className="mb-4">
                  <span className="text-label block mb-2">Typography</span>
                  <div className="flex flex-wrap gap-2">
                    {kit.fonts.map((font, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-swiss-surface">
                        {font}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Logo Status */}
                <div className="flex items-center justify-between pt-4 border-t border-swiss-border">
                  <div className="flex items-center gap-2">
                    {kit.logo ? (
                      <>
                        <span className="text-lime">
                          <Icons.Check />
                        </span>
                        <span className="text-sm">Logo uploaded</span>
                      </>
                    ) : (
                      <span className="text-sm text-swiss-muted">No logo</span>
                    )}
                  </div>
                  <span className="text-xs text-swiss-muted">{kit.lastModified}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Card */}
          <Link href="/brand-kits/new" className="card-swiss p-6 flex flex-col items-center justify-center text-center hover:border-lime transition-colors min-h-[300px]">
            <div className="w-16 h-16 bg-swiss-surface flex items-center justify-center mb-4">
              <Icons.Plus />
            </div>
            <h3 className="text-title mb-2">Create Brand Kit</h3>
            <p className="text-sm text-swiss-muted">Add colors, fonts, and logos for a new client</p>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}
