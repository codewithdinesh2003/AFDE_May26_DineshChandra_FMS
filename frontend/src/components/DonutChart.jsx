import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = {
  5: '#6366F1',
  4: '#10B981',
  3: '#F59E0B',
  2: '#EF4444',
  1: '#6b7280',
}
const LABELS = {
  5: '5 - Excellent',
  4: '4 - Very Good',
  3: '3 - Good',
  2: '2 - Fair',
  1: '1 - Poor',
}

export default function DonutChart({ distribution = [] }) {
  const total = distribution.reduce((s, d) => s + d.count, 0)
  const data = [5, 4, 3, 2, 1].map(r => {
    const d = distribution.find(x => x.rating === r) || { count: 0, percentage: 0 }
    return { name: LABELS[r], value: d.count, percentage: d.percentage, rating: r }
  }).filter(d => d.value > 0)

  const placeholder = data.length === 0 ? [{ name: 'No data', value: 1 }] : data

  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: 20,
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)', height: '100%',
    }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1f2937', marginBottom: 16 }}>
        Rating Distribution
      </h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Donut */}
        <div style={{ width: 160, height: 200, flexShrink: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={placeholder}
                cx="50%" cy="50%"
                innerRadius={55} outerRadius={78}
                dataKey="value"
                strokeWidth={2}
              >
                {placeholder.map((entry, i) => (
                  <Cell key={i} fill={data.length === 0 ? '#e5e7eb' : COLORS[entry.rating]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v, n) => [v, n]}
                contentStyle={{ borderRadius: 8, fontSize: 12, border: '1px solid #e5e7eb' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
          {[5, 4, 3, 2, 1].map(r => {
            const item = distribution.find(x => x.rating === r) || { count: 0, percentage: 0 }
            return (
              <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                  background: COLORS[r],
                }} />
                <span style={{ fontSize: 12, color: '#4b5563', flex: 1 }}>{LABELS[r]}</span>
                <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>
                  {total > 0 ? item.percentage : 0}%
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
