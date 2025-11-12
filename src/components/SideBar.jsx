
"use client"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { 
  Menu, X, LogOut, Home, Users, BarChart3, AlertCircle, 
  FileText, Settings, ChevronLeft, ChevronRight, Activity, Shield, 
  Bell, Stethoscope, User, History, Ambulance, Heart, Radio
} from "lucide-react"
import { useAuth } from "./context/AuthContext"
import { apiClient } from "../utils/api"
import Notifications from "./Notifications"

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [hoveredItem, setHoveredItem] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  // Fetch notifications based on user role
  const fetchNotifications = async () => {
    if (!user) return
    
    try {
      setIsLoading(true)
      const response = await apiClient.get('/api/notifications/notifications/')
      const allNotifications = response.results || response.data || []
      
      // Filter notifications based on user role
      let roleFilteredNotifications = []
      
      switch (user.role) {
        case "hospital_staff":
          roleFilteredNotifications = allNotifications.filter(notification => 
            notification.notification_type === 'hospital_assignment' ||
            notification.notification_type === 'patient_arrived' ||
            notification.notification_type === 'hospital_ready' ||
            notification.notification_type === 'system_alert'
          )
          break
        case "first_aider":
          roleFilteredNotifications = allNotifications.filter(notification => 
            notification.notification_type === 'first_aider_dispatch' ||
            notification.notification_type === 'emergency_alert' ||
            notification.notification_type === 'eta_update' ||
            notification.notification_type === 'system_alert' ||
            notification.notification_type === 'hospital_communication' ||
            notification.notification_type === 'medical_guidance'
          )
          break
        case "system_admin":
          roleFilteredNotifications = allNotifications.filter(notification => 
            notification.notification_type === 'system_alert' ||
            notification.notification_type === 'emergency_alert' ||
            notification.notification_type === 'user_activity'
          )
          break
        default:
          roleFilteredNotifications = allNotifications
      }
      
      setNotifications(roleFilteredNotifications)
      setUnreadCount(roleFilteredNotifications.filter(n => !n.read_at)?.length || 0)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchNotifications()
      const interval = setInterval(fetchNotifications, 30000)
      return () => clearInterval(interval)
    }
  }, [user])

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  const getNavItems = () => {
    switch (user?.role) {
      case "hospital_staff":
        return [
          { icon: Home, label: "Dashboard", href: "/dashboard/hospital-staff" },
          { icon: Users, label: "Patients", href: "/dashboard/hospital-staff/patients" },
          { icon: History, label: "Incidents", href: "/dashboard/hospital-staff/incidents" },
          { icon: Activity, label: "Reports", href: "/dashboard/hospital-staff/reports" },
          { icon: Settings, label: "Settings", href: "/dashboard/hospital-staff/settings" },
        ]
      case "first_aider":
        return [
          { icon: Home, label: "Dashboard", href: "/dashboard/first-aider" },
          { icon: Ambulance, label: "Assignments", href: "/dashboard/first-aider/assignments" },
          { icon: Users, label: "Patients", href: "/dashboard/first-aider/victims" },
          { icon: Radio, label: "Communications", href: "/dashboard/first-aider/communications" },
          { icon: Heart, label: "Guidance", href: "/dashboard/first-aider/guidance" },
          { icon: History, label: "History", href: "/dashboard/first-aider/history" },
          { icon: Settings, label: "Settings", href: "/dashboard/first-aider/settings" },
        ]
      case "system_admin":
        return [
          { icon: Home, label: "Dashboard", href: "/dashboard/admin" },
          { icon: Users, label: "User Management", href: "/dashboard/admin/users" },
          { icon: BarChart3, label: "Analytics", href: "/dashboard/admin/analytics" },
          { icon: Shield, label: "System Health", href: "/dashboard/admin/system-health" },
          { icon: Settings, label: "Settings", href: "/dashboard/admin/settings" },
        ]
      default:
        return []
    }
  }

  const navItems = getNavItems()

  const getUserDisplayInfo = () => {
    if (!user) return { role: '', email: '', additionalInfo: '' }
    
    switch (user.role) {
      case "hospital_staff":
        return {
          role: "Hospital Staff",
          email: user.email,
          additionalInfo: user.hospital?.name || 'Hospital'
        }
      case "first_aider":
        return {
          role: "First Aider",
          email: user.email,
          additionalInfo: user.organization?.name || user.organization || 'Organization'
        }
      case "system_admin":
        return {
          role: "Administrator",
          email: user.email,
          additionalInfo: "System Admin"
        }
      default:
        return {
          role: user.role || "User",
          email: user.email,
          additionalInfo: ""
        }
    }
  }

  const userInfo = getUserDisplayInfo()

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#b90000] text-white rounded-lg shadow-lg"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-[#fff3ea] border-r border-[#ffe6c5] transition-all duration-300 z-50 flex flex-col ${
          isCollapsed ? "w-20" : "w-64"  // Increased collapsed width from 16 to 20
        } ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Header */}
        <div className={`h-16 border-b border-[#ffe6c5] flex items-center justify-between shrink-0 ${
          isCollapsed ? "px-3" : "px-4"  // Adjusted padding for collapsed state
        }`}>
          {!isCollapsed && (
            <span className="text-lg font-bold text-[#b90000] whitespace-nowrap">Haven</span>
          )}
          <div className="flex items-center gap-1">  {/* Reduced gap for better fit */}
            {/* Notifications Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(true)}
                className="p-2 hover:bg-[#ffe6c5] rounded-lg transition relative"
                disabled={isLoading}
              >
                <Bell className={`w-5 h-5 text-[#1a0000] ${isLoading ? 'opacity-50' : ''}`} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#b90000] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            </div>

            {/* Collapse Button - Now fits properly inside collapsed sidebar */}
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)} 
              className="p-2 hover:bg-[#ffe6c5] rounded-lg transition hidden lg:block"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-[#1a0000]" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-[#1a0000]" />
              )}
            </button>

            {/* Mobile close button */}
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1 hover:bg-[#ffe6c5] rounded-lg transition"
            >
              <X className="w-5 h-5 text-[#1a0000]" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href

            return (
              <div key={item.href} className="relative">
                <button
                  onClick={() => {
                    navigate(item.href)
                    setIsMobileOpen(false)
                  }}
                  onMouseEnter={() => setHoveredItem(item.label)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? "bg-[#b90000] text-white shadow-sm" 
                      : "text-[#1a0000] hover:bg-[#ffe6c5] hover:shadow-sm"
                  } ${isCollapsed ? "justify-center px-2" : ""}`}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "text-[#1a0000]"}`} />
                  {!isCollapsed && (
                    <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                  )}
                </button>
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-[#ffe6c5] p-4 space-y-3 shrink-0">
          {!isCollapsed && (
            <div className="px-2">
              <p className="text-xs font-semibold text-[#740000] uppercase tracking-wide mb-1">
                Logged in as
              </p>
              <p className="text-sm font-medium text-[#1a0000] truncate mb-1">{userInfo.email}</p>
              <p className="text-xs text-[#740000] font-medium">{userInfo.role}</p>
              {userInfo.additionalInfo && (
                <p className="text-xs text-[#740000] truncate mt-1">{userInfo.additionalInfo}</p>
              )}
            </div>
          )}
          
          {/* Logout Button - Clear red styling with border */}
          <button
            onClick={handleLogout}
            onMouseEnter={() => setHoveredItem("Logout")}
            onMouseLeave={() => setHoveredItem(null)}
            className={`w-full flex items-center gap-2 px-3 py-3 rounded-lg text-sm font-medium transition-colors border-2 ${
              isCollapsed 
                ? "justify-center border-[#b90000] bg-[#b90000] text-white hover:bg-[#740000] hover:border-[#740000]" 
                : "justify-center border-[#b90000] bg-[#b90000] text-white hover:bg-[#740000] hover:border-[#740000]"
            }`}
          >
            <LogOut className="w-4 h-4" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Tooltip for collapsed sidebar - Appears to the side of icons */}
      {isCollapsed && hoveredItem && (
        <div 
          className="fixed left-20 top-0 z-40 pointer-events-none"
          style={{ 
            marginTop: '1rem'
          }}
        >
          <div className="bg-[#1a0000] text-white text-sm font-medium px-3 py-2 rounded-lg shadow-lg ml-2">
            {hoveredItem}
            {/* Tooltip arrow pointing to the icon */}
            <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-[#1a0000]"></div>
          </div>
        </div>
      )}

      {/* Notifications Panel - Full page overlay */}
      <Notifications
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  )
}