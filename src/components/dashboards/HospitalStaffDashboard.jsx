"use client"

import { Sidebar } from "../SideBar"
import { Users, AlertCircle, Clock, TrendingUp, Plus, MapPin, Phone, Activity, MessageCircle, CheckCircle, Building, Ambulance, X, RefreshCw, Stethoscope, Eye, User, Heart, FileText } from "lucide-react"
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
    const [showPatientDetailsModal, setShowPatientDetailsModal] = useState(false)
    const [selectedCommunication, setSelectedCommunication] = useState(null)
    const [selectedPatient, setSelectedPatient] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const { user } = useAuth()

    // Form states
    const [acknowledgeData, setAcknowledgeData] = useState({ preparation_notes: "" })
    const [preparationData, setPreparationData] = useState({
        doctors_ready: false,
        nurses_ready: false,
        equipment_ready: false,
        bed_ready: false,
        blood_available: false,
        hospital_preparation_notes: ""
    })

    // Stats
    const [stats, setStats] = useState({
        activePatients: 0,
        criticalCases: 0,
        pendingCommunications: 0,
        activeIncidents: 0,
        totalAssessments: 0
    })

    // Initialize current hospital based on user's registered hospital
    useEffect(() => {
        const initializeHospital = async () => {
            if (user?.hospital) {
                setCurrentHospital(user.hospital)
                localStorage.setItem('currentHospital', JSON.stringify(user.hospital))
            } else if (user?.hospital_id) {
                await fetchHospitalDetails(user.hospital_id)
            } else {
                console.log('No hospital assigned to user:', user)
                const savedHospital = localStorage.getItem('currentHospital')
                if (savedHospital) {
                    setCurrentHospital(JSON.parse(savedHospital))
                } else {
                    await fetchUserHospital()
                }
            }
        }

        initializeHospital()
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
            const fallbackHospital = {
                id: hospitalId,
                name: `Hospital ${hospitalId}`,
                location: "Unknown"
            }
            setCurrentHospital(fallbackHospital)
            localStorage.setItem('currentHospital', JSON.stringify(fallbackHospital))
        }
    }

    // Fetch user's hospital if not directly available
    const fetchUserHospital = async () => {
        try {
            // Try to get user info from localStorage as fallback
            const savedUser = localStorage.getItem('haven_user')
            if (savedUser) {
                const userData = JSON.parse(savedUser)
                if (userData.hospital) {
                    setCurrentHospital(userData.hospital)
                    localStorage.setItem('currentHospital', JSON.stringify(userData.hospital))
                    return
                } else if (userData.hospital_id) {
                    await fetchHospitalDetails(userData.hospital_id)
                    return
                }
            }

            // If no user data in localStorage, try API as last resort
            const response = await apiClient.get('/auth/user/')
            const userData = response.data
            if (userData.hospital) {
                setCurrentHospital(userData.hospital)
                localStorage.setItem('currentHospital', JSON.stringify(userData.hospital))
            } else if (userData.hospital_id) {
                await fetchHospitalDetails(userData.hospital_id)
            }
        } catch (error) {
            console.error('Failed to fetch user hospital:', error)
            // Set a default hospital if all else fails
            const defaultHospital = {
                id: 1,
                name: "General Hospital",
                location: "Nairobi"
            }
            setCurrentHospital(defaultHospital)
            localStorage.setItem('currentHospital', JSON.stringify(defaultHospital))
        }
    }

    // CORRECTED: Fetch hospital communications for THIS HOSPITAL
    const fetchHospitalCommunications = async () => {
        try {
            console.log('DEBUG - Fetching hospital communications for hospital:', currentHospital)

            if (!currentHospital) {
                console.log('DEBUG - No current hospital set, skipping communications fetch')
                setHospitalCommunications([])
                return
            }

            let communications = [];

            try {
                // Try to fetch all communications
                console.log('DEBUG - Making API call to /hospital-comms/api/communications/')
                const response = await apiClient.get('/hospital-comms/api/communications/')
                console.log('DEBUG - Raw API response:', response)

                // Extract communications array from response
                if (Array.isArray(response)) {
                    communications = response;
                    console.log('DEBUG - Response is direct array')
                } else if (response && Array.isArray(response.data)) {
                    communications = response.data;
                    console.log('DEBUG - Response has data array')
                } else if (response && response.data && Array.isArray(response.data.results)) {
                    communications = response.data.results;
                    console.log('DEBUG - Response has data.results array')
                } else if (response && Array.isArray(response.results)) {
                    communications = response.results;
                    console.log('DEBUG - Response has results array')
                } else {
                    console.log('DEBUG - Unexpected response format, trying to extract data...', response)
                    // Try to find communications in the response object
                    communications = response?.communications || response?.data || [];
                }

                console.log(`DEBUG - Total communications fetched: ${communications.length}`)

                // Log all communications for debugging
                communications.forEach((comm, index) => {
                    console.log(`DEBUG - Communication ${index + 1}:`, {
                        id: comm.id,
                        hospital_id: comm.hospital_id,
                        hospital: comm.hospital,
                        hospital_name: comm.hospital_name,
                        first_aider: comm.first_aider,
                        victim_name: comm.victim_name,
                        status: comm.status
                    })
                })

                // CORRECTED: Filter communications by HOSPITAL, not first aider
                const filteredCommunications = communications.filter(comm => {
                    // Try different possible field names for hospital ID
                    const hospitalId = comm.hospital_id || comm.hospital?.id || comm.hospital
                    const hospitalName = comm.hospital_name || comm.hospital?.name

                    console.log(`DEBUG - Comparing hospital:`, {
                        commHospitalId: hospitalId,
                        currentHospitalId: currentHospital.id,
                        commHospitalName: hospitalName,
                        currentHospitalName: currentHospital.name
                    })

                    // Check if either ID or name matches
                    const idMatch = hospitalId && hospitalId.toString() === currentHospital.id.toString()
                    const nameMatch = hospitalName && currentHospital.name &&
                        hospitalName.toLowerCase().includes(currentHospital.name.toLowerCase())

                    console.log(`DEBUG - Hospital ID match: ${idMatch}, Name match: ${nameMatch}`)

                    return idMatch || nameMatch
                })

                communications = filteredCommunications
                console.log(`DEBUG - Filtered ${communications.length} communications for hospital ${currentHospital.id}`)

            } catch (apiError) {
                console.error('DEBUG - Communications API failed:', apiError)
                communications = []
            }

            // Process and set communications
            const formattedCommunications = communications.map(comm => {
                let hospitalName = comm.hospital_name || comm.hospital?.name || currentHospital.name

                return {
                    id: comm.id,
                    emergency_alert_id: comm.emergency_alert_id || comm.alert_reference_id,
                    hospital_id: comm.hospital_id || comm.hospital?.id || comm.hospital,
                    hospital_name: hospitalName,
                    first_aider: comm.first_aider || comm.first_aider_id,
                    first_aider_name: comm.first_aider_name || 'Unknown First Aider',
                    priority: comm.priority || 'high',
                    victim_name: comm.victim_name || 'Unknown Victim',
                    victim_age: comm.victim_age,
                    victim_gender: comm.victim_gender,
                    chief_complaint: comm.chief_complaint || 'Emergency condition',
                    vital_signs: comm.vital_signs || {},
                    first_aid_provided: comm.first_aid_provided || 'Basic first aid',
                    estimated_arrival_minutes: comm.estimated_arrival_minutes || 15,
                    required_specialties: Array.isArray(comm.required_specialties)
                        ? comm.required_specialties
                        : (comm.required_specialties ? [comm.required_specialties] : []),
                    equipment_needed: Array.isArray(comm.equipment_needed)
                        ? comm.equipment_needed
                        : (comm.equipment_needed ? [comm.equipment_needed] : []),
                    blood_type_required: comm.blood_type_required || '',
                    status: comm.status || 'pending',
                    created_at: comm.created_at || new Date().toISOString(),
                    updated_at: comm.updated_at || new Date().toISOString(),
                    has_assessment: !!comm.assessment_data,
                    originalData: comm
                }
            })

            console.log('DEBUG - Final formatted communications:', formattedCommunications)
            setHospitalCommunications(formattedCommunications)
            setAllCommunications(formattedCommunications)

            // In your fetchHospitalCommunications function, update the stats calculation:
            const activeComms = formattedCommunications.filter(c =>
                ['sent', 'acknowledged', 'preparing', 'ready', 'en_route', 'arrived'].includes(c.status) // Remove 'completed'
            ).length

            const assessmentsCount = formattedCommunications.filter(c =>
                c.has_assessment
            ).length

            setStats(prev => ({
                ...prev,
                pendingCommunications: activeComms,
                totalAssessments: assessmentsCount
            }))

        } catch (error) {
            console.error('Failed to fetch hospital communications:', error)
            setHospitalCommunications([])
            setAllCommunications([])
        }
    }

    // Enhanced fetchPatients function - only shows non-discharged patients
    const fetchPatients = async () => {
        try {
            // Get communications that have victim assessments and have arrived, but NOT discharged
            const communicationsWithAssessments = hospitalCommunications.filter(comm =>
                (comm.status === 'arrived' || comm.has_assessment) &&
                comm.victim_name &&
                comm.status !== 'completed' // Use 'completed' as the discharge status
            )

            // Transform communications into patient records
            const patientRecords = communicationsWithAssessments.map(comm => {
                // Extract assessment data from the communication
                const assessmentData = comm.assessment_data || comm.originalData?.assessment_data || {};

                return {
                    id: `patient-${comm.id}`,
                    name: comm.victim_name || "Unknown Patient",
                    age: comm.victim_age || "N/A",
                    gender: comm.victim_gender || "Unknown",
                    condition: comm.chief_complaint || "Emergency condition",
                    status: getPatientStatus(comm.status, comm.priority),
                    admittedAt: new Date(comm.updated_at).toLocaleDateString(),
                    communicationId: comm.id, // This is the hospital communication ID
                    emergencyAlertId: comm.emergency_alert_id, // This is the actual emergency alert ID
                    vitalSigns: comm.vital_signs || {},
                    priority: comm.priority,
                    // Assessment data from first aider
                    hasAssessment: comm.has_assessment || false,
                    assessmentData: assessmentData,
                    assessmentSummary: comm.assessment_summary || null,
                    firstAiderName: comm.first_aider_name,
                    emergencyType: comm.chief_complaint,
                    arrivalTime: comm.estimated_arrival_minutes ?
                        `ETA: ${comm.estimated_arrival_minutes} mins` : 'Arrival time unknown',
                    // Additional medical info from assessment
                    allergies: assessmentData.allergies || 'Not specified',
                    medications: assessmentData.medications || 'None reported',
                    medicalHistory: assessmentData.medicalHistory || 'Not specified'
                }
            })

            console.log('DEBUG - Active patient records:', patientRecords);
            setPatients(patientRecords);

            // Update stats
            setStats(prev => ({
                ...prev,
                activePatients: patientRecords.length,
                criticalCases: patientRecords.filter(p => p.priority === 'critical' || p.priority === 'high').length
            }))

        } catch (error) {
            console.error('Failed to fetch patients:', error)
            setPatients([])
            setStats(prev => ({
                ...prev,
                activePatients: 0,
                criticalCases: 0
            }))
        }
    }
    // Helper function to determine patient status
    const getPatientStatus = (communicationStatus, priority) => {
        if (communicationStatus === 'completed' || communicationStatus === 'discharged') return 'discharged'
        if (communicationStatus === 'arrived') {
            return priority === 'critical' ? 'critical' : 'stable'
        }
        return 'active'
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

    // Refresh communications and data
    const refreshCommunications = async () => {
        setIsRefreshing(true)
        try {
            await Promise.all([
                fetchHospitalCommunications(),
                fetchPatients()
            ])
        } catch (error) {
            console.error('Error refreshing data:', error)
        } finally {
            setIsRefreshing(false)
        }
    }

    // Hospital info component
    const HospitalInfo = () => (
        <div className="mb-6 p-4 bg-[#ffe6c5] rounded-lg border border-[#ffe6c5]">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                    <h3 className="font-semibold text-[#1a0000]">Hospital Information</h3>
                    <p className="text-sm text-[#740000]">
                        {currentHospital
                            ? `You are registered to: ${currentHospital.name}`
                            : 'Hospital information loading...'
                        }
                    </p>
                    {currentHospital && (
                        <div className="mt-2 text-sm text-[#1a0000]">
                            Currently viewing communications for: <strong>{currentHospital.name}</strong>
                            {hospitalCommunications.length > 0 && (
                                <span className="text-[#740000] ml-2">
                                    ({hospitalCommunications.length} communications, {stats.totalAssessments} assessments)
                                </span>
                            )}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-[#1a0000]">
                        <Building className="w-5 h-5" />
                        <span className="font-medium">{currentHospital?.name}</span>
                    </div>
                    <button
                        onClick={refreshCommunications}
                        disabled={isRefreshing}
                        className="px-4 py-2 bg-[#b90000] hover:bg-[#740000] disabled:bg-[#740000]/50 text-[#fff3ea] rounded text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        {isRefreshing ? 'Refreshing...' : 'Refresh'}
                    </button>
                </div>
            </div>
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
            doctors_ready: communication.doctors_ready || false,
            nurses_ready: communication.nurses_ready || false,
            equipment_ready: communication.equipment_ready || false,
            bed_ready: communication.bed_ready || false,
            blood_available: communication.blood_available || false,
            hospital_preparation_notes: communication.hospital_preparation_notes || ""
        })
        setShowPreparationModal(true)
    }

    // Open patient details modal
    const handleOpenPatientDetails = (patient) => {
        setSelectedPatient(patient)
        setShowPatientDetailsModal(true)
    }

    // Handle acknowledge submission - SIMPLIFIED VERSION
    const handleAcknowledge = async (e) => {
        e.preventDefault()
        try {
            console.log('DEBUG - Acknowledging communication:', {
                communicationId: selectedCommunication.id,
                userRole: user?.role,
                preparationNotes: acknowledgeData.preparation_notes
            })

            // Prepare acknowledge data - send both acknowledged_by and preparation_notes
            const acknowledgePayload = {
                acknowledged_by: user?.id, // Send user ID
                preparation_notes: acknowledgeData.preparation_notes || "Hospital acknowledged the emergency alert"
            }

            console.log('DEBUG - Sending acknowledge payload:', acknowledgePayload)

            // Update communication status in database
            const response = await apiClient.post(
                `/hospital-comms/api/communications/${selectedCommunication.id}/acknowledge/`,
                acknowledgePayload
            )

            console.log('DEBUG - Acknowledge response:', response)

            // Refresh communications from database
            await fetchHospitalCommunications()
            setShowAcknowledgeModal(false)
            setSelectedCommunication(null)
            setAcknowledgeData({ preparation_notes: "" })

            // Show success message
            alert('Emergency alert acknowledged successfully! The first aider has been notified.')

        } catch (error) {
            console.error('Failed to acknowledge communication:', error)

            let errorMessage = 'Failed to acknowledge communication. Please try again.'

            if (error.response) {
                console.error('Error response data:', error.response.data)
                console.error('Error response status:', error.response.status)

                if (error.response.status === 403) {
                    errorMessage = 'Permission denied. Your account does not have permission to acknowledge communications. Please ensure your account has the hospital_staff role and is properly authenticated.'
                } else if (error.response.status === 404) {
                    errorMessage = 'Acknowledge endpoint not found. Please contact support.'
                } else if (error.response.status === 400) {
                    const errorData = error.response.data
                    if (typeof errorData === 'object') {
                        const validationErrors = Object.entries(errorData)
                            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
                            .join('; ')
                        errorMessage = `Validation error: ${validationErrors}`
                    } else {
                        errorMessage = `Invalid data: ${errorData}`
                    }
                } else if (error.response.status === 500) {
                    errorMessage = 'Server error occurred. Please try again later.'
                } else {
                    errorMessage = `Server error: ${error.response.status} - ${error.response.statusText}`
                }
            } else if (error.request) {
                errorMessage = 'Network error: Unable to connect to server. Please check your internet connection.'
            } else {
                errorMessage = `Error: ${error.message}`
            }

            alert(errorMessage)
        }
    }

    // Handle preparation update submission - IMPROVED VERSION
    const handlePreparationUpdate = async (e) => {
        e.preventDefault()
        try {
            console.log('DEBUG - Updating preparation for communication:', {
                communicationId: selectedCommunication.id,
                userRole: user?.role,
                userHospital: user?.hospital,
                preparationData: preparationData
            })

            // Update preparation status in database using your Django API
            const response = await apiClient.post(
                `/hospital-comms/api/communications/${selectedCommunication.id}/update-preparation/`,
                preparationData
            )

            console.log('DEBUG - Preparation update response:', response)

            // Refresh communications from database
            await fetchHospitalCommunications()
            setShowPreparationModal(false)
            setSelectedCommunication(null)

            // Show success message
            alert('Preparation status updated successfully! The first aider has been notified.')

        } catch (error) {
            console.error('Failed to update preparation:', error)

            let errorMessage = 'Failed to update preparation status. Please try again.'

            if (error.response) {
                console.error('Error response data:', error.response.data)
                console.error('Error response status:', error.response.status)

                if (error.response.status === 403) {
                    errorMessage = 'Permission denied. Your account does not have permission to update preparation status. Please ensure your account has the hospital_staff role and is properly authenticated.'
                } else if (error.response.status === 404) {
                    errorMessage = 'Update preparation endpoint not found. Please contact support.'
                } else if (error.response.status === 400) {
                    const errorData = error.response.data
                    if (typeof errorData === 'object') {
                        const validationErrors = Object.entries(errorData)
                            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
                            .join('; ')
                        errorMessage = `Validation error: ${validationErrors}`
                    } else {
                        errorMessage = `Invalid data: ${errorData}`
                    }
                } else if (error.response.status === 500) {
                    errorMessage = 'Server error occurred. Please try again later.'
                } else {
                    errorMessage = `Server error: ${error.response.status} - ${error.response.statusText}`
                }
            } else if (error.request) {
                errorMessage = 'Network error: Unable to connect to server. Please check your internet connection.'
            } else {
                errorMessage = `Error: ${error.message}`
            }

            alert(errorMessage)
        }
    }

    // Update handlePatientArrival to use correct emergency_alert_id
    const handlePatientArrival = async (communication) => {
        try {
            const emergencyAlertId = communication.emergency_alert_id;

            if (!emergencyAlertId) {
                throw new Error('No emergency alert ID found for this communication');
            }

            // Update emergency status to 'arrived'
            await apiClient.post(`/emergencies/${emergencyAlertId}/status/`, {
                status: 'arrived',
                details: 'Patient arrived at hospital and admitted'
            });

            // Also update communication status
            await apiClient.post(`/hospital-comms/api/communications/${communication.id}/update-status/`, {
                status: 'arrived',
                notes: 'Patient arrived at hospital and admitted'
            });

            // Refresh data
            await fetchHospitalCommunications();
            await fetchPatients();

            // Send notification to first aider
            await apiClient.post('/notifications/api/send-single/', {
                user_id: communication.first_aider,
                title: "Patient Arrived at Hospital",
                message: `${communication.victim_name} has safely arrived at ${currentHospital?.name || 'the hospital'} and is being admitted.`,
                notification_type: "patient_arrived",
                channel: "in_app",
                priority: "medium",
                hospital_communication_id: communication.id
            });

            alert('Patient arrival recorded successfully! First aider has been notified.');

        } catch (error) {
            console.error('Failed to update patient arrival:', error);
            alert('Failed to record patient arrival. Please try again.');
        }
    }

    const handlePatientDischarge = async (patient) => {
        try {
            console.log('DEBUG - Discharging patient:', {
                patientId: patient.id,
                patientName: patient.name,
                communicationId: patient.communicationId,
                emergencyAlertId: patient.emergencyAlertId
            });

            // Find the communication to get the emergency_alert_id
            const communication = hospitalCommunications.find(comm => comm.id === patient.communicationId);

            if (!communication) {
                throw new Error('Communication not found for this patient');
            }

            const emergencyAlertId = communication.emergency_alert_id;

            if (!emergencyAlertId) {
                throw new Error('No emergency alert ID associated with this communication');
            }

            console.log('DEBUG - Using emergency alert ID:', emergencyAlertId);

            let success = false;
            let lastError = null;

            // Try different valid status values for hospital communications
            const validStatuses = ['completed', 'closed', 'finished', 'resolved', 'cancelled'];

            for (const status of validStatuses) {
                try {
                    console.log(`DEBUG - Trying communication status: ${status}`);
                    const commResponse = await apiClient.post(
                        `/hospital-comms/api/communications/${patient.communicationId}/update-status/`,
                        {
                            status: status,
                            notes: `Patient ${patient.name} discharged from hospital on ${new Date().toLocaleDateString()}`
                        }
                    );
                    console.log(`DEBUG - Communication status "${status}" success:`, commResponse.data);
                    success = true;
                    break; // Stop trying once we find a working status
                } catch (commError) {
                    console.log(`DEBUG - Communication status "${status}" failed:`, commError.response?.data || commError.message);
                    lastError = commError;
                    continue; // Try next status
                }
            }

            // If communication status update succeeded, also try to update emergency alert
            if (success) {
                try {
                    console.log('DEBUG - Trying to update emergency alert status');
                    const cancelResponse = await apiClient.post(
                        `/emergencies/${emergencyAlertId}/cancel/`,
                        {
                            reason: `Patient ${patient.name} discharged from hospital`
                        }
                    );
                    console.log('DEBUG - Emergency alert cancel success:', cancelResponse.data);
                } catch (cancelError) {
                    console.log('DEBUG - Emergency alert cancel failed, trying status update:', cancelError.response?.data || cancelError.message);

                    try {
                        const statusResponse = await apiClient.post(
                            `/emergencies/${emergencyAlertId}/status/`,
                            {
                                status: 'completed',
                                details: `Patient ${patient.name} discharged from hospital`
                            }
                        );
                        console.log('DEBUG - Emergency alert status update success:', statusResponse.data);
                    } catch (statusError) {
                        console.log('DEBUG - Emergency alert status update failed:', statusError.response?.data || statusError.message);
                        // Don't fail the entire discharge if emergency alert update fails
                    }
                }

                // Remove from all local states immediately
                setPatients(prev => prev.filter(p => p.id !== patient.id));
                setHospitalCommunications(prev => prev.filter(comm => comm.id !== patient.communicationId));
                setAllCommunications(prev => prev.filter(comm => comm.id !== patient.communicationId));

                // Update stats
                setStats(prev => ({
                    ...prev,
                    activePatients: Math.max(0, prev.activePatients - 1),
                    criticalCases: (patient.priority === 'critical' || patient.priority === 'high')
                        ? Math.max(0, prev.criticalCases - 1)
                        : prev.criticalCases
                }));

                alert('Patient discharged successfully! They will no longer appear in the dashboard.');

            } else {
                // If all status attempts failed, try a different approach
                console.log('DEBUG - All status attempts failed, trying alternative approach');

                // Alternative: Just update the local state and mark as completed locally
                const confirmed = window.confirm(
                    'Unable to update server status. Do you want to remove this patient from the dashboard anyway? The data will remain in the database.'
                );

                if (confirmed) {
                    // Remove from local states only
                    setPatients(prev => prev.filter(p => p.id !== patient.id));
                    setHospitalCommunications(prev => prev.filter(comm => comm.id !== patient.communicationId));
                    setAllCommunications(prev => prev.filter(comm => comm.id !== patient.communicationId));

                    // Update stats
                    setStats(prev => ({
                        ...prev,
                        activePatients: Math.max(0, prev.activePatients - 1),
                        criticalCases: (patient.priority === 'critical' || patient.priority === 'high')
                            ? Math.max(0, prev.criticalCases - 1)
                            : prev.criticalCases
                    }));

                    alert('Patient removed from dashboard. Data remains in database.');
                } else {
                    throw lastError;
                }
            }

        } catch (error) {
            console.error('DEBUG - Discharge failed:', error);

            let errorMessage = 'Failed to discharge patient. ';

            if (error.response) {
                const errorData = error.response.data;
                if (error.response.status === 400) {
                    if (errorData.status && Array.isArray(errorData.status)) {
                        errorMessage += `Valid status choices are: ${errorData.status.join(', ')}`;
                    } else {
                        errorMessage += `Validation error: ${JSON.stringify(errorData)}`;
                    }
                } else if (error.response.status === 404) {
                    errorMessage += 'Record not found. It may have been already processed.';
                } else if (error.response.status === 500) {
                    errorMessage += 'Server error. Please try again or contact support.';
                } else {
                    errorMessage += `Error: ${error.response.status} - ${JSON.stringify(errorData)}`;
                }
            } else {
                errorMessage += error.message || 'Unknown error occurred.';
            }

            alert(errorMessage);
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
            case "discharged":
                return "bg-green-100 text-green-800 border-green-200"
            case "pending":
                return "bg-blue-100 text-blue-800 border-blue-200"
            case "sent":
                return "bg-blue-100 text-blue-800 border-blue-200"
            case "delivered":
                return "bg-green-100 text-green-800 border-green-200"
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
            case "completed":
                return "bg-gray-100 text-gray-800 border-gray-200"
            case "cancelled":
                return "bg-red-100 text-red-800 border-red-200"
            case "failed":
                return "bg-red-100 text-red-800 border-red-200"
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

    // Format vital signs for display
    const formatVitalSigns = (vitalSigns) => {
        if (!vitalSigns) return 'N/A'

        if (typeof vitalSigns === 'string') {
            return vitalSigns
        }

        if (typeof vitalSigns === 'object') {
            const parts = []
            if (vitalSigns.heartRate) parts.push(`HR: ${vitalSigns.heartRate}bpm`)
            if (vitalSigns.bloodPressure) parts.push(`BP: ${vitalSigns.bloodPressure}`)
            if (vitalSigns.temperature) parts.push(`Temp: ${vitalSigns.temperature}°C`)
            if (vitalSigns.respiratoryRate) parts.push(`RR: ${vitalSigns.respiratoryRate}`)
            if (vitalSigns.oxygenSaturation) parts.push(`SpO2: ${vitalSigns.oxygenSaturation}%`)
            return parts.join(', ') || 'Vitals recorded'
        }

        return 'N/A'
    }

    // Filter communications to exclude failed, cancelled, completed AND discharged ones for display
    const getDisplayCommunications = () => {
        return hospitalCommunications.filter(comm =>
            !['failed', 'cancelled', 'completed'].includes(comm.status) // Use 'completed' instead of 'discharged'
        )
    }
    // Get status display text
    const getStatusDisplay = (status) => {
        const statusMap = {
            'pending': 'Pending',
            'sent': 'Sent to Hospital',
            'delivered': 'Delivered',
            'acknowledged': 'Acknowledged',
            'preparing': 'Hospital Preparing',
            'ready': 'Hospital Ready',
            'en_route': 'Patient En Route',
            'arrived': 'Patient Arrived',
            'completed': 'Completed',
            'discharged': 'Discharged', // Add this
            'cancelled': 'Cancelled',
            'failed': 'Failed'
        }
        return statusMap[status] || status
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

    const displayCommunications = getDisplayCommunications()

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fff3ea] via-[#fff3ea] to-[#ffe6c5]">
            <Sidebar />

            <main className="ml-64 px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Title */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-[#1a0000] mb-2">Hospital Staff Dashboard</h1>
                    <p className="text-[#740000] text-sm sm:text-base">
                        {currentHospital ? `Managing communications for ${currentHospital.name}` : 'Loading hospital information...'}
                    </p>
                </div>

                {/* Hospital Info */}
                <HospitalInfo />

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
                    <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm text-[#740000] mb-1">Active Patients</p>
                                <p className="text-2xl sm:text-3xl font-bold text-[#1a0000]">{stats.activePatients}</p>
                            </div>
                            <Users className="w-8 h-8 sm:w-12 sm:h-12 text-[#b90000]/20" />
                        </div>
                    </div>
                    <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm text-[#740000] mb-1">Critical Cases</p>
                                <p className="text-2xl sm:text-3xl font-bold text-[#b90000]">{stats.criticalCases}</p>
                            </div>
                            <AlertCircle className="w-8 h-8 sm:w-12 sm:h-12 text-[#b90000]/20" />
                        </div>
                    </div>
                    <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm text-[#740000] mb-1">Pending Comms</p>
                                <p className="text-2xl sm:text-3xl font-bold text-[#1a0000]">{stats.pendingCommunications}</p>
                            </div>
                            <MessageCircle className="w-8 h-8 sm:w-12 sm:h-12 text-[#740000]/20" />
                        </div>
                    </div>
                    <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm text-[#740000] mb-1">Active Incidents</p>
                                <p className="text-2xl sm:text-3xl font-bold text-[#1a0000]">{stats.activeIncidents}</p>
                            </div>
                            <Activity className="w-8 h-8 sm:w-12 sm:h-12 text-[#b90000]/20" />
                        </div>
                    </div>
                    <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm text-[#740000] mb-1">Assessments</p>
                                <p className="text-2xl sm:text-3xl font-bold text-[#1a0000]">{stats.totalAssessments}</p>
                            </div>
                            <Stethoscope className="w-8 h-8 sm:w-12 sm:h-12 text-[#b90000]/20" />
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Hospital Communications Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border-b border-[#ffe6c5]">
                                <div className="mb-4 sm:mb-0">
                                    <h3 className="text-xl sm:text-2xl font-bold text-[#1a0000]">Emergency Communications</h3>
                                    <p className="text-[#740000] text-sm sm:text-base">
                                        {currentHospital
                                            ? `Incoming emergency alerts for ${currentHospital.name}`
                                            : 'Loading hospital communications...'
                                        }
                                    </p>
                                    <p className="text-xs text-[#740000] mt-1">
                                        Showing {displayCommunications.length} active communications
                                        {hospitalCommunications.length > displayCommunications.length &&
                                            ` (${hospitalCommunications.length - displayCommunications.length} failed/cancelled)`
                                        }
                                    </p>
                                </div>
                                <button
                                    onClick={refreshCommunications}
                                    disabled={isRefreshing}
                                    className="px-4 py-2 bg-[#b90000] hover:bg-[#740000] disabled:bg-[#740000]/50 text-[#fff3ea] rounded-lg font-medium text-sm transition-colors flex items-center gap-2 self-start sm:self-auto"
                                >
                                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                                    {isRefreshing ? 'Refreshing...' : 'Refresh'}
                                </button>
                            </div>
                            <div className="p-4 sm:p-6">
                                <div className="space-y-4">
                                    {displayCommunications.length === 0 ? (
                                        <div className="text-center py-8">
                                            <MessageCircle className="w-12 h-12 text-[#740000]/50 mx-auto mb-4" />
                                            <p className="text-[#740000]">
                                                {currentHospital
                                                    ? `No active communications for ${currentHospital.name}`
                                                    : 'Loading communications...'
                                                }
                                            </p>
                                            <p className="text-[#740000] text-sm mt-2">
                                                {hospitalCommunications.length > 0
                                                    ? `${hospitalCommunications.length} communications are in failed or cancelled state.`
                                                    : 'Communications from first aiders will appear here when they send alerts to your hospital.'
                                                }
                                            </p>
                                        </div>
                                    ) : (
                                        displayCommunications.map((communication) => (
                                            <div
                                                key={communication.id}
                                                className="border border-[#ffe6c5] rounded-lg p-4 hover:border-[#b90000] transition"
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-3">
                                                    <div className="flex items-start gap-3 flex-1">
                                                        <MessageCircle className="w-5 h-5 text-[#b90000] mt-1 flex-shrink-0" />
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-semibold text-[#1a0000] break-words">
                                                                {communication.victim_name || "Unknown Victim"}
                                                            </h3>
                                                            <div className="flex items-center gap-2 text-sm text-[#740000] mt-1 flex-wrap">
                                                                <Building className="w-4 h-4 flex-shrink-0" />
                                                                <span className="break-words">From: {communication.first_aider_name}</span>
                                                            </div>
                                                            <div className="text-xs text-[#b90000] mt-1 bg-[#b90000]/10 px-2 py-1 rounded inline-block">
                                                                Alert ID: {communication.alert_reference_id || communication.emergency_alert_id}
                                                            </div>
                                                            <p className="text-sm text-[#740000] mt-1 break-words">
                                                                <strong>Chief Complaint:</strong> {communication.chief_complaint || "Emergency condition"}
                                                            </p>
                                                            <p className="text-sm text-[#740000] break-words">
                                                                <strong>Vitals:</strong> {formatVitalSigns(communication.vital_signs)}
                                                            </p>
                                                            {communication.initial_assessment && (
                                                                <p className="text-sm text-[#740000] break-words mt-1">
                                                                    <strong>Assessment:</strong> {communication.initial_assessment}
                                                                </p>
                                                            )}
                                                            {/* Show assessment badge if available */}
                                                            {communication.has_assessment && (
                                                                <div className="flex items-center gap-1 mt-2">
                                                                    <Stethoscope className="w-4 h-4 text-[#b90000]" />
                                                                    <span className="text-xs text-[#b90000] bg-[#b90000]/10 px-2 py-1 rounded">
                                                                        Assessment Available
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-start sm:items-end gap-2 self-stretch">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(communication.priority)} whitespace-nowrap`}
                                                        >
                                                            {communication.priority?.toUpperCase() || 'HIGH'}
                                                        </span>
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(communication.status)} whitespace-nowrap`}
                                                        >
                                                            {getStatusDisplay(communication.status)}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm text-[#740000] mb-3">
                                                    <div>
                                                        <strong>Estimated Arrival:</strong> {communication.estimated_arrival_minutes || 15} mins
                                                    </div>
                                                    <div>
                                                        <strong>Age/Gender:</strong> {communication.victim_age || 'N/A'} / {communication.victim_gender || 'N/A'}
                                                    </div>
                                                    {communication.required_specialties && communication.required_specialties.length > 0 && (
                                                        <div className="sm:col-span-2">
                                                            <strong>Specialties Needed:</strong> {Array.isArray(communication.required_specialties) ? communication.required_specialties.join(', ') : communication.required_specialties}
                                                        </div>
                                                    )}
                                                    {communication.equipment_needed && communication.equipment_needed.length > 0 && (
                                                        <div className="sm:col-span-2">
                                                            <strong>Equipment:</strong> {Array.isArray(communication.equipment_needed) ? communication.equipment_needed.join(', ') : communication.equipment_needed}
                                                        </div>
                                                    )}
                                                </div>

                                                {communication.first_aid_provided && (
                                                    <div className="mb-3">
                                                        <p className="text-sm text-[#740000] break-words">
                                                            <strong>First Aid Provided:</strong> {communication.first_aid_provided}
                                                        </p>
                                                    </div>
                                                )}

                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm pt-3 border-t border-[#ffe6c5] gap-2">
                                                    <div className="text-[#740000] text-xs sm:text-sm">
                                                        Received: {new Date(communication.created_at).toLocaleString()}
                                                    </div>
                                                    <div className="flex gap-2 flex-wrap">
                                                        {(communication.status === 'sent' || communication.status === 'delivered') && (
                                                            <button
                                                                onClick={() => handleOpenAcknowledge(communication)}
                                                                className="px-3 py-1 bg-[#b90000] hover:bg-[#740000] text-[#fff3ea] rounded text-sm font-medium transition-colors whitespace-nowrap"
                                                            >
                                                                Acknowledge
                                                            </button>
                                                        )}
                                                        {(communication.status === 'acknowledged' || communication.status === 'preparing') && (
                                                            <button
                                                                onClick={() => handleOpenPreparation(communication)}
                                                                className="px-3 py-1 border border-[#b90000] text-[#b90000] hover:bg-[#ffe6c5] rounded text-sm font-medium transition-colors whitespace-nowrap"
                                                            >
                                                                Update Preparation
                                                            </button>
                                                        )}
                                                        {communication.status === 'ready' && (
                                                            <button
                                                                onClick={() => handlePatientArrival(communication)}
                                                                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition-colors whitespace-nowrap"
                                                            >
                                                                Mark as Arrived
                                                            </button>
                                                        )}
                                                        {communication.status === 'en_route' && (
                                                            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded text-sm font-medium whitespace-nowrap">
                                                                Patient En Route
                                                            </span>
                                                        )}
                                                        {communication.status === 'arrived' && (
                                                            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded text-sm font-medium whitespace-nowrap">
                                                                Patient Arrived
                                                            </span>
                                                        )}
                                                        {communication.has_assessment && (
                                                            <button
                                                                onClick={() => {
                                                                    const patient = patients.find(p => p.communicationId === communication.id)
                                                                    if (patient) {
                                                                        handleOpenPatientDetails(patient)
                                                                    }
                                                                }}
                                                                className="px-3 py-1 border border-[#1a0000] text-[#1a0000] hover:bg-[#ffe6c5] rounded text-sm font-medium transition-colors whitespace-nowrap"
                                                            >
                                                                View Assessment
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

                    {/* Patients & Actions Section */}
                    <div className="space-y-6">
                        {/* Patients Section */}
                        <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg">
                            <div className="p-4 sm:p-6 border-b border-[#ffe6c5]">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl sm:text-2xl font-bold text-[#1a0000]">Current Patients</h3>
                                        <p className="text-[#740000] text-sm sm:text-base">Patients currently admitted to the hospital</p>
                                    </div>
                                    <span className="bg-[#b90000] text-white text-sm px-3 py-1 rounded-full">
                                        {patients.length}
                                    </span>
                                </div>
                            </div>
                            <div className="p-4 sm:p-6">
                                <div className="space-y-4">
                                    {patients.length === 0 ? (
                                        <div className="text-center py-8">
                                            <Users className="w-8 h-8 text-[#740000]/50 mx-auto mb-2" />
                                            <p className="text-[#740000] text-sm">No patients currently admitted</p>
                                            <p className="text-[#740000] text-xs mt-2">
                                                Patients will appear here when they arrive at the hospital
                                            </p>
                                        </div>
                                    ) : (
                                        patients.map((patient) => (
                                            <div
                                                key={patient.id}
                                                className="border border-[#ffe6c5] rounded-lg p-4 hover:border-[#b90000] transition cursor-pointer"
                                                onClick={() => handleOpenPatientDetails(patient)}
                                            >
                                                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2">
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-[#1a0000] wrap-break-word">{patient.name}</h3>
                                                        <p className="text-sm text-[#740000]">
                                                            {patient.age} years old • {patient.gender}
                                                        </p>
                                                        {patient.hasAssessment && (
                                                            <div className="flex items-center gap-1 mt-1">
                                                                <Stethoscope className="w-3 h-3 text-[#b90000]" />
                                                                <span className="text-xs text-[#b90000]">Assessment Available</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(patient.status)} whitespace-nowrap self-start`}
                                                    >
                                                        {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm gap-1">
                                                    <span className="text-[#740000] wrap-break-word">Condition: {patient.condition}</span>
                                                    <span className="text-[#740000] whitespace-nowrap">Admitted {patient.admittedAt}</span>
                                                </div>

                                                {/* Show vital signs if available */}
                                                {patient.vitalSigns && Object.keys(patient.vitalSigns).length > 0 && (
                                                    <div className="mt-2 pt-2 border-t border-[#ffe6c5]">
                                                        <div className="flex gap-4 text-xs text-[#740000]">
                                                            {patient.vitalSigns.heartRate && (
                                                                <span>HR: {patient.vitalSigns.heartRate}bpm</span>
                                                            )}
                                                            {patient.vitalSigns.bloodPressure && (
                                                                <span>BP: {patient.vitalSigns.bloodPressure}</span>
                                                            )}
                                                            {patient.vitalSigns.temperature && (
                                                                <span>Temp: {patient.vitalSigns.temperature}°C</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex gap-2 mt-3">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleOpenPatientDetails(patient);
                                                        }}
                                                        className="flex-1 px-3 py-1 bg-[#b90000] hover:bg-[#740000] text-white rounded text-sm font-medium transition-colors flex items-center justify-center gap-1"
                                                    >
                                                        <Eye className="w-3 h-3" />
                                                        Details
                                                    </button>
                                                    {patient.status !== 'discharged' && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handlePatientDischarge(patient);
                                                            }}
                                                            className="flex-1 px-3 py-1 border border-green-600 text-green-600 hover:bg-green-50 rounded text-sm font-medium transition-colors"
                                                        >
                                                            Discharge
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg">
                            <div className="p-4 sm:p-6 border-b border-[#ffe6c5]">
                                <h3 className="text-lg sm:text-xl font-bold text-[#1a0000]">Quick Actions</h3>
                            </div>
                            <div className="p-4 sm:p-6 space-y-2">
                                <button className="w-full text-left px-3 py-2 border border-[#ffe6c5] text-[#1a0000] hover:bg-[#ffe6c5] rounded transition-colors flex items-center text-sm sm:text-base">
                                    <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                                    Call First-Aider
                                </button>
                                <button className="w-full text-left px-3 py-2 border border-[#ffe6c5] text-[#1a0000] hover:bg-[#ffe6c5] rounded transition-colors flex items-center text-sm sm:text-base">
                                    <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
                                    Report Emergency
                                </button>
                                <button className="w-full text-left px-3 py-2 border border-[#ffe6c5] text-[#1a0000] hover:bg-[#ffe6c5] rounded transition-colors flex items-center text-sm sm:text-base">
                                    <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                                    View Team
                                </button>
                                <button
                                    onClick={refreshCommunications}
                                    className="w-full text-left px-3 py-2 border border-[#ffe6c5] text-[#1a0000] hover:bg-[#ffe6c5] rounded transition-colors flex items-center text-sm sm:text-base"
                                >
                                    <RefreshCw className="w-4 h-4 mr-2 flex-shrink-0" />
                                    Refresh Data
                                </button>
                            </div>
                        </div>

                        {/* Hospital Info */}
                        {currentHospital && (
                            <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg">
                                <div className="p-4 sm:p-6 border-b border-[#ffe6c5]">
                                    <h3 className="text-lg sm:text-xl font-bold text-[#1a0000]">Hospital Information</h3>
                                </div>
                                <div className="p-4 sm:p-6 space-y-2">
                                    <p className="text-[#1a0000] font-medium break-words">{currentHospital.name}</p>
                                    <p className="text-sm text-[#740000] break-words">{currentHospital.location || 'Location not specified'}</p>
                                    <p className="text-sm text-[#740000]">Emergency: +254 700 123 456</p>
                                    {currentHospital.phone && (
                                        <p className="text-sm text-[#740000] break-words">Phone: {currentHospital.phone}</p>
                                    )}
                                    <div className="pt-2">
                                        <p className="text-xs text-[#740000]">Hospital ID: {currentHospital.id}</p>
                                        <p className="text-xs text-[#740000]">Total Communications: {hospitalCommunications.length}</p>
                                        <p className="text-xs text-[#740000]">Active Communications: {displayCommunications.length}</p>
                                        <p className="text-xs text-[#740000]">Current Patients: {patients.length}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Acknowledge Modal */}
            {showAcknowledgeModal && selectedCommunication && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-[#fff3ea] border border-[#ffe6c5] rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#ffe6c5] flex-shrink-0">
                            <h2 className="text-xl sm:text-2xl font-bold text-[#1a0000]">Acknowledge Emergency</h2>
                            <button
                                onClick={() => setShowAcknowledgeModal(false)}
                                className="p-2 hover:bg-[#ffe6c5] rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-[#1a0000]" />
                            </button>
                        </div>
                        <form onSubmit={handleAcknowledge} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
                            <div className="bg-[#ffe6c5] p-4 rounded-lg">
                                <h3 className="font-semibold text-[#1a0000] mb-2 break-words">{selectedCommunication.victim_name}</h3>
                                <p className="text-sm text-[#740000] break-words">
                                    <strong>Condition:</strong> {selectedCommunication.chief_complaint}
                                </p>
                                <p className="text-sm text-[#740000]">
                                    <strong>First Aider:</strong> {selectedCommunication.first_aider_name}
                                </p>
                                <p className="text-sm text-[#740000]">
                                    <strong>ETA:</strong> {selectedCommunication.estimated_arrival_minutes} minutes
                                </p>
                                <p className="text-sm text-[#740000]">
                                    <strong>Priority:</strong> {selectedCommunication.priority}
                                </p>
                                <p className="text-sm text-[#740000]">
                                    <strong>Alert ID:</strong> {selectedCommunication.alert_reference_id || selectedCommunication.emergency_alert_id}
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
                                    rows={4}
                                    placeholder="Enter any preparation notes or instructions..."
                                    className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent resize-vertical min-h-[100px]"
                                />
                            </div>

                            <div className="flex gap-3 pt-4 flex-col sm:flex-row">
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
                    <div className="bg-[#fff3ea] border border-[#ffe6c5] rounded-lg w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#ffe6c5] flex-shrink-0">
                            <h2 className="text-xl sm:text-2xl font-bold text-[#1a0000]">Update Preparation Status</h2>
                            <button
                                onClick={() => setShowPreparationModal(false)}
                                className="p-2 hover:bg-[#ffe6c5] rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-[#1a0000]" />
                            </button>
                        </div>
                        <form onSubmit={handlePreparationUpdate} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
                            <div className="bg-[#ffe6c5] p-4 rounded-lg">
                                <h3 className="font-semibold text-[#1a0000] mb-2 break-words">{selectedCommunication.victim_name}</h3>
                                <p className="text-sm text-[#740000] break-words">
                                    <strong>Condition:</strong> {selectedCommunication.chief_complaint}
                                </p>
                                <p className="text-sm text-[#740000]">
                                    <strong>First Aider:</strong> {selectedCommunication.first_aider_name}
                                </p>
                                <p className="text-sm text-[#740000]">
                                    <strong>ETA:</strong> {selectedCommunication.estimated_arrival_minutes} minutes
                                </p>
                                <p className="text-sm text-[#740000]">
                                    <strong>Alert ID:</strong> {selectedCommunication.alert_reference_id || selectedCommunication.emergency_alert_id}
                                </p>
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-medium text-[#1a0000]">Preparation Checklist</h4>

                                <label className="flex items-center space-x-3 p-2 hover:bg-[#ffe6c5] rounded transition-colors">
                                    <input
                                        type="checkbox"
                                        name="doctors_ready"
                                        checked={preparationData.doctors_ready}
                                        onChange={handlePreparationInputChange}
                                        className="rounded border-[#ffe6c5] text-[#b90000] focus:ring-[#b90000] w-4 h-4"
                                    />
                                    <span className="text-sm text-[#1a0000]">Doctors Ready</span>
                                </label>

                                <label className="flex items-center space-x-3 p-2 hover:bg-[#ffe6c5] rounded transition-colors">
                                    <input
                                        type="checkbox"
                                        name="nurses_ready"
                                        checked={preparationData.nurses_ready}
                                        onChange={handlePreparationInputChange}
                                        className="rounded border-[#ffe6c5] text-[#b90000] focus:ring-[#b90000] w-4 h-4"
                                    />
                                    <span className="text-sm text-[#1a0000]">Nurses Ready</span>
                                </label>

                                <label className="flex items-center space-x-3 p-2 hover:bg-[#ffe6c5] rounded transition-colors">
                                    <input
                                        type="checkbox"
                                        name="equipment_ready"
                                        checked={preparationData.equipment_ready}
                                        onChange={handlePreparationInputChange}
                                        className="rounded border-[#ffe6c5] text-[#b90000] focus:ring-[#b90000] w-4 h-4"
                                    />
                                    <span className="text-sm text-[#1a0000]">Equipment Ready</span>
                                </label>

                                <label className="flex items-center space-x-3 p-2 hover:bg-[#ffe6c5] rounded transition-colors">
                                    <input
                                        type="checkbox"
                                        name="bed_ready"
                                        checked={preparationData.bed_ready}
                                        onChange={handlePreparationInputChange}
                                        className="rounded border-[#ffe6c5] text-[#b90000] focus:ring-[#b90000] w-4 h-4"
                                    />
                                    <span className="text-sm text-[#1a0000]">Bed Available</span>
                                </label>

                                <label className="flex items-center space-x-3 p-2 hover:bg-[#ffe6c5] rounded transition-colors">
                                    <input
                                        type="checkbox"
                                        name="blood_available"
                                        checked={preparationData.blood_available}
                                        onChange={handlePreparationInputChange}
                                        className="rounded border-[#ffe6c5] text-[#b90000] focus:ring-[#b90000] w-4 h-4"
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
                                    rows={4}
                                    placeholder="Any additional preparation notes..."
                                    className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent resize-vertical min-h-[100px]"
                                />
                            </div>

                            <div className="flex gap-3 pt-4 flex-col sm:flex-row">
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

            {/* Patient Details Modal */}
            {showPatientDetailsModal && selectedPatient && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-[#fff3ea] border border-[#ffe6c5] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#ffe6c5] flex-shrink-0">
                            <h2 className="text-xl sm:text-2xl font-bold text-[#1a0000]">Patient Details & Assessment</h2>
                            <button
                                onClick={() => setShowPatientDetailsModal(false)}
                                className="p-2 hover:bg-[#ffe6c5] rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-[#1a0000]" />
                            </button>
                        </div>
                        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1">
                            {/* Patient Header */}
                            <div className="bg-[#ffe6c5] p-4 rounded-lg">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-[#1a0000]">{selectedPatient.name}</h3>
                                        <p className="text-[#740000]">
                                            {selectedPatient.age} years old • {selectedPatient.gender}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedPatient.status)}`}>
                                                {selectedPatient.status.charAt(0).toUpperCase() + selectedPatient.status.slice(1)}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(selectedPatient.priority)}`}>
                                                {selectedPatient.priority?.toUpperCase() || 'MEDIUM'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-[#740000]">Admitted: {selectedPatient.admittedAt}</p>
                                        <p className="text-sm text-[#740000]">First Aider: {selectedPatient.firstAiderName}</p>
                                        {selectedPatient.emergencyType && (
                                            <p className="text-sm text-[#740000]">Emergency: {selectedPatient.emergencyType}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Medical Information Grid */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Vital Signs */}
                                <div>
                                    <h4 className="text-lg font-semibold text-[#1a0000] mb-3 flex items-center gap-2">
                                        <Activity className="w-5 h-5" />
                                        Vital Signs
                                    </h4>
                                    <div className="bg-white border border-[#ffe6c5] rounded-lg p-4">
                                        {selectedPatient.vitalSigns && Object.keys(selectedPatient.vitalSigns).length > 0 ? (
                                            <div className="grid grid-cols-2 gap-4 text-sm">
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
                                                {selectedPatient.vitalSigns.respiratoryRate && (
                                                    <div>
                                                        <span className="text-[#740000]">Respiratory Rate:</span>
                                                        <p className="text-[#1a0000] font-medium">{selectedPatient.vitalSigns.respiratoryRate}</p>
                                                    </div>
                                                )}
                                                {selectedPatient.vitalSigns.oxygenSaturation && (
                                                    <div>
                                                        <span className="text-[#740000]">Oxygen Saturation:</span>
                                                        <p className="text-[#1a0000] font-medium">{selectedPatient.vitalSigns.oxygenSaturation}%</p>
                                                    </div>
                                                )}
                                                {selectedPatient.vitalSigns.bloodGlucose && (
                                                    <div>
                                                        <span className="text-[#740000]">Blood Glucose:</span>
                                                        <p className="text-[#1a0000] font-medium">{selectedPatient.vitalSigns.bloodGlucose} mg/dL</p>
                                                    </div>
                                                )}
                                                {selectedPatient.vitalSigns.gcsScore && (
                                                    <div className="col-span-2">
                                                        <span className="text-[#740000]">GCS Score:</span>
                                                        <p className="text-[#1a0000] font-medium">{selectedPatient.vitalSigns.gcsScore}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-[#740000] text-sm">No vital signs recorded</p>
                                        )}
                                    </div>
                                </div>

                                {/* Assessment Information */}
                                <div>
                                    <h4 className="text-lg font-semibold text-[#1a0000] mb-3 flex items-center gap-2">
                                        <Stethoscope className="w-5 h-5" />
                                        Assessment Information
                                    </h4>
                                    <div className="bg-white border border-[#ffe6c5] rounded-lg p-4 space-y-3">
                                        <div>
                                            <span className="text-[#740000] text-sm">Chief Complaint:</span>
                                            <p className="text-[#1a0000] font-medium">{selectedPatient.condition}</p>
                                        </div>
                                        {selectedPatient.allergies && selectedPatient.allergies !== 'Not specified' && (
                                            <div>
                                                <span className="text-[#740000] text-sm">Allergies:</span>
                                                <p className="text-[#1a0000] font-medium">{selectedPatient.allergies}</p>
                                            </div>
                                        )}
                                        {selectedPatient.medications && selectedPatient.medications !== 'None reported' && (
                                            <div>
                                                <span className="text-[#740000] text-sm">Medications:</span>
                                                <p className="text-[#1a0000] font-medium">{selectedPatient.medications}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Symptoms & Injuries */}
                            {(selectedPatient.assessmentData?.symptoms?.length > 0 || selectedPatient.assessmentData?.injuries?.length > 0) && (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {selectedPatient.assessmentData?.symptoms?.length > 0 && (
                                        <div>
                                            <h4 className="text-lg font-semibold text-[#1a0000] mb-3">Symptoms Reported</h4>
                                            <div className="bg-white border border-[#ffe6c5] rounded-lg p-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedPatient.assessmentData.symptoms.map((symptom, index) => (
                                                        <span key={index} className="px-3 py-1 bg-[#ffe6c5] text-[#1a0000] rounded-full text-sm">
                                                            {symptom}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {selectedPatient.assessmentData?.injuries?.length > 0 && (
                                        <div>
                                            <h4 className="text-lg font-semibold text-[#1a0000] mb-3">Injuries Identified</h4>
                                            <div className="bg-white border border-[#ffe6c5] rounded-lg p-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedPatient.assessmentData.injuries.map((injury, index) => (
                                                        <span key={index} className="px-3 py-1 bg-[#ffe6c5] text-[#1a0000] rounded-full text-sm">
                                                            {injury}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Pain Assessment */}
                            {(selectedPatient.assessmentData?.painLevel || selectedPatient.assessmentData?.painLocation) && (
                                <div>
                                    <h4 className="text-lg font-semibold text-[#1a0000] mb-3">Pain Assessment</h4>
                                    <div className="bg-white border border-[#ffe6c5] rounded-lg p-4">
                                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                                            {selectedPatient.assessmentData.painLevel && (
                                                <div>
                                                    <span className="text-[#740000]">Pain Level:</span>
                                                    <p className="text-[#1a0000] font-medium">{selectedPatient.assessmentData.painLevel}</p>
                                                </div>
                                            )}
                                            {selectedPatient.assessmentData.painLocation && (
                                                <div>
                                                    <span className="text-[#740000]">Pain Location:</span>
                                                    <p className="text-[#1a0000] font-medium">{selectedPatient.assessmentData.painLocation}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Treatment Provided */}
                            {selectedPatient.assessmentData?.treatmentProvided && (
                                <div>
                                    <h4 className="text-lg font-semibold text-[#1a0000] mb-3">Treatment Provided by First Aider</h4>
                                    <div className="bg-white border border-[#ffe6c5] rounded-lg p-4">
                                        <p className="text-[#1a0000] whitespace-pre-wrap">{selectedPatient.assessmentData.treatmentProvided}</p>
                                        {selectedPatient.assessmentData.medicationsAdministered && (
                                            <div className="mt-3">
                                                <span className="text-[#740000] text-sm font-medium">Medications Administered:</span>
                                                <p className="text-[#1a0000] whitespace-pre-wrap">{selectedPatient.assessmentData.medicationsAdministered}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Assessment Notes */}
                            {selectedPatient.assessmentData?.notes && (
                                <div>
                                    <h4 className="text-lg font-semibold text-[#1a0000] mb-3">First Aider Notes</h4>
                                    <div className="bg-white border border-[#ffe6c5] rounded-lg p-4">
                                        <p className="text-[#1a0000] whitespace-pre-wrap">{selectedPatient.assessmentData.notes}</p>
                                    </div>
                                </div>
                            )}

                            {/* Recommendations */}
                            {selectedPatient.assessmentData?.recommendations && (
                                <div>
                                    <h4 className="text-lg font-semibold text-[#1a0000] mb-3">First Aider Recommendations</h4>
                                    <div className="bg-white border border-[#ffe6c5] rounded-lg p-4">
                                        <p className="text-[#1a0000] whitespace-pre-wrap">{selectedPatient.assessmentData.recommendations}</p>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-4 border-t border-[#ffe6c5]">
                                <button
                                    onClick={() => setShowPatientDetailsModal(false)}
                                    className="flex-1 px-4 py-2 border border-[#ffe6c5] text-[#1a0000] hover:bg-[#ffe6c5] rounded-lg font-medium transition-colors"
                                >
                                    Close
                                </button>
                                {selectedPatient.status !== 'discharged' && (
                                    <button
                                        onClick={() => {
                                            handlePatientDischarge(selectedPatient);
                                            setShowPatientDetailsModal(false);
                                        }}
                                        className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                                    >
                                        Discharge Patient
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}