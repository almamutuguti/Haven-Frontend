"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Sidebar } from "../SideBar"
import {
    Heart, Phone, AlertCircle, MapPin, Navigation, Radio, Clock,
    Plus, CheckCircle, AlertTriangle, X, Send, Compass, User,
    Map, FileText, Stethoscope, Upload, Link, Eye, Calendar
} from "lucide-react"
import { apiClient } from "../../utils/api"

export default function FirstAiderDashboard() {
    const [assignments, setAssignments] = useState([])
    const [victims, setVictims] = useState([])
    const [showEmergencyForm, setShowEmergencyForm] = useState(false)
    const [showStatusUpdateForm, setShowStatusUpdateForm] = useState(false)
    const [showVictimAssessmentForm, setShowVictimAssessmentForm] = useState(false)
    const [showAssessmentSummary, setShowAssessmentSummary] = useState(false)
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

    // Emergency Alert Form Data
    const [emergencyData, setEmergencyData] = useState({
        emergency_type: "medical",
        latitude: "",
        longitude: "",
        description: "",
        address: "",
        location_id: ""
    })

    // Status Update Form Data
    const [statusUpdateData, setStatusUpdateData] = useState({
        latitude: "",
        longitude: "",
        address: "",
        status: "in_progress",
        details: ""
    })

    // Victim Assessment Form Data
    const [victimAssessment, setVictimAssessment] = useState({
        // Personal Information
        firstName: "",
        lastName: "",
        age: "",
        gender: "",
        contactNumber: "",
        
        // Vital Signs
        heartRate: "",
        bloodPressure: "",
        temperature: "",
        respiratoryRate: "",
        oxygenSaturation: "",
        gcsScore: "",
        bloodGlucose: "",
        
        // Symptoms
        symptoms: [],
        painLevel: "",
        painLocation: "",
        
        // Injuries
        injuries: [],
        injuryMechanism: "",
        
        // Medical Information
        medications: "",
        allergies: "",
        medicalHistory: "",
        lastMeal: "",
        
        // Assessment
        condition: "stable",
        consciousness: "alert",
        breathing: "normal",
        circulation: "normal",
        
        // Treatment
        treatmentProvided: "",
        medicationsAdministered: "",
        
        // Notes
        notes: "",
        recommendations: ""
    })

    const [assessmentSummary, setAssessmentSummary] = useState(null)

    // Emergency Types
    const emergencyTypes = [
        { value: "medical", label: "Medical Emergency" },
        { value: "accident", label: "Accident" },
        { value: "cardiac", label: "Cardiac Arrest" },
        { value: "trauma", label: "Trauma" },
        { value: "respiratory", label: "Respiratory Distress" },
        { value: "pediatric", label: "Pediatric Emergency" },
        { value: "other", label: "Other Emergency" }
    ]

    // Status Options
    const statusOptions = [
        { value: "in_progress", label: "In Progress" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" }
    ]

    // Symptom options for checkboxes
    const symptomOptions = [
        "Chest pain", "Shortness of breath", "Dizziness", "Nausea", 
        "Headache", "Bleeding", "Fever", "Confusion", "Weakness",
        "Abdominal pain", "Vomiting", "Seizure", "Palpitations",
        "Vision changes", "Difficulty speaking", "Paralysis", "Swelling"
    ]

    // Injury options for checkboxes
    const injuryOptions = [
        "Head injury", "Limb fracture", "Chest trauma", "Abdominal trauma",
        "Burn", "Laceration", "Sprain", "Spinal injury", "Internal bleeding",
        "Dislocation", "Amputation", "Crush injury", "Penetrating injury"
    ]

    // Condition options
    const conditionOptions = [
        { value: "critical", label: "Critical" },
        { value: "serious", label: "Serious" },
        { value: "stable", label: "Stable" },
        { value: "guarded", label: "Guarded" }
    ]

    // Gender options
    const genderOptions = [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "other", label: "Other" },
        { value: "unknown", label: "Unknown" }
    ]

    // Consciousness levels
    const consciousnessOptions = [
        { value: "alert", label: "Alert" },
        { value: "verbal", label: "Responds to Verbal" },
        { value: "pain", label: "Responds to Pain" },
        { value: "unresponsive", label: "Unresponsive" }
    ]

    // Breathing patterns
    const breathingOptions = [
        { value: "normal", label: "Normal" },
        { value: "fast", label: "Fast" },
        { value: "slow", label: "Slow" },
        { value: "labored", label: "Labored" },
        { value: "absent", label: "Absent" }
    ]

    // Circulation status
    const circulationOptions = [
        { value: "normal", label: "Normal" },
        { value: "weak", label: "Weak" },
        { value: "absent", label: "Absent" },
        { value: "irregular", label: "Irregular" }
    ]

    // Pain levels
    const painLevelOptions = [
        { value: "0", label: "0 - No Pain" },
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
        { value: "5", label: "5 - Moderate" },
        { value: "6", label: "6" },
        { value: "7", label: "7" },
        { value: "8", label: "8" },
        { value: "9", label: "9" },
        { value: "10", label: "10 - Worst Possible" }
    ]

    // Injury mechanisms
    const injuryMechanismOptions = [
        "Fall", "Motor vehicle accident", "Assault", "Sports injury",
        "Burn", "Industrial accident", "Penetrating object", "Crush",
        "Explosion", "Other"
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
                originalData: emergency,
                hasAssessment: false
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
            hasAssessment: false
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

    // Open victim assessment form via plus button
    const handleOpenVictimAssessment = (victim = null) => {
        setSelectedVictim(victim)
        setVictimAssessment({
            // Personal Information
            firstName: victim?.name?.split(' ')[0] || "",
            lastName: victim?.name?.split(' ')[1] || "",
            age: "",
            gender: "",
            contactNumber: "",
            
            // Vital Signs
            heartRate: victim?.vitals?.heartRate?.toString() || "",
            bloodPressure: victim?.vitals?.bloodPressure || "",
            temperature: victim?.vitals?.temperature?.toString() || "",
            respiratoryRate: "",
            oxygenSaturation: "",
            gcsScore: "",
            bloodGlucose: "",
            
            // Symptoms
            symptoms: [],
            painLevel: "",
            painLocation: "",
            
            // Injuries
            injuries: [],
            injuryMechanism: "",
            
            // Medical Information
            medications: "",
            allergies: "",
            medicalHistory: "",
            lastMeal: "",
            
            // Assessment
            condition: victim?.status || "stable",
            consciousness: "alert",
            breathing: "normal",
            circulation: "normal",
            
            // Treatment
            treatmentProvided: "",
            medicationsAdministered: "",
            
            // Notes
            notes: "",
            recommendations: ""
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

    // Handle assessment input changes
    const handleAssessmentInputChange = (e) => {
        const { name, value } = e.target
        setVictimAssessment(prev => ({ ...prev, [name]: value }))
    }

    // Generate assessment summary
    const generateAssessmentSummary = (assessment, victim) => {
        return {
            victimName: `${assessment.firstName} ${assessment.lastName}`.trim() || victim?.name || "Unknown Victim",
            timestamp: new Date().toLocaleString(),
            personalInfo: {
                age: assessment.age,
                gender: assessment.gender,
                contactNumber: assessment.contactNumber
            },
            vitalSigns: {
                heartRate: assessment.heartRate,
                bloodPressure: assessment.bloodPressure,
                temperature: assessment.temperature,
                respiratoryRate: assessment.respiratoryRate,
                oxygenSaturation: assessment.oxygenSaturation,
                gcsScore: assessment.gcsScore,
                bloodGlucose: assessment.bloodGlucose
            },
            symptoms: assessment.symptoms,
            injuries: assessment.injuries,
            pain: {
                level: assessment.painLevel,
                location: assessment.painLocation
            },
            medicalInfo: {
                medications: assessment.medications,
                allergies: assessment.allergies,
                medicalHistory: assessment.medicalHistory,
                lastMeal: assessment.lastMeal
            },
            assessment: {
                condition: assessment.condition,
                consciousness: assessment.consciousness,
                breathing: assessment.breathing,
                circulation: assessment.circulation
            },
            treatment: {
                provided: assessment.treatmentProvided,
                medications: assessment.medicationsAdministered
            },
            notes: assessment.notes,
            recommendations: assessment.recommendations,
            priority: getPriorityFromCondition(assessment.condition)
        }
    }

    const getPriorityFromCondition = (condition) => {
        const priorityMap = {
            critical: "High",
            serious: "High",
            guarded: "Medium",
            stable: "Low"
        }
        return priorityMap[condition] || "Medium"
    }

    // Submit victim assessment
    const handleVictimAssessment = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setFormError("")
        setFormSuccess("")

        try {
            // Generate assessment summary
            const summary = generateAssessmentSummary(victimAssessment, selectedVictim)
            setAssessmentSummary(summary)

            // In a real app, you would send this to your backend
            console.log('Victim assessment data:', {
                alertId: selectedVictim?.id,
                assessment: victimAssessment,
                summary: summary
            })

            // Update local victims data
            if (selectedVictim) {
                setVictims(prev => prev.map(victim => 
                    victim.id === selectedVictim.id 
                        ? { 
                            ...victim, 
                            name: summary.victimName,
                            vitals: {
                                heartRate: parseInt(victimAssessment.heartRate) || victim.vitals.heartRate,
                                bloodPressure: victimAssessment.bloodPressure || victim.vitals.bloodPressure,
                                temperature: parseFloat(victimAssessment.temperature) || victim.vitals.temperature
                            },
                            status: victimAssessment.condition,
                            hasAssessment: true,
                            assessmentSummary: summary
                        }
                        : victim
                ))
            } else {
                // Add new victim
                const newVictim = {
                    id: `victim-${Date.now()}`,
                    name: summary.victimName,
                    condition: victimAssessment.condition,
                    vitals: {
                        heartRate: parseInt(victimAssessment.heartRate) || 0,
                        bloodPressure: victimAssessment.bloodPressure || "N/A",
                        temperature: parseFloat(victimAssessment.temperature) || 0
                    },
                    location: "Current Location",
                    status: victimAssessment.condition,
                    hasAssessment: true,
                    assessmentSummary: summary
                }
                setVictims(prev => [...prev, newVictim])
            }

            // Close assessment form and show summary
            setShowVictimAssessmentForm(false)
            setShowAssessmentSummary(true)

        } catch (error) {
            console.error('Victim assessment failed:', error)
            setFormError("Failed to submit victim assessment")
        } finally {
            setIsSubmitting(false)
        }
    }

    // View assessment summary
    const handleViewAssessmentSummary = (victim) => {
        if (victim.assessmentSummary) {
            setAssessmentSummary(victim.assessmentSummary)
            setShowAssessmentSummary(true)
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
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-2xl font-bold text-[#1a0000]">Victim Information</h3>
                                        <p className="text-[#740000]">Current patient information</p>
                                    </div>
                                    <button
                                        onClick={() => handleOpenVictimAssessment()}
                                        className="p-2 bg-[#b90000] hover:bg-[#740000] text-[#fff3ea] rounded-lg transition-colors"
                                        title="Add New Victim Assessment"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {victims.length === 0 ? (
                                        <div className="text-center py-4">
                                            <User className="w-8 h-8 text-[#740000]/50 mx-auto mb-2" />
                                            <p className="text-[#740000] text-sm">No victim data available</p>
                                            <button
                                                onClick={() => handleOpenVictimAssessment()}
                                                className="mt-2 px-4 py-2 bg-[#b90000] hover:bg-[#740000] text-[#fff3ea] rounded text-sm font-medium transition-colors"
                                            >
                                                <Plus className="w-4 h-4 mr-1 inline" />
                                                Add First Assessment
                                            </button>
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
                                                        {victim.hasAssessment && (
                                                            <div className="flex items-center gap-1 mt-1">
                                                                <CheckCircle className="w-3 h-3 text-[#1a0000]" />
                                                                <span className="text-xs text-[#1a0000]">Assessment Complete</span>
                                                            </div>
                                                        )}
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
                                                        <div className="flex gap-1">
                                                            {victim.hasAssessment ? (
                                                                <button
                                                                    onClick={() => handleViewAssessmentSummary(victim)}
                                                                    className="p-1 border border-[#1a0000] text-[#1a0000] hover:bg-[#ffe6c5] rounded text-xs transition-colors"
                                                                    title="View Assessment Summary"
                                                                >
                                                                    <Eye className="w-3 h-3" />
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleOpenVictimAssessment(victim)}
                                                                    className="p-1 border border-[#b90000] text-[#b90000] hover:bg-[#ffe6c5] rounded text-xs transition-colors"
                                                                    title="Assess Victim"
                                                                >
                                                                    <Plus className="w-3 h-3" />
                                                                </button>
                                                            )}
                                                        </div>
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
                                                    {victim.hasAssessment ? (
                                                        <button
                                                            onClick={() => handleViewAssessmentSummary(victim)}
                                                            className="w-full px-3 py-1 bg-[#1a0000] hover:bg-[#740000] text-[#fff3ea] rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                                        >
                                                            <Eye className="w-3 h-3" />
                                                            View Assessment Summary
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleOpenVictimAssessment(victim)}
                                                            className="w-full px-3 py-1 bg-[#b90000] hover:bg-[#740000] text-[#fff3ea] rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                                        >
                                                            <Stethoscope className="w-3 h-3" />
                                                            Assess Victim
                                                        </button>
                                                    )}
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
                                            {statusOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
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
                {showVictimAssessmentForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-[#fff3ea] border border-[#ffe6c5] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between p-6 border-b border-[#ffe6c5]">
                                <h2 className="text-2xl font-bold text-[#1a0000]">
                                    {selectedVictim ? `Assess Victim: ${selectedVictim.name}` : 'New Victim Assessment'}
                                </h2>
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

                                {/* Personal Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-[#1a0000] border-b border-[#ffe6c5] pb-2">Personal Information</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[#1a0000]">
                                                First Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={victimAssessment.firstName}
                                                onChange={handleAssessmentInputChange}
                                                className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                                required
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[#1a0000]">
                                                Last Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={victimAssessment.lastName}
                                                onChange={handleAssessmentInputChange}
                                                className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                                required
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[#1a0000]">
                                                Age
                                            </label>
                                            <input
                                                type="number"
                                                name="age"
                                                value={victimAssessment.age}
                                                onChange={handleAssessmentInputChange}
                                                min="0"
                                                max="120"
                                                className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[#1a0000]">
                                                Gender
                                            </label>
                                            <select
                                                name="gender"
                                                value={victimAssessment.gender}
                                                onChange={handleAssessmentInputChange}
                                                className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                                disabled={isSubmitting}
                                            >
                                                <option value="">Select Gender</option>
                                                {genderOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[#1a0000]">
                                                Contact Number
                                            </label>
                                            <input
                                                type="tel"
                                                name="contactNumber"
                                                value={victimAssessment.contactNumber}
                                                onChange={handleAssessmentInputChange}
                                                placeholder="Phone number"
                                                className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Vital Signs */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-[#1a0000] border-b border-[#ffe6c5] pb-2">Vital Signs</h3>
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

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[#1a0000]">
                                                Blood Glucose (mg/dL)
                                            </label>
                                            <input
                                                type="number"
                                                name="bloodGlucose"
                                                value={victimAssessment.bloodGlucose}
                                                onChange={handleAssessmentInputChange}
                                                placeholder="e.g., 100"
                                                className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Symptoms & Pain Assessment */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-[#1a0000] border-b border-[#ffe6c5] pb-2">Symptoms & Pain Assessment</h3>
                                    
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

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[#1a0000]">
                                                Pain Level (0-10)
                                            </label>
                                            <select
                                                name="painLevel"
                                                value={victimAssessment.painLevel}
                                                onChange={handleAssessmentInputChange}
                                                className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                                disabled={isSubmitting}
                                            >
                                                <option value="">Select Pain Level</option>
                                                {painLevelOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[#1a0000]">
                                                Pain Location
                                            </label>
                                            <input
                                                type="text"
                                                name="painLocation"
                                                value={victimAssessment.painLocation}
                                                onChange={handleAssessmentInputChange}
                                                placeholder="Where is the pain located?"
                                                className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Injuries */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-[#1a0000] border-b border-[#ffe6c5] pb-2">Injuries</h3>
                                    
                                    <div className="space-y-3">
                                        <label className="block text-sm font-medium text-[#1a0000]">
                                            Injuries Observed
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

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[#1a0000]">
                                            Injury Mechanism
                                        </label>
                                        <select
                                            name="injuryMechanism"
                                            value={victimAssessment.injuryMechanism}
                                            onChange={handleAssessmentInputChange}
                                            className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                            disabled={isSubmitting}
                                        >
                                            <option value="">Select Injury Mechanism</option>
                                            {injuryMechanismOptions.map(option => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Medical Information */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-[#1a0000] border-b border-[#ffe6c5] pb-2">Medical Information</h3>
                                    
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[#1a0000]">
                                                Current Medications
                                            </label>
                                            <textarea
                                                name="medications"
                                                value={victimAssessment.medications}
                                                onChange={handleAssessmentInputChange}
                                                rows={2}
                                                placeholder="List current medications"
                                                className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent resize-vertical"
                                                disabled={isSubmitting}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[#1a0000]">
                                                Allergies
                                            </label>
                                            <textarea
                                                name="allergies"
                                                value={victimAssessment.allergies}
                                                onChange={handleAssessmentInputChange}
                                                rows={2}
                                                placeholder="List known allergies"
                                                className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent resize-vertical"
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
                                            placeholder="Relevant medical history (diabetes, heart conditions, etc.)"
                                            className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent resize-vertical"
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[#1a0000]">
                                            Last Meal
                                        </label>
                                        <input
                                            type="text"
                                            name="lastMeal"
                                            value={victimAssessment.lastMeal}
                                            onChange={handleAssessmentInputChange}
                                            placeholder="When and what did they last eat/drink?"
                                            className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>

                                {/* Assessment */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-[#1a0000] border-b border-[#ffe6c5] pb-2">Clinical Assessment</h3>
                                    
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[#1a0000]">
                                                Level of Consciousness
                                            </label>
                                            <select
                                                name="consciousness"
                                                value={victimAssessment.consciousness}
                                                onChange={handleAssessmentInputChange}
                                                className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                                disabled={isSubmitting}
                                            >
                                                {consciousnessOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[#1a0000]">
                                                Breathing
                                            </label>
                                            <select
                                                name="breathing"
                                                value={victimAssessment.breathing}
                                                onChange={handleAssessmentInputChange}
                                                className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                                disabled={isSubmitting}
                                            >
                                                {breathingOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[#1a0000]">
                                                Circulation
                                            </label>
                                            <select
                                                name="circulation"
                                                value={victimAssessment.circulation}
                                                onChange={handleAssessmentInputChange}
                                                className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                                disabled={isSubmitting}
                                            >
                                                {circulationOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[#1a0000]">
                                                Overall Condition
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
                                </div>

                                {/* Treatment Provided */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-[#1a0000] border-b border-[#ffe6c5] pb-2">Treatment Provided</h3>
                                    
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[#1a0000]">
                                            Treatment Provided
                                        </label>
                                        <textarea
                                            name="treatmentProvided"
                                            value={victimAssessment.treatmentProvided}
                                            onChange={handleAssessmentInputChange}
                                            rows={3}
                                            placeholder="Describe treatment provided (CPR, bandaging, splinting, etc.)"
                                            className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent resize-vertical"
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[#1a0000]">
                                            Medications Administered
                                        </label>
                                        <textarea
                                            name="medicationsAdministered"
                                            value={victimAssessment.medicationsAdministered}
                                            onChange={handleAssessmentInputChange}
                                            rows={2}
                                            placeholder="List any medications administered"
                                            className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent resize-vertical"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>

                                {/* Notes & Recommendations */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-[#1a0000] border-b border-[#ffe6c5] pb-2">Notes & Recommendations</h3>
                                    
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[#1a0000]">
                                            Assessment Notes
                                        </label>
                                        <textarea
                                            name="notes"
                                            value={victimAssessment.notes}
                                            onChange={handleAssessmentInputChange}
                                            rows={3}
                                            placeholder="Additional observations, findings, etc."
                                            className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent resize-vertical"
                                            disabled={isSubmitting}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[#1a0000]">
                                            Recommendations
                                        </label>
                                        <textarea
                                            name="recommendations"
                                            value={victimAssessment.recommendations}
                                            onChange={handleAssessmentInputChange}
                                            rows={2}
                                            placeholder="Recommendations for further care"
                                            className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent resize-vertical"
                                            disabled={isSubmitting}
                                        />
                                    </div>
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

                {/* Assessment Summary Modal */}
                {showAssessmentSummary && assessmentSummary && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-[#fff3ea] border border-[#ffe6c5] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between p-6 border-b border-[#ffe6c5]">
                                <h2 className="text-2xl font-bold text-[#1a0000]">Assessment Summary</h2>
                                <button
                                    onClick={() => setShowAssessmentSummary(false)}
                                    className="p-2 hover:bg-[#ffe6c5] rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-[#1a0000]" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Victim Info */}
                                <div className="bg-[#ffe6c5] p-4 rounded-lg">
                                    <h3 className="font-semibold text-[#1a0000] text-lg mb-2">{assessmentSummary.victimName}</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <span className="text-[#740000]">Assessment Time:</span>
                                            <p className="text-[#1a0000] font-medium">{assessmentSummary.timestamp}</p>
                                        </div>
                                        {assessmentSummary.personalInfo.age && (
                                            <div>
                                                <span className="text-[#740000]">Age:</span>
                                                <p className="text-[#1a0000] font-medium">{assessmentSummary.personalInfo.age}</p>
                                            </div>
                                        )}
                                        {assessmentSummary.personalInfo.gender && (
                                            <div>
                                                <span className="text-[#740000]">Gender:</span>
                                                <p className="text-[#1a0000] font-medium">{assessmentSummary.personalInfo.gender}</p>
                                            </div>
                                        )}
                                        <div>
                                            <span className="text-[#740000]">Priority:</span>
                                            <p className={`font-medium ${assessmentSummary.priority === 'High' ? 'text-[#b90000]' : assessmentSummary.priority === 'Medium' ? 'text-[#740000]' : 'text-[#1a0000]'}`}>
                                                {assessmentSummary.priority}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Vital Signs */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-[#1a0000] text-lg">Vital Signs</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {Object.entries(assessmentSummary.vitalSigns).map(([key, value]) => (
                                            value && (
                                                <div key={key} className="bg-[#fff3ea] border border-[#ffe6c5] rounded-lg p-3">
                                                    <p className="text-sm text-[#740000] capitalize">
                                                        {key.replace(/([A-Z])/g, ' $1').trim()}
                                                    </p>
                                                    <p className="text-lg font-semibold text-[#1a0000]">{value}</p>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>

                                {/* Clinical Assessment */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <h3 className="font-semibold text-[#1a0000]">Clinical Assessment</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-[#740000]">Consciousness:</span>
                                                <span className="text-[#1a0000] font-medium">{assessmentSummary.assessment.consciousness}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-[#740000]">Breathing:</span>
                                                <span className="text-[#1a0000] font-medium">{assessmentSummary.assessment.breathing}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-[#740000]">Circulation:</span>
                                                <span className="text-[#1a0000] font-medium">{assessmentSummary.assessment.circulation}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-[#740000]">Condition:</span>
                                                <span className={`font-medium ${assessmentSummary.assessment.condition === 'critical' ? 'text-[#b90000]' : assessmentSummary.assessment.condition === 'serious' ? 'text-[#b90000]' : assessmentSummary.assessment.condition === 'guarded' ? 'text-[#740000]' : 'text-[#1a0000]'}`}>
                                                    {assessmentSummary.assessment.condition}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pain Assessment */}
                                    {(assessmentSummary.pain.level || assessmentSummary.pain.location) && (
                                        <div className="space-y-3">
                                            <h3 className="font-semibold text-[#1a0000]">Pain Assessment</h3>
                                            <div className="space-y-2">
                                                {assessmentSummary.pain.level && (
                                                    <div className="flex justify-between">
                                                        <span className="text-[#740000]">Pain Level:</span>
                                                        <span className="text-[#1a0000] font-medium">{assessmentSummary.pain.level}/10</span>
                                                    </div>
                                                )}
                                                {assessmentSummary.pain.location && (
                                                    <div className="flex justify-between">
                                                        <span className="text-[#740000]">Location:</span>
                                                        <span className="text-[#1a0000] font-medium">{assessmentSummary.pain.location}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Symptoms & Injuries */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Symptoms */}
                                    <div className="space-y-3">
                                        <h3 className="font-semibold text-[#1a0000]">Symptoms</h3>
                                        {assessmentSummary.symptoms.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {assessmentSummary.symptoms.map((symptom, index) => (
                                                    <span key={index} className="px-2 py-1 bg-[#b90000]/10 text-[#b90000] rounded-full text-xs border border-[#b90000]/20">
                                                        {symptom}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-[#740000] text-sm">No symptoms reported</p>
                                        )}
                                    </div>

                                    {/* Injuries */}
                                    <div className="space-y-3">
                                        <h3 className="font-semibold text-[#1a0000]">Injuries</h3>
                                        {assessmentSummary.injuries.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {assessmentSummary.injuries.map((injury, index) => (
                                                    <span key={index} className="px-2 py-1 bg-[#740000]/10 text-[#740000] rounded-full text-xs border border-[#740000]/20">
                                                        {injury}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-[#740000] text-sm">No injuries reported</p>
                                        )}
                                    </div>
                                </div>

                                {/* Medical Information */}
                                {(assessmentSummary.medicalInfo.medications || assessmentSummary.medicalInfo.allergies || assessmentSummary.medicalInfo.medicalHistory || assessmentSummary.medicalInfo.lastMeal) && (
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-[#1a0000] text-lg">Medical Information</h3>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            {assessmentSummary.medicalInfo.medications && (
                                                <div>
                                                    <p className="text-sm text-[#740000]">Medications</p>
                                                    <p className="text-[#1a0000]">{assessmentSummary.medicalInfo.medications}</p>
                                                </div>
                                            )}
                                            {assessmentSummary.medicalInfo.allergies && (
                                                <div>
                                                    <p className="text-sm text-[#740000]">Allergies</p>
                                                    <p className="text-[#1a0000]">{assessmentSummary.medicalInfo.allergies}</p>
                                                </div>
                                            )}
                                        </div>
                                        {assessmentSummary.medicalInfo.medicalHistory && (
                                            <div>
                                                <p className="text-sm text-[#740000]">Medical History</p>
                                                <p className="text-[#1a0000]">{assessmentSummary.medicalInfo.medicalHistory}</p>
                                            </div>
                                        )}
                                        {assessmentSummary.medicalInfo.lastMeal && (
                                            <div>
                                                <p className="text-sm text-[#740000]">Last Meal</p>
                                                <p className="text-[#1a0000]">{assessmentSummary.medicalInfo.lastMeal}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Treatment Provided */}
                                {(assessmentSummary.treatment.provided || assessmentSummary.treatment.medications) && (
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-[#1a0000] text-lg">Treatment Provided</h3>
                                        {assessmentSummary.treatment.provided && (
                                            <div>
                                                <p className="text-sm text-[#740000]">Treatment</p>
                                                <p className="text-[#1a0000]">{assessmentSummary.treatment.provided}</p>
                                            </div>
                                        )}
                                        {assessmentSummary.treatment.medications && (
                                            <div>
                                                <p className="text-sm text-[#740000]">Medications Administered</p>
                                                <p className="text-[#1a0000]">{assessmentSummary.treatment.medications}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Notes & Recommendations */}
                                {(assessmentSummary.notes || assessmentSummary.recommendations) && (
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-[#1a0000] text-lg">Notes & Recommendations</h3>
                                        {assessmentSummary.notes && (
                                            <div>
                                                <p className="text-sm text-[#740000]">Assessment Notes</p>
                                                <p className="text-[#1a0000] bg-[#fff3ea] border border-[#ffe6c5] rounded-lg p-3">
                                                    {assessmentSummary.notes}
                                                </p>
                                            </div>
                                        )}
                                        {assessmentSummary.recommendations && (
                                            <div>
                                                <p className="text-sm text-[#740000]">Recommendations</p>
                                                <p className="text-[#1a0000] bg-[#fff3ea] border border-[#ffe6c5] rounded-lg p-3">
                                                    {assessmentSummary.recommendations}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={() => setShowAssessmentSummary(false)}
                                        className="flex-1 px-4 py-2 border border-[#ffe6c5] text-[#1a0000] hover:bg-[#ffe6c5] rounded-lg font-medium transition-colors"
                                    >
                                        Close Summary
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowAssessmentSummary(false);
                                            setShowVictimAssessmentForm(true);
                                        }}
                                        className="flex-1 px-4 py-2 bg-[#b90000] hover:bg-[#740000] text-[#fff3ea] rounded-lg font-medium transition-colors"
                                    >
                                        Edit Assessment
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}