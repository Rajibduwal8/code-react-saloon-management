import React, { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const PERIODS = ['This Week', 'This Month', 'Last 3 Months', 'This Year']

const REVENUE_DATA = [
  { month: 'Jan', revenue: 95000, expenses: 42000, profit: 53000 },
  { month: 'Feb', revenue: 110000, expenses: 48000, profit: 62000 },
  { month: 'Mar', revenue: 98000, expenses: 44000, profit: 54000 },
  { month: 'Apr', revenue: 135000, expenses: 55000, profit: 80000 },
  { month: 'May', revenue: 150000, expenses: 60000, profit: 90000 },
  { month: 'Jun', revenue: 128000, expenses: 52000, profit: 76000 },
]

const APPOINTMENTS_DATA = [
  { day: 'Mon', clients: 18, students: 7 },
  { day: 'Tue', clients: 22, students: 10 },
  { day: 'Wed', clients: 19, students: 8 },
  { day: 'Thu', clients: 28, students: 12 },
  { day: 'Fri', clients: 24, students: 9 },
  { day: 'Sat', clients: 30, students: 14 },
  { day: 'Sun', clients: 15, students: 5 },
]

const SERVICE_MIX = [
  { name: 'Facial Treatments', value: 38, color: '#C9A882' },
  { name: 'Body Spa', value: 27, color: '#8B5E3C' },
  { name: 'Brow & Lash', value: 20, color: '#E8773A' },
  { name: 'Hair Services', value: 15, color: '#F2DFD0' },
]

const TOP_SERVICES = [
  { name: 'Detoxifying Clay Mask Facial', bookings: 142, revenue: 'NPR 213,000', growth: '+12%', trend: 'up' },
  { name: 'Aromatherapy Full Body Spa', bookings: 98, revenue: 'NPR 147,000', growth: '+8%', trend: 'up' },
  { name: 'Lamination Brow Architecture', bookings: 76, revenue: 'NPR 114,000', growth: '+21%', trend: 'up' },
  { name: 'Advanced Hair Balayage', bookings: 54, revenue: 'NPR 81,000', growth: '-3%', trend: 'down' },
  { name: 'Deep Tissue Massage', bookings: 43, revenue: 'NPR 64,500', growth: '+5%', trend: 'up' },
]

const STAFF_PERF = [
  { name: 'Sita Sharma', role: 'Hair Stylist', sessions: 87, revenue: 'NPR 130,500', rating: 4.9, completion: 96 },
  { name: 'Ram Thapa', role: 'Massage Therapist', sessions: 74, revenue: 'NPR 111,000', rating: 4.8, completion: 94 },
  { name: 'Anita Rai', role: 'Nail Technician', sessions: 62, revenue: 'NPR 93,000', rating: 4.7, completion: 90 },
  { name: 'Binod KC', role: 'Skincare Specialist', sessions: 58, revenue: 'NPR 87,000', rating: 4.6, completion: 88 },
  { name: 'Priya Lama', role: 'Brow Artist', sessions: 51, revenue: 'NPR 76,500', rating: 4.9, completion: 97 },
]

const KPIS = [
  { label: 'Total Revenue', value: 'NPR 716,000', sub: '↑ 18.4% vs last period', accent: '#4CAF50' },
  { label: 'Total Appointments', value: '628', sub: '↑ 12.1% vs last period', accent: '#4CAF50' },
  { label: 'Avg. Ticket Value', value: 'NPR 1,140', sub: '↑ 5.7% vs last period', accent: '#4CAF50' },
  { label: 'Completion Rate', value: '93.2%', sub: '↓ 1.2% vs last period', accent: '#E05C5C' },
  { label: 'New Clients', value: '84', sub: '↑ 22% vs last period', accent: '#4CAF50' },
  { label: 'Course Enrollments', value: '37', sub: '↑ 9.1% vs last period', accent: '#4CAF50' },
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'white', border: '1px solid var(--sand)', borderRadius: 10, padding: '10px 14px', fontSize: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <div style={{ fontWeight: 700, color: 'var(--dark)', marginBottom: 6 }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: <span style={{ fontWeight: 600 }}>{typeof p.value === 'number' && p.value > 1000 ? `NPR ${p.value.toLocaleString()}` : p.value}</span>
        </div>
      ))}
    </div>
  )
}

function RatingStars({ rating }) {
  return (
    <span style={{ color: '#F57F17', fontSize: 11, letterSpacing: '0.04em' }}>
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
      <span style={{ color: 'var(--muted)', marginLeft: 4 }}>{rating}</span>
    </span>
  )
}

export default function Analytics() {
  const [period, setPeriod] = useState('This Month')

  return (
    <div style={{ padding: '0 0 40px' }}>
      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div className="page-title">Analytics</div>
            <div className="page-subtitle">Business intelligence, performance metrics, and revenue insights.</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {PERIODS.map(p => (
              <button key={p} onClick={() => setPeriod(p)} style={{
                border: '1px solid', borderRadius: 999, padding: '6px 14px', fontSize: 11.5, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                borderColor: period === p ? 'var(--dark)' : 'var(--sand)',
                background: period === p ? 'var(--dark)' : 'white',
                color: period === p ? 'white' : 'var(--muted)',
                fontWeight: period === p ? 600 : 400, transition: 'all 0.15s',
              }}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '0 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* KPI Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14 }}>
          {KPIS.map(k => (
            <div key={k.label} className="stat-card" style={{ padding: '16px' }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 10 }}>{k.label}</div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: k.value.length > 8 ? 16 : 22, fontWeight: 700, color: 'var(--dark)', marginBottom: 6, lineHeight: 1.2 }}>{k.value}</div>
              <div style={{ fontSize: 10, color: k.accent, fontWeight: 600 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* Revenue & Appointments Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16 }}>
          {/* Revenue Area Chart */}
          <div className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 15, fontWeight: 600, color: 'var(--dark)' }}>Revenue Overview</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>Revenue vs Expenses vs Profit</div>
              </div>
              <div style={{ display: 'flex', gap: 14, fontSize: 10 }}>
                {[{ l: 'Revenue', c: '#C9A882' }, { l: 'Expenses', c: '#E8773A' }, { l: 'Profit', c: '#4CAF50' }].map(i => (
                  <span key={i.l} style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--muted)', fontWeight: 600 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: i.c, display: 'inline-block' }} />{i.l}
                  </span>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A882" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#C9A882" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F2EDE8" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--muted)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--muted)' }} tickFormatter={v => `${v/1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#C9A882" strokeWidth={2} fill="url(#revGrad)" />
                <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#E8773A" strokeWidth={2} fill="none" strokeDasharray="4 2" />
                <Area type="monotone" dataKey="profit" name="Profit" stroke="#4CAF50" strokeWidth={2} fill="url(#profGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Service Mix Donut */}
          <div className="stat-card">
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 15, fontWeight: 600, color: 'var(--dark)' }}>Service Mix</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>Revenue by service category</div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={SERVICE_MIX} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value">
                  {SERVICE_MIX.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 8 }}>
              {SERVICE_MIX.map(s => (
                <div key={s.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>{s.name}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--dark)' }}>{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Appointments + Staff Perf Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Appointments Bar */}
          <div className="stat-card">
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 15, fontWeight: 600, color: 'var(--dark)' }}>Daily Appointments</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>Clients vs Students this week</div>
              </div>
              <div style={{ display: 'flex', gap: 12, fontSize: 10 }}>
                {[{ l: 'Clients', c: '#8B5E3C' }, { l: 'Students', c: '#C9A882' }].map(i => (
                  <span key={i.l} style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--muted)', fontWeight: 600 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: i.c, display: 'inline-block' }} />{i.l}
                  </span>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={APPOINTMENTS_DATA} barSize={14} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F2EDE8" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--muted)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--muted)' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="clients" name="Clients" fill="#8B5E3C" radius={[3, 3, 0, 0]} />
                <Bar dataKey="students" name="Students" fill="#C9A882" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Services */}
          <div className="stat-card">
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 15, fontWeight: 600, color: 'var(--dark)' }}>Top Services</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>By bookings and revenue</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {TOP_SERVICES.map((s, i) => (
                <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < TOP_SERVICES.length - 1 ? '1px solid #F2EDE8' : 'none' }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, background: 'var(--sand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'var(--brown)', flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--dark)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
                    <div style={{ fontSize: 10, color: 'var(--muted)' }}>{s.bookings} bookings · {s.revenue}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: s.trend === 'up' ? '#4CAF50' : '#E05C5C', flexShrink: 0 }}>{s.growth}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Staff Performance */}
        <div className="stat-card">
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 15, fontWeight: 600, color: 'var(--dark)' }}>Staff Performance</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>Sessions, revenue, and ratings by therapist</div>
            </div>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                {['Staff Member', 'Sessions', 'Revenue Generated', 'Rating', 'Completion Rate', 'Performance'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {STAFF_PERF.map((s, i) => (
                <tr key={s.name}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--sand)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--brown)', flexShrink: 0 }}>
                        {s.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--dark)' }}>{s.name}</div>
                        <div style={{ fontSize: 10, color: 'var(--muted)' }}>{s.role}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--dark)' }}>{s.sessions}</td>
                  <td style={{ fontWeight: 500 }}>{s.revenue}</td>
                  <td><RatingStars rating={s.rating} /></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 5, background: '#F2EDE8', borderRadius: 99 }}>
                        <div style={{ width: `${s.completion}%`, height: '100%', background: s.completion >= 95 ? '#4CAF50' : s.completion >= 90 ? '#C9A882' : '#E8773A', borderRadius: 99 }} />
                      </div>
                      <span style={{ fontSize: 11, color: 'var(--muted)', minWidth: 30 }}>{s.completion}%</span>
                    </div>
                  </td>
                  <td>
                    <span style={{
                      fontSize: 11, fontWeight: 700, borderRadius: 6, padding: '3px 10px',
                      background: i === 0 ? '#E8F5E9' : i <= 2 ? '#FFF8E1' : '#F5F0EB',
                      color: i === 0 ? '#2E7D32' : i <= 2 ? '#F57F17' : 'var(--brown)',
                    }}>{i === 0 ? 'Top Performer' : i <= 2 ? 'Above Avg' : 'Average'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
