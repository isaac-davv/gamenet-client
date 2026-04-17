import { useState, useEffect, useMemo } from 'react'
import { getPostsService } from '../services/api'
import PostCard from '../components/features/PostCard'
import PostForm from '../components/features/PostForm'
import Loader from '../components/ui/Loader'
import '../styles/components/Home.css'

const Home = () => {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filtro, setFiltro] = useState('')

  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      const { data } = await getPostsService()
      setPosts(data.posts)
    } catch (error) {
      console.error('Error al cargar posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  // useMemo para filtrar posts sin recalcular en cada render
  const postsFiltrados = useMemo(() => {
    if (!filtro) return posts
    return posts.filter((post) =>
      post.game?.title.toLowerCase().includes(filtro.toLowerCase()) ||
      post.content.toLowerCase().includes(filtro.toLowerCase())
    )
  }, [posts, filtro])

  return (
    <div className="home-container">
      <div className="home-layout">

        {/* Columna principal */}
        <main className="home-main">
          <PostForm onPostCreado={fetchPosts} />

          <div className="home-filtro">
            <input
              type="text"
              placeholder="Buscar por juego o contenido..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="filtro-input"
            />
          </div>

          {isLoading ? (
            <Loader />
          ) : postsFiltrados.length === 0 ? (
            <div className="home-empty">
              <p>No hay posts todavía. ¡Sé el primero en publicar!</p>
            </div>
          ) : (
            <div className="posts-lista">
              {postsFiltrados.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onLike={fetchPosts}
                />
              ))}
            </div>
          )}
        </main>

      </div>
    </div>
  )
}

export default Home