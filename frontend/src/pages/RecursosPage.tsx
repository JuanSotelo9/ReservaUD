import { useMemo, useState } from 'react'
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
  const [tipoFiltro, setTipoFiltro] = useState(0)

  const { data, isLoading, isError } = useRecursos(page, PAGE_SIZE)
  const { data: tipos } = useTipos()

  const recursos = useMemo(() => {
    if (!data) return []
    const texto = busqueda.trim().toLowerCase()
    return data.content.filter((r) => {
      const coincideBusqueda =
        !texto || r.nombre.toLowerCase().includes(texto)
      const coincideTipo = tipoFiltro === 0 || r.idTipoRecurso === tipoFiltro
      return coincideBusqueda && coincideTipo
    })
  }, [data, busqueda, tipoFiltro])

  const columns: Column<Recurso>[] = [
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
          onChange={(e) => {
            setBusqueda(e.target.value)
            setPage(0)
          }}
        />
        <select
          value={tipoFiltro}
          onChange={(e) => {
            setTipoFiltro(Number(e.target.value))
            setPage(0)
          }}
        >
          <option value={0}>Todos los tipos</option>
          {(tipos ?? []).map((t) => (
            <option key={t.id} value={t.id}>
              {t.nombre}
            </option>
          ))}
        </select>
      </div>

      <Card>
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <p className="empty-message">Error al cargar los recursos.</p>
        ) : (
          <DataTable
            columns={columns}
            data={recursos}
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
