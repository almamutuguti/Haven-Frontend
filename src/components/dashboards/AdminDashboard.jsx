import { Sidebar } from "../components/Sidebar"
import { Users, Activity, TrendingUp, AlertTriangle } from "lucide-react"

export default function AdminDashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 flex-1 bg-haven-light min-h-screen">
        {/* Header */}
        <div className="bg-white shadow-lg p-6 border-b-4 border-haven-bright">
          <h1 className="text-3xl font-bold text-haven-darkest">Administrator Dashboard</h1>
          <p className="text-haven-dark mt-2">System monitoring and user management</p>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* System Metrics */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-haven-bright">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-haven-dark text-sm">Total Users</p>
                  <p className="text-3xl font-bold text-haven-darkest">156</p>
                </div>
                <Users className="text-haven-bright" size={32} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-haven-bright">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-haven-dark text-sm">Active Incidents</p>
                  <p className="text-3xl font-bold text-haven-darkest">12</p>
                </div>
                <AlertTriangle className="text-haven-bright" size={32} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-haven-bright">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-haven-dark text-sm">System Uptime</p>
                  <p className="text-3xl font-bold text-haven-darkest">99.8%</p>
                </div>
                <Activity className="text-haven-bright" size={32} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-haven-bright">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-haven-dark text-sm">Response Rate</p>
                  <p className="text-3xl font-bold text-haven-darkest">96%</p>
                </div>
                <TrendingUp className="text-haven-bright" size={32} />
              </div>
            </div>
          </div>

          {/* User Management */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-haven-darkest mb-4">User Management</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="border-l-4 border-haven-bright pl-4">
                <p className="text-haven-dark text-sm">Hospital Staff</p>
                <p className="text-3xl font-bold text-haven-darkest">45</p>
                <p className="text-sm text-green-600">12 active now</p>
              </div>
              <div className="border-l-4 border-haven-bright pl-4">
                <p className="text-haven-dark text-sm">First-Aiders</p>
                <p className="text-3xl font-bold text-haven-darkest">89</p>
                <p className="text-sm text-green-600">34 active now</p>
              </div>
              <div className="border-l-4 border-haven-bright pl-4">
                <p className="text-haven-dark text-sm">Administrators</p>
                <p className="text-3xl font-bold text-haven-darkest">22</p>
                <p className="text-sm text-green-600">8 active now</p>
              </div>
            </div>
          </div>

          {/* Recent Incidents */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-haven-darkest mb-4">Recent Incidents</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-haven-bright">
                    <th className="text-left py-3 px-4 text-haven-darkest font-semibold">Incident ID</th>
                    <th className="text-left py-3 px-4 text-haven-darkest font-semibold">Type</th>
                    <th className="text-left py-3 px-4 text-haven-darkest font-semibold">Response Time</th>
                    <th className="text-left py-3 px-4 text-haven-darkest font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: "INC001", type: "Traffic Accident", time: "4.2 min", status: "Resolved" },
                    { id: "INC002", type: "Medical Emergency", time: "3.8 min", status: "In Progress" },
                    { id: "INC003", type: "Fire Response", time: "5.1 min", status: "Resolved" },
                  ].map((incident) => (
                    <tr key={incident.id} className="border-b border-haven-cream hover:bg-haven-light transition">
                      <td className="py-3 px-4 text-haven-darkest">{incident.id}</td>
                      <td className="py-3 px-4 text-haven-darkest">{incident.type}</td>
                      <td className="py-3 px-4 text-haven-dark">{incident.time}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            incident.status === "Resolved" ? "bg-green-500 text-white" : "bg-blue-500 text-white"
                          }`}
                        >
                          {incident.status}
                        </span>
                      </td>
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
// This code defines an AdminDashboard component for a web application, featuring system metrics, user management, and recent incidents.
// It includes a sidebar for navigation and displays key statistics like total users, active incidents, system uptime, and response rate.
// The user management section categorizes users into hospital staff, first-aiders, and administrators with their respective counts and active statuses.
// Recent incidents are listed in a table format with details such as incident ID, type, response time, and status.
// The design uses Tailwind CSS for styling, ensuring a clean and responsive layout.