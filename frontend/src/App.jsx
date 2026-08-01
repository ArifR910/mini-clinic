import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Registrations from "./pages/Registrations";
import Queues from "./pages/Queues";
import MedicalRecord from "./pages/MedicalRecord";
import PatientHistory from "./pages/PatientHistory";
import { AuthProvider } from "./context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Rute yang Membutuhkan Login */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients"
            element={
              <ProtectedRoute>
                <Patients />
              </ProtectedRoute>
            }
          />
          <Route
            path="/registrations"
            element={
              <ProtectedRoute>
                <Registrations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/queues"
            element={
              <ProtectedRoute>
                <Queues />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medical-records/new/:queueId"
            element={
              <ProtectedRoute>
                <MedicalRecord />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medical-records"
            element={
              <ProtectedRoute>
                <PatientHistory />
              </ProtectedRoute>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
