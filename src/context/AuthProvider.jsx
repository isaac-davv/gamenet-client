import { useReducer, useEffect } from 'react'
import { getMeService } from '../services/api'
import { AuthContext } from './AuthContext'

// ── ESTADO INICIAL ───────────────────────────────────────────
const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: false,
  isLoading: true   
}

//REDUCER 
const authReducer = (state, action) => {
  switch (action.type) {

    case 'LOGIN':
      localStorage.setItem('token', action.payload.token)
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false
      }

    case 'LOGOUT':
      localStorage.removeItem('token')
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      }

    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      }

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }

    default:
      return state
  }
}

//CONTEXTO 

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    const verificarToken = async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        dispatch({ type: 'SET_LOADING', payload: false })
        return
      }

      try {
        const { data } = await getMeService()
        dispatch({
          type: 'LOGIN',
          payload: { user: data, token }
        })
    // eslint-disable-next-line no-unused-vars
      } catch (error) {
        dispatch({ type: 'LOGOUT' })
      }
    }

    verificarToken()
  }, [])

  const login = (userData) => {
    dispatch({ type: 'LOGIN', payload: userData })
  }

  const logout = () => {
    dispatch({ type: 'LOGOUT' })
  }

  const updateUser = (userData) => {
    dispatch({ type: 'UPDATE_USER', payload: userData })
  }

  return (
    <AuthContext.Provider value={{
      user: state.user,
      token: state.token,
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      login,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}