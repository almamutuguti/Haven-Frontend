import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [emergencyMode, setEmergencyMode] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')

  const emergencyAlerts = [
    { id: 1, type: 'Medical', location: 'Downtown', time: '2 min ago', priority: 'high' },
    { id: 2, type: 'Fire', location: 'North District', time: '5 min ago', priority: 'high' },
    { id: 3, type: 'Security', location: 'City Center', time: '10 min ago', priority: 'medium' }
  ]

  const responseTeams = [
    { id: 1, name: 'Medical Team Alpha', status: 'Deployed', location: 'Downtown' },
    { id: 2, name: 'Fire Unit Bravo', status: 'En Route', location: 'North District' },
    { id: 3, name: 'Security Patrol', status: 'On Standby', location: 'HQ' }
  ]

  return (
    <div className={`min-h-screen transition-all duration-300 ${emergencyMode ? 'bg-red-50' : 'bg-gradient-to-br from-blue-50 to-indigo-100'} py-6 px-4`}>
      
      {/* Emergency Header */}
      <header className="max-w-7xl mx-auto mb-8">
        <div className={`rounded-2xl p-6 shadow-lg ${emergencyMode ? 'bg-emergency-red text-white' : 'bg-white text-gray-800'}`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img src={viteLogo} className="h-10 w-10" alt="Vite logo" />
                <img src={reactLogo} className="h-10 w-10" alt="React logo" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">HAVEN</h1>
                <p className="opacity-90">Emergency Response Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setEmergencyMode(!emergencyMode)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  emergencyMode 
                    ? 'bg-white text-emergency-red hover:bg-gray-100' 
                    : 'bg-emergency-red text-white hover:bg-red-700'
                }`}
              >
                {emergencyMode ? ' All Clear' : ' Emergency Mode'}
              </button>
              <div className="text-right">
                <div className="font-semibold">Control Center</div>
                <div className="text-sm opacity-80">Online & Active</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-2">
          <div className="flex space-x-2">
            {['dashboard', 'alerts', 'teams', 'map', 'resources'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-lg font-semibold capitalize transition-all ${
                  activeTab === tab 
                    ? 'bg-emergency-blue text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto">
        
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-emergency-red">
                <div className="text-2xl font-bold text-gray-800">12</div>
                <div className="text-gray-600">Active Alerts</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-emergency-blue">
                <div className="text-2xl font-bold text-gray-800">8</div>
                <div className="text-gray-600">Teams Deployed</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-emergency-orange">
                <div className="text-2xl font-bold text-gray-800">24/7</div>
                <div className="text-gray-600">Monitoring</div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-green-500">
                <div className="text-2xl font-bold text-gray-800">95%</div>
                <div className="text-gray-600">Response Rate</div>
              </div>
            </div>

            {/* Alerts and Teams Side by Side */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Recent Alerts */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Recent Emergency Alerts</h2>
                <div className="space-y-4">
                  {emergencyAlerts.map(alert => (
                    <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div>
                        <div className="font-semibold text-gray-800">{alert.type}</div>
                        <div className="text-sm text-gray-600">{alert.location}</div>
                      </div>
                      <div className="text-right">
                        <div className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          alert.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                        }`}>
                          {alert.priority}
                        </div>
                        <div className="text-sm text-gray-500">{alert.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Response Teams */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Response Teams</h2>
                <div className="space-y-4">
                  {responseTeams.map(team => (
                    <div key={team.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div>
                        <div className="font-semibold text-gray-800">{team.name}</div>
                        <div className="text-sm text-gray-600">{team.location}</div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        team.status === 'Deployed' ? 'bg-green-100 text-green-800' :
                        team.status === 'En Route' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {team.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Emergency Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Quick Actions</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <button className="p-4 border-2 border-red-200 rounded-lg hover:bg-red-50 transition-colors text-red-700 font-semibold">
                  🚨 Send Emergency Alert
                </button>
                <button className="p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-blue-700 font-semibold">
                  📍 Update Location
                </button>
                <button className="p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition-colors text-green-700 font-semibold">
                  🏥 Request Medical
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Other Tabs Placeholder */}
        {activeTab !== 'dashboard' && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} View</h2>
            <p className="text-gray-600">This section is under development</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto mt-12 text-center text-gray-500">
        <p>HAVEN Emergency Response Platform • 24/7 Monitoring • Always Ready</p>
      </footer>
    </div>
  )
}

export default App