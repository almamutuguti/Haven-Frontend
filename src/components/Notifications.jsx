import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Bell, X, AlertCircle, Stethoscope, User, Activity, Radio, Shield, Ambulance, Heart, Search, ExternalLink } from "lucide-react"
import { apiClient } from "../utils/api"
import { useAuth } from "./context/AuthContext"

const Notifications = ({ isOpen, onClose }) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [filteredNotifications, setFilteredNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Navigation handlers
  const getNavigationHandler = (notification) => {
    const baseHandlers = {
      hospital_assignment: () => navigate('/dashboard/hospital-staff/patients'),
      patient_arrived: () => navigate('/dashboard/hospital-staff/patients'),
      hospital_ready: () => navigate('/dashboard/hospital-staff'),
      first_aider_dispatch: () => navigate('/dashboard/first-aider/assignments'),
      emergency_alert: () => navigate('/dashboard/first-aider/assignments'),
      eta_update: () => navigate('/dashboard/first-aider/assignments'),
      hospital_communication: () => navigate('/dashboard/first-aider/communications'),
      medical_guidance: () => navigate('/dashboard/first-aider/guidance'),
      system_alert: () => navigate('/dashboard/admin/system-health'),
      user_activity: () => navigate('/dashboard/admin/users'),
      ambulance_dispatch: () => {
        if (user?.role === 'first_aider') navigate('/dashboard/first-aider/assignments')
        else if (user?.role === 'hospital_staff') navigate('/dashboard/hospital-staff/patients')
      }
    }

    return baseHandlers[notification.notification_type] || (() => {
      switch (user?.role) {
        case 'hospital_staff': return navigate('/dashboard/hospital-staff')
        case 'first_aider': return navigate('/dashboard/first-aider')
        case 'system_admin': return navigate('/dashboard/admin')
        default: return navigate('/dashboard')
      }
    })
  }

  // Filter options based on user role
  const getFilterOptions = () => {
    const baseFilters = [
      { key: 'all', label: 'All' },
      { key: 'unread', label: 'Unread' },
      { key: 'read', label: 'Read' }
    ]

    const roleBasedFilters = {
      hospital_staff: [
        { key: 'hospital_assignment', label: 'Assignments' },
        { key: 'patient_arrived', label: 'Patients' },
        { key: 'system_alert', label: 'System' }
      ],
      first_aider: [
        { key: 'first_aider_dispatch', label: 'Dispatch' },
        { key: 'emergency_alert', label: 'Emergency' },
        { key: 'eta_update', label: 'ETA' },
        { key: 'hospital_communication', label: 'Comms' }
      ],
      system_admin: [
        { key: 'system_alert', label: 'System' },
        { key: 'emergency_alert', label: 'Emergency' },
        { key: 'user_activity', label: 'Users' }
      ]
    }

    return [...baseFilters, ...(roleBasedFilters[user?.role] || [])]
  }

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user) return
    
    try {
      setIsLoading(true)
      const response = await apiClient.get('/api/notifications/notifications/')
      const allNotifications = response.results || response.data || []
      
      let roleFilteredNotifications = []
      
      switch (user.role) {
        case "hospital_staff":
          roleFilteredNotifications = allNotifications.filter(notification => 
            ['hospital_assignment', 'patient_arrived', 'hospital_ready', 'system_alert'].includes(notification.notification_type)
          )
          break
        case "first_aider":
          roleFilteredNotifications = allNotifications.filter(notification => 
            ['first_aider_dispatch', 'emergency_alert', 'eta_update', 'system_alert', 'hospital_communication', 'medical_guidance'].includes(notification.notification_type)
          )
          break
        case "system_admin":
          roleFilteredNotifications = allNotifications.filter(notification => 
            ['system_alert', 'emergency_alert', 'user_activity'].includes(notification.notification_type)
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

  // Handle notification click
  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.read_at) {
        await apiClient.post(`/api/notifications/notifications/${notification.id}/mark-read/`)
        setNotifications(prev => prev.map(n => 
          n.id === notification.id ? { ...n, read_at: new Date().toISOString() } : n
        ))
      }
      const navigateTo = getNavigationHandler(notification)
      navigateTo()
      onClose()
    } catch (error) {
      console.error('Failed to handle notification:', error)
    }
  }

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await apiClient.post('/api/notifications/mark-all-read/')
      setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }

  // Apply filters and search
  useEffect(() => {
    let filtered = notifications

    if (activeFilter !== 'all') {
      if (activeFilter === 'unread') {
        filtered = filtered.filter(n => !n.read_at)
      } else if (activeFilter === 'read') {
        filtered = filtered.filter(n => n.read_at)
      } else {
        filtered = filtered.filter(n => n.notification_type === activeFilter)
      }
    }

    if (searchTerm) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredNotifications(filtered)
  }, [notifications, activeFilter, searchTerm])

  // Fetch notifications when component opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications()
    }
  }, [isOpen, user])

  const getNotificationIcon = (notificationType) => {
    const icons = {
      hospital_assignment: Stethoscope,
      hospital_ready: Stethoscope,
      first_aider_dispatch: AlertCircle,
      emergency_alert: AlertCircle,
      patient_arrived: User,
      eta_update: Activity,
      hospital_communication: Radio,
      system_alert: Shield,
      ambulance_dispatch: Ambulance,
      medical_guidance: Heart,
      user_activity: User
    }
    return icons[notificationType] || Bell
  }

  const getPriorityColor = (priority) => {
    const colors = {
      'critical': 'bg-red-100 text-red-800 border-red-200',
      'high': 'bg-orange-100 text-orange-800 border-orange-200',
      'medium': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'low': 'bg-green-100 text-green-800 border-green-200'
    }
    return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getRoleDisplayName = () => {
    const roles = {
      'hospital_staff': 'Hospital Staff',
      'first_aider': 'First Aider',
      'system_admin': 'Administrator'
    }
    return roles[user?.role] || 'User'
  }

  const getActionLabel = (notificationType) => {
    const labels = {
      hospital_assignment: 'View Patients',
      patient_arrived: 'View Patient',
      hospital_ready: 'Go to Dashboard',
      first_aider_dispatch: 'View Assignments',
      emergency_alert: 'View Emergency',
      eta_update: 'View Details',
      hospital_communication: 'View Comms',
      medical_guidance: 'View Guidance',
      system_alert: 'View System',
      user_activity: 'View Users'
    }
    return labels[notificationType] || 'View Details'
  }

  const formatTime = (timestamp) => {
    const now = new Date()
    const notificationTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return notificationTime.toLocaleDateString()
  }

  const filterOptions = getFilterOptions()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* Header */}
      <div className="bg-[#fff3ea] border-b border-[#ffe6c5] p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Bell className="w-8 h-8 text-[#b90000]" />
            <div>
              <h1 className="text-2xl font-bold text-[#1a0000]">Notifications</h1>
              <p className="text-[#740000]">
                {getRoleDisplayName()} • {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#ffe6c5] rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-[#1a0000]" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          {filterOptions.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === filter.key
                  ? 'bg-[#b90000] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Actions Bar */}
      <div className="border-b border-gray-200 p-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <span className="text-base text-gray-600">
            {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
          </span>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-base text-[#b90000] hover:text-[#740000] font-medium px-4 py-2 rounded-lg hover:bg-[#ffe6c5] transition-colors"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="h-[calc(100vh-200px)] overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#b90000]"></div>
            <p className="text-gray-500 text-lg mt-4">Loading notifications...</p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <Bell className="w-24 h-24 text-gray-300 mb-6" />
            <h3 className="text-xl font-semibold text-gray-600 mb-3">
              {searchTerm || activeFilter !== 'all' ? 'No matching notifications' : 'No notifications'}
            </h3>
            <p className="text-gray-500 text-base">
              {searchTerm || activeFilter !== 'all' 
                ? 'Try changing your search or filter criteria'
                : 'You\'re all caught up! New notifications will appear here.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => {
              const NotificationIcon = getNotificationIcon(notification.notification_type)
              const isUnread = !notification.read_at
              const actionLabel = getActionLabel(notification.notification_type)
              
              return (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
                    isUnread ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      isUnread ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <NotificationIcon className={`w-6 h-6 ${
                        isUnread ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h4 className={`font-semibold text-lg ${
                          isUnread ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h4>
                        <span className={`text-sm font-medium px-3 py-1 rounded-full border ${getPriorityColor(notification.priority)}`}>
                          {notification.priority}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-base mb-3">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-500 capitalize">
                            {notification.notification_type.replace(/_/g, ' ')}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatTime(notification.created_at)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          {isUnread && (
                            <span className="text-sm text-blue-600 font-medium">Unread</span>
                          )}
                          <button className="flex items-center gap-2 text-sm text-[#b90000] hover:text-[#740000] font-medium">
                            <ExternalLink className="w-4 h-4" />
                            {actionLabel}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications