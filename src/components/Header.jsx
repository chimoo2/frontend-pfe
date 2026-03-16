import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const navItems = [
    { to: "/", label: "About" },
    { to: "/ecosystem", label: "Ecosystem" },
    { to: "/features", label: "Features" },
    { to: "/modules", label: "Modules" },
    { to: "/security", label: "Security" },
    { to: "/analytics", label: "Analytics" },
    { to: "/technology", label: "Technology" },
  ];

  if (user?.role === "ROLE_ADMIN") {
    navItems.push({ to: "/admin", label: "Admin" });
  }

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  return (
    <>
      <div className="top-strip" />

      <header className="site-header" role="banner">
        <div className="site-container">
          <div className="logo">
            <NavLink to="/">
              <img src="/logo.png" alt="Logo" />
            </NavLink>
          </div>

          <nav className="nav-desktop" aria-label="Primary navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="actions">
            {user ? (
              <div className="user-info">
                <button className="logout-btn" onClick={handleLogout}>
                  Déconnexion
                </button>
              </div>
            ) : (
              <NavLink to="/signin" className={({ isActive }) => `nav-signin ${isActive ? 'active' : ''}`}>
                Sign In
              </NavLink>
            )}

            <button
              className="mobile-toggle"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen((s) => !s)}
            >
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <div className="mobile-panel" role="dialog" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className="mobile-link" onClick={() => setOpen(false)}>
                {item.label}
              </NavLink>
            ))}

            {user ? (
              <div className="mobile-user-info">
                <button className="mobile-logout-btn" onClick={() => { handleLogout(); setOpen(false); }}>
                  Déconnexion
                </button>
              </div>
            ) : (
              <NavLink to="/signin" className="mobile-link mobile-signin" onClick={() => setOpen(false)}>
                Sign In
              </NavLink>
            )}

            <div className="mobile-cta">
              <button className="cta full">Request a Demo</button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
