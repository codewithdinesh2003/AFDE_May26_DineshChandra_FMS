import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart2, Star, Trophy, CalendarDays, ArrowRight } from 'lucide-react'
import StatCard from '../components/StatCard'
import FeedbackCard from '../components/FeedbackCard'
import FeedbackModal from '../components/FeedbackModal'
import ConfirmDialog from '../components/ConfirmDialog'
import { fetchStats, fetchAllFeedback, removeFeedback } from '../services/feedbackService'
import { useToast } from '../App'

const RATING_COLORS = ['', '#EF4444', '#F97316', '#EAB308', '#84CC16', '#10B981']
const RATING_LABELS = ['', '1 ★', '2 ★★', '3 ★★★', '4 ★★★★', '5 ★★★★★']

function SkeletonCard() {
  return (
    <div className="rounded-2xl p-5 glass">
      <div className="skeleton h-4 w-24 mb-3" />
      <div className="skeleton h-8 w-16 mb-2" />
      <div className="skeleton h-3 w-20" />
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)
  const [editFeedback, setEditFeedback] = useState(null)
  const [deleteFeedback, setDeleteFeedback] = useState(null)
  const navigate = useNavigate()
  const addToast = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const [statsRes, feedbackRes] = await Promise.all([
      fetchStats(),
      fetchAllFeedback({ limit: 5 }),
    ])
    if (statsRes.data) setStats(statsRes.data)
    if (feedbackRes.data) setRecent(feedbackRes.data)
    setLoading(false)
  }

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

  const totalMax = stats?.rating_distribution?.reduce((a, b) => a + b.count, 0) || 1

  return (
    <div className="page-enter space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white font-sora">Dashboard</h1>
        <p className="text-slate-400 mt-1.5 text-sm">Welcome back — here's your feedback at a glance.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading ? (
          Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard
              title="Total Feedback"
              value={stats?.total_feedback ?? 0}
              icon={BarChart2}
              color="indigo"
              subtitle="All time submissions"
            />
            <StatCard
              title="Average Rating"
              value={stats?.average_rating ?? 0}
              icon={Star}
              color="amber"
              subtitle="Out of 5.0"
              isDecimal
            />
            <StatCard
              title="Top Program"
              value={stats?.highest_rated_program ?? 'N/A'}
              icon={Trophy}
              color="emerald"
              subtitle="Highest rated"
            />
            <StatCard
              title="This Week"
              value={stats?.weekly_submissions ?? 0}
              icon={CalendarDays}
              color="rose"
              subtitle="Last 7 days"
            />
          </>
        )}
      </div>

      {/* Rating Distribution */}
      {!loading && stats?.rating_distribution && (
        <div className="glass rounded-2xl p-6">
          <h2 className="text-white font-bold text-lg font-sora mb-5">Rating Distribution</h2>
          <div className="space-y-3">
            {[...stats.rating_distribution].reverse().map((item) => (
              <div key={item.rating} className="flex items-center gap-4">
                <span className="text-sm text-slate-400 w-14 text-right flex-shrink-0">
                  {RATING_LABELS[item.rating]}
                </span>
                <div className="flex-1 bg-[#0F172A] rounded-full h-2.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${item.count > 0 ? Math.max((item.count / totalMax) * 100, 4) : 0}%`,
                      background: RATING_COLORS[item.rating],
                    }}
                  />
                </div>
                <span className="text-sm text-slate-500 w-16 flex-shrink-0">
                  {item.count} ({item.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Feedback */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-lg font-sora">Recent Feedback</h2>
          <button
            onClick={() => navigate('/feedback')}
            className="flex items-center gap-1.5 text-indigo-400 text-sm hover:text-indigo-300 transition-colors"
          >
            View All <ArrowRight size={15} />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="glass rounded-2xl p-5 space-y-3">
                <div className="flex gap-3">
                  <div className="skeleton w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-4 w-32" />
                    <div className="skeleton h-3 w-24" />
                  </div>
                </div>
                <div className="skeleton h-3 w-full" />
                <div className="skeleton h-3 w-4/5" />
              </div>
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <div className="text-5xl mb-4">💬</div>
            <p className="text-slate-400">No feedback yet. Be the first to submit!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {recent.map((fb) => (
              <FeedbackCard
                key={fb.feedback_id}
                feedback={fb}
                onEdit={setEditFeedback}
                onDelete={setDeleteFeedback}
              />
            ))}
          </div>
        )}
      </div>

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
