import { TrendingUp } from 'lucide-react'

export default function StatCard({ title, value, subtitle, subtitleColor = '#10B981', icon: Icon, iconBg, iconColor }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: '20px 24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
    }}>
      {/* Left */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, color: '#6b7280', fontWeight: 500, marginBottom: 6 }}>{title}</p>
        <p style={{ fontSize: 28, color: '#1f2937', fontWeight: 700, letterSpacing: '-0.5px', lineHeight: 1.1 }}>
          {value}
        </p>
        {subtitle && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
            <TrendingUp size={12} style={{ color: subtitleColor }} />
            <span style={{ fontSize: 12, color: subtitleColor }}>{subtitle}</span>
          </div>
        )}
      </div>

      {/* Right icon circle */}
      <div style={{
        width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
        background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={22} style={{ color: iconColor }} />
      </div>
    </div>
  )
}
