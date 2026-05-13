import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'

function buildLast7Days(feedbackList) {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    days.push({ key, label, count: 0 })
  }
  feedbackList.forEach(fb => {
    const key = new Date(fb.submitted_at).toISOString().slice(0, 10)
    const day = days.find(d => d.key === key)
    if (day) day.count++
  })
  return days.map(({ label, count }) => ({ date: label, count }))
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8,
      padding: '8px 14px', fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    }}>
      <p style={{ color: '#6b7280', marginBottom: 2 }}>{label}</p>
      <p style={{ color: '#6366F1', fontWeight: 600 }}>{payload[0].value} submissions</p>
    </div>
  )
}

export default function LineChart({ feedbackList = [] }) {
  const data = buildLast7Days(feedbackList)

  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: 20,
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1f2937' }}>Feedback Over Time</h3>
        <select style={{
          border: '1px solid #e5e7eb', borderRadius: 8, padding: '6px 12px',
          fontSize: 13, color: '#6b7280', background: '#fff', cursor: 'pointer',
        }}>
          <option>Last 7 Days</option>
        </select>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorFeedback" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone" dataKey="count"
            stroke="#6366F1" strokeWidth={2}
            fill="url(#colorFeedback)"
            dot={{ r: 3, fill: '#6366F1', strokeWidth: 0 }}
            activeDot={{ r: 5, fill: '#6366F1' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
