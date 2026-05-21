import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { changePassword } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import "./ChangePassword.css";

/* ── password-strength helpers ─────────────────────────── */
function getStrength(pw) {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0-5
}

function strengthLabel(score) {
  if (score <= 1) return { label: "Very weak", color: "#ef4444", width: "20%" };
  if (score === 2) return { label: "Weak",      color: "#f97316", width: "40%" };
  if (score === 3) return { label: "Medium",    color: "#eab308", width: "60%" };
  if (score === 4) return { label: "Strong",    color: "#22c55e", width: "80%" };
  return           { label: "Very strong",      color: "#16a34a", width: "100%" };
}

/* ── component ──────────────────────────────────────────── */
export default function ChangePassword() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [oldPw,     setOldPw]     = useState("");
  const [newPw,     setNewPw]     = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const [show, setShow]   = useState({ old: false, new: false, confirm: false });
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [success,  setSuccess]  = useState(false);

  const strength  = useMemo(() => getStrength(newPw), [newPw]);
  const strInfo   = useMemo(() => strengthLabel(strength), [strength]);

  const requirements = [
    { label: "At least 6 characters",        met: newPw.length >= 6 },
    { label: "At least one uppercase letter", met: /[A-Z]/.test(newPw) },
    { label: "At least one digit",            met: /[0-9]/.test(newPw) },
    { label: "At least one special character", met: /[^A-Za-z0-9]/.test(newPw) },
  ];

  const isFirstLogin = !localStorage.getItem("userLoaded");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (newPw !== confirmPw) {
      setError("Passwords do not match.");
      return;
    }
    if (newPw.length < 6) {
      setError("The new password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      await changePassword(oldPw, newPw, confirmPw);
      setSuccess(true);

      // Clear session and force re-login with new password
      setTimeout(() => {
        logout();
        navigate("/signin");
      }, 1800);
    } catch (err) {
      let msg = err?.message || "An error occurred";
      try { msg = (JSON.parse(msg)).error || msg; } catch { /* not JSON */ }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const toggle = (field) => setShow((s) => ({ ...s, [field]: !s[field] }));

  return (
    <div className="cp-page">
      <div className="cp-card">
        {/* Logo */}
        <div className="cp-logo">
          <img src="/logo.png" alt="CapTalent" />
        </div>

        <h2 className="cp-title">Change password</h2>
        <p className="cp-subtitle">
          Set a new secure password for your account.
        </p>

        {isFirstLogin && (
          <div className="cp-notice">
            🔐 First login — You must set a new password before continuing.
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="cp-success">
            ✅ Password updated! Redirecting to sign in…
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="cp-error">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Old password */}
          <div className="cp-field">
            <label className="cp-label" htmlFor="oldPw">Current password</label>
            <div className="cp-input-wrap">
              <input
                id="oldPw"
                type={show.old ? "text" : "password"}
                className={`cp-input${error && !oldPw ? " error" : ""}`}
                placeholder="••••••••"
                value={oldPw}
                onChange={(e) => setOldPw(e.target.value)}
                disabled={loading || success}
                autoComplete="current-password"
                required
              />
              <button type="button" className="cp-eye" onClick={() => toggle("old")} aria-label="show/hide">
                {show.old ? "👁️" : "👁️‍🗨"}
              </button>
            </div>
          </div>

          {/* New password */}
          <div className="cp-field">
            <label className="cp-label" htmlFor="newPw">New password</label>
            <div className="cp-input-wrap">
              <input
                id="newPw"
                type={show.new ? "text" : "password"}
                className="cp-input"
                placeholder="••••••••"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                disabled={loading || success}
                autoComplete="new-password"
                required
              />
              <button type="button" className="cp-eye" onClick={() => toggle("new")} aria-label="show/hide">
                {show.new ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>

            {/* Strength bar */}
            {newPw && (
              <>
                <div className="cp-strength">
                  <div
                    className="cp-strength-fill"
                    style={{ width: strInfo.width, background: strInfo.color }}
                  />
                </div>
                <span style={{ fontSize: "0.75rem", color: strInfo.color, fontWeight: 600 }}>
                  {strInfo.label}
                </span>
              </>
            )}

            {/* Requirements */}
            {newPw && (
              <ul className="cp-requirements">
                {requirements.map((r) => (
                  <li key={r.label} className={r.met ? "met" : ""}>
                    {r.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Confirm password */}
          <div className="cp-field">
            <label className="cp-label" htmlFor="confirmPw">Confirm password</label>
            <div className="cp-input-wrap">
              <input
                id="confirmPw"
                type={show.confirm ? "text" : "password"}
                className={`cp-input${confirmPw && confirmPw !== newPw ? " error" : ""}`}
                placeholder="••••••••"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                disabled={loading || success}
                autoComplete="new-password"
                required
              />
              <button type="button" className="cp-eye" onClick={() => toggle("confirm")} aria-label="show/hide">
                {show.confirm ? "👁️" : "👁️‍🗨"}
              </button>
            </div>
            {confirmPw && confirmPw !== newPw && (
              <span style={{ fontSize: "0.78rem", color: "#ef4444" }}>
                Passwords do not match
              </span>
            )}
          </div>

          <button
            type="submit"
            className="cp-btn"
            disabled={loading || success || !oldPw || !newPw || !confirmPw}
          >
            {loading && <span className="cp-btn-spinner" />}
            {loading ? "Updating…" : "Change password"}
          </button>
        </form>

        <p className="cp-back">
          <Link to="/signin">← Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}
