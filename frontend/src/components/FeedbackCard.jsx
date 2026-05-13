import { Eye, Pencil, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import RatingStars from './RatingStars'

function hashColor(str) {
  const colors = [
    '#6366F1', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#F43F5E', '#14B8A6',
  ]
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

function initials(name) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

export default function FeedbackCard({ feedback, onEdit, onDelete }) {
  const navigate = useNavigate()
  const avatarColor = hashColor(feedback.participant_name)

  return (
    <div className="card-hover glass rounded-2xl p-5 flex flex-col gap-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold font-sora flex-shrink-0"
          style={{ background: avatarColor }}
        >
          {initials(feedback.participant_name)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm truncate">{feedback.participant_name}</h3>
          <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 truncate max-w-full">
            {feedback.program_name}
          </span>
        </div>
      </div>

      {/* Rating */}
      <RatingStars value={feedback.rating} readOnly size={16} />

      {/* Comment */}
      <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
        {feedback.comments || <span className="italic text-slate-600">No comments provided</span>}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-[#334155]">
        <span className="text-slate-600 text-xs">{formatDate(feedback.submitted_at)}</span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate(`/feedback/${feedback.feedback_id}`)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors"
            title="View"
          >
            <Eye size={15} />
          </button>
          <button
            onClick={() => onEdit && onEdit(feedback)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
            title="Edit"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete && onDelete(feedback)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}
