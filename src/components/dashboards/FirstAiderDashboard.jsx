"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Sidebar } from "../SideBar"
import {
    Heart, Phone, AlertCircle, MapPin, Navigation, Radio, Clock,
    Plus, CheckCircle, AlertTriangle, X, Send, Compass, User,
    Map, FileText, Stethoscope, Upload, Link
} from "lucide-react"
import { apiClient } from "../../utils/api"

export default function FirstAiderDashboard() {
    const [assignments, setAssignments] = useState([])
    const [victims, setVictims] = useState([])
    const [showEmergencyForm, setShowEmergencyForm] = useState(false)
    const [showStatusUpdateForm, setShowStatusUpdateForm] = useState(false)
    const [showVictimAssessmentForm, setShowVictimAssessmentForm] = useState(false)
    const [selectedAssignment, setSelectedAssignment] = useState(null)
    const [selectedVictim, setSelectedVictim] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formError, setFormError] = useState("")
    const [formSuccess, setFormSuccess] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [stats, setStats] = useState({
        activeAssignments: 0,
        highPriority: 0,
        victimsAssisted: 0,
        avgResponse: "6.5 min"
    })

    const [emergencyData, setEmergencyData] = useState({
        emergency_type: "medical",
        latitude: "",
        longitude: "",
        description: "",
        address: "",
        location_id: ""
    })

    const [statusUpdateData, setStatusUpdateData] = useState({
        latitude: "",
        longitude: "",
        address: "",
        status: "in_progress",
        details: ""
    })

    const [victimAssessment, setVictimAssessment] = useState({
        heartRate: "",
        bloodPressure: "",
        temperature: "",
        respiratoryRate: "",
        oxygenSaturation: "",
        gcsScore: "",
        symptoms: [],
        injuries: [],
        medications: "",
        allergies: "",
        medicalHistory: "",
        condition: "stable",
        notes: ""
    })

    const navigate = useNavigate()

    // Symptom options for checkboxes
    const symptomOptions = [
        "Chest pain", "Shortness of breath", "Dizziness", "Nausea", 
        "Headache", "Bleeding", "Fever", "Confusion", "Weakness",
        "Abdominal pain", "Vomiting", "Seizure"
    ]

    // Injury options for checkboxes
    const injuryOptions = [
        "Head injury", "Limb fracture", "Chest trauma", "Abdominal trauma",
        "Burn", "Laceration", "Sprain", "Spinal injury", "Internal bleeding"
    ]

    // Condition options
    const conditionOptions = [
        { value: "critical", label: "Critical" },
        { value: "serious", label: "Serious" },
        { value: "stable", label: "Stable" },
        { value: "guarded", label: "Guarded" }
    ]

    // Fetch active emergencies and assignments
    const fetchActiveEmergencies = async () => {
        try {
            const response = await apiClient.get('/emergencies/active/')
            const activeEmergencies = response.data || []
            
            const formattedAssignments = activeEmergencies.map(emergency => ({
                id: emergency.alert_id,
                location: emergency.address || "Location not specified",
                type: getEmergencyTypeLabel(emergency.emergency_type),
                priority: emergency.priority || "medium",
                status: mapStatus(emergency.status),
                distance: calculateDistance(emergency.current_latitude, emergency.current_longitude),
                eta: calculateETA(emergency.priority),
                originalData: emergency
            }))
            
            setAssignments(formattedAssignments)
            
            setStats({
                activeAssignments: formattedAssignments.filter(a => a.status !== "completed").length,
                highPriority: formattedAssignments.filter(a => a.priority === "high").length,
                victimsAssisted: victims.length,
                avgResponse: "6.5 min"
            })

        } catch (error) {
            console.error('Failed to fetch active emergencies:', error)
            setAssignments(getDefaultAssignments())
        } finally {
            setIsLoading(false)
        }
    }

    const getDefaultAssignments = () => [
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
    ]

    // Fetch emergency history for victims data
    const fetchEmergencyHistory = async () => {
        try {
            const response = await apiClient.get('/emergencies/history/?limit=10')
            const history = response.data || []
            
            const formattedVictims = history.slice(0, 3).map(emergency => ({
                id: emergency.alert_id,
                name: emergency.user_name || "Unknown Victim",
                condition: getConditionFromType(emergency.emergency_type),
                vitals: generateMockVitals(emergency.emergency_type),
                location: emergency.address || "Location not specified",
                status: emergency.priority === "high" ? "critical" : "stable",
                originalData: emergency
            }))
            
            setVictims(formattedVictims)
            
        } catch (error) {
            console.error('Failed to fetch emergency history:', error)
            setVictims(getDefaultVictims())
        }
    }

    const getDefaultVictims = () => [
        {
            id: "1",
            name: "John Doe",
            condition: "Trauma - Multiple injuries",
            vitals: { heartRate: 92, bloodPressure: "120/80", temperature: 37.2 },
            location: "Main Street & 5th Ave",
            status: "critical",
        },
    ]

    // Helper functions
    const getEmergencyTypeLabel = (type) => {
        const typeMap = {
            medical: "Medical Emergency",
            accident: "Accident",
            cardiac: "Cardiac Arrest",
            trauma: "Trauma",
            respiratory: "Respiratory Distress",
            pediatric: "Pediatric Emergency",
            other: "Other Emergency"
        }
        return typeMap[type] || "Emergency"
    }

    const getConditionFromType = (type) => {
        const conditionMap = {
            medical: "Medical Emergency",
            accident: "Trauma - Accident injuries",
            cardiac: "Cardiac Condition",
            trauma: "Trauma - Physical injuries",
            respiratory: "Breathing Difficulties",
            pediatric: "Pediatric Condition",
            other: "Emergency Condition"
        }
        return conditionMap[type] || "Emergency Condition"
    }

    const mapStatus = (apiStatus) => {
        const statusMap = {
            'pending': 'pending',
            'verified': 'in-progress',
            'dispatched': 'in-progress',
            'in_progress': 'in-progress',
            'completed': 'completed',
            'cancelled': 'completed'
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
            high: "5-8 mins",
            medium: "10-15 mins",
            low: "15-20 mins"
        }
        return etaMap[priority] || "12 mins"
    }

    const generateMockVitals = (emergencyType) => {
        const baseVitals = {
            medical: { heartRate: 88, bloodPressure: "118/76", temperature: 36.8 },
            accident: { heartRate: 105, bloodPressure: "135/85", temperature: 36.5 },
            cardiac: { heartRate: 45, bloodPressure: "90/60", temperature: 35.8 },
            trauma: { heartRate: 115, bloodPressure: "140/90", temperature: 37.1 },
            respiratory: { heartRate: 125, bloodPressure: "110/70", temperature: 37.5 },
            pediatric: { heartRate: 130, bloodPressure: "100/65", temperature: 38.2 },
            other: { heartRate: 95, bloodPressure: "120/80", temperature: 37.0 }
        }
        return baseVitals[emergencyType] || baseVitals.medical
    }

    // Accept assignment
    const handleAcceptAssignment = async (assignmentId) => {
        try {
            setAssignments(prev => prev.map(assignment => 
                assignment.id === assignmentId 
                    ? { ...assignment, status: 'in-progress' }
                    : assignment
            ))
            
        } catch (error) {
            console.error('Failed to accept assignment:', error)
        }
    }

    // Cancel emergency alert
    const handleCancelEmergency = async (assignmentId) => {
        try {
            const response = await apiClient.post(`/emergencies/${assignmentId}/cancel/`, {
                reason: "Cancelled by first aider"
            })
            
            setAssignments(prev => prev.filter(assignment => assignment.id !== assignmentId))
            setFormSuccess("Emergency alert cancelled successfully")
            
        } catch (error) {
            console.error('Failed to cancel emergency:', error)
            setFormError("Failed to cancel emergency alert")
        }
    }

    // Open status update form
    const handleOpenStatusUpdate = (assignment) => {
        setSelectedAssignment(assignment)
        setStatusUpdateData({
            latitude: assignment.originalData?.current_latitude?.toString() || "",
            longitude: assignment.originalData?.current_longitude?.toString() || "",
            address: assignment.originalData?.address || "",
            status: "in_progress",
            details: ""
        })
        setShowStatusUpdateForm(true)
    }

    // Submit status update
    const handleStatusUpdate = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setFormError("")
        setFormSuccess("")

        try {
            // Update location if coordinates are provided
            if (statusUpdateData.latitude && statusUpdateData.longitude) {
                await apiClient.put(`/emergencies/${selectedAssignment.id}/location/`, {
                    latitude: parseFloat(statusUpdateData.latitude),
                    longitude: parseFloat(statusUpdateData.longitude),
                    address: statusUpdateData.address
                })
            }

            // Update status
            await apiClient.post(`/emergencies/${selectedAssignment.id}/status/`, {
                status: statusUpdateData.status,
                details: statusUpdateData.details
            })

            setFormSuccess("Status updated successfully!")
            
            // Refresh assignments
            fetchActiveEmergencies()
            
            // Close form after 2 seconds
            setTimeout(() => {
                setShowStatusUpdateForm(false)
                setSelectedAssignment(null)
            }, 2000)

        } catch (error) {
            console.error('Status update failed:', error)
            setFormError(error.message || "Failed to update status")
        } finally {
            setIsSubmitting(false)
        }
    }

    // Open victim assessment form
    const handleOpenVictimAssessment = (victim) => {
        setSelectedVictim(victim)
        setVictimAssessment({
            heartRate: victim.vitals?.heartRate?.toString() || "",
            bloodPressure: victim.vitals?.bloodPressure || "",
            temperature: victim.vitals?.temperature?.toString() || "",
            respiratoryRate: "",
            oxygenSaturation: "",
            gcsScore: "",
            symptoms: [],
            injuries: [],
            medications: "",
            allergies: "",
            medicalHistory: "",
            condition: "stable",
            notes: ""
        })
        setShowVictimAssessmentForm(true)
    }

    // Handle symptom checkbox changes
    const handleSymptomChange = (symptom) => {
        setVictimAssessment(prev => ({
            ...prev,
            symptoms: prev.symptoms.includes(symptom)
                ? prev.symptoms.filter(s => s !== symptom)
                : [...prev.symptoms, symptom]
        }))
    }

    // Handle injury checkbox changes
    const handleInjuryChange = (injury) => {
        setVictimAssessment(prev => ({
            ...prev,
            injuries: prev.injuries.includes(injury)
                ? prev.injuries.filter(i => i !== injury)
                : [...prev.injuries, injury]
        }))
    }

    // Submit victim assessment
    const handleVictimAssessment = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setFormError("")
        setFormSuccess("")

        try {
            // In a real app, you would send this to your backend
            console.log('Victim assessment data:', {
                alertId: selectedVictim.id,
                assessment: victimAssessment
            })

            setFormSuccess("Victim assessment submitted successfully!")
            
            // Update local victims data
            setVictims(prev => prev.map(victim => 
                victim.id === selectedVictim.id 
                    ? { 
                        ...victim, 
                        vitals: {
                            heartRate: parseInt(victimAssessment.heartRate) || victim.vitals.heartRate,
                            bloodPressure: victimAssessment.bloodPressure || victim.vitals.bloodPressure,
                            temperature: parseFloat(victimAssessment.temperature) || victim.vitals.temperature
                        },
                        status: victimAssessment.condition
                    }
                    : victim
            ))

            // Close form after 2 seconds
            setTimeout(() => {
                setShowVictimAssessmentForm(false)
                setSelectedVictim(null)
            }, 2000)

        } catch (error) {
            console.error('Victim assessment failed:', error)
            setFormError("Failed to submit victim assessment")
        } finally {
            setIsSubmitting(false)
        }
    }

    // Get current location for status update
    const getCurrentLocationForUpdate = () => {
        if (navigator.geolocation) {
            setIsSubmitting(true)
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setStatusUpdateData(prev => ({
                        ...prev,
                        latitude: position.coords.latitude.toString(),
                        longitude: position.coords.longitude.toString()
                    }))
                    setIsSubmitting(false)
                },
                () => {
                    setFormError("Failed to get current location")
                    setIsSubmitting(false)
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
            )
        }
    }

    // Fetch data on component mount
    useEffect(() => {
        fetchActiveEmergencies()
        fetchEmergencyHistory()
    }, [])

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "high": return "bg-[#b90000]/10 text-[#b90000] border-[#b90000]/20"
            case "medium": return "bg-[#740000]/10 text-[#740000] border-[#740000]/20"
            case "low": return "bg-[#1a0000]/10 text-[#1a0000] border-[#1a0000]/20"
            default: return "bg-[#740000]/10 text-[#740000] border-[#740000]/20"
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case "pending": return <AlertTriangle className="w-5 h-5 text-[#740000]" />
            case "in-progress": return <Navigation className="w-5 h-5 text-[#b90000]" />
            case "completed": return <CheckCircle className="w-5 h-5 text-[#1a0000]" />
            default: return <AlertCircle className="w-5 h-5 text-[#740000]" />
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setEmergencyData(prev => ({ ...prev, [name]: value }))
        setFormError("")
        setFormSuccess("")
    }

    const handleStatusInputChange = (e) => {
        const { name, value } = e.target
        setStatusUpdateData(prev => ({ ...prev, [name]: value }))
    }

    const handleAssessmentInputChange = (e) => {
        const { name, value } = e.target
        setVictimAssessment(prev => ({ ...prev, [name]: value }))
    }

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            setIsSubmitting(true)
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setEmergencyData(prev => ({
                        ...prev,
                        latitude: position.coords.latitude.toString(),
                        longitude: position.coords.longitude.toString()
                    }))
                    setIsSubmitting(false)
                },
                () => {
                    setFormError("Failed to get current location. Please enter coordinates manually.")
                    setIsSubmitting(false)
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
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
            if (!emergencyData.latitude || !emergencyData.longitude) {
                throw new Error("Latitude and longitude are required")
            }

            const lat = parseFloat(emergencyData.latitude)
            const lng = parseFloat(emergencyData.longitude)

            if (lat < -90 || lat > 90) throw new Error("Latitude must be between -90 and 90")
            if (lng < -180 || lng > 180) throw new Error("Longitude must be between -180 and 180")

            const submitData = {
                emergency_type: emergencyData.emergency_type,
                latitude: lat,
                longitude: lng,
                description: emergencyData.description,
                address: emergencyData.address,
                ...(emergencyData.location_id && { location_id: parseInt(emergencyData.location_id) })
            }

            await apiClient.post('/emergencies/alert/', submitData)

            setFormSuccess("Emergency alert submitted successfully! Redirecting to dashboard...")
            setEmergencyData({
                emergency_type: "medical",
                latitude: "",
                longitude: "",
                description: "",
                address: "",
                location_id: ""
            })

            fetchActiveEmergencies()

            setTimeout(() => {
                setShowEmergencyForm(false)
                navigate('/dashboard/first_aider')
            }, 2000)

        } catch (error) {
            console.error('Emergency alert submission error:', error)
            setFormError(error.message || "An error occurred while submitting the emergency alert")
        } finally {
            setIsSubmitting(false)
        }
    }

    const emergencyTypes = [
        { value: "medical", label: "Medical Emergency" },
        { value: "accident", label: "Accident" },
        { value: "cardiac", label: "Cardiac Arrest" },
        { value: "trauma", label: "Trauma" },
        { value: "respiratory", label: "Respiratory Distress" },
        { value: "pediatric", label: "Pediatric Emergency" },
        { value: "other", label: "Other Emergency" }
    ]

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#fff3ea] via-[#fff3ea] to-[#ffe6c5]">
                <Sidebar />
                <main className="ml-64 px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="w-8 h-8 border-4 border-[#b90000] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-[#740000]">Loading emergencies...</p>
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
                    <h1 className="text-4xl font-bold text-[#1a0000] mb-2">First-Aider Dashboard</h1>
                    <p className="text-[#740000]">Manage emergency assignments and victim care</p>
                </div>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
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
                    <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[#740000] mb-1">Victims Assisted</p>
                                <p className="text-3xl font-bold text-[#1a0000]">{stats.victimsAssisted}</p>
                            </div>
                            <User className="w-12 h-12 text-[#b90000]/20" />
                        </div>
                    </div>
                    <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[#740000] mb-1">Avg Response</p>
                                <p className="text-3xl font-bold text-[#1a0000]">{stats.avgResponse}</p>
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
                                    {assignments.length === 0 ? (
                                        <div className="text-center py-8">
                                            <AlertCircle className="w-12 h-12 text-[#740000]/50 mx-auto mb-4" />
                                            <p className="text-[#740000]">No active emergencies</p>
                                        </div>
                                    ) : (
                                        assignments.map((assignment) => (
                                            <div
                                                key={assignment.id}
                                                className={`border rounded-lg p-4 hover:border-[#b90000] transition ${assignment.status === "in-progress" ? "border-[#b90000] bg-[#b90000]/5" : "border-[#ffe6c5]"
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
                                                    <div className="flex gap-2">
                                                        {assignment.status === "pending" && (
                                                            <>
                                                                <button 
                                                                    onClick={() => handleAcceptAssignment(assignment.id)}
                                                                    className="px-3 py-1 bg-[#b90000] hover:bg-[#740000] text-[#fff3ea] rounded text-sm font-medium transition-colors"
                                                                >
                                                                    Accept
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleCancelEmergency(assignment.id)}
                                                                    className="px-3 py-1 border border-[#740000] text-[#740000] hover:bg-[#ffe6c5] rounded text-sm font-medium transition-colors"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </>
                                                        )}
                                                        {assignment.status === "in-progress" && (
                                                            <button 
                                                                onClick={() => handleOpenStatusUpdate(assignment)}
                                                                className="px-3 py-1 border border-[#b90000] text-[#b90000] hover:bg-[#ffe6c5] rounded text-sm font-medium transition-colors"
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
                                    {victims.length === 0 ? (
                                        <div className="text-center py-4">
                                            <User className="w-8 h-8 text-[#740000]/50 mx-auto mb-2" />
                                            <p className="text-[#740000] text-sm">No victim data available</p>
                                        </div>
                                    ) : (
                                        victims.map((victim) => (
                                            <div
                                                key={victim.id}
                                                className={`border rounded-lg p-4 ${victim.status === "critical" ? "border-[#b90000] bg-[#b90000]/5" : "border-[#ffe6c5]"
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <h4 className="font-semibold text-[#1a0000]">{victim.name}</h4>
                                                        <p className="text-xs text-[#740000]">{victim.condition}</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs font-medium border ${victim.status === "critical"
                                                                    ? "bg-[#b90000]/10 text-[#b90000] border-[#b90000]/20"
                                                                    : "bg-[#1a0000]/10 text-[#1a0000] border-[#1a0000]/20"
                                                                }`}
                                                        >
                                                            {victim.status.charAt(0).toUpperCase() + victim.status.slice(1)}
                                                        </span>
                                                        <button
                                                            onClick={() => handleOpenVictimAssessment(victim)}
                                                            className="p-1 border border-[#b90000] text-[#b90000] hover:bg-[#ffe6c5] rounded text-xs transition-colors"
                                                            title="Assess Victim"
                                                        >
                                                            <Stethoscope className="w-3 h-3" />
                                                        </button>
                                                    </div>
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
                                                <div className="mt-3 pt-3 border-t border-[#ffe6c5]">
                                                    <button
                                                        onClick={() => handleOpenVictimAssessment(victim)}
                                                        className="w-full px-3 py-1 bg-[#b90000] hover:bg-[#740000] text-[#fff3ea] rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        <Stethoscope className="w-3 h-3" />
                                                        Assess Victim
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
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
                                    disabled={isSubmitting}
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
                                        disabled={isSubmitting}
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
                                            disabled={isSubmitting}
                                            className="flex items-center gap-2 px-3 py-1 border border-[#b90000] text-[#b90000] hover:bg-[#ffe6c5] rounded text-sm transition-colors disabled:opacity-50"
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
                                                disabled={isSubmitting}
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
                                                disabled={isSubmitting}
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
                                        disabled={isSubmitting}
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
                                        disabled={isSubmitting}
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
                                        disabled={isSubmitting}
                                    />
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowEmergencyForm(false)}
                                        disabled={isSubmitting}
                                        className="flex-1 px-4 py-2 border border-[#ffe6c5] text-[#1a0000] hover:bg-[#ffe6c5] rounded-lg font-medium transition-colors disabled:opacity-50"
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

                {/* Status Update Form Modal */}
                {showStatusUpdateForm && selectedAssignment && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-[#fff3ea] border border-[#ffe6c5] rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between p-6 border-b border-[#ffe6c5]">
                                <h2 className="text-2xl font-bold text-[#1a0000]">Update Emergency Status</h2>
                                <button
                                    onClick={() => setShowStatusUpdateForm(false)}
                                    className="p-2 hover:bg-[#ffe6c5] rounded-lg transition-colors"
                                    disabled={isSubmitting}
                                >
                                    <X className="w-5 h-5 text-[#1a0000]" />
                                </button>
                            </div>

                            <form onSubmit={handleStatusUpdate} className="p-6 space-y-6">
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

                                <div className="bg-[#ffe6c5] p-4 rounded-lg">
                                    <h3 className="font-semibold text-[#1a0000] mb-2">Current Assignment</h3>
                                    <p className="text-[#740000]">{selectedAssignment.type} - {selectedAssignment.location}</p>
                                </div>

                                {/* Location Update Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-sm font-medium text-[#1a0000]">
                                            Update Location (Optional)
                                        </label>
                                        <button
                                            type="button"
                                            onClick={getCurrentLocationForUpdate}
                                            disabled={isSubmitting}
                                            className="flex items-center gap-2 px-3 py-1 border border-[#b90000] text-[#b90000] hover:bg-[#ffe6c5] rounded text-sm transition-colors disabled:opacity-50"
                                        >
                                            <Map className="w-4 h-4" />
                                            Use Current Location
                                        </button>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[#1a0000]">
                                                Latitude
                                            </label>
                                            <input
                                                type="number"
                                                name="latitude"
                                                value={statusUpdateData.latitude}
                                                onChange={handleStatusInputChange}
                                                step="any"
                                                min="-90"
                                                max="90"
                                                placeholder="e.g., 40.7128"
                                                className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                                disabled={isSubmitting}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[#1a0000]">
                                                Longitude
                                            </label>
                                            <input
                                                type="number"
                                                name="longitude"
                                                value={statusUpdateData.longitude}
                                                onChange={handleStatusInputChange}
                                                step="any"
                                                min="-180"
                                                max="180"
                                                placeholder="e.g., -74.0060"
                                                className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[#1a0000]">
                                            Address
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={statusUpdateData.address}
                                            onChange={handleStatusInputChange}
                                            placeholder="Enter updated address"
                                            className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>

                                {/* Status Update */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[#1a0000]">
                                            Status
                                        </label>
                                        <select
                                            name="status"
                                            value={statusUpdateData.status}
                                            onChange={handleStatusInputChange}
                                            className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                            disabled={isSubmitting}
                                        >
                                            <option value="in_progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
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
                                            placeholder="Provide details about the current situation, actions taken, etc."
                                            className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent resize-vertical"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowStatusUpdateForm(false)}
                                        disabled={isSubmitting}
                                        className="flex-1 px-4 py-2 border border-[#ffe6c5] text-[#1a0000] hover:bg-[#ffe6c5] rounded-lg font-medium transition-colors disabled:opacity-50"
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
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                Update Status
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Victim Assessment Form Modal */}
                {showVictimAssessmentForm && selectedVictim && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-[#fff3ea] border border-[#ffe6c5] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between p-6 border-b border-[#ffe6c5]">
                                <h2 className="text-2xl font-bold text-[#1a0000]">Victim Assessment</h2>
                                <button
                                    onClick={() => setShowVictimAssessmentForm(false)}
                                    className="p-2 hover:bg-[#ffe6c5] rounded-lg transition-colors"
                                    disabled={isSubmitting}
                                >
                                    <X className="w-5 h-5 text-[#1a0000]" />
                                </button>
                            </div>

                            <form onSubmit={handleVictimAssessment} className="p-6 space-y-6">
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

                                <div className="bg-[#ffe6c5] p-4 rounded-lg">
                                    <h3 className="font-semibold text-[#1a0000] mb-2">Victim Information</h3>
                                    <p className="text-[#740000]">{selectedVictim.name} - {selectedVictim.condition}</p>
                                    <p className="text-[#740000] text-sm">Location: {selectedVictim.location}</p>
                                </div>

                                {/* Vital Signs */}
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[#1a0000]">
                                            Heart Rate (bpm)
                                        </label>
                                        <input
                                            type="number"
                                            name="heartRate"
                                            value={victimAssessment.heartRate}
                                            onChange={handleAssessmentInputChange}
                                            placeholder="e.g., 72"
                                            className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[#1a0000]">
                                            Blood Pressure
                                        </label>
                                        <input
                                            type="text"
                                            name="bloodPressure"
                                            value={victimAssessment.bloodPressure}
                                            onChange={handleAssessmentInputChange}
                                            placeholder="e.g., 120/80"
                                            className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[#1a0000]">
                                            Temperature (°C)
                                        </label>
                                        <input
                                            type="number"
                                            name="temperature"
                                            value={victimAssessment.temperature}
                                            onChange={handleAssessmentInputChange}
                                            step="0.1"
                                            placeholder="e.g., 36.6"
                                            className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[#1a0000]">
                                            Respiratory Rate
                                        </label>
                                        <input
                                            type="number"
                                            name="respiratoryRate"
                                            value={victimAssessment.respiratoryRate}
                                            onChange={handleAssessmentInputChange}
                                            placeholder="e.g., 16"
                                            className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[#1a0000]">
                                            O2 Saturation (%)
                                        </label>
                                        <input
                                            type="number"
                                            name="oxygenSaturation"
                                            value={victimAssessment.oxygenSaturation}
                                            onChange={handleAssessmentInputChange}
                                            min="0"
                                            max="100"
                                            placeholder="e.g., 98"
                                            className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[#1a0000]">
                                            GCS Score
                                        </label>
                                        <input
                                            type="number"
                                            name="gcsScore"
                                            value={victimAssessment.gcsScore}
                                            onChange={handleAssessmentInputChange}
                                            min="3"
                                            max="15"
                                            placeholder="e.g., 15"
                                            className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>

                                {/* Symptoms Checkboxes */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-[#1a0000]">
                                        Symptoms
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {symptomOptions.map(symptom => (
                                            <label key={symptom} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={victimAssessment.symptoms.includes(symptom)}
                                                    onChange={() => handleSymptomChange(symptom)}
                                                    className="rounded border-[#ffe6c5] text-[#b90000] focus:ring-[#b90000]"
                                                    disabled={isSubmitting}
                                                />
                                                <span className="text-sm text-[#1a0000]">{symptom}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Injuries Checkboxes */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-[#1a0000]">
                                        Injuries
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {injuryOptions.map(injury => (
                                            <label key={injury} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={victimAssessment.injuries.includes(injury)}
                                                    onChange={() => handleInjuryChange(injury)}
                                                    className="rounded border-[#ffe6c5] text-[#b90000] focus:ring-[#b90000]"
                                                    disabled={isSubmitting}
                                                />
                                                <span className="text-sm text-[#1a0000]">{injury}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Medical Information */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[#1a0000]">
                                            Current Medications
                                        </label>
                                        <input
                                            type="text"
                                            name="medications"
                                            value={victimAssessment.medications}
                                            onChange={handleAssessmentInputChange}
                                            placeholder="List current medications"
                                            className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[#1a0000]">
                                            Allergies
                                        </label>
                                        <input
                                            type="text"
                                            name="allergies"
                                            value={victimAssessment.allergies}
                                            onChange={handleAssessmentInputChange}
                                            placeholder="List known allergies"
                                            className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#1a0000]">
                                        Medical History
                                    </label>
                                    <textarea
                                        name="medicalHistory"
                                        value={victimAssessment.medicalHistory}
                                        onChange={handleAssessmentInputChange}
                                        rows={2}
                                        placeholder="Relevant medical history"
                                        className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent resize-vertical"
                                        disabled={isSubmitting}
                                    />
                                </div>

                                {/* Condition Assessment */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[#1a0000]">
                                            Current Condition
                                        </label>
                                        <select
                                            name="condition"
                                            value={victimAssessment.condition}
                                            onChange={handleAssessmentInputChange}
                                            className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                            disabled={isSubmitting}
                                        >
                                            {conditionOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#1a0000]">
                                        Assessment Notes
                                    </label>
                                    <textarea
                                        name="notes"
                                        value={victimAssessment.notes}
                                        onChange={handleAssessmentInputChange}
                                        rows={3}
                                        placeholder="Additional observations, treatment provided, recommendations..."
                                        className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent resize-vertical"
                                        disabled={isSubmitting}
                                    />
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowVictimAssessmentForm(false)}
                                        disabled={isSubmitting}
                                        className="flex-1 px-4 py-2 border border-[#ffe6c5] text-[#1a0000] hover:bg-[#ffe6c5] rounded-lg font-medium transition-colors disabled:opacity-50"
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
                                                <FileText className="w-4 h-4" />
                                                Submit Assessment
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