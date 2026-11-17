import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, Users } from 'lucide-react'
import Card from '../../components/ui/Card'
import SearchInput from '../../components/ui/SearchInput'
import Select from '../../components/ui/Select'
import Tabs from '../../components/ui/Tabs'
import Avatar from '../../components/ui/Avatar'
import EmptyState from '../../components/ui/EmptyState'
import Button from '../../components/ui/Button'
import { useToast } from '../../components/ui/Toast'
import { departments, locations, mockEmployees } from '../../data/mockEmployees'

export default function PeoplePage() {
  const { toast } = useToast()
  const [employees, setEmployees] = useState(mockEmployees)
  const [view, setView] = useState('everyone')
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('')
  const [location, setLocation] = useState('')

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      if (view === 'starred' && !e.starred) return false
      if (department && e.department !== department) return false
      if (location && e.location !== location) return false
      if (search) {
        const q = search.toLowerCase()
        if (!`${e.name} ${e.id} ${e.role}`.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [employees, view, search, department, location])

  const toggleStar = (id) => {
    setEmployees((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e
        const starred = !e.starred
        toast(starred ? `Starred ${e.name}` : `Removed star from ${e.name}`, { tone: 'info' })
        return { ...e, starred }
      }),
    )
  }

  return (
    <div className="space-y-5">
      <p className="text-sm text-ink-muted">Browse colleagues across departments and locations.</p>
      <Tabs
        value={view}
        onChange={setView}
        tabs={[
          { id: 'everyone', label: 'Everyone', count: employees.length },
          { id: 'starred', label: 'Starred', count: employees.filter((e) => e.starred).length },
        ]}
      />
      <div className="grid gap-3 md:grid-cols-3">
        <SearchInput value={search} onChange={setSearch} placeholder="Search name or employee ID…" />
        <Select value={department} onChange={setDepartment} placeholder="All departments" options={departments} />
        <Select value={location} onChange={setLocation} placeholder="All locations" options={locations} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No people found"
          description="Adjust search or filters to see more colleagues."
          action={
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setSearch('')
                setDepartment('')
                setLocation('')
                setView('everyone')
              }}
            >
              Reset
            </Button>
          }
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {filtered.map((e) => (
            <li key={e.id}>
              <Card className="h-full">
                <div className="flex items-start gap-3">
                  <Avatar name={e.name} color={e.avatarColor} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link to={`/people/${e.id}`} className="font-semibold text-ink hover:text-accent">
                          {e.name}
                        </Link>
                        <p className="text-xs text-ink-muted">{e.id}</p>
                      </div>
                      <button
                        type="button"
                        aria-label={e.starred ? `Unstar ${e.name}` : `Star ${e.name}`}
                        onClick={() => toggleStar(e.id)}
                        className={`rounded-lg p-1.5 ${e.starred ? 'text-amber-500' : 'text-ink-subtle hover:text-amber-500'}`}
                      >
                        <Star className={`h-4 w-4 ${e.starred ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-ink">{e.role}</p>
                    <p className="text-sm text-ink-muted">
                      {e.department} · {e.location}
                    </p>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
