import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useDashboard } from '../../hooks/useAdmin'
import { formatFecha } from '../../utils/formatters'
import { Spinner } from '../../components/ui/Spinner'
import { Card } from '../../components/ui/Card'
import { DataTable } from '../../components/ui/DataTable'
import type { Column } from '../../components/ui/DataTable'
import type { TopRecurso } from '../../types'

const ESTADOS = [
  { key: 'reservasReservado', label: 'Reservado' },
  { key: 'reservasEnProgreso', label: 'En progreso' },
  { key: 'reservasFinalizadas', label: 'Finalizado' },
  { key: 'reservasCanceladas', label: 'Cancelado' },
] as const

const PALETA_PIE = ['#2563eb', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#14b8a6']

function colorCalor(total: number, max: number): string {
  const t = max === 0 ? 0 : total / max
  const r = Math.round(239 + (37 - 239) * t)
  const g = Math.round(246 + (99 - 246) * t)
  const b = Math.round(255 + (235 - 255) * t)
  return `rgb(${r}, ${g}, ${b})`
}

export function AdminDashboardPage() {
  const { data, isLoading, isError } = useDashboard()

  if (isLoading) return <Spinner />
  if (isError || !data) {
    return <p className="empty-message">No se pudo cargar el dashboard.</p>
  }

  const columnas: Column<TopRecurso>[] = [
    { key: 'id', header: 'ID', render: (r) => r.idRecurso },
    { key: 'nombre', header: 'Recurso', render: (r) => r.nombre },
    { key: 'total', header: 'Reservas', render: (r) => r.totalReservas },
  ]

  const dataDia = data.reservasPorDia.map((d) => ({
    nombre: formatFecha(d.dia),
    reservas: d.total,
  }))

  const dataPie = data.recursosMasReservados.map((r) => ({
    name: r.nombre,
    value: r.totalReservas,
  }))

  const dataHora = data.reservasPorHora.map((h) => ({
    hora: `${String(h.hora).padStart(2, '0')}:00`,
    reservas: h.total,
  }))
  const maxHora = Math.max(...dataHora.map((h) => h.reservas), 1)

  return (
    <div className="page">
      <h1>Dashboard</h1>

      <div className="stats-grid">
        <Card className="stat">
          <span className="stat-value">{data.totalRecursos}</span>
          <span className="stat-label">Recursos</span>
        </Card>
        <Card className="stat">
          <span className="stat-value">{data.totalTipos}</span>
          <span className="stat-label">Tipos</span>
        </Card>
        <Card className="stat">
          <span className="stat-value">{data.totalUsuarios}</span>
          <span className="stat-label">Usuarios</span>
        </Card>
        <Card className="stat">
          <span className="stat-value">{data.totalReservas}</span>
          <span className="stat-label">Reservas</span>
        </Card>
      </div>

      <h2>Reservas por estado</h2>
      <div className="stats-grid">
        {ESTADOS.map((e) => (
          <Card key={e.key} className="stat">
            <span className="stat-value">{data[e.key]}</span>
            <span className="stat-label">{e.label}</span>
          </Card>
        ))}
      </div>

      <h2>Reservas por día</h2>
      <Card>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={dataDia} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="reservas" name="Reservas" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <h2>Recursos más reservados</h2>
      <Card>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={dataPie}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {dataPie.map((_, i) => (
                <Cell key={i} fill={PALETA_PIE[i % PALETA_PIE.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <h2>Horas pico (reservas por hora del día)</h2>
      <Card>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={dataHora} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hora" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="reservas" name="Reservas">
              {dataHora.map((h, i) => (
                <Cell key={i} fill={colorCalor(h.reservas, maxHora)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <h2>Top recursos (tabla)</h2>
      <Card>
        <DataTable
          columns={columnas}
          data={data.recursosMasReservados}
          keyField={(r) => r.idRecurso}
          emptyMessage="Aún no hay reservas."
        />
      </Card>
    </div>
  )
}
