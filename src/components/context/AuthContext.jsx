"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Get base URL from environment variables
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("haven_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const register = async (email, password, name, role, username, phone) => {
    setError(null)
    try {
      const registerEndpoint = `${API_BASE_URL}/accounts/api/register/`

      if (!API_BASE_URL) {
        throw new Error("API base URL not configured. Please check your environment variables.")
      }

      // Split name into first_name and last_name
      const nameParts = name.split(' ')
      const first_name = nameParts[0] || ''
      const last_name = nameParts.slice(1).join(' ') || ''

      // Generate a badge number (you might want to change this logic)
      const badge_number = `BADGE${Date.now().toString().slice(-6)}`

      // Create request body matching your UserRegistrationSerializer
      const requestBody = {
        badge_number: badge_number,
        username: username || email.split('@')[0],
        email: email,
        phone: phone || '',
        password: password,
        password_confirm: password,
        role: role,
        first_name: first_name,
        last_name: last_name,
        registration_number: '',
        emergency_contact_name: '',
        emergency_contact_phone: ''
      }

      console.log('Sending registration:', requestBody)

      const response = await fetch(registerEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })

      console.log('Registration response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.log('Django error response:', errorData)
        throw new Error(errorData.error || errorData.detail || JSON.stringify(errorData) || "Registration failed")
      }

      const data = await response.json()
      console.log('Registration successful:', data)

      // Your API returns: { message: 'User registered successfully', user: {...} }
      const userData = { 
        email: data.user.email,
        role: data.user.role,
        name: `${data.user.first_name} ${data.user.last_name}`,
        first_name: data.user.first_name,
        last_name: data.user.last_name,
        username: data.user.username,
        id: data.user.id,
        ...data.user
      }
      
      setUser(userData)
      localStorage.setItem("haven_user", JSON.stringify(userData))
      return userData
    } catch (err) {
      const errorMessage = err.message || "Registration failed"
      setError(errorMessage)
      throw err
    }
  }

  const login = async (email, password) => {
    setError(null)
    try {
      const loginEndpoint = `${API_BASE_URL}/accounts/api/login/`

      if (!API_BASE_URL) {
        throw new Error("API base URL not configured. Please check your environment variables.")
      }

      console.log('Sending login request for:', email)

      const response = await fetch(loginEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      console.log('Login response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.log('Login error response:', errorData)
        throw new Error(errorData.detail || errorData.message || JSON.stringify(errorData) || "Login failed")
      }

      const data = await response.json()
      console.log('Login successful:', data)

      // Your API returns: { message: 'Login successful', user: {...}, tokens: { refresh, access } }
      const userData = { 
        email: data.user.email,
        role: data.user.role,
        name: `${data.user.first_name} ${data.user.last_name}`,
        first_name: data.user.first_name,
        last_name: data.user.last_name,
        username: data.user.username,
        id: data.user.id,
        token: data.tokens.access,
        refresh_token: data.tokens.refresh,
        ...data.user
      }
      
      setUser(userData)
      localStorage.setItem("haven_user", JSON.stringify(userData))
      localStorage.setItem("haven_access_token", data.tokens.access)
      localStorage.setItem("haven_refresh_token", data.tokens.refresh)
      return userData
    } catch (err) {
      const errorMessage = err.message || "Login failed"
      setError(errorMessage)
      throw err
    }
  }

  const logout = async () => {
    try {
      const logoutEndpoint = `${API_BASE_URL}/accounts/api/logout/`
      const refreshToken = localStorage.getItem("haven_refresh_token")
      const accessToken = localStorage.getItem("haven_access_token")

      if (logoutEndpoint && refreshToken && accessToken) {
        await fetch(logoutEndpoint, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}` 
          },
          body: JSON.stringify({ refresh: refreshToken }),
        })
        console.log('✅ Logout successful')
      }
    } catch (err) {
      console.error("Logout error:", err)
    } finally {
      setUser(null)
      localStorage.removeItem("haven_user")
      localStorage.removeItem("haven_access_token")
      localStorage.removeItem("haven_refresh_token")
      console.log('Client-side cleanup completed')
    }
  }

  const refreshToken = async () => {
    try {
      const refreshEndpoint = `${API_BASE_URL}/accounts/api/token/refresh/`
      const refreshToken = localStorage.getItem("haven_refresh_token")
      
      if (!refreshToken) return
      
      const response = await fetch(refreshEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      })

      if (response.ok) {
        const data = await response.json()
        const updatedUser = { ...user, token: data.access }
        setUser(updatedUser)
        localStorage.setItem("haven_user", JSON.stringify(updatedUser))
        localStorage.setItem("haven_access_token", data.access)
      }
    } catch (err) {
      console.error("Token refresh failed:", err)
      logout()
    }
  }

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    refreshToken,
    isAuthenticated: !!user,
    clearError: () => setError(null)
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}