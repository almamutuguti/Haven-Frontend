"use client"

import { Sidebar } from "../SideBar"
import { Users, AlertCircle, Clock, TrendingUp, Plus, MapPin, Phone, Activity, MessageCircle, CheckCircle, Building, Ambulance, X } from "lucide-react"
import { useState, useEffect } from "react"
import { apiClient } from "../../utils/api"
import { useAuth } from "../context/AuthContext"

export default function HospitalStaffDashboard() {
    const [patients, setPatients] = useState([])
    const [allCommunications, setAllCommunications] = useState([])
    const [hospitalCommunications, setHospitalCommunications] = useState([])
    const [currentHospital, setCurrentHospital] = useState(null)
    const [showAcknowledgeModal, setShowAcknowledgeModal] = useState(false)
    const [showPreparationModal, setShowPreparationModal] = useState(false)
    const [selectedCommunication, setSelectedCommunication] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const { user } = useAuth()

    // Form states
    const [acknowledgeData, setAcknowledgeData] = useState({ preparation_notes: "" })
    const [preparationData, setPreparationData] = useState({
        doctors_ready: false, nurses_ready: false, equipment_ready: false, 
        bed_ready: false, blood_available: false, hospital_preparation_notes: ""
    })

    // Stats
    const [stats, setStats] = useState({
        activePatients: 0,
        criticalCases: 0,
        pendingCommunications: 0,
        activeIncidents: 0
    })

    // Initialize current hospital based on user's registered hospital
    useEffect(() => {
        if (user?.hospital) {
            // Use the hospital from user registration
            setCurrentHospital(user.hospital)
            localStorage.setItem('currentHospital', JSON.stringify(user.hospital))
        } else if (user?.hospital_id) {
            // If hospital is just an ID, fetch the hospital details
            fetchHospitalDetails(user.hospital_id)
        } else {
            console.log('No hospital assigned to user:', user)
        }
    }, [user])

    // Fetch hospital details by ID
    const fetchHospitalDetails = async (hospitalId) => {
        try {
            const response = await apiClient.get(`/hospitals/${hospitalId}/`)
            const hospitalData = response.data
            setCurrentHospital(hospitalData)
            localStorage.setItem('currentHospital', JSON.stringify(hospitalData))
        } catch (error) {
            console.error('Failed to fetch hospital details:', error)
            // Fallback: create a basic hospital object from ID
            const fallbackHospital = {
                id: hospitalId,
                name: `Hospital ${hospitalId}`,
                location: "Unknown"
            }
            setCurrentHospital(fallbackHospital)
            localStorage.setItem('currentHospital', JSON.stringify(fallbackHospital))
        }
    }

    // Fetch communications specifically for the current hospital
    const fetchHospitalCommunications = async () => {
        if (!currentHospital) return
        
        try {
            // Try to fetch communications specifically for this hospital
            const response = await apiClient.get(`/hospital-comms/api/communications/hospital/${currentHospital.id}/`)
            const communications = response.data || []
            
            setAllCommunications(communications)
            setHospitalCommunications(communications)

            // Update stats
            setStats(prev => ({
                ...prev,
                pendingCommunications: communications.filter(c => 
                    ['sent', 'acknowledged'].includes(c.status)
                ).length
            }))

        } catch (error) {
            console.error('Failed to fetch hospital-specific communications:', error)
            // Fallback to fetching all and filtering client-side
            try {
                const response = await apiClient.get('/hospital-comms/api/communications/')
                const allComms = response.data || []
                
                // Client-side filtering by hospital_id
                const filteredComms = allComms.filter(comm => 
                    comm.hospital_id === currentHospital.id
                )
                
                setAllCommunications(filteredComms)
                setHospitalCommunications(filteredComms)
                
                setStats(prev => ({
                    ...prev,
                    pendingCommunications: filteredComms.filter(c => 
                        ['sent', 'acknowledged'].includes(c.status)
                    ).length
                }))
            } catch (fallbackError) {
                console.error('Fallback fetch also failed:', fallbackError)
                setAllCommunications([])
                setHospitalCommunications([])
            }
        }
    }

    // Fetch patients data
    const fetchPatients = async () => {
        try {
            // Mock patients data - in real app, filter by current hospital
            setPatients([
                {
                    id: "P001",
                    name: "John Doe",
                    age: 45,
                    condition: "Trauma",
                    status: "stable",
                    admittedAt: "2 hours ago",
                },
                {
                    id: "P002",
                    name: "Jane Smith",
                    age: 32,
                    condition: "Burn",
                    status: "critical",
                    admittedAt: "30 mins ago",
                },
            ])
            
            // Update stats
            setStats(prev => ({
                ...prev,
                activePatients: 2,
                criticalCases: 1
            }))
        } catch (error) {
            console.error('Failed to fetch patients:', error)
            setPatients([])
        }
    }

    // Load all data when hospital changes
    useEffect(() => {
        if (currentHospital) {
            const loadData = async () => {
                setIsLoading(true)
                await Promise.all([
                    fetchHospitalCommunications(),
                    fetchPatients()
                ])
                setIsLoading(false)
            }
            loadData()
        }
    }, [currentHospital])

    // Hospital info component
    const HospitalInfo = () => (
        <div className="mb-6 p-4 bg-[#ffe6c5] rounded-lg border border-[#ffe6c5]">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-semibold text-[#1a0000]">Hospital Information</h3>
                    <p className="text-sm text-[#740000]">
                        {currentHospital 
                            ? `You are registered to: ${currentHospital.name}`
                            : 'Hospital information loading...'
                        }
                    </p>
                </div>
                <div className="flex items-center gap-2 text-[#1a0000]">
                    <Building className="w-5 h-5" />
                    <span className="font-medium">{currentHospital?.name}</span>
                </div>
            </div>
            {currentHospital && (
                <div className="mt-2 text-sm text-[#1a0000]">
                    Currently viewing communications for: <strong>{currentHospital.name}</strong>
                    {allCommunications.length > 0 && (
                        <span className="text-[#740000] ml-2">
                            ({hospitalCommunications.length} communications)
                        </span>
                    )}
                </div>
            )}
            {!user?.hospital && !user?.hospital_id && (
                <div className="mt-2 text-xs text-[#b90000]">
                    * Your account is not registered to a specific hospital. Contact admin to update your hospital assignment.
                </div>
            )}
        </div>
    )

    // Open acknowledge modal
    const handleOpenAcknowledge = (communication) => {
        setSelectedCommunication(communication)
        setAcknowledgeData({
            preparation_notes: ""
        })
        setShowAcknowledgeModal(true)
    }

    // Open preparation update modal
    const handleOpenPreparation = (communication) => {
        setSelectedCommunication(communication)
        setPreparationData({
            doctors_ready: false,
            nurses_ready: false,
            equipment_ready: false,
            bed_ready: false,
            blood_available: false,
            hospital_preparation_notes: ""
        })
        setShowPreparationModal(true)
    }

    // Handle acknowledge submission
    const handleAcknowledge = async (e) => {
        e.preventDefault()
        try {
            const userResponse = await apiClient.get('/auth/user/')
            const currentUser = userResponse.data
            
            await apiClient.post(`/hospital-comms/api/communications/${selectedCommunication.id}/acknowledge/`, {
                acknowledged_by: currentUser.id,
                preparation_notes: acknowledgeData.preparation_notes,
                hospital_id: currentHospital.id
            })

            // Refresh communications
            await fetchHospitalCommunications()
            setShowAcknowledgeModal(false)
            setSelectedCommunication(null)

        } catch (error) {
            console.error('Failed to acknowledge communication:', error)
            alert('Failed to acknowledge communication. Please try again.')
        }
    }

    // Handle preparation update submission
    const handlePreparationUpdate = async (e) => {
        e.preventDefault()
        try {
            await apiClient.post(`/hospital-comms/api/communications/${selectedCommunication.id}/update-preparation/`, 
                {
                    ...preparationData,
                    hospital_id: currentHospital.id
                }
            )

            // Refresh communications
            await fetchHospitalCommunications()
            setShowPreparationModal(false)
            setSelectedCommunication(null)

        } catch (error) {
            console.error('Failed to update preparation:', error)
            alert('Failed to update preparation status. Please try again.')
        }
    }

    // Handle input changes
    const handleAcknowledgeInputChange = (e) => {
        const { name, value } = e.target
        setAcknowledgeData(prev => ({ ...prev, [name]: value }))
    }

    const handlePreparationInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setPreparationData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }))
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "critical":
                return "bg-[#b90000]/10 text-[#b90000] border-[#b90000]/20"
            case "stable":
                return "bg-[#1a0000]/10 text-[#1a0000] border-[#1a0000]/20"
            case "recovering":
                return "bg-[#740000]/10 text-[#740000] border-[#740000]/20"
            case "active":
                return "bg-[#b90000]/10 text-[#b90000] border-[#b90000]/20"
            case "resolved":
                return "bg-[#1a0000]/10 text-[#1a0000] border-[#1a0000]/20"
            case "sent":
                return "bg-blue-100 text-blue-800 border-blue-200"
            case "acknowledged":
                return "bg-yellow-100 text-yellow-800 border-yellow-200"
            case "preparing":
                return "bg-orange-100 text-orange-800 border-orange-200"
            case "ready":
                return "bg-green-100 text-green-800 border-green-200"
            case "en_route":
                return "bg-purple-100 text-purple-800 border-purple-200"
            case "arrived":
                return "bg-indigo-100 text-indigo-800 border-indigo-200"
            default:
                return "bg-[#740000]/10 text-[#740000] border-[#740000]/20"
        }
    }

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "critical":
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
                    <h1 className="text-4xl font-bold text-[#1a0000] mb-2">Hospital Staff Dashboard</h1>
                    <p className="text-[#740000]">
                        {currentHospital ? `Managing communications for ${currentHospital.name}` : 'Loading hospital information...'}
                    </p>
                </div>

                {/* Hospital Info */}
                <HospitalInfo />

                {/* Stats Grid */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                    <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[#740000] mb-1">Active Patients</p>
                                <p className="text-3xl font-bold text-[#1a0000]">{stats.activePatients}</p>
                            </div>
                            <Users className="w-12 h-12 text-[#b90000]/20" />
                        </div>
                    </div>
                    <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[#740000] mb-1">Critical Cases</p>
                                <p className="text-3xl font-bold text-[#b90000]">{stats.criticalCases}</p>
                            </div>
                            <AlertCircle className="w-12 h-12 text-[#b90000]/20" />
                        </div>
                    </div>
                    <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[#740000] mb-1">Pending Comms</p>
                                <p className="text-3xl font-bold text-[#1a0000]">{stats.pendingCommunications}</p>
                            </div>
                            <MessageCircle className="w-12 h-12 text-[#740000]/20" />
                        </div>
                    </div>
                    <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[#740000] mb-1">Active Incidents</p>
                                <p className="text-3xl font-bold text-[#1a0000]">{stats.activeIncidents}</p>
                            </div>
                            <Activity className="w-12 h-12 text-[#b90000]/20" />
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Hospital Communications Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg">
                            <div className="flex flex-row items-center justify-between p-6 border-b border-[#ffe6c5]">
                                <div>
                                    <h3 className="text-2xl font-bold text-[#1a0000]">Emergency Communications</h3>
                                    <p className="text-[#740000]">
                                        {currentHospital 
                                            ? `Incoming emergency alerts for ${currentHospital.name}`
                                            : 'Loading hospital communications...'
                                        }
                                    </p>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {hospitalCommunications.length === 0 ? (
                                        <div className="text-center py-8">
                                            <MessageCircle className="w-12 h-12 text-[#740000]/50 mx-auto mb-4" />
                                            <p className="text-[#740000]">
                                                {currentHospital 
                                                    ? `No pending communications for ${currentHospital.name}`
                                                    : 'Loading communications...'
                                                }
                                            </p>
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
                                                        <div className="flex-1">
                                                            <h3 className="font-semibold text-[#1a0000]">
                                                                {communication.victim_name || "Unknown Victim"}
                                                            </h3>
                                                            <div className="flex items-center gap-2 text-sm text-[#740000] mt-1">
                                                                <Building className="w-4 h-4" />
                                                                <span>From: {communication.first_aider_name}</span>
                                                            </div>
                                                            <div className="text-xs text-[#b90000] mt-1 bg-[#b90000]/10 px-2 py-1 rounded inline-block">
                                                                Hospital: {communication.hospital_name}
                                                            </div>
                                                            <p className="text-sm text-[#740000] mt-1">
                                                                <strong>Chief Complaint:</strong> {communication.chief_complaint}
                                                            </p>
                                                            {communication.vital_signs && (
                                                                <p className="text-sm text-[#740000]">
                                                                    <strong>Vitals:</strong> {communication.vital_signs}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(communication.priority)}`}
                                                        >
                                                            {communication.priority}
                                                        </span>
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(communication.status)}`}
                                                        >
                                                            {communication.status}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 text-sm text-[#740000] mb-3">
                                                    <div>
                                                        <strong>Estimated Arrival:</strong> {communication.estimated_arrival_minutes} mins
                                                    </div>
                                                    <div>
                                                        <strong>Age/Gender:</strong> {communication.victim_age || 'N/A'} / {communication.victim_gender || 'N/A'}
                                                    </div>
                                                    {communication.required_specialties && (
                                                        <div>
                                                            <strong>Specialties Needed:</strong> {communication.required_specialties}
                                                        </div>
                                                    )}
                                                    {communication.equipment_needed && (
                                                        <div>
                                                            <strong>Equipment:</strong> {communication.equipment_needed}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between text-sm pt-3 border-t border-[#ffe6c5]">
                                                    <div className="text-[#740000]">
                                                        Received: {new Date(communication.created_at).toLocaleString()}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {communication.status === 'sent' && (
                                                            <button 
                                                                onClick={() => handleOpenAcknowledge(communication)}
                                                                className="px-3 py-1 bg-[#b90000] hover:bg-[#740000] text-[#fff3ea] rounded text-sm font-medium transition-colors"
                                                            >
                                                                Acknowledge
                                                            </button>
                                                        )}
                                                        {(communication.status === 'acknowledged' || communication.status === 'preparing') && (
                                                            <button 
                                                                onClick={() => handleOpenPreparation(communication)}
                                                                className="px-3 py-1 border border-[#b90000] text-[#b90000] hover:bg-[#ffe6c5] rounded text-sm font-medium transition-colors"
                                                            >
                                                                Update Preparation
                                                            </button>
                                                        )}
                                                        {communication.status === 'ready' && (
                                                            <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">
                                                                Ready for Arrival
                                                            </span>
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

                    {/* Patients & Actions Section */}
                    <div className="space-y-6">
                        {/* Patients Section */}
                        <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg">
                            <div className="p-6 border-b border-[#ffe6c5]">
                                <h3 className="text-2xl font-bold text-[#1a0000]">Current Patients</h3>
                                <p className="text-[#740000]">Patients currently admitted to the hospital</p>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {patients.map((patient) => (
                                        <div
                                            key={patient.id}
                                            className="border border-[#ffe6c5] rounded-lg p-4 hover:border-[#b90000] transition"
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h3 className="font-semibold text-[#1a0000]">{patient.name}</h3>
                                                    <p className="text-sm text-[#740000]">{patient.age} years old</p>
                                                </div>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(patient.status)}`}
                                                >
                                                    {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-[#740000]">Condition: {patient.condition}</span>
                                                <span className="text-[#740000]">Admitted {patient.admittedAt}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg">
                            <div className="p-6 border-b border-[#ffe6c5]">
                                <h3 className="text-xl font-bold text-[#1a0000]">Quick Actions</h3>
                            </div>
                            <div className="p-6 space-y-2">
                                <button className="w-full text-left px-3 py-2 border border-[#ffe6c5] text-[#1a0000] hover:bg-[#ffe6c5] rounded transition-colors flex items-center">
                                    <Phone className="w-4 h-4 mr-2" />
                                    Call First-Aider
                                </button>
                                <button className="w-full text-left px-3 py-2 border border-[#ffe6c5] text-[#1a0000] hover:bg-[#ffe6c5] rounded transition-colors flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-2" />
                                    Report Emergency
                                </button>
                                <button className="w-full text-left px-3 py-2 border border-[#ffe6c5] text-[#1a0000] hover:bg-[#ffe6c5] rounded transition-colors flex items-center">
                                    <Users className="w-4 h-4 mr-2" />
                                    View Team
                                </button>
                            </div>
                        </div>

                        {/* Hospital Info */}
                        {currentHospital && (
                            <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg">
                                <div className="p-6 border-b border-[#ffe6c5]">
                                    <h3 className="text-xl font-bold text-[#1a0000]">Hospital Information</h3>
                                </div>
                                <div className="p-6 space-y-2">
                                    <p className="text-[#1a0000] font-medium">{currentHospital.name}</p>
                                    <p className="text-sm text-[#740000]">{currentHospital.location || 'Location not specified'}</p>
                                    <p className="text-sm text-[#740000]">Emergency: +254 700 123 456</p>
                                    {currentHospital.phone && (
                                        <p className="text-sm text-[#740000]">Phone: {currentHospital.phone}</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Acknowledge Modal */}
            {showAcknowledgeModal && selectedCommunication && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-[#fff3ea] border border-[#ffe6c5] rounded-lg w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b border-[#ffe6c5]">
                            <h2 className="text-2xl font-bold text-[#1a0000]">Acknowledge Emergency</h2>
                            <button
                                onClick={() => setShowAcknowledgeModal(false)}
                                className="p-2 hover:bg-[#ffe6c5] rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-[#1a0000]" />
                            </button>
                        </div>
                        <form onSubmit={handleAcknowledge} className="p-6 space-y-4">
                            <div className="bg-[#ffe6c5] p-4 rounded-lg">
                                <h3 className="font-semibold text-[#1a0000] mb-2">{selectedCommunication.victim_name}</h3>
                                <p className="text-sm text-[#740000]">
                                    <strong>Condition:</strong> {selectedCommunication.chief_complaint}
                                </p>
                                <p className="text-sm text-[#740000]">
                                    <strong>ETA:</strong> {selectedCommunication.estimated_arrival_minutes} minutes
                                </p>
                                <p className="text-sm text-[#740000]">
                                    <strong>Priority:</strong> {selectedCommunication.priority}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-[#1a0000]">
                                    Preparation Notes
                                </label>
                                <textarea
                                    name="preparation_notes"
                                    value={acknowledgeData.preparation_notes}
                                    onChange={handleAcknowledgeInputChange}
                                    rows={3}
                                    placeholder="Enter any preparation notes or instructions..."
                                    className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent resize-vertical"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAcknowledgeModal(false)}
                                    className="flex-1 px-4 py-2 border border-[#ffe6c5] text-[#1a0000] hover:bg-[#ffe6c5] rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-[#b90000] hover:bg-[#740000] text-[#fff3ea] rounded-lg font-medium transition-colors"
                                >
                                    Acknowledge Alert
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Preparation Update Modal */}
            {showPreparationModal && selectedCommunication && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-[#fff3ea] border border-[#ffe6c5] rounded-lg w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b border-[#ffe6c5]">
                            <h2 className="text-2xl font-bold text-[#1a0000]">Update Preparation Status</h2>
                            <button
                                onClick={() => setShowPreparationModal(false)}
                                className="p-2 hover:bg-[#ffe6c5] rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-[#1a0000]" />
                            </button>
                        </div>
                        <form onSubmit={handlePreparationUpdate} className="p-6 space-y-4">
                            <div className="bg-[#ffe6c5] p-4 rounded-lg">
                                <h3 className="font-semibold text-[#1a0000] mb-2">{selectedCommunication.victim_name}</h3>
                                <p className="text-sm text-[#740000]">
                                    <strong>Condition:</strong> {selectedCommunication.chief_complaint}
                                </p>
                                <p className="text-sm text-[#740000]">
                                    <strong>ETA:</strong> {selectedCommunication.estimated_arrival_minutes} minutes
                                </p>
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-medium text-[#1a0000]">Preparation Checklist</h4>
                                
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="doctors_ready"
                                        checked={preparationData.doctors_ready}
                                        onChange={handlePreparationInputChange}
                                        className="rounded border-[#ffe6c5] text-[#b90000] focus:ring-[#b90000]"
                                    />
                                    <span className="text-sm text-[#1a0000]">Doctors Ready</span>
                                </label>

                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="nurses_ready"
                                        checked={preparationData.nurses_ready}
                                        onChange={handlePreparationInputChange}
                                        className="rounded border-[#ffe6c5] text-[#b90000] focus:ring-[#b90000]"
                                    />
                                    <span className="text-sm text-[#1a0000]">Nurses Ready</span>
                                </label>

                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="equipment_ready"
                                        checked={preparationData.equipment_ready}
                                        onChange={handlePreparationInputChange}
                                        className="rounded border-[#ffe6c5] text-[#b90000] focus:ring-[#b90000]"
                                    />
                                    <span className="text-sm text-[#1a0000]">Equipment Ready</span>
                                </label>

                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="bed_ready"
                                        checked={preparationData.bed_ready}
                                        onChange={handlePreparationInputChange}
                                        className="rounded border-[#ffe6c5] text-[#b90000] focus:ring-[#b90000]"
                                    />
                                    <span className="text-sm text-[#1a0000]">Bed Available</span>
                                </label>

                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        name="blood_available"
                                        checked={preparationData.blood_available}
                                        onChange={handlePreparationInputChange}
                                        className="rounded border-[#ffe6c5] text-[#b90000] focus:ring-[#b90000]"
                                    />
                                    <span className="text-sm text-[#1a0000]">Blood Available</span>
                                </label>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-[#1a0000]">
                                    Additional Notes
                                </label>
                                <textarea
                                    name="hospital_preparation_notes"
                                    value={preparationData.hospital_preparation_notes}
                                    onChange={handlePreparationInputChange}
                                    rows={3}
                                    placeholder="Any additional preparation notes..."
                                    className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent resize-vertical"
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowPreparationModal(false)}
                                    className="flex-1 px-4 py-2 border border-[#ffe6c5] text-[#1a0000] hover:bg-[#ffe6c5] rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-[#b90000] hover:bg-[#740000] text-[#fff3ea] rounded-lg font-medium transition-colors"
                                >
                                    Update Preparation
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}