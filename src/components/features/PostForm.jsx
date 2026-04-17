import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import useAuth from '../../hooks/useAuth'
import { crearPostService, getJuegosService } from '../../services/api'
import '../../styles/components/PostForm.css'

const PostForm = ({ onPostCreado, juegoPreseleccionado = '' }) => {
  const { user } = useAuth()
  const [content, setContent] = useState('')
  const [gameId, setGameId] = useState(juegoPreseleccionado)
  const [juegos, setJuegos] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchJuegos = async () => {
      try {
        const { data } = await getJuegosService({ limit: 105 })
        setJuegos(data.juegos)
      } catch (error) {
        console.error('Error al cargar juegos:', error)
      }
    }
    fetchJuegos()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    if (!gameId) {
      toast.error('Selecciona un juego')
      return
    }

    setIsLoading(true)
    try {
      await crearPostService({ content, game: gameId })
      setContent('')
      setGameId('')
      toast.success('Post publicado')
      onPostCreado()
    } catch  {
      toast.error('Error al publicar el post')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="post-form">
      <div className="post-form-header">
        <div className="post-avatar">
          {user?.avatarUrl
            ? <img src={user.avatarUrl} alt={user.username} />
            : <span>{user?.username[0].toUpperCase()}</span>
          }
        </div>
        <span className="post-form-username">{user?.username}</span>
      </div>

      <form onSubmit={handleSubmit} className="post-form-body">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="¿Qué estás jugando? Comparte tu experiencia..."
          className="post-form-textarea"
          maxLength={500}
          rows={3}
        />

        <div className="post-form-footer">
          <select
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            className="post-form-select"
          >
            <option value="">Selecciona un juego...</option>
            {juegos.map((juego) => (
              <option key={juego._id} value={juego._id}>
                {juego.title}
              </option>
            ))}
          </select>

          <div className="post-form-actions">
            <span className="post-form-counter">
              {content.length}/500
            </span>
            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading || !content.trim()}
            >
              {isLoading ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default PostForm