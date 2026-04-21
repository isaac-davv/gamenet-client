import axios from 'axios'

// Creamos una instancia de axios con la URL base de la API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
})

// ── INTERCEPTOR DE PETICIÓN ──────────────────────────────────
// Antes de cada petición, añade el token JWT al header
// automáticamente si existe en localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── AUTH ─────────────────────────────────────────────────────
export const registerService    = (data) => api.post('/auth/register', data)
export const loginService       = (data) => api.post('/auth/login', data)
export const getMeService       = ()     => api.get('/auth/me')

// ── USUARIOS ─────────────────────────────────────────────────
export const getUsuarioService       = (username) => api.get(`/users/${username}`)
export const editarPerfilService     = (data)     => api.put('/users/perfil/editar', data)
export const subirAvatarService      = (data)     => api.post('/users/perfil/avatar', data)
export const seguirUsuarioService    = (id)       => api.post(`/users/${id}/seguir`)
export const dejarSeguirService      = (id)       => api.post(`/users/${id}/dejardeseguir`)

// ── JUEGOS ───────────────────────────────────────────────────
export const getJuegosService = (params) => api.get('/games', { params })
export const getJuegoService  = (id)     => api.get(`/games/${id}`)
export const crearJuegoService  = (data) => api.post('/games', data)
export const editarJuegoService = (id, data) => api.put(`/games/${id}`, data)
export const eliminarJuegoService = (id) => api.delete(`/games/${id}`)

// ── POSTS ────────────────────────────────────────────────────
export const getPostsService   = (params) => api.get('/posts', { params })
export const getPostService    = (id)     => api.get(`/posts/${id}`)
export const crearPostService = (data) => api.post('/posts', data, {
  headers: { 'Content-Type': 'multipart/form-data' }
})
export const editarPostService = (id, data) => api.put(`/posts/${id}`, data)
export const eliminarPostService = (id)   => api.delete(`/posts/${id}`)
export const darLikeService    = (id)     => api.post(`/posts/${id}/like`)

export default api