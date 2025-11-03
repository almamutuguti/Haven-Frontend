"use client"

import { Sidebar } from "../SideBar"
import { Users, AlertCircle, Clock, TrendingUp, Plus, MapPin, Phone, Activity } from "lucide-react"
import { useState } from "react"

export default function HospitalStaffDashboard() {
  const [patients, setPatients] = useState([
    {
      id: "P001",
      name: "John Doe",
      age: 45,
      condition: "Trauma",
      status: "stable",
      admittedAt: "2 hours ago",
    },
    {
      id: "P002",
      name: "Jane Smith",
      age: 32,
      condition: "Burn",
      status: "critical",
      admittedAt: "30 mins ago",
    },
    {
      id: "P003",
      name: "Mike Johnson",
      age: 58,
      condition: "Cardiac",
      status: "recovering",
      admittedAt: "4 hours ago",
    },
  ])

  const [incidents, setIncidents] = useState([
    {
      id: "1",
      location: "Downtown - 5th & Main",
      type: "Multi-vehicle collision",
      responders: 12,
      status: "active",
      reportedAt: "15 mins ago",
    },
    {
      id: "2",
      location: "Central Park",
      type: "Hiking accident",
      responders: 5,
      status: "resolved",
      reportedAt: "2 hours ago",
    },
  ])

  const getStatusColor = (status) => {
    switch (status) {
      case "critical":
        return "bg-[#b90000]/10 text-[#b90000] border-[#b90000]/20"
      case "stable":
        return "bg-[#1a0000]/10 text-[#1a0000] border-[#1a0000]/20"
      case "recovering":
        return "bg-[#740000]/10 text-[#740000] border-[#740000]/20"
      case "active":
        return "bg-[#b90000]/10 text-[#b90000] border-[#b90000]/20"
      case "resolved":
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
          <h1 className="text-4xl font-bold text-[#1a0000] mb-2">Hospital Staff Dashboard</h1>
          <p className="text-[#740000]">Manage patients and coordinate with emergency responders</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#740000] mb-1">Active Patients</p>
                <p className="text-3xl font-bold text-[#1a0000]">{patients.length}</p>
              </div>
              <Users className="w-12 h-12 text-[#b90000]/20" />
            </div>
          </div>
          <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#740000] mb-1">Critical Cases</p>
                <p className="text-3xl font-bold text-[#b90000]">
                  {patients.filter((p) => p.status === "critical").length}
                </p>
              </div>
              <AlertCircle className="w-12 h-12 text-[#b90000]/20" />
            </div>
          </div>
          <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#740000] mb-1">Active Incidents</p>
                <p className="text-3xl font-bold text-[#1a0000]">
                  {incidents.filter((i) => i.status === "active").length}
                </p>
              </div>
              <Activity className="w-12 h-12 text-[#740000]/20" />
            </div>
          </div>
          <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#740000] mb-1">Recovery Rate</p>
                <p className="text-3xl font-bold text-[#1a0000]">94%</p>
              </div>
              <TrendingUp className="w-12 h-12 text-[#b90000]/20" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Patients Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg">
              <div className="flex flex-row items-center justify-between p-6 border-b border-[#ffe6c5]">
                <div>
                  <h3 className="text-2xl font-bold text-[#1a0000]">Current Patients</h3>
                  <p className="text-[#740000]">Patients currently admitted to the hospital</p>
                </div>
                <button className="px-4 py-2 bg-[#b90000] hover:bg-[#740000] text-[#fff3ea] rounded-lg font-medium text-sm transition-colors">
                  <Plus className="w-4 h-4 mr-2 inline" />
                  Add Patient
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {patients.map((patient) => (
                    <div
                      key={patient.id}
                      className="border border-[#ffe6c5] rounded-lg p-4 hover:border-[#b90000] transition"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-[#1a0000]">{patient.name}</h3>
                          <p className="text-sm text-[#740000]">{patient.age} years old</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(patient.status)}`}
                        >
                          {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#740000]">Condition: {patient.condition}</span>
                        <span className="text-[#740000]">Admitted {patient.admittedAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Incidents & Actions Section */}
          <div className="space-y-6">
            {/* Incidents Section */}
            <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg">
              <div className="p-6 border-b border-[#ffe6c5]">
                <h3 className="text-2xl font-bold text-[#1a0000]">Active Incidents</h3>
                <p className="text-[#740000]">Ongoing emergency responses</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {incidents.map((incident) => (
                    <div
                      key={incident.id}
                      className="border border-[#ffe6c5] rounded-lg p-4 hover:border-[#b90000] transition"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <MapPin className="w-5 h-5 text-[#b90000] flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-[#1a0000] text-sm">{incident.location}</h4>
                          <p className="text-xs text-[#740000]">{incident.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#740000]">{incident.responders} responders</span>
                        <span className={`px-2 py-1 rounded-full font-medium ${getStatusColor(incident.status)}`}>
                          {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-xs text-[#740000] mt-2">{incident.reportedAt}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg">
              <div className="p-6 border-b border-[#ffe6c5]">
                <h3 className="text-xl font-bold text-[#1a0000]">Quick Actions</h3>
              </div>
              <div className="p-6 space-y-2">
                <button className="w-full text-left px-3 py-2 border border-[#ffe6c5] text-[#1a0000] hover:bg-[#ffe6c5] rounded transition-colors flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Call First-Aider
                </button>
                <button className="w-full text-left px-3 py-2 border border-[#ffe6c5] text-[#1a0000] hover:bg-[#ffe6c5] rounded transition-colors flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Report Emergency
                </button>
                <button className="w-full text-left px-3 py-2 border border-[#ffe6c5] text-[#1a0000] hover:bg-[#ffe6c5] rounded transition-colors flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  View Team
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}