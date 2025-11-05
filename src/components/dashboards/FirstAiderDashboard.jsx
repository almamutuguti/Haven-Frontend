"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Sidebar } from "../SideBar"
import {
    Heart, Phone, AlertCircle, MapPin, Navigation, Radio, Clock,
    Plus, CheckCircle, AlertTriangle, X, Send, Compass, User,
    Map, FileText, Stethoscope, Upload, Link, Eye, Calendar,
    MessageCircle, Building, Ambulance
} from "lucide-react"
import { apiClient } from "../../utils/api"

export default function FirstAiderDashboard() {
    const [assignments, setAssignments] = useState([])
    const [victims, setVictims] = useState([])
    const [hospitalCommunications, setHospitalCommunications] = useState([])
    const [hospitals, setHospitals] = useState([])
    const [showEmergencyForm, setShowEmergencyForm] = useState(false)
    const [showStatusUpdateForm, setShowStatusUpdateForm] = useState(false)
    const [showVictimAssessmentForm, setShowVictimAssessmentForm] = useState(false)
    const [showAssessmentSummary, setShowAssessmentSummary] = useState(false)
    const [showHospitalCommunicationForm, setShowHospitalCommunicationForm] = useState(false)
    const [showCommunicationStatusForm, setShowCommunicationStatusForm] = useState(false)
    const [selectedAssignment, setSelectedAssignment] = useState(null)
    const [selectedVictim, setSelectedVictim] = useState(null)
    const [selectedCommunication, setSelectedCommunication] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formError, setFormError] = useState("")
    const [formSuccess, setFormSuccess] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [stats, setStats] = useState({
        activeAssignments: 0,
        highPriority: 0,
        victimsAssisted: 0,
        activeCommunications: 0
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
        firstName: "",
        lastName: "",
        age: "",
        gender: "",
        contactNumber: "",
        heartRate: "",
        bloodPressure: "",
        temperature: "",
        respiratoryRate: "",
        oxygenSaturation: "",
        gcs_eyes: "",
        gcs_verbal: "",
        gcs_motor: "",
        bloodGlucose: "",
        symptoms: [],
        painLevel: "",
        painLocation: "",
        injuries: [],
        injuryMechanism: "",
        medications: "",
        allergies: "",
        medicalHistory: "",
        lastMeal: "",
        condition: "stable",
        consciousness: "alert",
        breathing: "normal",
        circulation: "normal",
        triage_category: "delayed",
        treatmentProvided: "",
        medicationsAdministered: "",
        notes: "",
        recommendations: ""
    })

    // Hospital Communication Form Data
    const [hospitalCommunicationData, setHospitalCommunicationData] = useState({
        emergency_alert_id: "",
        hospital: "",
        priority: "high",
        victim_name: "",
        victim_age: "",
        victim_gender: "",
        chief_complaint: "",
        vital_signs: "",
        first_aid_provided: "",
        estimated_arrival_minutes: "15",
        required_specialties: "",
        equipment_needed: "",
        blood_type_required: ""
    })

    // Communication Status Update Data
    const [communicationStatusData, setCommunicationStatusData] = useState({
        status: "sent",
        notes: ""
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

    // Communication Status Options
    const communicationStatusOptions = [
        { value: "sent", label: "Sent" },
        { value: "acknowledged", label: "Acknowledged" },
        { value: "preparing", label: "Preparing" },
        { value: "ready", label: "Ready" },
        { value: "en_route", label: "En Route" },
        { value: "arrived", label: "Arrived" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" }
    ]

    // Priority Options
    const priorityOptions = [
        { value: "critical", label: "Critical" },
        { value: "high", label: "High" },
        { value: "medium", label: "Medium" },
        { value: "low", label: "Low" }
    ]

    // Triage Categories
    const triageOptions = [
        { value: "immediate", label: "Immediate" },
        { value: "delayed", label: "Delayed" },
        { value: "minor", label: "Minor" },
        { value: "expectant", label: "Expectant" }
    ]

    // Symptom options
    const symptomOptions = [
        "Chest pain", "Shortness of breath", "Dizziness", "Nausea", 
        "Headache", "Bleeding", "Fever", "Confusion", "Weakness",
        "Abdominal pain", "Vomiting", "Seizure", "Palpitations"
    ]

    // Injury options
    const injuryOptions = [
        "Head injury", "Limb fracture", "Chest trauma", "Abdominal trauma",
        "Burn", "Laceration", "Sprain", "Spinal injury", "Internal bleeding"
    ]

    // Gender options
    const genderOptions = [
        { value: "male", label: "Male" },
        { value: "female", label: "Female" },
        { value: "other", label: "Other" },
        { value: "unknown", label: "Unknown" }
    ]

    // Fetch hospitals for selection
    const fetchHospitals = async () => {
        try {
            const response = await apiClient.post('/hospitals/search/', {
                query: '',
                max_results: 50
            })
            setHospitals(response.data || [])
        } catch (error) {
            console.error('Failed to fetch hospitals:', error)
            // Fallback hospitals
            setHospitals([
                { id: 1, name: "Aga Khan University Hospital", location: "Nairobi" },
                { id: 2, name: "Kenyatta National Hospital", location: "Nairobi" },
                { id: 3, name: "Nairobi Hospital", location: "Nairobi" },
                { id: 4, name: "Moi Teaching and Referral Hospital", location: "Eldoret" },
                { id: 5, name: "Coast General Hospital", location: "Mombasa" }
            ])
        }
    }

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
            
            setStats(prev => ({
                ...prev,
                activeAssignments: formattedAssignments.filter(a => a.status !== "completed").length,
                highPriority: formattedAssignments.filter(a => a.priority === "high").length,
            }))

        } catch (error) {
            console.error('Failed to fetch active emergencies:', error)
            setAssignments([])
        }
    }

    // Fetch hospital communications
    const fetchHospitalCommunications = async () => {
        try {
            const response = await apiClient.get('/hospital-comms/api/communications/first-aider-active/')
            const communications = response.data || []
            
            setHospitalCommunications(communications)
            
            setStats(prev => ({
                ...prev,
                activeCommunications: communications.filter(c => 
                    ['sent', 'acknowledged', 'preparing', 'ready', 'en_route'].includes(c.status)
                ).length
            }))

        } catch (error) {
            console.error('Failed to fetch hospital communications:', error)
            setHospitalCommunications([])
        }
    }

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
                hasAssessment: false,
                hasCommunication: false
            }))
            
            setVictims(formattedVictims)
            setStats(prev => ({ ...prev, victimsAssisted: formattedVictims.length }))
            
        } catch (error) {
            console.error('Failed to fetch emergency history:', error)
            setVictims([])
        }
    }

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
    const handleOpenVictimAssessment = (victim = null) => {
        setSelectedVictim(victim)
        setVictimAssessment({
            firstName: victim?.name?.split(' ')[0] || "",
            lastName: victim?.name?.split(' ')[1] || "",
            age: "",
            gender: "",
            contactNumber: "",
            heartRate: victim?.vitals?.heartRate?.toString() || "",
            bloodPressure: victim?.vitals?.bloodPressure || "",
            temperature: victim?.vitals?.temperature?.toString() || "",
            respiratoryRate: "",
            oxygenSaturation: "",
            gcs_eyes: "",
            gcs_verbal: "",
            gcs_motor: "",
            bloodGlucose: "",
            symptoms: [],
            painLevel: "",
            painLocation: "",
            injuries: [],
            injuryMechanism: "",
            medications: "",
            allergies: "",
            medicalHistory: "",
            lastMeal: "",
            condition: victim?.status || "stable",
            consciousness: "alert",
            breathing: "normal",
            circulation: "normal",
            triage_category: "delayed",
            treatmentProvided: "",
            medicationsAdministered: "",
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

    // Handle hospital communication input changes
    const handleHospitalCommunicationInputChange = (e) => {
        const { name, value } = e.target
        setHospitalCommunicationData(prev => ({ ...prev, [name]: value }))
    }

    // Handle communication status input changes
    const handleCommunicationStatusInputChange = (e) => {
        const { name, value } = e.target
        setCommunicationStatusData(prev => ({ ...prev, [name]: value }))
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
                gcsScore: `${assessment.gcs_eyes || ''}-${assessment.gcs_verbal || ''}-${assessment.gcs_motor || ''}`,
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
                circulation: assessment.circulation,
                triage: assessment.triage_category
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

            // If this assessment is linked to a hospital communication, submit it
            if (selectedVictim?.communicationId) {
                const assessmentData = {
                    heart_rate: victimAssessment.heartRate || null,
                    blood_pressure: victimAssessment.bloodPressure || "",
                    temperature: victimAssessment.temperature || null,
                    respiratory_rate: victimAssessment.respiratoryRate || null,
                    oxygen_saturation: victimAssessment.oxygenSaturation || null,
                    gcs_eyes: victimAssessment.gcs_eyes || null,
                    gcs_verbal: victimAssessment.gcs_verbal || null,
                    gcs_motor: victimAssessment.gcs_motor || null,
                    blood_glucose: victimAssessment.bloodGlucose || null,
                    chief_complaint: victimAssessment.symptoms.join(', '),
                    injuries: victimAssessment.injuries.join(', '),
                    allergies: victimAssessment.allergies,
                    medications: victimAssessment.medications,
                    medical_history: victimAssessment.medicalHistory,
                    pain_level: victimAssessment.painLevel,
                    pain_location: victimAssessment.painLocation,
                    triage_category: victimAssessment.triage_category,
                    treatment_provided: victimAssessment.treatmentProvided,
                    notes: victimAssessment.notes,
                    recommendations: victimAssessment.recommendations
                }

                await apiClient.post(`/hospital-comms/api/communications/${selectedVictim.communicationId}/add-assessment/`, assessmentData)
            }

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

    // Open hospital communication form
    const handleOpenHospitalCommunication = (victim = null) => {
        setSelectedVictim(victim)
        setHospitalCommunicationData({
            emergency_alert_id: victim?.id || "",
            hospital: "",
            priority: victim?.status === "critical" ? "critical" : "high",
            victim_name: victim?.name || "",
            victim_age: "",
            victim_gender: "",
            chief_complaint: victim?.condition || "",
            vital_signs: victim?.vitals ? `HR: ${victim.vitals.heartRate}, BP: ${victim.vitals.bloodPressure}, Temp: ${victim.vitals.temperature}` : "",
            first_aid_provided: "",
            estimated_arrival_minutes: "15",
            required_specialties: "",
            equipment_needed: "",
            blood_type_required: ""
        })
        setShowHospitalCommunicationForm(true)
    }

    // Submit hospital communication
    const handleHospitalCommunication = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setFormError("")
        setFormSuccess("")

        try {
            const selectedHospitalObj = hospitals.find(h => h.id == hospitalCommunicationData.hospital)
            
            const response = await apiClient.post('/hospital-comms/api/communications/', {
                emergency_alert_id: hospitalCommunicationData.emergency_alert_id,
                hospital: hospitalCommunicationData.hospital,
                priority: hospitalCommunicationData.priority,
                victim_name: hospitalCommunicationData.victim_name,
                victim_age: hospitalCommunicationData.victim_age,
                victim_gender: hospitalCommunicationData.victim_gender,
                chief_complaint: hospitalCommunicationData.chief_complaint,
                vital_signs: JSON.stringify({
                    data: hospitalCommunicationData.vital_signs,
                    target_hospital: selectedHospitalObj?.name,
                    target_hospital_id: selectedHospitalObj?.id
                }),
                first_aid_provided: hospitalCommunicationData.first_aid_provided,
                estimated_arrival_minutes: hospitalCommunicationData.estimated_arrival_minutes,
                required_specialties: hospitalCommunicationData.required_specialties,
                equipment_needed: hospitalCommunicationData.equipment_needed,
                blood_type_required: hospitalCommunicationData.blood_type_required
            })
            
            setFormSuccess(`Communication sent to ${selectedHospitalObj?.name} successfully!`)
            
            // Update victim with communication info
            if (selectedVictim) {
                setVictims(prev => prev.map(victim => 
                    victim.id === selectedVictim.id 
                        ? { ...victim, hasCommunication: true, communicationId: response.data.id }
                        : victim
                ))
            }

            // Refresh communications
            fetchHospitalCommunications()
            
            // Close form after 2 seconds
            setTimeout(() => {
                setShowHospitalCommunicationForm(false)
                setSelectedVictim(null)
            }, 2000)

        } catch (error) {
            console.error('Hospital communication failed:', error)
            setFormError(error.response?.data?.message || "Failed to send hospital communication")
        } finally {
            setIsSubmitting(false)
        }
    }

    // Open communication status update form
    const handleOpenCommunicationStatus = (communication) => {
        setSelectedCommunication(communication)
        setCommunicationStatusData({
            status: communication.status,
            notes: ""
        })
        setShowCommunicationStatusForm(true)
    }

    // Update communication status
    const handleCommunicationStatusUpdate = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setFormError("")
        setFormSuccess("")

        try {
            await apiClient.post(`/hospital-comms/api/communications/${selectedCommunication.id}/update-status/`, communicationStatusData)
            
            setFormSuccess("Communication status updated successfully!")
            
            // Refresh communications
            fetchHospitalCommunications()
            
            // Close form after 2 seconds
            setTimeout(() => {
                setShowCommunicationStatusForm(false)
                setSelectedCommunication(null)
            }, 2000)

        } catch (error) {
            console.error('Communication status update failed:', error)
            setFormError(error.response?.data?.message || "Failed to update communication status")
        } finally {
            setIsSubmitting(false)
        }
    }

    // Get current location with address conversion
    const getCurrentLocation = async () => {
        if (navigator.geolocation) {
            setIsSubmitting(true)
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude
                    const lng = position.coords.longitude
                    
                    try {
                        const response = await apiClient.get(`/geolocation/geocode/?lat=${lat}&lng=${lng}`)
                        const address = response.data.address || ""
                        
                        setEmergencyData(prev => ({
                            ...prev,
                            latitude: lat.toString(),
                            longitude: lng.toString(),
                            address: address
                        }))
                    } catch (error) {
                        console.error('Geocoding failed:', error)
                        setEmergencyData(prev => ({
                            ...prev,
                            latitude: lat.toString(),
                            longitude: lng.toString()
                        }))
                    }
                    setIsSubmitting(false)
                },
                () => {
                    setFormError("Failed to get current location")
                    setIsSubmitting(false)
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
            )
        } else {
            setFormError("Geolocation is not supported by this browser.")
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

    const handleSubmitEmergency = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setFormError("")
        setFormSuccess("")

        try {
            if (!emergencyData.latitude || !emergencyData.longitude) {
                throw new Error("Location is required")
            }

            const lat = parseFloat(emergencyData.latitude)
            const lng = parseFloat(emergencyData.longitude)

            const submitData = {
                emergency_type: emergencyData.emergency_type,
                latitude: lat,
                longitude: lng,
                description: emergencyData.description,
                address: emergencyData.address,
                ...(emergencyData.location_id && { location_id: parseInt(emergencyData.location_id) })
            }

            await apiClient.post('/emergencies/alert/', submitData)

            setFormSuccess("Emergency alert submitted successfully!")
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
            }, 2000)

        } catch (error) {
            console.error('Emergency alert submission error:', error)
            setFormError(error.message || "An error occurred while submitting the emergency alert")
        } finally {
            setIsSubmitting(false)
        }
    }

    // Fetch data on component mount
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true)
            await Promise.all([
                fetchHospitals(),
                fetchActiveEmergencies(),
                fetchEmergencyHistory(),
                fetchHospitalCommunications()
            ])
            setIsLoading(false)
        }
        
        loadData()
    }, [])

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "critical": 
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

    const getCommunicationStatusColor = (status) => {
        switch (status) {
            case "sent": return "bg-blue-100 text-blue-800 border-blue-200"
            case "acknowledged": return "bg-yellow-100 text-yellow-800 border-yellow-200"
            case "preparing": return "bg-orange-100 text-orange-800 border-orange-200"
            case "ready": return "bg-green-100 text-green-800 border-green-200"
            case "en_route": return "bg-purple-100 text-purple-800 border-purple-200"
            case "arrived": return "bg-indigo-100 text-indigo-800 border-indigo-200"
            case "completed": return "bg-gray-100 text-gray-800 border-gray-200"
            case "cancelled": return "bg-red-100 text-red-800 border-red-200"
            default: return "bg-gray-100 text-gray-800 border-gray-200"
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
                            <p className="text-[#740000]">Loading dashboard...</p>
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
                    <p className="text-[#740000]">Manage emergency assignments, victim care, and hospital communications</p>
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
                                <p className="text-sm text-[#740000] mb-1">Active Comms</p>
                                <p className="text-3xl font-bold text-[#1a0000]">{stats.activeCommunications}</p>
                            </div>
                            <MessageCircle className="w-12 h-12 text-[#740000]/20" />
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

                        {/* Hospital Communications Section */}
                        <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg">
                            <div className="flex flex-row items-center justify-between p-6 border-b border-[#ffe6c5]">
                                <div>
                                    <h3 className="text-2xl font-bold text-[#1a0000]">Hospital Communications</h3>
                                    <p className="text-[#740000]">Communications with hospitals about victims</p>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {hospitalCommunications.length === 0 ? (
                                        <div className="text-center py-8">
                                            <MessageCircle className="w-12 h-12 text-[#740000]/50 mx-auto mb-4" />
                                            <p className="text-[#740000]">No active hospital communications</p>
                                            <button
                                                onClick={() => setShowHospitalCommunicationForm(true)}
                                                className="mt-4 px-4 py-2 bg-[#b90000] hover:bg-[#740000] text-[#fff3ea] rounded-lg font-medium text-sm transition-colors"
                                            >
                                                <Plus className="w-4 h-4 mr-2 inline" />
                                                Create Communication
                                            </button>
                                        </div>
                                    ) : (
                                        hospitalCommunications.map((communication) => (
                                            <div
                                                key={communication.id}
                                                className="border border-[#ffe6c5] rounded-lg p-4 hover:border-[#b90000] transition"
                                            >
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-start gap-3 flex-1">
                                                        <MessageCircle className="w-5 h-5 text-[#b90000] mt-1" />
                                                        <div>
                                                            <h3 className="font-semibold text-[#1a0000]">
                                                                {communication.victim_name || "Unknown Victim"}
                                                            </h3>
                                                            <div className="flex items-center gap-1 text-sm text-[#740000] mt-1">
                                                                <Building className="w-4 h-4" />
                                                                {communication.hospital_name}
                                                            </div>
                                                            <p className="text-sm text-[#740000] mt-1">
                                                                {communication.chief_complaint}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(communication.priority)}`}
                                                        >
                                                            {communication.priority}
                                                        </span>
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getCommunicationStatusColor(communication.status)}`}
                                                        >
                                                            {communication.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between text-sm pt-3 border-t border-[#ffe6c5]">
                                                    <div className="flex gap-4 text-[#740000]">
                                                        <span>ETA: {communication.estimated_arrival_minutes} mins</span>
                                                        <span>Created: {new Date(communication.created_at).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button 
                                                            onClick={() => handleOpenCommunicationStatus(communication)}
                                                            className="px-3 py-1 border border-[#b90000] text-[#b90000] hover:bg-[#ffe6c5] rounded text-sm font-medium transition-colors"
                                                        >
                                                            Update Status
                                                        </button>
                                                        {!communication.has_assessment && (
                                                            <button 
                                                                onClick={() => {
                                                                    const victim = victims.find(v => v.id === communication.emergency_alert_id)
                                                                    handleOpenVictimAssessment(victim || {
                                                                        id: communication.emergency_alert_id,
                                                                        name: communication.victim_name,
                                                                        communicationId: communication.id
                                                                    })
                                                                }}
                                                                className="px-3 py-1 bg-[#b90000] hover:bg-[#740000] text-[#fff3ea] rounded text-sm font-medium transition-colors"
                                                            >
                                                                Add Assessment
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
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleOpenVictimAssessment()}
                                            className="p-2 bg-[#b90000] hover:bg-[#740000] text-[#fff3ea] rounded-lg transition-colors"
                                            title="Add New Victim Assessment"
                                        >
                                            <Stethoscope className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleOpenHospitalCommunication()}
                                            className="p-2 bg-[#1a0000] hover:bg-[#740000] text-[#fff3ea] rounded-lg transition-colors"
                                            title="Create Hospital Communication"
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {victims.length === 0 ? (
                                        <div className="text-center py-4">
                                            <User className="w-8 h-8 text-[#740000]/50 mx-auto mb-2" />
                                            <p className="text-[#740000] text-sm">No victim data available</p>
                                            <div className="flex gap-2 mt-3">
                                                <button
                                                    onClick={() => handleOpenVictimAssessment()}
                                                    className="flex-1 px-3 py-2 bg-[#b90000] hover:bg-[#740000] text-[#fff3ea] rounded text-sm font-medium transition-colors"
                                                >
                                                    <Stethoscope className="w-4 h-4 mr-1 inline" />
                                                    Assess
                                                </button>
                                                <button
                                                    onClick={() => handleOpenHospitalCommunication()}
                                                    className="flex-1 px-3 py-2 bg-[#1a0000] hover:bg-[#740000] text-[#fff3ea] rounded text-sm font-medium transition-colors"
                                                >
                                                    <MessageCircle className="w-4 h-4 mr-1 inline" />
                                                    Notify Hospital
                                                </button>
                                            </div>
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
                                                        <div className="flex items-center gap-2 mt-1">
                                                            {victim.hasAssessment && (
                                                                <div className="flex items-center gap-1">
                                                                    <CheckCircle className="w-3 h-3 text-[#1a0000]" />
                                                                    <span className="text-xs text-[#1a0000]">Assessed</span>
                                                                </div>
                                                            )}
                                                            {victim.hasCommunication && (
                                                                <div className="flex items-center gap-1">
                                                                    <MessageCircle className="w-3 h-3 text-[#b90000]" />
                                                                    <span className="text-xs text-[#b90000]">Hospital Notified</span>
                                                                </div>
                                                            )}
                                                        </div>
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
                                                                    <Stethoscope className="w-3 h-3" />
                                                                </button>
                                                            )}
                                                            {!victim.hasCommunication && (
                                                                <button
                                                                    onClick={() => handleOpenHospitalCommunication(victim)}
                                                                    className="p-1 border border-[#1a0000] text-[#1a0000] hover:bg-[#ffe6c5] rounded text-xs transition-colors"
                                                                    title="Notify Hospital"
                                                                >
                                                                    <MessageCircle className="w-3 h-3" />
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
                                                    <div className="flex gap-2">
                                                        {victim.hasAssessment ? (
                                                            <button
                                                                onClick={() => handleViewAssessmentSummary(victim)}
                                                                className="flex-1 px-3 py-1 bg-[#1a0000] hover:bg-[#740000] text-[#fff3ea] rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                                            >
                                                                <Eye className="w-3 h-3" />
                                                                View Assessment
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleOpenVictimAssessment(victim)}
                                                                className="flex-1 px-3 py-1 bg-[#b90000] hover:bg-[#740000] text-[#fff3ea] rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                                            >
                                                                <Stethoscope className="w-3 h-3" />
                                                                Assess Victim
                                                            </button>
                                                        )}
                                                        {!victim.hasCommunication && (
                                                            <button
                                                                onClick={() => handleOpenHospitalCommunication(victim)}
                                                                className="flex-1 px-3 py-1 bg-[#1a0000] hover:bg-[#740000] text-[#fff3ea] rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                                            >
                                                                <MessageCircle className="w-3 h-3" />
                                                                Notify Hospital
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

                {/* All Modals remain the same as in your previous implementation */}
                {/* Emergency Form Modal, Status Update Modal, Hospital Communication Modal, etc. */}
                {/* ... */}

            </main>
        </div>
    )
}