import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'
import { getJuegosService } from '../services/api'
import Loader from '../components/ui/Loader'
import '../styles/components/Games.css'

const Games = () => {
  const [juegos, setJuegos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [generoSeleccionado, setGeneroSeleccionado] = useState('')
  const [plataformaSeleccionada, setPlataformaSeleccionada] = useState('')

  useEffect(() => {
    const fetchJuegos = async () => {
      try {
        setIsLoading(true)
        const { data } = await getJuegosService({ limit: 105 })
        setJuegos(data.juegos)
      } catch {
        console.error('Error al cargar juegos')
      } finally {
        setIsLoading(false)
      }
    }
    fetchJuegos()
  }, [])

  // useMemo para filtrar sin recalcular en cada render
  const juegosfiltrados = useMemo(() => {
    return juegos.filter((juego) => {
      const coincideSearch = juego.title
        .toLowerCase()
        .includes(search.toLowerCase())
      const coincideGenero = generoSeleccionado
        ? juego.genre === generoSeleccionado
        : true
      const coincidePlataforma = plataformaSeleccionada
        ? juego.platform.includes(plataformaSeleccionada)
        : true
      return coincideSearch && coincideGenero && coincidePlataforma
    })
  }, [juegos, search, generoSeleccionado, plataformaSeleccionada])

  // Géneros únicos extraídos de los juegos
  const generos = useMemo(() => {
    return [...new Set(juegos.map((j) => j.genre))].sort()
  }, [juegos])

  // Plataformas únicas
  const plataformas = useMemo(() => {
    const todas = juegos.flatMap((j) =>
      j.platform.split('/').map((p) => p.trim())
    )
    return [...new Set(todas)].sort()
  }, [juegos])

  const limpiarFiltros = () => {
    setSearch('')
    setGeneroSeleccionado('')
    setPlataformaSeleccionada('')
  }

  const hayFiltrosActivos = search || generoSeleccionado || plataformaSeleccionada

  return (
    <div className="games-container">

      {/* Cabecera */}
      <div className="games-header">
        <div>
          <h1 className="games-title">Catálogo de Juegos</h1>
          <p className="games-subtitle">
            {juegosfiltrados.length} juegos encontrados
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="games-filtros">
        <input
          type="text"
          placeholder="Buscar juego..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="games-search"
        />
        <select
          value={generoSeleccionado}
          onChange={(e) => setGeneroSeleccionado(e.target.value)}
          className="games-select"
        >
          <option value="">Todos los géneros</option>
          {generos.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <select
          value={plataformaSeleccionada}
          onChange={(e) => setPlataformaSeleccionada(e.target.value)}
          className="games-select"
        >
          <option value="">Todas las plataformas</option>
          {plataformas.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        {hayFiltrosActivos && (
          <button onClick={limpiarFiltros} className="games-limpiar">
            Limpiar filtros ✕
          </button>
        )}
      </div>

      {/* Grid de juegos */}
      {isLoading ? (
        <Loader />
      ) : juegosfiltrados.length === 0 ? (
        <div className="games-empty">
          <p>No se encontraron juegos con esos filtros</p>
          <button onClick={limpiarFiltros} className="btn-primary">
            Ver todos
          </button>
        </div>
      ) : (
        <motion.div
          className="games-grid"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.04 } }
          }}
        >
          {juegosfiltrados.map((juego) => (
            <motion.div
              key={juego._id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 0.3 }}
            >
              <Link to={`/games/${juego._id}`} className="game-card">
                <div className="game-card-image">
                  {juego.coverImage ? (
                    <img src={juego.coverImage} alt={juego.title} />
                  ) : (
                    <div className="game-card-placeholder">🎮</div>
                  )}
                  <span className="game-card-rating">⭐ {juego.rating}</span>
                </div>
                <div className="game-card-info">
                  <h3 className="game-card-title">{juego.title}</h3>
                  <div className="game-card-meta">
                    <span className="game-card-genre">{juego.genre}</span>
                    <span className="game-card-year">{juego.year}</span>
                  </div>
                  <p className="game-card-developer">{juego.developer}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

export default Games