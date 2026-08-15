import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  useAdminTipos,
  crearTipo,
  actualizarTipo,
  eliminarTipo,
} from '../../hooks/useAdmin'
import { errorMessage } from '../../utils/formatters'
import { Spinner } from '../../components/ui/Spinner'
import { Card } from '../../components/ui/Card'
import { DataTable } from '../../components/ui/DataTable'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { Toast } from '../../components/ui/Toast'
import type { Column } from '../../components/ui/DataTable'
import type { TipoRecurso } from '../../types'

interface Formulario {
  id: number | null
  nombre: string
  descripcion: string
  imagen: string
}

const VACIO: Formulario = { id: null, nombre: '', descripcion: '', imagen: '' }

export function AdminTiposPage() {
  const queryClient = useQueryClient()
  const [modalAbierto, setModalAbierto] = useState(false)
  const [form, setForm] = useState<Formulario>(VACIO)
  const [mensaje, setMensaje] = useState<{
    text: string
    type: 'success' | 'error'
  } | null>(null)

  const { data: tipos, isLoading, isError } = useAdminTipos()

  const refrescar = () => {
    void queryClient.invalidateQueries({ queryKey: ['admin', 'tipos'] })
    void queryClient.invalidateQueries({ queryKey: ['tipos'] })
  }

  const abrirCrear = () => {
    setForm(VACIO)
    setMensaje(null)
    setModalAbierto(true)
  }

  const abrirEditar = (tipo: TipoRecurso) => {
    setForm({
      id: tipo.id,
      nombre: tipo.nombre,
      descripcion: tipo.descripcion,
      imagen: tipo.imagen,
    })
    setMensaje(null)
    setModalAbierto(true)
  }

  const guardar = async () => {
    if (!form.nombre.trim()) {
      setMensaje({ text: 'El nombre es requerido.', type: 'error' })
      return
    }
    try {
      const payload = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        imagen: form.imagen,
      }
      if (form.id === null) {
        await crearTipo(payload)
        setMensaje({ text: 'Tipo creado.', type: 'success' })
      } else {
        await actualizarTipo(form.id, payload)
        setMensaje({ text: 'Tipo actualizado.', type: 'success' })
      }
      refrescar()
      setModalAbierto(false)
    } catch (err) {
      setMensaje({ text: errorMessage(err), type: 'error' })
    }
  }

  const borrar = async (id: number) => {
    if (!window.confirm('¿Eliminar este tipo de recurso?')) return
    try {
      await eliminarTipo(id)
      refrescar()
    } catch (err) {
      alert(errorMessage(err))
    }
  }

  const columnas: Column<TipoRecurso>[] = [
    { key: 'id', header: 'ID', render: (t) => t.id },
    { key: 'nombre', header: 'Nombre', render: (t) => t.nombre },
    { key: 'descripcion', header: 'Descripción', render: (t) => t.descripcion },
    {
      key: 'acciones',
      header: '',
      render: (t) => (
        <div className="acciones">
          <Button variant="secondary" onClick={() => abrirEditar(t)}>
            Editar
          </Button>
          <Button variant="danger" onClick={() => borrar(t.id)}>
            Eliminar
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="page">
      <div className="page-header">
        <h1>Tipos de recurso</h1>
        <Button onClick={abrirCrear}>Nuevo tipo</Button>
      </div>

      <Card>
        {isLoading ? (
          <Spinner />
        ) : isError ? (
          <p className="empty-message">Error al cargar tipos.</p>
        ) : (
          <DataTable
            columns={columnas}
            data={tipos ?? []}
            keyField={(t) => t.id}
            emptyMessage="No hay tipos."
          />
        )}
      </Card>

      <Modal open={modalAbierto} onClose={() => setModalAbierto(false)}>
        <h3>{form.id === null ? 'Nuevo tipo' : `Editar: ${form.nombre}`}</h3>
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
            <input
              type="text"
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            />
          </label>
          <label className="field">
            URL de imagen
            <input
              type="text"
              value={form.imagen}
              onChange={(e) => setForm({ ...form, imagen: e.target.value })}
            />
          </label>
          <Button onClick={guardar}>Guardar</Button>
          <Toast message={mensaje?.text ?? null} type={mensaje?.type} />
        </div>
      </Modal>
    </div>
  )
}
