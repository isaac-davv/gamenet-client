import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import useAuth from '../hooks/useAuth'
import {
  getUsuarioService,
  getPostsService,
  seguirUsuarioService,
  dejarSeguirService,
  editarPerfilService
} from '../services/api'
import AvatarCreator from '../components/features/AvatarCreator'
import PostCard from '../components/features/PostCard'
import Loader from '../components/ui/Loader'
import Modal from '../components/ui/Modal'
import '../styles/components/Profile.css'

const Profile = () => {
  const { username } = useParams()
  const { user: usuarioLogueado, updateUser } = useAuth()

  const [perfil, setPerfil] = useState(null)
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [editando, setEditando] = useState(false)
  const [bio, setBio] = useState('')
  const [avatarConfig, setAvatarConfig] = useState({
    skinColor: '#FDBCB4',
    hairColor: '#2C1810',
    hairStyle: 'short',
    clothesColor: '#E94560',
    eyeColor: '#4A90D9'
  })
  const [avatarConfigOriginal, setAvatarConfigOriginal] = useState(null)
  const [modalAbierto, setModalAbierto] = useState(null)

  const esMiPerfil = usuarioLogueado?.username === username
  const yaLeSigo = perfil?.followers?.some(
    (f) => f._id === usuarioLogueado?._id
  )

  const fetchPerfil = async () => {
    try {
      setIsLoading(true)
      const { data: perfilData } = await getUsuarioService(username)
      const { data: postsData } = await getPostsService({
        author: perfilData._id
      })
      setPerfil(perfilData)
      setPosts(postsData.posts)
      setBio(perfilData.bio || '')
      setAvatarConfig(perfilData.avatarConfig || {
        skinColor: '#FDBCB4',
        hairColor: '#2C1810',
        hairStyle: 'short',
        clothesColor: '#E94560',
        eyeColor: '#4A90D9'
      })
    } catch {
      toast.error('Error al cargar el perfil')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPerfil()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username])

  const handleFollow = async () => {
    try {
      if (yaLeSigo) {
        await dejarSeguirService(perfil._id)
        toast.success(`Dejaste de seguir a ${perfil.username}`)
      } else {
        await seguirUsuarioService(perfil._id)
        toast.success(`Ahora sigues a ${perfil.username}`)
      }
      fetchPerfil()
    } catch {
      toast.error('Error al seguir/dejar de seguir')
    }
  }

  const handleGuardarPerfil = async () => {
    try {
      const { data } = await editarPerfilService({
        bio,
        avatarConfig
      })
      updateUser(data.user)
      setPerfil(data.user)
      setEditando(false)
      toast.success('Perfil actualizado correctamente')
    } catch {
      toast.error('Error al actualizar el perfil')
    }
  }

  const handleCancelarEdicion = () => {
    setAvatarConfig(avatarConfigOriginal)
    setBio(perfil.bio || '')
    setEditando(false)
  }

  const handleToggleEditar = () => {
    if (!editando) {
      setAvatarConfigOriginal(avatarConfig)
    }
    setEditando(!editando)
  }

  if (isLoading) return <Loader />

  if (!perfil) return (
    <div className="profile-not-found">
      <p>Usuario no encontrado</p>
      <Link to="/">Volver al feed</Link>
    </div>
  )

  return (
    <div className="profile-container">
      <div className="profile-layout">

        <motion.aside
          className="profile-sidebar"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >

          <div className="profile-avatar-wrapper">
            <AvatarCreator
              config={avatarConfig}
              onChange={setAvatarConfig}
              soloVista={!editando}
            />
          </div>

          <div className="profile-info">
            <h1 className="profile-username">@{perfil.username}</h1>

            {editando ? (
              <div className="profile-edit-form">
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Escribe tu bio..."
                  className="profile-bio-input"
                  maxLength={200}
                  rows={3}
                />
                <div className="profile-edit-actions">
                  <button
                    onClick={handleGuardarPerfil}
                    className="btn-primary"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={handleCancelarEdicion}
                    className="btn-secondary"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <p className="profile-bio">
                {perfil.bio || 'Sin bio todavía'}
              </p>
            )}

            <div className="profile-stats">
              <div className="profile-stat">
                <span className="stat-number">{posts.length}</span>
                <span className="stat-label">Posts</span>
              </div>
              <button
                className="profile-stat profile-stat-btn"
                onClick={() => setModalAbierto('followers')}
              >
                <span className="stat-number">{perfil.followers?.length || 0}</span>
                <span className="stat-label">Seguidores</span>
              </button>
              <button
                className="profile-stat profile-stat-btn"
                onClick={() => setModalAbierto('following')}
              >
                <span className="stat-number">{perfil.following?.length || 0}</span>
                <span className="stat-label">Siguiendo</span>
              </button>
            </div>

            {esMiPerfil ? (
              <button
                onClick={handleToggleEditar}
                className="btn-secondary"
              >
                {editando ? 'Cancelar' : 'Editar perfil'}
              </button>
            ) : (
              <button
                onClick={handleFollow}
                className={yaLeSigo ? 'btn-secondary' : 'btn-primary'}
              >
                {yaLeSigo ? 'Dejar de seguir' : 'Seguir'}
              </button>
            )}
          </div>

        </motion.aside>

        <motion.main
          className="profile-main"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h2 className="profile-posts-title">Posts de @{perfil.username}</h2>
          {posts.length === 0 ? (
            <div className="home-empty">
              <p>Este usuario no ha publicado nada todavía</p>
            </div>
          ) : (
            <div className="posts-lista">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onLike={fetchPerfil}
                />
              ))}
            </div>
          )}
        </motion.main>

      </div>

      <Modal
        isOpen={modalAbierto === 'followers'}
        onClose={() => setModalAbierto(null)}
        title={`Seguidores · ${perfil.followers?.length || 0}`}
      >
        {perfil.followers?.length === 0 ? (
          <p className="modal-empty">Aún no tiene seguidores</p>
        ) : (
          perfil.followers?.map((u) => (
            <Link
              key={u._id}
              to={`/profile/${u.username}`}
              className="modal-user-item"
              onClick={() => setModalAbierto(null)}
            >
              <div className="modal-user-avatar">
                {u.avatarUrl
                  ? <img src={u.avatarUrl} alt={u.username} />
                  : <span>{u.username[0].toUpperCase()}</span>
                }
              </div>
              <span className="modal-user-username">@{u.username}</span>
            </Link>
          ))
        )}
      </Modal>

      <Modal
        isOpen={modalAbierto === 'following'}
        onClose={() => setModalAbierto(null)}
        title={`Siguiendo · ${perfil.following?.length || 0}`}
      >
        {perfil.following?.length === 0 ? (
          <p className="modal-empty">No sigue a nadie todavía</p>
        ) : (
          perfil.following?.map((u) => (
            <Link
              key={u._id}
              to={`/profile/${u.username}`}
              className="modal-user-item"
              onClick={() => setModalAbierto(null)}
            >
              <div className="modal-user-avatar">
                {u.avatarUrl
                  ? <img src={u.avatarUrl} alt={u.username} />
                  : <span>{u.username[0].toUpperCase()}</span>
                }
              </div>
              <span className="modal-user-username">@{u.username}</span>
            </Link>
          ))
        )}
      </Modal>

    </div>
  )
}

export default Profile