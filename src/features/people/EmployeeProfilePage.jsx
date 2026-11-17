import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Mail, MapPin, Phone, Briefcase } from 'lucide-react'
import Card, { CardHeader } from '../../components/ui/Card'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import EmptyState from '../../components/ui/EmptyState'
import { getEmployeeById } from '../../data/mockEmployees'
import { formatDate } from '../../lib/formatters'

export default function EmployeeProfilePage() {
  const { employeeId } = useParams()
  const employee = getEmployeeById(employeeId)

  if (!employee) {
    return (
      <EmptyState
        title="Employee not found"
        description="This profile is not in the sample directory."
        action={
          <Link to="/people">
            <Button size="sm" variant="secondary">Back to People</Button>
          </Link>
        }
      />
    )
  }

  return (
    <div className="space-y-5">
      <Link to="/people" className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to People
      </Link>

      <Card>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Avatar name={employee.name} color={employee.avatarColor} size="xl" />
          <div>
            <h2 className="text-2xl font-semibold text-ink">{employee.name}</h2>
            <p className="text-ink-muted">
              {employee.role} · {employee.id}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="accent">{employee.department}</Badge>
              <Badge variant="neutral">{employee.employmentType}</Badge>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader title="Work information" />
          <dl className="space-y-3 text-sm">
            <Row icon={Briefcase} label="Role" value={employee.role} />
            <Row icon={Briefcase} label="Department" value={employee.department} />
            <Row icon={MapPin} label="Location" value={employee.location} />
            <Row icon={Briefcase} label="Manager" value={employee.manager} />
            <Row icon={Briefcase} label="Join date" value={formatDate(employee.joinDate)} />
          </dl>
        </Card>
        <Card>
          <CardHeader title="Contact details" />
          <dl className="space-y-3 text-sm">
            <Row icon={Mail} label="Email" value={employee.email} />
            <Row icon={Phone} label="Phone" value={employee.phone} />
          </dl>
          <p className="mt-4 text-xs text-ink-subtle">Sample contact details for demo purposes only.</p>
        </Card>
      </div>
    </div>
  )
}

function Row({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-accent">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <dt className="text-ink-muted">{label}</dt>
        <dd className="font-medium text-ink">{value}</dd>
      </div>
    </div>
  )
}
