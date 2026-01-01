import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import PendingApproval from "./pages/PendingApproval";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* DEFAULT ROUTE */}
          <Route path="/" element={<Navigate to="/vendor/login" />} />

          <Route path="/vendor/signup" element={<Signup />} />
          <Route path="/vendor/login" element={<Login />} />
          <Route path="/vendor/pending-approval" element={<PendingApproval />} />

          <Route
            path="/vendor/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
