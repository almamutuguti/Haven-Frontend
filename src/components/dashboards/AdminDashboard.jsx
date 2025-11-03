"use client"

import { Sidebar } from "../SideBar"
import { Users, Activity, TrendingUp, AlertTriangle, Settings, Download, Filter, Clock } from "lucide-react"
import { useState } from "react"

export default function AdminDashboard() {
  const [userStats] = useState([
    { role: "Hospital Staff", total: 45, active: 42, inactive: 3 },
    { role: "First-Aiders", total: 89, active: 34, inactive: 55 },
    { role: "Administrators", total: 22, active: 8, inactive: 14 },
  ])

  const [incidentStats] = useState([
    { type: "Traffic Accident", count: 12, avgResponseTime: "4.2 min", status: "high" },
    { type: "Medical Emergency", count: 8, avgResponseTime: "3.8 min", status: "high" },
    { type: "Fire Response", count: 5, avgResponseTime: "5.1 min", status: "medium" },
    { type: "Hiking Accident", count: 3, avgResponseTime: "6.3 min", status: "medium" },
  ])

  const metrics = [
    {
      label: "Total Users",
      value: 156,
      change: "+12 this month",
      icon: <Users className="w-12 h-12 text-[#b90000]/20" />,
    },
    {
      label: "Active Incidents",
      value: 12,
      change: "-2 from yesterday",
      icon: <AlertTriangle className="w-12 h-12 text-[#b90000]/20" />,
    },
    {
      label: "System Uptime",
      value: "99.8%",
      change: "Excellent",
      icon: <Activity className="w-12 h-12 text-[#b90000]/20" />,
    },
    {
      label: "Response Rate",
      value: "96%",
      change: "+2% improvement",
      icon: <TrendingUp className="w-12 h-12 text-[#b90000]/20" />,
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "high":
        return "bg-[#b90000]/10 text-[#b90000] border-[#b90000]/20"
      case "medium":
        return "bg-[#740000]/10 text-[#740000] border-[#740000]/20"
      case "low":
        return "bg-[#1a0000]/10 text-[#1a0000] border-[#1a0000]/20"
      default:
        return "bg-[#740000]/10 text-[#740000] border-[#740000]/20"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff3ea] via-[#fff3ea] to-[#ffe6c5]">
      <Sidebar />
      
      <main className="ml-64 px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1a0000] mb-2">Administrator Dashboard</h1>
          <p className="text-[#740000]">System monitoring and user management</p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {metrics.map((metric, i) => (
            <div key={i} className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#740000] mb-1">{metric.label}</p>
                  <p className="text-3xl font-bold text-[#1a0000] mb-2">{metric.value}</p>
                  <p className="text-xs text-[#740000]">{metric.change}</p>
                </div>
                {metric.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* User Management */}
          <div className="lg:col-span-2">
            <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg">
              <div className="flex flex-row items-center justify-between p-6 border-b border-[#ffe6c5]">
                <div>
                  <h3 className="text-2xl font-bold text-[#1a0000]">User Management</h3>
                  <p className="text-[#740000]">Active users by role</p>
                </div>
                <button className="px-4 py-2 bg-[#b90000] hover:bg-[#740000] text-[#fff3ea] rounded-lg font-medium text-sm transition-colors">
                  <Download className="w-4 h-4 mr-2 inline" />
                  Export
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {userStats.map((stat, i) => (
                    <div key={i} className="border border-[#ffe6c5] rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-[#1a0000]">{stat.role}</h3>
                        <span className="text-2xl font-bold text-[#b90000]">{stat.total}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="text-[#740000]">Active</span>
                            <span className="text-[#1a0000] font-medium">{stat.active}</span>
                          </div>
                          <div className="w-full bg-[#ffe6c5] rounded-full h-2">
                            <div
                              className="bg-[#b90000] h-2 rounded-full"
                              style={{ width: `${(stat.active / stat.total) * 100}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-[#740000]">{stat.inactive} inactive</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div>
            <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg">
              <div className="p-6 border-b border-[#ffe6c5]">
                <h3 className="text-2xl font-bold text-[#1a0000]">System Health</h3>
                <p className="text-[#740000]">Current status</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#740000]">API Status</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#b90000]" />
                      <span className="text-sm font-medium text-[#1a0000]">Operational</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#740000]">Database</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#b90000]" />
                      <span className="text-sm font-medium text-[#1a0000]">Healthy</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#740000]">Real-time Service</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#b90000]" />
                      <span className="text-sm font-medium text-[#1a0000]">Connected</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#740000]">Backup Status</span>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#b90000]" />
                      <span className="text-sm font-medium text-[#1a0000]">Synced</span>
                    </div>
                  </div>
                </div>
                <div className="border-t border-[#ffe6c5] pt-4">
                  <button className="w-full px-3 py-2 border border-[#ffe6c5] text-[#1a0000] hover:bg-[#ffe6c5] rounded transition-colors flex items-center justify-center">
                    <Settings className="w-4 h-4 mr-2" />
                    System Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Incident Analytics */}
        <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg mb-8">
          <div className="flex flex-row items-center justify-between p-6 border-b border-[#ffe6c5]">
            <div>
              <h3 className="text-2xl font-bold text-[#1a0000]">Incident Analytics</h3>
              <p className="text-[#740000]">Emergency response statistics</p>
            </div>
            <button className="px-4 py-2 border border-[#ffe6c5] text-[#1a0000] hover:bg-[#ffe6c5] rounded-lg font-medium text-sm transition-colors">
              <Filter className="w-4 h-4 mr-2 inline" />
              Filter
            </button>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#ffe6c5]">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#1a0000]">Incident Type</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#1a0000]">Count</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#1a0000]">Avg Response</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#1a0000]">Priority</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-[#1a0000]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {incidentStats.map((incident, i) => (
                    <tr key={i} className="border-b border-[#ffe6c5] hover:bg-[#ffe6c5]/50 transition">
                      <td className="py-3 px-4 text-sm text-[#1a0000]">{incident.type}</td>
                      <td className="py-3 px-4 text-sm font-medium text-[#1a0000]">{incident.count}</td>
                      <td className="py-3 px-4 text-sm text-[#740000]">{incident.avgResponseTime}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(incident.status)}`}
                        >
                          {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="px-3 py-1 border border-[#ffe6c5] text-[#1a0000] hover:bg-[#ffe6c5] rounded text-sm font-medium transition-colors">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Admin Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
            <h3 className="text-xl font-bold text-[#1a0000] mb-2">User Management</h3>
            <p className="text-sm text-[#740000] mb-4">Manage user accounts and permissions</p>
            <button className="w-full px-4 py-2 bg-[#b90000] hover:bg-[#740000] text-[#fff3ea] rounded-lg font-medium transition-colors">
              Manage Users
            </button>
          </div>
          <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
            <h3 className="text-xl font-bold text-[#1a0000] mb-2">Reports & Analytics</h3>
            <p className="text-sm text-[#740000] mb-4">Generate system reports and analytics</p>
            <button className="w-full px-4 py-2 bg-[#b90000] hover:bg-[#740000] text-[#fff3ea] rounded-lg font-medium transition-colors">
              Generate Report
            </button>
          </div>
          <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
            <h3 className="text-xl font-bold text-[#1a0000] mb-2">System Configuration</h3>
            <p className="text-sm text-[#740000] mb-4">Configure system settings and integrations</p>
            <button className="w-full px-4 py-2 bg-[#b90000] hover:bg-[#740000] text-[#fff3ea] rounded-lg font-medium transition-colors">
              Configure
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}