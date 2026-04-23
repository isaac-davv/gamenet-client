import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useAuth from '../hooks/useAuth'
import {
  getJuegosService,
  eliminarJuegoService,
  crearJuegoService,
  editarJuegoService,
  getPostsService,
  eliminarPostService
} from '../services/api'
import Loader from '../components/ui/Loader'
import Modal from '../components/ui/Modal'
import '../styles/components/Admin.css'

const Admin = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [tabActiva, setTabActiva] = useState('juegos')
  const [juegos, setJuegos] = useState([])
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadingPosts, setLoadingPosts] = useState(false)
  const [modalJuego, setModalJuego] = useState(false)
  const [juegoEditando, setJuegoEditando] = useState(null)
  const [confirmacion, setConfirmacion] = useState(null)
  const [confirmacionPost, setConfirmacionPost] = useState(null)
  const [formJuego, setFormJuego] = useState({
    title: '', genre: '', platform: '',
    year: '', developer: '', rating: '', description: ''
  })

  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/')
      toast.error('No tienes permisos de administrador')
    }
  }, [user, navigate])

  const fetchJuegos = async () => {
    try {
      setIsLoading(true)
      const { data } = await getJuegosService({ limit: 105 })
      setJuegos(data.juegos)
    } catch {
      toast.error('Error al cargar juegos')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPosts = async () => {
    try {
      setLoadingPosts(true)
      const { data } = await getPostsService({ limit: 100 })
      setPosts(data.posts)
    } catch {
      toast.error('Error al cargar posts')
    } finally {
      setLoadingPosts(false)
    }
  }

  useEffect(() => {
    fetchJuegos()
  }, [])

  useEffect(() => {
    if (tabActiva === 'posts') fetchPosts()
  }, [tabActiva])

  const handleEliminarJuego = async () => {
    try {
      await eliminarJuegoService(confirmacion.id)
      toast.success('Juego eliminado')
      setConfirmacion(null)
      fetchJuegos()
    } catch {
      toast.error('Error al eliminar el juego')
    }
  }

  const handleEliminarPost = async () => {
    try {
      await eliminarPostService(confirmacionPost.id)
      toast.success('Post eliminado')
      setConfirmacionPost(null)
      fetchPosts()
    } catch {
      toast.error('Error al eliminar el post')
    }
  }

  const handleAbrirModalCrear = () => {
    setJuegoEditando(null)
    setFormJuego({
      title: '', genre: '', platform: '',
      year: '', developer: '', rating: '', description: ''
    })
    setModalJuego(true)
  }

  const handleAbrirModalEditar = (juego) => {
    setJuegoEditando(juego)
    setFormJuego({
      title: juego.title,
      genre: juego.genre,
      platform: juego.platform,
      year: juego.year,
      developer: juego.developer,
      rating: juego.rating,
      description: juego.description || ''
    })
    setModalJuego(true)
  }

  const handleGuardarJuego = async () => {
    try {
      const datosFormateados = {
        ...formJuego,
        year: Number(formJuego.year),
        rating: Number(formJuego.rating)
      }
      if (juegoEditando) {
        await editarJuegoService(juegoEditando._id, datosFormateados)
        toast.success('Juego actualizado correctamente')
      } else {
        await crearJuegoService(datosFormateados)
        toast.success('Juego creado correctamente')
      }
      setModalJuego(false)
      fetchJuegos()
    } catch {
      toast.error('Error al guardar el juego')
    }
  }

  const handleFormChange = (e) => {
    setFormJuego({ ...formJuego, [e.target.name]: e.target.value })
  }

  if (isLoading) return <Loader />

  return (
    <div className="admin-container">

      <div className="admin-header">
        <h1 className="admin-title">⚙️ Panel de Administración</h1>
        <p className="admin-subtitle">Bienvenido, @{user?.username}</p>
      </div>

      <div className="admin-tabs">
        <button
          className={`admin-tab ${tabActiva === 'juegos' ? 'active' : ''}`}
          onClick={() => setTabActiva('juegos')}
        >
          🎮 Juegos ({juegos.length})
        </button>
        <button
          className={`admin-tab ${tabActiva === 'posts' ? 'active' : ''}`}
          onClick={() => setTabActiva('posts')}
        >
          📝 Posts ({posts.length})
        </button>
      </div>

      {/* Tab Juegos */}
      {tabActiva === 'juegos' && (
        <div className="admin-section">
          <div className="admin-section-header">
            <h2>Gestión de Juegos</h2>
            <button onClick={handleAbrirModalCrear} className="btn-primary">
              + Añadir juego
            </button>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Género</th>
                  <th>Plataforma</th>
                  <th>Año</th>
                  <th>Rating</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {juegos.map((juego) => (
                  <tr key={juego._id}>
                    <td>
                      <div className="admin-juego-titulo">
                        {juego.coverImage && (
                          <img src={juego.coverImage} alt={juego.title} />
                        )}
                        <Link to={`/games/${juego._id}`}>
                          {juego.title}
                        </Link>
                      </div>
                    </td>
                    <td>{juego.genre}</td>
                    <td>{juego.platform}</td>
                    <td>{juego.year}</td>
                    <td>⭐ {juego.rating}</td>
                    <td>
                      <div className="admin-acciones">
                        <button
                          onClick={() => handleAbrirModalEditar(juego)}
                          className="btn-edit"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => setConfirmacion({ id: juego._id, titulo: juego.title })}
                          className="btn-delete"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Posts */}
      {tabActiva === 'posts' && (
        <div className="admin-section">
          <div className="admin-section-header">
            <h2>Gestión de Posts</h2>
          </div>

          {loadingPosts ? (
            <Loader />
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Autor</th>
                    <th>Contenido</th>
                    <th>Juego</th>
                    <th>Likes</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post._id}>
                      <td>
                        <Link to={`/profile/${post.author?.username}`}>
                          @{post.author?.username}
                        </Link>
                      </td>
                      <td className="admin-post-content">
                        {post.content.slice(0, 80)}
                        {post.content.length > 80 ? '...' : ''}
                      </td>
                      <td>{post.game?.title || '—'}</td>
                      <td>❤️ {post.likes?.length || 0}</td>
                      <td>
                        <button
                          onClick={() => setConfirmacionPost({
                            id: post._id,
                            titulo: post.content.slice(0, 40) + '...'
                          })}
                          className="btn-delete"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={modalJuego}
        onClose={() => setModalJuego(false)}
        title={juegoEditando ? 'Editar juego' : 'Añadir juego'}
      >
        <div className="admin-form">
          <div className="form-group">
            <label>Título</label>
            <input
              name="title"
              value={formJuego.title}
              onChange={handleFormChange}
              placeholder="Título del juego"
            />
          </div>
          <div className="form-group">
            <label>Género</label>
            <input
              name="genre"
              value={formJuego.genre}
              onChange={handleFormChange}
              placeholder="RPG, Acción, Plataformas..."
            />
          </div>
          <div className="form-group">
            <label>Plataforma</label>
            <input
              name="platform"
              value={formJuego.platform}
              onChange={handleFormChange}
              placeholder="PC/PS5/Xbox"
            />
          </div>
          <div className="admin-form-row">
            <div className="form-group">
              <label>Año</label>
              <input
                name="year"
                type="number"
                value={formJuego.year}
                onChange={handleFormChange}
                placeholder="2024"
              />
            </div>
            <div className="form-group">
              <label>Rating</label>
              <input
                name="rating"
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={formJuego.rating}
                onChange={handleFormChange}
                placeholder="8.5"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Developer</label>
            <input
              name="developer"
              value={formJuego.developer}
              onChange={handleFormChange}
              placeholder="Nombre del estudio"
            />
          </div>
          <div className="form-group">
            <label>Descripción</label>
            <textarea
              name="description"
              value={formJuego.description}
              onChange={handleFormChange}
              placeholder="Descripción del juego..."
              rows={3}
              className="profile-bio-input"
            />
          </div>
          <div className="admin-form-actions">
            <button onClick={handleGuardarJuego} className="btn-primary">
              {juegoEditando ? 'Guardar cambios' : 'Crear juego'}
            </button>
            <button
              onClick={() => setModalJuego(false)}
              className="btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!confirmacion}
        onClose={() => setConfirmacion(null)}
        title="Confirmar eliminación"
      >
        <div className="admin-confirm">
          <p>¿Estás seguro de que quieres eliminar <strong>{confirmacion?.titulo}</strong>?</p>
          <p className="admin-confirm-warning">Esta acción no se puede deshacer.</p>
          <div className="admin-form-actions">
            <button onClick={handleEliminarJuego} className="btn-delete-confirm">
              Sí, eliminar
            </button>
            <button
              onClick={() => setConfirmacion(null)}
              className="btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={!!confirmacionPost}
        onClose={() => setConfirmacionPost(null)}
        title="Eliminar post"
      >
        <div className="admin-confirm">
          <p>¿Estás seguro de que quieres eliminar este post?</p>
          <p className="admin-confirm-warning">"{confirmacionPost?.titulo}"</p>
          <p className="admin-confirm-warning">Esta acción no se puede deshacer.</p>
          <div className="admin-form-actions">
            <button onClick={handleEliminarPost} className="btn-delete-confirm">
              Sí, eliminar
            </button>
            <button
              onClick={() => setConfirmacionPost(null)}
              className="btn-secondary"
            >
              Cancelar
            </button>
          </div>
        </div>
      </Modal>

    </div>
  )
}

export default Admin