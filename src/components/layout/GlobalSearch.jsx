import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Inbox, MapPin, Search, Users } from 'lucide-react'
import SearchInput from '../ui/SearchInput'
import { mockEmployees } from '../../data/mockEmployees'
import { mockDocuments } from '../../data/mockDocuments'
import { initialRequests } from '../../data/mockRequests'
import { searchablePages } from '../../app/navigation'

export default function GlobalSearch({ compact = false }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const rootRef = useRef(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return { pages: [], people: [], documents: [], requests: [] }

    const pages = searchablePages
      .filter((p) => `${p.title} ${p.keywords}`.toLowerCase().includes(q))
      .slice(0, 5)
    const people = mockEmployees
      .filter((e) => `${e.name} ${e.id} ${e.role} ${e.department}`.toLowerCase().includes(q))
      .slice(0, 5)
    const documents = mockDocuments
      .filter((d) => d.category !== 'Payslips')
      .filter((d) => `${d.name} ${d.category}`.toLowerCase().includes(q))
      .slice(0, 5)
    const requests = initialRequests
      .filter((r) => `${r.type} ${r.description} ${r.status}`.toLowerCase().includes(q))
      .slice(0, 5)
    return { pages, people, documents, requests }
  }, [query])

  const hasResults =
    results.pages.length +
      results.people.length +
      results.documents.length +
      results.requests.length >
    0

  useEffect(() => {
    const onDoc = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const go = (path) => {
    navigate(path)
    setQuery('')
    setOpen(false)
  }

  return (
    <div ref={rootRef} className={`relative ${compact ? 'w-full' : 'w-full max-w-md'}`}>
      <SearchInput
        value={query}
        onChange={(v) => {
          setQuery(v)
          setOpen(true)
        }}
        onClear={() => setOpen(false)}
        placeholder="Search people, documents, requests…"
        aria-label="Global search"
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setOpen(false)
            e.currentTarget.blur()
          }
        }}
      />
      {open && query.trim() && (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 max-h-96 overflow-y-auto rounded-2xl border border-border bg-white p-1.5 shadow-[0_12px_32px_rgba(23,27,46,0.14)]">
          {!hasResults && (
            <p className="px-3 py-6 text-center text-sm text-ink-muted">No results for “{query}”.</p>
          )}
          {results.pages.length > 0 && (
            <ResultGroup title="Pages" icon={Search}>
              {results.pages.map((p) => (
                <ResultItem key={p.path} onClick={() => go(p.path)} title={p.title} meta="Navigate" />
              ))}
            </ResultGroup>
          )}
          {results.people.length > 0 && (
            <ResultGroup title="People" icon={Users}>
              {results.people.map((e) => (
                <ResultItem
                  key={e.id}
                  onClick={() => go(`/people/${e.id}`)}
                  title={e.name}
                  meta={`${e.id} · ${e.role}`}
                />
              ))}
            </ResultGroup>
          )}
          {results.documents.length > 0 && (
            <ResultGroup title="Documents" icon={FileText}>
              {results.documents.map((d) => (
                <ResultItem
                  key={d.id}
                  onClick={() => go(`/documents?category=${encodeURIComponent(d.category)}`)}
                  title={d.name}
                  meta={d.category}
                />
              ))}
            </ResultGroup>
          )}
          {results.requests.length > 0 && (
            <ResultGroup title="Requests" icon={Inbox}>
              {results.requests.map((r) => (
                <ResultItem
                  key={r.id}
                  onClick={() => go('/requests')}
                  title={r.type}
                  meta={r.status}
                />
              ))}
            </ResultGroup>
          )}
          <p className="mt-1 flex items-center gap-1 px-3 py-2 text-xs text-ink-subtle">
            <MapPin className="h-3 w-3" /> Demo search over local sample data
          </p>
        </div>
      )}
    </div>
  )
}

function ResultGroup({ title, icon: Icon, children }) {
  return (
    <div className="mb-1">
      <p className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink-subtle">
        <Icon className="h-3.5 w-3.5" /> {title}
      </p>
      {children}
    </div>
  )
}

function ResultItem({ title, meta, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-col rounded-xl px-3 py-2 text-left transition hover:bg-surface focus-visible:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/25"
    >
      <span className="text-sm font-medium text-ink">{title}</span>
      <span className="text-xs text-ink-muted">{meta}</span>
    </button>
  )
}
