import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import api from '../api/client'
import { Button } from '../components/ui/Button'
import { Toast } from '../components/ui/Toast'
import type { AuthResponse } from '../types'

const registerSchema = z.object({
  cedula: z.string().min(5, 'Cédula inválida'),
  nombre: z.string().min(2, 'Nombre requerido'),
  apellido: z.string().min(2, 'Apellido requerido'),
  usuario: z.string().min(4, 'Mínimo 4 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

type RegisterForm = z.infer<typeof registerSchema>

export function RegisterPage() {
  const navigate = useNavigate()
  const [message, setMessage] = useState<{
    text: string
    type: 'success' | 'error'
  } | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) })

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true)
    setMessage(null)
    try {
      const { data } = await api.post<AuthResponse>('/auth/register', {
        id: values.cedula,
        nombre: values.nombre,
        apellido: values.apellido,
        usuario: values.usuario,
        email: values.email,
        password: values.password,
      })
      if (data.response === 'Success') {
        setMessage({ text: 'Registro exitoso. Ahora puedes iniciar sesión.', type: 'success' })
        setTimeout(() => navigate('/login'), 1500)
      }
    } catch (err) {
      const axiosErr = err as {
        response?: { data?: { message?: string } }
      }
      const msg = axiosErr.response?.data?.message
      const texto =
        msg === 'id ya registrado'
          ? 'Cédula ya registrada.'
          : msg === 'usuario ya registrado'
            ? 'Usuario ya registrado.'
            : msg === 'correo ya registrado'
              ? 'Correo ya registrado.'
              : 'Registro fallido.'
      setMessage({ text: texto, type: 'error' })
    } finally {
      setSubmitting(false)
    }
  })

  return (
    <div className="auth-page">
      <form className="card form" onSubmit={onSubmit}>
        <h2>Registrarse</h2>
        <label className="field">
          Cédula
          <input type="text" {...register('cedula')} />
        </label>
        {errors.cedula && (
          <span className="field-error">{errors.cedula.message}</span>
        )}
        <label className="field">
          Nombre
          <input type="text" {...register('nombre')} />
        </label>
        {errors.nombre && (
          <span className="field-error">{errors.nombre.message}</span>
        )}
        <label className="field">
          Apellido
          <input type="text" {...register('apellido')} />
        </label>
        {errors.apellido && (
          <span className="field-error">{errors.apellido.message}</span>
        )}
        <label className="field">
          Usuario
          <input type="text" {...register('usuario')} />
        </label>
        {errors.usuario && (
          <span className="field-error">{errors.usuario.message}</span>
        )}
        <label className="field">
          Email
          <input type="email" {...register('email')} />
        </label>
        {errors.email && (
          <span className="field-error">{errors.email.message}</span>
        )}
        <label className="field">
          Contraseña
          <input type="password" {...register('password')} />
        </label>
        {errors.password && (
          <span className="field-error">{errors.password.message}</span>
        )}
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Registrando…' : 'Registrarse'}
        </Button>
        <Toast message={message?.text ?? null} type={message?.type} />
      </form>
    </div>
  )
}
