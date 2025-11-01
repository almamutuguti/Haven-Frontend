"use client"

import { Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"

export function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/" />
  }

  if (role && user.role !== role) {
    return <Navigate to="/" />
  }

  return children
}
