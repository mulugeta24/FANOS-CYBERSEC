import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('AuthProvider: Initializing...')
    // Get token from localStorage
    const savedToken = localStorage.getItem('token')
    console.log('AuthProvider: Saved token:', savedToken ? 'exists' : 'none')
    
    if (savedToken) {
      setToken(savedToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
      checkAuth()
    } else {
      console.log('AuthProvider: No saved token, setting loading to false')
      setLoading(false)
    }
  }, [])

  const checkAuth = async () => {
    try {
      console.log('AuthProvider: Checking auth...')
      const savedToken = localStorage.getItem('token')
      const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${savedToken}` }
      })
      if (response.data) {
        setUser(response.data)
        localStorage.setItem('user', JSON.stringify(response.data))
        console.log('AuthProvider: User authenticated:', response.data)
      }
    } catch (error) {
      console.warn('AuthProvider: Auth check failed, checking saved user cache')
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser))
        } catch {
          logout()
        }
      } else {
        logout()
      }
    } finally {
      setLoading(false)
    }
  }

  const login = async (username, password) => {
    try {
      console.log('AuthContext: Attempting login for user:', username)
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { username, password })
      console.log('AuthContext: Login response:', response.data)
      
      const { token: newToken, user: userData } = response.data
      
      if (!newToken || !userData) {
        console.error('AuthContext: Invalid response - missing token or user data')
        return { 
          success: false, 
          message: 'Invalid server response' 
        }
      }
      
      console.log('AuthContext: Setting token and user state')
      setToken(newToken)
      setUser(userData)
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(userData))
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
      
      console.log('AuthContext: Login successful, user state updated')
      return { success: true }
    } catch (error) {
      console.error('AuthContext: Login failed:', error)
      console.error('AuthContext: Error response:', error.response?.data)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      }
    }
  }

  const signup = async (username, email, password) => {
    try {
      console.log('AuthContext: Attempting signup for user:', username)
      const response = await axios.post(`${API_BASE_URL}/api/auth/signup`, { username, email, password })
      console.log('AuthContext: Signup response:', response.data)
      
      const { user: userData } = response.data
      
      // Do not auto-login: user must proceed to Step 2 (Sign In)
      return { 
        success: true, 
        message: response.data.message || 'Account created successfully! Please sign in with your credentials.', 
        user: userData 
      }
    } catch (error) {
      console.error('AuthContext: Signup failed:', error)
      return { 
        success: false, 
        message: error.response?.data?.message || 'Sign up failed' 
      }
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
  }

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}