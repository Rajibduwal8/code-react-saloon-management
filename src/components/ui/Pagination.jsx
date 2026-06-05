import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ current = 1, total = 12, perPage = 10, totalEntries = 120 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderTop: '1px solid #F2EDE8' }}>
      <span style={{ fontSize: 12, color: 'var(--muted)' }}>
        Showing 1 to {perPage} of {totalEntries} entries
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <button className="page-btn"><ChevronLeft size={12} /></button>
        {[1, 2, 3, '...', total].map((p, i) => (
          <button key={i} className={`page-btn ${p === current ? 'active' : ''}`}>{p}</button>
        ))}
        <button className="page-btn"><ChevronRight size={12} /></button>
        <input
          style={{ width: 36, height: 28, border: '1px solid var(--sand)', borderRadius: 6, textAlign: 'center', fontSize: 12, marginLeft: 8 }}
          defaultValue={perPage}
        />
        <span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 4 }}>entries per page</span>
      </div>
    </div>
  )
}
