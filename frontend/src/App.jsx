import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useCallback, createContext, useContext } from 'react'
import Sidebar from './components/Sidebar'
import TopNavbar from './components/TopNavbar'
import Toast from './components/Toast'
import Dashboard from './pages/Dashboard'
import SubmitFeedback from './pages/SubmitFeedback'
import FeedbackList from './pages/FeedbackList'
import FeedbackDetail from './pages/FeedbackDetail'

const ToastContext = createContext(null)
export const useToast = () => useContext(ToastContext)

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200)
  }, [])

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={addToast}>
      <BrowserRouter>
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f3f4f6' }}>
          {/* Mobile backdrop */}
          {sidebarOpen && (
            <div
              className="mobile-backdrop"
              onClick={() => setSidebarOpen(false)}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.5)',
                zIndex: 40, display: 'none',
              }}
            />
          )}

          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          {/* Main content */}
          <div
            className="main-wrapper"
            style={{ flex: 1, marginLeft: 240, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
          >
            <TopNavbar onMenuClick={() => setSidebarOpen(true)} />
            <main style={{ flex: 1, padding: 24, background: '#f3f4f6', minHeight: 0 }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/submit" element={<SubmitFeedback />} />
                <Route path="/feedback" element={<FeedbackList />} />
                <Route path="/feedback/:id" element={<FeedbackDetail />} />
              </Routes>
            </main>
          </div>
        </div>
        <Toast toasts={toasts} onDismiss={dismissToast} />
      </BrowserRouter>
    </ToastContext.Provider>
  )
}
