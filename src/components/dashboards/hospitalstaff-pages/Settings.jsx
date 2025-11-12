"use client"
import { useState } from "react"
import { Sidebar } from "../../SideBar"
import { Settings as SettingsIcon, Bell, Shield, User, Save, X, CheckCircle } from "lucide-react"
import { useAuth } from "../../context/AuthContext"

export default function Settings() {
    const { user } = useAuth()
    const [notification, setNotification] = useState({ show: false, message: '', type: '' })
    const [settings, setSettings] = useState({
        notifications: {
            emergencyAlerts: true,
            patientArrivals: true,
            systemUpdates: false,
            emailNotifications: true
        },
        preferences: {
            language: 'english',
            timezone: 'UTC+3',
            theme: 'light'
        }
    })

    // Show notification
    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type })
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' })
        }, 5000)
    }

    // Handle settings change
    const handleSettingChange = (category, key, value) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: value
            }
        }))
    }

    // Save settings
    const saveSettings = async () => {
        try {
            // In a real app, you would save these to your backend
            console.log('Saving settings:', settings)
            showNotification('Settings saved successfully!', 'success')
        } catch (error) {
            console.error('Failed to save settings:', error)
            showNotification('Failed to save settings. Please try again.', 'error')
        }
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
                                <X className="w-5 h-5 mr-2" />
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
                    <h1 className="text-3xl sm:text-4xl font-bold text-[#1a0000] mb-2">Settings</h1>
                    <p className="text-[#740000] text-sm sm:text-base">
                        Manage your account preferences and notification settings
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Settings Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Profile Information */}
                        <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg">
                            <div className="p-6 border-b border-[#ffe6c5]">
                                <div className="flex items-center gap-3">
                                    <User className="w-6 h-6 text-[#b90000]" />
                                    <h2 className="text-xl font-bold text-[#1a0000]">Profile Information</h2>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[#1a0000] mb-2">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={user?.email || ''}
                                            disabled
                                            className="w-full px-3 py-2 bg-gray-100 border border-[#ffe6c5] rounded-md text-[#1a0000] cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#1a0000] mb-2">
                                            Role
                                        </label>
                                        <input
                                            type="text"
                                            value={user?.role ? user.role.replace('_', ' ') : ''}
                                            disabled
                                            className="w-full px-3 py-2 bg-gray-100 border border-[#ffe6c5] rounded-md text-[#1a0000] cursor-not-allowed capitalize"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1a0000] mb-2">
                                        Hospital
                                    </label>
                                    <input
                                        type="text"
                                        value={user?.hospital?.name || 'Not assigned'}
                                        disabled
                                        className="w-full px-3 py-2 bg-gray-100 border border-[#ffe6c5] rounded-md text-[#1a0000] cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Notification Settings */}
                        <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg">
                            <div className="p-6 border-b border-[#ffe6c5]">
                                <div className="flex items-center gap-3">
                                    <Bell className="w-6 h-6 text-[#b90000]" />
                                    <h2 className="text-xl font-bold text-[#1a0000]">Notification Preferences</h2>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center justify-between py-2">
                                    <div>
                                        <label className="block text-sm font-medium text-[#1a0000]">
                                            Emergency Alerts
                                        </label>
                                        <p className="text-sm text-[#740000]">
                                            Receive notifications for new emergency assignments
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={settings.notifications.emergencyAlerts}
                                        onChange={(e) => handleSettingChange('notifications', 'emergencyAlerts', e.target.checked)}
                                        className="rounded border-[#ffe6c5] text-[#b90000] focus:ring-[#b90000] w-5 h-5"
                                    />
                                </div>
                                
                                <div className="flex items-center justify-between py-2">
                                    <div>
                                        <label className="block text-sm font-medium text-[#1a0000]">
                                            Patient Arrivals
                                        </label>
                                        <p className="text-sm text-[#740000]">
                                            Notify when patients arrive at the hospital
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={settings.notifications.patientArrivals}
                                        onChange={(e) => handleSettingChange('notifications', 'patientArrivals', e.target.checked)}
                                        className="rounded border-[#ffe6c5] text-[#b90000] focus:ring-[#b90000] w-5 h-5"
                                    />
                                </div>
                                
                                <div className="flex items-center justify-between py-2">
                                    <div>
                                        <label className="block text-sm font-medium text-[#1a0000]">
                                            System Updates
                                        </label>
                                        <p className="text-sm text-[#740000]">
                                            Receive system maintenance and update notifications
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={settings.notifications.systemUpdates}
                                        onChange={(e) => handleSettingChange('notifications', 'systemUpdates', e.target.checked)}
                                        className="rounded border-[#ffe6c5] text-[#b90000] focus:ring-[#b90000] w-5 h-5"
                                    />
                                </div>
                                
                                <div className="flex items-center justify-between py-2">
                                    <div>
                                        <label className="block text-sm font-medium text-[#1a0000]">
                                            Email Notifications
                                        </label>
                                        <p className="text-sm text-[#740000]">
                                            Receive important updates via email
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={settings.notifications.emailNotifications}
                                        onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                                        className="rounded border-[#ffe6c5] text-[#b90000] focus:ring-[#b90000] w-5 h-5"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Preferences */}
                        <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg">
                            <div className="p-6 border-b border-[#ffe6c5]">
                                <div className="flex items-center gap-3">
                                    <SettingsIcon className="w-6 h-6 text-[#b90000]" />
                                    <h2 className="text-xl font-bold text-[#1a0000]">Preferences</h2>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#1a0000] mb-2">
                                        Language
                                    </label>
                                    <select
                                        value={settings.preferences.language}
                                        onChange={(e) => handleSettingChange('preferences', 'language', e.target.value)}
                                        className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                    >
                                        <option value="english">English</option>
                                        <option value="swahili">Swahili</option>
                                        <option value="french">French</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-[#1a0000] mb-2">
                                        Timezone
                                    </label>
                                    <select
                                        value={settings.preferences.timezone}
                                        onChange={(e) => handleSettingChange('preferences', 'timezone', e.target.value)}
                                        className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                    >
                                        <option value="UTC+3">East Africa Time (UTC+3)</option>
                                        <option value="UTC+0">GMT (UTC+0)</option>
                                        <option value="UTC-5">EST (UTC-5)</option>
                                        <option value="UTC+1">CET (UTC+1)</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-[#1a0000] mb-2">
                                        Theme
                                    </label>
                                    <select
                                        value={settings.preferences.theme}
                                        onChange={(e) => handleSettingChange('preferences', 'theme', e.target.value)}
                                        className="w-full px-3 py-2 bg-[#fff3ea] border border-[#ffe6c5] rounded-md text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                                    >
                                        <option value="light">Light</option>
                                        <option value="dark">Dark</option>
                                        <option value="auto">Auto</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Save Settings Card */}
                        <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
                            <h3 className="font-semibold text-[#1a0000] mb-4">Save Changes</h3>
                            <p className="text-sm text-[#740000] mb-4">
                                Review and save your settings preferences.
                            </p>
                            <button
                                onClick={saveSettings}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#b90000] hover:bg-[#740000] text-white rounded-lg font-medium transition-colors"
                            >
                                <Save className="w-4 h-4" />
                                Save Settings
                            </button>
                        </div>

                        {/* System Information */}
                        <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Shield className="w-5 h-5 text-[#b90000]" />
                                <h3 className="font-semibold text-[#1a0000]">System Information</h3>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-[#740000]">Role</span>
                                    <span className="text-[#1a0000] font-medium capitalize">
                                        {user?.role?.replace('_', ' ') || 'Hospital Staff'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#740000]">Hospital</span>
                                    <span className="text-[#1a0000] font-medium">
                                        {user?.hospital?.name || 'Not assigned'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#740000]">Status</span>
                                    <span className="text-green-600 font-medium">Active</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#740000]">Last Login</span>
                                    <span className="text-[#1a0000] font-medium">
                                        {new Date().toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}