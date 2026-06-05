import React, { useState } from 'react'
import { Search, Plus } from 'lucide-react'

const SERVICES = [
  { duration: '60 MIN', name: 'Detoxifying Clay Mask Facial', price: 'NRS 15,000', description: 'Description', includes: '', excludes: '' },
  { duration: '90 MIN', name: 'Aromatherapy Full Body Spa', price: 'NRS 15,000', description: 'Description', includes: '', excludes: '' },
  { duration: '40 MIN', name: 'Lamination Brow Architecture', price: 'NRS 15,000', description: 'Description', includes: '', excludes: '' },
  ...Array(9).fill({ duration: '60 MIN', name: 'Lamination Brow Architecture', price: 'NRS 15,000', description: 'Description', includes: '', excludes: '' }),
]

export default function ServiceMenu() {
  const [search, setSearch] = useState('')

  const filtered = SERVICES.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ padding: '0 0 32px' }}>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div className="page-title">Treatment & Product Menu</div>
            <div className="page-subtitle">Curate luxury formulations, products, pricing, session parameters, and categories.</div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div className="search-bar">
              <Search size={13} color="var(--muted)" />
              <input placeholder="Search ............" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="btn-primary"><Plus size={13} /> Add Services</button>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 28px 0', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {filtered.map((s, i) => (
          <div key={i} className="service-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ background: 'var(--sand)', color: 'var(--brown)', fontSize: 10, fontWeight: 700, borderRadius: 4, padding: '3px 8px', letterSpacing: '0.04em' }}>{s.duration}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--dark)' }}>{s.price}</span>
            </div>
            <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 15, fontWeight: 600, color: 'var(--dark)', marginBottom: 4 }}>{s.name}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>{s.description}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>Includes: {s.includes}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 14 }}>Excludes: {s.excludes}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--sand)', paddingTop: 10 }}>
              <span style={{ fontSize: 11, color: '#4CAF50', fontWeight: 600 }}>• ACTIVE</span>
              <button style={{ background: 'none', border: 'none', fontSize: 11, color: 'var(--brown)', fontWeight: 600, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>QUICK SELECT</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
