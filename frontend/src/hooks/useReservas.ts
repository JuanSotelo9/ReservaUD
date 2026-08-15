import { useQuery } from '@tanstack/react-query'
import api from '../api/client'
import type { Usuario } from '../types'

export interface ReservaRequest {
  horaInicio: string
  horaFinal: string
  dia: string
  idRecurso: number
}

export function useUsuario(id: number | null) {
  return useQuery({
    queryKey: ['usuario', id],
    queryFn: async () => {
      const { data } = await api.get<Usuario>(`/usuarios/${id}`)
      return data
    },
    enabled: id !== null,
  })
}

export async function consultarDisponibilidad(
  dia: string,
  horaInicio: string,
  horaFinal: string,
  idRecurso: number,
): Promise<boolean> {
  const { data } = await api.post<boolean>('/recursos/disponibilidad', {
    diaDisponibilidad: dia,
    horaInicio,
    horaFinal,
    idRecurso,
  })
  return data
}

export async function crearReserva(payload: ReservaRequest): Promise<boolean> {
  const { data } = await api.post<boolean>('/reservas', payload)
  return data
}

export async function cancelarReserva(id: string): Promise<string> {
  const { data } = await api.patch<string>(`/reservas/${id}/cancelar`)
  return data
}

export async function calificarReserva(
  id: string,
  calificacion: number,
): Promise<string> {
  const { data } = await api.patch<string>(`/reservas/${id}/calificar`, {
    calificacion,
  })
  return data
}
