import { useState } from 'react'
import { Loader2, Send } from 'lucide-react'
import RatingStars from '../components/RatingStars'
import { submitFeedback } from '../services/feedbackService'
import { useToast } from '../App'

const INITIAL_FORM = { participant_name: '', program_name: '', rating: 0, comments: '' }

export default function SubmitFeedback() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [loading, setLoading] = useState(false)
  const addToast = useToast()

  const validate = (data = form) => {
    const errs = {}
    if (!data.participant_name || data.participant_name.trim().length < 2)
      errs.participant_name = 'Name must be at least 2 characters'
    if (!data.program_name || data.program_name.trim().length < 2)
      errs.program_name = 'Program name must be at least 2 characters'
    if (!data.rating || data.rating < 1)
      errs.rating = 'Please select a rating (1–5)'
    if (data.comments && data.comments.length > 500)
      errs.comments = 'Comments must be 500 characters or fewer'
    return errs
  }

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    setErrors(validate())
  }

  const handleChange = (field, value) => {
    const updated = { ...form, [field]: value }
    setForm(updated)
    if (touched[field]) setErrors(validate(updated))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const allTouched = { participant_name: true, program_name: true, rating: true, comments: true }
    setTouched(allTouched)
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length) return

    setLoading(true)
    const { data, error } = await submitFeedback(form)
    setLoading(false)

    if (error) {
      addToast(typeof error === 'string' ? error : 'Failed to submit feedback', 'error')
      return
    }
    addToast('Feedback submitted successfully!')
    setForm(INITIAL_FORM)
    setTouched({})
    setErrors({})
  }

  const inputClass = (field) =>
    `w-full bg-[#0F172A] border rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors ${
      touched[field] && errors[field] ? 'border-rose-500 focus:border-rose-500' : 'border-[#334155] focus:border-indigo-500'
    }`

  return (
    <div className="page-enter max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white font-sora">Share Your Feedback</h1>
        <p className="text-slate-400 mt-1.5 text-sm">
          Your experience matters. Help us improve by sharing your thoughts.
        </p>
      </div>

      {/* Form Card */}
      <div className="glass rounded-2xl p-8 border border-indigo-500/10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Participant Name */}
          <div>
            <label className="text-slate-300 text-sm font-medium block mb-2">
              Participant Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="Your full name"
              value={form.participant_name}
              onChange={(e) => handleChange('participant_name', e.target.value)}
              onBlur={() => handleBlur('participant_name')}
              className={inputClass('participant_name')}
            />
            {touched.participant_name && errors.participant_name && (
              <p className="text-rose-400 text-xs mt-1.5">{errors.participant_name}</p>
            )}
          </div>

          {/* Program Name */}
          <div>
            <label className="text-slate-300 text-sm font-medium block mb-2">
              Program / Event / Product Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. React Bootcamp, Cloud Workshop..."
              value={form.program_name}
              onChange={(e) => handleChange('program_name', e.target.value)}
              onBlur={() => handleBlur('program_name')}
              className={inputClass('program_name')}
            />
            {touched.program_name && errors.program_name && (
              <p className="text-rose-400 text-xs mt-1.5">{errors.program_name}</p>
            )}
          </div>

          {/* Rating */}
          <div>
            <label className="text-slate-300 text-sm font-medium block mb-2">
              Overall Rating <span className="text-rose-400">*</span>
            </label>
            <RatingStars
              value={form.rating}
              onChange={(r) => handleChange('rating', r)}
              size={32}
            />
            {touched.rating && errors.rating && (
              <p className="text-rose-400 text-xs mt-1.5">{errors.rating}</p>
            )}
          </div>

          {/* Comments */}
          <div>
            <label className="text-slate-300 text-sm font-medium block mb-2">
              Comments <span className="text-slate-500">(optional)</span>
            </label>
            <textarea
              placeholder="Share your thoughts, suggestions, or experience..."
              value={form.comments}
              onChange={(e) => handleChange('comments', e.target.value)}
              onBlur={() => handleBlur('comments')}
              rows={5}
              maxLength={500}
              className={`${inputClass('comments')} resize-none`}
            />
            <div className="flex justify-between mt-1.5">
              <span>
                {touched.comments && errors.comments && (
                  <span className="text-rose-400 text-xs">{errors.comments}</span>
                )}
              </span>
              <span className={`text-xs ${form.comments.length > 450 ? 'text-amber-400' : 'text-slate-600'}`}>
                {form.comments.length}/500
              </span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: loading
                ? '#4F46E5'
                : 'linear-gradient(135deg, #6366F1 0%, #4F46E5 50%, #7C3AED 100%)',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(99,102,241,0.3)',
            }}
          >
            {loading ? (
              <><Loader2 size={18} className="animate-spin" /> Submitting...</>
            ) : (
              <><Send size={16} /> Submit Feedback</>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
