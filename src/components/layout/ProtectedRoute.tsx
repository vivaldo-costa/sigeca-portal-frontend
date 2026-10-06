import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { status } = useAuthStore()
  const location = useLocation()

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="grid min-h-screen place-items-center bg-mist-50 text-mist-400">
        A verificar sessão…
      </div>
    )
  }

  if (status === 'guest' || status === 'aguarda2fa') {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />
  }

  return <>{children}</>
}
