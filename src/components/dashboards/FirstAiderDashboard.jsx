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
    const [userProfile, setUserProfile] = useState(null)
    const [stats, setStats] = useState({
        activeAssignments: 0,
        highPriority: 0,
        victimsAssisted: 0,
        activeCommunications: 0
    })

    // Emergency Alert Form Data
    const [emergencyData, setEmergencyData] = useState({
        emergency_type: "medical",
        priority: "medium",
        description: "",
        address: "",
        location_id: "",
        latitude: "",
        longitude: ""
    })

    // Status Update Form Data
    const [statusUpdateData, setStatusUpdateData] = useState({
        address: "",
        status: "in_progress",
        details: "",
        latitude: "",
        longitude: ""
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
        vital_signs: {},
        first_aid_provided: "",
        estimated_arrival_minutes: "15",
        required_specialties: [],
        equipment_needed: [],
        blood_type_required: "",
        first_aider: "" // Added first_aider field
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

    // Priority Options
    const priorityOptions = [
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" },
        { value: "critical", label: "Critical" }
    ]

    // Status Options
    const statusOptions = [
        { value: "dispatched", label: "Dispatched" },
        { value: "en_route", label: "En Route to Hospital" },
        { value: "arrived", label: "Arrived at Hospital" },
        { value: "completed", label: "Completed" },

    ]

    // Communication Status Options
    const communicationStatusOptions = [
        { value: "pending", label: "Pending" },
        { value: "sent", label: "Sent" },
        { value: "acknowledged", label: "Acknowledged" },
        { value: "preparing", label: "Preparing" },
        { value: "ready", label: "Ready" },
        { value: "en_route", label: "En Route" },
        { value: "arrived", label: "Arrived" },
        { value: "cancelled", label: "Cancelled" }
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
        { value: "other", label: "Other" }

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

    // Enhanced geocoding function with coordinate conversion
    const geocodeAddress = async (address) => {
        try {
            const response = await apiClient.post('/geolocation/geocode/', {
                address: address
            })

            const locationData = response.data

            if (locationData.latitude && locationData.longitude) {
                return {
                    latitude: locationData.latitude,
                    longitude: locationData.longitude,
                    formatted_address: locationData.formatted_address || address,
                    isCoordinate: false
                }
            }

            throw new Error('Could not convert address to coordinates')

        } catch (error) {
            console.error('Address geocoding failed:', error)
            throw new Error('Unable to convert address to coordinates. Please check the address or use coordinates directly.')
        }
    }

    // Parse coordinate string (supports various formats)
    const parseCoordinates = (coordinateString) => {
        if (!coordinateString) return null

        // Remove any whitespace and convert to lowercase
        const cleanString = coordinateString.trim().toLowerCase()

        // Try different coordinate formats
        const patterns = [
            // Format: "lat, lng" or "lat,lng"
            /^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/,
            // Format: "lat lng"
            /^(-?\d+\.?\d*)\s+(-?\d+\.?\d*)$/,
            // Format with directions: "N 1.2345, E 36.7890" or "1.2345 N, 36.7890 E"
            /([ns]?)\s*(-?\d+\.?\d*)\s*,\s*([ew]?)\s*(-?\d+\.?\d*)/i,
        ]

        for (const pattern of patterns) {
            const match = cleanString.match(pattern)
            if (match) {
                let lat, lng

                if (match.length === 3) {
                    // Simple "lat, lng" or "lat lng" format
                    lat = parseFloat(match[1])
                    lng = parseFloat(match[2])
                } else if (match.length === 5) {
                    // Format with directions
                    const latDir = match[1].toUpperCase()
                    const latVal = parseFloat(match[2])
                    const lngDir = match[3].toUpperCase()
                    const lngVal = parseFloat(match[4])

                    lat = (latDir === 'S') ? -latVal : latVal
                    lng = (lngDir === 'W') ? -lngVal : lngVal
                }

                // Validate coordinate ranges
                if (Math.abs(lat) <= 90 && Math.abs(lng) <= 180) {
                    return {
                        latitude: lat,
                        longitude: lng,
                        formatted_address: `Coordinates: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
                        isCoordinate: true
                    }
                }
            }
        }

        return null
    }

    // Enhanced geocoding function with landmark fallback
    const geocodeCoordinates = async (lat, lng) => {
        try {
            // First try to get formatted address
            const response = await apiClient.post('/geolocation/geocode/', {
                latitude: lat,
                longitude: lng
            })

            const addressData = response.data

            // Check if we have a proper formatted address
            if (addressData.formatted_address && addressData.formatted_address.trim() !== '') {
                return {
                    address: addressData.formatted_address.trim(),
                    isLandmark: false
                }
            }

            // If no formatted address, try to get landmark or nearby place
            if (addressData.landmark || addressData.nearby_place) {
                return {
                    address: addressData.landmark || addressData.nearby_place,
                    isLandmark: true
                }
            }

            // If we have street or city information, construct address
            if (addressData.street || addressData.city) {
                const constructedAddress = `${addressData.street || ''} ${addressData.city || ''} ${addressData.county || ''} ${addressData.country || ''}`.trim()
                if (constructedAddress !== '') {
                    return {
                        address: constructedAddress,
                        isLandmark: false
                    }
                }
            }

            // Final fallback - get nearby landmarks through a separate API call
            try {
                const landmarksResponse = await apiClient.post('/geolocation/hospitals/nearby/', {
                    latitude: lat,
                    longitude: lng,
                    radius: 500 // 500 meters radius
                })

                const landmarks = landmarksResponse.data || []
                if (landmarks.length > 0) {
                    const nearestLandmark = landmarks[0]
                    return {
                        address: `Near ${nearestLandmark.name}, ${nearestLandmark.address || ''}`.trim(),
                        isLandmark: true
                    }
                }
            } catch (landmarkError) {
                console.warn('Landmark lookup failed:', landmarkError)
            }

            // Ultimate fallback - coordinates with context
            return {
                address: `Unnamed Road, Kenya (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
                isLandmark: true
            }

        } catch (error) {
            console.error('Geocoding failed:', error)
            throw new Error('Unable to determine location address')
        }
    }

    // Process location input - handles both addresses and coordinates
    const processLocationInput = async (locationInput) => {
        if (!locationInput) {
            throw new Error('Location input is required')
        }

        // First, try to parse as coordinates
        const coordinates = parseCoordinates(locationInput)
        if (coordinates) {
            return coordinates
        }

        // If not coordinates, treat as address and geocode
        return await geocodeAddress(locationInput)
    }

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
            console.log('DEBUG - Fetching active emergencies...')
            setIsLoading(true)
            setFormError("") // Clear previous errors

            let response;
            try {
                response = await apiClient.get('/emergencies/active/')
                console.log('DEBUG - Raw API response:', response)
                console.log('DEBUG - Response type:', typeof response)
                console.log('DEBUG - Is array?', Array.isArray(response))
                console.log('DEBUG - Response content:', response)
            } catch (apiError) {
                console.error('DEBUG - API request failed:', apiError)
                if (!navigator.onLine) {
                    throw new Error('No internet connection. Please check your network and try again.')
                } else if (apiError.response) {
                    throw new Error(`Server error: ${apiError.response.status} - ${apiError.response.statusText}`)
                } else if (apiError.request) {
                    throw new Error('Unable to connect to server. Please try again later.')
                } else {
                    throw new Error('Failed to fetch emergencies: ' + apiError.message)
                }
            }

            // Handle the response - it's directly the array of emergencies
            let activeEmergencies = []

            if (Array.isArray(response)) {
                // The response IS the array of emergencies
                activeEmergencies = response
                console.log('DEBUG - Response is direct array with', activeEmergencies.length, 'emergencies')
            } else if (response && Array.isArray(response.data)) {
                // Fallback: response has data property that's an array
                activeEmergencies = response.data
                console.log('DEBUG - Response has data array with', activeEmergencies.length, 'emergencies')
            } else if (response && typeof response === 'object') {
                // Try to extract data from various possible structures
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
                console.log('DEBUG - No active emergencies found')
                setAssignments([])
                setStats(prev => ({
                    ...prev,
                    activeAssignments: 0,
                    highPriority: 0,
                }))
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
            setStats(prev => ({
                ...prev,
                activeAssignments: formattedAssignments.filter(a =>
                    a.status !== "completed" && a.status !== "cancelled"
                ).length,
                highPriority: formattedAssignments.filter(a =>
                    a.priority === "high" || a.priority === "critical"
                ).length,
            }))

            console.log('DEBUG - Successfully updated assignments and stats')

        } catch (error) {
            console.error('Failed to fetch active emergencies:', error)
            setAssignments([])

            // Show user-friendly error message
            const errorMessage = error.message || "Failed to load active emergencies. Please check your connection and try again."
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

    // Replace your getFirstAiderInfo function with this:
    const getFirstAiderInfo = () => {
        try {
            const userData = localStorage.getItem('haven_user');
            console.log('Getting first aider info from localStorage...');

            if (!userData) {
                console.warn('No user data found in localStorage');
                return null;
            }

            const userProfile = JSON.parse(userData);
            console.log('User profile structure:', userProfile);

            // Enhanced role detection - check multiple possible locations
            let userRole = userProfile.role ||
                userProfile.user_role ||
                userProfile.user_type ||
                userProfile.profile?.role ||
                'first_aider'; // Default fallback

            console.log('Detected role:', userRole);

            const firstAiderInfo = {
                id: userProfile.id || userProfile.user_id || `temp-${Date.now()}`,
                name: `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() || 'First Aider',
                contact: userProfile.phone_number || userProfile.contact_number || '',
                organization: userProfile.organization?.name || userProfile.organization || '',
                badge_number: userProfile.badge_number || userProfile.employee_id || '',
                role: userRole
            }

            console.log('First aider info:', firstAiderInfo);

            // If role is not first_aider, we need to handle it
            if (firstAiderInfo.role !== 'first_aider') {
                console.warn('User role mismatch:', firstAiderInfo.role);
                console.log('Attempting to use first_aider role for API calls...');

                // Force first_aider role for API compatibility
                return {
                    ...firstAiderInfo,
                    role: 'first_aider'
                };
            }

            return firstAiderInfo;

        } catch (error) {
            console.error('Error getting first aider info:', error);

            // Return a fallback first aider object
            return {
                id: `fallback-${Date.now()}`,
                name: 'First Aider',
                contact: '',
                organization: '',
                badge_number: '',
                role: 'first_aider'
            };
        }
    }

    // Fetch hospital communications for this first aider - FILTERED VERSION
    const fetchHospitalCommunications = async () => {
        try {
            console.log('DEBUG - Fetching hospital communications...')

            // Get first aider info to filter communications
            const firstAiderInfo = getFirstAiderInfo();
            console.log('DEBUG - First aider info:', firstAiderInfo);

            if (!firstAiderInfo || !firstAiderInfo.id) {
                console.warn('No first aider info available, cannot fetch communications')
                setHospitalCommunications([])
                return
            }

            let communications = [];

            try {
                // Try to fetch all communications and filter by first aider
                const response = await apiClient.get('/hospital-comms/api/communications/')
                console.log('DEBUG - Communications API response:', response)

                // Extract communications array from response
                if (Array.isArray(response)) {
                    communications = response;
                } else if (response && Array.isArray(response.data)) {
                    communications = response.data;
                } else if (response && response.data && Array.isArray(response.data.results)) {
                    communications = response.data.results;
                } else if (response && Array.isArray(response.results)) {
                    communications = response.results;
                } else {
                    console.log('DEBUG - Unexpected response format, trying to extract data...', response);
                    // Try to find communications in the response object
                    communications = response?.communications || response?.data || [];
                }

                console.log('DEBUG - Raw communications:', communications);

                // Filter communications by first_aider - handle different field names
                const filteredCommunications = communications.filter(comm => {
                    // Try different possible field names for first aider ID
                    const firstAiderId = comm.first_aider_id || comm.first_aider || comm.user_id || comm.firstAiderId;
                    const firstAiderName = comm.first_aider_name;

                    console.log(`DEBUG - Comparing ID: ${firstAiderId} with ${firstAiderInfo.id}`);
                    console.log(`DEBUG - Comparing name: "${firstAiderName}" with "${firstAiderInfo.name}"`);

                    // Check if either ID or name matches
                    const idMatch = firstAiderId && firstAiderId.toString() === firstAiderInfo.id.toString();
                    const nameMatch = firstAiderName && firstAiderInfo.name &&
                        firstAiderName.toLowerCase().includes(firstAiderInfo.name.toLowerCase());

                    console.log(`DEBUG - ID match: ${idMatch}, Name match: ${nameMatch}`);

                    return idMatch || nameMatch;
                });

                communications = filteredCommunications;
                console.log(`DEBUG - Filtered ${communications.length} communications for first aider ${firstAiderInfo.id}`);

            } catch (apiError) {
                console.error('DEBUG - Communications API failed:', apiError);
                // For now, use all communications as fallback
                communications = [];
                console.log('DEBUG - Using empty communications data due to API error');
            }

            console.log('DEBUG - Final communications data:', communications);

            // FILTER OUT FAILED COMMUNICATIONS
            const successfulCommunications = communications.filter(comm => {
                const status = comm.status || comm.communication_status;
                // Define what you consider "failed" statuses
                const failedStatuses = ['failed', 'cancelled', 'rejected', 'error'];
                return !failedStatuses.includes(status);
            });

            console.log(`DEBUG - Filtered out failed communications. Original: ${communications.length}, After filter: ${successfulCommunications.length}`);

            // Ensure we have proper hospital names for display
            const formattedCommunications = successfulCommunications.map(comm => {
                let hospitalName = comm.hospital_name;

                // If no hospital name, try to get it from hospitals list or API
                if (!hospitalName) {
                    const hospital = hospitals.find(h => h.id == comm.hospital);
                    if (hospital) {
                        hospitalName = hospital.name;
                    } else {
                        hospitalName = `Hospital ${comm.hospital}`;
                    }
                }

                return {
                    id: comm.id,
                    emergency_alert_id: comm.emergency_alert_id || comm.alert_reference_id,
                    hospital_id: comm.hospital,
                    hospital_name: hospitalName,
                    first_aider: comm.first_aider || comm.first_aider_id,
                    first_aider_name: comm.first_aider_name,
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

            console.log('DEBUG - Formatted communications:', formattedCommunications)
            setHospitalCommunications(formattedCommunications)

            // Update stats - only count active successful communications
            const activeComms = formattedCommunications.filter(c =>
                ['sent', 'acknowledged', 'preparing', 'ready', 'en_route'].includes(c.status)
            ).length

            console.log(`DEBUG - Active communications: ${activeComms}`)
            setStats(prev => ({
                ...prev,
                activeCommunications: activeComms
            }))

        } catch (error) {
            console.error('Failed to fetch hospital communications:', error)
            // Set empty array and log error for debugging
            setHospitalCommunications([])
            setStats(prev => ({
                ...prev,
                activeCommunications: 0
            }))

            console.log('Hospital communications fetch failed, using empty data')
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
        if (!apiStatus) return 'dispatched'

        const statusMap = {
            'dispatched': 'dispatched',
            'en_route': 'en-route',
            'arrived': 'completed',
            'completed': 'completed'

        }
        return statusMap[apiStatus] || 'dispatched'
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


    // Open status update form
    const handleOpenStatusUpdate = (assignment) => {
        setSelectedAssignment(assignment)
        setStatusUpdateData({
            address: assignment.originalData?.address || "",
            status: "in_progress",
            details: "",
            latitude: assignment.originalData?.current_latitude || "",
            longitude: assignment.originalData?.current_longitude || ""
        })
        setShowStatusUpdateForm(true)
    }
    // Update the handleStatusUpdate function with this corrected version
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

            // Add location data if available
            if (statusUpdateData.address || (statusUpdateData.latitude && statusUpdateData.longitude)) {
                let locationData = {}

                if (statusUpdateData.latitude && statusUpdateData.longitude) {
                    // Use provided coordinates
                    locationData = {
                        latitude: parseFloat(statusUpdateData.latitude),
                        longitude: parseFloat(statusUpdateData.longitude),
                        address: statusUpdateData.address || selectedAssignment.location
                    }
                } else if (statusUpdateData.address) {
                    // Process address to get coordinates
                    try {
                        const processedLocation = await processLocationInput(statusUpdateData.address)
                        locationData = {
                            latitude: processedLocation.latitude,
                            longitude: processedLocation.longitude,
                            address: processedLocation.formatted_address
                        }
                    } catch (locationError) {
                        console.warn('Location processing failed, continuing without location update:', locationError)
                        // Continue without location update if geocoding fails
                    }
                }

                // Update location if we have valid data
                if (locationData.latitude && locationData.longitude) {
                    try {
                        await apiClient.put(`/emergencies/${selectedAssignment.id}/location/`, {
                            latitude: locationData.latitude,
                            longitude: locationData.longitude,
                            address: locationData.address
                        })
                        console.log('Location updated successfully')
                    } catch (locationError) {
                        console.warn('Location update failed, continuing with status update:', locationError)
                        // Continue with status update even if location update fails
                    }
                }
            }

            // Update status using the AlertStatusAPIView endpoint
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
                fetchActiveEmergencies()
            }, 1000)

            // Close form after success
            setTimeout(() => {
                setShowStatusUpdateForm(false)
                setSelectedAssignment(null)
                setStatusUpdateData({
                    address: "",
                    status: "in_progress",
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

    // Add this helper function to map API status to UI status
    const mapStatusToUI = (apiStatus) => {
        const statusMap = {
            'dispatched': 'dispatched',
            'en_route': 'en-route',
            'arrived': 'arrived',
            'completed': 'completed',

        }
        return statusMap[apiStatus] || 'dispatched'
    }



    const handleAcceptAssignment = async (assignmentId) => {
        try {
            setIsSubmitting(true)
            console.log('Accepting assignment:', assignmentId)

            // Use the correct status value - 'dispatched' is likely what you want
            const response = await apiClient.post(`/emergencies/${assignmentId}/status/`, {
                status: 'dispatched',  // Changed to match backend
                details: 'First aider has accepted the assignment'
            })

            console.log('Accept assignment response:', response)

            // Update local state
            setAssignments(prev => prev.map(assignment =>
                assignment.id === assignmentId
                    ? { ...assignment, status: 'dispatched' } // Keep UI status as is
                    : assignment
            ))

            setFormSuccess("Assignment accepted successfully!")

            // Refresh data
            setTimeout(() => {
                fetchActiveEmergencies()
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
    // Update the handleCancelEmergency function
    const handleCancelEmergency = async (assignmentId) => {
        try {
            setIsSubmitting(true)

            // First update status to cancelled
            await apiClient.post(`/emergencies/${assignmentId}/status/`, {
                status: 'cancelled',
                details: 'Cancelled by first aider'
            })

            // Then remove from local state
            setAssignments(prev => prev.filter(assignment => assignment.id !== assignmentId))
            setFormSuccess("Emergency alert cancelled successfully")

        } catch (error) {
            console.error('Failed to cancel emergency:', error)
            setFormError("Failed to cancel emergency alert")
        } finally {
            setIsSubmitting(false)
        }
    }

    // // Add this function to handle direct status updates without location
    // const handleQuickStatusUpdate = async (assignmentId, newStatus) => {
    //     try {
    //         const updateData = {
    //             status: newStatus,
    //             details: `Status changed to ${newStatus}`
    //         }

    //         const response = await apiClient.post(`/emergencies/${assignmentId}/status/`, updateData)

    //         // Update local state
    //         setAssignments(prev => prev.map(assignment =>
    //             assignment.id === assignmentId
    //                 ? { ...assignment, status: mapStatusToUI(newStatus) }
    //                 : assignment
    //         ))

    //         setFormSuccess(`Status updated to ${newStatus.replace('_', ' ')}!`)

    //     } catch (error) {
    //         console.error('Quick status update failed:', error)
    //         setFormError("Failed to update status. Please try the detailed update form.")
    //     }
    // }

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

    // Updated function that uses your existing add_assessment endpoint
    const sendAssessmentToHospital = async (assessmentData, communicationId) => {
        try {
            console.log('Sending assessment data to hospital communication:', communicationId)

            // Prepare assessment data in the format your backend expects
            const assessmentPayload = {
                // Personal Information
                victim_name: `${assessmentData.victimInfo.firstName} ${assessmentData.victimInfo.lastName}`,
                victim_age: assessmentData.victimInfo.age,
                victim_gender: assessmentData.victimInfo.gender,
                contact_number: assessmentData.victimInfo.contactNumber,

                // Vital Signs
                heart_rate: assessmentData.vitalSigns.heartRate,
                blood_pressure: assessmentData.vitalSigns.bloodPressure,
                temperature: assessmentData.vitalSigns.temperature,
                respiratory_rate: assessmentData.vitalSigns.respiratoryRate,
                oxygen_saturation: assessmentData.vitalSigns.oxygenSaturation,
                gcs_eyes: parseInt(assessmentData.vitalSigns.gcsScore?.split('+')[0]?.trim()) || null,
                gcs_verbal: parseInt(assessmentData.vitalSigns.gcsScore?.split('+')[1]?.trim()) || null,
                gcs_motor: parseInt(assessmentData.vitalSigns.gcsScore?.split('+')[2]?.trim()) || null,
                blood_glucose: assessmentData.vitalSigns.bloodGlucose,

                // Symptoms & Injuries
                symptoms: assessmentData.symptoms.join(', '),
                injuries: assessmentData.injuries.join(', '),
                pain_level: assessmentData.pain.level,
                pain_location: assessmentData.pain.location,

                // Medical Information
                medications: assessmentData.medicalInfo.medications,
                allergies: assessmentData.medicalInfo.allergies,
                medical_history: assessmentData.medicalInfo.medicalHistory,
                last_meal: assessmentData.medicalInfo.lastMeal,

                // Assessment
                condition: assessmentData.assessment.condition,
                consciousness: assessmentData.assessment.consciousness,
                breathing: assessmentData.assessment.breathing,
                circulation: assessmentData.assessment.circulation,
                triage_category: assessmentData.assessment.triage,

                // Treatment
                treatment_provided: assessmentData.treatment.provided,
                medications_administered: assessmentData.treatment.medications,

                // Notes & Recommendations
                notes: assessmentData.notes,
                recommendations: assessmentData.recommendations,

                // Additional fields your backend might expect
                injury_mechanism: assessmentData.injuryMechanism || '',
                assessment_summary: `Assessment completed for ${assessmentData.victimInfo.firstName} ${assessmentData.victimInfo.lastName}. Condition: ${assessmentData.assessment.condition}`
            };

            console.log('Sending assessment payload:', assessmentPayload);

            // Use your existing add_assessment endpoint
            const response = await apiClient.post(
                `/hospital-comms/api/communications/${communicationId}/add-assessment/`,
                assessmentPayload
            );

            console.log('Assessment data sent to hospital successfully:', response.data);
            return response.data;

        } catch (error) {
            console.error('Failed to send assessment to hospital:', error);

            // Enhanced error handling
            if (error.response) {
                console.error('Error response:', error.response.data);
                console.error('Error status:', error.response.status);

                if (error.response.status === 400) {
                    throw new Error(`Validation error: ${JSON.stringify(error.response.data)}`);
                } else if (error.response.status === 403) {
                    throw new Error('Permission denied. You cannot add assessments to this communication.');
                } else if (error.response.status === 404) {
                    throw new Error('Communication not found.');
                }
            }

            throw new Error(`Failed to send assessment: ${error.message}`);
        }
    }
    const handleVictimAssessment = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        setFormError("")
        setFormSuccess("")

        try {
            const summary = generateAssessmentSummary(victimAssessment, selectedVictim)
            setAssessmentSummary(summary)

            console.log('Starting victim assessment process...')

            // Calculate GCS score properly
            const gcsEyes = parseInt(victimAssessment.gcs_eyes) || 0;
            const gcsVerbal = parseInt(victimAssessment.gcs_verbal) || 0;
            const gcsMotor = parseInt(victimAssessment.gcs_motor) || 0;
            const gcsTotal = gcsEyes + gcsVerbal + gcsMotor;

            // Prepare assessment data for storage - matching your backend model
            const assessmentData = {
                victimInfo: {
                    firstName: victimAssessment.firstName,
                    lastName: victimAssessment.lastName,
                    age: victimAssessment.age,
                    gender: victimAssessment.gender,
                    contactNumber: victimAssessment.contactNumber
                },
                vitalSigns: {
                    heartRate: victimAssessment.heartRate,
                    bloodPressure: victimAssessment.bloodPressure,
                    temperature: victimAssessment.temperature,
                    respiratoryRate: victimAssessment.respiratoryRate,
                    oxygenSaturation: victimAssessment.oxygenSaturation,
                    gcsEyes: gcsEyes,
                    gcsVerbal: gcsVerbal,
                    gcsMotor: gcsMotor,
                    gcsTotal: gcsTotal,
                    bloodGlucose: victimAssessment.bloodGlucose
                },
                symptoms: victimAssessment.symptoms,
                injuries: victimAssessment.injuries,
                pain: {
                    level: victimAssessment.painLevel,
                    location: victimAssessment.painLocation
                },
                medicalInfo: {
                    medications: victimAssessment.medications,
                    allergies: victimAssessment.allergies,
                    medicalHistory: victimAssessment.medicalHistory,
                    lastMeal: victimAssessment.lastMeal
                },
                assessment: {
                    condition: victimAssessment.condition,
                    consciousness: victimAssessment.consciousness,
                    breathing: victimAssessment.breathing,
                    circulation: victimAssessment.circulation,
                    triage: victimAssessment.triage_category
                },
                treatment: {
                    provided: victimAssessment.treatmentProvided,
                    medications: victimAssessment.medicationsAdministered
                },
                notes: victimAssessment.notes,
                recommendations: victimAssessment.recommendations,
                priority: getPriorityFromCondition(victimAssessment.condition),
                timestamp: new Date().toISOString(),
                firstAider: getFirstAiderInfo()
            }

            // Update local state with detailed assessment data
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
                            assessmentSummary: summary,
                            assessmentData: assessmentData,
                            localAssessment: {
                                ...victimAssessment,
                                timestamp: new Date().toISOString()
                            },
                            emergencyName: selectedAssignment?.type || `Emergency-${Date.now()}`,
                            attended: victimAssessment.condition === 'stable' || victimAssessment.condition === 'recovering'
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
                    assessmentSummary: summary,
                    assessmentData: assessmentData,
                    localAssessment: {
                        ...victimAssessment,
                        timestamp: new Date().toISOString()
                    },
                    emergencyName: selectedAssignment?.type || `Emergency-${Date.now()}`,
                    attended: victimAssessment.condition === 'stable' || victimAssessment.condition === 'recovering'
                }
                setVictims(prev => [...prev, newVictim])
            }

            // Send assessment to hospital if there's an active communication
            const activeCommunication = hospitalCommunications.find(
                comm => comm.emergency_alert_id === selectedVictim?.id &&
                    ['sent', 'acknowledged', 'preparing'].includes(comm.status)
            )

            if (activeCommunication) {
                try {
                    console.log('Found active communication for assessment:', activeCommunication.id);
                    const result = await sendAssessmentToHospital(assessmentData, activeCommunication.id)

                    // Send notification
                    await sendAssessmentNotification(summary, activeCommunication.id, activeCommunication.hospital_id)
                    setFormSuccess("Victim assessment completed successfully! Hospital has been notified and assessment saved.")

                } catch (assessmentError) {
                    console.error('Failed to send assessment to hospital:', assessmentError);
                    // Store locally as fallback
                    const localAssessmentKey = `assessment_${activeCommunication.id}`;
                    localStorage.setItem(localAssessmentKey, JSON.stringify({
                        assessment_data: assessmentData,
                        timestamp: new Date().toISOString(),
                        communication_id: activeCommunication.id
                    }));

                    setFormSuccess("Victim assessment completed! (Stored locally - Could not send to hospital API)");
                }
            } else {
                setFormSuccess("Victim assessment completed successfully! (No active communication found for this victim)");
            }

            setShowVictimAssessmentForm(false)
            setShowAssessmentSummary(true)

        } catch (error) {
            console.error('Victim assessment failed:', error)
            setFormError(`Failed to complete victim assessment: ${error.message}`)
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
        const firstAiderInfo = getFirstAiderInfo();

        setSelectedVictim(victim)
        setHospitalCommunicationData({
            emergency_alert_id: victim?.id || "",
            hospital_id: "",
            priority: victim?.status === "critical" ? "critical" : "high",
            victim_name: victim?.name || "",
            victim_age: "",
            victim_gender: "",
            chief_complaint: victim?.condition || "",
            vital_signs: victim?.vitals ? {
                heartRate: victim.vitals.heartRate,
                bloodPressure: victim.vitals.bloodPressure,
                temperature: victim.vitals.temperature
            } : {},
            first_aid_provided: "",
            estimated_arrival_minutes: "15",
            required_specialties: [],
            equipment_needed: [],
            blood_type_required: "",
            first_aider: firstAiderInfo?.id || "" // Auto-populate first aider ID
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

            if (!hospitalCommunicationData.emergency_alert_id) {
                throw new Error("Please select an emergency alert or create one first")
            }

            // Get first aider information with enhanced validation
            const firstAiderInfo = getFirstAiderInfo();
            if (!firstAiderInfo || !firstAiderInfo.id) {
                throw new Error("Unable to identify first aider. Please ensure you are logged in properly.")
            }

            // Check if user has first_aider role
            if (firstAiderInfo.role !== 'first_aider') {
                console.warn('User role is not first_aider:', firstAiderInfo.role)
                // You might want to show a warning or handle this case
            }

            const selectedHospital = hospitals.find(h => h.id == hospitalCommunicationData.hospital_id)

            if (!selectedHospital) {
                throw new Error("Selected hospital not found")
            }

            // Prepare the communication data
            const communicationData = {
                emergency_alert_id: hospitalCommunicationData.emergency_alert_id,
                hospital: parseInt(hospitalCommunicationData.hospital_id),
                first_aider: firstAiderInfo.id,
                priority: hospitalCommunicationData.priority || 'high',
                victim_name: hospitalCommunicationData.victim_name || "Unknown Victim",
                victim_age: hospitalCommunicationData.victim_age ? parseInt(hospitalCommunicationData.victim_age) : null,
                victim_gender: hospitalCommunicationData.victim_gender || "unknown",
                chief_complaint: hospitalCommunicationData.chief_complaint || "Emergency medical condition",
                vital_signs: hospitalCommunicationData.vital_signs || {},
                first_aid_provided: hospitalCommunicationData.first_aid_provided || "Basic first aid provided",
                estimated_arrival_minutes: hospitalCommunicationData.estimated_arrival_minutes ? parseInt(hospitalCommunicationData.estimated_arrival_minutes) : 15,
                required_specialties: Array.isArray(hospitalCommunicationData.required_specialties)
                    ? hospitalCommunicationData.required_specialties
                    : (hospitalCommunicationData.required_specialties
                        ? hospitalCommunicationData.required_specialties.split(',').map(s => s.trim()).filter(s => s)
                        : []),
                equipment_needed: Array.isArray(hospitalCommunicationData.equipment_needed)
                    ? hospitalCommunicationData.equipment_needed
                    : (hospitalCommunicationData.equipment_needed
                        ? hospitalCommunicationData.equipment_needed.split(',').map(s => s.trim()).filter(s => s)
                        : []),
                blood_type_required: hospitalCommunicationData.blood_type_required || ""
            }

            // Clean up the data - remove empty arrays and null values
            Object.keys(communicationData).forEach(key => {
                if (communicationData[key] === null || communicationData[key] === undefined ||
                    (Array.isArray(communicationData[key]) && communicationData[key].length === 0)) {
                    delete communicationData[key];
                }
            });

            console.log('Sending communication data:', communicationData);

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

            // Enhanced error handling
            if (error.response) {
                if (error.response.status === 403) {
                    setFormError("Permission denied. Please ensure you are properly authenticated as a first aider.")
                } else if (error.response.status === 500) {
                    setFormError("Server error: The hospital communication could not be processed. Please check the data and try again.")
                } else if (error.response.status === 400) {
                    const errorData = error.response.data;
                    if (typeof errorData === 'object') {
                        const errorMessages = Object.entries(errorData).map(([field, messages]) =>
                            `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
                        );
                        setFormError(`Validation error: ${errorMessages.join('; ')}`)
                    } else {
                        setFormError(`Validation error: ${errorData}`)
                    }
                } else {
                    setFormError(`Server error (${error.response.status}): ${error.response.data?.detail || error.response.statusText}`)
                }
            } else if (error.request) {
                setFormError("Network error: Unable to connect to the server. Please check your internet connection.")
            } else {
                setFormError(error.message || "Failed to send hospital communication")
            }
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
            setFormError(error.message || "Failed to update communication status")
        } finally {
            setIsSubmitting(false)
        }
    }

    // Enhanced get current location with improved address conversion and error handling
    const getCurrentLocation = async () => {
        if (!navigator.geolocation) {
            setFormError("Geolocation is not supported by this browser.")
            return
        }

        setIsSubmitting(true)
        setFormError("")
        setFormSuccess("")

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const lat = position.coords.latitude
                    const lng = position.coords.longitude

                    // Update address immediately
                    setEmergencyData(prev => ({
                        ...prev,
                        address: "Getting address...",
                        latitude: lat.toString(),
                        longitude: lng.toString()
                    }))

                    // Get address with landmark fallback
                    const locationInfo = await geocodeCoordinates(lat, lng)

                    setEmergencyData(prev => ({
                        ...prev,
                        address: locationInfo.address
                    }))

                    if (locationInfo.isLandmark) {
                        setFormSuccess(`Location obtained! Using nearby landmark: ${locationInfo.address}`)
                    } else {
                        setFormSuccess("Location obtained successfully!")
                    }

                } catch (error) {
                    console.error('Location processing failed:', error)
                    const lat = position.coords.latitude
                    const lng = position.coords.longitude

                    // Fallback to coordinates with context
                    setEmergencyData(prev => ({
                        ...prev,
                        address: `Unnamed Road, Kenya (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
                        latitude: lat.toString(),
                        longitude: lng.toString()
                    }))
                    setFormError("Got location but couldn't determine exact address. Using coordinates with fallback.")
                }
                setIsSubmitting(false)
            },
            (error) => {
                console.error('Geolocation error:', error)
                let errorMessage = "Failed to get current location"

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = "Location access denied. Please enable location permissions in your browser settings."
                        break
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = "Location information is currently unavailable. Please check your connection and try again."
                        break
                    case error.TIMEOUT:
                        errorMessage = "Location request timed out. Please try again."
                        break
                    default:
                        errorMessage = "An unexpected error occurred while getting your location."
                }

                setFormError(errorMessage)
                setIsSubmitting(false)
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 60000
            }
        )
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
            if (!emergencyData.address) {
                throw new Error("Location address is required. Please use 'Use Current Location' or enter an address/coordinates.")
            }

            // Process location input to get coordinates
            let locationData
            if (emergencyData.latitude && emergencyData.longitude) {
                // Use existing coordinates if available (from current location)
                locationData = {
                    latitude: parseFloat(emergencyData.latitude),
                    longitude: parseFloat(emergencyData.longitude),
                    formatted_address: emergencyData.address
                }
            } else {
                // Process the address/coordinates input
                locationData = await processLocationInput(emergencyData.address)
            }

            const submitData = {
                emergency_type: emergencyData.emergency_type,
                priority: emergencyData.priority,
                description: emergencyData.description,
                address: locationData.formatted_address,
                latitude: locationData.latitude,
                longitude: locationData.longitude,
                ...(emergencyData.location_id && { location_id: parseInt(emergencyData.location_id) })
            }

            await apiClient.post('/emergencies/alert/', submitData)

            setFormSuccess("Emergency alert submitted successfully!")
            setEmergencyData({
                emergency_type: "medical",
                priority: "medium",
                description: "",
                address: "",
                location_id: "",
                latitude: "",
                longitude: ""
            })

            // Refresh the assignments list
            await fetchActiveEmergencies()

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

    // Add this function to your FirstAiderDashboard component

    // Function to send notification to hospital
    const sendAssessmentNotification = async (assessmentSummary, communicationId, hospitalId) => {
        try {
            const notificationData = {
                user_ids: [hospitalId], // You'll need to get the hospital user IDs
                title: "New Victim Assessment Received",
                message: `Assessment completed for ${assessmentSummary.victimName}. Condition: ${assessmentSummary.assessment.condition}, Priority: ${assessmentSummary.priority}`,
                notification_type: "victim_assessment",
                channel: "in_app", // or 'push', 'email', 'sms' based on preference
                priority: assessmentSummary.priority.toLowerCase(),
                hospital_communication_id: communicationId,
                metadata: {
                    victim_name: assessmentSummary.victimName,
                    condition: assessmentSummary.assessment.condition,
                    triage: assessmentSummary.assessment.triage,
                    assessment_id: `assessment-${Date.now()}`,
                    timestamp: new Date().toISOString()
                }
            }

            await apiClient.post('/notifications/api/send-single/', notificationData)
            console.log('Assessment notification sent to hospital')
        } catch (error) {
            console.error('Failed to send assessment notification:', error)
        }
    }



    // Fetch data on component mount
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true)
            try {
                await fetchUserProfile()
                await Promise.all([
                    fetchHospitals(),
                    fetchActiveEmergencies(),
                    fetchEmergencyHistory(),
                    fetchHospitalCommunications()
                ])
            } catch (error) {
                console.error('Failed to load dashboard data:', error)
                // Don't set form error for initial load failures to avoid disrupting user experience
            } finally {
                setIsLoading(false)
            }
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
            case "dispatched":
                return <Navigation className="w-5 h-5 text-blue-600" /> // Blue for dispatched/assigned
            case "en_route":
                return <Compass className="w-5 h-5 text-orange-500" /> // Orange for en route
            case "arrived":
                return <MapPin className="w-5 h-5 text-green-600" /> // Green for arrived
            case "completed":
                return <CheckCircle className="w-5 h-5 text-[#1a0000]" /> // Dark for completed

            default:
                return <AlertCircle className="w-5 h-5 text-[#740000]" />
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
            case "pending": return "bg-gray-100 text-gray-800 border-gray-200"
            default: return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-[#fff3ea] via-[#fff3ea] to-[#ffe6c5]">
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
                    <p className="text-[#740000]">
                        Welcome back, {userProfile?.first_name || 'First Aider'}! Manage emergency assignments, victim care, and hospital communications
                    </p>
                    <p className="text-[#740000] text-sm mt-1">
                        Organization: {userProfile?.organization?.name || userProfile?.organization || 'Not specified'}
                    </p>
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
                                {formError && (
                                    <div className="p-3 bg-[#b90000]/10 border border-[#b90000] rounded text-[#b90000] text-sm mb-4">
                                        {formError}
                                    </div>
                                )}
                                <div className="space-y-4">
                                    {assignments.length === 0 ? (
                                        <div className="text-center py-8">
                                            <AlertCircle className="w-12 h-12 text-[#740000]/50 mx-auto mb-4" />
                                            <p className="text-[#740000]">No active emergencies</p>
                                            <p className="text-[#740000] text-sm mt-2">All emergencies have been handled or no new emergencies reported.</p>
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
                                                        {assignment.status === "dispatched" && (
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
                                    <p className="text-[#740000]">
                                        {hospitalCommunications.length > 0
                                            ? `${hospitalCommunications.length} communication(s) found`
                                            : 'No communications yet'
                                        }
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={fetchHospitalCommunications}
                                        className="px-3 py-2 border border-[#b90000] text-[#b90000] hover:bg-[#ffe6c5] rounded text-sm font-medium transition-colors"
                                        title="Refresh Communications"
                                    >
                                        Refresh
                                    </button>
                                    <button
                                        onClick={() => setShowHospitalCommunicationForm(true)}
                                        className="px-4 py-2 bg-[#b90000] hover:bg-[#740000] text-[#fff3ea] rounded-lg font-medium text-sm transition-colors"
                                    >
                                        <Plus className="w-4 h-4 mr-2 inline" />
                                        Create Communication
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {hospitalCommunications.length === 0 ? (
                                        <div className="text-center py-8">
                                            <MessageCircle className="w-12 h-12 text-[#740000]/50 mx-auto mb-4" />
                                            <p className="text-[#740000]">No hospital communications found</p>
                                            <p className="text-[#740000] text-sm mt-2">
                                                Create your first communication to notify hospitals about victims.
                                            </p>
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
                                                        <div className="flex-1">
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
                                                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                                                                <span className="text-xs text-[#740000]">
                                                                    Created: {new Date(communication.created_at).toLocaleDateString()}
                                                                </span>
                                                                {communication.victim_age && (
                                                                    <span className="text-xs text-[#740000]">
                                                                        Age: {communication.victim_age}
                                                                    </span>
                                                                )}
                                                                {communication.victim_gender && (
                                                                    <span className="text-xs text-[#740000]">
                                                                        Gender: {communication.victim_gender}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(communication.priority)}`}
                                                        >
                                                            {communication.priority?.charAt(0).toUpperCase() + communication.priority?.slice(1) || 'High'}
                                                        </span>
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getCommunicationStatusColor(communication.status)}`}
                                                        >
                                                            {communication.status?.charAt(0).toUpperCase() + communication.status?.slice(1) || 'Pending'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Additional Communication Details */}
                                                <div className="grid grid-cols-2 gap-4 text-sm text-[#740000] mb-3">
                                                    <div>
                                                        <span className="font-medium">First Aid Provided:</span>
                                                        <p className="text-[#1a0000]">{communication.first_aid_provided}</p>
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">ETA:</span>
                                                        <p className="text-[#1a0000]">{communication.estimated_arrival_minutes} minutes</p>
                                                    </div>
                                                </div>

                                                {communication.required_specialties && communication.required_specialties.length > 0 && (
                                                    <div className="mb-3">
                                                        <span className="text-sm font-medium text-[#740000]">Required Specialties: </span>
                                                        <span className="text-sm text-[#1a0000]">
                                                            {Array.isArray(communication.required_specialties)
                                                                ? communication.required_specialties.join(', ')
                                                                : communication.required_specialties
                                                            }
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between text-sm pt-3 border-t border-[#ffe6c5]">
                                                    <div className="flex gap-4 text-[#740000]">
                                                        <span>Updated: {new Date(communication.updated_at).toLocaleDateString()}</span>
                                                        <span>ID: {communication.id}</span>
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
                        <div className="bg-[#fff3ea] border border-[#ffe6c5] rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between p-6 border-b border-[#ffe6c5] sticky top-0 bg-[#fff3ea] z-10">
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
                                        Priority
                                    </label>
                                    <select
                                        name="priority"
                                        value={emergencyData.priority}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                    >
                                        {priorityOptions.map(priority => (
                                            <option key={priority.value} value={priority.value}>
                                                {priority.label}
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
                                            Location *
                                        </label>
                                        <button
                                            type="button"
                                            onClick={getCurrentLocation}
                                            disabled={isSubmitting}
                                            className="text-sm text-[#b90000] hover:text-[#740000] flex items-center gap-1 disabled:opacity-50"
                                        >
                                            <Compass className="w-4 h-4" />
                                            {isSubmitting ? "Getting Location..." : "Use Current Location"}
                                        </button>
                                    </div>
                                    <textarea
                                        name="address"
                                        value={emergencyData.address}
                                        onChange={handleInputChange}
                                        rows={2}
                                        placeholder="Enter address or coordinates (e.g., '1.2345, 36.7890' or 'Nairobi, Kenya')"
                                        className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent resize-vertical"
                                        required
                                    />
                                    <p className="text-xs text-[#740000]">
                                        Enter an address (e.g., "Nairobi, Kenya") or coordinates (e.g., "1.2921, 36.8219")
                                    </p>
                                </div>

                                <div className="flex gap-4 pt-4 sticky bottom-0 bg-[#fff3ea] pb-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowEmergencyForm(false)}
                                        className="flex-1 px-4 py-2 border border-[#ffe6c5] text-[#1a0000] hover:bg-[#ffe6c5] rounded-lg font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !emergencyData.address}
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

                {/* Victim Assessment Modal */}
                {showVictimAssessmentForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-[#fff3ea] border border-[#ffe6c5] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between p-6 border-b border-[#ffe6c5] sticky top-0 bg-[#fff3ea] z-10">
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
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto p-2 border border-[#ffe6c5] rounded-md">
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
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto p-2 border border-[#ffe6c5] rounded-md">
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

                                <div className="flex gap-4 pt-6 border-t border-[#ffe6c5] sticky bottom-0 bg-[#fff3ea] pb-2">
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


                {showAssessmentSummary && assessmentSummary && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-[#fff3ea] border border-[#ffe6c5] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between p-6 border-b border-[#ffe6c5] sticky top-0 bg-[#fff3ea] z-10">
                                <h2 className="text-2xl font-bold text-[#1a0000]">Assessment Summary</h2>
                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${assessmentSummary.priority === "High"
                                        ? "bg-[#b90000]/10 text-[#b90000] border border-[#b90000]/20"
                                        : "bg-[#740000]/10 text-[#740000] border border-[#740000]/20"
                                        }`}>
                                        {assessmentSummary.priority} Priority
                                    </span>
                                    <button
                                        onClick={() => setShowAssessmentSummary(false)}
                                        className="p-2 hover:bg-[#ffe6c5] rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5 text-[#1a0000]" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6 space-y-6">
                                {/* Enhanced Header */}
                                <div className="bg-[#ffe6c5] p-4 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold text-[#1a0000]">{assessmentSummary.victimName}</h3>
                                            <p className="text-[#740000]">Assessment completed: {assessmentSummary.timestamp}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-[#740000]">First Aider: {userProfile?.first_name} {userProfile?.last_name}</p>
                                            <p className="text-sm text-[#740000]">Organization: {userProfile?.organization?.name || userProfile?.organization}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Overview */}
                                <div className="grid md:grid-cols-4 gap-4">
                                    <div className="text-center p-3 bg-white rounded-lg border border-[#ffe6c5]">
                                        <p className="text-sm text-[#740000]">Condition</p>
                                        <p className="text-lg font-bold text-[#1a0000] capitalize">{assessmentSummary.assessment.condition}</p>
                                    </div>
                                    <div className="text-center p-3 bg-white rounded-lg border border-[#ffe6c5]">
                                        <p className="text-sm text-[#740000]">Triage</p>
                                        <p className="text-lg font-bold text-[#1a0000] capitalize">{assessmentSummary.assessment.triage}</p>
                                    </div>
                                    <div className="text-center p-3 bg-white rounded-lg border border-[#ffe6c5]">
                                        <p className="text-sm text-[#740000]">GCS Score</p>
                                        <p className="text-lg font-bold text-[#1a0000]">{assessmentSummary.vitalSigns.gcsScore || 'N/A'}</p>
                                    </div>
                                    <div className="text-center p-3 bg-white rounded-lg border border-[#ffe6c5]">
                                        <p className="text-sm text-[#740000]">Priority</p>
                                        <p className="text-lg font-bold text-[#1a0000]">{assessmentSummary.priority}</p>
                                    </div>
                                </div>

                                {/* Personal Information */}
                                <div>
                                    <h4 className="text-lg font-semibold text-[#1a0000] mb-3">Personal Information</h4>
                                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                                        <div className="bg-white p-3 rounded-lg border border-[#ffe6c5]">
                                            <span className="text-[#740000]">Age:</span>
                                            <p className="text-[#1a0000] font-medium">{assessmentSummary.personalInfo.age || 'Not specified'}</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg border border-[#ffe6c5]">
                                            <span className="text-[#740000]">Gender:</span>
                                            <p className="text-[#1a0000] font-medium">{assessmentSummary.personalInfo.gender || 'Not specified'}</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg border border-[#ffe6c5]">
                                            <span className="text-[#740000]">Contact:</span>
                                            <p className="text-[#1a0000] font-medium">{assessmentSummary.personalInfo.contactNumber || 'Not specified'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Vital Signs */}
                                <div>
                                    <h4 className="text-lg font-semibold text-[#1a0000] mb-3">Vital Signs</h4>
                                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                                        <div className="bg-white p-3 rounded-lg border border-[#ffe6c5]">
                                            <span className="text-[#740000]">Heart Rate:</span>
                                            <p className="text-[#1a0000] font-medium">{assessmentSummary.vitalSigns.heartRate || 'N/A'} bpm</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg border border-[#ffe6c5]">
                                            <span className="text-[#740000]">Blood Pressure:</span>
                                            <p className="text-[#1a0000] font-medium">{assessmentSummary.vitalSigns.bloodPressure || 'N/A'}</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg border border-[#ffe6c5]">
                                            <span className="text-[#740000]">Temperature:</span>
                                            <p className="text-[#1a0000] font-medium">{assessmentSummary.vitalSigns.temperature || 'N/A'} °C</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg border border-[#ffe6c5]">
                                            <span className="text-[#740000]">Respiratory Rate:</span>
                                            <p className="text-[#1a0000] font-medium">{assessmentSummary.vitalSigns.respiratoryRate || 'N/A'}</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg border border-[#ffe6c5]">
                                            <span className="text-[#740000]">Oxygen Saturation:</span>
                                            <p className="text-[#1a0000] font-medium">{assessmentSummary.vitalSigns.oxygenSaturation || 'N/A'}%</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg border border-[#ffe6c5]">
                                            <span className="text-[#740000]">Blood Glucose:</span>
                                            <p className="text-[#1a0000] font-medium">{assessmentSummary.vitalSigns.bloodGlucose || 'N/A'} mg/dL</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Symptoms & Injuries */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-lg font-semibold text-[#1a0000] mb-3">Symptoms</h4>
                                        <div className="bg-white p-4 rounded-lg border border-[#ffe6c5]">
                                            {assessmentSummary.symptoms.length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {assessmentSummary.symptoms.map((symptom, index) => (
                                                        <span key={index} className="px-3 py-1 bg-[#ffe6c5] text-[#1a0000] rounded-full text-sm">
                                                            {symptom}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-[#740000]">No symptoms reported</p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-[#1a0000] mb-3">Injuries</h4>
                                        <div className="bg-white p-4 rounded-lg border border-[#ffe6c5]">
                                            {assessmentSummary.injuries.length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {assessmentSummary.injuries.map((injury, index) => (
                                                        <span key={index} className="px-3 py-1 bg-[#ffe6c5] text-[#1a0000] rounded-full text-sm">
                                                            {injury}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-[#740000]">No injuries reported</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Pain Assessment */}
                                {(assessmentSummary.pain.level || assessmentSummary.pain.location) && (
                                    <div>
                                        <h4 className="text-lg font-semibold text-[#1a0000] mb-3">Pain Assessment</h4>
                                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                                            {assessmentSummary.pain.level && (
                                                <div className="bg-white p-3 rounded-lg border border-[#ffe6c5]">
                                                    <span className="text-[#740000]">Pain Level:</span>
                                                    <p className="text-[#1a0000] font-medium">{assessmentSummary.pain.level}</p>
                                                </div>
                                            )}
                                            {assessmentSummary.pain.location && (
                                                <div className="bg-white p-3 rounded-lg border border-[#ffe6c5]">
                                                    <span className="text-[#740000]">Pain Location:</span>
                                                    <p className="text-[#1a0000] font-medium">{assessmentSummary.pain.location}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Medical Information */}
                                <div>
                                    <h4 className="text-lg font-semibold text-[#1a0000] mb-3">Medical Information</h4>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            {assessmentSummary.medicalInfo.medications && (
                                                <div className="bg-white p-3 rounded-lg border border-[#ffe6c5]">
                                                    <span className="text-[#740000] text-sm font-medium">Current Medications:</span>
                                                    <p className="text-[#1a0000] whitespace-pre-wrap">{assessmentSummary.medicalInfo.medications}</p>
                                                </div>
                                            )}
                                            {assessmentSummary.medicalInfo.allergies && (
                                                <div className="bg-white p-3 rounded-lg border border-[#ffe6c5]">
                                                    <span className="text-[#740000] text-sm font-medium">Allergies:</span>
                                                    <p className="text-[#1a0000] whitespace-pre-wrap">{assessmentSummary.medicalInfo.allergies}</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-4">
                                            {assessmentSummary.medicalInfo.medicalHistory && (
                                                <div className="bg-white p-3 rounded-lg border border-[#ffe6c5]">
                                                    <span className="text-[#740000] text-sm font-medium">Medical History:</span>
                                                    <p className="text-[#1a0000] whitespace-pre-wrap">{assessmentSummary.medicalInfo.medicalHistory}</p>
                                                </div>
                                            )}
                                            {assessmentSummary.medicalInfo.lastMeal && (
                                                <div className="bg-white p-3 rounded-lg border border-[#ffe6c5]">
                                                    <span className="text-[#740000] text-sm font-medium">Last Meal:</span>
                                                    <p className="text-[#1a0000]">{assessmentSummary.medicalInfo.lastMeal}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Clinical Assessment */}
                                <div>
                                    <h4 className="text-lg font-semibold text-[#1a0000] mb-3">Clinical Assessment</h4>
                                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                                        <div className="bg-white p-3 rounded-lg border border-[#ffe6c5]">
                                            <span className="text-[#740000]">Overall Condition:</span>
                                            <p className="text-[#1a0000] font-medium capitalize">{assessmentSummary.assessment.condition}</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg border border-[#ffe6c5]">
                                            <span className="text-[#740000]">Consciousness Level:</span>
                                            <p className="text-[#1a0000] font-medium capitalize">{assessmentSummary.assessment.consciousness}</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg border border-[#ffe6c5]">
                                            <span className="text-[#740000]">Breathing:</span>
                                            <p className="text-[#1a0000] font-medium capitalize">{assessmentSummary.assessment.breathing}</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-lg border border-[#ffe6c5]">
                                            <span className="text-[#740000]">Circulation:</span>
                                            <p className="text-[#1a0000] font-medium capitalize">{assessmentSummary.assessment.circulation}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Treatment Provided */}
                                <div>
                                    <h4 className="text-lg font-semibold text-[#1a0000] mb-3">Treatment Provided</h4>
                                    <div className="bg-white p-4 rounded-lg border border-[#ffe6c5]">
                                        {assessmentSummary.treatment.provided ? (
                                            <div className="space-y-3">
                                                <div>
                                                    <span className="text-[#740000] text-sm font-medium">First Aid & Treatment:</span>
                                                    <p className="text-[#1a0000] whitespace-pre-wrap">{assessmentSummary.treatment.provided}</p>
                                                </div>
                                                {assessmentSummary.treatment.medications && (
                                                    <div>
                                                        <span className="text-[#740000] text-sm font-medium">Medications Administered:</span>
                                                        <p className="text-[#1a0000] whitespace-pre-wrap">{assessmentSummary.treatment.medications}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-[#740000]">No treatment documented</p>
                                        )}
                                    </div>
                                </div>

                                {/* Notes & Recommendations */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    {assessmentSummary.notes && (
                                        <div>
                                            <h4 className="text-lg font-semibold text-[#1a0000] mb-3">Assessment Notes</h4>
                                            <div className="bg-white p-4 rounded-lg border border-[#ffe6c5]">
                                                <p className="text-[#1a0000] whitespace-pre-wrap">{assessmentSummary.notes}</p>
                                            </div>
                                        </div>
                                    )}
                                    {assessmentSummary.recommendations && (
                                        <div>
                                            <h4 className="text-lg font-semibold text-[#1a0000] mb-3">Recommendations</h4>
                                            <div className="bg-white p-4 rounded-lg border border-[#ffe6c5]">
                                                <p className="text-[#1a0000] whitespace-pre-wrap">{assessmentSummary.recommendations}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4 pt-6 border-t border-[#ffe6c5] sticky bottom-0 bg-[#fff3ea] pb-2">
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
                                    <button
                                        onClick={() => {
                                            // Print or save assessment
                                            window.print();
                                        }}
                                        className="flex-1 px-4 py-2 bg-[#1a0000] hover:bg-[#740000] text-[#fff3ea] rounded-lg font-medium transition-colors"
                                    >
                                        Print Assessment
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
                            <div className="flex items-center justify-between p-6 border-b border-[#ffe6c5] sticky top-0 bg-[#fff3ea] z-10">
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

                                {/* First Aider Information Display */}
                                {userProfile && (
                                    <div className="bg-[#ffe6c5] p-4 rounded-lg mb-4">
                                        <h4 className="font-semibold text-[#1a0000] mb-2">First Aider Information</h4>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div>
                                                <span className="text-[#740000]">Name:</span>
                                                <p className="text-[#1a0000] font-medium">
                                                    {userProfile.first_name} {userProfile.last_name}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-[#740000]">Organization:</span>
                                                <p className="text-[#1a0000] font-medium">
                                                    {userProfile.organization?.name || userProfile.organization || 'Not specified'}
                                                </p>
                                            </div>
                                            {userProfile.phone_number && (
                                                <div>
                                                    <span className="text-[#740000]">Contact:</span>
                                                    <p className="text-[#1a0000] font-medium">{userProfile.phone_number}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-[#1a0000]">
                                            Emergency Alert ID *
                                        </label>
                                        <select
                                            name="emergency_alert_id"
                                            value={hospitalCommunicationData.emergency_alert_id}
                                            onChange={handleHospitalCommunicationInputChange}
                                            className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                            required
                                        >
                                            <option value="">Select an emergency alert</option>
                                            {assignments.map(assignment => (
                                                <option key={assignment.id} value={assignment.id}>
                                                    {assignment.id} - {assignment.type}
                                                </option>
                                            ))}
                                            {victims.map(victim => (
                                                <option key={victim.id} value={victim.id}>
                                                    {victim.id} - {victim.name}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="text-xs text-[#740000]">
                                            Select the emergency alert this communication relates to
                                        </p>
                                    </div>

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
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
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

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-[#1a0000]">
                                        Required Specialties
                                    </label>
                                    <input
                                        type="text"
                                        name="required_specialties"
                                        value={hospitalCommunicationData.required_specialties}
                                        onChange={handleHospitalCommunicationInputChange}
                                        placeholder="e.g., Trauma, Cardiology, Neurology (comma separated)"
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
                                        placeholder="e.g., Ventilator, Defibrillator, CT Scan (comma separated)"
                                        className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] placeholder:text-[#740000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
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

                                <div className="flex gap-4 pt-4 sticky bottom-0 bg-[#fff3ea] pb-2">
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
                        <div className="bg-[#fff3ea] border border-[#ffe6c5] rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between p-6 border-b border-[#ffe6c5] sticky top-0 bg-[#fff3ea] z-10">
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

                                <div className="flex gap-4 pt-4 sticky bottom-0 bg-[#fff3ea] pb-2">
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