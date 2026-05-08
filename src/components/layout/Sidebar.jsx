import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar({
  isOpen,
  toggleSidebar,
  sections = [],
  useNavLink = false,
  activeItem,
  onItemClick,
  onLogout,
  userName,
  userRole
}) {
  return (
    <>
      {/* Sidebar with toggle button */}
      <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="logo">
          <img src="/logo.png" alt="CareerSavvy Logo" className="sidebar-logo" />
          {isOpen && <span className="logo-text">CareerSavvy</span>}
        </div>

        {/* User info badge */}
        {isOpen && userName && (
          <div className="sidebar-user-badge">
            <div className="sidebar-user-avatar">
              {(userName?.[0] || "A").toUpperCase()}
            </div>
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{userName}</span>
              <span className="sidebar-user-role">{userRole || "Admin"}</span>
            </div>
          </div>
        )}

        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="sidebar-section">
            <p className="section-title">{section.title}</p>
            <ul>
              {section.items.map((item) => (
                <li key={item.id || item.key}>
                  {useNavLink ? (
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => isActive ? "active" : ""}
                    >
                      <span className="icon-wrapper">{item.icon}</span>
                      <span className="link-label">{item.label}</span>
                    </NavLink>
                  ) : (
                    <button
                      className={`sidebar-link ${activeItem === item.id ? "active" : ""}`}
                      onClick={() => onItemClick && onItemClick(item.id)}
                    >
                      <span className="icon-wrapper">{item.icon}</span>
                      <span className="link-label">{item.label}</span>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="logout">
          {onLogout ? (
            <button className="sidebar-link" onClick={onLogout}>
              <span className="icon-wrapper">🚪</span>
              <span className="link-label">Logout</span>
            </button>
          ) : useNavLink ? (
            <NavLink to="/logout">
              <span className="icon-wrapper">🚪</span>
              <span className="link-label">Logout</span>
            </NavLink>
          ) : (
            <button className="sidebar-link">
              <span className="icon-wrapper">🚪</span>
              <span className="link-label">Logout</span>
            </button>
          )}
        </div>
      </aside>

      {/* Toggle Button - Always visible on the right */}
      <button
        type="button"
        className={`sidebar-toggle ${isOpen ? "open" : "closed"}`}
        onClick={toggleSidebar}
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        aria-expanded={isOpen}
        title={isOpen ? "Close menu" : "Open menu"}
      >
        <span className="sidebar-toggle-inner">
          <span className="sidebar-toggle-icon" aria-hidden="true">
            <svg className="toggle-chevron" width="16" height="16" viewBox="0 0 16 16">
              {isOpen ? (
                <path d="M10.5 3.5L6 8l4.5 4.5" />
              ) : (
                <path d="M5.5 3.5L10 8l-4.5 4.5" />
              )}
            </svg>
          </span>
          <span className="sidebar-toggle-copy">
            <span className="sidebar-toggle-title">{isOpen ? "Hide" : "Open"}</span>
            <span className="sidebar-toggle-subtitle">menu</span>
          </span>
        </span>
      </button>
    </>
  );
}