// src/components/dashboards/firstaider-pages/FirstAiderSettings.jsx
import { useState } from "react"
import { Sidebar } from "../../SideBar"
import { User, Bell, Shield, Download, Save, Camera } from "lucide-react"

export default function FirstAiderSettings() {
  const [activeTab, setActiveTab] = useState("profile")
  const [isLoading, setIsLoading] = useState(false)

  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    organization: "Metro Emergency Services",
    badgeNumber: "FA-2024-001",
    certification: "Advanced First Aid & CPR",
    certificationExpiry: "2025-12-31"
  })

  const [notifications, setNotifications] = useState({
    emergencyAlerts: true,
    assignmentUpdates: true,
    hospitalCommunications: true,
    systemMaintenance: false,
    newsletter: false
  })

  const handleSave = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield }
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

          <div className="bg-white border border-[#ffe6c5] rounded-lg shadow-sm">
            {/* Tab Navigation */}
            <div className="border-b border-[#ffe6c5]">
              <div className="flex">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? "border-[#b90000] text-[#b90000]"
                          : "border-transparent text-[#740000] hover:text-[#1a0000]"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
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
                        onChange={(e) => setProfile({ ...profile, organization: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-[#ffe6c5] rounded-lg text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
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
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-[#1a0000]">Security Settings</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1a0000] mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 bg-white border border-[#ffe6c5] rounded-lg text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1a0000] mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 bg-white border border-[#ffe6c5] rounded-lg text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1a0000] mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 bg-white border border-[#ffe6c5] rounded-lg text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">Security Recommendations</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Use a strong, unique password</li>
                      <li>• Enable two-factor authentication</li>
                      <li>• Regularly update your password</li>
                      <li>• Never share your login credentials</li>
                    </ul>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-[#ffe6c5]">
                <button className="px-6 py-2 border border-[#740000] text-[#740000] hover:bg-[#ffe6c5] rounded-lg font-medium transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="px-6 py-2 bg-[#b90000] hover:bg-[#740000] text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
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
                Download your incident history and assessment data.
              </p>
              <button className="w-full px-4 py-2 border border-[#740000] text-[#740000] hover:bg-[#ffe6c5] rounded-lg font-medium transition-colors">
                Export My Data
              </button>
            </div>

            <div className="bg-white border border-[#ffe6c5] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#1a0000] mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#b90000]" />
                Privacy
              </h3>
              <p className="text-[#740000] text-sm mb-4">
                Manage your privacy settings and data preferences.
              </p>
              <button className="w-full px-4 py-2 border border-[#1a0000] text-[#1a0000] hover:bg-[#ffe6c5] rounded-lg font-medium transition-colors">
                Privacy Settings
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}