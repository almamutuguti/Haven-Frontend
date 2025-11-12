import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./components/context/AuthContext"
import { ProtectedRoute } from "./components/ProtectedRoute"
import LandingPage from "./components/LandingPage"
import HospitalStaffDashboard from "./components/dashboards/HospitalStaffDashboard"
import FirstAiderDashboard from "./components/dashboards/FirstAiderDashboard"
import AdminDashboard from "./components/dashboards/AdminDashboard"
import CPRInstructions from "./components/dashboards/documents/CprInstructions"
import WoundCare from "./components/dashboards/documents/WoundCare"
import ShockManagement from "./components/dashboards/documents/ShockManagement"
import Patients from "./components/dashboards/hospitalstaff-pages/Patients"
import Incidents from "./components/dashboards/hospitalstaff-pages/Incidents"
import Reports from "./components/dashboards/hospitalstaff-pages/Reports"
import Settings from "./components/dashboards/hospitalstaff-pages/Settings"
import FirstAiderAssignments from "./components/dashboards/firstaider-pages/FirstAiderAssignments"
import FirstAiderVictims from "./components/dashboards/firstaider-pages/FirstAiderVictims"
import FirstAiderCommunications from "./components/dashboards/firstaider-pages/FirstAiderCommunications"
import FirstAiderGuidance from "./components/dashboards/firstaider-pages/FirstAiderGuidance"
import FirstAiderHistory from "./components/dashboards/firstaider-pages/FirstAiderHistory"
import FirstAiderSettings from "./components/dashboards/firstaider-pages/FirstAiderSettings"

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          {/* Hospital Staff Routes */}
          <Route
            path="/dashboard/hospital-staff"
            element={
              <ProtectedRoute role="hospital_staff">
                <HospitalStaffDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/hospital-staff/patients"
            element={
              <ProtectedRoute role="hospital_staff">
                <Patients />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/hospital-staff/incidents"
            element={
              <ProtectedRoute role="hospital_staff">
                <Incidents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/hospital-staff/reports"
            element={
              <ProtectedRoute role="hospital_staff">
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/hospital-staff/settings"
            element={
              <ProtectedRoute role="hospital_staff">
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* First Aider Routes */}
          <Route
            path="/dashboard/first-aider"
            element={
              <ProtectedRoute role="first_aider">
                <FirstAiderDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/first-aider/assignments"
            element={
              <ProtectedRoute role="first_aider">
                <FirstAiderAssignments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/first-aider/victims"
            element={
              <ProtectedRoute role="first_aider">
                <FirstAiderVictims />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/first-aider/communications"
            element={
              <ProtectedRoute role="first_aider">
                <FirstAiderCommunications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/first-aider/guidance"
            element={
              <ProtectedRoute role="first_aider">
                <FirstAiderGuidance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/first-aider/history"
            element={
              <ProtectedRoute role="first_aider">
                <FirstAiderHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/first-aider/settings"
            element={
              <ProtectedRoute role="first_aider">
                <FirstAiderSettings />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute role="system_admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin/users"
            element={
              <ProtectedRoute role="system_admin">
                <div className="min-h-screen bg-gradient-to-br from-[#fff3ea] via-[#fff3ea] to-[#ffe6c5] p-8">
                  <h1 className="text-3xl font-bold text-[#1a0000]">User Management</h1>
                  <p className="text-[#740000]">Admin user management page</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin/analytics"
            element={
              <ProtectedRoute role="system_admin">
                <div className="min-h-screen bg-gradient-to-br from-[#fff3ea] via-[#fff3ea] to-[#ffe6c5] p-8">
                  <h1 className="text-3xl font-bold text-[#1a0000]">Analytics</h1>
                  <p className="text-[#740000]">Admin analytics page</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin/system-health"
            element={
              <ProtectedRoute role="system_admin">
                <div className="min-h-screen bg-gradient-to-br from-[#fff3ea] via-[#fff3ea] to-[#ffe6c5] p-8">
                  <h1 className="text-3xl font-bold text-[#1a0000]">System Health</h1>
                  <p className="text-[#740000]">Admin system health page</p>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin/settings"
            element={
              <ProtectedRoute role="system_admin">
                <div className="min-h-screen bg-gradient-to-br from-[#fff3ea] via-[#fff3ea] to-[#ffe6c5] p-8">
                  <h1 className="text-3xl font-bold text-[#1a0000]">Admin Settings</h1>
                  <p className="text-[#740000]">Admin settings page</p>
                </div>
              </ProtectedRoute>
            }
          />

          {/* Guidance Pages - Accessible to all authenticated users */}
          <Route
            path="/documents/cpr"
            element={
              <ProtectedRoute>
                <CPRInstructions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/documents/wound-care"
            element={
              <ProtectedRoute>
                <WoundCare />
              </ProtectedRoute>
            }
          />
          <Route
            path="/documents/shock-management"
            element={
              <ProtectedRoute>
                <ShockManagement />
              </ProtectedRoute>
            }
          />

          {/* Redirects for consistency */}
          <Route path="/dashboard/first_aider" element={<Navigate to="/dashboard/first-aider" replace />} />
          <Route path="/dashboard/hospital_staff" element={<Navigate to="/dashboard/hospital-staff" replace />} />
          <Route path="/dashboard/system_admin" element={<Navigate to="/dashboard/admin" replace />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App