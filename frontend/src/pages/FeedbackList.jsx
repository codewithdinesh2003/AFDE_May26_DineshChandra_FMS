import { useEffect, useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Pencil, Trash2, PlusCircle, Search, ChevronLeft, ChevronRight, Inbox } from 'lucide-react'
import EditModal from '../components/EditModal'
import ConfirmDialog from '../components/ConfirmDialog'
import { fetchAllFeedback, searchFeedback, removeFeedback } from '../services/feedbackService'
import { useToast } from '../App'

const PAGE_SIZE = 10

function formatDateTime(d) {
  return new Date(d).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function Stars({ n }) {
  return <span style={{ color: '#f59e0b', fontSize: 14, letterSpacing: 1 }}>{'★'.repeat(n)}{'☆'.repeat(5 - n)}</span>
}

function SkeletonRows() {
  return Array(5).fill(0).map((_, i) => (
    <tr key={i}>
      {[40, 120, 100, 80, 160, 90, 80].map((w, j) => (
        <td key={j} style={{ padding: '14px 16px' }}>
          <div className="skeleton" style={{ height: 13, width: w }} />
        </td>
      ))}
    </tr>
  ))
}

const selectStyle = {
  border: '1px solid #e5e7eb', borderRadius: 8, padding: '10px 14px',
  fontSize: 13, color: '#374151', background: '#fff', cursor: 'pointer', outline: 'none',
}

export default function FeedbackList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [ratingFilter, setRatingFilter] = useState('')
  const [programFilter, setProgramFilter] = useState('')
  const [programs, setPrograms] = useState([])
  const [editItem, setEditItem] = useState(null)
  const [deleteItem, setDeleteItem] = useState(null)
  const debounceRef = useRef(null)
  const navigate = useNavigate()
  const addToast = useToast()

  const loadData = useCallback(async (kw = keyword, rt = ratingFilter, pn = programFilter) => {
    setLoading(true)
    const hasFilter = kw || rt || pn
    const res = hasFilter
      ? await searchFeedback({ keyword: kw || undefined, rating: rt ? Number(rt) : undefined, program_name: pn || undefined })
      : await fetchAllFeedback({ limit: 500 })
    if (res.data) {
      setItems(res.data)
      if (!hasFilter) {
        const unique = [...new Set(res.data.map(f => f.program_name))].sort()
        setPrograms(unique)
      }
    }
    setLoading(false)
  }, [keyword, ratingFilter, programFilter])

  useEffect(() => { loadData('', '', '') }, [])

  const handleKeywordChange = (val) => {
    setKeyword(val)
    setPage(1)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => loadData(val, ratingFilter, programFilter), 400)
  }

  const handleRatingChange = (val) => { setRatingFilter(val); setPage(1); loadData(keyword, val, programFilter) }
  const handleProgramChange = (val) => { setProgramFilter(val); setPage(1); loadData(keyword, ratingFilter, val) }

  const handleReset = () => {
    setKeyword(''); setRatingFilter(''); setProgramFilter(''); setPage(1)
    loadData('', '', '')
  }

  const handleDelete = async () => {
    const { success, error } = await removeFeedback(deleteItem.feedback_id)
    if (success) { addToast('Feedback deleted'); setDeleteItem(null); loadData() }
    else addToast(error, 'error')
  }

  const totalPages = Math.ceil(items.length / PAGE_SIZE)
  const paginated = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const hasFilters = keyword || ratingFilter || programFilter

  const pageNumbers = () => {
    const pages = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (page > 3) pages.push('...')
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
      if (page < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }

  const btnStyle = (active) => ({
    width: 32, height: 32, borderRadius: 6, border: '1px solid',
    fontSize: 13, fontWeight: active ? 600 : 400, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: active ? '#6366F1' : '#fff',
    color: active ? '#fff' : '#374151',
    borderColor: active ? '#6366F1' : '#e5e7eb',
  })

  return (
    <div className="page-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1f2937' }}>Feedback List</h1>
        <button
          onClick={() => navigate('/submit')}
          style={{
            background: '#6366F1', color: '#fff', border: 'none',
            borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 600,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#4f46e5'; e.currentTarget.style.transform = 'scale(1.02)' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#6366F1'; e.currentTarget.style.transform = 'scale(1)' }}
        >
          <PlusCircle size={16} /> Submit Feedback
        </button>
      </div>

      {/* Filter bar */}
      <div style={{
        background: '#fff', borderRadius: 12, padding: '16px 20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center',
      }}>
        {/* Search */}
        <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input
            value={keyword}
            onChange={e => handleKeywordChange(e.target.value)}
            placeholder="Search by name, program or comments..."
            style={{
              width: '100%', border: '1px solid #e5e7eb', borderRadius: 8,
              padding: '10px 14px 10px 40px', fontSize: 13, color: '#374151',
              background: '#fff', outline: 'none',
            }}
          />
        </div>

        {/* Rating dropdown */}
        <select value={ratingFilter} onChange={e => handleRatingChange(e.target.value)} style={{ ...selectStyle, width: 160 }}>
          <option value="">All Ratings</option>
          <option value="5">5 - Excellent</option>
          <option value="4">4 - Very Good</option>
          <option value="3">3 - Good</option>
          <option value="2">2 - Fair</option>
          <option value="1">1 - Poor</option>
        </select>

        {/* Program dropdown */}
        <select value={programFilter} onChange={e => handleProgramChange(e.target.value)} style={{ ...selectStyle, width: 180 }}>
          <option value="">All Programs</option>
          {programs.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        {/* Reset */}
        <button
          onClick={handleReset}
          style={{
            border: '1px solid #e5e7eb', background: '#fff', color: '#6b7280',
            borderRadius: 8, padding: '10px 16px', fontSize: 13, cursor: 'pointer',
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
          onMouseLeave={e => e.currentTarget.style.background = '#fff'}
        >⟳ Reset</button>
      </div>

      {/* Table */}
      <div style={{
        background: '#fff', borderRadius: 12,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden',
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                {['ID', 'Participant Name', 'Program Name', 'Rating', 'Comments', 'Submitted At', 'Actions'].map(h => (
                  <th key={h} style={{
                    padding: '14px 16px', textAlign: 'left',
                    fontSize: 12, color: '#6b7280', fontWeight: 600,
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    borderBottom: '2px solid #e5e7eb',
                    whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonRows />
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '60px 16px', textAlign: 'center' }}>
                    <Inbox size={48} style={{ color: '#d1d5db', margin: '0 auto 12px', display: 'block' }} />
                    <p style={{ fontSize: 16, fontWeight: 600, color: '#374151', marginBottom: 4 }}>No feedback found</p>
                    <p style={{ fontSize: 13, color: '#9ca3af' }}>
                      {hasFilters ? 'Try adjusting your search or filters.' : (
                        <>No feedback yet. <button onClick={() => navigate('/submit')} style={{ color: '#6366F1', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13 }}>+ Submit the first feedback</button></>
                      )}
                    </p>
                  </td>
                </tr>
              ) : (
                paginated.map((fb, i) => (
                  <tr
                    key={fb.feedback_id}
                    className="tbl-row"
                    style={{ background: '#fff', borderBottom: '1px solid #f3f4f6' }}
                  >
                    <td style={{ padding: '14px 16px', fontSize: 13, color: '#9ca3af', fontWeight: 500 }}>
                      #{fb.feedback_id}
                    </td>
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
                      maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {fb.comments || '—'}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 12, color: '#9ca3af', whiteSpace: 'nowrap' }}>
                      {formatDateTime(fb.submitted_at)}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {[
                          { Icon: Eye, action: () => navigate(`/feedback/${fb.feedback_id}`), hoverColor: '#6366F1', hoverBg: '#ede9fe' },
                          { Icon: Pencil, action: () => setEditItem(fb), hoverColor: '#d97706', hoverBg: '#fef3c7' },
                          { Icon: Trash2, action: () => setDeleteItem(fb), hoverColor: '#ef4444', hoverBg: '#fef2f2' },
                        ].map(({ Icon, action, hoverColor, hoverBg }, j) => (
                          <button
                            key={j}
                            onClick={action}
                            style={{
                              width: 30, height: 30, borderRadius: 6,
                              border: '1px solid #e5e7eb', background: '#fff',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              cursor: 'pointer', color: '#9ca3af',
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.color = hoverColor
                              e.currentTarget.style.borderColor = hoverColor
                              e.currentTarget.style.background = hoverBg
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.color = '#9ca3af'
                              e.currentTarget.style.borderColor = '#e5e7eb'
                              e.currentTarget.style.background = '#fff'
                            }}
                          >
                            <Icon size={14} />
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && items.length > 0 && (
          <div style={{
            padding: '14px 20px', display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', borderTop: '1px solid #f3f4f6',
          }}>
            <span style={{ fontSize: 13, color: '#6b7280' }}>
              Showing {Math.min((page - 1) * PAGE_SIZE + 1, items.length)} to{' '}
              {Math.min(page * PAGE_SIZE, items.length)} of {items.length} entries
            </span>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{ ...btnStyle(false), opacity: page === 1 ? 0.4 : 1, cursor: page === 1 ? 'not-allowed' : 'pointer' }}
              >
                <ChevronLeft size={14} />
              </button>
              {pageNumbers().map((n, i) => (
                n === '...' ? (
                  <span key={i} style={{ fontSize: 13, color: '#9ca3af', padding: '0 4px' }}>…</span>
                ) : (
                  <button key={n} onClick={() => setPage(n)} style={btnStyle(page === n)}>{n}</button>
                )
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalPages === 0}
                style={{ ...btnStyle(false), opacity: (page === totalPages || totalPages === 0) ? 0.4 : 1, cursor: (page === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer' }}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
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
