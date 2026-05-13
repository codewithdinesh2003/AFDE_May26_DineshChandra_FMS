import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useCallback, createContext, useContext } from 'react'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import SubmitFeedback from './pages/SubmitFeedback'
import FeedbackList from './pages/FeedbackList'
import FeedbackDetail from './pages/FeedbackDetail'

// Toast context
const ToastContext = createContext(null)
export const useToast = () => useContext(ToastContext)

function Toast({ toasts }) {
  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto toast-enter flex items-start gap-3 px-4 py-3 rounded-xl shadow-2xl text-sm font-medium max-w-xs ${
            t.type === 'success'
              ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
              : 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
          }`}
          style={{ backdropFilter: 'blur(12px)' }}
        >
          <span>{t.type === 'success' ? '✓' : '✕'}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  )
}

function AppLayout({ children, addToast }) {
  return (
    <div className="flex min-h-screen">
      <Navbar />
      <main className="flex-1 ml-64 min-h-screen p-8">
        {children}
      </main>
    </div>
  )
}

export default function App() {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500)
  }, [])

  return (
    <ToastContext.Provider value={addToast}>
      <BrowserRouter>
        <Toast toasts={toasts} />
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/submit" element={<SubmitFeedback />} />
            <Route path="/feedback" element={<FeedbackList />} />
            <Route path="/feedback/:id" element={<FeedbackDetail />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </ToastContext.Provider>
  )
}
