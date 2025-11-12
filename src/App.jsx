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
            path="/dashboard/first_aider"
            element={
              <ProtectedRoute role="first_aider">
                <FirstAiderDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/dashboard/system_admin"
            element={
              <ProtectedRoute role="system_admin">
                <AdminDashboard />
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

          {/* Redirects */}
          <Route path="/dashboard/hospital_staff" element={<Navigate to="/dashboard/hospital-staff" replace />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App