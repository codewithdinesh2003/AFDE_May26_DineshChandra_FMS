export default function ConfirmDialog({ isOpen, onConfirm, onCancel, participantName }) {
  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9000,
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div style={{
        background: '#fff', borderRadius: 12, width: 400, maxWidth: '90vw',
        padding: 32, textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }}>
        {/* Warning icon */}
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: '#fef2f2', margin: '0 auto 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28,
        }}>⚠️</div>

        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1f2937', marginBottom: 10 }}>
          Delete Feedback?
        </h3>
        <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>
          Are you sure you want to delete feedback from{' '}
          <strong style={{ color: '#1f2937' }}>{participantName}</strong>?
          This action cannot be undone.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 24 }}>
          <button
            onClick={onCancel}
            style={{
              border: '1px solid #e5e7eb', background: '#fff', color: '#6b7280',
              padding: '10px 28px', borderRadius: 8, fontWeight: 500, fontSize: 14, cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              background: '#EF4444', color: '#fff', border: 'none',
              padding: '10px 28px', borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: 'pointer',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#dc2626'}
            onMouseLeave={e => e.currentTarget.style.background = '#EF4444'}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
