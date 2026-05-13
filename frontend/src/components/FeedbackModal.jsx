import { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'
import RatingStars from './RatingStars'
import { editFeedback } from '../services/feedbackService'

export default function FeedbackModal({ isOpen, onClose, feedback, onSuccess }) {
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
  }, [feedback])

  if (!isOpen) return null

  const validate = () => {
    const errs = {}
    if (!form.participant_name || form.participant_name.trim().length < 2)
      errs.participant_name = 'Name must be at least 2 characters'
    if (!form.program_name || form.program_name.trim().length < 2)
      errs.program_name = 'Program name must be at least 2 characters'
    if (!form.rating || form.rating < 1)
      errs.rating = 'Please select a rating'
    if (form.comments && form.comments.length > 500)
      errs.comments = 'Comments must be 500 characters or fewer'
    return errs
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-slide-up border border-indigo-500/20 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold text-xl font-sora">Edit Feedback</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {errors.submit && (
            <p className="text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-2">{errors.submit}</p>
          )}

          <div>
            <label className="text-slate-300 text-sm font-medium block mb-1.5">Participant Name</label>
            <input
              value={form.participant_name}
              onChange={(e) => setForm({ ...form, participant_name: e.target.value })}
              className={`w-full bg-[#0F172A] border rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors ${errors.participant_name ? 'border-rose-500' : 'border-[#334155] focus:border-indigo-500'}`}
            />
            {errors.participant_name && <p className="text-rose-400 text-xs mt-1">{errors.participant_name}</p>}
          </div>

          <div>
            <label className="text-slate-300 text-sm font-medium block mb-1.5">Program / Event Name</label>
            <input
              value={form.program_name}
              onChange={(e) => setForm({ ...form, program_name: e.target.value })}
              className={`w-full bg-[#0F172A] border rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors ${errors.program_name ? 'border-rose-500' : 'border-[#334155] focus:border-indigo-500'}`}
            />
            {errors.program_name && <p className="text-rose-400 text-xs mt-1">{errors.program_name}</p>}
          </div>

          <div>
            <label className="text-slate-300 text-sm font-medium block mb-2">Rating</label>
            <RatingStars value={form.rating} onChange={(r) => setForm({ ...form, rating: r })} size={28} />
            {errors.rating && <p className="text-rose-400 text-xs mt-1">{errors.rating}</p>}
          </div>

          <div>
            <label className="text-slate-300 text-sm font-medium block mb-1.5">
              Comments <span className="text-slate-600">(optional)</span>
            </label>
            <textarea
              value={form.comments}
              onChange={(e) => setForm({ ...form, comments: e.target.value })}
              rows={3}
              maxLength={500}
              className={`w-full bg-[#0F172A] border rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors resize-none ${errors.comments ? 'border-rose-500' : 'border-[#334155] focus:border-indigo-500'}`}
            />
            <div className="flex justify-between mt-1">
              {errors.comments ? <p className="text-rose-400 text-xs">{errors.comments}</p> : <span />}
              <span className="text-slate-600 text-xs">{form.comments.length}/500</span>
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-[#334155] text-slate-300 text-sm font-medium hover:bg-[#1E293B] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
