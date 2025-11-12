// Sidebar.jsx - Unified version with role-based navigation
"use client"
import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { 
  Menu, X, LogOut, Home, Users, BarChart3, AlertCircle, 
  FileText, Settings, ChevronDown, Activity, MapPin, Shield, 
  Bell, Stethoscope, User, History, Ambulance, Heart, Radio
} from "lucide-react"
import { useAuth } from "./context/AuthContext"
import { apiClient } from "../utils/api"

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const notificationsRef = useRef(null)

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Fetch notifications based on user role
  const fetchNotifications = async () => {
    try {
      const response = await apiClient.get('/notifications/api/notifications/')
      const allNotifications = response.data || []
      
      // Filter notifications based on user role
      let filteredNotifications = []
      
      switch (user?.role) {
        case "hospital_staff":
          filteredNotifications = allNotifications.filter(notification => 
            notification.notification_type === 'hospital_assignment' ||
            notification.notification_type === 'patient_arrived' ||
            notification.notification_type === 'hospital_ready' ||
            notification.notification_type === 'system_alert'
          )
          break
        case "first_aider":
          filteredNotifications = allNotifications.filter(notification => 
            notification.notification_type === 'first_aider_dispatch' ||
            notification.notification_type === 'emergency_alert' ||
            notification.notification_type === 'eta_update' ||
            notification.notification_type === 'system_alert' ||
            notification.notification_type === 'hospital_communication'
          )
          break
        case "admin":
          filteredNotifications = allNotifications.filter(notification => 
            notification.notification_type === 'system_alert' ||
            notification.notification_type === 'emergency_alert'
          )
          break
        default:
          filteredNotifications = allNotifications
      }
      
      setNotifications(filteredNotifications)
      setUnreadCount(filteredNotifications.filter(n => !n.read_at)?.length || 0)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
    }
  }

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await apiClient.post(`/notifications/api/notifications/${notificationId}/mark_as_read/`)
      fetchNotifications()
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await apiClient.post('/notifications/api/mark-all-read/')
      fetchNotifications()
    } catch (error) {
      console.error('Failed to mark all as read:', error)
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
          { icon: Users, label: "Victims", href: "/dashboard/first-aider/victims" },
          { icon: Radio, label: "Communications", href: "/dashboard/first-aider/communications" },
          { icon: Heart, label: "Guidance", href: "/dashboard/first-aider/guidance" },
          { icon: History, label: "History", href: "/dashboard/first-aider/history" },
          { icon: Settings, label: "Settings", href: "/dashboard/first-aider/settings" },
        ]
      case "admin":
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

  // Get notification icon based on type
  const getNotificationIcon = (notificationType) => {
    switch (notificationType) {
      case 'hospital_assignment':
      case 'hospital_ready':
        return Stethoscope
      case 'first_aider_dispatch':
      case 'emergency_alert':
        return AlertCircle
      case 'patient_arrived':
        return User
      case 'eta_update':
        return Activity
      case 'hospital_communication':
        return Radio
      case 'system_alert':
        return Shield
      default:
        return Bell
    }
  }

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
      case "admin":
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
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#b90000] text-white rounded-lg"
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

      <aside
        className={`fixed left-0 top-0 h-screen bg-[#fff3ea] border-r border-[#ffe6c5] transition-all duration-300 z-50 ${
          isCollapsed ? "w-20" : "w-64"
        } ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="h-16 border-b border-[#ffe6c5] flex items-center justify-between px-4">
          {!isCollapsed && <span className="text-lg font-bold text-[#b90000]">Haven</span>}
          <div className="flex items-center gap-2">
            {/* Notifications Bell */}
            <div className="relative" ref={notificationsRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-[#ffe6c5] rounded-lg transition relative"
              >
                <Bell className="w-5 h-5 text-[#1a0000]" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#b90000] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 bg-white border border-[#ffe6c5] rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-[#ffe6c5] flex justify-between items-center">
                    <h3 className="font-semibold text-[#1a0000]">Notifications</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllAsRead}
                        className="text-sm text-[#b90000] hover:text-[#740000]"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  
                  <div className="p-2">
                    {notifications.length === 0 ? (
                      <div className="text-center py-4 text-[#740000] text-sm">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notification) => {
                        const NotificationIcon = getNotificationIcon(notification.notification_type)
                        return (
                          <div
                            key={notification.id}
                            className={`p-3 border-b border-[#ffe6c5] hover:bg-[#fff3ea] cursor-pointer ${
                              !notification.read_at ? 'bg-[#ffe6c5]' : ''
                            }`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex items-start gap-3">
                              <NotificationIcon className="w-4 h-4 text-[#b90000] mt-1 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-[#1a0000] text-sm">
                                  {notification.title}
                                </h4>
                                <p className="text-[#740000] text-xs mt-1">
                                  {notification.message}
                                </p>
                                <div className="flex items-center justify-between mt-2">
                                  <span className="text-xs text-[#740000]">
                                    {new Date(notification.created_at).toLocaleTimeString()}
                                  </span>
                                  {!notification.read_at && (
                                    <span className="w-2 h-2 bg-[#b90000] rounded-full"></span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={() => setIsCollapsed(!isCollapsed)} 
              className="p-1 hover:bg-[#ffe6c5] rounded-lg transition hidden lg:block"
            >
              <ChevronDown
                className={`w-5 h-5 text-[#1a0000] transition-transform ${isCollapsed ? "rotate-90" : "-rotate-90"}`}
              />
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

        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href

            return (
              <div key={item.href} className="relative group">
                <button
                  onClick={() => {
                    navigate(item.href)
                    setIsMobileOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                    isActive 
                      ? "bg-[#b90000] text-[#fff3ea]" 
                      : "text-[#1a0000] hover:bg-[#ffe6c5]"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                </button>
                
                {/* Tooltip for collapsed sidebar */}
                {isCollapsed && (
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-[#1a0000] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                    {item.label}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <div className="border-t border-[#ffe6c5] p-4 space-y-4">
          {!isCollapsed && (
            <div className="px-2">
              <p className="text-xs font-semibold text-[#740000] uppercase">Logged in as</p>
              <p className="text-sm font-medium text-[#1a0000] truncate">{userInfo.email}</p>
              <p className="text-xs text-[#740000]">{userInfo.role}</p>
              {userInfo.additionalInfo && (
                <p className="text-xs text-[#740000] truncate">{userInfo.additionalInfo}</p>
              )}
            </div>
          )}
          
          <div className="relative group">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center justify-center gap-2 px-3 py-2 border border-[#b90000] text-[#b90000] hover:bg-[#ffe6c5] rounded-lg text-sm font-medium transition-colors ${
                isCollapsed ? "px-2" : ""
              }`}
            >
              <LogOut className="w-4 h-4" />
              {!isCollapsed && <span>Logout</span>}
            </button>
            
            {/* Tooltip for collapsed sidebar */}
            {isCollapsed && (
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-[#1a0000] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
                Logout
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}