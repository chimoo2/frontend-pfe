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
            { label: "My Projects", path: "/manager/projects", icon: "📁", key: "projects" },
            { label: "Create Project", path: "/manager/projects/new", icon: "➕", key: "create" },
            { label: "Matching Board", path: "/manager/matching", icon: "🤝", key: "matching" },
          
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

    {/* Toggle Button - Premium Modern Design */}
    <button
      className={`sidebar-toggle ${isOpen ? "open" : "closed"}`}
      onClick={toggleSidebar}
      aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
      aria-expanded={isOpen}
      title={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
    >
      <div className="hamburger">
        <span className="line line-1"></span>
        <span className="line line-2"></span>
        <span className="line line-3"></span>
      </div>
    </button>
    </>
  );
}