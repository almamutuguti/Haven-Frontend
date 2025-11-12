"use client"
import { useState, useEffect } from "react"
import { Sidebar } from "../../SideBar"
import { Activity, Download, FileText, BarChart3, Users, AlertCircle, Clock } from "lucide-react"
import { apiClient } from "../../../utils/api"
import { useAuth } from "../../context/AuthContext"

export default function Reports() {
    const [reports, setReports] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [stats, setStats] = useState({
        totalIncidents: 0,
        completedIncidents: 0,
        averageResponseTime: 0,
        criticalCases: 0
    })
    const { user } = useAuth()

    // Fetch reports data
    const fetchReports = async () => {
        try {
            setIsLoading(true)
            
            // Fetch emergency history for reporting
            const incidentsResponse = await apiClient.get('/emergencies/history/')
            const incidents = incidentsResponse.data || []

            // Filter incidents for current hospital
            const hospitalIncidents = incidents.filter(incident => 
                incident.hospital_id === user?.hospital?.id || 
                incident.hospital?.id === user?.hospital?.id
            )

            // Calculate stats
            const totalIncidents = hospitalIncidents.length
            const completedIncidents = hospitalIncidents.filter(i => 
                i.status === 'completed' || i.status === 'resolved'
            ).length
            const criticalCases = hospitalIncidents.filter(i => 
                i.priority === 'critical' || i.priority === 'high'
            ).length

            // Calculate average response time (mock data for now)
            const averageResponseTime = 15 // minutes

            setStats({
                totalIncidents,
                completedIncidents,
                averageResponseTime,
                criticalCases
            })

            // Generate report data
            const reportData = [
                {
                    id: 1,
                    title: "Monthly Emergency Summary",
                    type: "summary",
                    period: "Last 30 days",
                    generatedAt: new Date().toLocaleDateString(),
                    data: {
                        totalIncidents,
                        completedIncidents,
                        criticalCases,
                        averageResponseTime
                    }
                },
                {
                    id: 2,
                    title: "Response Time Analysis",
                    type: "analysis",
                    period: "Last 30 days",
                    generatedAt: new Date().toLocaleDateString(),
                    data: {
                        averageResponseTime: 15,
                        bestResponseTime: 8,
                        worstResponseTime: 32
                    }
                },
                {
                    id: 3,
                    title: "Patient Outcomes Report",
                    type: "outcomes",
                    period: "Last 30 days",
                    generatedAt: new Date().toLocaleDateString(),
                    data: {
                        successfulOutcomes: completedIncidents,
                        transferredCases: 2,
                        criticalCases
                    }
                }
            ]

            setReports(reportData)
        } catch (error) {
            console.error('Failed to fetch reports:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchReports()
    }, [user])

    // Handle report download
    const handleDownload = (report) => {
        // Mock download functionality
        console.log('Downloading report:', report.title)
        alert(`Downloading ${report.title}...`)
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#fff3ea] via-[#fff3ea] to-[#ffe6c5]">
                <Sidebar />
                <main className="ml-64 px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="w-8 h-8 border-4 border-[#b90000] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-[#740000]">Loading reports...</p>
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
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-[#1a0000] mb-2">Reports & Analytics</h1>
                    <p className="text-[#740000] text-sm sm:text-base">
                        Performance metrics and analytical reports for {user?.hospital?.name || 'the hospital'}
                    </p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[#740000] mb-1">Total Incidents</p>
                                <p className="text-2xl font-bold text-[#1a0000]">{stats.totalIncidents}</p>
                            </div>
                            <Activity className="w-8 h-8 text-[#b90000]/20" />
                        </div>
                    </div>
                    <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[#740000] mb-1">Completed</p>
                                <p className="text-2xl font-bold text-green-600">{stats.completedIncidents}</p>
                            </div>
                            <Users className="w-8 h-8 text-green-600/20" />
                        </div>
                    </div>
                    <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[#740000] mb-1">Critical Cases</p>
                                <p className="text-2xl font-bold text-[#b90000]">{stats.criticalCases}</p>
                            </div>
                            <AlertCircle className="w-8 h-8 text-[#b90000]/20" />
                        </div>
                    </div>
                    <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[#740000] mb-1">Avg Response</p>
                                <p className="text-2xl font-bold text-blue-600">{stats.averageResponseTime}m</p>
                            </div>
                            <Clock className="w-8 h-8 text-blue-600/20" />
                        </div>
                    </div>
                </div>

                {/* Reports Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reports.map((report) => (
                        <div
                            key={report.id}
                            className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6 hover:border-[#b90000] transition"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-6 h-6 text-[#b90000]" />
                                    <div>
                                        <h3 className="font-semibold text-[#1a0000]">{report.title}</h3>
                                        <p className="text-xs text-[#740000]">{report.period}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDownload(report)}
                                    className="p-2 hover:bg-[#ffe6c5] rounded-lg transition-colors"
                                >
                                    <Download className="w-4 h-4 text-[#1a0000]" />
                                </button>
                            </div>

                            <div className="space-y-2 mb-4">
                                {report.type === 'summary' && (
                                    <>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#740000]">Total Incidents:</span>
                                            <span className="text-[#1a0000] font-medium">{report.data.totalIncidents}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#740000]">Completed:</span>
                                            <span className="text-[#1a0000] font-medium">{report.data.completedIncidents}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#740000]">Critical Cases:</span>
                                            <span className="text-[#1a0000] font-medium">{report.data.criticalCases}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#740000]">Avg Response:</span>
                                            <span className="text-[#1a0000] font-medium">{report.data.averageResponseTime}m</span>
                                        </div>
                                    </>
                                )}
                                {report.type === 'analysis' && (
                                    <>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#740000]">Average Response:</span>
                                            <span className="text-[#1a0000] font-medium">{report.data.averageResponseTime}m</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#740000]">Best Response:</span>
                                            <span className="text-[#1a0000] font-medium">{report.data.bestResponseTime}m</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#740000]">Worst Response:</span>
                                            <span className="text-[#1a0000] font-medium">{report.data.worstResponseTime}m</span>
                                        </div>
                                    </>
                                )}
                                {report.type === 'outcomes' && (
                                    <>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#740000]">Successful Outcomes:</span>
                                            <span className="text-[#1a0000] font-medium">{report.data.successfulOutcomes}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#740000]">Transferred Cases:</span>
                                            <span className="text-[#1a0000] font-medium">{report.data.transferredCases}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-[#740000]">Critical Cases:</span>
                                            <span className="text-[#1a0000] font-medium">{report.data.criticalCases}</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="flex items-center justify-between text-xs text-[#740000]">
                                <span>Generated: {report.generatedAt}</span>
                                <span className="capitalize">{report.type}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Additional Analytics Section */}
                <div className="mt-8 border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <BarChart3 className="w-6 h-6 text-[#b90000]" />
                        <h2 className="text-xl font-bold text-[#1a0000]">Performance Analytics</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white border border-[#ffe6c5] rounded-lg p-4">
                            <h3 className="font-semibold text-[#1a0000] mb-3">Incident Trends</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-[#740000]">This Month</span>
                                    <span className="text-[#1a0000] font-medium">{stats.totalIncidents}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#740000]">Completion Rate</span>
                                    <span className="text-[#1a0000] font-medium">
                                        {stats.totalIncidents > 0 
                                            ? Math.round((stats.completedIncidents / stats.totalIncidents) * 100) 
                                            : 0}%
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white border border-[#ffe6c5] rounded-lg p-4">
                            <h3 className="font-semibold text-[#1a0000] mb-3">Response Metrics</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-[#740000]">Avg. Response Time</span>
                                    <span className="text-[#1a0000] font-medium">{stats.averageResponseTime} minutes</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#740000]">Critical Case Rate</span>
                                    <span className="text-[#1a0000] font-medium">
                                        {stats.totalIncidents > 0 
                                            ? Math.round((stats.criticalCases / stats.totalIncidents) * 100) 
                                            : 0}%
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