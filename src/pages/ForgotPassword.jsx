import React, { useState } from "react";
import { forgotPassword } from "../api/authApi";
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const resp = await forgotPassword(email.trim());
      setMessage(resp || "If the email exists, a message has just been sent.");
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Error while sending");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEmail("");
    setSubmitted(false);
    setMessage(null);
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-card">
        <div className="forgot-header">
          <div className="mail-icon">
            <MailOutlineIcon className="icon" />
          </div>
          <h1>Forgot password</h1>
          <p>No worries! Enter your email address and we'll send you a link to reset your password.</p>
        </div>

        {message && (
          <div className="alert success">
            <CheckCircleOutlineIcon className="alert-icon" />
            <span>{message}</span>
          </div>
        )}
        {error && (
          <div className="alert error">
            <WarningAmberIcon className="alert-icon" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="forgot-form">
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading || submitted}
              placeholder="you@example.com"
            />
          </div>

          <button 
            type="submit" 
            className="btn-send" 
            disabled={loading || submitted}
          >
            {loading ? "Sending..." : submitted ? "Email sent ✓" : "Send link"}
          </button>
        </form>

        {submitted && (
          <div className="submitted-info">
            <p>Check your email for the reset link.</p>
            <button type="button" className="btn-try-again" onClick={handleReset}>
              Try a different email
            </button>
          </div>
        )}

        <div className="forgot-footer">
          <a href="/signin">Back to sign in</a>
        </div>
      </div>
    </div>
  );
}
