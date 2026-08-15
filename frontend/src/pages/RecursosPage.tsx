import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useRecursos, useTipos } from '../hooks/useRecursos'
import { PAGE_SIZE } from '../utils/constants'
import { Spinner } from '../components/ui/Spinner'
import { Card } from '../components/ui/Card'
import { DataTable } from '../components/ui/DataTable'
import type { Column } from '../components/ui/DataTable'
import type { Recurso } from '../types'

export function RecursosPage() {
  const [page, setPage] = useState(0)
  const [busqueda, setBusqueda] = useState('')
  const [q, setQ] = useState('')
  const [tipo, setTipo] = useState(0)
  const [disponible, setDisponible] = useState('')
  const [orden, setOrden] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setQ(busqueda), 400)
    return () => clearTimeout(timer)
  }, [busqueda])

  useEffect(() => {
    setPage(0)
  }, [q, tipo, disponible, orden])

  const { data, isLoading, isError } = useRecursos({
    page,
    size: PAGE_SIZE,
    q: q || undefined,
    tipo: tipo || undefined,
    disponible: disponible || undefined,
    sort: orden || undefined,
  })
  const { data: tipos } = useTipos()

  const columnas: Column<Recurso>[] = [
    { key: 'id', header: 'ID', render: (r) => r.id },
    { key: 'nombre', header: 'Nombre', render: (r) => r.nombre },
    { key: 'tipo', header: 'Tipo', render: (r) => r.nombreTipoRecurso },
    {
      key: 'calificacion',
      header: 'Calificación',
      render: (r) => r.calificacionPromedio || '—',
    },
    {
      key: 'caracteristicas',
      header: 'Características',
      render: (r) =>
        r.caracteristicas.length ? r.caracteristicas.join(', ') : '—',
    },
    {
      key: 'acciones',
      header: '',
      render: (r) => (
        <Link to={`/recursos/${r.id}/reservar`} className="btn btn-primary">
          Reservar
        </Link>
      ),
    },
  ]

  return (
    <div className="page">
      <h1>Recursos</h1>
      <div className="toolbar">
        <input
          type="text"
          placeholder="Buscar recurso…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select value={tipo} onChange={(e) => setTipo(Number(e.target.value))}>
          <option value={0}>Todos los tipos</option>
          {(tipos ?? []).map((t) => (
            <option key={t.id} value={t.id}>
              {t.nombre}
            </option>
          ))}
        </select>
        <input
          type="date"
          title="Disponible el día"
          value={disponible}
          onChange={(e) => setDisponible(e.target.value)}
        />
        <select value={orden} onChange={(e) => setOrden(e.target.value)}>
          <option value="">Sin orden</option>
          <option value="calificacionPromedio,desc">Mejor calificación</option>
          <option value="calificacionPromedio,asc">Peor calificación</option>
          <option value="nombre,asc">Nombre A–Z</option>
          <option value="nombre,desc">Nombre Z–A</option>
        </select>
      </div>

      <Card>
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <p className="empty-message">Error al cargar los recursos.</p>
        ) : (
          <DataTable
            columns={columnas}
            data={data?.content ?? []}
            keyField={(r) => r.id}
            emptyMessage="No hay recursos que coincidan."
          />
        )}
      </Card>

      {data && data.totalPages > 1 && (
        <div className="pagination">
          <button
            type="button"
            className="btn btn-secondary"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            Anterior
          </button>
          <span>
            Página {data.number + 1} de {data.totalPages}
          </span>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={page >= data.totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  )
}
