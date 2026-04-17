import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import useAuth from '../../hooks/useAuth'
import { darLikeService } from '../../services/api'
import formatDate from '../../utils/formatDate'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import '../../styles/components/PostCard.css'

const PostCard = ({ post, onLike }) => {
  const { user, isAuthenticated } = useAuth()

  const yaLeGusto = post.likes?.includes(user?._id)

  // useCallback para no recrear la función en cada render
  const handleLike = useCallback(async () => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para dar like')
      return
    }
    try {
      await darLikeService(post._id)
      onLike()
    } catch (error) {
      toast.error('Error al dar like')
    }
  }, [post._id, isAuthenticated, onLike])

  return (
    // ✅ CAMBIO: article → motion.article con fade in
    <motion.article
      className="post-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="post-card-header">
        <Link to={`/profile/${post.author?.username}`} className="post-author">
          <div className="post-avatar">
            {post.author?.avatarUrl
              ? <img src={post.author.avatarUrl} alt={post.author.username} />
              : <span>{post.author?.username[0].toUpperCase()}</span>
            }
          </div>
          <div className="post-author-info">
            <span className="post-author-name">{post.author?.username}</span>
            <span className="post-date">{formatDate(post.createdAt)}</span>
          </div>
        </Link>

        {post.game && (
          <Link to={`/games/${post.game._id}`} className="post-game-tag">
            🎮 {post.game.title}
          </Link>
        )}
      </div>

      <p className="post-content">{post.content}</p>

      {post.imageUrl && (
        <img src={post.imageUrl} alt="Post image" className="post-image" />
      )}

      <div className="post-card-footer">
        <button
          onClick={handleLike}
          className={`btn-like ${yaLeGusto ? 'liked' : ''}`}
        >
          {yaLeGusto ? '❤️' : '🤍'} {post.likes?.length || 0}
        </button>
      </div>
    </motion.article>
  )
}

export default PostCard