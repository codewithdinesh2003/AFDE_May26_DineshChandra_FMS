import { NavLink } from 'react-router-dom'
import { LayoutDashboard, PlusCircle, ListFilter, MessageSquareHeart } from 'lucide-react'

const navLinks = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/submit', label: 'Submit Feedback', icon: PlusCircle },
  { to: '/feedback', label: 'All Feedback', icon: ListFilter },
]

export default function Navbar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 flex flex-col z-30 bg-[#0F172A] border-r border-[#1E293B]">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-[#1E293B]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <MessageSquareHeart size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-white text-lg font-bold font-sora leading-none">FeedbackHub</h1>
            <p className="text-slate-500 text-xs mt-0.5">Management System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1">
        <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider px-3 mb-3">
          Navigation
        </p>
        {navLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-[#1E293B]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={18}
                  className={isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}
                />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-[#1E293B]">
        <p className="text-slate-600 text-xs text-center">Phase 1 — FMS</p>
        <p className="text-slate-700 text-xs text-center mt-0.5">© 2025 FeedbackHub</p>
      </div>
    </aside>
  )
}
