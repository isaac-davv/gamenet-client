import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import useAuth from '../../hooks/useAuth'
import '../../styles/components/Navbar.css'

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [menuAbierto, setMenuAbierto] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Sesión cerrada correctamente')
    navigate('/login')
    setMenuAbierto(false)
  }

  const cerrarMenu = () => setMenuAbierto(false)

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">

          {/* Logo */}
          <Link to="/" className="navbar-logo" onClick={cerrarMenu}>
            🎮 <span>GameNet</span>
          </Link>

          {/* Links centrales — solo desktop */}
          <div className="navbar-links">
            <Link to="/" className="navbar-link">Feed</Link>
            <Link to="/games" className="navbar-link">Juegos</Link>
          </div>

          {/* Acciones — desktop */}
          <div className="navbar-actions">
            {isAuthenticated ? (
              <>
                <Link to={`/profile/${user.username}`} className="navbar-user">
                  <div className="navbar-avatar">
                    {user.avatarUrl
                      ? <img src={user.avatarUrl} alt={user.username} />
                      : <span>{user.username[0].toUpperCase()}</span>
                    }
                  </div>
                  <span>{user.username}</span>
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="navbar-link admin-link">Admin</Link>
                )}
                <button onClick={handleLogout} className="btn-logout">
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="navbar-link">Entrar</Link>
                <Link to="/register" className="btn-primary-sm">Registrarse</Link>
              </>
            )}

            {/* Botón hamburguesa — solo móvil */}
            <button
              className="navbar-hamburger"
              onClick={() => setMenuAbierto(!menuAbierto)}
              aria-label="Abrir menú"
            >
              <span className={`hamburger-line ${menuAbierto ? 'open' : ''}`} />
              <span className={`hamburger-line ${menuAbierto ? 'open' : ''}`} />
              <span className={`hamburger-line ${menuAbierto ? 'open' : ''}`} />
            </button>
          </div>

        </div>
      </nav>

      {/* Overlay oscuro */}
      <AnimatePresence>
        {menuAbierto && (
          <motion.div
            className="navbar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={cerrarMenu}
          />
        )}
      </AnimatePresence>

      {/* Menú lateral */}
      <AnimatePresence>
        {menuAbierto && (
          <motion.div
            className="navbar-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="drawer-header">
              <span className="drawer-logo">🎮 GameNet</span>
              <button className="drawer-close" onClick={cerrarMenu}>✕</button>
            </div>

            {isAuthenticated && (
              <Link
                to={`/profile/${user.username}`}
                className="drawer-user"
                onClick={cerrarMenu}
              >
                <div className="navbar-avatar">
                  {user.avatarUrl
                    ? <img src={user.avatarUrl} alt={user.username} />
                    : <span>{user.username[0].toUpperCase()}</span>
                  }
                </div>
                <span>@{user.username}</span>
              </Link>
            )}

            <div className="drawer-links">
              <Link to="/" className="drawer-link" onClick={cerrarMenu}>
                🏠 Feed
              </Link>
              <Link to="/games" className="drawer-link" onClick={cerrarMenu}>
                🎮 Juegos
              </Link>
              {isAuthenticated && user.role === 'admin' && (
                <Link to="/admin" className="drawer-link admin" onClick={cerrarMenu}>
                  ⚙️ Admin
                </Link>
              )}
            </div>

            <div className="drawer-footer">
              {isAuthenticated ? (
                <button onClick={handleLogout} className="drawer-logout">
                  Cerrar sesión
                </button>
              ) : (
                <>
                  <Link to="/login" className="btn-primary" onClick={cerrarMenu}>
                    Iniciar sesión
                  </Link>
                  <Link to="/register" className="btn-secondary" onClick={cerrarMenu}>
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar