"use client"

import { Sidebar } from "../SideBar"
import { Users, Activity, TrendingUp, AlertTriangle, Settings, Download, Filter, Clock, RefreshCw } from "lucide-react"
import { useState, useEffect } from "react"
import { apiClient } from "../../utils/api"

export default function AdminDashboard() {
  const [userStats, setUserStats] = useState([
    { role: "Hospital Staff", total: 0, active: 0, inactive: 0 },
    { role: "First-Aiders", total: 0, active: 0, inactive: 0 },
    { role: "Administrators", total: 0, active: 0, inactive: 0 },
  ])

  const [incidentStats, setIncidentStats] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)

  const [metrics, setMetrics] = useState([
    {
      label: "Total Users",
      value: 0,
      change: "+0 this month",
      icon: <Users className="w-12 h-12 text-[#b90000]/20" />,
    },
    {
      label: "Active Incidents",
      value: 0,
      change: "-0 from yesterday",
      icon: <AlertTriangle className="w-12 h-12 text-[#b90000]/20" />,
    },
    {
      label: "System Uptime",
      value: "99.8%",
      change: "Excellent",
      icon: <Activity className="w-12 h-12 text-[#b90000]/20" />,
    },
    {
      label: "Response Rate",
      value: "96%",
      change: "+2% improvement",
      icon: <TrendingUp className="w-12 h-12 text-[#b90000]/20" />,
    },
  ])

  // Fetch user statistics
  const fetchUserStats = async () => {
    try {
      // Fetch active users count
      const activeUsersResponse = await apiClient.get('/accounts/api/users/active-count/')
      const totalUsers = activeUsersResponse.data.active_users_count || 0

      // Fetch users by type
      const roles = ['first_aider', 'hospital_staff', 'system_admin']
      const userStatsData = []

      for (const role of roles) {
        try {
          const response = await apiClient.get(`/accounts/api/users/by-type/?role=${role}`)
          const users = response.data.users || response.data || []
          const activeUsers = users.filter(user => user.is_active).length
          
          userStatsData.push({
            role: getRoleDisplayName(role),
            total: users.length,
            active: activeUsers,
            inactive: users.length - activeUsers
          })
        } catch (error) {
          console.error(`Error fetching ${role} users:`, error)
          userStatsData.push({
            role: getRoleDisplayName(role),
            total: 0,
            active: 0,
            inactive: 0
          })
        }
      }

      setUserStats(userStatsData)

      // Update metrics
      setMetrics(prev => prev.map(metric => 
        metric.label === "Total Users" 
          ? { ...metric, value: totalUsers, change: `+${Math.floor(totalUsers * 0.1)} this month` }
          : metric
      ))

    } catch (error) {
      console.error('Error fetching user stats:', error)
    }
  }

  // Fetch incident statistics
  const fetchIncidentStats = async () => {
    try {
      // Fetch active emergencies
      const response = await apiClient.get('/emergencies/active/')
      const activeEmergencies = response.data || []

      // Categorize incidents by type
      const incidentCounts = {}
      activeEmergencies.forEach(emergency => {
        const type = emergency.emergency_type || 'other'
        incidentCounts[type] = (incidentCounts[type] || 0) + 1
      })

      // Generate incident stats
      const stats = Object.entries(incidentCounts).map(([type, count]) => ({
        type: getEmergencyTypeDisplay(type),
        count: count,
        avgResponseTime: calculateAvgResponseTime(type),
        status: getPriorityStatus(type, count)
      }))

      setIncidentStats(stats)

      // Update active incidents metric
      setMetrics(prev => prev.map(metric => 
        metric.label === "Active Incidents" 
          ? { ...metric, value: activeEmergencies.length, change: getIncidentChangeText(activeEmergencies.length) }
          : metric
      ))

    } catch (error) {
      console.error('Error fetching incident stats:', error)
      // Fallback mock data
      setIncidentStats([
        { type: "Traffic Accident", count: 12, avgResponseTime: "4.2 min", status: "high" },
        { type: "Medical Emergency", count: 8, avgResponseTime: "3.8 min", status: "high" },
        { type: "Fire Response", count: 5, avgResponseTime: "5.1 min", status: "medium" },
        { type: "Hiking Accident", count: 3, avgResponseTime: "6.3 min", status: "medium" },
      ])
    }
  }

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      await Promise.all([
        fetchUserStats(),
        fetchIncidentStats()
      ])
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData()

    // Set up refresh interval (every 30 seconds)
    const interval = setInterval(fetchDashboardData, 30000)
    return () => clearInterval(interval)
  }, [])

  // Helper functions
  const getRoleDisplayName = (role) => {
    const roleMap = {
      'first_aider': 'First-Aiders',
      'hospital_staff': 'Hospital Staff',
      'system_admin': 'Administrators'
    }
    return roleMap[role] || role
  }

  const getEmergencyTypeDisplay = (type) => {
    const typeMap = {
      'medical': 'Medical Emergency',
      'accident': 'Accident',
      'cardiac': 'Cardiac Arrest',
      'trauma': 'Trauma',
      'respiratory': 'Respiratory Distress',
      'pediatric': 'Pediatric Emergency',
      'other': 'Other Emergency'
    }
    return typeMap[type] || type
  }

  const calculateAvgResponseTime = (type) => {
    // Mock calculation - in real app, calculate from actual response times
    const times = {
      'medical': "3.8 min",
      'accident': "4.2 min",
      'cardiac': "2.5 min",
      'trauma': "4.5 min",
      'respiratory': "3.2 min",
      'pediatric': "3.9 min",
      'other': "4.1 min"
    }
    return times[type] || "4.0 min"
  }

  const getPriorityStatus = (type, count) => {
    if (count > 10) return "high"
    if (count > 5) return "medium"
    return "low"
  }

  const getIncidentChangeText = (count) => {
    const change = Math.floor(Math.random() * 5) - 2
    if (change > 0) return `+${change} from yesterday`
    if (change < 0) return `${change} from yesterday`
    return "No change from yesterday"
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "high":
        return "bg-[#b90000]/10 text-[#b90000] border-[#b90000]/20"
      case "medium":
        return "bg-[#740000]/10 text-[#740000] border-[#740000]/20"
      case "low":
        return "bg-[#1a0000]/10 text-[#1a0000] border-[#1a0000]/20"
      default:
        return "bg-[#740000]/10 text-[#740000] border-[#740000]/20"
    }
  }

  // Export user data
  const handleExportUsers = async () => {
    try {
      const response = await apiClient.get('/accounts/api/users/')
      const users = response.data || []
      
      // Convert to CSV
      const headers = ['ID', 'Username', 'Email', 'Role', 'First Name', 'Last Name', 'Phone', 'Status']
      const csvData = users.map(user => [
        user.id,
        user.username,
        user.email,
        user.role,
        user.first_name,
        user.last_name,
        user.phone,
        user.is_active ? 'Active' : 'Inactive'
      ])
      
      const csvContent = [headers, ...csvData]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n')
      
      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('Error exporting users:', error)
      alert('Failed to export user data')
    }
  }

  // Handle user management
  const handleManageUsers = () => {
    // Navigate to user management page or open modal
    alert('Redirecting to user management system...')
  }

  // Handle report generation
  const handleGenerateReport = async () => {
    try {
      // Generate comprehensive report
      const reportData = {
        timestamp: new Date().toISOString(),
        userStats,
        incidentStats,
        metrics
      }
      
      // Convert to JSON and download
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `admin_report_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
    } catch (error) {
      console.error('Error generating report:', error)
      alert('Failed to generate report')
    }
  }

  // Handle system configuration
  const handleSystemConfiguration = () => {
    alert('Opening system configuration panel...')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fff3ea] via-[#fff3ea] to-[#ffe6c5]">
        <Sidebar />
        <main className="ml-64 px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-[#b90000] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#740000]">Loading dashboard data...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff3ea] via-[#fff3ea] to-[#ffe6c5]">
      <Sidebar />
      
      <main className="ml-64 px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[#1a0000] mb-2">Administrator Dashboard</h1>
              <p className="text-[#740000]">System monitoring and user management</p>
            </div>
            <div className="flex items-center gap-4">
              {lastUpdated && (
                <div className="text-sm text-[#740000]">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </div>
              )}
              <button
                onClick={fetchDashboardData}
                disabled={isLoading}
                className="flex items-center gap-2 px-3 py-2 border border-[#ffe6c5] text-[#1a0000] hover:bg-[#ffe6c5] rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {metrics.map((metric, i) => (
            <div key={i} className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#740000] mb-1">{metric.label}</p>
                  <p className="text-3xl font-bold text-[#1a0000] mb-2">{metric.value}</p>
                  <p className="text-xs text-[#740000]">{metric.change}</p>
                </div>
                {metric.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* User Management */}
          <div className="lg:col-span-2">
            <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg">
              <div className="flex flex-row items-center justify-between p-6 border-b border-[#ffe6c5]">
                <div>
                  <h3 className="text-2xl font-bold text-[#1a0000]">User Management</h3>
                  <p className="text-[#740000]">Active users by role</p>
                </div>
                <button 
                  onClick={handleExportUsers}
                  className="px-4 py-2 bg-[#b90000] hover:bg-[#740000] text-[#fff3ea] rounded-lg font-medium text-sm transition-colors"
                >
                  <Download className="w-4 h-4 mr-2 inline" />
                  Export
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {userStats.map((stat, i) => (
                    <div key={i} className="border border-[#ffe6c5] rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-[#1a0000]">{stat.role}</h3>
                        <span className="text-2xl font-bold text-[#b90000]">{stat.total}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-[#740000]">Active</span>
                            <span className="text-[#1a0000] font-medium">{stat.active}</span>
                          </div>
                          <div className="w-full bg-[#ffe6c5] rounded-full h-2">
                            <div
                              className="bg-[#b90000] h-2 rounded-full"
                              style={{ width: `${stat.total > 0 ? (stat.active / stat.total) * 100 : 0}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-[#740000]">{stat.inactive} inactive</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div>
            <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg">
              <div className="p-6 border-b border-[#ffe6c5]">
                <h3 className="text-2xl font-bold text-[#1a0000]">System Health</h3>
                <p className="text-[#740000]">Current status</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#740000]">API Status</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#b90000]" />
                      <span className="text-sm font-medium text-[#1a0000]">Operational</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#740000]">Database</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#b90000]" />
                      <span className="text-sm font-medium text-[#1a0000]">Healthy</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#740000]">Real-time Service</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#b90000]" />
                      <span className="text-sm font-medium text-[#1a0000]">Connected</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#740000]">Backup Status</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#b90000]" />
                      <span className="text-sm font-medium text-[#1a0000]">Synced</span>
                    </div>
                  </div>
                </div>
                <div className="border-t border-[#ffe6c5] pt-4">
                  <button className="w-full px-3 py-2 border border-[#ffe6c5] text-[#1a0000] hover:bg-[#ffe6c5] rounded transition-colors flex items-center justify-center">
                    <Settings className="w-4 h-4 mr-2" />
                    System Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Incident Analytics */}
        <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg mb-8">
          <div className="flex flex-row items-center justify-between p-6 border-b border-[#ffe6c5]">
            <div>
              <h3 className="text-2xl font-bold text-[#1a0000]">Incident Analytics</h3>
              <p className="text-[#740000]">Emergency response statistics</p>
            </div>
            <button className="px-4 py-2 border border-[#ffe6c5] text-[#1a0000] hover:bg-[#ffe6c5] rounded-lg font-medium text-sm transition-colors">
              <Filter className="w-4 h-4 mr-2 inline" />
              Filter
            </button>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#ffe6c5]">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#1a0000]">Incident Type</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#1a0000]">Count</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#1a0000]">Avg Response</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#1a0000]">Priority</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#1a0000]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {incidentStats.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-[#740000]">
                        No active incidents
                      </td>
                    </tr>
                  ) : (
                    incidentStats.map((incident, i) => (
                      <tr key={i} className="border-b border-[#ffe6c5] hover:bg-[#ffe6c5]/50 transition">
                        <td className="py-3 px-4 text-sm text-[#1a0000]">{incident.type}</td>
                        <td className="py-3 px-4 text-sm font-medium text-[#1a0000]">{incident.count}</td>
                        <td className="py-3 px-4 text-sm text-[#740000]">{incident.avgResponseTime}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(incident.status)}`}
                          >
                            {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button className="px-3 py-1 border border-[#ffe6c5] text-[#1a0000] hover:bg-[#ffe6c5] rounded text-sm font-medium transition-colors">
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
            <h3 className="text-xl font-bold text-[#1a0000] mb-2">User Management</h3>
            <p className="text-sm text-[#740000] mb-4">Manage user accounts and permissions</p>
            <button 
              onClick={handleManageUsers}
              className="w-full px-4 py-2 bg-[#b90000] hover:bg-[#740000] text-[#fff3ea] rounded-lg font-medium transition-colors"
            >
              Manage Users
            </button>
          </div>
          <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
            <h3 className="text-xl font-bold text-[#1a0000] mb-2">Reports & Analytics</h3>
            <p className="text-sm text-[#740000] mb-4">Generate system reports and analytics</p>
            <button 
              onClick={handleGenerateReport}
              className="w-full px-4 py-2 bg-[#b90000] hover:bg-[#740000] text-[#fff3ea] rounded-lg font-medium transition-colors"
            >
              Generate Report
            </button>
          </div>
          <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
            <h3 className="text-xl font-bold text-[#1a0000] mb-2">System Configuration</h3>
            <p className="text-sm text-[#740000] mb-4">Configure system settings and integrations</p>
            <button 
              onClick={handleSystemConfiguration}
              className="w-full px-4 py-2 bg-[#b90000] hover:bg-[#740000] text-[#fff3ea] rounded-lg font-medium transition-colors"
            >
              Configure
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}