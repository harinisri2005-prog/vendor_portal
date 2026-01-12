import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import PendingApproval from "./pages/PendingApproval";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PricingPlans from "./components/PricingPlans";
import PosterUpload from "./components/PosterUpload";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Default Redirect to Login */}
          <Route path="/" element={<Navigate to="/vendor/login" />} />

          {/* Public Routes */}
          <Route path="/vendor/signup" element={<Signup />} />
          <Route path="/vendor/login" element={<Login />} />
          <Route path="/vendor/pending-approval" element={<PendingApproval />} />

          {/* Protected Routes */}
          <Route
            path="/vendor/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pricing"
            element={
              <ProtectedRoute>
                <PricingPlans />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <PosterUpload />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
