import { useState } from 'react'
import { Star } from 'lucide-react'

const LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
const COLORS = ['', '#EF4444', '#F97316', '#EAB308', '#84CC16', '#10B981']

export default function RatingStars({ value = 0, onChange, readOnly = false, size = 24 }) {
  const [hovered, setHovered] = useState(0)

  const display = hovered || value

  if (readOnly) {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            fill={star <= value ? '#EAB308' : 'transparent'}
            color={star <= value ? '#EAB308' : '#475569'}
            strokeWidth={1.5}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-start gap-1.5">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange && onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="transition-transform duration-150 hover:scale-110 focus:outline-none"
          >
            <Star
              size={size}
              fill={star <= display ? COLORS[display] : 'transparent'}
              color={star <= display ? COLORS[display] : '#475569'}
              strokeWidth={1.5}
              style={{ transition: 'fill 0.15s, color 0.15s' }}
            />
          </button>
        ))}
      </div>
      {display > 0 && (
        <span className="text-sm font-medium" style={{ color: COLORS[display] }}>
          {LABELS[display]}
        </span>
      )}
    </div>
  )
}
