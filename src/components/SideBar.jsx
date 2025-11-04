"use client"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Menu, X, LogOut, Home, Users, BarChart3, AlertCircle, FileText, Settings, ChevronDown, Activity, MapPin, Shield } from "lucide-react"
import { useAuth } from "./context/AuthContext"

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  const getNavItems = () => {
    switch (user?.role) {
      case "hospital_staff":
        return [
          { icon: Home, label: "Dashboard", href: "/dashboard/hospital-staff" },
          { icon: Users, label: "Patients", href: "/dashboard/hospital-staff" },
          { icon: AlertCircle, label: "Incidents", href: "/dashboard/hospital-staff" },
          { icon: Activity, label: "Reports", href: "/dashboard/hospital-staff" },
          { icon: Settings, label: "Settings", href: "/dashboard/hospital-staff" },
        ]
      case "first_aider":
        return [
          { icon: Home, label: "Dashboard", href: "/dashboard/first-aider" },
          { icon: MapPin, label: "Assignments", href: "/dashboard/first-aider" },
          { icon: AlertCircle, label: "Incidents", href: "/dashboard/first-aider" },
          { icon: Activity, label: "Guidance", href: "/dashboard/first-aider" },
          { icon: Settings, label: "Settings", href: "/dashboard/first-aider" },
        ]
      case "admin":
        return [
          { icon: Home, label: "Dashboard", href: "/dashboard/admin" },
          { icon: Users, label: "User Management", href: "/dashboard/admin" },
          { icon: BarChart3, label: "Analytics", href: "/dashboard/admin" },
          { icon: Shield, label: "System Health", href: "/dashboard/admin" },
          { icon: Settings, label: "Settings", href: "/dashboard/admin" },
        ]
      default:
        return []
    }
  }

  const navItems = getNavItems()

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-[#fff3ea] border-r border-[#ffe6c5] transition-all duration-300 z-50 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="h-16 border-b border-[#ffe6c5] flex items-center justify-between px-4">
        {!isCollapsed && <span className="text-lg font-bold text-[#b90000]">Haven</span>}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className="p-1 hover:bg-[#ffe6c5] rounded-lg transition"
        >
          <ChevronDown
            className={`w-5 h-5 text-[#1a0000] transition-transform ${isCollapsed ? "rotate-90" : "-rotate-90"}`}
          />
        </button>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = window.location.pathname === item.href

          return (
            <button
              key={item.href}
              onClick={() => item.href !== "#" && navigate(item.href)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                isActive 
                  ? "bg-[#b90000] text-[#fff3ea]" 
                  : "text-[#1a0000] hover:bg-[#ffe6c5]"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          )
        })}
      </nav>

      <div className="border-t border-[#ffe6c5] p-4 space-y-4">
        {!isCollapsed && (
          <div className="px-2">
            <p className="text-xs font-semibold text-[#740000] uppercase">Logged in as</p>
            <p className="text-sm font-medium text-[#1a0000] truncate">{user?.email}</p>
            <p className="text-xs text-[#740000] capitalize">{user?.role?.replace("_", " ")}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center justify-center gap-2 px-3 py-2 border border-[#b90000] text-[#b90000] hover:bg-[#ffe6c5] rounded-lg text-sm font-medium transition-colors ${
            isCollapsed ? "px-2" : ""
          }`}
        >
          <LogOut className="w-4 h-4" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}