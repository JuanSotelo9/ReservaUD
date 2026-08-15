import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import api from '../api/client'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/ui/Button'
import { Toast } from '../components/ui/Toast'
import type { AuthResponse } from '../types'

const loginSchema = z.object({
  usuario: z.string().min(1, 'El usuario es requerido'),
  password: z.string().min(1, 'La contraseña es requerida'),
})

type LoginForm = z.infer<typeof loginSchema>

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true)
    setError(null)
    try {
      const { data } = await api.post<AuthResponse>('/auth/login-user', values)
      if (data.id !== null) {
        login(data.response, data.id)
        navigate('/recursos')
      }
    } catch {
      setError('Usuario o contraseña incorrectos')
    } finally {
      setSubmitting(false)
    }
  })

  return (
    <div className="auth-page">
      <form className="card form" onSubmit={onSubmit}>
        <h2>Iniciar sesión</h2>
        <label className="field">
          Usuario
          <input type="text" {...register('usuario')} />
        </label>
        {errors.usuario && (
          <span className="field-error">{errors.usuario.message}</span>
        )}
        <label className="field">
          Contraseña
          <input type="password" {...register('password')} />
        </label>
        {errors.password && (
          <span className="field-error">{errors.password.message}</span>
        )}
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Ingresando…' : 'Ingresar'}
        </Button>
        <Toast message={error} type="error" />
      </form>
    </div>
  )
}
