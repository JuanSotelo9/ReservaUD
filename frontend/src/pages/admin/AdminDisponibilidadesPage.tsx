import { useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  useAdminDisponibilidades,
  useAdminRecursos,
  crearDisponibilidad,
  eliminarDisponibilidad,
} from '../../hooks/useAdmin'
import { errorMessage, formatFecha, formatHora, generarHoras } from '../../utils/formatters'
import { Spinner } from '../../components/ui/Spinner'
import { Card } from '../../components/ui/Card'
import { DataTable } from '../../components/ui/DataTable'
import { Button } from '../../components/ui/Button'
import { Toast } from '../../components/ui/Toast'
import type { Column } from '../../components/ui/DataTable'
import type { DisponibilidadResponse } from '../../types'

export function AdminDisponibilidadesPage() {
  const queryClient = useQueryClient()
  const { data: disponibilidades, isLoading, isError } = useAdminDisponibilidades()
  const { data: recursosPage } = useAdminRecursos(0, 100)
  const recursos = recursosPage?.content ?? []

  /* Formulario de creación */
  const [idRecurso, setIdRecurso] = useState(0)
  const [dia, setDia] = useState('')
  const [horaInicio, setHoraInicio] = useState('')
  const [horaFinal, setHoraFinal] = useState('')
  const [mensaje, setMensaje] = useState<{
    text: string
    type: 'success' | 'error'
  } | null>(null)
  const [creando, setCreando] = useState(false)

  /* Filtros de consulta */
  const [filtroRecurso, setFiltroRecurso] = useState(0)
  const [filtroDia, setFiltroDia] = useState('')

  const horasInicio = generarHoras(6, 19)
  const horasFinal = horaInicio
    ? generarHoras(Number(horaInicio.slice(0, 2)) + 1, 20)
    : []

  const recursoSeleccionado = recursos.find((r) => r.id === filtroRecurso)

  const filtradas = useMemo(() => {
    return (disponibilidades ?? []).filter((d) => {
      const coincideRecurso =
        !recursoSeleccionado || d.recursos.includes(recursoSeleccionado.nombre)
      const coincideDia = !filtroDia || d.dia === filtroDia
      return coincideRecurso && coincideDia
    })
  }, [disponibilidades, recursoSeleccionado, filtroDia])

  /* Agrupación por día (vista "por recurso") */
  const porDia = useMemo(() => {
    const mapa = new Map<string, string[]>()
    const ordenados = [...filtradas].sort((a, b) =>
      a.horaInicio.localeCompare(b.horaInicio),
    )
    for (const d of ordenados) {
      const horas = mapa.get(d.dia) ?? []
      horas.push(`${formatHora(d.horaInicio)}–${formatHora(d.horaFinal)}`)
      mapa.set(d.dia, horas)
    }
    return [...mapa.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  }, [filtradas])

  const refrescar = () => {
    void queryClient.invalidateQueries({ queryKey: ['admin', 'disponibilidades'] })
    void queryClient.invalidateQueries({ queryKey: ['recursos'] })
  }

  const crear = async () => {
    if (!idRecurso || !dia || !horaInicio || !horaFinal) {
      setMensaje({ text: 'Completa recurso, fecha y horario.', type: 'error' })
      return
    }
    setCreando(true)
    setMensaje(null)
    try {
      await crearDisponibilidad({
        diaDisponibilidad: dia,
        horaInicio,
        horaFinal,
        idRecurso,
      })
      setMensaje({ text: 'Disponibilidad creada.', type: 'success' })
      refrescar()
      setDia('')
      setHoraInicio('')
      setHoraFinal('')
    } catch (err) {
      setMensaje({ text: errorMessage(err), type: 'error' })
    } finally {
      setCreando(false)
    }
  }

  const borrar = async (id: number) => {
    if (!window.confirm('¿Eliminar esta disponibilidad?')) return
    try {
      await eliminarDisponibilidad(id)
      refrescar()
    } catch (err) {
      alert(errorMessage(err))
    }
  }

  const columnas: Column<DisponibilidadResponse>[] = [
    { key: 'id', header: 'ID', render: (d) => d.id },
    { key: 'dia', header: 'Día', render: (d) => formatFecha(d.dia) },
    { key: 'inicio', header: 'Inicio', render: (d) => formatHora(d.horaInicio) },
    { key: 'fin', header: 'Fin', render: (d) => formatHora(d.horaFinal) },
    {
      key: 'recursos',
      header: 'Recursos',
      render: (d) => (d.recursos.length ? d.recursos.join(', ') : '—'),
    },
    {
      key: 'acciones',
      header: '',
      render: (d) => (
        <Button variant="danger" onClick={() => borrar(d.id)}>
          Eliminar
        </Button>
      ),
    },
  ]

  return (
    <div className="page">
      <h1>Disponibilidades</h1>

      <Card className="form admin-crear-disp">
        <h3>Nueva disponibilidad</h3>
        <label className="field">
          Recurso
          <select value={idRecurso} onChange={(e) => setIdRecurso(Number(e.target.value))}>
            <option value={0}>Seleccionar…</option>
            {recursos.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nombre}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          Fecha
          <input type="date" value={dia} onChange={(e) => setDia(e.target.value)} />
        </label>
        <label className="field">
          Hora de inicio
          <select value={horaInicio} onChange={(e) => { setHoraInicio(e.target.value); setHoraFinal('') }}>
            <option value="">Seleccionar…</option>
            {horasInicio.map((h) => (
              <option key={h} value={h}>{h.slice(0, 5)}</option>
            ))}
          </select>
        </label>
        <label className="field">
          Hora de finalización
          <select value={horaFinal} onChange={(e) => setHoraFinal(e.target.value)} disabled={!horaInicio}>
            <option value="">Seleccionar…</option>
            {horasFinal.map((h) => (
              <option key={h} value={h}>{h.slice(0, 5)}</option>
            ))}
          </select>
        </label>
        <Button onClick={crear} disabled={creando}>
          {creando ? 'Creando…' : 'Crear'}
        </Button>
        <Toast message={mensaje?.text ?? null} type={mensaje?.type} />
      </Card>

      <Card>
        <h3>Consultar disponibilidades</h3>
        <div className="toolbar">
          <select
            value={filtroRecurso}
            onChange={(e) => setFiltroRecurso(Number(e.target.value))}
          >
            <option value={0}>Todos los recursos</option>
            {recursos.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nombre}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={filtroDia}
            onChange={(e) => setFiltroDia(e.target.value)}
          />
          {(filtroRecurso !== 0 || filtroDia) && (
            <Button
              variant="secondary"
              onClick={() => {
                setFiltroRecurso(0)
                setFiltroDia('')
              }}
            >
              Limpiar
            </Button>
          )}
        </div>

        {recursoSeleccionado && (
          <div className="resumen-disp">
            <h4>
              {recursoSeleccionado.nombre} — horarios por día
            </h4>
            {porDia.length === 0 ? (
              <p className="empty-message">
                Este recurso no tiene disponibilidades para el filtro seleccionado.
              </p>
            ) : (
              porDia.map(([diaFila, horas]) => (
                <p key={diaFila} className="fila-dia">
                  <strong>{formatFecha(diaFila)}:</strong>{' '}
                  {horas.join(' · ')}
                </p>
              ))
            )}
          </div>
        )}

        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <p className="empty-message">Error al cargar disponibilidades.</p>
        ) : (
          <DataTable
            columns={columnas}
            data={filtradas}
            keyField={(d) => d.id}
            emptyMessage="No hay disponibilidades para el filtro."
          />
        )}
      </Card>
    </div>
  )
}
