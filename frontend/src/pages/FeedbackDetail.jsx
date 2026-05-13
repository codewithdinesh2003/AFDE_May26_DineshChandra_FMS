import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Pencil, Trash2, Loader2 } from 'lucide-react'
import RatingStars from '../components/RatingStars'
import EditModal from '../components/EditModal'
import ConfirmDialog from '../components/ConfirmDialog'
import { fetchFeedbackById, removeFeedback, searchFeedback } from '../services/feedbackService'
import { useToast } from '../App'

const RATING_LABELS = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent' }

function formatFull(d) {
  return new Date(d).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function Stars({ n }) {
  return <span style={{ color: '#f59e0b', fontSize: 20, letterSpacing: 2 }}>{'★'.repeat(n)}{'☆'.repeat(5 - n)}</span>
}

const Row = ({ label, children, last = false }) => (
  <div style={{
    display: 'flex', padding: '16px 0',
    borderBottom: last ? 'none' : '1px solid #f3f4f6',
    alignItems: 'flex-start', gap: 16,
  }}>
    <span style={{ fontSize: 13, color: '#9ca3af', fontWeight: 500, minWidth: 180, flexShrink: 0 }}>{label}</span>
    <span style={{ fontSize: 14, color: '#1f2937', flex: 1 }}>{children}</span>
  </div>
)

export default function FeedbackDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const addToast = useToast()
  const [fb, setFb] = useState(null)
  const [loading, setLoading] = useState(true)
  const [more, setMore] = useState([])
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  useEffect(() => { load() }, [id])

  const load = async () => {
    setLoading(true)
    const { data, error } = await fetchFeedbackById(id)
    if (error) { addToast(error, 'error'); navigate('/feedback'); return }
    setFb(data)
    // Load more from same participant
    const moreRes = await searchFeedback({ keyword: data.participant_name })
    if (moreRes.data) {
      setMore(moreRes.data.filter(x => x.feedback_id !== data.feedback_id).slice(0, 3))
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    const { success, error } = await removeFeedback(fb.feedback_id)
    if (success) { addToast('Feedback deleted'); navigate('/feedback') }
    else addToast(error, 'error')
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <Loader2 size={32} style={{ color: '#6366F1', animation: 'spin 1s linear infinite' }} />
      </div>
    )
  }
  if (!fb) return null

  return (
    <div className="page-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 800 }}>
      {/* Breadcrumb */}
      <div style={{ fontSize: 13, color: '#9ca3af', display: 'flex', gap: 6, alignItems: 'center' }}>
        <Link to="/" style={{ color: '#9ca3af', textDecoration: 'none' }} onMouseEnter={e => e.target.style.color = '#6366F1'} onMouseLeave={e => e.target.style.color = '#9ca3af'}>Dashboard</Link>
        <span>/</span>
        <Link to="/feedback" style={{ color: '#9ca3af', textDecoration: 'none' }} onMouseEnter={e => e.target.style.color = '#6366F1'} onMouseLeave={e => e.target.style.color = '#9ca3af'}>Feedback List</Link>
        <span>/</span>
        <span style={{ color: '#1f2937', fontWeight: 500 }}>Details</span>
      </div>

      {/* Action bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>Feedback Details</h1>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => setShowEdit(true)}
            style={{
              border: '1px solid #6366F1', color: '#6366F1', background: '#fff',
              padding: '9px 20px', borderRadius: 8, fontWeight: 500, fontSize: 14,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#ede9fe'}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
          >
            <Pencil size={14} /> Edit
          </button>
          <button
            onClick={() => setShowDelete(true)}
            style={{
              border: '1px solid #ef4444', color: '#ef4444', background: '#fff',
              padding: '9px 20px', borderRadius: 8, fontWeight: 500, fontSize: 14,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>

      {/* Detail card */}
      <div style={{
        background: '#fff', borderRadius: 12, padding: 32,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}>
        <Row label="Feedback ID">
          <span style={{ color: '#9ca3af' }}>#{fb.feedback_id}</span>
        </Row>
        <Row label="Participant Name">
          <strong>{fb.participant_name}</strong>
        </Row>
        <Row label="Program / Event">
          {fb.program_name}
        </Row>
        <Row label="Rating">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Stars n={fb.rating} />
            <span style={{ fontSize: 13, color: '#6366F1', fontWeight: 600 }}>
              {fb.rating} - {RATING_LABELS[fb.rating]}
            </span>
          </div>
        </Row>
        <Row label="Comments">
          <span style={{ lineHeight: 1.7, color: '#4b5563' }}>
            {fb.comments || <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>No comments provided.</span>}
          </span>
        </Row>
        <Row label="Submitted At" last>
          {formatFull(fb.submitted_at)}
        </Row>
      </div>

      {/* More from same participant */}
      <div style={{
        background: '#fff', borderRadius: 12, padding: '20px 24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1f2937' }}>
            More Feedback from {fb.participant_name}
          </h3>
          <Link
            to="/feedback"
            style={{ fontSize: 13, color: '#6366F1', textDecoration: 'none', fontWeight: 500 }}
          >View All</Link>
        </div>

        {more.length === 0 ? (
          <p style={{ fontSize: 13, color: '#9ca3af', textAlign: 'center', padding: '20px 0' }}>
            No other feedback from this participant.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  {['Program Name', 'Rating', 'Submitted At'].map(h => (
                    <th key={h} style={{
                      padding: '10px 14px', textAlign: 'left',
                      fontSize: 11, color: '#6b7280', fontWeight: 600,
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                      borderBottom: '1px solid #e5e7eb',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {more.map(m => (
                  <tr
                    key={m.feedback_id}
                    className="tbl-row"
                    style={{ borderBottom: '1px solid #f3f4f6', cursor: 'pointer' }}
                    onClick={() => navigate(`/feedback/${m.feedback_id}`)}
                  >
                    <td style={{ padding: '12px 14px', fontSize: 13, color: '#6b7280' }}>{m.program_name}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ color: '#f59e0b', fontSize: 13 }}>{'★'.repeat(m.rating)}</span>
                    </td>
                    <td style={{ padding: '12px 14px', fontSize: 12, color: '#9ca3af' }}>
                      {formatFull(m.submitted_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <EditModal
        isOpen={showEdit} feedback={fb}
        onClose={() => setShowEdit(false)}
        onSuccess={(updated) => { addToast('Feedback updated!'); setFb(updated) }}
      />
      <ConfirmDialog
        isOpen={showDelete} participantName={fb.participant_name}
        onConfirm={handleDelete} onCancel={() => setShowDelete(false)}
      />
    </div>
  )
}
