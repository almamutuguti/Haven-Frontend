"use client"

import { Sidebar } from "../SideBar"
import { Heart, Phone, AlertCircle, MapPin, Navigation, Radio, Clock, Plus, CheckCircle, AlertTriangle } from "lucide-react"
import { useState } from "react"

export default function FirstAiderDashboard() {
  const [assignments, setAssignments] = useState([
    {
      id: "1",
      location: "Main Street & 5th Ave",
      type: "Traffic Accident",
      priority: "high",
      status: "in-progress",
      distance: "3.2 km",
      eta: "8 mins",
    },
    {
      id: "2",
      location: "Central Park West",
      type: "Fall Injury",
      priority: "medium",
      status: "pending",
      distance: "4.5 km",
      eta: "12 mins",
    },
  ])

  const [victims, setVictims] = useState([
    {
      id: "1",
      name: "John Doe",
      condition: "Trauma - Multiple injuries",
      vitals: { heartRate: 92, bloodPressure: "120/80", temperature: 37.2 },
      location: "Main Street & 5th Ave",
      status: "critical",
    },
  ])

  const getPriorityColor = (priority) => {
    switch (priority) {
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <AlertTriangle className="w-5 h-5 text-[#740000]" />
      case "in-progress":
        return <Navigation className="w-5 h-5 text-[#b90000]" />
      case "completed":
        return <CheckCircle className="w-5 h-5 text-[#1a0000]" />
      default:
        return <AlertCircle className="w-5 h-5 text-[#740000]" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff3ea] via-[#fff3ea] to-[#ffe6c5]">
      <Sidebar />
      
      <main className="ml-64 px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1a0000] mb-2">First-Aider Dashboard</h1>
          <p className="text-[#740000]">Manage emergency assignments and victim care</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#740000] mb-1">Active Assignments</p>
                <p className="text-3xl font-bold text-[#1a0000]">
                  {assignments.filter((a) => a.status !== "completed").length}
                </p>
              </div>
              <Radio className="w-12 h-12 text-[#b90000]/20" />
            </div>
          </div>
          <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#740000] mb-1">High Priority</p>
                <p className="text-3xl font-bold text-[#b90000]">
                  {assignments.filter((a) => a.priority === "high").length}
                </p>
              </div>
              <AlertCircle className="w-12 h-12 text-[#b90000]/20" />
            </div>
          </div>
          <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#740000] mb-1">Victims Assisted</p>
                <p className="text-3xl font-bold text-[#1a0000]">{victims.length}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-[#b90000]/20" />
            </div>
          </div>
          <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#740000] mb-1">Avg Response</p>
                <p className="text-3xl font-bold text-[#1a0000]">6.5 min</p>
              </div>
              <Clock className="w-12 h-12 text-[#740000]/20" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Assignments Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg">
              <div className="flex flex-row items-center justify-between p-6 border-b border-[#ffe6c5]">
                <div>
                  <h3 className="text-2xl font-bold text-[#1a0000]">Your Assignments</h3>
                  <p className="text-[#740000]">Current and upcoming emergency calls</p>
                </div>
                <button className="px-4 py-2 bg-[#b90000] hover:bg-[#740000] text-[#fff3ea] rounded-lg font-medium text-sm transition-colors">
                  <Plus className="w-4 h-4 mr-2 inline" />
                  Report Incident
                </button>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className={`border rounded-lg p-4 hover:border-[#b90000] transition ${
                        assignment.status === "in-progress" ? "border-[#b90000] bg-[#b90000]/5" : "border-[#ffe6c5]"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="mt-1">{getStatusIcon(assignment.status)}</div>
                          <div>
                            <h3 className="font-semibold text-[#1a0000]">{assignment.type}</h3>
                            <div className="flex items-center gap-1 text-sm text-[#740000] mt-1">
                              <MapPin className="w-4 h-4" />
                              {assignment.location}
                            </div>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(assignment.priority)}`}
                        >
                          {assignment.priority.charAt(0).toUpperCase() + assignment.priority.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm pt-3 border-t border-[#ffe6c5]">
                        <div className="flex gap-4">
                          <span className="text-[#740000]">Distance: {assignment.distance}</span>
                          <span className="text-[#740000]">ETA: {assignment.eta}</span>
                        </div>
                        {assignment.status === "pending" && (
                          <button className="px-3 py-1 bg-[#b90000] hover:bg-[#740000] text-[#fff3ea] rounded text-sm font-medium transition-colors">
                            Accept
                          </button>
                        )}
                        {assignment.status === "in-progress" && (
                          <button className="px-3 py-1 border border-[#b90000] text-[#b90000] hover:bg-[#ffe6c5] rounded text-sm font-medium transition-colors">
                            Update Status
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Victims & Guidance Section */}
          <div className="space-y-6">
            {/* Victims Section */}
            <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg">
              <div className="p-6 border-b border-[#ffe6c5]">
                <h3 className="text-2xl font-bold text-[#1a0000]">Victim Information</h3>
                <p className="text-[#740000]">Current patient information</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {victims.map((victim) => (
                    <div
                      key={victim.id}
                      className={`border rounded-lg p-4 ${
                        victim.status === "critical" ? "border-[#b90000] bg-[#b90000]/5" : "border-[#ffe6c5]"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-[#1a0000]">{victim.name}</h4>
                          <p className="text-xs text-[#740000]">{victim.condition}</p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${
                            victim.status === "critical"
                              ? "bg-[#b90000]/10 text-[#b90000] border-[#b90000]/20"
                              : "bg-[#1a0000]/10 text-[#1a0000] border-[#1a0000]/20"
                          }`}
                        >
                          {victim.status.charAt(0).toUpperCase() + victim.status.slice(1)}
                        </span>
                      </div>
                      <div className="space-y-2 text-xs text-[#740000]">
                        <div className="flex justify-between">
                          <span>Heart Rate:</span>
                          <span className="text-[#1a0000] font-medium">{victim.vitals.heartRate} bpm</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Blood Pressure:</span>
                          <span className="text-[#1a0000] font-medium">{victim.vitals.bloodPressure}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Temperature:</span>
                          <span className="text-[#1a0000] font-medium">{victim.vitals.temperature}°C</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg">
              <div className="p-6 border-b border-[#ffe6c5]">
                <h3 className="text-lg font-bold text-[#1a0000] flex items-center gap-2">
                  <Phone className="text-[#b90000]" size={20} />
                  Emergency Contacts
                </h3>
              </div>
              <div className="p-6 space-y-2">
                <p className="text-[#740000]">Hospital: +1 (555) 123-4567</p>
                <p className="text-[#740000]">Dispatch: +1 (555) 911-0000</p>
                <p className="text-[#740000]">Supervisor: +1 (555) 234-5678</p>
              </div>
            </div>

            {/* Quick Guidance */}
            <div className="border border-[#ffe6c5] bg-[#fff3ea] rounded-lg">
              <div className="p-6 border-b border-[#ffe6c5]">
                <h3 className="text-lg font-bold text-[#1a0000] flex items-center gap-2">
                  <Heart className="text-[#b90000]" size={20} />
                  Quick Guidance
                </h3>
              </div>
              <div className="p-6 space-y-2">
                <button className="w-full text-left px-3 py-2 border border-[#ffe6c5] text-[#1a0000] hover:bg-[#ffe6c5] rounded transition-colors">
                  CPR Instructions
                </button>
                <button className="w-full text-left px-3 py-2 border border-[#ffe6c5] text-[#1a0000] hover:bg-[#ffe6c5] rounded transition-colors">
                  Wound Care
                </button>
                <button className="w-full text-left px-3 py-2 border border-[#ffe6c5] text-[#1a0000] hover:bg-[#ffe6c5] rounded transition-colors">
                  Shock Management
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}