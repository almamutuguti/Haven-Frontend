"use client"

import { useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { AlertCircle, Users, Shield } from "lucide-react"

export default function LandingPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("hospital_staff")
  const [authError, setAuthError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const authFormRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setAuthError("")
    setIsLoading(true)

    try {
      if (isLogin) {
        await login(email, password)
      } else {
        await register(email, password, role)
      }
      // Redirect based on role
      const roleMap = {
        hospital_staff: "/dashboard/hospital-staff",
        first_aider: "/dashboard/first-aider",
        admin: "/dashboard/admin",
      }
      navigate(roleMap[role] || "/")
    } catch (err) {
      setAuthError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const scrollToAuth = () => {
    setIsLogin(false)
    setTimeout(() => {
      authFormRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  return (
    <div className="min-h-screen bg-haven-light">
      {/* Navigation */}
      <nav className="bg-haven-darkest text-haven-light shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Haven</h1>
          <button
            onClick={scrollToAuth}
            className="bg-haven-bright hover:bg-haven-dark px-6 py-2 rounded-lg font-semibold transition"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-haven-darkest mb-4">Emergency Response Platform</h2>
          <p className="text-xl text-haven-dark mb-8">
            Coordinating rapid emergency response with real-time communication
          </p>
          <button
            onClick={scrollToAuth}
            className="bg-haven-bright hover:bg-haven-dark text-haven-light px-8 py-3 rounded-lg font-semibold transition text-lg"
          >
            Get Started
          </button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-haven-bright">
            <AlertCircle className="text-haven-bright mb-4" size={32} />
            <h3 className="text-xl font-bold text-haven-darkest mb-2">Real-Time Alerts</h3>
            <p className="text-haven-dark">Instant emergency notifications to all responders</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-haven-bright">
            <Users className="text-haven-bright mb-4" size={32} />
            <h3 className="text-xl font-bold text-haven-darkest mb-2">Team Coordination</h3>
            <p className="text-haven-dark">Seamless communication between hospital and field teams</p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg border-l-4 border-haven-bright">
            <Shield className="text-haven-bright mb-4" size={32} />
            <h3 className="text-xl font-bold text-haven-darkest mb-2">Secure & Reliable</h3>
            <p className="text-haven-dark">Enterprise-grade security for sensitive data</p>
          </div>
        </div>
      </section>

      {/* Auth Section */}
      <section ref={authFormRef} className="bg-haven-darkest text-haven-light py-20">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-haven-dark p-8 rounded-lg shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-center">{isLogin ? "Login" : "Register"}</h2>

            {authError && <div className="bg-haven-bright text-white p-3 rounded-lg mb-4 text-sm">{authError}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-haven-darkest text-haven-light border border-haven-bright focus:outline-none focus:ring-2 focus:ring-haven-cream"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-haven-darkest text-haven-light border border-haven-bright focus:outline-none focus:ring-2 focus:ring-haven-cream"
                  required
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-haven-darkest text-haven-light border border-haven-bright focus:outline-none focus:ring-2 focus:ring-haven-cream"
                  >
                    <option value="hospital_staff">Hospital Staff</option>
                    <option value="first_aider">First-Aider</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-haven-bright hover:bg-haven-dark text-haven-light font-semibold py-2 rounded-lg transition disabled:opacity-50"
              >
                {isLoading ? "Loading..." : isLogin ? "Login" : "Register"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-haven-cream mb-2">{isLogin ? "Don't have an account?" : "Already have an account?"}</p>
              <button
                onClick={() => {
                  setIsLogin(!isLogin)
                  setAuthError("")
                }}
                className="text-haven-cream hover:text-haven-light font-semibold underline"
              >
                {isLogin ? "Register" : "Login"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-haven-darkest text-haven-cream text-center py-8">
        <p>&copy; 2025 Haven Emergency Response Platform. All rights reserved.</p>
      </footer>
    </div>
  )
}
