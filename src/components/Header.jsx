import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const navItems = [
    { hash: "hero2", label: "About" },
    { hash: "hero3", label: "Features" },
    { hash: "hero4", label: "Process" },
    { hash: "hero5", label: "Solutions" },
    { hash: "hero6", label: "Analytics" },

    
    
  ];

  const handleNavigation = (event, hash) => {
    event.preventDefault();
    setOpen(false);

    const scrollToSection = () => {
      const target = document.getElementById(hash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    navigate(`/#${hash}`);
    setTimeout(scrollToSection, 120);
  };

  const getUserInitials = () => {
    const firstName = user?.prenom || user?.firstName || user?.name || "";
    const lastName = user?.nom || user?.lastName || "";
    const initials = `${firstName.charAt(0) || ""}${lastName.charAt(0) || ""}`.toUpperCase();
    return initials || user?.email?.charAt(0)?.toUpperCase() || "ME";
  };

  if (user?.role === "ROLE_ADMIN") {
    navItems.push({ hash: null, to: "/admin", label: "Admin" });
  }

  const [headerPhoto, setHeaderPhoto] = useState(null);

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  React.useEffect(() => {
    if (user?.id) {
      const savedPhoto = localStorage.getItem(`employeePhoto_${user.id}`);
      if (savedPhoto) {
        setHeaderPhoto(savedPhoto);
      }
    }
  }, [user?.id]);

  const avatarSrc = user?.photo || user?.avatarUrl || user?.image || headerPhoto;

  return (
    <>
      <div className="top-strip" />

      <header className="site-header" role="banner">
        <div className="site-container">
          <div className="logo">
  <NavLink 
    to="/" 
    className="logo-link"
    onClick={() => {
      setTimeout(() => {
        const section = document.getElementById("hero1");
        if (section) section.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }}
  >
    <img src="/logo.png" alt="CapTalent" />
  </NavLink>
</div>
          <nav className="nav-desktop" aria-label="Primary navigation">
            {navItems.map((item) => (
              item.hash ? (
                <a
                  key={item.hash}
                  href={`/#${item.hash}`}
                  className={`nav-link ${location.hash === `#${item.hash}` ? "active" : ""}`}
                  onClick={(event) => handleNavigation(event, item.hash)}
                >
                  {item.label}
                </a>
              ) : (
                <NavLink key={item.label} to={item.to} className="nav-link">
                  {item.label}
                </NavLink>
              )
            ))}
          </nav>

          <div className="actions">
            {user && (
              <NavLink
                to="/profile"
                className={({ isActive }) => `profile-link ${isActive ? 'active' : ''}`}
                onClick={() => setOpen(false)}
                aria-label="Accéder au profil"
              >
                <span className="profile-avatar">
                  {avatarSrc ? (
                    <img src={avatarSrc} alt="Avatar profil" />
                  ) : (
                    getUserInitials()
                  )}
                </span>
              </NavLink>
            )}
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
              item.hash ? (
                <a
                  key={item.hash}
                  href={`/#${item.hash}`}
                  className="mobile-link"
                  onClick={(event) => handleNavigation(event, item.hash)}
                >
                  {item.label}
                </a>
              ) : (
                <NavLink
                  key={item.label}
                  to={item.to}
                  className="mobile-link"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </NavLink>
              )
            ))}

            {user && (
              <NavLink
                to="/profile"
                className="mobile-link"
                onClick={() => setOpen(false)}
              >
                Mon Profil
              </NavLink>
            )}
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
