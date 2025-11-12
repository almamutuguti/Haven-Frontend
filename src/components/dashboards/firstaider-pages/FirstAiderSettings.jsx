// src/components/dashboards/firstaider-pages/FirstAiderSettings.jsx
import { useState, useEffect } from "react"
import { Sidebar } from "../../SideBar"
import { User, Bell, Shield, Download, Save, Camera, X, CheckCircle, AlertCircle, Info, Clock, Lock } from "lucide-react"
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
    <div className="bg-white border border-[#ffe6c5] rounded-lg p-6 mb-6">
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

export default function FirstAiderSettings() {
  const [activeTab, setActiveTab] = useState("profile")
  const [isLoading, setIsLoading] = useState(false)
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
    certification: "",
    certificationExpiry: ""
  })

  const [notifications, setNotifications] = useState({
    emergencyAlerts: true,
    assignmentUpdates: true,
    hospitalCommunications: true,
    systemMaintenance: false,
    newsletter: false
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
      
      // Try different possible endpoints
      let userData;
      try {
        // Try the main profile endpoint
        userData = await apiClient.get('/api/user/profile/');
      } catch (error) {
        console.log('Primary endpoint failed, trying alternative endpoints...');
        
        // Try to get user data from localStorage or other sources
        const storedUser = localStorage.getItem('haven_user');
        if (storedUser) {
          userData = JSON.parse(storedUser);
        } else {
          // If no stored user, show error and use empty data
          throw new Error('Unable to load user data. Please check if you are logged in.');
        }
      }

      console.log('User data loaded:', userData);

      // Update profile state with actual user data
      setProfile({
        firstName: userData.first_name || userData.firstName || "",
        lastName: userData.last_name || userData.lastName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        organization: userData.organization?.name || userData.organization || "Not assigned",
        badgeNumber: userData.badge_number || userData.badgeNumber || "Not assigned",
        certification: userData.certification || "Advanced First Aid & CPR",
        certificationExpiry: userData.certification_expiry || userData.certificationExpiry || ""
      });

      showMessage('success', 'Settings loaded successfully');

    } catch (error) {
      console.error('Error loading user data:', error);
      showMessage('error', `Failed to load user data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      if (activeTab === "profile") {
        const profileData = {
          first_name: profile.firstName,
          last_name: profile.lastName,
          email: profile.email,
          phone: profile.phone,
        };
        
        try {
          await apiClient.put('/api/user/profile/', profileData);
          showMessage('success', 'Profile updated successfully!');
        } catch (error) {
          // If API fails, save to localStorage as fallback
          const currentUser = JSON.parse(localStorage.getItem('haven_user') || '{}');
          const updatedUser = { ...currentUser, ...profileData };
          localStorage.setItem('haven_user', JSON.stringify(updatedUser));
          showMessage('success', 'Profile saved locally!');
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
      setIsLoading(false);
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

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield, disabled: true }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff3ea] via-[#fff3ea] to-[#ffe6c5]">
      <Sidebar />
      <main className="lg:ml-64 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1a0000] mb-2">Settings</h1>
            <p className="text-[#740000]">Manage your account preferences and settings</p>
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
                      className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id && !isDisabled
                          ? "border-[#b90000] text-[#b90000]"
                          : isDisabled
                          ? "border-transparent text-gray-400 cursor-not-allowed relative"
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
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-20 h-20 bg-[#fff3ea] rounded-full flex items-center justify-center">
                        <User className="w-10 h-10 text-[#b90000]" />
                      </div>
                      <button className="absolute bottom-0 right-0 p-1 bg-[#b90000] text-white rounded-full">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#1a0000]">
                        {profile.firstName} {profile.lastName}
                      </h3>
                      <p className="text-[#740000]">{profile.organization}</p>
                      <p className="text-sm text-[#740000]">Badge: {profile.badgeNumber}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1a0000] mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={profile.firstName}
                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#ffe6c5] rounded-lg text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1a0000] mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={profile.lastName}
                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#ffe6c5] rounded-lg text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1a0000] mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#ffe6c5] rounded-lg text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
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
                    <div>
                      <label className="block text-sm font-medium text-[#1a0000] mb-2">
                        Certification Expiry
                      </label>
                      <input
                        type="date"
                        value={profile.certificationExpiry}
                        onChange={(e) => setProfile({ ...profile, certificationExpiry: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#ffe6c5] rounded-lg text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
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

              <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-[#ffe6c5]">
                <button 
                  onClick={loadUserData}
                  className="px-6 py-2 border border-[#740000] text-[#740000] hover:bg-[#ffe6c5] rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading || activeTab === "security"}
                  className="px-6 py-2 bg-[#b90000] hover:bg-[#740000] text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
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
                Download your incident history and assessment data in various formats.
              </p>
              <button 
                onMouseEnter={() => setHoveredButton('export')}
                onMouseLeave={() => setHoveredButton(null)}
                onClick={handleExportData}
                disabled
                className="w-full px-4 py-2 border border-gray-300 text-gray-400 bg-gray-50 rounded-lg font-medium cursor-not-allowed"
              >
                Export My Data
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
                className="w-full px-4 py-2 border border-gray-300 text-gray-400 bg-gray-50 rounded-lg font-medium cursor-not-allowed"
              >
                Privacy Settings
              </button>
            </div>
          </div>

          {/* Under Development Sections - Only show when hovering specific buttons */}
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <UnderDevelopmentBanner 
              isVisible={hoveredButton === 'export'}
              title="Data Export Feature Under Development"
              description="We're building comprehensive data export capabilities that will allow you to download your incident history, assessment data, and activity logs in multiple formats including PDF, CSV, and JSON."
            />
            <UnderDevelopmentBanner 
              isVisible={hoveredButton === 'privacy'}
              title="Privacy Settings Under Development"
              description="Advanced privacy controls are being implemented to give you complete control over your data sharing preferences, consent management, and privacy options across the Haven platform."
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