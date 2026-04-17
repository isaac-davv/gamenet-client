import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthProvider'
import Navbar from './components/layout/Navbar'
import ProtectedRoute from './components/layout/ProtectedRoute'

import Home     from './pages/Home'
import Login    from './pages/Login'
import Register from './pages/Register'
import Profile  from './pages/Profile'
import Games    from './pages/Games'
import GameDetail from './pages/GameDetail'
import Admin    from './pages/Admin'

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Navbar />
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/games"    element={<Games />} />
          <Route path="/games/:id" element={<GameDetail />} />
          <Route path="/profile/:username" element={<Profile />} />

          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App