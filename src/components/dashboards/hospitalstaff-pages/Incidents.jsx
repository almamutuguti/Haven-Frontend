"use client"
import { useState, useEffect } from "react"
import { Sidebar } from "../../SideBar"
import { History, AlertCircle, Clock, MapPin, User, X, CheckCircle } from "lucide-react"
import { apiClient } from "../../../utils/api"
import { useAuth } from "../../context/AuthContext"

export default function Incidents() {
    const [incidents, setIncidents] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [selectedIncident, setSelectedIncident] = useState(null)
    const [showIncidentDetails, setShowIncidentDetails] = useState(false)
    const [notification, setNotification] = useState({ show: false, message: '', type: '' })
    const { user } = useAuth()

    // Show notification
    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type })
        setTimeout(() => {
            setNotification({ show: false, message: '', type: '' })
        }, 5000)
    }

    // Fetch emergency history
    const fetchIncidents = async () => {
        try {
            setIsLoading(true)
            const response = await apiClient.get('/emergencies/history/')
            let emergencyHistory = response.data || []

            // Filter incidents for current hospital if needed
            if (user?.hospital?.id) {
                emergencyHistory = emergencyHistory.filter(incident => 
                    incident.hospital_id === user.hospital.id || 
                    incident.hospital?.id === user.hospital.id
                )
            }

            // Transform to incident format
            const incidentRecords = emergencyHistory.map(incident => ({
                id: incident.id,
                emergencyId: incident.emergency_id,
                victimName: incident.victim_name || 'Unknown Victim',
                location: incident.location || 'Unknown Location',
                status: incident.status || 'unknown',
                priority: incident.priority || 'medium',
                createdAt: new Date(incident.created_at).toLocaleString(),
                updatedAt: new Date(incident.updated_at).toLocaleString(),
                firstAider: incident.first_aider_name || 'Unknown First Aider',
                hospital: incident.hospital_name || user?.hospital?.name,
                description: incident.description || 'No description available',
                coordinates: incident.coordinates,
                originalData: incident
            }))

            setIncidents(incidentRecords)
        } catch (error) {
            console.error('Failed to fetch incidents:', error)
            showNotification('Failed to load emergency history. Please try again.', 'error')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchIncidents()
    }, [user])

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case "active":
            case "pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-200"
            case "completed":
            case "resolved":
                return "bg-green-100 text-green-800 border-green-200"
            case "cancelled":
                return "bg-red-100 text-red-800 border-red-200"
            case "in_progress":
                return "bg-blue-100 text-blue-800 border-blue-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    // Get priority color
    const getPriorityColor = (priority) => {
        switch (priority) {
            case "critical":
            case "high":
                return "bg-[#b90000]/10 text-[#b90000] border-[#b90000]/20"
            case "medium":
                return "bg-orange-100 text-orange-800 border-orange-200"
            case "low":
                return "bg-green-100 text-green-800 border-green-200"
            default:
                return "bg-gray-100 text-gray-800 border-gray-200"
        }
    }

    // Format status display
    const formatStatus = (status) => {
        const statusMap = {
            'active': 'Active',
            'pending': 'Pending',
            'completed': 'Completed',
            'resolved': 'Resolved',
            'cancelled': 'Cancelled',
            'in_progress': 'In Progress',
            'unknown': 'Unknown'
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
                            <p className="text-[#740000]">Loading emergency history...</p>
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
                    <h1 className="text-3xl sm:text-4xl font-bold text-[#1a0000] mb-2">Emergency History</h1>
                    <p className="text-[#740000] text-sm sm:text-base">
                        Historical record of all emergency incidents for {user?.hospital?.name || 'the hospital'}
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[#740000] mb-1">Total Incidents</p>
                                <p className="text-2xl font-bold text-[#1a0000]">{incidents.length}</p>
                            </div>
                            <History className="w-8 h-8 text-[#b90000]/20" />
                        </div>
                    </div>
                    <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[#740000] mb-1">Completed</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {incidents.filter(i => i.status === 'completed' || i.status === 'resolved').length}
                                </p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-600/20" />
                        </div>
                    </div>
                    <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[#740000] mb-1">Critical Cases</p>
                                <p className="text-2xl font-bold text-[#b90000]">
                                    {incidents.filter(i => i.priority === 'critical' || i.priority === 'high').length}
                                </p>
                            </div>
                            <AlertCircle className="w-8 h-8 text-[#b90000]/20" />
                        </div>
                    </div>
                    <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[#740000] mb-1">Active</p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {incidents.filter(i => i.status === 'active' || i.status === 'in_progress').length}
                                </p>
                            </div>
                            <Clock className="w-8 h-8 text-yellow-600/20" />
                        </div>
                    </div>
                </div>

                {/* Incidents List */}
                <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg">
                    <div className="p-6 border-b border-[#ffe6c5]">
                        <h2 className="text-xl font-bold text-[#1a0000]">Emergency Incidents</h2>
                        <p className="text-[#740000] text-sm">
                            Historical record of all emergency responses and outcomes
                        </p>
                    </div>
                    
                    <div className="p-6">
                        {incidents.length === 0 ? (
                            <div className="text-center py-8">
                                <History className="w-12 h-12 text-[#740000]/50 mx-auto mb-4" />
                                <p className="text-[#740000] text-lg">No emergency history found</p>
                                <p className="text-[#740000] text-sm mt-2">
                                    Emergency incidents will appear here as they occur
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {incidents.map((incident) => (
                                    <div
                                        key={incident.id}
                                        className="border border-[#ffe6c5] rounded-lg p-4 hover:border-[#b90000] transition cursor-pointer"
                                        onClick={() => {
                                            setSelectedIncident(incident)
                                            setShowIncidentDetails(true)
                                        }}
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-3 gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h3 className="font-semibold text-[#1a0000] text-lg">
                                                        {incident.victimName}
                                                    </h3>
                                                    <div className="flex gap-2">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(incident.priority)}`}
                                                        >
                                                            {incident.priority?.toUpperCase() || 'MEDIUM'}
                                                        </span>
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(incident.status)}`}
                                                        >
                                                            {formatStatus(incident.status)}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-[#740000]">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-4 h-4" />
                                                        <span>{incident.location}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-4 h-4" />
                                                        <span>{incident.firstAider}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4" />
                                                        <span>{incident.createdAt}</span>
                                                    </div>
                                                </div>

                                                {incident.description && (
                                                    <div className="mt-2">
                                                        <p className="text-sm text-[#740000] line-clamp-2">
                                                            {incident.description}
                                                        </p>
                                                    </div>
                                                )}

                                                <div className="mt-2 text-xs text-[#b90000] bg-[#b90000]/10 px-2 py-1 rounded inline-block">
                                                    Emergency ID: {incident.emergencyId || incident.id}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Incident Details Modal */}
            {showIncidentDetails && selectedIncident && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-[#fff3ea] border border-[#ffe6c5] rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b border-[#ffe6c5]">
                            <h2 className="text-xl font-bold text-[#1a0000]">Incident Details</h2>
                            <button
                                onClick={() => setShowIncidentDetails(false)}
                                className="p-2 hover:bg-[#ffe6c5] rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-[#1a0000]" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6 overflow-y-auto flex-1">
                            {/* Incident Information */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-[#1a0000] mb-4">Victim Information</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm text-[#740000]">Victim Name</label>
                                            <p className="text-[#1a0000] font-medium">{selectedIncident.victimName}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-[#740000]">Location</label>
                                            <p className="text-[#1a0000] font-medium">{selectedIncident.location}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-[#740000]">First Aider</label>
                                            <p className="text-[#1a0000] font-medium">{selectedIncident.firstAider}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className="text-lg font-semibold text-[#1a0000] mb-4">Incident Details</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-sm text-[#740000]">Emergency ID</label>
                                            <p className="text-[#1a0000] font-medium">{selectedIncident.emergencyId || selectedIncident.id}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-[#740000]">Status</label>
                                            <p className="text-[#1a0000] font-medium">{formatStatus(selectedIncident.status)}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-[#740000]">Priority</label>
                                            <p className="text-[#1a0000] font-medium capitalize">{selectedIncident.priority}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm text-[#740000]">Hospital</label>
                                            <p className="text-[#1a0000] font-medium">{selectedIncident.hospital}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div>
                                <h3 className="text-lg font-semibold text-[#1a0000] mb-4">Timeline</h3>
                                <div className="bg-white border border-[#ffe6c5] rounded-lg p-4">
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-[#740000]">Created</span>
                                            <span className="text-sm text-[#1a0000] font-medium">{selectedIncident.createdAt}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-[#740000]">Last Updated</span>
                                            <span className="text-sm text-[#1a0000] font-medium">{selectedIncident.updatedAt}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            {selectedIncident.description && (
                                <div>
                                    <h3 className="text-lg font-semibold text-[#1a0000] mb-4">Description</h3>
                                    <div className="bg-white border border-[#ffe6c5] rounded-lg p-4">
                                        <p className="text-[#1a0000] whitespace-pre-wrap">{selectedIncident.description}</p>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-4 border-t border-[#ffe6c5]">
                                <button
                                    onClick={() => setShowIncidentDetails(false)}
                                    className="flex-1 px-4 py-2 border border-[#ffe6c5] text-[#1a0000] hover:bg-[#ffe6c5] rounded-lg font-medium transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}