import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import useAuth from '../hooks/useAuth'
import { registerService } from '../services/api'
import '../styles/components/Auth.css'


const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data } = await registerService(formData)
      login(data)
      toast.success(`¡Bienvenido a GameNet, ${data.user.username}!`)
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al registrarse')
    } finally {
      setIsLoading(false)
    }
  }

 return (
    <div className="auth-container">
      {/* ✅ CAMBIO: div → motion.div con slide in desde abajo */}
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="auth-header">
          <h1>🎮 GameNet</h1>
          <p>Crea tu cuenta de gamer</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Nombre de usuario</label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="IssacGamer"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p className="auth-footer">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login">Inicia sesión</Link>
        </p>
      </motion.div>
    </div>
  )
}

export default Register