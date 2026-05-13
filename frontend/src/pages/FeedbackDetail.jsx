import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Pencil, Trash2, Loader2 } from 'lucide-react'
import RatingStars from '../components/RatingStars'
import FeedbackModal from '../components/FeedbackModal'
import ConfirmDialog from '../components/ConfirmDialog'
import { fetchFeedbackById, removeFeedback } from '../services/feedbackService'
import { useToast } from '../App'

function hashColor(str) {
  const colors = ['#6366F1', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#F43F5E', '#14B8A6']
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

function initials(name) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
}

function formatFullDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function FeedbackDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const addToast = useToast()
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  useEffect(() => {
    loadFeedback()
  }, [id])

  const loadFeedback = async () => {
    setLoading(true)
    const { data, error } = await fetchFeedbackById(id)
    if (error) { addToast(error, 'error'); navigate('/feedback') }
    else setFeedback(data)
    setLoading(false)
  }

  const handleDelete = async () => {
    const { success, error } = await removeFeedback(feedback.feedback_id)
    if (success) {
      addToast('Feedback deleted')
      navigate('/feedback')
    } else {
      addToast(error, 'error')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-indigo-400" />
      </div>
    )
  }

  if (!feedback) return null

  const avatarColor = hashColor(feedback.participant_name)

  return (
    <div className="page-enter max-w-2xl mx-auto space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate('/feedback')}
        className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
      >
        <ArrowLeft size={16} /> Back to All Feedback
      </button>

      {/* Card */}
      <div className="glass rounded-2xl p-8 border border-indigo-500/10 space-y-6">
        {/* Avatar + Name */}
        <div className="flex items-center gap-5">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold font-sora flex-shrink-0"
            style={{ background: avatarColor }}
          >
            {initials(feedback.participant_name)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white font-sora">{feedback.participant_name}</h1>
            <span className="inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
              {feedback.program_name}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#1E293B]" />

        {/* Rating */}
        <div>
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Rating</p>
          <RatingStars value={feedback.rating} readOnly size={28} />
        </div>

        {/* Comments */}
        <div>
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Comments</p>
          {feedback.comments ? (
            <p className="text-slate-300 text-base leading-relaxed">{feedback.comments}</p>
          ) : (
            <p className="text-slate-600 italic text-sm">No comments provided.</p>
          )}
        </div>

        {/* Timestamp */}
        <div className="pt-2 border-t border-[#1E293B]">
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Submitted</p>
          <p className="text-slate-400 text-sm">{formatFullDate(feedback.submitted_at)}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => setShowEdit(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-amber-500/30 text-amber-400 text-sm font-medium hover:bg-amber-500/10 transition-colors"
          >
            <Pencil size={15} /> Edit
          </button>
          <button
            onClick={() => setShowDelete(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-rose-500/30 text-rose-400 text-sm font-medium hover:bg-rose-500/10 transition-colors"
          >
            <Trash2 size={15} /> Delete
          </button>
        </div>
      </div>

      <FeedbackModal
        isOpen={showEdit}
        feedback={feedback}
        onClose={() => setShowEdit(false)}
        onSuccess={(updated) => { addToast('Feedback updated!'); setFeedback(updated) }}
      />
      <ConfirmDialog
        isOpen={showDelete}
        participantName={feedback.participant_name}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  )
}
