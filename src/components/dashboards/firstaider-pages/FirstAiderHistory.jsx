// src/components/dashboards/firstaider-pages/FirstAiderHistory.jsx
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Sidebar } from "../../SideBar"
import { History, Filter, Download, Eye, Calendar } from "lucide-react"
import { apiClient } from "../../../utils/api"

export default function FirstAiderHistory() {
  const [incidents, setIncidents] = useState([])
  const [filter, setFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchIncidentHistory()
  }, [filter])

  const fetchIncidentHistory = async () => {
    try {
      const response = await apiClient.get('/emergencies/history/')
      let filteredData = response.data || []
      
      if (filter !== "all") {
        filteredData = filteredData.filter(incident => incident.status === filter)
      }
      
      setIncidents(filteredData)
    } catch (error) {
      console.error('Failed to fetch incident history:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 border-green-200"
      case "cancelled": return "bg-red-100 text-red-800 border-red-200"
      case "in_progress": return "bg-blue-100 text-blue-800 border-blue-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical": return "bg-red-100 text-red-800 border-red-200"
      case "high": return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low": return "bg-green-100 text-green-800 border-green-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fff3ea] via-[#fff3ea] to-[#ffe6c5]">
        <Sidebar />
        <main className="lg:ml-64">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-[#b90000] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#740000]">Loading history...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff3ea] via-[#fff3ea] to-[#ffe6c5]">
      <Sidebar />
      <main className="lg:ml-64 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1a0000] mb-2">Incident History</h1>
            <p className="text-[#740000]">Review your past emergency responses and assessments</p>
          </div>

          {/* Filters */}
          <div className="bg-white border border-[#ffe6c5] rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#740000]" />
                  <span className="text-sm font-medium text-[#1a0000]">Filter by:</span>
                </div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 bg-white border border-[#ffe6c5] rounded-lg text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                >
                  <option value="all">All Incidents</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="in_progress">In Progress</option>
                </select>
              </div>
              <button className="px-4 py-2 border border-[#740000] text-[#740000] hover:bg-[#ffe6c5] rounded-lg font-medium transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>

          {/* Incident List */}
          <div className="grid gap-6">
            {incidents.length === 0 ? (
              <div className="text-center py-12">
                <History className="w-16 h-16 text-[#740000]/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#1a0000] mb-2">No History Found</h3>
                <p className="text-[#740000] mb-6">
                  {filter === "all" 
                    ? "You haven't responded to any emergencies yet." 
                    : `No ${filter.replace('_', ' ')} incidents found.`
                  }
                </p>
                <Link
                  to="/dashboard/first-aider/assignments"
                  className="px-6 py-3 bg-[#b90000] hover:bg-[#740000] text-white rounded-lg font-medium transition-colors"
                >
                  View Active Assignments
                </Link>
              </div>
            ) : (
              incidents.map((incident) => (
                <div key={incident.id} className="bg-white border border-[#ffe6c5] rounded-lg p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-[#fff3ea] rounded-lg">
                        <History className="w-6 h-6 text-[#b90000]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[#1a0000] mb-1">
                          {incident.emergency_type?.replace(/_/g, ' ').toUpperCase() || 'EMERGENCY'}
                        </h3>
                        <p className="text-[#740000] mb-2">{incident.address || 'Location not specified'}</p>
                        <div className="flex items-center gap-4 text-sm text-[#740000]">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(incident.created_at).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span>{new Date(incident.created_at).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(incident.status)}`}>
                        {incident.status?.replace(/_/g, ' ').toUpperCase()}
                      </span>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(incident.priority)}`}>
                          {incident.priority?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {incident.description && (
                    <div className="mb-4 p-3 bg-[#fff3ea] rounded-lg">
                      <p className="text-[#1a0000] text-sm">{incident.description}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-[#ffe6c5]">
                    <div className="text-sm text-[#740000]">
                      Incident ID: {incident.alert_id || incident.id}
                    </div>
                    <div className="flex gap-3">
                      <button className="px-4 py-2 border border-[#740000] text-[#740000] hover:bg-[#ffe6c5] rounded-lg font-medium transition-colors flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      <button className="px-4 py-2 bg-[#1a0000] hover:bg-[#740000] text-white rounded-lg font-medium transition-colors">
                        Download Report
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Statistics */}
          {incidents.length > 0 && (
            <div className="mt-8 grid md:grid-cols-4 gap-4">
              <div className="bg-white border border-[#ffe6c5] rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-[#1a0000]">{incidents.length}</div>
                <div className="text-sm text-[#740000]">Total Incidents</div>
              </div>
              <div className="bg-white border border-[#ffe6c5] rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {incidents.filter(i => i.status === 'completed').length}
                </div>
                <div className="text-sm text-[#740000]">Completed</div>
              </div>
              <div className="bg-white border border-[#ffe6c5] rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-[#b90000]">
                  {incidents.filter(i => i.priority === 'high' || i.priority === 'critical').length}
                </div>
                <div className="text-sm text-[#740000]">High Priority</div>
              </div>
              <div className="bg-white border border-[#ffe6c5] rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-[#1a0000]">
                  {new Set(incidents.map(i => i.emergency_type)).size}
                </div>
                <div className="text-sm text-[#740000]">Emergency Types</div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}