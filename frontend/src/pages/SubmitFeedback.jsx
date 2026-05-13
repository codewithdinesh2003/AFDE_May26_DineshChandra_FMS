import { useState, useEffect } from 'react'
import { Loader2, Check } from 'lucide-react'
import RatingStars from '../components/RatingStars'
import { submitFeedback, fetchAllFeedback } from '../services/feedbackService'
import { useToast } from '../App'

const INITIAL = { participant_name: '', program_name: '', custom_program: '', rating: 0, comments: '' }

const inputStyle = (err) => ({
  width: '100%', border: `1px solid ${err ? '#ef4444' : '#e5e7eb'}`,
  borderRadius: 8, padding: '11px 14px', fontSize: 14,
  color: '#1f2937', background: '#fff', outline: 'none',
  fontFamily: 'Poppins, sans-serif',
})

export default function SubmitFeedback() {
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [loading, setLoading] = useState(false)
  const [programs, setPrograms] = useState([])
  const [useCustom, setUseCustom] = useState(false)
  const addToast = useToast()

  useEffect(() => {
    fetchAllFeedback({ limit: 500 }).then(res => {
      if (res.data) {
        const unique = [...new Set(res.data.map(f => f.program_name))].sort()
        setPrograms(unique)
      }
    })
  }, [])

  const validate = (f = form) => {
    const e = {}
    if (!f.participant_name?.trim() || f.participant_name.trim().length < 2)
      e.participant_name = 'Name must be at least 2 characters'
    const prog = useCustom ? f.custom_program : f.program_name
    if (!prog?.trim() || prog.trim().length < 2)
      e.program_name = 'Program name must be at least 2 characters'
    if (!f.rating || f.rating < 1)
      e.rating = 'Please select a rating'
    if (f.comments?.length > 500)
      e.comments = 'Max 500 characters'
    return e
  }

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    setErrors(validate())
  }

  const set = (field, value) => {
    const updated = { ...form, [field]: value }
    setForm(updated)
    if (touched[field]) setErrors(validate(updated))
  }

  const handleReset = () => {
    setForm(INITIAL); setErrors({}); setTouched({}); setUseCustom(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const allTouched = { participant_name: true, program_name: true, rating: true, comments: true }
    setTouched(allTouched)
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    const payload = {
      participant_name: form.participant_name,
      program_name: useCustom ? form.custom_program : form.program_name,
      rating: form.rating,
      comments: form.comments || undefined,
    }

    setLoading(true)
    const { error } = await submitFeedback(payload)
    setLoading(false)

    if (error) { addToast(typeof error === 'string' ? error : 'Submission failed', 'error'); return }
    addToast('Feedback submitted successfully!')
    handleReset()
  }

  const errOf = (f) => touched[f] && errors[f]

  return (
    <div className="page-fade-in">
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1f2937', marginBottom: 20 }}>Submit Feedback</h1>
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>

        {/* LEFT — Form */}
        <div style={{
          flex: 1, minWidth: 300, maxWidth: 520,
          background: '#fff', borderRadius: 12, padding: 32,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1f2937', marginBottom: 6 }}>Submit Feedback</h2>
          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 28 }}>
            Please share your feedback about the program.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Participant Name */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>
                Participant Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                value={form.participant_name}
                onChange={e => set('participant_name', e.target.value)}
                onBlur={() => handleBlur('participant_name')}
                placeholder="Enter your name"
                style={inputStyle(errOf('participant_name'))}
              />
              {errOf('participant_name') && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>{errors.participant_name}</p>}
            </div>

            {/* Program */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>
                Program / Event Name <span style={{ color: '#ef4444' }}>*</span>
              </label>
              {!useCustom ? (
                <select
                  value={form.program_name}
                  onChange={e => {
                    if (e.target.value === '__custom__') { setUseCustom(true); set('program_name', '') }
                    else set('program_name', e.target.value)
                  }}
                  onBlur={() => handleBlur('program_name')}
                  style={inputStyle(errOf('program_name'))}
                >
                  <option value="" disabled>Select program</option>
                  {programs.map(p => <option key={p} value={p}>{p}</option>)}
                  <option value="__custom__">+ Enter a new program name</option>
                </select>
              ) : (
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    value={form.custom_program}
                    onChange={e => set('custom_program', e.target.value)}
                    onBlur={() => handleBlur('program_name')}
                    placeholder="Type program name..."
                    style={{ ...inputStyle(errOf('program_name')), flex: 1 }}
                  />
                  <button
                    type="button" onClick={() => { setUseCustom(false); set('custom_program', '') }}
                    style={{
                      border: '1px solid #e5e7eb', borderRadius: 8, padding: '0 12px',
                      background: '#fff', color: '#6b7280', cursor: 'pointer', fontSize: 13,
                    }}
                  >↩</button>
                </div>
              )}
              {errOf('program_name') && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>{errors.program_name}</p>}
            </div>

            {/* Rating */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 8 }}>
                Rating <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <RatingStars value={form.rating} onChange={r => set('rating', r)} />
              {errOf('rating') && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>{errors.rating}</p>}
            </div>

            {/* Comments */}
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>
                Comments <span style={{ color: '#9ca3af', fontWeight: 400 }}>(optional)</span>
              </label>
              <textarea
                value={form.comments}
                onChange={e => set('comments', e.target.value)}
                onBlur={() => handleBlur('comments')}
                placeholder="Write your feedback here..."
                maxLength={500}
                rows={4}
                style={{ ...inputStyle(errOf('comments')), resize: 'vertical', minHeight: 100, fontFamily: 'Poppins, sans-serif' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                {errOf('comments')
                  ? <span style={{ fontSize: 12, color: '#ef4444' }}>{errors.comments}</span>
                  : <span />}
                <span style={{ fontSize: 12, color: form.comments.length > 450 ? '#f59e0b' : '#9ca3af' }}>
                  {form.comments.length} / 500
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button
                type="button" onClick={handleReset}
                style={{
                  border: '1px solid #e5e7eb', background: '#fff', color: '#6b7280',
                  padding: '11px 24px', borderRadius: 8, fontWeight: 500, fontSize: 14, cursor: 'pointer',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              >Reset</button>
              <button
                type="submit" disabled={loading}
                style={{
                  background: loading ? '#818cf8' : '#6366F1', color: '#fff', border: 'none',
                  padding: '11px 28px', borderRadius: 8, fontWeight: 600, fontSize: 14,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}
                onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#4f46e5' }}
                onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#6366F1' }}
              >
                {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={16} />}
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT — Illustration */}
        <div style={{
          flex: 1, minWidth: 260,
          background: '#fff', borderRadius: 12, padding: 40,
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}>
          {/* SVG Illustration */}
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
            {/* Background circle */}
            <circle cx="100" cy="100" r="85" fill="#ede9fe" opacity="0.5" />
            {/* Clipboard */}
            <rect x="55" y="40" width="90" height="115" rx="8" fill="#6366F1" opacity="0.9" />
            <rect x="55" y="40" width="90" height="115" rx="8" fill="white" opacity="0.15" />
            {/* Clip top */}
            <rect x="78" y="32" width="44" height="18" rx="5" fill="#4f46e5" />
            <rect x="88" y="36" width="24" height="10" rx="3" fill="#1a1a2e" opacity="0.3" />
            {/* Lines on clipboard */}
            {[65, 80, 95, 110, 125].map((y, i) => (
              <g key={y}>
                <circle cx="72" cy={y} r="4" fill={i < 3 ? '#10B981' : '#e5e7eb'} />
                <rect x="82" y={y - 2} width={i < 3 ? 48 : 30} height="4" rx="2" fill={i < 3 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)'} />
              </g>
            ))}
            {/* Person */}
            <circle cx="158" cy="90" r="14" fill="#f59e0b" />
            <rect x="148" y="106" width="20" height="32" rx="5" fill="#6366F1" />
            <line x1="148" y1="118" x2="136" y2="130" stroke="#6366F1" strokeWidth="6" strokeLinecap="round" />
            <line x1="168" y1="116" x2="175" y2="128" stroke="#6366F1" strokeWidth="6" strokeLinecap="round" />
            <line x1="152" y1="138" x2="149" y2="158" stroke="#4f46e5" strokeWidth="6" strokeLinecap="round" />
            <line x1="164" y1="138" x2="167" y2="158" stroke="#4f46e5" strokeWidth="6" strokeLinecap="round" />
            {/* Star */}
            <text x="130" y="75" fontSize="16" fill="#f59e0b">★</text>
          </svg>

          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1f2937', marginTop: 16 }}>
            We Value Your Feedback!
          </h3>
          <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, marginTop: 8, maxWidth: 280 }}>
            Your feedback helps us improve our programs and provide better learning experiences for everyone.
          </p>
          <p style={{ fontSize: 13, color: '#ef4444', fontWeight: 500, marginTop: 16 }}>❤ Thank you!</p>
        </div>
      </div>
    </div>
  )
}
