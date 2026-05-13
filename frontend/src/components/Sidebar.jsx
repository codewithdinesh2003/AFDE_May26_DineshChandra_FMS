import { NavLink } from 'react-router-dom'
import { LayoutDashboard, PlusCircle, List, ChevronDown, MessageSquareText } from 'lucide-react'

const navItems = [
  { to: '/',         label: 'Dashboard',       icon: LayoutDashboard, end: true },
  { to: '/submit',   label: 'Submit Feedback',  icon: PlusCircle },
  { to: '/feedback', label: 'Feedback List',    icon: List, end: true },
]

export default function Sidebar({ isOpen, onClose }) {
  return (
    <aside
      className={`sidebar${isOpen ? ' sidebar-open' : ''}`}
      style={{
        width: 240, background: '#1a1a2e',
        position: 'fixed', top: 0, left: 0, bottom: 0,
        display: 'flex', flexDirection: 'column',
        zIndex: 50, flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{
        padding: '0 16px', height: 60, flexShrink: 0,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 36, height: 36, background: '#6366F1', borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <MessageSquareText size={18} color="white" />
        </div>
        <div>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, lineHeight: 1.3 }}>Feedback</div>
          <div style={{ color: '#6b7280', fontSize: 10.5, marginTop: 1 }}>Management System</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '16px 12px', flex: 1, overflowY: 'auto' }}>
        {navItems.map(({ to, label, icon: Icon, end }, i) => (
          <NavLink
            key={i}
            to={to}
            end={end}
            onClick={onClose}
            className="nav-item"
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 12,
              height: 44, borderRadius: 8, padding: '0 12px',
              marginBottom: 4, textDecoration: 'none', fontSize: 14,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? '#fff' : '#9ca3af',
              background: isActive ? '#6366F1' : 'transparent',
            })}
          >
            {({ isActive }) => (
              <>
                <Icon size={20} style={{ color: isActive ? '#fff' : '#9ca3af', flexShrink: 0 }} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User block */}
      <div style={{ flexShrink: 0 }}>
        <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '0 12px' }} />
        <div style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 12, fontWeight: 700,
          }}>AU</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>Admin User</div>
            <div style={{ color: '#6b7280', fontSize: 11 }}>Administrator</div>
          </div>
          <ChevronDown size={16} style={{ color: '#6b7280', flexShrink: 0 }} />
        </div>
      </div>
    </aside>
  )
}
