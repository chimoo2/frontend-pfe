import React from "react";
import { NavLink } from "react-router-dom";
import "./ManagerSidebar.css";
import { useSidebar } from "../../context/SidebarContext";
import { useAuth } from "../../context/AuthContext";

export default function ManagerSidebar() {
  const { isOpen, toggleSidebar } = useSidebar();
  const { user, logout } = useAuth();

  return (
    <>
      {/* Sidebar with toggle button */}
      <aside className={`manager-sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="logo">
        <img src="/logo.png" alt="CareerSavvy Logo" className="sidebar-logo" />
      </div>

      <div className="sidebar-section">
        <p className="section-title">Home</p>
        <ul>
          <li>
            <NavLink to="/manager/dashboard" className={({ isActive }) => isActive ? "active" : ""}>
              <span className="icon-wrapper">🏠</span>
              <span className="link-label">Dashboard</span>
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="sidebar-section">
        <p className="section-title">Navigation</p>
        <ul>
          {[
            { label: "Mes Projets", path: "/manager/projects", icon: "📁", key: "projects" },
            { label: "Créer Projet", path: "/manager/projects/new", icon: "➕", key: "create" },
            { label: "Matching Kanban", path: "/manager/matching", icon: "🤝", key: "matching" },
            { label: "Statistiques", path: "/manager/stats", icon: "📊", key: "stats" }
          ].map(item => (
            <li key={item.key}>
              <NavLink to={item.path} className={({ isActive }) => isActive ? "active" : ""}>
                <span className="icon-wrapper">{item.icon}</span>
                <span className="link-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* User info section */}
      <div className="user-info">
        <div className="user-avatar">
          <span className="avatar-icon">👤</span>
        </div>
        <div className="user-details">
          <p className="user-name">{user?.prenom} {user?.nom}</p>
          <p className="user-role">Manager</p>
        </div>
      </div>

      <div className="logout">
        <button className="logout-btn" onClick={logout}>
          <span className="icon-wrapper">🚪</span>
          <span className="link-label">Logout</span>
        </button>
      </div>
    </aside>

    {/* Toggle Button - Always visible on the right */}
    <button
      className={`sidebar-toggle ${isOpen ? "open" : "closed"}`}
      onClick={toggleSidebar}
      aria-label="Toggle sidebar"
      aria-expanded={isOpen}
      title={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
    >
      <svg className="toggle-icon" width="18" height="14" viewBox="0 0 18 14" aria-hidden="true">
        <rect className="r1" x="0" y="0" width="18" height="2" rx="1" />
        <rect className="r2" x="0" y="6" width="18" height="2" rx="1" />
        <rect className="r3" x="0" y="12" width="18" height="2" rx="1" />
      </svg>
    </button>
    </>
  );
}