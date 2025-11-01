"use client"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Menu, X, LogOut, Home, Users, BarChart3, AlertCircle, FileText, Settings } from "lucide-react"
import { useAuth } from "./context/AuthContext"

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const getMenuItems = () => {
    switch (user?.role) {
      case "hospital_staff":
        return [
          { icon: Home, label: "Dashboard", path: "/dashboard/hospital-staff" },
          { icon: Users, label: "Patients", path: "#" },
          { icon: AlertCircle, label: "Incidents", path: "#" },
          { icon: FileText, label: "Reports", path: "#" },
        ]
      case "first_aider":
        return [
          { icon: Home, label: "Dashboard", path: "/dashboard/first-aider" },
          { icon: AlertCircle, label: "Assignments", path: "#" },
          { icon: FileText, label: "Guidance", path: "#" },
          { icon: Users, label: "Contacts", path: "#" },
        ]
      case "admin":
        return [
          { icon: Home, label: "Dashboard", path: "/dashboard/admin" },
          { icon: Users, label: "Users", path: "#" },
          { icon: BarChart3, label: "Analytics", path: "#" },
          { icon: Settings, label: "Settings", path: "#" },
        ]
      default:
        return []
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-haven-darkest text-haven-light transition-all duration-300 ${isOpen ? "w-64" : "w-20"} z-40`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-haven-dark">
        {isOpen && <h1 className="text-xl font-bold">Haven</h1>}
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-haven-dark rounded-lg transition">
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* User Info */}
      {isOpen && (
        <div className="p-4 border-b border-haven-dark">
          <p className="text-sm text-haven-cream">Logged in as</p>
          <p className="font-semibold truncate">{user?.email}</p>
          <p className="text-xs text-haven-cream capitalize">{user?.role?.replace("_", " ")}</p>
        </div>
      )}

      {/* Menu Items */}
      <nav className="p-4 space-y-2">
        {getMenuItems().map((item) => (
          <button
            key={item.label}
            onClick={() => item.path !== "#" && navigate(item.path)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-haven-dark transition text-left"
            title={!isOpen ? item.label : ""}
          >
            <item.icon size={20} />
            {isOpen && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-haven-bright hover:bg-haven-dark transition text-haven-light"
          title={!isOpen ? "Logout" : ""}
        >
          <LogOut size={20} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  )
}
