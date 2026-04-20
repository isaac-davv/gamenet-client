import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import Loader from '../ui/Loader'

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return (
    <div className="loader-fullscreen">
      <Loader />
    </div>
  )

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />
}

export default ProtectedRoute