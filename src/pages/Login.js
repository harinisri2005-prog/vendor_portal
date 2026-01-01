import "../styles/auth.css";
import { useState } from "react";
import { loginVendor } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginVendor({ email, password });
      login(res.data.token, res.data.vendorStatus);

      res.data.vendorStatus === "APPROVED"
        ? navigate("/vendor/dashboard")
        : navigate("/vendor/pending-approval");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-box" onSubmit={submit}>
        <h2>Vendor Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>

        <div className="auth-link">
          New vendor? <Link to="/vendor/signup">Sign up</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
