import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/auth.css";
import { authRequestOtp_api, verifyOtp_api } from "./apis_db";

export default function LoginFarmer({ setIsLogin }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // Step 1: Enter Email, Step 2: Enter OTP
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await authRequestOtp_api(email, "farmer");
      setStep(2); // Move to OTP verification step
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await verifyOtp_api(email, otp, "farmer");
      console.log("Login successful:", data);
      // Store tokens locally
      sessionStorage.setItem("token", data.token);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/farmer-dashboard"); // Redirect to home page
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <div className="authContainer">
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}

        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Checking..." : "Next"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOtpSubmit}>
            <div className="form-group">
              <label htmlFor="otp">Enter OTP</label>
              <p>
                We've sent an OTP to your registered email address. Please check
                your <strong>Inbox</strong>, and if you don't see it within a
                few minutes, also check your <strong>Spam</strong> or{" "}
                <strong>Promotions</strong> folder.
              </p>
              <input
                type="text"
                id="otp"
                placeholder="Enter OTP sent to your email"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
          </form>
        )}

        <p>
          Don't have an account?{" "}
          <Link onClick={() => setIsLogin(false)}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
