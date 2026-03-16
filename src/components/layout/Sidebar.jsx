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
  onLogout
}) {
  return (
    <>
      {/* Sidebar with toggle button */}
      <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="logo">
          <img src="/logo.png" alt="CareerSavvy Logo" className="sidebar-logo" />
        </div>

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