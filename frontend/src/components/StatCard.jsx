import { useEffect, useRef, useState } from 'react'

function useCountUp(target, duration = 1000) {
  const [count, setCount] = useState(0)
  const frameRef = useRef(null)

  useEffect(() => {
    if (typeof target !== 'number' || isNaN(target)) return
    const start = performance.now()
    const animate = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(target * eased)
      if (progress < 1) frameRef.current = requestAnimationFrame(animate)
    }
    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [target, duration])

  return count
}

export default function StatCard({ title, value, icon: Icon, color, subtitle, isDecimal = false }) {
  const numericValue = parseFloat(value) || 0
  const animated = useCountUp(numericValue)

  const displayValue = typeof value === 'string' && isNaN(value)
    ? value
    : isDecimal
    ? animated.toFixed(1)
    : Math.round(animated).toString()

  const colorMap = {
    indigo: { bg: 'rgba(99,102,241,0.12)', icon: '#6366F1', border: 'rgba(99,102,241,0.25)' },
    emerald: { bg: 'rgba(16,185,129,0.12)', icon: '#10B981', border: 'rgba(16,185,129,0.25)' },
    amber: { bg: 'rgba(245,158,11,0.12)', icon: '#F59E0B', border: 'rgba(245,158,11,0.25)' },
    rose: { bg: 'rgba(244,63,94,0.12)', icon: '#F43F5E', border: 'rgba(244,63,94,0.25)' },
  }
  const c = colorMap[color] || colorMap.indigo

  return (
    <div
      className="card-hover rounded-2xl p-5 flex flex-col gap-3"
      style={{
        background: 'rgba(30,41,59,0.55)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${c.border}`,
      }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white mt-1 font-sora">{displayValue}</p>
          {subtitle && <p className="text-slate-500 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: c.bg }}>
          <Icon size={22} style={{ color: c.icon }} />
        </div>
      </div>
    </div>
  )
}
