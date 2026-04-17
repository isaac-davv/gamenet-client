import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { getJuegoService, getPostsService } from '../services/api'
import PostCard from '../components/features/PostCard'
import PostForm from '../components/features/PostForm'
import Loader from '../components/ui/Loader'
import useAuth from '../hooks/useAuth'
import '../styles/components/GameDetail.css'

const GameDetail = () => {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()

  const [juego, setJuego] = useState(null)
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [juegoRes, postsRes] = await Promise.all([
        getJuegoService(id),
        getPostsService({ game: id, limit: 20 })
      ])
      setJuego(juegoRes.data)
      setPosts(postsRes.data.posts)
    } catch {
      toast.error('Error al cargar el juego')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (isLoading) return <Loader />

  if (!juego) return (
    <div className="gamedetail-not-found">
      <p>Juego no encontrado</p>
      <Link to="/games">Volver al catálogo</Link>
    </div>
  )

  return (
    <div className="gamedetail-container">

      {/* ✅ CAMBIO: div → motion.div con fade desde arriba */}
      <motion.div
        className="gamedetail-hero"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="gamedetail-hero-bg">
          {juego.coverImage && (
            <img src={juego.coverImage} alt={juego.title} />
          )}
          <div className="gamedetail-hero-overlay" />
        </div>

        <div className="gamedetail-hero-content">
          <div className="gamedetail-cover">
            {juego.coverImage ? (
              <img src={juego.coverImage} alt={juego.title} />
            ) : (
              <div className="gamedetail-cover-placeholder">🎮</div>
            )}
          </div>

          <div className="gamedetail-info">
            <div className="gamedetail-tags">
              <span className="gamedetail-genre">{juego.genre}</span>
              <span className="gamedetail-platform">{juego.platform}</span>
            </div>
            <h1 className="gamedetail-title">{juego.title}</h1>
            <p className="gamedetail-developer">
              {juego.developer} · {juego.year}
            </p>
            <div className="gamedetail-rating">
              <span className="rating-star">⭐</span>
              <span className="rating-number">{juego.rating}</span>
              <span className="rating-max">/10</span>
            </div>
            {juego.description && (
              <p className="gamedetail-description">{juego.description}</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* ✅ CAMBIO: div → motion.div con fade */}
      <motion.div
        className="gamedetail-posts"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <h2 className="gamedetail-posts-title">
          💬 Posts sobre {juego.title}
          <span className="posts-count">{posts.length}</span>
        </h2>

        {isAuthenticated && (
          <PostForm
            onPostCreado={fetchData}
            juegoPreseleccionado={juego._id}
          />
        )}

        {posts.length === 0 ? (
          <div className="gamedetail-empty">
            <p>Nadie ha publicado sobre este juego todavía.</p>
            {isAuthenticated
              ? <p>¡Sé el primero!</p>
              : <Link to="/login">Inicia sesión para publicar</Link>
            }
          </div>
        ) : (
          <>
            {!isAuthenticated && (
              <div className="gamedetail-login-aviso">
                <Link to="/login">Inicia sesión para publicar sobre este juego</Link>
              </div>
            )}
            <div className="posts-lista">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onLike={fetchData}
                />
              ))}
            </div>
          </>
        )}
      </motion.div>

    </div>
  )
}

export default GameDetail