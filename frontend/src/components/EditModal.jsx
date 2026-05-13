import { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'
import RatingStars from './RatingStars'
import { editFeedback } from '../services/feedbackService'

const inputStyle = (hasError) => ({
  width: '100%', border: `1px solid ${hasError ? '#ef4444' : '#e5e7eb'}`,
  borderRadius: 8, padding: '11px 14px', fontSize: 14,
  color: '#1f2937', background: '#fff', outline: 'none',
})

export default function EditModal({ isOpen, onClose, feedback, onSuccess }) {
  const [form, setForm] = useState({ participant_name: '', program_name: '', rating: 0, comments: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (feedback) {
      setForm({
        participant_name: feedback.participant_name,
        program_name: feedback.program_name,
        rating: feedback.rating,
        comments: feedback.comments || '',
      })
      setErrors({})
    }
  }, [feedback, isOpen])

  if (!isOpen) return null

  const validate = () => {
    const e = {}
    if (!form.participant_name?.trim() || form.participant_name.trim().length < 2)
      e.participant_name = 'Name must be at least 2 characters'
    if (!form.program_name?.trim() || form.program_name.trim().length < 2)
      e.program_name = 'Program name must be at least 2 characters'
    if (!form.rating || form.rating < 1) e.rating = 'Please select a rating'
    if (form.comments?.length > 500) e.comments = 'Max 500 characters'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    const { data, error } = await editFeedback(feedback.feedback_id, form)
    setLoading(false)
    if (error) { setErrors({ submit: error }); return }
    onSuccess(data)
    onClose()
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9000,
      background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div style={{
        background: '#fff', borderRadius: 12, width: 520, maxWidth: '90vw',
        padding: 32, maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1f2937' }}>Edit Feedback</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {errors.submit && (
            <p style={{ fontSize: 13, color: '#ef4444', background: '#fef2f2', borderRadius: 8, padding: '10px 14px' }}>
              {errors.submit}
            </p>
          )}

          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>
              Participant Name *
            </label>
            <input
              value={form.participant_name}
              onChange={e => setForm({ ...form, participant_name: e.target.value })}
              style={inputStyle(errors.participant_name)}
              placeholder="Enter participant name"
            />
            {errors.participant_name && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>{errors.participant_name}</p>}
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>
              Program / Event Name *
            </label>
            <input
              value={form.program_name}
              onChange={e => setForm({ ...form, program_name: e.target.value })}
              style={inputStyle(errors.program_name)}
              placeholder="Enter program name"
            />
            {errors.program_name && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>{errors.program_name}</p>}
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 8 }}>
              Rating *
            </label>
            <RatingStars value={form.rating} onChange={r => setForm({ ...form, rating: r })} />
            {errors.rating && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>{errors.rating}</p>}
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>
              Comments <span style={{ color: '#9ca3af' }}>(optional)</span>
            </label>
            <textarea
              value={form.comments}
              onChange={e => setForm({ ...form, comments: e.target.value })}
              rows={4}
              maxLength={500}
              placeholder="Write your feedback..."
              style={{ ...inputStyle(errors.comments), resize: 'vertical', minHeight: 100 }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              {errors.comments
                ? <p style={{ fontSize: 12, color: '#ef4444' }}>{errors.comments}</p>
                : <span />}
              <span style={{ fontSize: 12, color: '#9ca3af' }}>{form.comments.length}/500</span>
            </div>
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button
              type="button" onClick={onClose}
              style={{
                flex: 1, border: '1px solid #e5e7eb', background: '#fff',
                color: '#6b7280', padding: '11px 0', borderRadius: 8,
                fontWeight: 500, fontSize: 14, cursor: 'pointer',
              }}
            >Cancel</button>
            <button
              type="submit" disabled={loading}
              style={{
                flex: 1, background: loading ? '#818cf8' : '#6366F1', color: '#fff',
                border: 'none', padding: '11px 0', borderRadius: 8,
                fontWeight: 600, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              {loading && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
