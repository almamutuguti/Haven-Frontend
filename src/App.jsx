import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./components/context/AuthContext"
import { ProtectedRoute } from "./components/ProtectedRoute"
import LandingPage from "./components/LandingPage"
import HospitalStaffDashboard from "./components/dashboards/HospitalStaffDashboard"
import FirstAiderDashboard from "./components/dashboards/FirstAiderDashboard"
import AdminDashboard from "./components/dashboards/AdminDashboard"

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/dashboard/hospital-staff"
            element={
              <ProtectedRoute role="hospital_staff">
                <HospitalStaffDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/first_aider"
            element={
              <ProtectedRoute role="first_aider">
                <FirstAiderDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/system_admin"
            element={
              <ProtectedRoute role="system_admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
// This code sets up the main application structure using React Router.
// It includes routes for the landing page and different dashboards for hospital staff, first-aiders, and administrators.
// The `ProtectedRoute` component ensures that only users with the appropriate roles can access their respective dashboards.
// If a user tries to access a route they are not authorized for, they will be redirected to the landing page.
// The `AuthProvider` wraps the application to provide authentication context, allowing components to access user information and authentication methods.
// The application uses a clean and responsive design, leveraging React Router for navigation and role-based access control.
// The `ProtectedRoute` component checks the user's role and redirects them if they are not authorized to view the page.
// The application is structured to be scalable, allowing for easy addition of new features and pages in the future.
// The use of React Router's `Navigate` component simplifies redirection logic, ensuring a smooth user experience.
// The application is ready for deployment, with a focus on security and user authentication.
// The code is modular, making it easy to maintain and extend as needed.
// It follows best practices for React development, ensuring a robust and efficient application structure.
// The application is designed to be user-friendly, with clear navigation and role-specific content.
// It can be easily integrated with a backend API for user authentication and data management.
// The use of React's context API allows for efficient state management across the application.
// The application is built with scalability in mind, allowing for future enhancements and features.