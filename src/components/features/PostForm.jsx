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
  const [imagen, setImagen] = useState(null)
  const [previsualizacion, setPrevisualizacion] = useState(null)

  useEffect(() => {
    const fetchJuegos = async () => {
      try {
        const { data } = await getJuegosService({ limit: 105 })
        setJuegos(data.juegos)
      } catch {
        console.error('Error al cargar juegos')
      }
    }
    fetchJuegos()
  }, [])

  const handleImagenChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('El archivo debe ser una imagen')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La imagen no puede superar los 5MB')
      return
    }

    setImagen(file)
    setPrevisualizacion(URL.createObjectURL(file))
  }

  const handleQuitarImagen = () => {
    setImagen(null)
    setPrevisualizacion(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return
    if (!gameId) {
      toast.error('Selecciona un juego')
      return
    }

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('content', content)
      formData.append('game', gameId)
      if (imagen) {
        formData.append('image', imagen)
      }

      await crearPostService(formData)
      setContent('')
      setGameId(juegoPreseleccionado)
      setImagen(null)
      setPrevisualizacion(null)
      toast.success('Post publicado')
      onPostCreado()
    } catch {
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

        {previsualizacion && (
          <div className="post-form-preview">
            <img src={previsualizacion} alt="Preview" />
            <button
              type="button"
              className="post-form-preview-remove"
              onClick={handleQuitarImagen}
            >
              ✕
            </button>
          </div>
        )}

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
            <span className="post-form-counter">{content.length}/500</span>

            <label className="btn-imagen" title="Añadir imagen">
              📷
              <input
                type="file"
                accept="image/*"
                onChange={handleImagenChange}
                style={{ display: 'none' }}
              />
            </label>

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