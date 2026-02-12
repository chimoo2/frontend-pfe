import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import { useAuth } from '../../context/AuthContext';

export default function Signup() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload = { prenom: firstName, nom: lastName, email: email.trim().toLowerCase(), password };
      await register(payload);
      setLoading(false);
      navigate("/signin", { replace: true });
    } catch (err) {
      setLoading(false);
      const msg = err?.message || "Erreur lors de l'inscription";
      setError(msg.replace(/\n/g, ' '));
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-inner">
        <div className="signup-panel">
          <div className="brand">
            <a href="/">
              <span className="logo-badge">
                <img src="/logo.png" alt="Logo" className="logo-icon" />
              </span>
            </a>
            <h2>Create account</h2>
            <p className="muted">Join now — start building your profile and exploring opportunities.</p>
          </div>
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="row-2">
              <input placeholder="First name" className="input" value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={loading} />
              <input placeholder="Last name" className="input" value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={loading} />
            </div>

            <input placeholder="Email address" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
            <div className="password-row">
              <input placeholder="Create password" className="input" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
              <button className="eye" type="button" aria-label="toggle password" disabled={loading} onClick={(e) => { e.preventDefault(); setShowPassword(!showPassword); }}>
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>

            <div className="small muted">
              By creating an account you agree to our <a href="#">Terms</a> and <a href="#">Privacy</a>.
            </div>

            {error && <div className="error" role="alert">{error}</div>}

            <button className="signup-cta" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Get Started'}</button>

            <div className="divider">Or continue with</div>

            <div className="socials">
              <button className="social google" type="button" disabled={loading}>Google</button>
              <button className="social github" type="button" disabled={loading}>GitHub</button>
            </div>

            <p className="center muted">Already have an account? <a href="/signin">Sign in</a></p>
          </form>
        </div>

        <div className="signup-side">
          <div className="illustration">
            <h3>Welcome to careersavvy</h3>
            <p className="muted">Smart career insights, AI-powered skill analysis, and personalized growth paths for future-ready professionals.</p>
            <div className="stats">
              <div className="stat"><strong>10k+</strong><span>Career Profiles Analyzed</span></div>
              <div className="stat"><strong>50k+</strong><span>Skill Gap Assessments</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
