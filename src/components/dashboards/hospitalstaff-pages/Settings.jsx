// src/components/dashboards/Settings.jsx
import { useState, useEffect } from "react"
import { Sidebar } from "../../SideBar"
import { User, Bell, Shield, Download, Save, Camera, X, CheckCircle, AlertCircle, Info, Clock, Lock, MapPin, Phone } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { apiClient } from "../../../utils/api"

// Message Component for displaying alerts
const Message = ({ type, message, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-50 border-green-200' : type === 'error' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200';
  const textColor = type === 'success' ? 'text-green-800' : type === 'error' ? 'text-red-800' : 'text-blue-800';
  const Icon = type === 'success' ? CheckCircle : type === 'error' ? AlertCircle : Info;

  return (
    <div className={`${bgColor} border rounded-lg p-4 mb-4 flex items-center justify-between`}>
      <div className="flex items-center">
        <Icon className={`w-5 h-5 ${textColor} mr-3`} />
        <span className={textColor}>{message}</span>
      </div>
      <button
        onClick={onClose}
        className={`${textColor} hover:opacity-70`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Under Development Banner Component
const UnderDevelopmentBanner = ({ isVisible, title, description }) => {
  if (!isVisible) return null;
  
  return (
    <div className="bg-white border border-[#ffe6c5] rounded-lg p-6 mb-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <Clock className="w-6 h-6 text-[#8B0000]" />
        </div>
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-[#8B0000] mb-1">{title}</h4>
          <p className="text-[#8B0000] text-sm opacity-90">{description}</p>
        </div>
        <div className="bg-[#fff5f5] rounded-lg px-3 py-1">
          <span className="text-[#8B0000] text-sm font-medium">Under Development</span>
        </div>
      </div>
    </div>
  );
};

// Security Under Development Component
const SecurityUnderDevelopment = () => {
  return (
    <div className="bg-white border border-[#ffe6c5] rounded-lg p-12 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 bg-[#fff5f5] rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-10 h-10 text-[#8B0000]" />
        </div>
        <h3 className="text-2xl font-bold text-[#8B0000] mb-4">Security Features Coming Soon</h3>
        <p className="text-[#8B0000] text-lg mb-6">
          We're working on advanced security features to keep your account safe and secure.
        </p>
        <div className="space-y-3 text-left bg-[#fff5f5] rounded-lg p-6 mb-6">
          <h4 className="font-semibold text-[#8B0000] mb-3">Features in Development:</h4>
          <div className="flex items-center gap-3 text-[#8B0000]">
            <div className="w-2 h-2 bg-[#8B0000] rounded-full"></div>
            <span>Password Management & Reset</span>
          </div>
          <div className="flex items-center gap-3 text-[#8B0000]">
            <div className="w-2 h-2 bg-[#8B0000] rounded-full"></div>
            <span>Two-Factor Authentication (2FA)</span>
          </div>
          <div className="flex items-center gap-3 text-[#8B0000]">
            <div className="w-2 h-2 bg-[#8B0000] rounded-full"></div>
            <span>Session Management</span>
          </div>
          <div className="flex items-center gap-3 text-[#8B0000]">
            <div className="w-2 h-2 bg-[#8B0000] rounded-full"></div>
            <span>Security Activity Logs</span>
          </div>
        </div>
        <div className="bg-[#fff5f5] rounded-lg px-6 py-3 inline-block">
          <span className="text-[#8B0000] text-lg font-semibold">Under Active Development</span>
        </div>
      </div>
    </div>
  );
};

// Hospital Info Card Component
const HospitalInfoCard = ({ hospital }) => {
  if (!hospital) return null;

  return (
    <div className="bg-[#fff5f5] border border-[#ffe6c5] rounded-lg p-4 mb-6">
      <h4 className="text-lg font-semibold text-[#8B0000] mb-3 flex items-center gap-2">
        <MapPin className="w-5 h-5" />
        Hospital Information
      </h4>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#8B0000] mb-1">Hospital Name</label>
          <p className="text-[#1a0000] font-medium">{hospital.name || "Not specified"}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#8B0000] mb-1">Hospital Type</label>
          <p className="text-[#1a0000]">{hospital.hospital_type || "Not specified"}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#8B0000] mb-1">Emergency Contact</label>
          <div className="flex items-center gap-2 text-[#1a0000]">
            <Phone className="w-4 h-4" />
            {hospital.phone ? (
              <a href={`tel:${hospital.phone}`} className="hover:text-[#b90000] transition-colors">
                {hospital.phone}
              </a>
            ) : (
              "Not available"
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#8B0000] mb-1">Status</label>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            hospital.is_operational 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {hospital.is_operational ? 'Operational' : 'Not Operational'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default function Settings() {
  const { user, updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [hoveredButton, setHoveredButton] = useState(null)
  const [securityHovered, setSecurityHovered] = useState(false)

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    organization: "",
    badgeNumber: "",
    registrationNumber: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    department: "",
    employeeId: "",
    specialization: "",
    licenseExpiry: ""
  })

  const [hospitalInfo, setHospitalInfo] = useState(null)

  const [notifications, setNotifications] = useState({
    emergencyAlerts: true,
    assignmentUpdates: true,
    hospitalCommunications: true,
    systemMaintenance: false,
    newsletter: false,
    patientArrivals: true,
    systemUpdates: false,
    emailNotifications: true,
    shiftUpdates: true,
    criticalAlerts: true
  })

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const clearMessage = () => {
    setMessage({ type: '', text: '' });
  };

  // Load user data on component mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      
      // Try to get user data from auth context first
      if (user) {
        console.log('Using user data from auth context:', user);
        updateProfileFromUserData(user);
        showMessage('success', 'Profile loaded successfully');
        return;
      }

      // If no user in context, try API
      try {
        const userData = await apiClient.get('/api/user/profile/');
        console.log('User data loaded from API:', userData);
        updateProfileFromUserData(userData);
        showMessage('success', 'Profile loaded successfully from server');
      } catch (apiError) {
        console.log('API failed, trying localStorage...');
        
        // Try localStorage as final fallback
        const storedUser = localStorage.getItem('haven_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          updateProfileFromUserData(userData);
          showMessage('success', 'Profile loaded from local storage');
        } else {
          throw new Error('Unable to load user data from any source');
        }
      }

    } catch (error) {
      console.error('Error loading user data:', error);
      showMessage('error', `Failed to load user data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfileFromUserData = (userData) => {
    // Update profile state
    setProfile({
      firstName: userData.first_name || userData.firstName || "",
      lastName: userData.last_name || userData.lastName || "",
      email: userData.email || "",
      phone: userData.phone || "",
      organization: userData.organization?.name || "",
      badgeNumber: userData.badge_number || userData.badgeNumber || "",
      registrationNumber: userData.registration_number || "",
      emergencyContactName: userData.emergency_contact_name || "",
      emergencyContactPhone: userData.emergency_contact_phone || "",
      department: userData.department || "",
      employeeId: userData.employee_id || "",
      specialization: userData.specialization || "",
      licenseExpiry: userData.license_expiry || ""
    });

    // Set hospital info if available
    if (userData.hospital) {
      setHospitalInfo(userData.hospital);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      if (activeTab === "profile") {
        // Prepare profile data for backend according to your serializer
        const profileData = {
          first_name: profile.firstName,
          last_name: profile.lastName,
          email: profile.email,
          phone: profile.phone,
          emergency_contact_name: profile.emergencyContactName,
          emergency_contact_phone: profile.emergencyContactPhone,
        };
        
        // Add role-specific fields
        if (isHospitalStaff) {
          profileData.department = profile.department;
          profileData.employee_id = profile.employeeId;
          profileData.specialization = profile.specialization;
          profileData.license_expiry = profile.licenseExpiry;
        } else {
          // First Aider specific fields
          profileData.registration_number = profile.registrationNumber;
        }
        
        try {
          // Try API first
          const updatedUser = await apiClient.put('/api/user/profile/', profileData);
          console.log('Profile updated via API:', updatedUser);
          
          // Update auth context
          if (updateUser) {
            updateUser({
              ...user,
              ...profileData
            });
          }
          
          showMessage('success', 'Profile updated successfully!');
        } catch (apiError) {
          console.log('API update failed, saving locally...');
          // If API fails, save to localStorage as fallback
          const currentUser = JSON.parse(localStorage.getItem('haven_user') || '{}');
          const updatedUser = { ...currentUser, ...profileData };
          localStorage.setItem('haven_user', JSON.stringify(updatedUser));
          
          // Update auth context with local data
          if (updateUser) {
            updateUser(updatedUser);
          }
          
          showMessage('success', 'Profile saved locally! Changes will sync when online.');
        }
      } 
      else if (activeTab === "notifications") {
        // Save notification preferences to localStorage
        localStorage.setItem('user_notification_preferences', JSON.stringify(notifications));
        showMessage('success', 'Notification preferences saved!');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      showMessage('error', error.message || 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportData = () => {
    showMessage('info', 'Data export feature is currently under development');
  };

  const handlePrivacySettings = () => {
    showMessage('info', 'Privacy settings feature is under development');
  };

  const handleSecurityClick = () => {
    showMessage('info', 'Security features are currently under development');
  };

  const isHospitalStaff = user?.role === 'hospital_staff';

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield, disabled: true }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff3ea] via-[#fff3ea] to-[#ffe6c5]">
      <Sidebar />
      <main className="lg:ml-64 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header with Action Buttons at Top */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#1a0000] mb-2">
                {isHospitalStaff ? 'Hospital Staff Settings' : 'First Aider Settings'}
              </h1>
              <p className="text-[#740000]">Manage your account preferences and settings</p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button 
                onClick={loadUserData}
                disabled={isSaving}
                className="px-6 py-2 border border-[#740000] text-[#740000] hover:bg-[#ffe6c5] rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || isLoading || activeTab === "security"}
                className="px-6 py-2 bg-[#b90000] hover:bg-[#740000] text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          {/* Message Display */}
          {message.text && (
            <Message 
              type={message.type} 
              message={message.text} 
              onClose={clearMessage}
            />
          )}

          <div className="bg-white border border-[#ffe6c5] rounded-lg shadow-sm">
            {/* Tab Navigation */}
            <div className="border-b border-[#ffe6c5]">
              <div className="flex">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isDisabled = tab.disabled;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => !isDisabled && setActiveTab(tab.id)}
                      onMouseEnter={() => isDisabled && setSecurityHovered(true)}
                      onMouseLeave={() => isDisabled && setSecurityHovered(false)}
                      className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors relative ${
                        activeTab === tab.id && !isDisabled
                          ? "border-[#b90000] text-[#b90000]"
                          : isDisabled
                          ? "border-transparent text-gray-400 cursor-not-allowed"
                          : "border-transparent text-[#740000] hover:text-[#1a0000]"
                      }`}
                      disabled={isDisabled}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                      {isDisabled && (
                        <div className="absolute -top-1 -right-1">
                          <div className="bg-[#8B0000] text-white text-xs rounded-full px-2 py-1">
                            Soon
                          </div>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#b90000]"></div>
                  <span className="ml-3 text-[#1a0000]">Loading your profile data...</span>
                </div>
              ) : (
                <>
                  {activeTab === "profile" && (
                    <div className="space-y-6">
                      {/* Hospital Information Card - Show for hospital staff */}
                      {isHospitalStaff && <HospitalInfoCard hospital={hospitalInfo} />}

                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <div className="w-20 h-20 bg-[#fff3ea] rounded-full flex items-center justify-center">
                            <User className="w-10 h-10 text-[#b90000]" />
                          </div>
                          <button className="absolute bottom-0 right-0 p-1 bg-[#b90000] text-white rounded-full hover:bg-[#740000] transition-colors">
                            <Camera className="w-4 h-4" />
                          </button>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-[#1a0000]">
                            {profile.firstName} {profile.lastName}
                          </h3>
                          <p className="text-[#740000]">
                            {isHospitalStaff ? profile.department || "No department assigned" : profile.organization || "No organization assigned"}
                          </p>
                          <p className="text-sm text-[#740000]">
                            {isHospitalStaff ? `Employee ID: ${profile.employeeId || "Not assigned"}` : `Badge: ${profile.badgeNumber || "Not assigned"}`}
                          </p>
                          {isHospitalStaff && hospitalInfo?.name && (
                            <p className="text-sm text-[#740000]">Hospital: {hospitalInfo.name}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        {/* Basic Information */}
                        <div>
                          <label className="block text-sm font-medium text-[#1a0000] mb-2">
                            First Name *
                          </label>
                          <input
                            type="text"
                            value={profile.firstName}
                            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-[#ffe6c5] rounded-lg text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#1a0000] mb-2">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            value={profile.lastName}
                            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-[#ffe6c5] rounded-lg text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#1a0000] mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-[#ffe6c5] rounded-lg text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#1a0000] mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-[#ffe6c5] rounded-lg text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                            placeholder="+254712345678"
                          />
                        </div>

                        {/* Role-specific fields */}
                        {isHospitalStaff ? (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-[#1a0000] mb-2">
                                Department
                              </label>
                              <select
                                value={profile.department}
                                onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                                className="w-full px-3 py-2 bg-white border border-[#ffe6c5] rounded-lg text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                              >
                                <option value="">Select Department</option>
                                <option value="Emergency Department">Emergency Department</option>
                                <option value="Intensive Care Unit">Intensive Care Unit</option>
                                <option value="Surgery">Surgery</option>
                                <option value="Pediatrics">Pediatrics</option>
                                <option value="Cardiology">Cardiology</option>
                                <option value="Neurology">Neurology</option>
                                <option value="Oncology">Oncology</option>
                                <option value="Radiology">Radiology</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#1a0000] mb-2">
                                Employee ID
                              </label>
                              <input
                                type="text"
                                value={profile.employeeId}
                                onChange={(e) => setProfile({ ...profile, employeeId: e.target.value })}
                                className="w-full px-3 py-2 bg-white border border-[#ffe6c5] rounded-lg text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#1a0000] mb-2">
                                Specialization
                              </label>
                              <input
                                type="text"
                                value={profile.specialization}
                                onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                                className="w-full px-3 py-2 bg-white border border-[#ffe6c5] rounded-lg text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                placeholder="e.g., Emergency Medicine, Surgery"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#1a0000] mb-2">
                                License Expiry Date
                              </label>
                              <input
                                type="date"
                                value={profile.licenseExpiry}
                                onChange={(e) => setProfile({ ...profile, licenseExpiry: e.target.value })}
                                className="w-full px-3 py-2 bg-white border border-[#ffe6c5] rounded-lg text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-[#1a0000] mb-2">
                                Badge Number
                              </label>
                              <input
                                type="text"
                                value={profile.badgeNumber}
                                className="w-full px-3 py-2 bg-gray-50 border border-[#ffe6c5] rounded-lg text-gray-500 cursor-not-allowed"
                                readOnly
                                disabled
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#1a0000] mb-2">
                                Registration Number
                              </label>
                              <input
                                type="text"
                                value={profile.registrationNumber}
                                onChange={(e) => setProfile({ ...profile, registrationNumber: e.target.value })}
                                className="w-full px-3 py-2 bg-white border border-[#ffe6c5] rounded-lg text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                placeholder="Your professional registration number"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[#1a0000] mb-2">
                                Organization
                              </label>
                              <input
                                type="text"
                                value={profile.organization}
                                className="w-full px-3 py-2 bg-gray-50 border border-[#ffe6c5] rounded-lg text-gray-500 cursor-not-allowed"
                                readOnly
                                disabled
                              />
                            </div>
                          </>
                        )}

                        {/* Emergency Contact (Common for both roles) */}
                        <div>
                          <label className="block text-sm font-medium text-[#1a0000] mb-2">
                            Emergency Contact Name
                          </label>
                          <input
                            type="text"
                            value={profile.emergencyContactName}
                            onChange={(e) => setProfile({ ...profile, emergencyContactName: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-[#ffe6c5] rounded-lg text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                            placeholder="Name of emergency contact"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#1a0000] mb-2">
                            Emergency Contact Phone
                          </label>
                          <input
                            type="tel"
                            value={profile.emergencyContactPhone}
                            onChange={(e) => setProfile({ ...profile, emergencyContactPhone: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-[#ffe6c5] rounded-lg text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                            placeholder="+254712345678"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "notifications" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-[#1a0000] mb-4">Notification Preferences</h3>
                      {Object.entries(notifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-[#fff3ea] rounded-lg">
                          <div>
                            <div className="font-medium text-[#1a0000] capitalize">
                              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                            </div>
                            <div className="text-sm text-[#740000]">
                              Receive notifications for {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#b90000]"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "security" && (
                    <SecurityUnderDevelopment />
                  )}
                </>
              )}
            </div>
          </div>

          {/* Additional Settings */}
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-[#ffe6c5] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#1a0000] mb-4 flex items-center gap-2">
                <Download className="w-5 h-5 text-[#b90000]" />
                Data Export
              </h3>
              <p className="text-[#740000] text-sm mb-4">
                {isHospitalStaff 
                  ? "Download your patient records, incident reports, and activity logs."
                  : "Download your incident history and assessment data in various formats."
                }
              </p>
              <button 
                onMouseEnter={() => setHoveredButton('export')}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={handleExportData}
                disabled
                className="w-full px-4 py-2 border border-gray-300 text-gray-400 bg-gray-50 rounded-lg font-medium cursor-not-allowed transition-colors"
              >
                {isHospitalStaff ? 'Export Hospital Data' : 'Export My Data'}
              </button>
            </div>

            <div className="bg-white border border-[#ffe6c5] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#1a0000] mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#b90000]" />
                Privacy Settings
              </h3>
              <p className="text-[#740000] text-sm mb-4">
                Manage your privacy settings, data sharing preferences, and consent options.
              </p>
              <button 
                onMouseEnter={() => setHoveredButton('privacy')}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={handlePrivacySettings}
                disabled
                className="w-full px-4 py-2 border border-gray-300 text-gray-400 bg-gray-50 rounded-lg font-medium cursor-not-allowed transition-colors"
              >
                Privacy Settings
              </button>
            </div>
          </div>

          {/* Under Development Sections - Only show when hovering specific buttons */}
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <UnderDevelopmentBanner 
              isVisible={hoveredButton === 'export'}
              title={isHospitalStaff ? "Hospital Data Export Under Development" : "Data Export Feature Under Development"}
              description={isHospitalStaff 
                ? "We're building comprehensive data export capabilities for hospital staff including patient records, incident reports, and medical data in compliance with healthcare regulations."
                : "We're building comprehensive data export capabilities that will allow you to download your incident history, assessment data, and activity logs in multiple formats including PDF, CSV, and JSON."
              }
            />
            <UnderDevelopmentBanner 
              isVisible={hoveredButton === 'privacy'}
              title={isHospitalStaff ? "Healthcare Privacy Settings Under Development" : "Privacy Settings Under Development"}
              description={isHospitalStaff
                ? "Advanced privacy controls specifically designed for healthcare professionals are being implemented to ensure HIPAA compliance and patient data protection."
                : "Advanced privacy controls are being implemented to give you complete control over your data sharing preferences, consent management, and privacy options across the Haven platform."
              }
            />
          </div>

          {/* Security Hover Tooltip */}
          {securityHovered && (
            <div className="fixed z-50 bg-white border border-[#ffe6c5] rounded-lg p-4 shadow-lg max-w-sm">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-[#8B0000]" />
                <span className="text-[#8B0000] font-semibold">Security Features Coming Soon</span>
              </div>
              <p className="text-[#8B0000] text-sm">
                Advanced security features including password management and two-factor authentication are currently in development.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}