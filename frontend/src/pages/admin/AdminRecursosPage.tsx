import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  useAdminRecursos,
  useAdminTipos,
  crearRecurso,
  actualizarRecurso,
  eliminarRecurso,
} from '../../hooks/useAdmin'
import { errorMessage } from '../../utils/formatters'
import { Spinner } from '../../components/ui/Spinner'
import { Card } from '../../components/ui/Card'
import { DataTable } from '../../components/ui/DataTable'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Toast } from '../../components/ui/Toast'
import type { Column } from '../../components/ui/DataTable'
import type { Recurso } from '../../types'

interface Formulario {
  id: number | null
  nombre: string
  descripcion: string
  idTipoRecurso: number
}

const VACIO: Formulario = { id: null, nombre: '', descripcion: '', idTipoRecurso: 0 }

export function AdminRecursosPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [form, setForm] = useState<Formulario>(VACIO)
  const [mensaje, setMensaje] = useState<{
    text: string
    type: 'success' | 'error'
  } | null>(null)

  const { data, isLoading, isError } = useAdminRecursos(page, 5)
  const { data: tipos } = useAdminTipos()

  const refrescar = () => {
    void queryClient.invalidateQueries({ queryKey: ['admin', 'recursos'] })
  }

  const abrirCrear = () => {
    setForm(VACIO)
    setMensaje(null)
    setModalAbierto(true)
  }

  const abrirEditar = (recurso: Recurso) => {
    setForm({
      id: recurso.id,
      nombre: recurso.nombre,
      descripcion: recurso.descripcion,
      idTipoRecurso: recurso.idTipoRecurso,
    })
    setMensaje(null)
    setModalAbierto(true)
  }

  const guardar = async () => {
    if (!form.nombre.trim() || !form.idTipoRecurso) {
      setMensaje({ text: 'Completa el nombre y selecciona un tipo.', type: 'error' })
      return
    }
    try {
      const payload = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        idTipoRecurso: form.idTipoRecurso,
      }
      if (form.id === null) {
        await crearRecurso(payload)
        setMensaje({ text: 'Recurso creado.', type: 'success' })
      } else {
        await actualizarRecurso(form.id, payload)
        setMensaje({ text: 'Recurso actualizado.', type: 'success' })
      }
      refrescar()
      setModalAbierto(false)
    } catch (err) {
      setMensaje({ text: errorMessage(err), type: 'error' })
    }
  }

  const borrar = async (id: number) => {
    if (!window.confirm('¿Eliminar este recurso?')) return
    try {
      await eliminarRecurso(id)
      refrescar()
    } catch (err) {
      alert(errorMessage(err))
    }
  }

  const columnas: Column<Recurso>[] = [
    { key: 'id', header: 'ID', render: (r) => r.id },
    { key: 'nombre', header: 'Nombre', render: (r) => r.nombre },
    { key: 'tipo', header: 'Tipo', render: (r) => r.nombreTipoRecurso },
    {
      key: 'acciones',
      header: '',
      render: (r) => (
        <div className="acciones">
          <Button variant="secondary" onClick={() => abrirEditar(r)}>
            Editar
          </Button>
          <Button variant="danger" onClick={() => borrar(r.id)}>
            Eliminar
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="page">
      <div className="page-header">
        <h1>Recursos</h1>
        <Button onClick={abrirCrear}>Nuevo recurso</Button>
      </div>

      <Card>
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <p className="empty-message">Error al cargar recursos.</p>
        ) : (
          <DataTable
            columns={columnas}
            data={data?.content ?? []}
            keyField={(r) => r.id}
            emptyMessage="No hay recursos."
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

      <Modal open={modalAbierto} onClose={() => setModalAbierto(false)}>
        <h3>{form.id === null ? 'Nuevo recurso' : `Editar: ${form.nombre}`}</h3>
        <div className="form">
          <label className="field">
            Nombre
            <input
              type="text"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
          </label>
          <label className="field">
            Descripción
            <textarea
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            />
          </label>
          <label className="field">
            Tipo de recurso
            <select
              value={form.idTipoRecurso}
              onChange={(e) =>
                setForm({ ...form, idTipoRecurso: Number(e.target.value) })
              }
            >
              <option value={0}>Seleccionar…</option>
              {(tipos ?? []).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
            </select>
          </label>
          <Button onClick={guardar}>Guardar</Button>
          <Toast message={mensaje?.text ?? null} type={mensaje?.type} />
        </div>
      </Modal>
    </div>
  )
}
