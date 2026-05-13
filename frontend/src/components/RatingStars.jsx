import { useState } from 'react'

const LABELS = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent' }

const SIZE_MAP = { sm: 14, md: 20, lg: 28 }

export default function RatingStars({ value = 0, onChange, readOnly = false, size = 'md' }) {
  const [hovered, setHovered] = useState(0)

  if (readOnly) {
    const px = SIZE_MAP[size] || SIZE_MAP.md
    return (
      <span style={{ fontSize: px, letterSpacing: 2, lineHeight: 1 }}>
        {[1, 2, 3, 4, 5].map(s => (
          <span key={s} style={{ color: s <= value ? '#f59e0b' : '#e5e7eb' }}>
            {s <= value ? '★' : '☆'}
          </span>
        ))}
      </span>
    )
  }

  const active = hovered || value
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        {[1, 2, 3, 4, 5].map(s => (
          <button
            key={s}
            type="button"
            onClick={() => onChange && onChange(s)}
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(0)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 32, padding: 0, lineHeight: 1,
              color: s <= active ? (hovered ? '#fbbf24' : '#f59e0b') : '#d1d5db',
              transition: 'color 0.1s, transform 0.1s',
              transform: s <= active ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            ★
          </button>
        ))}
      </div>
      <span style={{ fontSize: 12, color: active ? '#6366F1' : '#9ca3af', fontWeight: active ? 500 : 400 }}>
        {active ? `(${active} - ${LABELS[active]})` : '(Select 1 to 5 stars)'}
      </span>
    </div>
  )
}
