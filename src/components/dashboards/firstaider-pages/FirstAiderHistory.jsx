// src/components/dashboards/firstaider-pages/FirstAiderHistory.jsx
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Sidebar } from "../../SideBar"
import { History, Filter, Download, Eye, Calendar, RefreshCw, Search, ChevronLeft, ChevronRight, FileText, AlertCircle, CheckCircle, Clock, User } from "lucide-react"
import { apiClient } from "../../../utils/api"

export default function FirstAiderHistory() {
  const [incidents, setIncidents] = useState([])
  const [filter, setFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const [exportStatus, setExportStatus] = useState(null) // 'generating', 'success', 'error'
  
  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  
  // Search state
  const [searchTerm, setSearchTerm] = useState("")
  const [searchType, setSearchType] = useState("emergency_type") // Default search by emergency type

  useEffect(() => {
    fetchIncidentHistory()
  }, [filter, retryCount, pagination.page, pagination.limit])

  const fetchIncidentHistory = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      console.log('Fetching incident history from /emergencies/history/')
      
      // Build query parameters
      const params = new URLSearchParams()
      params.append('limit', pagination.limit.toString())
      params.append('offset', ((pagination.page - 1) * pagination.limit).toString())
      
      // Use your correct endpoint with pagination
      const endpoint = `/emergencies/history/?${params.toString()}`
      const response = await apiClient.get(endpoint)
      
      console.log('Raw API response:', response)
      
      // Handle different response formats with pagination
      let incidentsData = []
      let totalCount = 0
      
      if (Array.isArray(response)) {
        // If response is directly an array (no pagination)
        incidentsData = response
        totalCount = response.length
      } else if (response && Array.isArray(response.data)) {
        // If response has data property with array
        incidentsData = response.data
        totalCount = response.count || response.data.length
      } else if (response && response.results) {
        // If response has results property (Django pagination)
        incidentsData = response.results
        totalCount = response.count || response.results.length
      } else if (response && Array.isArray(response)) {
        // Fallback
        incidentsData = response
        totalCount = response.length
      }
      
      console.log('Processed incidents data:', incidentsData)
      
      // Transform backend data to match frontend expectations
      const transformedData = incidentsData.map(incident => ({
        id: incident.id || incident.alert_id,
        alert_id: incident.alert_id,
        emergency_type: incident.emergency_type,
        description: incident.description,
        priority: incident.priority,
        status: incident.status,
        address: incident.address,
        created_at: incident.created_at,
        current_latitude: incident.current_latitude,
        current_longitude: incident.current_longitude,
        is_verified: incident.is_verified,
        user_email: incident.user_email,
        user_name: incident.user_name,
        // Handle different field names from backend
        ...incident
      }))
      
      setIncidents(transformedData)
      setPagination(prev => ({
        ...prev,
        total: totalCount,
        totalPages: Math.ceil(totalCount / prev.limit)
      }))
      
    } catch (error) {
      console.error('Failed to fetch incident history:', error)
      
      // Provide more specific error messages
      if (error.message.includes('Authentication failed')) {
        setError('Your session has expired. Please log in again.')
      } else if (error.message.includes('Permission denied')) {
        setError('You do not have permission to view incident history. Please contact administrator.')
      } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
        setError('Network error. Please check your connection and try again.')
      } else {
        setError(error.message || 'Failed to load incident history. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Filter incidents based on search term and type
  const getFilteredIncidents = () => {
    let filtered = incidents
    
    // Apply status filter
    if (filter !== "all") {
      filtered = filtered.filter(incident => {
        const status = incident.status?.toLowerCase()
        if (filter === 'in_progress') {
          return ['dispatched', 'en_route', 'hospital_selected', 'verified'].includes(status)
        }
        return status === filter
      })
    }
    
    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(incident => {
        const searchLower = searchTerm.toLowerCase().trim()
        
        switch (searchType) {
          case "emergency_type":
            return incident.emergency_type?.toLowerCase().includes(searchLower)
          case "alert_id":
            return incident.alert_id?.toLowerCase().includes(searchLower)
          case "address":
            return incident.address?.toLowerCase().includes(searchLower)
          case "priority":
            return incident.priority?.toLowerCase().includes(searchLower)
          case "status":
            return incident.status?.toLowerCase().includes(searchLower)
          default:
            return (
              incident.emergency_type?.toLowerCase().includes(searchLower) ||
              incident.alert_id?.toLowerCase().includes(searchLower) ||
              incident.address?.toLowerCase().includes(searchLower) ||
              incident.priority?.toLowerCase().includes(searchLower) ||
              incident.status?.toLowerCase().includes(searchLower)
            )
        }
      })
    }
    
    return filtered
  }

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase()
    switch (statusLower) {
      case "completed": 
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled": 
      case "canceled":
        return "bg-red-100 text-red-800 border-red-200"
      case "in_progress":
      case "dispatched":
      case "en_route":
      case "hospital_selected":
      case "active":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "verified":
      case "pending":
      case "new":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "arrived":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default: 
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusDisplayText = (status) => {
    if (!status) return 'UNKNOWN'
    
    const statusMap = {
      'pending': 'PENDING',
      'verified': 'VERIFIED', 
      'dispatched': 'DISPATCHED',
      'hospital_selected': 'HOSPITAL SELECTED',
      'en_route': 'EN ROUTE',
      'arrived': 'ARRIVED AT HOSPITAL',
      'completed': 'COMPLETED',
      'resolved': 'RESOLVED',
      'cancelled': 'CANCELLED',
      'canceled': 'CANCELLED',
      'expired': 'EXPIRED',
      'in_progress': 'IN PROGRESS',
      'active': 'ACTIVE',
      'new': 'NEW'
    }
    
    return statusMap[status.toLowerCase()] || status.replace(/_/g, ' ').toUpperCase()
  }

  const getPriorityColor = (priority) => {
    if (!priority) return "bg-gray-100 text-gray-800 border-gray-200"
    
    const priorityLower = priority.toLowerCase()
    switch (priorityLower) {
      case "critical": return "bg-red-100 text-red-800 border-red-200"
      case "high": return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low": return "bg-green-100 text-green-800 border-green-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
    setError(null)
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }))
    }
  }

  const handleLimitChange = (newLimit) => {
    setPagination(prev => ({ 
      ...prev, 
      limit: parseInt(newLimit),
      page: 1 // Reset to first page when changing limit
    }))
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // Reset to first page when searching
    setPagination(prev => ({ ...prev, page: 1 }))
    // The filtering happens in getFilteredIncidents()
  }

  const handleClearSearch = () => {
    setSearchTerm("")
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const generateReportSummary = () => {
    const filteredIncidents = getFilteredIncidents()
    const totalIncidents = filteredIncidents.length
    const completedCount = filteredIncidents.filter(i => i.status === 'completed').length
    const highPriorityCount = filteredIncidents.filter(i => i.priority === 'high' || i.priority === 'critical').length
    const emergencyTypes = [...new Set(filteredIncidents.map(i => i.emergency_type))].length
    
    // Calculate date range
    const dates = filteredIncidents.map(i => new Date(i.created_at)).sort((a, b) => a - b)
    const dateRange = dates.length > 0 
      ? `${dates[0].toLocaleDateString()} - ${dates[dates.length - 1].toLocaleDateString()}`
      : 'No data available'

    return {
      totalIncidents,
      completedCount,
      highPriorityCount,
      emergencyTypes,
      dateRange,
      generatedAt: new Date().toLocaleString(),
      appliedFilters: {
        search: searchTerm || 'None',
        status: filter !== 'all' ? filter : 'All',
        searchType: searchType.replace('_', ' ')
      }
    }
  }

  const handleExportReport = async () => {
    if (incidents.length === 0) {
      setExportStatus('error')
      setTimeout(() => setExportStatus(null), 3000)
      return
    }

    try {
      setExportStatus('generating')
      
      const filteredIncidents = getFilteredIncidents()
      const summary = generateReportSummary()
      
      // Create CSV content
      const headers = ['Alert ID', 'Emergency Type', 'Priority', 'Status', 'Address', 'Created At', 'Description', 'Patient Name']
      const csvData = filteredIncidents.map(incident => [
        incident.alert_id || 'N/A',
        incident.emergency_type || 'N/A',
        incident.priority || 'N/A',
        incident.status || 'N/A',
        incident.address || 'N/A',
        new Date(incident.created_at).toLocaleString(),
        `"${(incident.description || '').replace(/"/g, '""')}"`, // Escape quotes for CSV
        incident.user_name || 'N/A'
      ])
      
      // Add summary section to CSV
      const summarySection = [
        [],
        ['EMERGENCY INCIDENTS REPORT SUMMARY'],
        ['Generated At:', summary.generatedAt],
        ['Date Range:', summary.dateRange],
        ['Applied Filters - Search:', summary.appliedFilters.search],
        ['Applied Filters - Status:', summary.appliedFilters.status],
        ['Applied Filters - Search Type:', summary.appliedFilters.searchType],
        [],
        ['STATISTICS'],
        ['Total Incidents:', summary.totalIncidents],
        ['Completed Incidents:', summary.completedCount],
        ['High Priority Incidents:', summary.highPriorityCount],
        ['Emergency Types:', summary.emergencyTypes],
        [],
        ['DETAILED INCIDENTS'],
        headers
      ]
      
      const csvContent = [
        ...summarySection.map(row => row.join(',')),
        ...csvData.map(row => row.join(','))
      ].join('\n')
      
      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `emergency-incidents-report-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      setExportStatus('success')
      setTimeout(() => setExportStatus(null), 3000)
      
    } catch (error) {
      console.error('Export failed:', error)
      setExportStatus('error')
      setTimeout(() => setExportStatus(null), 3000)
    }
  }

  const handleViewDetails = (incidentId) => {
    // Disabled - under development
    console.log('View details feature is under development for incident:', incidentId)
  }

  const UnderDevelopmentOverlay = ({ children, featureName }) => {
    const [showOverlay, setShowOverlay] = useState(false)

    return (
      <div 
        className="relative inline-block"
        onMouseEnter={() => setShowOverlay(true)}
        onMouseLeave={() => setShowOverlay(false)}
      >
        {/* Main button/component */}
        <div className="opacity-50 cursor-not-allowed">
          {children}
        </div>
        
        {/* Under Development Overlay */}
        {showOverlay && (
          <div className="absolute inset-0 z-50 flex items-center justify-center">
            <div className="bg-white/95 backdrop-blur-sm border-2 border-[#8B0000] rounded-lg p-3 shadow-lg transform -translate-y-1">
              <div className="flex items-center gap-2 text-[#8B0000] font-semibold text-sm whitespace-nowrap">
                <AlertCircle className="w-4 h-4" />
                {featureName} - Under Development
              </div>
              {/* Arrow pointing to the button */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-3">
                <div className="w-3 h-3 bg-white border-r-2 border-b-2 border-[#8B0000] transform rotate-45"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  const ExportStatusMessage = () => {
    if (!exportStatus) return null

    const statusConfig = {
      generating: {
        icon: Clock,
        message: 'Generating report...',
        description: 'Preparing your emergency incidents report',
        color: 'text-blue-600 bg-blue-50 border-blue-200'
      },
      success: {
        icon: CheckCircle,
        message: 'Report Downloaded!',
        description: 'Your emergency incidents report has been downloaded successfully',
        color: 'text-green-600 bg-green-50 border-green-200'
      },
      error: {
        icon: AlertCircle,
        message: 'Export Failed',
        description: 'No incidents available to export. Please check your data.',
        color: 'text-red-600 bg-red-50 border-red-200'
      }
    }

    const config = statusConfig[exportStatus]
    const IconComponent = config.icon

    return (
      <div className={`fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg border-2 ${config.color} shadow-lg animate-fade-in`}>
        <div className="flex items-start gap-3">
          <IconComponent className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm mb-1">{config.message}</h4>
            <p className="text-xs opacity-90 leading-relaxed">{config.description}</p>
          </div>
        </div>
      </div>
    )
  }

  const filteredIncidents = getFilteredIncidents()
  const displayIncidents = filteredIncidents

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#fff3ea] via-[#fff3ea] to-[#ffe6c5]">
        <Sidebar />
        <main className="lg:ml-64">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-[#b90000] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#740000]">Loading history...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff3ea] via-[#fff3ea] to-[#ffe6c5]">
      <Sidebar />
      <ExportStatusMessage />
      
      <main className="lg:ml-64 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1a0000] mb-2">Incident History</h1>
            <p className="text-[#740000]">Review your past emergency responses and assessments</p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="text-red-800">
                    <p className="font-medium">Error loading history</p>
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 bg-[#b90000] hover:bg-[#740000] text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Search and Filters */}
          <div className="bg-white border border-[#ffe6c5] rounded-lg p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
              {/* Search Section */}
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="flex gap-2 flex-1">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#740000] w-4 h-4" />
                    <input
                      type="text"
                      placeholder={`Search by ${searchType.replace('_', ' ')}...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white border border-[#ffe6c5] rounded-lg text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                    />
                    {searchTerm && (
                      <button
                        onClick={handleClearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#740000] hover:text-[#b90000]"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="px-3 py-2 bg-white border border-[#ffe6c5] rounded-lg text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                  >
                    <option value="emergency_type">Emergency Type</option>
                    <option value="alert_id">Alert ID</option>
                    <option value="address">Address</option>
                    <option value="priority">Priority</option>
                    <option value="status">Status</option>
                    <option value="all">All Fields</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#740000]" />
                  <span className="text-sm font-medium text-[#1a0000] whitespace-nowrap">Status:</span>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-3 py-2 bg-white border border-[#ffe6c5] rounded-lg text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent"
                  >
                    <option value="all">All Incidents</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="in_progress">In Progress</option>
                    <option value="dispatched">Dispatched</option>
                    <option value="verified">Verified</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              {/* Export Button */}
              <button 
                onClick={handleExportReport}
                disabled={incidents.length === 0 || exportStatus === 'generating'}
                className="px-4 py-2 border border-[#740000] text-[#740000] hover:bg-[#ffe6c5] rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {exportStatus === 'generating' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#740000] border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Export Report
                  </>
                )}
              </button>
            </div>

            {/* Search Results Info */}
            {searchTerm && (
              <div className="mt-3 pt-3 border-t border-[#ffe6c5]">
                <p className="text-sm text-[#740000]">
                  Found {displayIncidents.length} incidents matching "{searchTerm}" in {searchType.replace('_', ' ')}
                  {displayIncidents.length > 0 && (
                    <button
                      onClick={handleClearSearch}
                      className="ml-2 text-[#b90000] hover:underline"
                    >
                      Clear search
                    </button>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Incident List */}
          <div className="grid gap-6">
            {displayIncidents.length === 0 ? (
              <div className="text-center py-12">
                <History className="w-16 h-16 text-[#740000]/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#1a0000] mb-2">
                  {searchTerm ? 'No Matching Incidents Found' : 'No History Found'}
                </h3>
                <p className="text-[#740000] mb-6">
                  {searchTerm 
                    ? `No incidents found matching "${searchTerm}" in ${searchType.replace('_', ' ')}.`
                    : filter === "all" 
                      ? "You haven't responded to any emergencies yet." 
                      : `No ${filter.replace('_', ' ')} incidents found.`
                  }
                </p>
                {searchTerm && (
                  <button
                    onClick={handleClearSearch}
                    className="px-6 py-3 bg-[#b90000] hover:bg-[#740000] text-white rounded-lg font-medium mr-4"
                  >
                    Clear Search
                  </button>
                )}
                <Link
                  to="/dashboard/first-aider/assignments"
                  className="px-6 py-3 border border-[#b90000] text-[#b90000] hover:bg-[#ffe6c5] rounded-lg font-medium transition-colors"
                >
                  View Active Assignments
                </Link>
              </div>
            ) : (
              displayIncidents.map((incident) => (
                <div key={incident.id} className="bg-white border border-[#ffe6c5] rounded-lg p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-[#fff3ea] rounded-lg">
                        <History className="w-6 h-6 text-[#b90000]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[#1a0000] mb-1">
                          {incident.emergency_type?.replace(/_/g, ' ').toUpperCase() || 'EMERGENCY'}
                        </h3>
                        <p className="text-[#740000] mb-2">{incident.address || 'Location not specified'}</p>
                        <div className="flex items-center gap-4 text-sm text-[#740000]">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(incident.created_at).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span>{new Date(incident.created_at).toLocaleTimeString()}</span>
                          {incident.user_name && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {incident.user_name}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(incident.status)}`}>
                        {getStatusDisplayText(incident.status)}
                      </span>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(incident.priority)}`}>
                          {incident.priority?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {incident.description && (
                    <div className="mb-4 p-3 bg-[#fff3ea] rounded-lg">
                      <p className="text-[#1a0000] text-sm">{incident.description}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-[#ffe6c5]">
                    <div className="text-sm text-[#740000]">
                      Incident ID: {incident.alert_id || incident.id}
                      {incident.is_verified && (
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <UnderDevelopmentOverlay featureName="View Details">
                        <button 
                          onClick={() => handleViewDetails(incident.id)}
                          className="px-4 py-2 border border-[#740000] text-[#740000] rounded-lg font-medium flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                      </UnderDevelopmentOverlay>
                      
                      <UnderDevelopmentOverlay featureName="Download Report">
                        <button className="px-4 py-2 bg-[#1a0000] text-white rounded-lg font-medium">
                          Download Report
                        </button>
                      </UnderDevelopmentOverlay>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination Controls */}
          {displayIncidents.length > 0 && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-[#740000]">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} incidents
                </span>
                <select
                  value={pagination.limit}
                  onChange={(e) => handleLimitChange(e.target.value)}
                  className="px-3 py-1 bg-white border border-[#ffe6c5] rounded-lg text-[#1a0000] focus:outline-none focus:ring-2 focus:ring-[#b90000] focus:border-transparent text-sm"
                >
                  <option value="5">5 per page</option>
                  <option value="10">10 per page</option>
                  <option value="25">25 per page</option>
                  <option value="50">50 per page</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="p-2 border border-[#ffe6c5] rounded-lg hover:bg-[#fff3ea] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 text-[#740000]" />
                </button>
                
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1
                    } else if (pagination.page >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i
                    } else {
                      pageNum = pagination.page - 2 + i
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium ${
                          pagination.page === pageNum
                            ? 'bg-[#b90000] text-white'
                            : 'border border-[#ffe6c5] text-[#740000] hover:bg-[#fff3ea]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="p-2 border border-[#ffe6c5] rounded-lg hover:bg-[#fff3ea] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4 text-[#740000]" />
                </button>
              </div>
            </div>
          )}

          {/* Statistics */}
          {displayIncidents.length > 0 && (
            <div className="mt-8 grid md:grid-cols-4 gap-4">
              <div className="bg-white border border-[#ffe6c5] rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-[#1a0000]">{pagination.total}</div>
                <div className="text-sm text-[#740000]">Total Incidents</div>
              </div>
              <div className="bg-white border border-[#ffe6c5] rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {incidents.filter(i => i.status === 'completed').length}
                </div>
                <div className="text-sm text-[#740000]">Completed</div>
              </div>
              <div className="bg-white border border-[#ffe6c5] rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-[#b90000]">
                  {incidents.filter(i => i.priority === 'high' || i.priority === 'critical').length}
                </div>
                <div className="text-sm text-[#740000]">High Priority</div>
              </div>
              <div className="bg-white border border-[#ffe6c5] rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-[#1a0000]">
                  {new Set(incidents.map(i => i.emergency_type)).size}
                </div>
                <div className="text-sm text-[#740000]">Emergency Types</div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}