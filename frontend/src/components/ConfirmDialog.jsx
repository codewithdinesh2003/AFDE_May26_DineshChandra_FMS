import { AlertTriangle, X } from 'lucide-react'

export default function ConfirmDialog({ isOpen, onConfirm, onCancel, participantName }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative glass rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-slide-up border border-rose-500/20">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center">
            <AlertTriangle size={28} className="text-rose-400" />
          </div>

          <div>
            <h3 className="text-white font-bold text-lg font-sora">Delete Feedback?</h3>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Are you sure you want to delete the feedback from{' '}
              <span className="text-white font-semibold">{participantName}</span>?
              This action cannot be undone.
            </p>
          </div>

          <div className="flex gap-3 w-full mt-2">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl border border-[#334155] text-slate-300 text-sm font-medium hover:bg-[#1E293B] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
