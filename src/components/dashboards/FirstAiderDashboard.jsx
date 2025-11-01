import { Sidebar } from "../SideBar"
import { Heart, Phone } from "lucide-react"

export default function FirstAiderDashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 flex-1 bg-haven-light min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-lg p-6 border-b-4 border-haven-bright">
          <h1 className="text-3xl font-bold text-haven-darkest">First-Aider Dashboard</h1>
          <p className="text-haven-dark mt-2">Manage emergency assignments and victim care</p>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Active Assignment */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 border-l-4 border-haven-bright">
            <h2 className="text-xl font-bold text-haven-darkest mb-4">Current Assignment</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-haven-dark text-sm mb-2">Incident Type</p>
                <p className="text-lg font-semibold text-haven-darkest">Traffic Accident</p>
              </div>
              <div>
                <p className="text-haven-dark text-sm mb-2">Priority</p>
                <span className="bg-haven-bright text-white px-3 py-1 rounded-full text-sm font-semibold">High</span>
              </div>
              <div>
                <p className="text-haven-dark text-sm mb-2">Location</p>
                <p className="text-lg font-semibold text-haven-darkest">Main Street & 5th Ave</p>
              </div>
              <div>
                <p className="text-haven-dark text-sm mb-2">ETA</p>
                <p className="text-lg font-semibold text-haven-darkest">3.2 km away</p>
              </div>
            </div>
          </div>

          {/* Victim Information */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-haven-darkest mb-4">Victim Information</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border-l-4 border-haven-bright pl-4">
                <p className="text-haven-dark text-sm">Heart Rate</p>
                <p className="text-2xl font-bold text-haven-darkest">92 bpm</p>
              </div>
              <div className="border-l-4 border-haven-bright pl-4">
                <p className="text-haven-dark text-sm">Blood Pressure</p>
                <p className="text-2xl font-bold text-haven-darkest">120/80</p>
              </div>
              <div className="border-l-4 border-haven-bright pl-4">
                <p className="text-haven-dark text-sm">Temperature</p>
                <p className="text-2xl font-bold text-haven-darkest">37.2°C</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-haven-darkest mb-4 flex items-center gap-2">
                <Phone className="text-haven-bright" size={24} />
                Emergency Contacts
              </h3>
              <div className="space-y-2">
                <p className="text-haven-dark">Hospital: +1 (555) 123-4567</p>
                <p className="text-haven-dark">Dispatch: +1 (555) 911-0000</p>
                <p className="text-haven-dark">Supervisor: +1 (555) 234-5678</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-haven-darkest mb-4 flex items-center gap-2">
                <Heart className="text-haven-bright" size={24} />
                Quick Guidance
              </h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 hover:bg-haven-light rounded transition">
                  CPR Instructions
                </button>
                <button className="w-full text-left px-3 py-2 hover:bg-haven-light rounded transition">
                  Wound Care
                </button>
                <button className="w-full text-left px-3 py-2 hover:bg-haven-light rounded transition">
                  Shock Management
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
