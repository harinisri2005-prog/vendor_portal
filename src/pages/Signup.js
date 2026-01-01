import "../styles/auth.css";
import { useState } from "react";
import { signupVendor } from "../api/authApi";
import { useNavigate, Link } from "react-router-dom";
import { locations } from "../data/locations";

const REQUIRED_KYC = ["AADHAAR", "PAN", "GST"];

const KYC_LABELS = {
  AADHAAR: "Aadhaar Card",
  PAN: "PAN Card",
  GST: "GST Certificate",
  TRADE_LICENSE: "Trade License"
};

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    shopName: "",
    ownerName: "",
    email: "",
    phone: "",
    state: "",
    city: "",
    pincode: "",
    address: "",
    password: "",
    confirmPassword: ""
  });

  // { AADHAAR: File, PAN: File, GST: File, TRADE_LICENSE?: File }
  const [kycDocs, setKycDocs] = useState({});
  const [selectedKycType, setSelectedKycType] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------------- FORM CHANGE ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "state") {
      setForm({ ...form, state: value, city: "" });
      return;
    }

    if (name === "phone" && !/^\d{0,10}$/.test(value)) return;
    if (name === "pincode" && !/^\d{0,6}$/.test(value)) return;

    setForm({ ...form, [name]: value });
  };

  // ---------------- KYC UPLOAD ----------------
  const handleKycUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !selectedKycType) return;

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      setError("KYC must be PDF, JPG, or PNG");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("KYC file size must be under 5MB");
      return;
    }

    setError("");

    setKycDocs((prev) => ({
      ...prev,
      [selectedKycType]: file
    }));
  };

  // ---------------- SUBMIT ----------------
  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.phone.length !== 10) {
      setError("Phone number must be exactly 10 digits");
      return;
    }

    if (form.pincode.length !== 6) {
      setError("Pincode must be exactly 6 digits");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // ---- REQUIRED KYC CHECK ----
    const missingDocs = REQUIRED_KYC.filter(
      (doc) => !kycDocs[doc]
    );

    if (missingDocs.length > 0) {
      setError(
        `Please upload mandatory documents: ${missingDocs
          .map((d) => KYC_LABELS[d])
          .join(", ")}`
      );
      return;
    }

    // Backend not ready → we stop here logically
    // Later, you’ll send FormData

    console.log("FORM DATA:", form);
    console.log("KYC DOCS:", kycDocs);

    navigate("/vendor/pending-approval");
  };
  // ---------------- PREVIEW FILE ----------------
const previewFile = (file) => {
  if (!file) return;

  const fileURL = URL.createObjectURL(file);
  window.open(fileURL, "_blank");
};

// ---------------- REMOVE KYC ----------------
const removeKyc = (type) => {
  setKycDocs((prev) => {
    const updated = { ...prev };
    delete updated[type];
    return updated;
  });

  // If user removed the currently selected type, reset dropdown
  if (selectedKycType === type) {
    setSelectedKycType("");
  }
};


  return (
    <div className="auth-page">
      <form className="auth-box" onSubmit={submit}>
        <h2>Vendor Signup</h2>

        {error && <div className="error-text">{error}</div>}

        <input name="shopName" placeholder="Shop Name" value={form.shopName} onChange={handleChange} required />
        <input name="ownerName" placeholder="Owner Name" value={form.ownerName} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="phone" placeholder="Phone (10-digit)" value={form.phone} onChange={handleChange} required />

        <select disabled value="India">
          <option>India</option>
        </select>

        <select name="state" value={form.state} onChange={handleChange} required>
          <option value="">Select State</option>
          {Object.keys(locations).map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>

        <select name="city" value={form.city} onChange={handleChange} disabled={!form.state} required>
          <option value="">
            {form.state ? "Select District" : "Select State first"}
          </option>
          {(locations[form.state] || []).map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} required />
        <textarea name="address" placeholder="Full Address" value={form.address} onChange={handleChange} required />

        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} required />

        {/* -------- KYC SECTION -------- */}
        <select
          value={selectedKycType}
          onChange={(e) => setSelectedKycType(e.target.value)}
        >
          <option value="">Select KYC Type</option>
          <option value="AADHAAR">Aadhaar Card (Required)</option>
          <option value="PAN">PAN Card (Required)</option>
          <option value="GST">GST Certificate (Required)</option>
          <option value="TRADE_LICENSE">Trade License (Optional)</option>
        </select>

        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleKycUpload}
          disabled={!selectedKycType}
        />

        {/* -------- UPLOADED DOCS WITH FILE NAMES -------- */}
        {Object.keys(kycDocs).length > 0 && (
  <div style={{ fontSize: "13px", color: "#aaa", marginTop: "12px" }}>
    <strong>Uploaded Documents:</strong>

    <ul style={{ marginTop: "8px", paddingLeft: "18px" }}>
      {Object.entries(kycDocs).map(([type, file]) => (
        <li
          key={type}
          style={{
            marginBottom: "8px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap"
          }}
        >
          {/* Document label */}
          <span style={{ color: "#d4af37" }}>
            {KYC_LABELS[type]} →
          </span>

          {/* Clickable file name (PREVIEW) */}
          <span
            onClick={() => previewFile(file)}
            style={{
              color: "#000",
              cursor: "pointer",
              textDecoration: "underline"
            }}
            title="Click to preview"
          >
            {file.name}
          </span>

          {/* Remove (✕) */}
          <span
            onClick={() => removeKyc(type)}
            title="Remove document"
            style={{
              color: "#ff6b6b",
              cursor: "pointer",
              fontWeight: "bold",
              marginLeft: "6px"
            }}
          >
            ✕
          </span>
        </li>
      ))}
    </ul>
  </div>
)}


        <button disabled={loading}>
          {loading ? "Please wait..." : "Register"}
        </button>

        <div className="auth-link">
          Already registered? <Link to="/vendor/login">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
