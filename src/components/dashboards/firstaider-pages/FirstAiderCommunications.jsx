import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Sidebar } from "../../SideBar"
import { MessageCircle, Building, User, Clock, CheckCircle, AlertCircle, Plus, Eye, Stethoscope } from "lucide-react"
import { apiClient } from "../../../utils/api"

export default function FirstAiderCommunications() {
  const [communications, setCommunications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [hospitals, setHospitals] = useState([])
  const [userProfile, setUserProfile] = useState(null)
  const [formError, setFormError] = useState("")
  const [formSuccess, setFormSuccess] = useState("")

  // Get first aider info function
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

      let userRole = userProfile.role ||
        userProfile.user_role ||
        userProfile.user_type ||
        userProfile.profile?.role ||
        'first_aider';

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

      if (firstAiderInfo.role !== 'first_aider') {
        console.warn('User role mismatch:', firstAiderInfo.role);
        return {
          ...firstAiderInfo,
          role: 'first_aider'
        };
      }

      return firstAiderInfo;

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

  // Fetch hospitals for display
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

  // Enhanced fetch communications function with filtering
  const fetchCommunications = async () => {
    try {
      console.log('DEBUG - Fetching communications for dedicated page...')
      setIsLoading(true)
      setFormError("")

      // Get first aider info to filter communications
      const firstAiderInfo = getFirstAiderInfo();
      console.log('DEBUG - First aider info:', firstAiderInfo);

      if (!firstAiderInfo || !firstAiderInfo.id) {
        console.warn('No first aider info available, cannot fetch communications')
        setCommunications([])
        setIsLoading(false)
        return
      }

      let allCommunications = [];

      try {
        // Fetch all communications
        const response = await apiClient.get('/hospital-comms/api/communications/')
        console.log('DEBUG - Communications API response:', response)

        // Extract communications array from response
        if (Array.isArray(response)) {
          allCommunications = response;
        } else if (response && Array.isArray(response.data)) {
          allCommunications = response.data;
        } else if (response && response.data && Array.isArray(response.data.results)) {
          allCommunications = response.data.results;
        } else if (response && Array.isArray(response.results)) {
          allCommunications = response.results;
        } else {
          console.log('DEBUG - Unexpected response format, trying to extract data...', response);
          allCommunications = response?.communications || response?.data || [];
        }

        console.log('DEBUG - Raw communications:', allCommunications);

        // Filter communications by first_aider - handle different field names
        const filteredCommunications = allCommunications.filter(comm => {
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

        console.log(`DEBUG - Filtered ${filteredCommunications.length} communications for first aider ${firstAiderInfo.id}`);

        // FILTER OUT FAILED COMMUNICATIONS
        const successfulCommunications = filteredCommunications.filter(comm => {
          const status = comm.status || comm.communication_status;
          const failedStatuses = ['failed', 'cancelled', 'rejected', 'error'];
          return !failedStatuses.includes(status);
        });

        console.log(`DEBUG - After filtering failed: ${successfulCommunications.length} communications`);

        // Format communications for display
        const formattedCommunications = successfulCommunications.map(comm => {
          let hospitalName = comm.hospital_name;

          // If no hospital name, try to get it from hospitals list or API
          if (!hospitalName && comm.hospital) {
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
            hospital_name: hospitalName || 'Unknown Hospital',
            first_aider: comm.first_aider || comm.first_aider_id,
            first_aider_name: comm.first_aider_name || firstAiderInfo.name,
            priority: comm.priority || 'high',
            victim_name: comm.victim_name || 'Unknown Victim',
            victim_age: comm.victim_age,
            victim_gender: comm.victim_gender,
            chief_complaint: comm.chief_complaint || 'Emergency condition',
            vital_signs: comm.vital_signs || {},
            first_aid_provided: comm.first_aid_provided || 'Basic first aid provided',
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
        setCommunications(formattedCommunications)

      } catch (apiError) {
        console.error('DEBUG - Communications API failed:', apiError);
        setCommunications([])
        setFormError("Failed to load communications. Please try again.")
      }

    } catch (error) {
      console.error('Failed to fetch communications:', error)
      setCommunications([])
      setFormError("An error occurred while loading communications.")
    } finally {
      setIsLoading(false)
    }
  }

  // Refresh communications
  const handleRefresh = () => {
    fetchCommunications();
  }

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchUserProfile(),
        fetchHospitals()
      ]);
      await fetchCommunications();
    }
    
    loadData();
  }, [])

  const getStatusColor = (status) => {
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical":
      case "high": return "bg-[#b90000]/10 text-[#b90000] border-[#b90000]/20"
      case "medium": return "bg-[#740000]/10 text-[#740000] border-[#740000]/20"
      case "low": return "bg-[#1a0000]/10 text-[#1a0000] border-[#1a0000]/20"
      default: return "bg-[#740000]/10 text-[#740000] border-[#740000]/20"
    }
  }

  const handleViewDetails = (communication) => {
    // Navigate to communication details or show modal
    console.log('View details for communication:', communication.id)
    // You can implement a detailed view modal here
    alert(`Communication Details:\nVictim: ${communication.victim_name}\nHospital: ${communication.hospital_name}\nStatus: ${communication.status}`)
  }

  const handleUpdateStatus = (communication) => {
    // Navigate to status update or show modal
    console.log('Update status for communication:', communication.id)
    // You can implement a status update modal here
    alert(`Update status for: ${communication.victim_name}`)
  }

  const handleAddAssessment = (communication) => {
    // Navigate to assessment form
    console.log('Add assessment for communication:', communication.id)
    // You can redirect to assessment form or show modal
    window.location.href = `/dashboard/first-aider/victims?communication=${communication.id}`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fff3ea] via-[#fff3ea] to-[#ffe6c5]">
        <Sidebar />
        <main className="lg:ml-64">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-[#b90000] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#740000]">Loading communications...</p>
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
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-row items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[#1a0000] mb-2">Hospital Communications</h1>
                <p className="text-[#740000]">
                  {userProfile ? `Welcome back, ${userProfile.first_name || 'First Aider'}! ` : ''}
                  Manage all communications with hospitals about victims
                </p>
                {userProfile?.organization && (
                  <p className="text-[#740000] text-sm mt-1">
                    Organization: {userProfile.organization.name || userProfile.organization}
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleRefresh}
                  className="px-4 py-2 border border-[#b90000] text-[#b90000] hover:bg-[#ffe6c5] rounded-lg font-medium transition-colors"
                >
                  Refresh
                </button>
                <Link
                  to="/dashboard/first-aider"
                  className="px-4 py-2 bg-[#b90000] hover:bg-[#740000] text-white rounded-lg font-medium transition-colors"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#740000] mb-1">Total Communications</p>
                  <p className="text-2xl font-bold text-[#1a0000]">{communications.length}</p>
                </div>
                <MessageCircle className="w-8 h-8 text-[#b90000]/20" />
              </div>
            </div>
            <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#740000] mb-1">Active</p>
                  <p className="text-2xl font-bold text-[#1a0000]">
                    {communications.filter(c => ['sent', 'acknowledged', 'preparing', 'ready', 'en_route'].includes(c.status)).length}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-[#b90000]/20" />
              </div>
            </div>
            <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#740000] mb-1">Completed</p>
                  <p className="text-2xl font-bold text-[#1a0000]">
                    {communications.filter(c => ['arrived', 'completed'].includes(c.status)).length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-[#1a0000]/20" />
              </div>
            </div>
            <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#740000] mb-1">With Assessments</p>
                  <p className="text-2xl font-bold text-[#1a0000]">
                    {communications.filter(c => c.has_assessment).length}
                  </p>
                </div>
                <Stethoscope className="w-8 h-8 text-[#740000]/20" />
              </div>
            </div>
          </div>

          {/* Error/Success Messages */}
          {formError && (
            <div className="p-4 bg-[#b90000]/10 border border-[#b90000] rounded text-[#b90000] text-sm mb-6">
              {formError}
            </div>
          )}
          {formSuccess && (
            <div className="p-4 bg-green-100 border border-green-400 rounded text-green-700 text-sm mb-6">
              {formSuccess}
            </div>
          )}

          {/* Communications Grid */}
          <div className="grid gap-6">
            {communications.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="w-16 h-16 text-[#740000]/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#1a0000] mb-2">No Communications Found</h3>
                <p className="text-[#740000] mb-6">
                  {formError ? "Unable to load communications. Please try refreshing." : "You haven't sent any hospital communications yet."}
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={handleRefresh}
                    className="px-6 py-3 border border-[#b90000] text-[#b90000] hover:bg-[#ffe6c5] rounded-lg font-medium transition-colors"
                  >
                    Refresh
                  </button>
                  <Link
                    to="/dashboard/first-aider"
                    className="px-6 py-3 bg-[#b90000] hover:bg-[#740000] text-white rounded-lg font-medium transition-colors"
                  >
                    Go to Dashboard
                  </Link>
                </div>
              </div>
            ) : (
              communications.map((communication) => (
                <div key={communication.id} className="bg-white border border-[#ffe6c5] rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 bg-[#fff3ea] rounded-lg">
                        <MessageCircle className="w-6 h-6 text-[#b90000]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-semibold text-[#1a0000]">
                            {communication.victim_name || "Unknown Victim"}
                          </h3>
                          <div className="flex gap-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(communication.priority)}`}>
                              {communication.priority?.charAt(0).toUpperCase() + communication.priority?.slice(1) || 'High'}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(communication.status)}`}>
                              {communication.status?.toUpperCase() || "PENDING"}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-[#740000] mb-2">
                          <Building className="w-4 h-4" />
                          <span className="font-medium">{communication.hospital_name || "Hospital"}</span>
                        </div>
                        
                        <p className="text-[#1a0000] mb-3">{communication.chief_complaint || "Emergency condition"}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-[#740000] flex-wrap">
                          {communication.victim_age && (
                            <span className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {communication.victim_age} years
                            </span>
                          )}
                          {communication.victim_gender && (
                            <>
                              <span>•</span>
                              <span>{communication.victim_gender}</span>
                            </>
                          )}
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            ETA: {communication.estimated_arrival_minutes || 15} min
                          </span>
                          {communication.has_assessment && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1 text-green-600">
                                <Stethoscope className="w-4 h-4" />
                                Assessment Complete
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Communication Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-[#740000] font-medium">First Aid Provided:</span>
                      <p className="text-[#1a0000] mt-1">{communication.first_aid_provided}</p>
                    </div>
                    <div>
                      <span className="text-[#740000] font-medium">Created:</span>
                      <p className="text-[#1a0000] mt-1">
                        {new Date(communication.created_at).toLocaleDateString()} at {new Date(communication.created_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  {communication.required_specialties && communication.required_specialties.length > 0 && (
                    <div className="mb-4">
                      <span className="text-sm font-medium text-[#740000]">Required Specialties: </span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {communication.required_specialties.map((specialty, index) => (
                          <span key={index} className="px-2 py-1 bg-[#ffe6c5] text-[#1a0000] rounded text-xs">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {communication.equipment_needed && communication.equipment_needed.length > 0 && (
                    <div className="mb-4">
                      <span className="text-sm font-medium text-[#740000]">Equipment Needed: </span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {communication.equipment_needed.map((equipment, index) => (
                          <span key={index} className="px-2 py-1 bg-[#fff3ea] text-[#1a0000] rounded text-xs">
                            {equipment}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-[#ffe6c5]">
                    <div className="flex items-center gap-4 text-sm text-[#740000]">
                      <span>ID: {communication.id}</span>
                      <span>•</span>
                      <span>Updated: {new Date(communication.updated_at).toLocaleDateString()}</span>
                      {communication.first_aider_name && (
                        <>
                          <span>•</span>
                          <span>By: {communication.first_aider_name}</span>
                        </>
                      )}
                    </div>
                    <div className="flex gap-3">
                      {!communication.has_assessment && (
                        <button 
                          onClick={() => handleAddAssessment(communication)}
                          className="px-4 py-2 bg-[#b90000] hover:bg-[#740000] text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                          <Stethoscope className="w-4 h-4" />
                          Add Assessment
                        </button>
                      )}
                      <button 
                        onClick={() => handleUpdateStatus(communication)}
                        className="px-4 py-2 border border-[#740000] text-[#740000] hover:bg-[#ffe6c5] rounded-lg font-medium transition-colors"
                      >
                        Update Status
                      </button>
                      <button 
                        onClick={() => handleViewDetails(communication)}
                        className="px-4 py-2 border border-[#1a0000] text-[#1a0000] hover:bg-[#ffe6c5] rounded-lg font-medium transition-colors flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Loading more indicator */}
          {communications.length > 0 && (
            <div className="text-center mt-8">
              <button
                onClick={handleRefresh}
                className="px-6 py-3 border border-[#b90000] text-[#b90000] hover:bg-[#ffe6c5] rounded-lg font-medium transition-colors"
              >
                Load More Communications
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}