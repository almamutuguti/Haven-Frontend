// Patients.jsx
"use client"
import { useState, useEffect } from "react"
import { Sidebar } from "../../../SideBar"
import { Users, Eye, X, CheckCircle, AlertCircle, Stethoscope, User, Activity } from "lucide-react"
import { apiClient } from "../../utils/api"
import { useAuth } from "../../../context/AuthContext"

export default function Patients() {
    const [patients, setPatients] = useState([])
    const [selectedPatient, setSelectedPatient] = useState(null)
    const [showPatientDetails, setShowPatientDetails] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [notification, setNotification] = useState({ show: false, message: '', type: '' })
    const { user } = useAuth()

    // Show notification
    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type })
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' })
        }, 5000)
    }

    // Fetch patients from hospital communications
    const fetchPatients = async () => {
        try {
            setIsLoading(true)
            
            // Get hospital communications for current hospital
            const response = await apiClient.get('/hospital-comms/api/communications/')
            let communications = response.data || []
            
            // Filter communications for current hospital and arrived patients
            const hospitalPatients = communications.filter(comm => 
                (comm.hospital_id === user?.hospital?.id || comm.hospital?.id === user?.hospital?.id) &&
                comm.status === 'arrived' &&
                comm.victim_name
            )

            // Transform to patient records
            const patientRecords = hospitalPatients.map(comm => ({
                id: `patient-${comm.id}`,
                name: comm.victim_name,
                age: comm.victim_age || 'N/A',
                gender: comm.victim_gender || 'Unknown',
                condition: comm.chief_complaint || 'Emergency condition',
                status: 'active',
                admittedAt: new Date(comm.updated_at).toLocaleDateString(),
                communicationId: comm.id,
                emergencyAlertId: comm.emergency_alert_id,
                vitalSigns: comm.vital_signs || {},
                priority: comm.priority,
                hasAssessment: comm.has_assessment || false,
                assessmentData: comm.assessment_data || {},
                firstAiderName: comm.first_aider_name,
                emergencyType: comm.chief_complaint,
                arrivalTime: comm.estimated_arrival_minutes ? `ETA: ${comm.estimated_arrival_minutes} mins` : 'Arrival time unknown'
            }))

            setPatients(patientRecords)
        } catch (error) {
            console.error('Failed to fetch patients:', error)
            showNotification('Failed to load patients. Please try again.', 'error')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (user?.hospital) {
            fetchPatients()
        }
    }, [user])

    // Handle patient discharge
    const handleDischarge = async (patient) => {
        try {
            // Update communication status to completed
            await apiClient.post(`/hospital-comms/api/communications/${patient.communicationId}/update-status/`, {
                status: 'completed',
                notes: `Patient ${patient.name} discharged from hospital`
            })

            // Remove patient from local state
            setPatients(prev => prev.filter(p => p.id !== patient.id))
            
            showNotification(`Patient ${patient.name} discharged successfully!`, 'success')
        } catch (error) {
            console.error('Failed to discharge patient:', error)
            showNotification('Failed to discharge patient. Please try again.', 'error')
        }
    }

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case "critical":
                return "bg-[#b90000]/10 text-[#b90000] border-[#b90000]/20"
            case "stable":
                return "bg-green-100 text-green-800 border-green-200"
            case "active":
                return "bg-blue-100 text-blue-800 border-blue-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    // Format vital signs
    const formatVitalSigns = (vitalSigns) => {
        if (!vitalSigns) return 'N/A'
        if (typeof vitalSigns === 'string') return vitalSigns
        
        const parts = []
        if (vitalSigns.heartRate) parts.push(`HR: ${vitalSigns.heartRate}bpm`)
        if (vitalSigns.bloodPressure) parts.push(`BP: ${vitalSigns.bloodPressure}`)
        if (vitalSigns.temperature) parts.push(`Temp: ${vitalSigns.temperature}°C`)
        return parts.join(', ') || 'Vitals recorded'
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#fff3ea] via-[#fff3ea] to-[#ffe6c5]">
                <Sidebar />
                <main className="ml-64 px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="w-8 h-8 border-4 border-[#b90000] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-[#740000]">Loading patients...</p>
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fff3ea] via-[#fff3ea] to-[#ffe6c5]">
            <Sidebar />

            {/* Notification System */}
            {notification.show && (
                <div className={`fixed top-4 right-4 z-50 max-w-sm w-full p-4 rounded-lg shadow-lg border ${
                    notification.type === 'error' 
                        ? 'bg-red-50 border-red-200 text-red-800' 
                        : 'bg-green-50 border-green-200 text-green-800'
                }`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            {notification.type === 'error' ? (
                                <AlertCircle className="w-5 h-5 mr-2" />
                            ) : (
                                <CheckCircle className="w-5 h-5 mr-2" />
                            )}
                            <p className="text-sm font-medium">{notification.message}</p>
                        </div>
                        <button
                            onClick={() => setNotification({ show: false, message: '', type: '' })}
                            className="ml-4 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            <main className="ml-64 px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-[#1a0000] mb-2">Patient Management</h1>
                    <p className="text-[#740000] text-sm sm:text-base">
                        Manage patients currently admitted to {user?.hospital?.name || 'the hospital'}
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[#740000] mb-1">Total Patients</p>
                                <p className="text-2xl font-bold text-[#1a0000]">{patients.length}</p>
                            </div>
                            <Users className="w-8 h-8 text-[#b90000]/20" />
                        </div>
                    </div>
                    <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[#740000] mb-1">Critical Cases</p>
                                <p className="text-2xl font-bold text-[#b90000]">
                                    {patients.filter(p => p.priority === 'critical').length}
                                </p>
                            </div>
                            <AlertCircle className="w-8 h-8 text-[#b90000]/20" />
                        </div>
                    </div>
                    <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[#740000] mb-1">With Assessments</p>
                                <p className="text-2xl font-bold text-[#1a0000]">
                                    {patients.filter(p => p.hasAssessment).length}
                                </p>
                            </div>
                            <Stethoscope className="w-8 h-8 text-[#b90000]/20" />
                        </div>
                    </div>
                    <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[#740000] mb-1">Stable Patients</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {patients.filter(p => p.status === 'stable').length}
                                </p>
                            </div>
                            <User className="w-8 h-8 text-green-600/20" />
                        </div>
                    </div>
                </div>

                {/* Patients List */}
                <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg">
                    <div className="p-6 border-b border-[#ffe6c5]">
                        <h2 className="text-xl font-bold text-[#1a0000]">Current Patients</h2>
                        <p className="text-[#740000] text-sm">
                            Patients currently admitted and under care
                        </p>
                    </div>
                    
                    <div className="p-6">
                        {patients.length === 0 ? (
                            <div className="text-center py-8">
                                <Users className="w-12 h-12 text-[#740000]/50 mx-auto mb-4" />
                                <p className="text-[#740000] text-lg">No patients currently admitted</p>
                                <p className="text-[#740000] text-sm mt-2">
                                    Patients will appear here when they arrive at the hospital
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {patients.map((patient) => (
                                    <div
                                        key={patient.id}
                                        className="border border-[#ffe6c5] rounded-lg p-4 hover:border-[#b90000] transition"
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-3 gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="font-semibold text-[#1a0000] text-lg">
                                                            {patient.name}
                                                        </h3>
                                                        <p className="text-[#740000] text-sm">
                                                            {patient.age} years old • {patient.gender}
                                                        </p>
                                                    </div>
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(patient.status)}`}
                                                    >
                                                        {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                                                    </span>
                                                </div>
                                                
                                                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-[#740000]">
                                                    <div>
                                                        <strong>Condition:</strong> {patient.condition}
                                                    </div>
                                                    <div>
                                                        <strong>Admitted:</strong> {patient.admittedAt}
                                                    </div>
                                                    <div>
                                                        <strong>First Aider:</strong> {patient.firstAiderName}
                                                    </div>
                                                    <div>
                                                        <strong>Emergency ID:</strong> {patient.emergencyAlertId || 'N/A'}
                                                    </div>
                                                </div>

                                                {patient.vitalSigns && Object.keys(patient.vitalSigns).length > 0 && (
                                                    <div className="mt-2">
                                                        <p className="text-sm text-[#740000]">
                                                            <strong>Vital Signs:</strong> {formatVitalSigns(patient.vitalSigns)}
                                                        </p>
                                                    </div>
                                                )}

                                                {patient.hasAssessment && (
                                                    <div className="flex items-center gap-1 mt-2">
                                                        <Stethoscope className="w-4 h-4 text-[#b90000]" />
                                                        <span className="text-xs text-[#b90000] bg-[#b90000]/10 px-2 py-1 rounded">
                                                            Assessment Available
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-2 pt-3 border-t border-[#ffe6c5]">
                                            <button
                                                onClick={() => {
                                                    setSelectedPatient(patient)
                                                    setShowPatientDetails(true)
                                                }}
                                                className="flex-1 px-4 py-2 bg-[#b90000] hover:bg-[#740000] text-white rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                            >
                                                <Eye className="w-4 h-4" />
                                                View Details
                                            </button>
                                            <button
                                                onClick={() => handleDischarge(patient)}
                                                className="flex-1 px-4 py-2 border border-green-600 text-green-600 hover:bg-green-50 rounded text-sm font-medium transition-colors"
                                            >
                                                Discharge Patient
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Patient Details Modal */}
            {showPatientDetails && selectedPatient && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-[#fff3ea] border border-[#ffe6c5] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b border-[#ffe6c5]">
                            <h2 className="text-xl font-bold text-[#1a0000]">Patient Details</h2>
                            <button
                                onClick={() => setShowPatientDetails(false)}
                                className="p-2 hover:bg-[#ffe6c5] rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-[#1a0000]" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6 overflow-y-auto flex-1">
                            {/* Patient Information */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-[#1a0000] mb-4">Personal Information</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm text-[#740000]">Full Name</label>
                                            <p className="text-[#1a0000] font-medium">{selectedPatient.name}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-[#740000]">Age & Gender</label>
                                            <p className="text-[#1a0000] font-medium">{selectedPatient.age} years old • {selectedPatient.gender}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-[#740000]">Condition</label>
                                            <p className="text-[#1a0000] font-medium">{selectedPatient.condition}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-[#740000]">Admission Date</label>
                                            <p className="text-[#1a0000] font-medium">{selectedPatient.admittedAt}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className="text-lg font-semibold text-[#1a0000] mb-4">Emergency Information</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm text-[#740000]">Emergency ID</label>
                                            <p className="text-[#1a0000] font-medium">{selectedPatient.emergencyAlertId || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-[#740000]">First Aider</label>
                                            <p className="text-[#1a0000] font-medium">{selectedPatient.firstAiderName}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-[#740000]">Arrival Time</label>
                                            <p className="text-[#1a0000] font-medium">{selectedPatient.arrivalTime}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-[#740000]">Priority</label>
                                            <p className="text-[#1a0000] font-medium capitalize">{selectedPatient.priority}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Vital Signs */}
                            {selectedPatient.vitalSigns && Object.keys(selectedPatient.vitalSigns).length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-[#1a0000] mb-4">Vital Signs</h3>
                                    <div className="bg-white border border-[#ffe6c5] rounded-lg p-4">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            {selectedPatient.vitalSigns.heartRate && (
                                                <div>
                                                    <span className="text-[#740000]">Heart Rate:</span>
                                                    <p className="text-[#1a0000] font-medium">{selectedPatient.vitalSigns.heartRate} bpm</p>
                                                </div>
                                            )}
                                            {selectedPatient.vitalSigns.bloodPressure && (
                                                <div>
                                                    <span className="text-[#740000]">Blood Pressure:</span>
                                                    <p className="text-[#1a0000] font-medium">{selectedPatient.vitalSigns.bloodPressure}</p>
                                                </div>
                                            )}
                                            {selectedPatient.vitalSigns.temperature && (
                                                <div>
                                                    <span className="text-[#740000]">Temperature:</span>
                                                    <p className="text-[#1a0000] font-medium">{selectedPatient.vitalSigns.temperature}°C</p>
                                                </div>
                                            )}
                                            {selectedPatient.vitalSigns.oxygenSaturation && (
                                                <div>
                                                    <span className="text-[#740000]">Oxygen Saturation:</span>
                                                    <p className="text-[#1a0000] font-medium">{selectedPatient.vitalSigns.oxygenSaturation}%</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-4 border-t border-[#ffe6c5]">
                                <button
                                    onClick={() => setShowPatientDetails(false)}
                                    className="flex-1 px-4 py-2 border border-[#ffe6c5] text-[#1a0000] hover:bg-[#ffe6c5] rounded-lg font-medium transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        handleDischarge(selectedPatient)
                                        setShowPatientDetails(false)
                                    }}
                                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                                >
                                    Discharge Patient
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}