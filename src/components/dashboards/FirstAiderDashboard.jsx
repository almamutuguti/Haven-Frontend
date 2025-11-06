"use client"

import { useState, useEffect } from "react"
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
        hospital_id: "",
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

    // Condition options
    const conditionOptions = [
        { value: "critical", label: "Critical" },
        { value: "serious", label: "Serious" },
        { value: "stable", label: "Stable" },
        { value: "guarded", label: "Guarded" }
    ]

    // Consciousness options
    const consciousnessOptions = [
        { value: "alert", label: "Alert" },
        { value: "verbal", label: "Responds to Verbal" },
        { value: "pain", label: "Responds to Pain" },
        { value: "unresponsive", label: "Unresponsive" }
    ]

    // Breathing options
    const breathingOptions = [
        { value: "normal", label: "Normal" },
        { value: "labored", label: "Labored" },
        { value: "shallow", label: "Shallow" },
        { value: "absent", label: "Absent" }
    ]

    // Circulation options
    const circulationOptions = [
        { value: "normal", label: "Normal" },
        { value: "weak", label: "Weak Pulse" },
        { value: "absent", label: "Absent Pulse" },
        { value: "irregular", label: "Irregular" }
    ]

    // GCS Eye options
    const gcsEyesOptions = [
        { value: "4", label: "4 - Spontaneous" },
        { value: "3", label: "3 - To Voice" },
        { value: "2", label: "2 - To Pain" },
        { value: "1", label: "1 - None" }
    ]

    // GCS Verbal options
    const gcsVerbalOptions = [
        { value: "5", label: "5 - Oriented" },
        { value: "4", label: "4 - Confused" },
        { value: "3", label: "3 - Inappropriate" },
        { value: "2", label: "2 - Incomprehensible" },
        { value: "1", label: "1 - None" }
    ]

    // GCS Motor options
    const gcsMotorOptions = [
        { value: "6", label: "6 - Obeys Commands" },
        { value: "5", label: "5 - Localizes Pain" },
        { value: "4", label: "4 - Withdraws from Pain" },
        { value: "3", label: "3 - Flexion to Pain" },
        { value: "2", label: "2 - Extension to Pain" },
        { value: "1", label: "1 - None" }
    ]

    // Pain level options
    const painLevelOptions = [
        { value: "0", label: "0 - No Pain" },
        { value: "1-3", label: "1-3 - Mild" },
        { value: "4-6", label: "4-6 - Moderate" },
        { value: "7-10", label: "7-10 - Severe" }
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

    // Fetch hospital communications for this first aider
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
            await apiClient.post(`/emergencies/${selectedAssignment.id}/status/`, {
                status: statusUpdateData.status,
                details: statusUpdateData.details
            })

            setFormSuccess("Status updated successfully!")
            
            fetchActiveEmergencies()
            
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
        const gcsScore = `${assessment.gcs_eyes || 0} + ${assessment.gcs_verbal || 0} + ${assessment.gcs_motor || 0} = ${(parseInt(assessment.gcs_eyes) || 0) + (parseInt(assessment.gcs_verbal) || 0) + (parseInt(assessment.gcs_motor) || 0)}`
        
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
                gcsScore: gcsScore,
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
            const summary = generateAssessmentSummary(victimAssessment, selectedVictim)
            setAssessmentSummary(summary)

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
            hospital_id: "",
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
            if (!hospitalCommunicationData.hospital_id) {
                throw new Error("Please select a hospital")
            }

            const selectedHospital = hospitals.find(h => h.id == hospitalCommunicationData.hospital_id)
            
            if (!selectedHospital) {
                throw new Error("Selected hospital not found")
            }

            const communicationData = {
                emergency_alert_id: hospitalCommunicationData.emergency_alert_id,
                hospital_id: hospitalCommunicationData.hospital_id,
                hospital_name: selectedHospital.name,
                priority: hospitalCommunicationData.priority,
                victim_name: hospitalCommunicationData.victim_name,
                victim_age: hospitalCommunicationData.victim_age,
                victim_gender: hospitalCommunicationData.victim_gender,
                chief_complaint: hospitalCommunicationData.chief_complaint,
                vital_signs: JSON.stringify({
                    data: hospitalCommunicationData.vital_signs,
                    target_hospital: selectedHospital.name,
                    target_hospital_id: selectedHospital.id
                }),
                first_aid_provided: hospitalCommunicationData.first_aid_provided,
                estimated_arrival_minutes: hospitalCommunicationData.estimated_arrival_minutes,
                required_specialties: hospitalCommunicationData.required_specialties,
                equipment_needed: hospitalCommunicationData.equipment_needed,
                blood_type_required: hospitalCommunicationData.blood_type_required
            }
            
            const response = await apiClient.post('/hospital-comms/api/communications/', communicationData)
            
            setFormSuccess(`Communication sent to ${selectedHospital.name} successfully!`)
            
            if (selectedVictim) {
                setVictims(prev => prev.map(victim => 
                    victim.id === selectedVictim.id 
                        ? { 
                            ...victim, 
                            hasCommunication: true, 
                            communicationId: response.data.id,
                            targetHospital: selectedHospital.name
                        }
                        : victim
                ))
            }

            await fetchHospitalCommunications()
            
            setTimeout(() => {
                setShowHospitalCommunicationForm(false)
                setSelectedVictim(null)
            }, 2000)

        } catch (error) {
            console.error('Hospital communication failed:', error)
            setFormError(error.response?.data?.message || error.message || "Failed to send hospital communication")
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
            
            await fetchHospitalCommunications()
            
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

                {/* Emergency Form Modal */}
                {showEmergencyForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-[#fff3ea] border border-[#ffe6c5] rounded-lg w-full max-w-md">
                            <div className="flex items-center justify-between p-6 border-b border-[#ffe6c5]">
                                <h2 className="text-2xl font-bold text-[#1a0000]">Report Emergency</h2>
                                <button
                                    onClick={() => setShowEmergencyForm(false)}
                                    className="p-2 hover:bg-[#ffe6c5] rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-[#1a0000]" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmitEmergency} className="p-6 space-y-4">
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

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#1a0000]">
                                        Emergency Type
                                    </label>
                                    <select
                                        name="emergency_type"
                                        value={emergencyData.emergency_type}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                    >
                                        {emergencyTypes.map(type => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#1a0000]">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={emergencyData.description}
                                        onChange={handleInputChange}
                                        rows={3}
                                        placeholder="Describe the emergency situation..."
                                        className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent resize-vertical"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-sm font-medium text-[#1a0000]">
                                            Location
                                        </label>
                                        <button
                                            type="button"
                                            onClick={getCurrentLocation}
                                            disabled={isSubmitting}
                                            className="text-sm text-[#b90000] hover:text-[#740000] flex items-center gap-1"
                                        >
                                            <Compass className="w-4 h-4" />
                                            Use Current Location
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        name="address"
                                        value={emergencyData.address}
                                        onChange={handleInputChange}
                                        placeholder="Address or location"
                                        className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[#1a0000]">
                                            Latitude
                                        </label>
                                        <input
                                            type="text"
                                            name="latitude"
                                            value={emergencyData.latitude}
                                            onChange={handleInputChange}
                                            placeholder="e.g., -1.2921"
                                            className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[#1a0000]">
                                            Longitude
                                        </label>
                                        <input
                                            type="text"
                                            name="longitude"
                                            value={emergencyData.longitude}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 36.8219"
                                            className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                        />
                                    </div>
                                </div>

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
                                        className="flex-1 px-4 py-2 bg-[#b90000] hover:bg-[#740000] text-[#fff3ea] rounded-lg font-medium transition-colors disabled:opacity-50"
                                    >
                                        {isSubmitting ? "Submitting..." : "Report Emergency"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Status Update Modal */}
                {showStatusUpdateForm && selectedAssignment && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-[#fff3ea] border border-[#ffe6c5] rounded-lg w-full max-w-md">
                            <div className="flex items-center justify-between p-6 border-b border-[#ffe6c5]">
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
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#1a0000]">
                                        Status
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

                                <div className="flex gap-4 pt-4">
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

                {/* Victim Assessment Modal */}
                {showVictimAssessmentForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-[#fff3ea] border border-[#ffe6c5] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between p-6 border-b border-[#ffe6c5]">
                                <h2 className="text-2xl font-bold text-[#1a0000]">
                                    {selectedVictim ? 'Update Victim Assessment' : 'New Victim Assessment'}
                                </h2>
                                <button
                                    onClick={() => setShowVictimAssessmentForm(false)}
                                    className="p-2 hover:bg-[#ffe6c5] rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-[#1a0000]" />
                                </button>
                            </div>
                            <form onSubmit={handleVictimAssessment} className="p-6 space-y-6">
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

                                {/* Personal Information */}
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[#1a0000]">
                                            First Name
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={victimAssessment.firstName}
                                            onChange={handleAssessmentInputChange}
                                            className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[#1a0000]">
                                            Last Name
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={victimAssessment.lastName}
                                            onChange={handleAssessmentInputChange}
                                            className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
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
                                            className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[#1a0000]">
                                            Gender
                                        </label>
                                        <select
                                            name="gender"
                                            value={victimAssessment.gender}
                                            onChange={handleAssessmentInputChange}
                                            className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                        >
                                            <option value="">Select Gender</option>
                                            {genderOptions.map(gender => (
                                                <option key={gender.value} value={gender.value}>
                                                    {gender.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[#1a0000]">
                                            Contact Number
                                        </label>
                                        <input
                                            type="text"
                                            name="contactNumber"
                                            value={victimAssessment.contactNumber}
                                            onChange={handleAssessmentInputChange}
                                            className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* Vital Signs */}
                                <div className="border-t border-[#ffe6c5] pt-6">
                                    <h3 className="text-lg font-bold text-[#1a0000] mb-4">Vital Signs</h3>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[#1a0000]">
                                                Heart Rate (bpm)
                                            </label>
                                            <input
                                                type="number"
                                                name="heartRate"
                                                value={victimAssessment.heartRate}
                                                onChange={handleAssessmentInputChange}
                                                className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
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
                                                className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
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
                                                className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[#1a0000]">
                                                Respiratory Rate
                                            </label>
                                            <input
                                                type="number"
                                                name="respiratoryRate"
                                                value={victimAssessment.respiratoryRate}
                                                onChange={handleAssessmentInputChange}
                                                className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[#1a0000]">
                                                Oxygen Saturation (%)
                                            </label>
                                            <input
                                                type="number"
                                                name="oxygenSaturation"
                                                value={victimAssessment.oxygenSaturation}
                                                onChange={handleAssessmentInputChange}
                                                className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
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
                                                className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Glasgow Coma Scale */}
                                <div className="border-t border-[#ffe6c5] pt-6">
                                    <h3 className="text-lg font-bold text-[#1a0000] mb-4">Glasgow Coma Scale</h3>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[#1a0000]">
                                                Eyes Response
                                            </label>
                                            <select
                                                name="gcs_eyes"
                                                value={victimAssessment.gcs_eyes}
                                                onChange={handleAssessmentInputChange}
                                                className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                            >
                                                <option value="">Select</option>
                                                {gcsEyesOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[#1a0000]">
                                                Verbal Response
                                            </label>
                                            <select
                                                name="gcs_verbal"
                                                value={victimAssessment.gcs_verbal}
                                                onChange={handleAssessmentInputChange}
                                                className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                            >
                                                <option value="">Select</option>
                                                {gcsVerbalOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[#1a0000]">
                                                Motor Response
                                            </label>
                                            <select
                                                name="gcs_motor"
                                                value={victimAssessment.gcs_motor}
                                                onChange={handleAssessmentInputChange}
                                                className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                            >
                                                <option value="">Select</option>
                                                {gcsMotorOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Symptoms & Injuries */}
                                <div className="border-t border-[#ffe6c5] pt-6">
                                    <h3 className="text-lg font-bold text-[#1a0000] mb-4">Symptoms & Injuries</h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#1a0000] mb-2">
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
                                                        />
                                                        <span className="text-sm text-[#1a0000]">{symptom}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#1a0000] mb-2">
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
                                                        />
                                                        <span className="text-sm text-[#1a0000]">{injury}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Pain Assessment */}
                                <div className="border-t border-[#ffe6c5] pt-6">
                                    <h3 className="text-lg font-bold text-[#1a0000] mb-4">Pain Assessment</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[#1a0000]">
                                                Pain Level
                                            </label>
                                            <select
                                                name="painLevel"
                                                value={victimAssessment.painLevel}
                                                onChange={handleAssessmentInputChange}
                                                className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
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
                                                className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Medical History */}
                                <div className="border-t border-[#ffe6c5] pt-6">
                                    <h3 className="text-lg font-bold text-[#1a0000] mb-4">Medical History</h3>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[#1a0000]">
                                                Current Medications
                                            </label>
                                            <textarea
                                                name="medications"
                                                value={victimAssessment.medications}
                                                onChange={handleAssessmentInputChange}
                                                rows={2}
                                                placeholder="List current medications..."
                                                className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent resize-vertical"
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
                                                placeholder="List any allergies..."
                                                className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent resize-vertical"
                                            />
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
                                                placeholder="Relevant medical history..."
                                                className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent resize-vertical"
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
                                                placeholder="When did they last eat or drink?"
                                                className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Assessment & Treatment */}
                                <div className="border-t border-[#ffe6c5] pt-6">
                                    <h3 className="text-lg font-bold text-[#1a0000] mb-4">Assessment & Treatment</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[#1a0000]">
                                                Overall Condition
                                            </label>
                                            <select
                                                name="condition"
                                                value={victimAssessment.condition}
                                                onChange={handleAssessmentInputChange}
                                                className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                            >
                                                {conditionOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[#1a0000]">
                                                Consciousness Level
                                            </label>
                                            <select
                                                name="consciousness"
                                                value={victimAssessment.consciousness}
                                                onChange={handleAssessmentInputChange}
                                                className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
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
                                                Triage Category
                                            </label>
                                            <select
                                                name="triage_category"
                                                value={victimAssessment.triage_category}
                                                onChange={handleAssessmentInputChange}
                                                className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                            >
                                                {triageOptions.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-4 mt-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[#1a0000]">
                                                Treatment Provided
                                            </label>
                                            <textarea
                                                name="treatmentProvided"
                                                value={victimAssessment.treatmentProvided}
                                                onChange={handleAssessmentInputChange}
                                                rows={3}
                                                placeholder="Describe first aid and treatments provided..."
                                                className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent resize-vertical"
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
                                                placeholder="List any medications administered..."
                                                className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent resize-vertical"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Notes & Recommendations */}
                                <div className="border-t border-[#ffe6c5] pt-6">
                                    <h3 className="text-lg font-bold text-[#1a0000] mb-4">Notes & Recommendations</h3>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-[#1a0000]">
                                                Assessment Notes
                                            </label>
                                            <textarea
                                                name="notes"
                                                value={victimAssessment.notes}
                                                onChange={handleAssessmentInputChange}
                                                rows={3}
                                                placeholder="Additional assessment notes..."
                                                className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent resize-vertical"
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
                                                rows={3}
                                                placeholder="Recommendations for further care..."
                                                className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent resize-vertical"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-6 border-t border-[#ffe6c5]">
                                    <button
                                        type="button"
                                        onClick={() => setShowVictimAssessmentForm(false)}
                                        className="flex-1 px-4 py-2 border border-[#ffe6c5] text-[#1a0000] hover:bg-[#ffe6c5] rounded-lg font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 px-4 py-2 bg-[#b90000] hover:bg-[#740000] text-[#fff3ea] rounded-lg font-medium transition-colors disabled:opacity-50"
                                    >
                                        {isSubmitting ? "Submitting..." : "Save Assessment"}
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
                                {/* Header */}
                                <div className="bg-[#ffe6c5] p-4 rounded-lg">
                                    <h3 className="text-xl font-bold text-[#1a0000]">{assessmentSummary.victimName}</h3>
                                    <p className="text-[#740000]">Assessment completed: {assessmentSummary.timestamp}</p>
                                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                                        assessmentSummary.priority === "High" 
                                            ? "bg-[#b90000]/10 text-[#b90000] border border-[#b90000]/20"
                                            : assessmentSummary.priority === "Medium"
                                            ? "bg-[#740000]/10 text-[#740000] border border-[#740000]/20"
                                            : "bg-[#1a0000]/10 text-[#1a0000] border border-[#1a0000]/20"
                                    }`}>
                                        Priority: {assessmentSummary.priority}
                                    </div>
                                </div>

                                {/* Personal Information */}
                                <div>
                                    <h4 className="text-lg font-semibold text-[#1a0000] mb-3">Personal Information</h4>
                                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <span className="text-[#740000]">Age:</span>
                                            <p className="text-[#1a0000] font-medium">{assessmentSummary.personalInfo.age || 'Not specified'}</p>
                                        </div>
                                        <div>
                                            <span className="text-[#740000]">Gender:</span>
                                            <p className="text-[#1a0000] font-medium">{assessmentSummary.personalInfo.gender || 'Not specified'}</p>
                                        </div>
                                        <div>
                                            <span className="text-[#740000]">Contact:</span>
                                            <p className="text-[#1a0000] font-medium">{assessmentSummary.personalInfo.contactNumber || 'Not specified'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Vital Signs */}
                                <div>
                                    <h4 className="text-lg font-semibold text-[#1a0000] mb-3">Vital Signs</h4>
                                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <span className="text-[#740000]">Heart Rate:</span>
                                            <p className="text-[#1a0000] font-medium">{assessmentSummary.vitalSigns.heartRate || 'N/A'} bpm</p>
                                        </div>
                                        <div>
                                            <span className="text-[#740000]">Blood Pressure:</span>
                                            <p className="text-[#1a0000] font-medium">{assessmentSummary.vitalSigns.bloodPressure || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <span className="text-[#740000]">Temperature:</span>
                                            <p className="text-[#1a0000] font-medium">{assessmentSummary.vitalSigns.temperature || 'N/A'} °C</p>
                                        </div>
                                        <div>
                                            <span className="text-[#740000]">Respiratory Rate:</span>
                                            <p className="text-[#1a0000] font-medium">{assessmentSummary.vitalSigns.respiratoryRate || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <span className="text-[#740000]">Oxygen Saturation:</span>
                                            <p className="text-[#1a0000] font-medium">{assessmentSummary.vitalSigns.oxygenSaturation || 'N/A'}%</p>
                                        </div>
                                        <div>
                                            <span className="text-[#740000]">GCS Score:</span>
                                            <p className="text-[#1a0000] font-medium">{assessmentSummary.vitalSigns.gcsScore || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Symptoms & Injuries */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-lg font-semibold text-[#1a0000] mb-3">Symptoms</h4>
                                        {assessmentSummary.symptoms.length > 0 ? (
                                            <ul className="list-disc list-inside text-sm text-[#1a0000] space-y-1">
                                                {assessmentSummary.symptoms.map((symptom, index) => (
                                                    <li key={index}>{symptom}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-[#740000]">No symptoms reported</p>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-[#1a0000] mb-3">Injuries</h4>
                                        {assessmentSummary.injuries.length > 0 ? (
                                            <ul className="list-disc list-inside text-sm text-[#1a0000] space-y-1">
                                                {assessmentSummary.injuries.map((injury, index) => (
                                                    <li key={index}>{injury}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-[#740000]">No injuries reported</p>
                                        )}
                                    </div>
                                </div>

                                {/* Assessment */}
                                <div>
                                    <h4 className="text-lg font-semibold text-[#1a0000] mb-3">Clinical Assessment</h4>
                                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-[#740000]">Condition:</span>
                                            <p className="text-[#1a0000] font-medium capitalize">{assessmentSummary.assessment.condition}</p>
                                        </div>
                                        <div>
                                            <span className="text-[#740000]">Consciousness:</span>
                                            <p className="text-[#1a0000] font-medium capitalize">{assessmentSummary.assessment.consciousness}</p>
                                        </div>
                                        <div>
                                            <span className="text-[#740000]">Breathing:</span>
                                            <p className="text-[#1a0000] font-medium capitalize">{assessmentSummary.assessment.breathing}</p>
                                        </div>
                                        <div>
                                            <span className="text-[#740000]">Circulation:</span>
                                            <p className="text-[#1a0000] font-medium capitalize">{assessmentSummary.assessment.circulation}</p>
                                        </div>
                                        <div>
                                            <span className="text-[#740000]">Triage Category:</span>
                                            <p className="text-[#1a0000] font-medium capitalize">{assessmentSummary.assessment.triage}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Treatment & Notes */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-lg font-semibold text-[#1a0000] mb-3">Treatment Provided</h4>
                                        <p className="text-sm text-[#1a0000] whitespace-pre-wrap">
                                            {assessmentSummary.treatment.provided || 'No treatment documented'}
                                        </p>
                                        {assessmentSummary.treatment.medications && (
                                            <div className="mt-2">
                                                <span className="text-[#740000] text-sm">Medications:</span>
                                                <p className="text-sm text-[#1a0000] whitespace-pre-wrap">
                                                    {assessmentSummary.treatment.medications}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-[#1a0000] mb-3">Notes & Recommendations</h4>
                                        <div className="space-y-2">
                                            {assessmentSummary.notes && (
                                                <div>
                                                    <span className="text-[#740000] text-sm">Notes:</span>
                                                    <p className="text-sm text-[#1a0000] whitespace-pre-wrap">{assessmentSummary.notes}</p>
                                                </div>
                                            )}
                                            {assessmentSummary.recommendations && (
                                                <div>
                                                    <span className="text-[#740000] text-sm">Recommendations:</span>
                                                    <p className="text-sm text-[#1a0000] whitespace-pre-wrap">{assessmentSummary.recommendations}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-6 border-t border-[#ffe6c5]">
                                    <button
                                        onClick={() => setShowAssessmentSummary(false)}
                                        className="flex-1 px-4 py-2 border border-[#ffe6c5] text-[#1a0000] hover:bg-[#ffe6c5] rounded-lg font-medium transition-colors"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowAssessmentSummary(false);
                                            handleOpenHospitalCommunication(selectedVictim);
                                        }}
                                        className="flex-1 px-4 py-2 bg-[#b90000] hover:bg-[#740000] text-[#fff3ea] rounded-lg font-medium transition-colors"
                                    >
                                        Send to Hospital
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Hospital Communication Modal */}
                {showHospitalCommunicationForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-[#fff3ea] border border-[#ffe6c5] rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between p-6 border-b border-[#ffe6c5]">
                                <h2 className="text-2xl font-bold text-[#1a0000]">Send Hospital Communication</h2>
                                <button
                                    onClick={() => setShowHospitalCommunicationForm(false)}
                                    className="p-2 hover:bg-[#ffe6c5] rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-[#1a0000]" />
                                </button>
                            </div>
                            <form onSubmit={handleHospitalCommunication} className="p-6 space-y-4">
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

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[#1a0000]">
                                            Select Hospital *
                                        </label>
                                        <select
                                            name="hospital_id"
                                            value={hospitalCommunicationData.hospital_id}
                                            onChange={handleHospitalCommunicationInputChange}
                                            className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                            required
                                        >
                                            <option value="">Choose a hospital</option>
                                            {hospitals.map(hospital => (
                                                <option key={hospital.id} value={hospital.id}>
                                                    {hospital.name} - {hospital.location}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[#1a0000]">
                                            Priority
                                        </label>
                                        <select
                                            name="priority"
                                            value={hospitalCommunicationData.priority}
                                            onChange={handleHospitalCommunicationInputChange}
                                            className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                        >
                                            {priorityOptions.map(priority => (
                                                <option key={priority.value} value={priority.value}>
                                                    {priority.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[#1a0000]">
                                            Victim Name
                                        </label>
                                        <input
                                            type="text"
                                            name="victim_name"
                                            value={hospitalCommunicationData.victim_name}
                                            onChange={handleHospitalCommunicationInputChange}
                                            placeholder="Full name"
                                            className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[#1a0000]">
                                            Age
                                        </label>
                                        <input
                                            type="number"
                                            name="victim_age"
                                            value={hospitalCommunicationData.victim_age}
                                            onChange={handleHospitalCommunicationInputChange}
                                            placeholder="Age"
                                            className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[#1a0000]">
                                            Gender
                                        </label>
                                        <select
                                            name="victim_gender"
                                            value={hospitalCommunicationData.victim_gender}
                                            onChange={handleHospitalCommunicationInputChange}
                                            className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                        >
                                            <option value="">Select</option>
                                            {genderOptions.map(gender => (
                                                <option key={gender.value} value={gender.value}>
                                                    {gender.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#1a0000]">
                                        Chief Complaint
                                    </label>
                                    <textarea
                                        name="chief_complaint"
                                        value={hospitalCommunicationData.chief_complaint}
                                        onChange={handleHospitalCommunicationInputChange}
                                        rows={2}
                                        placeholder="Primary symptoms or injuries..."
                                        className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent resize-vertical"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#1a0000]">
                                        Vital Signs
                                    </label>
                                    <textarea
                                        name="vital_signs"
                                        value={hospitalCommunicationData.vital_signs}
                                        onChange={handleHospitalCommunicationInputChange}
                                        rows={2}
                                        placeholder="Heart rate, BP, temperature, etc..."
                                        className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent resize-vertical"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#1a0000]">
                                        First Aid Provided
                                    </label>
                                    <textarea
                                        name="first_aid_provided"
                                        value={hospitalCommunicationData.first_aid_provided}
                                        onChange={handleHospitalCommunicationInputChange}
                                        rows={2}
                                        placeholder="First aid treatments administered..."
                                        className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent resize-vertical"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[#1a0000]">
                                            Estimated Arrival (minutes)
                                        </label>
                                        <input
                                            type="number"
                                            name="estimated_arrival_minutes"
                                            value={hospitalCommunicationData.estimated_arrival_minutes}
                                            onChange={handleHospitalCommunicationInputChange}
                                            className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[#1a0000]">
                                            Blood Type Required
                                        </label>
                                        <input
                                            type="text"
                                            name="blood_type_required"
                                            value={hospitalCommunicationData.blood_type_required}
                                            onChange={handleHospitalCommunicationInputChange}
                                            placeholder="e.g., O+"
                                            className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#1a0000]">
                                        Required Specialties
                                    </label>
                                    <input
                                        type="text"
                                        name="required_specialties"
                                        value={hospitalCommunicationData.required_specialties}
                                        onChange={handleHospitalCommunicationInputChange}
                                        placeholder="e.g., Trauma, Cardiology, Neurology"
                                        className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#1a0000]">
                                        Equipment Needed
                                    </label>
                                    <input
                                        type="text"
                                        name="equipment_needed"
                                        value={hospitalCommunicationData.equipment_needed}
                                        onChange={handleHospitalCommunicationInputChange}
                                        placeholder="e.g., Ventilator, Defibrillator, CT Scan"
                                        className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowHospitalCommunicationForm(false)}
                                        className="flex-1 px-4 py-2 border border-[#ffe6c5] text-[#1a0000] hover:bg-[#ffe6c5] rounded-lg font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 px-4 py-2 bg-[#b90000] hover:bg-[#740000] text-[#fff3ea] rounded-lg font-medium transition-colors disabled:opacity-50"
                                    >
                                        {isSubmitting ? "Sending..." : "Send to Hospital"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Communication Status Update Modal */}
                {showCommunicationStatusForm && selectedCommunication && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-[#fff3ea] border border-[#ffe6c5] rounded-lg w-full max-w-md">
                            <div className="flex items-center justify-between p-6 border-b border-[#ffe6c5]">
                                <h2 className="text-2xl font-bold text-[#1a0000]">Update Communication Status</h2>
                                <button
                                    onClick={() => setShowCommunicationStatusForm(false)}
                                    className="p-2 hover:bg-[#ffe6c5] rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-[#1a0000]" />
                                </button>
                            </div>
                            <form onSubmit={handleCommunicationStatusUpdate} className="p-6 space-y-4">
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
                                    <h3 className="font-semibold text-[#1a0000] mb-2">{selectedCommunication.victim_name}</h3>
                                    <p className="text-sm text-[#740000]">Hospital: {selectedCommunication.hospital_name}</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#1a0000]">
                                        Status
                                    </label>
                                    <select
                                        name="status"
                                        value={communicationStatusData.status}
                                        onChange={handleCommunicationStatusInputChange}
                                        className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                    >
                                        {communicationStatusOptions.map(status => (
                                            <option key={status.value} value={status.value}>
                                                {status.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#1a0000]">
                                        Notes
                                    </label>
                                    <textarea
                                        name="notes"
                                        value={communicationStatusData.notes}
                                        onChange={handleCommunicationStatusInputChange}
                                        rows={3}
                                        placeholder="Additional notes about the status update..."
                                        className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent resize-vertical"
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowCommunicationStatusForm(false)}
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