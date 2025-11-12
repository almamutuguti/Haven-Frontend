// src/components/dashboards/firstaider-pages/FirstAiderAssignments.jsx
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Sidebar } from "../../SideBar"
import { MapPin, Navigation, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { apiClient } from "../../../utils/api"

export default function FirstAiderAssignments() {
  const [assignments, setAssignments] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAssignments()
  }, [])

  const fetchAssignments = async () => {
    try {
      const response = await apiClient.get('/emergencies/active/')
      setAssignments(response.data || [])
    } catch (error) {
      console.error('Failed to fetch assignments:', error)
    } finally {
      setIsLoading(false)
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
              <p className="text-[#740000]">Loading assignments...</p>
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
            <h1 className="text-3xl font-bold text-[#1a0000] mb-2">Emergency Assignments</h1>
            <p className="text-[#740000]">Manage your current and upcoming emergency calls</p>
          </div>

          <div className="grid gap-6">
            {assignments.length === 0 ? (
              <div className="text-center py-12">
                <AlertCircle className="w-16 h-16 text-[#740000]/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#1a0000] mb-2">No Active Assignments</h3>
                <p className="text-[#740000] mb-6">You don't have any active emergency assignments at the moment.</p>
                <Link
                  to="/dashboard/first-aider"
                  className="px-6 py-3 bg-[#b90000] hover:bg-[#740000] text-white rounded-lg font-medium transition-colors"
                >
                  Return to Dashboard
                </Link>
              </div>
            ) : (
              assignments.map((assignment) => (
                <div key={assignment.id} className="bg-white border border-[#ffe6c5] rounded-lg p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-[#fff3ea] rounded-lg">
                        <AlertCircle className="w-6 h-6 text-[#b90000]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[#1a0000] mb-1">
                          {assignment.emergency_type?.replace(/_/g, ' ').toUpperCase() || 'EMERGENCY'}
                        </h3>
                        <div className="flex items-center gap-2 text-[#740000] mb-2">
                          <MapPin className="w-4 h-4" />
                          <span>{assignment.address || 'Location not specified'}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Reported {new Date(assignment.created_at).toLocaleTimeString()}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(assignment.priority)}`}>
                            {assignment.priority?.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-[#740000]">Distance</span>
                      <p className="text-lg font-semibold text-[#1a0000]">1.2 km</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#ffe6c5]">
                    <div className="flex items-center gap-2 text-sm text-[#740000]">
                      <Navigation className="w-4 h-4" />
                      <span>ETA: 8-12 minutes</span>
                    </div>
                    <div className="flex gap-3">
                      <button className="px-4 py-2 bg-[#b90000] hover:bg-[#740000] text-white rounded-lg font-medium transition-colors">
                        Accept Assignment
                      </button>
                      <button className="px-4 py-2 border border-[#740000] text-[#740000] hover:bg-[#ffe6c5] rounded-lg font-medium transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}