"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Sidebar } from "../SideBar"
import { 
  Heart, Phone, AlertCircle, MapPin, Navigation, Radio, Clock, 
  Plus, CheckCircle, AlertTriangle, X, Send, Compass 
} from "lucide-react"

export default function FirstAiderDashboard() {
  const [assignments, setAssignments] = useState([
    {
      id: "1",
      location: "Main Street & 5th Ave",
      type: "Traffic Accident",
      priority: "high",
      status: "in-progress",
      distance: "3.2 km",
      eta: "8 mins",
    },
    {
      id: "2",
      location: "Central Park West",
      type: "Fall Injury",
      priority: "medium",
      status: "pending",
      distance: "4.5 km",
      eta: "12 mins",
    },
  ])

  const [victims, setVictims] = useState([
    {
      id: "1",
      name: "John Doe",
      condition: "Trauma - Multiple injuries",
      vitals: { heartRate: 92, bloodPressure: "120/80", temperature: 37.2 },
      location: "Main Street & 5th Ave",
      status: "critical",
    },
  ])

  const [showEmergencyForm, setShowEmergencyForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState("")
  const [formSuccess, setFormSuccess] = useState("")
  
  const [emergencyData, setEmergencyData] = useState({
    emergency_type: "medical",
    latitude: "",
    longitude: "",
    description: "",
    address: "",
    location_id: ""
  })

  const navigate = useNavigate()

  const getPriorityColor = (priority) => {
    switch (priority) {
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <AlertTriangle className="w-5 h-5 text-[#740000]" />
      case "in-progress":
        return <Navigation className="w-5 h-5 text-[#b90000]" />
      case "completed":
        return <CheckCircle className="w-5 h-5 text-[#1a0000]" />
      default:
        return <AlertCircle className="w-5 h-5 text-[#740000]" />
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEmergencyData(prev => ({
      ...prev,
      [name]: value
    }))
    setFormError("")
    setFormSuccess("")
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setEmergencyData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }))
        },
        (error) => {
          setFormError("Failed to get current location. Please enter coordinates manually." + error)
        }
      )
    } else {
      setFormError("Geolocation is not supported by this browser.")
    }
  }

  const handleSubmitEmergency = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormError("")
    setFormSuccess("")

    try {
      // Validate required fields
      if (!emergencyData.latitude || !emergencyData.longitude) {
        throw new Error("Latitude and longitude are required")
      }

      // Prepare data for API
      const submitData = {
        emergency_type: emergencyData.emergency_type,
        latitude: parseFloat(emergencyData.latitude),
        longitude: parseFloat(emergencyData.longitude),
        description: emergencyData.description,
        address: emergencyData.address,
        ...(emergencyData.location_id && { location_id: parseInt(emergencyData.location_id) })
      }

      // Make API call to your backend
      const response = await fetch('/emergency/alert/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(submitData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit emergency alert')
      }

      const result = await response.json()
      
      setFormSuccess("Emergency alert submitted successfully! Redirecting to dashboard...")
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        setShowEmergencyForm(false)
        navigate('/dashboard/first-aider')
      }, 2000)

    } catch (error) {
      setFormError(error.message || "An error occurred while submitting the emergency alert")
    } finally {
      setIsSubmitting(false)
    }
  }

  const emergencyTypes = [
    { value: "medical", label: "Medical Emergency" },
    { value: "traffic", label: "Traffic Accident" },
    { value: "fire", label: "Fire Emergency" },
    { value: "natural", label: "Natural Disaster" },
    { value: "crime", label: "Crime in Progress" },
    { value: "other", label: "Other Emergency" }
  ]

  return (
    <div className="min-h-screen bg-linear-to-br from-[#fff3ea] via-[#fff3ea] to-[#ffe6c5]">
      <Sidebar />
      
      <main className="ml-64 px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1a0000] mb-2">First-Aider Dashboard</h1>
          <p className="text-[#740000]">Manage emergency assignments and victim care</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#740000] mb-1">Active Assignments</p>
                <p className="text-3xl font-bold text-[#1a0000]">
                  {assignments.filter((a) => a.status !== "completed").length}
                </p>
              </div>
              <Radio className="w-12 h-12 text-[#b90000]/20" />
            </div>
          </div>
          <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#740000] mb-1">High Priority</p>
                <p className="text-3xl font-bold text-[#b90000]">
                  {assignments.filter((a) => a.priority === "high").length}
                </p>
              </div>
              <AlertCircle className="w-12 h-12 text-[#b90000]/20" />
            </div>
          </div>
          <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#740000] mb-1">Victims Assisted</p>
                <p className="text-3xl font-bold text-[#1a0000]">{victims.length}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-[#b90000]/20" />
            </div>
          </div>
          <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#740000] mb-1">Avg Response</p>
                <p className="text-3xl font-bold text-[#1a0000]">6.5 min</p>
              </div>
              <Clock className="w-12 h-12 text-[#740000]/20" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Assignments Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg">
              <div className="flex flex-row items-center justify-between p-6 border-b border-[#ffe6c5]">
                <div>
                  <h3 className="text-2xl font-bold text-[#1a0000]">Your Assignments</h3>
                  <p className="text-[#740000]">Current and upcoming emergency calls</p>
                </div>
                <button 
                  onClick={() => setShowEmergencyForm(true)}
                  className="px-4 py-2 bg-[#b90000] hover:bg-[#740000] text-[#fff3ea] rounded-lg font-medium text-sm transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2 inline" />
                  Report Incident
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className={`border rounded-lg p-4 hover:border-[#b90000] transition ${
                        assignment.status === "in-progress" ? "border-[#b90000] bg-[#b90000]/5" : "border-[#ffe6c5]"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="mt-1">{getStatusIcon(assignment.status)}</div>
                          <div>
                            <h3 className="font-semibold text-[#1a0000]">{assignment.type}</h3>
                            <div className="flex items-center gap-1 text-sm text-[#740000] mt-1">
                              <MapPin className="w-4 h-4" />
                              {assignment.location}
                            </div>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(assignment.priority)}`}
                        >
                          {assignment.priority.charAt(0).toUpperCase() + assignment.priority.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm pt-3 border-t border-[#ffe6c5]">
                        <div className="flex gap-4">
                          <span className="text-[#740000]">Distance: {assignment.distance}</span>
                          <span className="text-[#740000]">ETA: {assignment.eta}</span>
                        </div>
                        {assignment.status === "pending" && (
                          <button className="px-3 py-1 bg-[#b90000] hover:bg-[#740000] text-[#fff3ea] rounded text-sm font-medium transition-colors">
                            Accept
                          </button>
                        )}
                        {assignment.status === "in-progress" && (
                          <button className="px-3 py-1 border border-[#b90000] text-[#b90000] hover:bg-[#ffe6c5] rounded text-sm font-medium transition-colors">
                            Update Status
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Victims & Guidance Section */}
          <div className="space-y-6">
            {/* Victims Section */}
            <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg">
              <div className="p-6 border-b border-[#ffe6c5]">
                <h3 className="text-2xl font-bold text-[#1a0000]">Victim Information</h3>
                <p className="text-[#740000]">Current patient information</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {victims.map((victim) => (
                    <div
                      key={victim.id}
                      className={`border rounded-lg p-4 ${
                        victim.status === "critical" ? "border-[#b90000] bg-[#b90000]/5" : "border-[#ffe6c5]"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-[#1a0000]">{victim.name}</h4>
                          <p className="text-xs text-[#740000]">{victim.condition}</p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${
                            victim.status === "critical"
                              ? "bg-[#b90000]/10 text-[#b90000] border-[#b90000]/20"
                              : "bg-[#1a0000]/10 text-[#1a0000] border-[#1a0000]/20"
                          }`}
                        >
                          {victim.status.charAt(0).toUpperCase() + victim.status.slice(1)}
                        </span>
                      </div>
                      <div className="space-y-2 text-xs text-[#740000]">
                        <div className="flex justify-between">
                          <span>Heart Rate:</span>
                          <span className="text-[#1a0000] font-medium">{victim.vitals.heartRate} bpm</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Blood Pressure:</span>
                          <span className="text-[#1a0000] font-medium">{victim.vitals.bloodPressure}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Temperature:</span>
                          <span className="text-[#1a0000] font-medium">{victim.vitals.temperature}°C</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg">
              <div className="p-6 border-b border-[#ffe6c5]">
                <h3 className="text-lg font-bold text-[#1a0000] flex items-center gap-2">
                  <Phone className="text-[#b90000]" size={20} />
                  Emergency Contacts
                </h3>
              </div>
              <div className="p-6 space-y-2">
                <p className="text-[#740000]">Hospital: +1 (555) 123-4567</p>
                <p className="text-[#740000]">Dispatch: +1 (555) 911-0000</p>
                <p className="text-[#740000]">Supervisor: +1 (555) 234-5678</p>
              </div>
            </div>

            {/* Quick Guidance */}
            <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg">
              <div className="p-6 border-b border-[#ffe6c5]">
                <h3 className="text-lg font-bold text-[#1a0000] flex items-center gap-2">
                  <Heart className="text-[#b90000]" size={20} />
                  Quick Guidance
                </h3>
              </div>
              <div className="p-6 space-y-2">
                <button className="w-full text-left px-3 py-2 border border-[#ffe6c5] text-[#1a0000] hover:bg-[#ffe6c5] rounded transition-colors">
                  CPR Instructions
                </button>
                <button className="w-full text-left px-3 py-2 border border-[#ffe6c5] text-[#1a0000] hover:bg-[#ffe6c5] rounded transition-colors">
                  Wound Care
                </button>
                <button className="w-full text-left px-3 py-2 border border-[#ffe6c5] text-[#1a0000] hover:bg-[#ffe6c5] rounded transition-colors">
                  Shock Management
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Alert Form Modal */}
        {showEmergencyForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#fff3ea] border border-[#ffe6c5] rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-[#ffe6c5]">
                <h2 className="text-2xl font-bold text-[#1a0000]">Report Emergency Alert</h2>
                <button
                  onClick={() => setShowEmergencyForm(false)}
                  className="p-2 hover:bg-[#ffe6c5] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-[#1a0000]" />
                </button>
              </div>

              <form onSubmit={handleSubmitEmergency} className="p-6 space-y-6">
                {formError && (
                  <div className="p-3 bg-[#b90000]/10 border border-[#b90000]/20 rounded-lg">
                    <p className="text-sm text-[#b90000] flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {formError}
                    </p>
                  </div>
                )}

                {formSuccess && (
                  <div className="p-3 bg-[#1a0000]/10 border border-[#1a0000]/20 rounded-lg">
                    <p className="text-sm text-[#1a0000] flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      {formSuccess}
                    </p>
                  </div>
                )}

                {/* Emergency Type */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#1a0000]">
                    Emergency Type *
                  </label>
                  <select
                    name="emergency_type"
                    value={emergencyData.emergency_type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                    required
                  >
                    {emergencyTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-[#1a0000]">
                      Location Coordinates *
                    </label>
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      className="flex items-center gap-2 px-3 py-1 border border-[#b90000] text-[#b90000] hover:bg-[#ffe6c5] rounded text-sm transition-colors"
                    >
                      <Compass className="w-4 h-4" />
                      Use Current Location
                    </button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-[#1a0000]">
                        Latitude *
                      </label>
                      <input
                        type="number"
                        name="latitude"
                        value={emergencyData.latitude}
                        onChange={handleInputChange}
                        step="any"
                        min="-90"
                        max="90"
                        placeholder="e.g., 40.7128"
                        className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-[#1a0000]">
                        Longitude *
                      </label>
                      <input
                        type="number"
                        name="longitude"
                        value={emergencyData.longitude}
                        onChange={handleInputChange}
                        step="any"
                        min="-180"
                        max="180"
                        placeholder="e.g., -74.0060"
                        className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#1a0000]">
                    Address (Optional)
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={emergencyData.address}
                    onChange={handleInputChange}
                    placeholder="Enter street address or location description"
                    className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#1a0000]">
                    Emergency Description (Optional)
                  </label>
                  <textarea
                    name="description"
                    value={emergencyData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Describe the emergency situation, number of victims, conditions, etc."
                    className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent resize-vertical"
                  />
                </div>

                {/* Location ID */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#1a0000]">
                    Location ID (Optional)
                  </label>
                  <input
                    type="number"
                    name="location_id"
                    value={emergencyData.location_id}
                    onChange={handleInputChange}
                    placeholder="Enter location ID if available"
                    className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEmergencyForm(false)}
                    className="flex-1 px-4 py-2 border border-[#ffe6c5] text-[#1a0000] hover:bg-[#ffe6c5] rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-[#b90000] hover:bg-[#740000] text-[#fff3ea] rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#fff3ea] border-t-transparent rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Emergency Alert
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}