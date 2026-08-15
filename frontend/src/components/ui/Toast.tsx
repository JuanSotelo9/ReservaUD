interface ToastProps {
  message: string | null
  type?: 'success' | 'error' | 'info'
}

export function Toast({ message, type = 'info' }: ToastProps) {
  if (!message) return null
  return <div className={`toast toast-${type}`}>{message}</div>
}
