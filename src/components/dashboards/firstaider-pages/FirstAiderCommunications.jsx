// src/components/dashboards/firstaider-pages/FirstAiderCommunications.jsx
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Sidebar } from "../../SideBar"
import { MessageCircle, Building, User, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { apiClient } from "../../../utils/api"

export default function FirstAiderCommunications() {
  const [communications, setCommunications] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCommunications()
  }, [])

  const fetchCommunications = async () => {
    try {
      const response = await apiClient.get('/hospital-comms/api/communications/')
      setCommunications(response.data || [])
    } catch (error) {
      console.error('Failed to fetch communications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "sent": return "bg-blue-100 text-blue-800 border-blue-200"
      case "acknowledged": return "bg-green-100 text-green-800 border-green-200"
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled": return "bg-red-100 text-red-800 border-red-200"
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
              <p className="text-[#740000]">Loading communications...</p>
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
            <h1 className="text-3xl font-bold text-[#1a0000] mb-2">Hospital Communications</h1>
            <p className="text-[#740000]">Manage communications with hospitals about victims</p>
          </div>

          <div className="grid gap-6">
            {communications.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-[#740000]/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#1a0000] mb-2">No Communications</h3>
                <p className="text-[#740000] mb-6">You haven't sent any hospital communications yet.</p>
                <Link
                  to="/dashboard/first-aider/victims"
                  className="px-6 py-3 bg-[#b90000] hover:bg-[#740000] text-white rounded-lg font-medium transition-colors"
                >
                  Manage Victims
                </Link>
              </div>
            ) : (
              communications.map((communication) => (
                <div key={communication.id} className="bg-white border border-[#ffe6c5] rounded-lg p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-[#fff3ea] rounded-lg">
                        <MessageCircle className="w-6 h-6 text-[#b90000]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[#1a0000] mb-1">
                          {communication.victim_name || "Unknown Victim"}
                        </h3>
                        <div className="flex items-center gap-2 text-[#740000] mb-2">
                          <Building className="w-4 h-4" />
                          <span>{communication.hospital_name || "Hospital"}</span>
                        </div>
                        <p className="text-[#1a0000] mb-2">{communication.chief_complaint || "Emergency condition"}</p>
                        <div className="flex items-center gap-4 text-sm text-[#740000]">
                          <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {communication.victim_age ? `${communication.victim_age} years` : "Age not specified"}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            ETA: {communication.estimated_arrival_minutes || 15} min
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(communication.status)}`}>
                        {communication.status?.toUpperCase() || "PENDING"}
                      </span>
                      <div className="mt-2 text-sm text-[#740000]">
                        {new Date(communication.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#ffe6c5]">
                    <div className="flex items-center gap-4 text-sm text-[#740000]">
                      {communication.first_aid_provided && (
                        <span>First Aid: {communication.first_aid_provided}</span>
                      )}
                      {communication.required_specialties && (
                        <span>Specialties: {communication.required_specialties}</span>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <button className="px-4 py-2 border border-[#740000] text-[#740000] hover:bg-[#ffe6c5] rounded-lg font-medium transition-colors">
                        Update Status
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