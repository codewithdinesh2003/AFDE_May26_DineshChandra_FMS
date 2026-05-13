import { useLocation } from 'react-router-dom'
import { Menu, Bell } from 'lucide-react'

const PAGE_TITLES = {
  '/':        'Dashboard',
  '/submit':  'Submit Feedback',
  '/feedback':'Feedback List',
}

function getTitle(pathname) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]
  if (pathname.startsWith('/feedback/')) return 'Feedback Details'
  return 'Dashboard'
}

export default function TopNavbar({ onMenuClick }) {
  const { pathname } = useLocation()

  return (
    <header style={{
      height: 60, background: '#fff', flexShrink: 0,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      display: 'flex', alignItems: 'center',
      padding: '0 24px', gap: 16, position: 'sticky', top: 0, zIndex: 20,
    }}>
      {/* Hamburger (mobile) */}
      <button
        onClick={onMenuClick}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 6, borderRadius: 6, color: '#6b7280',
        }}
        className="lg:hidden"
      >
        <Menu size={22} />
      </button>

      {/* Page title */}
      <h2 style={{ flex: 1, fontSize: 18, fontWeight: 600, color: '#1f2937', margin: 0 }}>
        {getTitle(pathname)}
      </h2>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Bell */}
        <button style={{
          position: 'relative', background: 'none', border: 'none',
          cursor: 'pointer', padding: 6, borderRadius: 8,
          display: 'flex', alignItems: 'center', color: '#6b7280',
        }}>
          <Bell size={20} />
          <span style={{
            position: 'absolute', top: 4, right: 4,
            width: 8, height: 8, borderRadius: '50%',
            background: '#EF4444', border: '2px solid #fff',
          }} />
        </button>

        {/* Avatar */}
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
          flexShrink: 0,
        }}>AU</div>
      </div>
    </header>
  )
}
