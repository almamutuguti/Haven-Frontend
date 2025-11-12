// src/components/dashboards/firstaider-pages/FirstAiderAssignments.jsx
"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Sidebar } from "../../SideBar"
import { 
  MapPin, 
  Navigation, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Calendar, 
  User, 
  Radio, 
  MessageCircle,
  Compass,
  X
} from "lucide-react"
import { apiClient } from "../../../utils/api"

export default function FirstAiderAssignments() {
  const [assignments, setAssignments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [formError, setFormError] = useState("")
  const [formSuccess, setFormSuccess] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const [stats, setStats] = useState({
    activeAssignments: 0,
    highPriority: 0
  })

  // Status Update Form Data
  const [showStatusUpdateForm, setShowStatusUpdateForm] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const [statusUpdateData, setStatusUpdateData] = useState({
    address: "",
    status: "dispatched",
    details: "",
    latitude: "",
    longitude: ""
  })

  // Status Options
  const statusOptions = [
    { value: "dispatched", label: "Dispatched" },
    { value: "en_route", label: "En Route to Hospital" },
    { value: "arrived", label: "Arrived at Hospital" },
    { value: "completed", label: "Completed" },
  ]

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const userData = localStorage.getItem('haven_user');
      if (userData) {
        const profile = JSON.parse(userData);
        setUserProfile(profile);
        return profile;
      }
      return null;
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      return null;
    }
  }

  // Enhanced geocoding function
  const geocodeCoordinates = async (lat, lng) => {
    try {
      const response = await apiClient.post('/geolocation/geocode/', {
        latitude: lat,
        longitude: lng
      })

      const addressData = response.data

      if (addressData.formatted_address && addressData.formatted_address.trim() !== '') {
        return {
          address: addressData.formatted_address.trim(),
          isLandmark: false
        }
      }

      // Fallback to coordinates
      return {
        address: `Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        isLandmark: true
      }

    } catch (error) {
      console.error('Geocoding failed:', error)
      return {
        address: `Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        isLandmark: true
      }
    }
  }

  // Fetch active emergencies and assignments
  const fetchAssignments = async () => {
    try {
      console.log('DEBUG - Fetching assignments...')
      setIsLoading(true)
      setFormError("")

      let response;
      try {
        response = await apiClient.get('/emergencies/active/')
        console.log('DEBUG - Raw API response:', response)
      } catch (apiError) {
        console.error('DEBUG - API request failed:', apiError)
        if (!navigator.onLine) {
          throw new Error('No internet connection. Please check your network and try again.')
        } else if (apiError.response) {
          throw new Error(`Server error: ${apiError.response.status} - ${apiError.response.statusText}`)
        } else if (apiError.request) {
          throw new Error('Unable to connect to server. Please try again later.')
        } else {
          throw new Error('Failed to fetch assignments: ' + apiError.message)
        }
      }

      // Handle the response
      let activeEmergencies = []

      if (Array.isArray(response)) {
        activeEmergencies = response
        console.log('DEBUG - Response is direct array with', activeEmergencies.length, 'emergencies')
      } else if (response && Array.isArray(response.data)) {
        activeEmergencies = response.data
        console.log('DEBUG - Response has data array with', activeEmergencies.length, 'emergencies')
      } else if (response && typeof response === 'object') {
        if (Array.isArray(response.results)) {
          activeEmergencies = response.results
        } else if (Array.isArray(response.emergencies)) {
          activeEmergencies = response.emergencies
        } else if (Array.isArray(response.data)) {
          activeEmergencies = response.data
        } else {
          console.log('DEBUG - Could not extract emergencies array from response object')
          activeEmergencies = []
        }
        console.log('DEBUG - Extracted emergencies from object:', activeEmergencies.length)
      } else {
        console.log('DEBUG - Unexpected response format')
        activeEmergencies = []
      }

      console.log('DEBUG - Final active emergencies:', activeEmergencies)
      console.log('DEBUG - Number of emergencies:', activeEmergencies.length)

      if (activeEmergencies.length === 0) {
        console.log('DEBUG - No assignments found')
        setAssignments([])
        setStats({
          activeAssignments: 0,
          highPriority: 0,
        })
        return
      }

      // Process each emergency to get proper address display
      const formattedAssignments = await Promise.all(
        activeEmergencies.map(async (emergency, index) => {
          console.log(`DEBUG - Processing emergency ${index}:`, emergency)

          // Ensure we have basic required fields with fallbacks
          const emergencyId = emergency.alert_id || emergency.id || `emergency-${index}`
          const emergencyType = emergency.emergency_type || "medical"
          const priority = emergency.priority || "medium"
          const status = emergency.status || "pending"

          let displayAddress = emergency.address || emergency.location || "Location not specified"

          // If we have coordinates but no proper address, try to geocode
          if ((!displayAddress || displayAddress === "Location not specified") &&
            (emergency.current_latitude || emergency.latitude) &&
            (emergency.current_longitude || emergency.longitude)) {
            try {
              const lat = emergency.current_latitude || emergency.latitude
              const lng = emergency.current_longitude || emergency.longitude
              console.log(`DEBUG - Geocoding coordinates for emergency ${index}:`, lat, lng)
              const geocoded = await geocodeCoordinates(lat, lng)
              displayAddress = geocoded.address
              console.log(`DEBUG - Geocoded address for emergency ${index}:`, displayAddress)
            } catch (geocodeError) {
              console.warn(`Failed to geocode emergency ${index} location:`, geocodeError)
              displayAddress = `Coordinates: ${lat?.toFixed(4) || 'N/A'}, ${lng?.toFixed(4) || 'N/A'}`
            }
          }

          const assignment = {
            id: emergencyId,
            location: displayAddress,
            type: getEmergencyTypeLabel(emergencyType),
            priority: priority,
            status: mapStatus(status),
            distance: calculateDistance(
              emergency.current_latitude || emergency.latitude,
              emergency.current_longitude || emergency.longitude
            ),
            eta: calculateETA(priority),
            originalData: emergency
          }

          console.log(`DEBUG - Formatted assignment ${index}:`, assignment)
          return assignment
        })
      )

      console.log('DEBUG - Final formatted assignments:', formattedAssignments)
      setAssignments(formattedAssignments)

      // Update stats
      setStats({
        activeAssignments: formattedAssignments.filter(a =>
          a.status !== "completed" && a.status !== "cancelled"
        ).length,
        highPriority: formattedAssignments.filter(a =>
          a.priority === "high" || a.priority === "critical"
        ).length,
      })

      console.log('DEBUG - Successfully updated assignments and stats')

    } catch (error) {
      console.error('Failed to fetch assignments:', error)
      setAssignments([])

      // Show user-friendly error message
      const errorMessage = error.message || "Failed to load assignments. Please check your connection and try again."
      setFormError(errorMessage)

      // Log detailed error for debugging
      console.error('Detailed error:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Helper functions
  const getEmergencyTypeLabel = (type) => {
    if (!type) return "Emergency"

    const typeMap = {
      medical: "Medical Emergency",
      accident: "Accident",
      cardiac: "Cardiac Arrest",
      trauma: "Trauma",
      respiratory: "Respiratory Distress",
      pediatric: "Pediatric Emergency",
      other: "Other Emergency"
    }
    return typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1) + " Emergency"
  }

  const mapStatus = (apiStatus) => {
    if (!apiStatus) return 'pending'

    const statusMap = {
      'pending': 'pending',
      'dispatched': 'dispatched',
      'en_route': 'en_route',
      'arrived': 'arrived',
      'completed': 'completed',
      'cancelled': 'cancelled'
    }
    return statusMap[apiStatus] || 'pending'
  }

  const calculateDistance = (lat, lng) => {
    if (!lat || !lng) return "Unknown"
    const distances = ["1.2 km", "3.2 km", "4.5 km", "2.1 km", "5.7 km"]
    return distances[Math.floor(Math.random() * distances.length)]
  }

  const calculateETA = (priority) => {
    const etaMap = {
      critical: "5-8 mins",
      high: "5-8 mins",
      medium: "10-15 mins",
      low: "15-20 mins"
    }
    return etaMap[priority] || "12 mins"
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical":
      case "high": return "bg-[#b90000]/10 text-[#b90000] border-[#b90000]/20"
      case "medium": return "bg-[#740000]/10 text-[#740000] border-[#740000]/20"
      case "low": return "bg-[#1a0000]/10 text-[#1a0000] border-[#1a0000]/20"
      default: return "bg-[#740000]/10 text-[#740000] border-[#740000]/20"
    }
  }

  // Fixed getStatusIcon function with all required icons
  const getStatusIcon = (status) => {
    switch (status) {
      case "dispatched":
        return <Navigation className="w-5 h-5 text-blue-600" />
      case "en_route":
        return <Compass className="w-5 h-5 text-orange-500" />
      case "arrived":
        return <MapPin className="w-5 h-5 text-green-600" />
      case "completed":
        return <CheckCircle className="w-5 h-5 text-[#1a0000]" />
      case "cancelled":
        return <AlertCircle className="w-5 h-5 text-gray-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-[#740000]" />
    }
  }

  // Open status update form
  const handleOpenStatusUpdate = (assignment) => {
    setSelectedAssignment(assignment)
    setStatusUpdateData({
      address: assignment.originalData?.address || "",
      status: assignment.status === "pending" ? "dispatched" : assignment.status,
      details: "",
      latitude: assignment.originalData?.current_latitude || "",
      longitude: assignment.originalData?.current_longitude || ""
    })
    setShowStatusUpdateForm(true)
  }

  // Handle status update
  const handleStatusUpdate = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormError("")
    setFormSuccess("")

    try {
      console.log('Starting status update for assignment:', selectedAssignment.id)

      // Prepare the update data
      const updateData = {
        status: statusUpdateData.status,
        details: statusUpdateData.details || `Status updated to ${statusUpdateData.status}`
      }

      console.log('Updating alert status with data:', updateData)
      const response = await apiClient.post(`/emergencies/${selectedAssignment.id}/status/`, updateData)

      console.log('Status update response:', response)

      // Update local state immediately for better UX
      setAssignments(prev => prev.map(assignment =>
        assignment.id === selectedAssignment.id
          ? {
            ...assignment,
            status: mapStatusToUI(statusUpdateData.status),
            location: statusUpdateData.address || assignment.location
          }
          : assignment
      ))

      setFormSuccess(`Status updated to ${statusUpdateData.status.replace('_', ' ')} successfully!`)

      // Refresh data after a short delay
      setTimeout(() => {
        fetchAssignments()
      }, 1000)

      // Close form after success
      setTimeout(() => {
        setShowStatusUpdateForm(false)
        setSelectedAssignment(null)
        setStatusUpdateData({
          address: "",
          status: "dispatched",
          details: "",
          latitude: "",
          longitude: ""
        })
      }, 2000)

    } catch (error) {
      console.error('Status update failed:', error)

      // Enhanced error handling
      if (error.response) {
        if (error.response.status === 404) {
          setFormError("Emergency alert not found. It may have been cancelled or completed.")
        } else if (error.response.status === 403) {
          setFormError("You don't have permission to update this alert status.")
        } else if (error.response.status === 400) {
          const errorData = error.response.data
          if (typeof errorData === 'object') {
            const errorMessages = Object.entries(errorData).map(([field, messages]) =>
              `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
            )
            setFormError(`Validation error: ${errorMessages.join('; ')}`)
          } else {
            setFormError(`Error: ${errorData}`)
          }
        } else {
          setFormError(`Server error: ${error.response.status} - ${error.response.data?.detail || error.response.statusText}`)
        }
      } else if (error.request) {
        setFormError("Network error: Unable to connect to server. Please check your internet connection.")
      } else {
        setFormError(error.message || "Failed to update alert status. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper function to map API status to UI status
  const mapStatusToUI = (apiStatus) => {
    const statusMap = {
      'dispatched': 'dispatched',
      'en_route': 'en_route',
      'arrived': 'arrived',
      'completed': 'completed',
    }
    return statusMap[apiStatus] || 'dispatched'
  }

  // Handle accept assignment
  const handleAcceptAssignment = async (assignmentId) => {
    try {
      setIsSubmitting(true)
      console.log('Accepting assignment:', assignmentId)

      const response = await apiClient.post(`/emergencies/${assignmentId}/status/`, {
        status: 'dispatched',
        details: 'First aider has accepted the assignment'
      })

      console.log('Accept assignment response:', response)

      // Update local state
      setAssignments(prev => prev.map(assignment =>
        assignment.id === assignmentId
          ? { ...assignment, status: 'dispatched' }
          : assignment
      ))

      setFormSuccess("Assignment accepted successfully!")

      // Refresh data
      setTimeout(() => {
        fetchAssignments()
      }, 1000)

    } catch (error) {
      console.error('Failed to accept assignment:', error)

      if (error.response) {
        console.error('Error response data:', error.response.data)
        console.error('Error response status:', error.response.status)

        if (error.response.data && error.response.data.status) {
          setFormError(`Status error: ${error.response.data.status.join(', ')}`)
        } else {
          setFormError(`Server error: ${error.response.status} - ${error.response.data?.detail || 'Unknown error'}`)
        }
      } else if (error.request) {
        setFormError("Network error: Unable to connect to server.")
      } else {
        setFormError(error.message || "Failed to accept assignment")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle cancel emergency
  const handleCancelEmergency = async (assignmentId) => {
    try {
      setIsSubmitting(true)

      // Update status to cancelled
      await apiClient.post(`/emergencies/${assignmentId}/status/`, {
        status: 'cancelled',
        details: 'Cancelled by first aider'
      })

      // Remove from local state
      setAssignments(prev => prev.filter(assignment => assignment.id !== assignmentId))
      setFormSuccess("Emergency alert cancelled successfully")

    } catch (error) {
      console.error('Failed to cancel emergency:', error)
      setFormError("Failed to cancel emergency alert")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusInputChange = (e) => {
    const { name, value } = e.target
    setStatusUpdateData(prev => ({ ...prev, [name]: value }))
  }

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        await fetchUserProfile()
        await fetchAssignments()
      } catch (error) {
        console.error('Failed to load assignments data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

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
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#1a0000] mb-2">Emergency Assignments</h1>
            <p className="text-[#740000]">
              Welcome back, {userProfile?.first_name || 'First Aider'}! Manage your emergency assignments and updates
            </p>
            <p className="text-[#740000] text-sm mt-1">
              Organization: {userProfile?.organization?.name || userProfile?.organization || 'Not specified'}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#740000] mb-1">Active Assignments</p>
                  <p className="text-3xl font-bold text-[#1a0000]">{stats.activeAssignments}</p>
                </div>
                <Radio className="w-12 h-12 text-[#b90000]/20" />
              </div>
            </div>
            <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#740000] mb-1">High Priority</p>
                  <p className="text-3xl font-bold text-[#b90000]">{stats.highPriority}</p>
                </div>
                <AlertCircle className="w-12 h-12 text-[#b90000]/20" />
              </div>
            </div>
          </div>

          {/* Assignments Section */}
          <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg">
            <div className="flex flex-row items-center justify-between p-6 border-b border-[#ffe6c5]">
              <div>
                <h3 className="text-2xl font-bold text-[#1a0000]">Your Assignments</h3>
                <p className="text-[#740000]">Current and upcoming emergency calls</p>
              </div>
              <button
                onClick={fetchAssignments}
                className="px-4 py-2 border border-[#b90000] text-[#b90000] hover:bg-[#ffe6c5] rounded-lg font-medium text-sm transition-colors"
              >
                Refresh Assignments
              </button>
            </div>
            
            {/* Scrollable Assignments Container */}
            <div className="p-6">
              {formError && (
                <div className="p-3 bg-[#b90000]/10 border border-[#b90000] rounded text-[#b90000] text-sm mb-4">
                  {formError}
                </div>
              )}
              {formSuccess && (
                <div className="p-3 bg-green-100 border border-green-400 rounded text-green-700 text-sm mb-4">
                  {formSuccess}
                </div>
              )}
              
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
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
                    <div
                      key={assignment.id}
                      className={`border rounded-lg p-6 hover:border-[#b90000] transition ${
                        assignment.status === "dispatched" ? "border-[#b90000] bg-[#b90000]/5" : "border-[#ffe6c5]"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="mt-1">{getStatusIcon(assignment.status)}</div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-[#1a0000] mb-2">{assignment.type}</h3>
                            <div className="flex items-center gap-2 text-[#740000] mb-3">
                              <MapPin className="w-4 h-4" />
                              <span className="text-sm">{assignment.location}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm flex-wrap">
                              <span className="flex items-center gap-1 text-[#740000]">
                                <Clock className="w-4 h-4" />
                                Reported {new Date(assignment.originalData?.created_at).toLocaleTimeString()}
                              </span>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(assignment.priority)}`}>
                                {assignment.priority?.toUpperCase()}
                              </span>
                              <span className="text-[#740000]">
                                Distance: {assignment.distance}
                              </span>
                              <span className="text-[#740000]">
                                ETA: {assignment.eta}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-[#740000]">Alert ID</span>
                          <p className="text-lg font-semibold text-[#1a0000]">{assignment.id}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-[#ffe6c5]">
                        <div className="flex items-center gap-2 text-sm text-[#740000]">
                          <Navigation className="w-4 h-4" />
                          <span>ETA: {assignment.eta}</span>
                        </div>
                        <div className="flex gap-3">
                          {assignment.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleAcceptAssignment(assignment.id)}
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-[#b90000] hover:bg-[#740000] text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                              >
                                Accept Assignment
                              </button>
                              <button
                                onClick={() => handleCancelEmergency(assignment.id)}
                                disabled={isSubmitting}
                                className="px-4 py-2 border border-[#740000] text-[#740000] hover:bg-[#ffe6c5] rounded-lg font-medium transition-colors disabled:opacity-50"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {/* Update Status button - now available for all statuses except cancelled/completed */}
                          {(assignment.status === "dispatched" || assignment.status === "en_route" || assignment.status === "arrived") && (
                            <button
                              onClick={() => handleOpenStatusUpdate(assignment)}
                              className="px-4 py-2 border border-[#b90000] text-[#b90000] hover:bg-[#ffe6c5] rounded-lg font-medium transition-colors"
                            >
                              Update Status
                            </button>
                          )}
                          {/* Update Status button for pending assignments */}
                          {assignment.status === "pending" && (
                            <button
                              onClick={() => handleOpenStatusUpdate(assignment)}
                              className="px-4 py-2 border border-[#b90000] text-[#b90000] hover:bg-[#ffe6c5] rounded-lg font-medium transition-colors"
                            >
                              Update Status
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Status Update Modal */}
        {showStatusUpdateForm && selectedAssignment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#fff3ea] border border-[#ffe6c5] rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b border-[#ffe6c5] sticky top-0 bg-[#fff3ea] z-10">
                <h2 className="text-2xl font-bold text-[#1a0000]">Update Assignment Status</h2>
                <button
                  onClick={() => setShowStatusUpdateForm(false)}
                  className="p-2 hover:bg-[#ffe6c5] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-[#1a0000]" />
                </button>
              </div>
              <form onSubmit={handleStatusUpdate} className="p-6 space-y-4">
                {formError && (
                  <div className="p-3 bg-[#b90000]/10 border border-[#b90000] rounded text-[#b90000] text-sm">
                    {formError}
                  </div>
                )}
                {formSuccess && (
                  <div className="p-3 bg-green-100 border border-green-400 rounded text-green-700 text-sm">
                    {formSuccess}
                  </div>
                )}

                <div className="bg-[#ffe6c5] p-4 rounded-lg">
                  <h3 className="font-semibold text-[#1a0000] mb-2">{selectedAssignment.type}</h3>
                  <p className="text-sm text-[#740000]">{selectedAssignment.location}</p>
                  <p className="text-sm text-[#740000]">Current Status: {selectedAssignment.status}</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#1a0000]">
                    New Status
                  </label>
                  <select
                    name="status"
                    value={statusUpdateData.status}
                    onChange={handleStatusInputChange}
                    className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                  >
                    {statusOptions.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#1a0000]">
                    Current Location
                  </label>
                  <textarea
                    name="address"
                    value={statusUpdateData.address}
                    onChange={handleStatusInputChange}
                    rows={2}
                    placeholder="Enter your current location (address or coordinates)..."
                    className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent resize-vertical"
                  />
                  <p className="text-xs text-[#740000]">
                    Enter address or coordinates for accurate location tracking
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#1a0000]">
                    Update Details
                  </label>
                  <textarea
                    name="details"
                    value={statusUpdateData.details}
                    onChange={handleStatusInputChange}
                    rows={3}
                    placeholder="Provide details about the current situation..."
                    className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent resize-vertical"
                  />
                </div>

                <div className="flex gap-4 pt-4 sticky bottom-0 bg-[#fff3ea] pb-2">
                  <button
                    type="button"
                    onClick={() => setShowStatusUpdateForm(false)}
                    className="flex-1 px-4 py-2 border border-[#ffe6c5] text-[#1a0000] hover:bg-[#ffe6c5] rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-[#b90000] hover:bg-[#740000] text-[#fff3ea] rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? "Updating..." : "Update Status"}
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