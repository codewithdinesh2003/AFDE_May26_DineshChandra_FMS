import { useEffect, useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react'
import FeedbackCard from '../components/FeedbackCard'
import SearchFilterBar from '../components/SearchFilterBar'
import FeedbackModal from '../components/FeedbackModal'
import ConfirmDialog from '../components/ConfirmDialog'
import { fetchAllFeedback, searchFeedback, removeFeedback } from '../services/feedbackService'
import { useToast } from '../App'

const PAGE_SIZE = 9

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array(6).fill(0).map((_, i) => (
        <div key={i} className="glass rounded-2xl p-5 space-y-3">
          <div className="flex gap-3 items-center">
            <div className="skeleton w-10 h-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-32" />
              <div className="skeleton h-3 w-20" />
            </div>
          </div>
          <div className="skeleton h-3 w-28" />
          <div className="skeleton h-3 w-full" />
          <div className="skeleton h-3 w-4/5" />
          <div className="flex justify-between pt-2">
            <div className="skeleton h-3 w-20" />
            <div className="skeleton h-6 w-20 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function FeedbackList() {
  const [allItems, setAllItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({})
  const [editFeedback, setEditFeedback] = useState(null)
  const [deleteFeedback, setDeleteFeedback] = useState(null)
  const addToast = useToast()

  const loadData = useCallback(async (activeFilters = filters) => {
    setLoading(true)
    const hasFilters = Object.values(activeFilters).some(Boolean)
    const res = hasFilters
      ? await searchFeedback(activeFilters)
      : await fetchAllFeedback({ limit: 500 })
    if (res.data) setAllItems(res.data)
    else addToast(res.error, 'error')
    setLoading(false)
  }, [filters])

  useEffect(() => { loadData() }, [])

  const handleFilter = useCallback((newFilters) => {
    setFilters(newFilters)
    setPage(1)
    loadData(newFilters)
  }, [loadData])

  const handleDelete = async () => {
    if (!deleteFeedback) return
    const { success, error } = await removeFeedback(deleteFeedback.feedback_id)
    if (success) {
      addToast('Feedback deleted successfully')
      setDeleteFeedback(null)
      loadData()
    } else {
      addToast(error, 'error')
    }
  }

  const totalPages = Math.ceil(allItems.length / PAGE_SIZE)
  const paginated = allItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="page-enter space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold text-white font-sora">All Feedback</h1>
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
          {allItems.length}
        </span>
      </div>

      <SearchFilterBar onFilter={handleFilter} />

      {loading ? (
        <SkeletonGrid />
      ) : paginated.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center">
          <MessageSquare size={48} className="text-slate-600 mx-auto mb-4" />
          <h3 className="text-slate-300 font-semibold text-lg font-sora mb-2">No feedback found</h3>
          <p className="text-slate-500 text-sm">
            {Object.values(filters).some(Boolean)
              ? 'Try adjusting your filters.'
              : 'Be the first to submit feedback!'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {paginated.map((fb) => (
              <FeedbackCard
                key={fb.feedback_id}
                feedback={fb}
                onEdit={setEditFeedback}
                onDelete={setDeleteFeedback}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-xl border border-[#334155] text-slate-400 hover:text-white hover:border-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-slate-400 text-sm px-4">
                Page <span className="text-white font-semibold">{page}</span> of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-xl border border-[#334155] text-slate-400 hover:text-white hover:border-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}

      <FeedbackModal
        isOpen={!!editFeedback}
        feedback={editFeedback}
        onClose={() => setEditFeedback(null)}
        onSuccess={() => { addToast('Feedback updated!'); loadData() }}
      />
      <ConfirmDialog
        isOpen={!!deleteFeedback}
        participantName={deleteFeedback?.participant_name}
        onConfirm={handleDelete}
        onCancel={() => setDeleteFeedback(null)}
      />
    </div>
  )
}
