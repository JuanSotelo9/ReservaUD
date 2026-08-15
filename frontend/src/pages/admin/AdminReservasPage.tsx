import { useState } from 'react'
import { useAdminReservas } from '../../hooks/useAdmin'
import { formatCalificacion, formatFecha, formatHora, estadoClass, estadoLabel } from '../../utils/formatters'
import { Spinner } from '../../components/ui/Spinner'
import { Card } from '../../components/ui/Card'
import { DataTable } from '../../components/ui/DataTable'
import { Button } from '../../components/ui/Button'
import type { Column } from '../../components/ui/DataTable'
import type { Reserva } from '../../types'

export function AdminReservasPage() {
  const [page, setPage] = useState(0)
  const { data, isLoading, isError } = useAdminReservas(page, 10)

  const columnas: Column<Reserva>[] = [
    { key: 'id', header: 'ID', render: (r) => r.id },
    { key: 'fecha', header: 'Fecha', render: (r) => formatFecha(r.fecha) },
    { key: 'inicio', header: 'Inicio', render: (r) => formatHora(r.horaInicio) },
    { key: 'fin', header: 'Fin', render: (r) => formatHora(r.horaFinal) },
    { key: 'usuario', header: 'Usuario', render: (r) => r.idUsuario },
    { key: 'recurso', header: 'Recurso', render: (r) => r.idRecurso },
    {
      key: 'estado',
      header: 'Estado',
      render: (r) => (
        <span className={`badge ${estadoClass(r.estado)}`}>
          {estadoLabel(r.estado)}
        </span>
      ),
    },
    {
      key: 'calificacion',
      header: 'Calificación',
      render: (r) => formatCalificacion(r.calificacion),
    },
  ]

  return (
    <div className="page">
      <h1>Reservas del sistema</h1>
      <Card>
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <p className="empty-message">Error al cargar reservas.</p>
        ) : (
          <DataTable
            columns={columnas}
            data={data?.content ?? []}
            keyField={(r) => r.id}
            emptyMessage="No hay reservas."
          />
        )}
      </Card>

      {data && data.totalPages > 1 && (
        <div className="pagination">
          <Button
            variant="secondary"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          >
            Anterior
          </Button>
          <span>
            Página {data.number + 1} de {data.totalPages}
          </span>
          <Button
            variant="secondary"
            disabled={page >= data.totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  )
}
