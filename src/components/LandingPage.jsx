"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"
import { AlertCircle, Heart, Users, Shield, AlertTriangle } from "lucide-react"

export default function LandingPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState(null)
  const [hospitals, setHospitals] = useState([])
  const [organizations, setOrganizations] = useState([])
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password_confirm: "",
    first_name: "",
    last_name: "",
    username: "",
    phone: "",
    role: "hospital_staff",
    hospital_id: "",
    organization_id: ""
  })
  const { login, register, user } = useAuth()
  const navigate = useNavigate()
  const authSectionRef = useRef(null)

  // Fetch hospitals and organizations from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"
        
        const [hospitalsRes, organizationsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/accounts/api/hospitals/`),
          fetch(`${API_BASE_URL}/accounts/api/organizations/`)
        ])
        
        if (hospitalsRes.ok) {
          const hospitalsData = await hospitalsRes.json()
          console.log('Fetched hospitals:', hospitalsData)
          setHospitals(hospitalsData)
        } else {
          console.error('Failed to fetch hospitals:', hospitalsRes.status)
          setHospitals([])
        }
        
        if (organizationsRes.ok) {
          const organizationsData = await organizationsRes.json()
          console.log('Fetched organizations:', organizationsData)
          setOrganizations(organizationsData)
        } else {
          console.error('Failed to fetch organizations:', organizationsRes.status)
          setOrganizations([])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setHospitals([])
        setOrganizations([])
        setFormError("Failed to load hospitals and organizations. Please refresh the page.")
      }
    }
    
    fetchData()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setFormError(null)
  }

  const handleGetStarted = () => {
    setIsLogin(false)
    setFormError(null)
    setFormData({ 
      email: "", 
      password: "",
      password_confirm: "", 
      first_name: "", 
      last_name: "",
      username: "", 
      phone: "", 
      role: "hospital_staff",
      hospital_id: "",
      organization_id: ""
    })
    setTimeout(() => {
      authSectionRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormError(null)
    
    try {
      if (isLogin) {
        const userData = await login(formData.email, formData.password)
        const userRole = userData?.role || user?.role || formData.role
        
        const roleMap = {
          hospital_staff: "/dashboard/hospital_staff",
          first_aider: "/dashboard/first_aider",
          system_admin: "/dashboard/system_admin",
        }
        
        const redirectPath = roleMap[userRole] || "/dashboard/"
        navigate(redirectPath)
      } else {
        // Validation
        if (!formData.first_name || !formData.last_name || !formData.username) {
          throw new Error("Full name and username are required for registration")
        }

        if (formData.role === "hospital_staff" && !formData.hospital_id) {
          throw new Error("Please select a hospital")
        }

        if (formData.role === "first_aider" && !formData.organization_id) {
          throw new Error("Please select an organization")
        }

        if (formData.password !== formData.password_confirm) {
          throw new Error("Passwords do not match")
        }

        // Convert IDs to strings for backend (UUIDs)
        const registrationData = {
          ...formData,
          hospital_id: formData.hospital_id ? String(formData.hospital_id) : null,
          organization_id: formData.organization_id ? String(formData.organization_id) : null
        }
        
        await register(
          registrationData.email, 
          registrationData.password,
          registrationData.password_confirm,
          registrationData.first_name,
          registrationData.last_name,
          registrationData.username,
          registrationData.phone,
          registrationData.role,
          registrationData.hospital_id,
          registrationData.organization_id
        )
        
        alert("Registration successful! Please login with your credentials.")
        setIsLogin(true)
        setFormData(prev => ({ 
          ...prev, 
          password: "",
          password_confirm: "",
          first_name: "", 
          last_name: "",
          username: "", 
          phone: "",
          hospital_id: "",
          organization_id: ""
        }))
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred"
      setFormError(errorMessage)
      console.error("Auth error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#fff3ea] via-[#fff3ea] to-[#ffe6c5]">
      <nav className="border-b border-[#ffe6c5] bg-[#fff3ea]/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#b90000] rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-[#fff3ea]" />
            </div>
            <span className="text-2xl font-bold text-[#b90000]">Haven</span>
          </div>
          <div className="hidden md:flex gap-8">
            <a href="#features" className="text-[#1a0000] hover:text-[#b90000] transition">
              Features
            </a>
            <a href="#about" className="text-[#1a0000] hover:text-[#b90000] transition">
              About
            </a>
            <a href="#contact" className="text-[#1a0000] hover:text-[#b90000] transition">
              Contact
            </a>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block bg-[#ffe6c5] text-[#740000] px-4 py-2 rounded-full text-sm font-medium">
              Emergency Response Coordination
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-[#1a0000] leading-tight">
              Coordinated <span className="text-[#b90000]">Emergency</span> Response
            </h1>
            <p className="text-xl text-[#740000]">
              Haven connects hospitals, first-aiders and administrators in real-time to provide coordinated emergency
              response and save lives.
            </p>
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleGetStarted}
                className="px-8 py-3 bg-[#b90000] hover:bg-[#740000] text-[#fff3ea] rounded-lg font-semibold transition-colors"
              >
                Get Started
              </button>
              <button className="px-8 py-3 border border-[#b90000] text-[#b90000] hover:bg-[#ffe6c5] rounded-lg font-semibold transition-colors">
                Learn More
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-[#fff3ea] border border-[#ffe6c5] rounded-lg p-6 hover:border-[#b90000] transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#b90000]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-[#b90000]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1a0000]">Real-time Alerts</h3>
                  <p className="text-sm text-[#740000]">Instant emergency notifications</p>
                </div>
              </div>
            </div>
            <div className="bg-[#fff3ea] border border-[#ffe6c5] rounded-lg p-6 hover:border-[#b90000] transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#740000]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-[#740000]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1a0000]">Team Coordination</h3>
                  <p className="text-sm text-[#740000]">Seamless multi-role collaboration</p>
                </div>
              </div>
            </div>
            <div className="bg-[#fff3ea] border border-[#ffe6c5] rounded-lg p-6 hover:border-[#b90000] transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#1a0000]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-[#1a0000]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1a0000]">Secure & Reliable</h3>
                  <p className="text-sm text-[#740000]">Enterprise-grade security</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={authSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div id="features" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-[#1a0000] mb-4">Why Choose Haven?</h2>
              <p className="text-[#740000] mb-8">
                Our platform is designed specifically for emergency response coordination with features built for
                real-world scenarios.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { title: "Hospital Staff", desc: "Manage patient intake and coordinate with first-aiders" },
                { title: "First-Aiders", desc: "Report incidents and receive real-time guidance" },
                { title: "Administrators", desc: "Monitor system-wide operations and analytics" },
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#b90000]/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-[#b90000]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1a0000]">{item.title}</h3>
                    <p className="text-sm text-[#740000]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg shadow-sm sticky top-24">
            <div className="p-6 pb-4">
              <h3 className="text-2xl font-bold text-[#1a0000]">{isLogin ? "Welcome Back" : "Join Haven"}</h3>
              <p className="text-[#740000] mt-2">
                {isLogin
                  ? "Sign in to your account to continue"
                  : "Create an account to get started with emergency response coordination"}
              </p>
            </div>
            <div className="p-6 pt-0">
              {formError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{formError}</p>
                </div>
              )}
              
              {!isLogin && (hospitals.length === 0 || organizations.length === 0) && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-700">
                    Loading hospitals and organizations... If this persists, please refresh the page.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="first_name" className="block text-sm font-medium text-[#1a0000]">
                          First Name *
                        </label>
                        <input
                          id="first_name"
                          name="first_name"
                          placeholder="John"
                          value={formData.first_name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="last_name" className="block text-sm font-medium text-[#1a0000]">
                          Last Name *
                        </label>
                        <input
                          id="last_name"
                          name="last_name"
                          placeholder="Doe"
                          value={formData.last_name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="username" className="block text-sm font-medium text-[#1a0000]">
                        Username *
                      </label>
                      <input
                        id="username"
                        name="username"
                        placeholder="johndoe"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="block text-sm font-medium text-[#1a0000]">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+254712345678"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="role" className="block text-sm font-medium text-[#1a0000]">
                        Role *
                      </label>
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                      >
                        <option value="hospital_staff">Hospital Staff</option>
                        <option value="first_aider">First-Aider</option>
                      </select>
                    </div>
                    
                    {/* Hospital Selection for Hospital Staff */}
                    {formData.role === "hospital_staff" && (
                      <div className="space-y-2">
                        <label htmlFor="hospital_id" className="block text-sm font-medium text-[#1a0000]">
                          Select Hospital *
                        </label>
                        <select
                          id="hospital_id"
                          name="hospital_id"
                          value={formData.hospital_id}
                          onChange={handleInputChange}
                          required
                          disabled={hospitals.length === 0}
                          className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent disabled:opacity-50"
                        >
                          <option value="">{hospitals.length === 0 ? "Loading hospitals..." : "Select a hospital"}</option>
                          {hospitals.map((hospital) => (
                            <option key={hospital.id} value={hospital.id}>
                              {hospital.name}
                            </option>
                          ))}
                        </select>
                        {hospitals.length === 0 && (
                          <p className="text-xs text-[#740000] mt-1">
                            No hospitals available. Please contact administrator.
                          </p>
                        )}
                      </div>
                    )}

                    {/* Organization Selection for First-Aiders */}
                    {formData.role === "first_aider" && (
                      <div className="space-y-2">
                        <label htmlFor="organization_id" className="block text-sm font-medium text-[#1a0000]">
                          Select Organization *
                        </label>
                        <select
                          id="organization_id"
                          name="organization_id"
                          value={formData.organization_id}
                          onChange={handleInputChange}
                          required
                          disabled={organizations.length === 0}
                          className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent disabled:opacity-50"
                        >
                          <option value="">{organizations.length === 0 ? "Loading organizations..." : "Select an organization"}</option>
                          {organizations.map((org) => (
                            <option key={org.id} value={org.id}>
                              {org.name}
                            </option>
                          ))}
                        </select>
                        {organizations.length === 0 && (
                          <p className="text-xs text-[#740000] mt-1">
                            No organizations available. Please contact administrator.
                          </p>
                        )}
                      </div>
                    )}
                  </>
                )}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-[#1a0000]">
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-[#1a0000]">
                    Password *
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                  />
                </div>
                {!isLogin && (
                  <div className="space-y-2">
                    <label htmlFor="password_confirm" className="block text-sm font-medium text-[#1a0000]">
                      Confirm Password *
                    </label>
                    <input
                      id="password_confirm"
                      name="password_confirm"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password_confirm}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                    />
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting || (!isLogin && ((formData.role === "hospital_staff" && hospitals.length === 0) || (formData.role === "first_aider" && organizations.length === 0)))}
                  className="w-full bg-[#b90000] hover:bg-[#740000] text-[#fff3ea] font-semibold py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
                </button>
              </form>
              <div className="mt-4 text-center">
                <button
                  onClick={() => {
                    setIsLogin(!isLogin)
                    setFormError(null)
                    if (!isLogin) {
                      setFormData(prev => ({ 
                        ...prev, 
                        password: "",
                        password_confirm: "",
                        first_name: "", 
                        last_name: "",
                        username: "", 
                        phone: "",
                        hospital_id: "",
                        organization_id: ""
                      }))
                    }
                  }}
                  className="text-sm text-[#b90000] hover:text-[#740000] transition-colors"
                >
                  {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#ffe6c5] bg-[#fff3ea]/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#b90000] rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-[#fff3ea]" />
                </div>
                <span className="font-bold text-[#b90000]">Haven</span>
              </div>
              <p className="text-sm text-[#740000]">Emergency response coordination platform</p>
            </div>
            <div>
              <h4 className="font-semibold text-[#1a0000] mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-[#740000]">
                <li>
                  <a href="#features" className="hover:text-[#b90000] transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#b90000] transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#b90000] transition">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#1a0000] mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-[#740000]">
                <li>
                  <a href="#about" className="hover:text-[#b90000] transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#b90000] transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-[#b90000] transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#1a0000] mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-[#740000]">
                <li>
                  <a href="#" className="hover:text-[#b90000] transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#b90000] transition">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[#b90000] transition">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#ffe6c5] pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-[#740000]">© 2025 Haven. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-[#740000] hover:text-[#b90000] transition">
                Twitter
              </a>
              <a href="#" className="text-[#740000] hover:text-[#b90000] transition">
                LinkedIn
              </a>
              <a href="#" className="text-[#740000] hover:text-[#b90000] transition">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}