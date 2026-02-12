import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signin.css";
import { useAuth } from '../../context/AuthContext';

export default function Signin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);

      setLoading(false);
      navigate("/profile");
    } catch (err) {
      setLoading(false);
      // show clean error message (try to extract JSON error payload)
      let msg = err?.message || "Erreur de connexion";
      try {
        // sometimes backend returns JSON stringified in message, try to parse
        const parsed = JSON.parse(msg);
        msg = parsed.error || parsed.message || JSON.stringify(parsed);
      } catch (_) {
        // not JSON, keep original
      }
      setError(String(msg).replace(/\n/g, ' '));
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-inner">
        <div className="signin-left">
          <div className="signin-card" role="region" aria-labelledby="signin-title">
            <div className="logo">
              <a href="/">
                <span className="logo-badge">
                  <img src="/logo.png" alt="Logo" className="logo-icon" />
                </span>
              </a>
            </div>
            <h2 id="signin-title" className="title">Sign In</h2>
            <p className="subtitle">Welcome back! Please enter your details</p>

            <form onSubmit={handleSubmit} className="signin-form">
              <div className="field">
                <label className="label" htmlFor="email">Email</label>
                <input id="email" name="email" className="input" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
              </div>

              <div className="field">
                <label className="label" htmlFor="password">Password</label>
                <div className="password-row">
                  <input id="password" name="password" type={showPassword ? "text" : "password"} className="input" placeholder="●●●●●●●" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
                  <button className="eye" type="button" aria-label="toggle password" disabled={loading} onClick={(e) => { e.preventDefault(); setShowPassword(!showPassword); }}>
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <div className="row small muted">
                <label className="checkbox">
                  <input type="checkbox" disabled={loading} /> Remember for 30 Days
                </label>
                <a className="forgot" href="#">Forgot password</a>
              </div>

              {error && <div className="error" role="alert">{error}</div>}

              <button className="signin-btn" type="submit" disabled={loading} aria-busy={loading}>{loading ? 'Signing...' : 'Sign in'}</button>

              <div className="or">OR</div>

              <div className="socials">
                <button className="social google" type="button" disabled={loading}>Sign up with Google</button>
                <button className="social apple" type="button" disabled={loading}>Sign up with Facebook</button>
              </div>

              <p className="muted center">Don't have an account? <Link to="/signup">Sign up</Link></p>
            </form>
          </div>
        </div>

        <div className="signin-right">
          <div className="promo">
            <h1>Welcome back! Please sign in to your
              <span className="underline"> careersavvy</span> account
            </h1>
            <p className="promo-sub">Welcome to the AI-Powered Career Guidance & Skills Analysis Platform</p>

            <div className="chart">
              <div className="bars">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="bar" style={{ height: `${40 + i * 6}px` }} />
                ))}
              </div>
              <div className="chart-legend">Skills Progress</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
