import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Download, Eye, FolderOpen } from 'lucide-react'
import Card, { CardHeader } from '../../components/ui/Card'
import SearchInput from '../../components/ui/SearchInput'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import Tabs from '../../components/ui/Tabs'
import { useToast } from '../../components/ui/Toast'
import { documentCategories, mockDocuments } from '../../data/mockDocuments'
import { formatDate } from '../../lib/formatters'

export default function DocumentsPage() {
  const { toast } = useToast()
  const [params, setParams] = useSearchParams()
  const rawCategory = params.get('category') || 'All'
  const category = rawCategory === 'Payslips' ? 'All' : rawCategory
  const [search, setSearch] = useState('')

  const tabs = [{ id: 'All', label: 'All' }, ...documentCategories.map((c) => ({ id: c, label: c }))]

  const filtered = useMemo(() => {
    return mockDocuments.filter((d) => {
      if (d.category === 'Payslips') return false
      if (category !== 'All' && d.category !== category) return false
      if (search && !`${d.name} ${d.category}`.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [category, search])

  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-muted">
        Find Form 16, policies, and HR forms. Payslips are available only under Salary → Payslips.
      </p>
      <Tabs
        tabs={tabs}
        value={category}
        onChange={(id) => {
          if (id === 'All') setParams({})
          else setParams({ category: id })
        }}
      />
      <SearchInput value={search} onChange={setSearch} placeholder="Search documents…" className="max-w-md" />

      {filtered.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No documents found"
          description="Try another category or clear your search."
          action={
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setSearch('')
                setParams({})
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <>
          {/* Desktop table */}
          <Card padding={false} className="hidden md:block">
            <div className="border-b border-border px-5 py-4">
              <CardHeader title={`${filtered.length} document${filtered.length === 1 ? '' : 's'}`} className="mb-0" />
            </div>
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-ink-muted">
                <tr>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Last updated</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((doc) => (
                  <tr key={doc.id} className="border-t border-border">
                    <td className="px-5 py-3 font-medium text-ink">
                      {doc.name}
                      <span className="ml-2 text-xs text-ink-subtle">{doc.size}</span>
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant="neutral">{doc.category}</Badge>
                    </td>
                    <td className="px-5 py-3 text-ink-muted">{formatDate(doc.updatedAt)}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary" onClick={() => toast(`Opening “${doc.name}”`, { tone: 'info' })}>
                          <Eye className="h-4 w-4" /> View
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => toast(`Download started: ${doc.name}`)}>
                          <Download className="h-4 w-4" /> Download
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* Mobile cards */}
          <ul className="space-y-3 md:hidden">
            {filtered.map((doc) => (
              <li key={doc.id}>
                <Card>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-ink">{doc.name}</p>
                      <p className="mt-1 text-xs text-ink-muted">
                        {doc.category} · Updated {formatDate(doc.updatedAt)}
                      </p>
                    </div>
                    <Badge variant="neutral">{doc.size}</Badge>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => toast(`Opening “${doc.name}”`, { tone: 'info' })}>
                      View
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => toast(`Download started: ${doc.name}`)}>
                      Download
                    </Button>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
