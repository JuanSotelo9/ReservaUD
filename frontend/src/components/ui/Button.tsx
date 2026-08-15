import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
}

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  return <button className={`btn btn-${variant} ${className}`} {...props} />
}
