import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react'

function ToastItem({ toast, onDismiss }) {
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true)
      setTimeout(() => onDismiss(toast.id), 280)
    }, 2700)
    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  const cfg = {
    success: { border: '#10B981', Icon: CheckCircle, iconColor: '#10B981' },
    error:   { border: '#EF4444', Icon: XCircle,    iconColor: '#EF4444' },
    warning: { border: '#F59E0B', Icon: AlertTriangle, iconColor: '#F59E0B' },
  }[toast.type] || { border: '#10B981', Icon: CheckCircle, iconColor: '#10B981' }

  return (
    <div
      className={exiting ? 'toast-out' : 'toast-in'}
      style={{
        background: '#fff', borderRadius: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        minWidth: 300, maxWidth: 380,
        padding: '14px 16px 14px 18px',
        borderLeft: `4px solid ${cfg.border}`,
        display: 'flex', alignItems: 'flex-start', gap: 12,
      }}
    >
      <cfg.Icon size={18} style={{ color: cfg.iconColor, flexShrink: 0, marginTop: 1 }} />
      <span style={{ flex: 1, fontSize: 13, color: '#1f2937', fontWeight: 500, lineHeight: 1.5 }}>
        {toast.message}
      </span>
      <button
        onClick={() => onDismiss(toast.id)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0, flexShrink: 0 }}
      >
        <X size={16} />
      </button>
    </div>
  )
}

export default function Toast({ toasts, onDismiss }) {
  return (
    <div style={{
      position: 'fixed', top: 20, right: 20, zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: 10,
      pointerEvents: 'none',
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{ pointerEvents: 'auto' }}>
          <ToastItem toast={t} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  )
}
