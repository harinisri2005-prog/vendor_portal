import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

const Dashboard = () => {
  const { token, status, vendor, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/vendor/login");
      return;
    }

    if (status !== "APPROVED") {
      navigate("/vendor/pending-approval");
    }
  }, [token, status, navigate]);

  return (
    <div className="dashboard-page">
      {/* ---------- HEADER ---------- */}
      <div className="dashboard-header">
        <div>
          <h2>Seller Dashboard</h2>
          <p className="shop-name">
            {vendor?.shopName || "Your Shop"}
          </p>
        </div>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      {/* ---------- STATUS CARD ---------- */}
      <div className="status-card approved">
        <h4>Account Status</h4>
        <p>✅ Approved</p>
      </div>

      {/* ---------- STATS (PLACEHOLDERS) ---------- */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>0</h3>
          <p>Total Offers</p>
        </div>

        <div className="stat-card">
          <h3>0</h3>
          <p>Active Offers</p>
        </div>

        <div className="stat-card">
          <h3>Not Purchased</h3>
          <p>Subscription</p>
        </div>
      </div>

      {/* ---------- ACTIONS ---------- */}
      <div className="actions-grid">
        <div
          className="action-card"
          onClick={() => navigate("/vendor/offers")}
        >
          Manage Offers
        </div>

        <div
          className="action-card"
          onClick={() => navigate("/pricing")}
        >
          Subscription Plans
        </div>

        <div
          className="action-card"
          onClick={() => navigate("/vendor/profile")}
        >
          Profile & KYC
        </div>

        <div
          className="action-card"
          onClick={() => navigate("/support")}
        >
          Support
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
