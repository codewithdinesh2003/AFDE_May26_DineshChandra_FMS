import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageSquare, Star, ThumbsUp, BarChart2 } from 'lucide-react'
import StatCard from '../components/StatCard'
import LineChart from '../components/LineChart'
import DonutChart from '../components/DonutChart'
import ConfirmDialog from '../components/ConfirmDialog'
import EditModal from '../components/EditModal'
import { fetchStats, fetchAllFeedback, removeFeedback } from '../services/feedbackService'
import { useToast } from '../App'

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function Stars({ n }) {
  return (
    <span style={{ color: '#f59e0b', fontSize: 14, letterSpacing: 1 }}>
      {'★'.repeat(n)}{'☆'.repeat(5 - n)}
    </span>
  )
}

function SkeletonStat() {
  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: '20px 24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
    }}>
      <div style={{ flex: 1 }}>
        <div className="skeleton" style={{ height: 13, width: 100, marginBottom: 10 }} />
        <div className="skeleton" style={{ height: 32, width: 64 }} />
        <div className="skeleton" style={{ height: 12, width: 80, marginTop: 8 }} />
      </div>
      <div className="skeleton" style={{ width: 48, height: 48, borderRadius: '50%' }} />
    </div>
  )
}

function SkeletonRow() {
  return (
    <tr>
      {[140, 100, 80, 160, 90].map((w, i) => (
        <td key={i} style={{ padding: '14px 16px' }}>
          <div className="skeleton" style={{ height: 13, width: w }} />
        </td>
      ))}
    </tr>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [allFeedback, setAllFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [editItem, setEditItem] = useState(null)
  const [deleteItem, setDeleteItem] = useState(null)
  const navigate = useNavigate()
  const addToast = useToast()

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    setLoading(true)
    const [statsRes, fbRes] = await Promise.all([
      fetchStats(),
      fetchAllFeedback({ limit: 200 }),
    ])
    if (statsRes.data) setStats(statsRes.data)
    if (fbRes.data) setAllFeedback(fbRes.data)
    setLoading(false)
  }

  const handleDelete = async () => {
    const { success, error } = await removeFeedback(deleteItem.feedback_id)
    if (success) { addToast('Feedback deleted'); setDeleteItem(null); loadData() }
    else addToast(error, 'error')
  }

  // Compute month-over-month change
  const now = new Date()
  const thisMonth = allFeedback.filter(f => {
    const d = new Date(f.submitted_at)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1)
  const lastMonth = allFeedback.filter(f => {
    const d = new Date(f.submitted_at)
    return d.getMonth() === lastMonthDate.getMonth() && d.getFullYear() === lastMonthDate.getFullYear()
  })
  const pctChange = (curr, prev) => {
    if (prev === 0) return curr > 0 ? '+100% this month' : 'No change'
    const p = Math.round(((curr - prev) / prev) * 100)
    return `${p >= 0 ? '+' : ''}${p}% this month`
  }

  const excellentCount = stats?.rating_distribution?.filter(d => d.rating >= 4).reduce((s, d) => s + d.count, 0) ?? 0
  const avgCount = stats?.rating_distribution?.find(d => d.rating === 3)?.count ?? 0
  const recent5 = allFeedback.slice(0, 5)

  const statCards = [
    {
      title: 'Total Feedback', value: stats?.total_feedback ?? 0,
      subtitle: pctChange(thisMonth.length, lastMonth.length),
      icon: MessageSquare, iconBg: '#ede9fe', iconColor: '#7c3aed',
    },
    {
      title: 'Average Rating', value: stats?.average_rating ? stats.average_rating.toFixed(1) : '0.0',
      subtitle: '+0.2 from last month', subtitleColor: '#10B981',
      icon: Star, iconBg: '#fef3c7', iconColor: '#d97706',
    },
    {
      title: 'Excellent (4-5★)', value: excellentCount,
      subtitle: pctChange(excellentCount, Math.max(lastMonth.filter(f => f.rating >= 4).length, 0)),
      icon: ThumbsUp, iconBg: '#d1fae5', iconColor: '#059669',
    },
    {
      title: 'Average (3★)', value: avgCount,
      subtitle: 'Neutral responses',
      subtitleColor: '#6b7280',
      icon: BarChart2, iconBg: '#ffedd5', iconColor: '#ea580c',
    },
  ]

  return (
    <div className="page-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1f2937' }}>Dashboard</h1>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
        {loading
          ? Array(4).fill(0).map((_, i) => <SkeletonStat key={i} />)
          : statCards.map((c, i) => <StatCard key={i} {...c} />)
        }
      </div>

      {/* Charts row */}
      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ flex: 1.4 }}>
          <LineChart feedbackList={allFeedback} />
        </div>
        <div style={{ flex: 1 }}>
          <DonutChart distribution={stats?.rating_distribution || []} />
        </div>
      </div>

      {/* Recent feedback table */}
      <div style={{
        background: '#fff', borderRadius: 12,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden',
      }}>
        <div style={{
          padding: '16px 20px', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center',
          borderBottom: '1px solid #f3f4f6',
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#1f2937' }}>Recent Feedback</h3>
          <button
            onClick={() => navigate('/feedback')}
            style={{
              background: 'none', border: 'none', color: '#6366F1',
              fontSize: 13, fontWeight: 500, cursor: 'pointer',
            }}
          >View All →</button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                {['Participant', 'Program', 'Rating', 'Comments', 'Submitted At'].map(h => (
                  <th key={h} style={{
                    padding: '12px 16px', textAlign: 'left',
                    fontSize: 12, color: '#6b7280', fontWeight: 600,
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    borderBottom: '1px solid #e5e7eb',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array(5).fill(0).map((_, i) => <SkeletonRow key={i} />)
                : recent5.map((fb, i) => (
                    <tr
                      key={fb.feedback_id}
                      className="tbl-row-dashboard"
                      style={{
                        background: i % 2 === 0 ? '#fff' : '#fafafa',
                        borderBottom: '1px solid #f3f4f6',
                      }}
                    >
                      <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: '#1f2937' }}>
                        {fb.participant_name}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: '#6b7280' }}>
                        {fb.program_name}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <Stars n={fb.rating} />
                      </td>
                      <td style={{
                        padding: '14px 16px', fontSize: 13, color: '#6b7280',
                        maxWidth: 220, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {fb.comments || '—'}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 12, color: '#9ca3af' }}>
                        {formatDate(fb.submitted_at)}
                      </td>
                    </tr>
                  ))
              }
              {!loading && recent5.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '40px 16px', textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>
                    No feedback yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EditModal
        isOpen={!!editItem} feedback={editItem}
        onClose={() => setEditItem(null)}
        onSuccess={() => { addToast('Feedback updated!'); loadData() }}
      />
      <ConfirmDialog
        isOpen={!!deleteItem} participantName={deleteItem?.participant_name}
        onConfirm={handleDelete} onCancel={() => setDeleteItem(null)}
      />
    </div>
  )
}
