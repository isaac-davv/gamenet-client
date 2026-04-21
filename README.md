# 🎮 GameNet Client

Frontend de GameNet, una red social para gamers. Desarrollado como proyecto final del bootcamp fullstack de The Rock Code.

## 🚀 Demo

- **Frontend:** https://gamenet-client.vercel.app
- **API:** https://gamenet-api.onrender.com

## 🛠️ Stack tecnológico

- **React 19 + Vite** — Base del frontend
- **React Router DOM v7** — Navegación
- **Axios** — Llamadas HTTP con interceptor JWT
- **React Three Fiber + Drei** — Avatar 3D en Three.js
- **Framer Motion** — Animaciones y transiciones
- **react-hot-toast** — Notificaciones
- **date-fns** — Formateo de fechas en español

## 📁 Estructura del proyecto

```
gamenet-client/
├── src/
│   ├── components/
│   │   ├── features/    → AvatarCreator, PostCard, PostForm
│   │   ├── layout/      → Navbar, ProtectedRoute
│   │   └── ui/          → Loader, Modal
│   ├── context/         → AuthContext, AuthProvider
│   ├── hooks/           → useAuth
│   ├── pages/           → Home, Login, Register, Profile, Games, GameDetail, Admin
│   ├── services/        → api.js (Axios centralizado)
│   ├── styles/          → CSS variables + componentes
│   └── utils/           → formatDate
```

## 🎨 Funcionalidades

- ✅ Autenticación JWT (registro, login, logout)
- ✅ Feed de posts con filtro en tiempo real
- ✅ Avatar 3D cartoon personalizable (Three.js)
- ✅ Catálogo de 105 videojuegos con filtros
- ✅ Detalle de juego con posts asociados
- ✅ Perfil de usuario con follow/unfollow
- ✅ Modal de seguidores y siguiendo
- ✅ Panel de administración
- ✅ Responsive para móvil y tablet
- ✅ Animaciones con Framer Motion
- ✅ Menú hamburguesa en móvil

## 🔐 Usuario administrador

Email: admin@gamenet.com
Password: Admin1234!


## ⚙️ Variables de entorno

```env
VITE_API_URL=https://gamenet-api.onrender.com/api
```

## 🚀 Instalación local

```bash
# Clona el repositorio
git clone https://github.com/isaac-davv/gamenet-client.git
cd gamenet-client

# Instala dependencias
npm install

# Configura las variables de entorno
cp .env.example .env

# Arranca el servidor de desarrollo
npm run dev
```

## 🏗️ Arquitectura

El estado global de autenticación se gestiona con `useReducer` en `AuthProvider`. Todas las llamadas a la API están centralizadas en `services/api.js` con un interceptor de Axios que añade el token JWT automáticamente en cada petición.

El avatar 3D se construye programáticamente con geometrías de Three.js sin depender de APIs externas — la configuración se guarda como JSON en MongoDB.

