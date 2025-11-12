
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Sidebar } from "../../SideBar"
import { User, Heart, AlertCircle, Stethoscope, MessageCircle } from "lucide-react"
import { apiClient } from "../../../utils/api"

export default function FirstAiderVictims() {
  const [victims, setVictims] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchVictims()
  }, [])

  const fetchVictims = async () => {
    try {
      const response = await apiClient.get('/emergencies/history/?limit=20')
      const history = response.data || []
      
      const formattedVictims = history.map(emergency => ({
        id: emergency.alert_id,
        name: emergency.user_name || "Unknown Victim",
        condition: emergency.emergency_type || "Emergency",
        status: emergency.priority === "high" ? "critical" : "stable",
        location: emergency.address || "Location not specified",
        timestamp: emergency.created_at,
        hasAssessment: Math.random() > 0.5
      }))
      
      setVictims(formattedVictims)
    } catch (error) {
      console.error('Failed to fetch victims:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "critical": return "bg-red-100 text-red-800 border-red-200"
      case "serious": return "bg-orange-100 text-orange-800 border-orange-200"
      case "stable": return "bg-green-100 text-green-800 border-green-200"
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
              <p className="text-[#740000]">Loading victim data...</p>
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
            <h1 className="text-3xl font-bold text-[#1a0000] mb-2">Victim Management</h1>
            <p className="text-[#740000]">Manage victim assessments and medical information</p>
          </div>

          <div className="grid gap-6">
            {victims.length === 0 ? (
              <div className="text-center py-12">
                <User className="w-16 h-16 text-[#740000]/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#1a0000] mb-2">No Victims Recorded</h3>
                <p className="text-[#740000] mb-6">Start by assessing victims from your emergency assignments.</p>
                <Link
                  to="/dashboard/first-aider/assignments"
                  className="px-6 py-3 bg-[#b90000] hover:bg-[#740000] text-white rounded-lg font-medium transition-colors"
                >
                  View Assignments
                </Link>
              </div>
            ) : (
              victims.map((victim) => (
                <div key={victim.id} className="bg-white border border-[#ffe6c5] rounded-lg p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-[#fff3ea] rounded-lg">
                        <User className="w-6 h-6 text-[#b90000]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[#1a0000] mb-1">{victim.name}</h3>
                        <p className="text-[#740000] mb-2">{victim.condition}</p>
                        <div className="flex items-center gap-4 text-sm text-[#740000]">
                          <span>{victim.location}</span>
                          <span>•</span>
                          <span>{new Date(victim.timestamp).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(victim.status)}`}>
                        {victim.status.toUpperCase()}
                      </span>
                      {victim.hasAssessment && (
                        <div className="mt-2 flex items-center gap-1 text-green-600 text-sm">
                          <Heart className="w-4 h-4" />
                          <span>Assessed</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#ffe6c5]">
                    <div className="text-sm text-[#740000]">
                      Last updated: {new Date(victim.timestamp).toLocaleTimeString()}
                    </div>
                    <div className="flex gap-3">
                      {!victim.hasAssessment && (
                        <button className="px-4 py-2 bg-[#b90000] hover:bg-[#740000] text-white rounded-lg font-medium transition-colors flex items-center gap-2">
                          <Stethoscope className="w-4 h-4" />
                          Assess Victim
                        </button>
                      )}
                      <button className="px-4 py-2 border border-[#740000] text-[#740000] hover:bg-[#ffe6c5] rounded-lg font-medium transition-colors flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Notify Hospital
                      </button>
                      <button className="px-4 py-2 border border-[#1a0000] text-[#1a0000] hover:bg-[#ffe6c5] rounded-lg font-medium transition-colors">
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