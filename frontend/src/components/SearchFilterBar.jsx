import { useState, useEffect, useCallback } from 'react'
import { Search, X, SlidersHorizontal } from 'lucide-react'

export default function SearchFilterBar({ onFilter }) {
  const [keyword, setKeyword] = useState('')
  const [rating, setRating] = useState('')
  const [programName, setProgramName] = useState('')

  const hasFilters = keyword || rating || programName

  const emitFilter = useCallback(
    (kw, rt, pn) => {
      onFilter({ keyword: kw || undefined, rating: rt ? Number(rt) : undefined, program_name: pn || undefined })
    },
    [onFilter]
  )

  // Debounce keyword
  useEffect(() => {
    const timer = setTimeout(() => emitFilter(keyword, rating, programName), 400)
    return () => clearTimeout(timer)
  }, [keyword, rating, programName, emitFilter])

  const clearAll = () => {
    setKeyword('')
    setRating('')
    setProgramName('')
    emitFilter('', '', '')
  }

  return (
    <div className="glass rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex flex-wrap gap-3 items-center">
        {/* Keyword search */}
        <div className="flex-1 min-w-48 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, program, or comment..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full bg-[#0F172A] border border-[#334155] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Rating filter */}
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="bg-[#0F172A] border border-[#334155] rounded-xl px-3 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
        >
          <option value="">All Ratings</option>
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>{r} {r === 1 ? 'Star' : 'Stars'}</option>
          ))}
        </select>

        {/* Program filter */}
        <div className="relative min-w-40">
          <SlidersHorizontal size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Filter by program..."
            value={programName}
            onChange={(e) => setProgramName(e.target.value)}
            className="w-full bg-[#0F172A] border border-[#334155] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Clear button */}
        {hasFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm text-rose-400 border border-rose-500/30 hover:bg-rose-500/10 transition-colors"
          >
            <X size={14} />
            Clear
          </button>
        )}
      </div>

      {/* Active filter pills */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2">
          {keyword && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
              Keyword: "{keyword}"
              <button onClick={() => setKeyword('')}><X size={11} /></button>
            </span>
          )}
          {rating && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-amber-500/15 text-amber-400 border border-amber-500/20">
              Rating: {rating}★
              <button onClick={() => setRating('')}><X size={11} /></button>
            </span>
          )}
          {programName && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
              Program: "{programName}"
              <button onClick={() => setProgramName('')}><X size={11} /></button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}
