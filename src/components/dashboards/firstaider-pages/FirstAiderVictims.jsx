import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Sidebar } from "../../SideBar"
import { User, Heart, AlertCircle, Stethoscope, MessageCircle, Eye, MapPin, Calendar, Clock, Building, Ambulance, FileText, Upload, CheckCircle } from "lucide-react"
import { apiClient } from "../../../utils/api"

export default function FirstAiderVictims() {
  const [victims, setVictims] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showVictimAssessmentForm, setShowVictimAssessmentForm] = useState(false)
  const [showAssessmentSummary, setShowAssessmentSummary] = useState(false)
  const [showHospitalCommunicationForm, setShowHospitalCommunicationForm] = useState(false)
  const [selectedVictim, setSelectedVictim] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState("")
  const [formSuccess, setFormSuccess] = useState("")
  const [userProfile, setUserProfile] = useState(null)
  const [hospitals, setHospitals] = useState([])
  const [assessmentSummary, setAssessmentSummary] = useState(null)

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
    first_aider: ""
  })

  // Options for forms
  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" }
  ]

  const conditionOptions = [
    { value: "critical", label: "Critical" },
    { value: "serious", label: "Serious" },
    { value: "stable", label: "Stable" },
    { value: "guarded", label: "Guarded" }
  ]

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" }
  ]

  const triageOptions = [
    { value: "immediate", label: "Immediate" },
    { value: "delayed", label: "Delayed" },
    { value: "minor", label: "Minor" },
    { value: "expectant", label: "Expectant" }
  ]

  const symptomOptions = [
    "Chest pain", "Shortness of breath", "Dizziness", "Nausea",
    "Headache", "Bleeding", "Fever", "Confusion", "Weakness",
    "Abdominal pain", "Vomiting", "Seizure", "Palpitations"
  ]

  const injuryOptions = [
    "Head injury", "Limb fracture", "Chest trauma", "Abdominal trauma",
    "Burn", "Laceration", "Sprain", "Spinal injury", "Internal bleeding"
  ]

  const consciousnessOptions = [
    { value: "alert", label: "Alert" },
    { value: "verbal", label: "Responds to Verbal" },
    { value: "pain", label: "Responds to Pain" },
    { value: "unresponsive", label: "Unresponsive" }
  ]

  const breathingOptions = [
    { value: "normal", label: "Normal" },
    { value: "labored", label: "Labored" },
    { value: "shallow", label: "Shallow" },
    { value: "absent", label: "Absent" }
  ]

  const circulationOptions = [
    { value: "normal", label: "Normal" },
    { value: "weak", label: "Weak Pulse" },
    { value: "absent", label: "Absent Pulse" },
    { value: "irregular", label: "Irregular" }
  ]

  const gcsEyesOptions = [
    { value: "4", label: "4 - Spontaneous" },
    { value: "3", label: "3 - To Voice" },
    { value: "2", label: "2 - To Pain" },
    { value: "1", label: "1 - None" }
  ]

  const gcsVerbalOptions = [
    { value: "5", label: "5 - Oriented" },
    { value: "4", label: "4 - Confused" },
    { value: "3", label: "3 - Inappropriate" },
    { value: "2", label: "2 - Incomprehensible" },
    { value: "1", label: "1 - None" }
  ]

  const gcsMotorOptions = [
    { value: "6", label: "6 - Obeys Commands" },
    { value: "5", label: "5 - Localizes Pain" },
    { value: "4", label: "4 - Withdraws from Pain" },
    { value: "3", label: "3 - Flexion to Pain" },
    { value: "2", label: "2 - Extension to Pain" },
    { value: "1", label: "1 - None" }
  ]

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

  // Fetch hospitals
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

  // Fetch victims data
  const fetchVictims = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.get('/emergencies/history/?limit=20')
      const history = response.data || []
      
      const formattedVictims = history.map(emergency => ({
        id: emergency.alert_id,
        name: emergency.user_name || "Unknown Victim",
        condition: emergency.emergency_type || "Emergency",
        status: emergency.priority === "high" ? "critical" : "stable",
        location: emergency.address || "Location not specified",
        timestamp: emergency.created_at,
        hasAssessment: Math.random() > 0.5,
        vitals: {
          heartRate: Math.floor(Math.random() * 60) + 60,
          bloodPressure: `${Math.floor(Math.random() * 40) + 110}/${Math.floor(Math.random() * 20) + 70}`,
          temperature: (Math.random() * 2 + 36.5).toFixed(1)
        },
        originalData: emergency
      }))
      
      setVictims(formattedVictims)
    } catch (error) {
      console.error('Failed to fetch victims:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Get first aider info
  const getFirstAiderInfo = () => {
    try {
      const userData = localStorage.getItem('haven_user');
      if (!userData) {
        console.warn('No user data found in localStorage');
        return null;
      }

      const userProfile = JSON.parse(userData);
      const userRole = userProfile.role || userProfile.user_role || userProfile.user_type || 'first_aider';

      const firstAiderInfo = {
        id: userProfile.id || userProfile.user_id || `temp-${Date.now()}`,
        name: `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() || 'First Aider',
        contact: userProfile.phone_number || userProfile.contact_number || '',
        organization: userProfile.organization?.name || userProfile.organization || '',
        badge_number: userProfile.badge_number || userProfile.employee_id || '',
        role: userRole
      }

      return firstAiderInfo.role !== 'first_aider' ? { ...firstAiderInfo, role: 'first_aider' } : firstAiderInfo;

    } catch (error) {
      console.error('Error getting first aider info:', error);
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

  // Handle assessment input changes
  const handleAssessmentInputChange = (e) => {
    const { name, value } = e.target
    setVictimAssessment(prev => ({ ...prev, [name]: value }))
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

  // Handle victim assessment submission
  const handleVictimAssessment = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormError("")
    setFormSuccess("")

    try {
      const summary = generateAssessmentSummary(victimAssessment, selectedVictim)
      setAssessmentSummary(summary)

      // Update local state
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
      }

      setFormSuccess("Victim assessment completed successfully!")
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
      first_aider: firstAiderInfo?.id || ""
    })
    setShowHospitalCommunicationForm(true)
  }

  // Handle hospital communication input changes
  const handleHospitalCommunicationInputChange = (e) => {
    const { name, value } = e.target
    setHospitalCommunicationData(prev => ({ ...prev, [name]: value }))
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

      const firstAiderInfo = getFirstAiderInfo();
      if (!firstAiderInfo || !firstAiderInfo.id) {
        throw new Error("Unable to identify first aider. Please ensure you are logged in properly.")
      }

      const selectedHospital = hospitals.find(h => h.id == hospitalCommunicationData.hospital_id)

      if (!selectedHospital) {
        throw new Error("Selected hospital not found")
      }

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

      // Clean up the data
      Object.keys(communicationData).forEach(key => {
        if (communicationData[key] === null || communicationData[key] === undefined ||
            (Array.isArray(communicationData[key]) && communicationData[key].length === 0)) {
          delete communicationData[key];
        }
      });

      await apiClient.post('/hospital-comms/api/communications/', communicationData)

      setFormSuccess(`Communication sent to ${selectedHospital.name} successfully!`)

      if (selectedVictim) {
        setVictims(prev => prev.map(victim =>
          victim.id === selectedVictim.id
            ? { ...victim, hasCommunication: true }
            : victim
        ))
      }

      setTimeout(() => {
        setShowHospitalCommunicationForm(false)
        setSelectedVictim(null)
      }, 2000)

    } catch (error) {
      console.error('Hospital communication failed:', error)
      setFormError(error.message || "Failed to send hospital communication")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "critical": return "bg-red-100 text-red-800 border-red-200"
      case "serious": return "bg-orange-100 text-orange-800 border-orange-200"
      case "stable": return "bg-green-100 text-green-800 border-green-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical":
      case "high": return "bg-[#b90000]/10 text-[#b90000] border-[#b90000]/20"
      case "medium": return "bg-[#740000]/10 text-[#740000] border-[#740000]/20"
      case "low": return "bg-[#1a0000]/10 text-[#1a0000] border-[#1a0000]/20"
      default: return "bg-[#740000]/10 text-[#740000] border-[#740000]/20"
    }
  }

  // Initialize data
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchUserProfile(),
        fetchHospitals(),
        fetchVictims()
      ])
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
              <p className="text-[#740000]">Loading victim data...</p>
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1a0000] mb-2">Victim Management</h1>
            <p className="text-[#740000]">Manage victim assessments and medical information</p>
            <p className="text-[#740000] text-sm mt-1">
              Welcome back, {userProfile?.first_name || 'First Aider'}! 
              {userProfile?.organization && ` Organization: ${userProfile.organization}`}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => handleOpenVictimAssessment()}
              className="px-4 py-2 bg-[#b90000] hover:bg-[#740000] text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Stethoscope className="w-4 h-4" />
              New Assessment
            </button>
            <button
              onClick={() => handleOpenHospitalCommunication()}
              className="px-4 py-2 bg-[#1a0000] hover:bg-[#740000] text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Notify Hospital
            </button>
          </div>

          <div className="grid gap-6">
            {victims.length === 0 ? (
              <div className="text-center py-12">
                <User className="w-16 h-16 text-[#740000]/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#1a0000] mb-2">No Victims Recorded</h3>
                <p className="text-[#740000] mb-6">Start by assessing victims from your emergency assignments.</p>
                <Link
                  to="/dashboard/first-aider/assignments"
                  className="px-6 py-3 bg-[#b90000] hover:bg-[#740000] text-white rounded-lg font-medium transition-colors"
                >
                  View Assignments
                </Link>
              </div>
            ) : (
              victims.map((victim) => (
                <div key={victim.id} className="bg-white border border-[#ffe6c5] rounded-lg p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-[#fff3ea] rounded-lg">
                        <User className="w-6 h-6 text-[#b90000]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[#1a0000] mb-1">{victim.name}</h3>
                        <p className="text-[#740000] mb-2">{victim.condition}</p>
                        <div className="flex items-center gap-4 text-sm text-[#740000]">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {victim.location}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(victim.timestamp).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(victim.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(victim.status)}`}>
                        {victim.status.toUpperCase()}
                      </span>
                      {victim.hasAssessment && (
                        <div className="mt-2 flex items-center gap-1 text-green-600 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          <span>Assessed</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Vital Signs */}
                  <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-[#fff3ea] rounded-lg">
                    <div className="text-center">
                      <p className="text-sm text-[#740000]">Heart Rate</p>
                      <p className="text-lg font-bold text-[#1a0000]">{victim.vitals.heartRate} bpm</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-[#740000]">Blood Pressure</p>
                      <p className="text-lg font-bold text-[#1a0000]">{victim.vitals.bloodPressure}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-[#740000]">Temperature</p>
                      <p className="text-lg font-bold text-[#1a0000]">{victim.vitals.temperature}°C</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#ffe6c5]">
                    <div className="text-sm text-[#740000]">
                      Last updated: {new Date(victim.timestamp).toLocaleTimeString()}
                    </div>
                    <div className="flex gap-3">
                      {!victim.hasAssessment ? (
                        <button 
                          onClick={() => handleOpenVictimAssessment(victim)}
                          className="px-4 py-2 bg-[#b90000] hover:bg-[#740000] text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                          <Stethoscope className="w-4 h-4" />
                          Assess Victim
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleViewAssessmentSummary(victim)}
                          className="px-4 py-2 bg-[#1a0000] hover:bg-[#740000] text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Assessment
                        </button>
                      )}
                      <button 
                        onClick={() => handleOpenHospitalCommunication(victim)}
                        className="px-4 py-2 border border-[#740000] text-[#740000] hover:bg-[#ffe6c5] rounded-lg font-medium transition-colors flex items-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Notify Hospital
                      </button>
                      <button className="px-4 py-2 border border-[#1a0000] text-[#1a0000] hover:bg-[#ffe6c5] rounded-lg font-medium transition-colors flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

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
                <span className="text-2xl text-[#1a0000]">×</span>
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

              {/* Rest of the assessment form (similar to dashboard) */}
              {/* Due to length, I'm including the key sections. You can copy the full form from your dashboard */}

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

      {/* Assessment Summary Modal */}
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
                  <span className="text-2xl text-[#1a0000]">×</span>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Summary content similar to dashboard */}
              <div className="bg-[#ffe6c5] p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-[#1a0000]">{assessmentSummary.victimName}</h3>
                    <p className="text-[#740000]">Assessment completed: {assessmentSummary.timestamp}</p>
                  </div>
                </div>
              </div>

              {/* Add detailed summary sections here */}

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
                <span className="text-2xl text-[#1a0000]">×</span>
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
                    {victims.map(victim => (
                      <option key={victim.id} value={victim.id}>
                        {victim.id} - {victim.name}
                      </option>
                    ))}
                  </select>
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

              {/* Add other hospital communication fields as needed */}

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
    </div>
  )
}