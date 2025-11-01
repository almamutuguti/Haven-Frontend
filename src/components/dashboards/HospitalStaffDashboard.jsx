import { Sidebar } from "../SideBar"
import { Users, AlertCircle, Clock, TrendingUp } from "lucide-react"

export default function HospitalStaffDashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 flex-1 bg-haven-light min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-lg p-6 border-b-4 border-haven-bright">
          <h1 className="text-3xl font-bold text-haven-darkest">Hospital Staff Dashboard</h1>
          <p className="text-haven-dark mt-2">Manage patients and coordinate with emergency responders</p>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Metrics */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-haven-bright">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-haven-dark text-sm">Active Patients</p>
                  <p className="text-3xl font-bold text-haven-darkest">24</p>
                </div>
                <Users className="text-haven-bright" size={32} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-haven-bright">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-haven-dark text-sm">Critical Cases</p>
                  <p className="text-3xl font-bold text-haven-darkest">3</p>
                </div>
                <AlertCircle className="text-haven-bright" size={32} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-haven-bright">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-haven-dark text-sm">Avg Response Time</p>
                  <p className="text-3xl font-bold text-haven-darkest">4.2m</p>
                </div>
                <Clock className="text-haven-bright" size={32} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-haven-bright">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-haven-dark text-sm">Recovery Rate</p>
                  <p className="text-3xl font-bold text-haven-darkest">94%</p>
                </div>
                <TrendingUp className="text-haven-bright" size={32} />
              </div>
            </div>
          </div>

          {/* Patients Table */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-haven-darkest mb-4">Current Patients</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-haven-bright">
                    <th className="text-left py-3 px-4 text-haven-darkest font-semibold">Patient ID</th>
                    <th className="text-left py-3 px-4 text-haven-darkest font-semibold">Name</th>
                    <th className="text-left py-3 px-4 text-haven-darkest font-semibold">Status</th>
                    <th className="text-left py-3 px-4 text-haven-darkest font-semibold">Admission Time</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: "P001", name: "John Doe", status: "Stable", time: "2 hours ago" },
                    { id: "P002", name: "Jane Smith", status: "Critical", time: "30 mins ago" },
                    { id: "P003", name: "Mike Johnson", status: "Recovering", time: "4 hours ago" },
                  ].map((patient) => (
                    <tr key={patient.id} className="border-b border-haven-cream hover:bg-haven-light transition">
                      <td className="py-3 px-4 text-haven-darkest">{patient.id}</td>
                      <td className="py-3 px-4 text-haven-darkest">{patient.name}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            patient.status === "Critical"
                              ? "bg-haven-bright text-white"
                              : patient.status === "Stable"
                                ? "bg-green-500 text-white"
                                : "bg-blue-500 text-white"
                          }`}
                        >
                          {patient.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-haven-dark">{patient.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
