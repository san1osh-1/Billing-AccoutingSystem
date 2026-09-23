import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * PublicRoute — wraps /login and /signup.
 * If the user is ALREADY logged in, redirect them straight to
 * /dashboard so they never see the auth pages again.
 */
export default function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
