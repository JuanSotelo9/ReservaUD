import { useQuery } from '@tanstack/react-query'
import api from '../api/client'
import type {
  DashboardResponse,
  DisponibilidadResponse,
  Page,
  Recurso,
  RecursoRequest,
  Reserva,
  TipoRecurso,
  TipoRecursoRequest,
} from '../types'

export function useDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      const { data } = await api.get<DashboardResponse>('/admin/dashboard')
      return data
    },
  })
}

export function useAdminRecursos(page: number, size: number) {
  return useQuery({
    queryKey: ['admin', 'recursos', page, size],
    queryFn: async () => {
      const { data } = await api.get<Page<Recurso>>('/admin/recursos', {
        params: { page, size },
      })
      return data
    },
  })
}

export function useAdminTipos() {
  return useQuery({
    queryKey: ['admin', 'tipos'],
    queryFn: async () => {
      const { data } = await api.get<Page<TipoRecurso>>('/admin/tipos', {
        params: { size: 100 },
      })
      return data.content
    },
  })
}

export function useAdminDisponibilidades() {
  return useQuery({
    queryKey: ['admin', 'disponibilidades'],
    queryFn: async () => {
      const { data } = await api.get<DisponibilidadResponse[]>(
        '/admin/disponibilidades',
      )
      return data
    },
  })
}

export function useAdminReservas(page: number, size: number) {
  return useQuery({
    queryKey: ['admin', 'reservas', page, size],
    queryFn: async () => {
      const { data } = await api.get<Page<Reserva>>('/admin/reservas', {
        params: { page, size },
      })
      return data
    },
  })
}

/* ---------- Mutaciones (async, con invalidación manual) ---------- */

export async function crearRecurso(payload: RecursoRequest): Promise<Recurso> {
  const { data } = await api.post<Recurso>('/admin/recursos', payload)
  return data
}

export async function actualizarRecurso(
  id: number,
  payload: RecursoRequest,
): Promise<Recurso> {
  const { data } = await api.put<Recurso>(`/admin/recursos/${id}`, payload)
  return data
}

export async function eliminarRecurso(id: number): Promise<void> {
  await api.delete(`/admin/recursos/${id}`)
}

export async function crearTipo(payload: TipoRecursoRequest): Promise<TipoRecurso> {
  const { data } = await api.post<TipoRecurso>('/admin/tipos', payload)
  return data
}

export async function actualizarTipo(
  id: number,
  payload: TipoRecursoRequest,
): Promise<TipoRecurso> {
  const { data } = await api.put<TipoRecurso>(`/admin/tipos/${id}`, payload)
  return data
}

export async function eliminarTipo(id: number): Promise<void> {
  await api.delete(`/admin/tipos/${id}`)
}

export interface CrearDisponibilidadPayload {
  diaDisponibilidad: string
  horaInicio: string
  horaFinal: string
  idRecurso: number
}

export async function crearDisponibilidad(
  payload: CrearDisponibilidadPayload,
): Promise<DisponibilidadResponse> {
  const { data } = await api.post<DisponibilidadResponse>(
    '/admin/disponibilidades',
    payload,
  )
  return data
}

export async function eliminarDisponibilidad(id: number): Promise<void> {
  await api.delete(`/admin/disponibilidades/${id}`)
}
