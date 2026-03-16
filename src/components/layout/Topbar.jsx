import React, { useState } from "react";
import "./Topbar.css";

export default function Topbar({
  isSidebarOpen,
  toggleSidebar,
  search,
  setSearch,
  onRefresh,
  loading,
  title = "CareerSavvy",
  searchPlaceholder = "Rechercher..."
}) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <div className={`topbar ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <div className="topbar-inner" role="navigation" aria-label="Topbar">
        {/* Left Section: Hamburger + Brand */}
        <div className="topbar-left">
          <button
            className="topbar-hamburger"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <svg width="20" height="16" viewBox="0 0 20 16" fill="none" aria-hidden>
              <rect y="0" width="20" height="2.4" rx="1.2" fill="currentColor" />
              <rect y="6.8" width="20" height="2.4" rx="1.2" fill="currentColor" />
              <rect y="13.6" width="20" height="2.4" rx="1.2" fill="currentColor" />
            </svg>
          </button>

          <div className="topbar-brand">
            <div className="brand-badge">
              <img src="/logo.png" alt="CareerSavvy" />
            </div>
            <span className="brand-title">{title}</span>
          </div>
        </div>

        {/* Center: Search */}
        <div className={`topbar-search-wrapper ${isSearchFocused ? "focused" : ""}`}>
          <svg className="search-icon" width="16" height="16" viewBox="0 0 16 16" aria-hidden>
            <path
              d="M7 1C10.866 1 14 4.134 14 8C14 9.657 13.36 11.158 12.325 12.235L15.416 15.326C15.604 15.515 15.604 15.814 15.416 16.002C15.227 16.19 14.928 16.19 14.74 16.002L11.649 12.911C10.572 13.946 9.071 14.586 7.414 14.586C3.548 14.586 0.414 11.452 0.414 7.586C0.414 3.72 3.548 0.586 7.414 0.586C7.276 0.586 7.138 0.59 7 0.594V1Z"
              fill="currentColor"
              opacity="0.6"
            />
          </svg>
          <input
            type="text"
            className="topbar-search-input"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch && setSearch(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            aria-label="Search"
          />
        </div>

        {/* Right Section: Icons */}
        <div className="topbar-right">
          {onRefresh && (
            <button
              className="topbar-icon-btn"
              onClick={onRefresh}
              disabled={loading}
              title="Actualiser"
              aria-label="Refresh data"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
                <path d="M9 3V1L6 4L9 7V5C11.2091 5 13 6.79086 13 9C13 11.2091 11.2091 13 9 13C7.67037 13 6.48906 12.3284 5.75736 11.2426L4.34315 12.6569C5.40017 14.1046 7.08594 15 9 15C12.3137 15 15 12.3137 15 9C15 5.68629 12.3137 3 9 3Z" fill="currentColor" opacity="0.8" />
              </svg>
            </button>
          )}

          <button className="topbar-icon-btn notification-btn" title="Notifications" aria-label="View notifications">
            <svg width="18" height="20" viewBox="0 0 18 20" fill="none" aria-hidden>
              <path d="M9 18C10.1046 18 11 18.8954 11 20H7C7 18.8954 7.89543 18 9 18ZM3 6C3 3.23858 5.23858 1 8 1C10.7614 1 13 3.23858 13 6V9L16 12.5V14H2V12.5L5 9V6Z" fill="currentColor" opacity="0.8" />
            </svg>
            <span className="notification-badge">1</span>
          </button>

          <button className="topbar-avatar" title="Profile" aria-label="Open user profile">
            <span className="avatar-initials">U</span>
          </button>

          <button className="topbar-icon-btn" title="Settings" aria-label="Settings">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <path d="M9 11.5C10.3807 11.5 11.5 10.3807 11.5 9C11.5 7.61929 10.3807 6.5 9 6.5C7.61929 6.5 6.5 7.61929 6.5 9C6.5 10.3807 7.61929 11.5 9 11.5ZM9 13C7.34315 13 6 11.6569 6 10V8C6 6.34315 7.34315 5 9 5C10.6569 5 12 6.34315 12 8V10C12 11.6569 10.6569 13 9 13ZM8.5 1H9.5V2.5H8.5V1ZM8.5 15.5H9.5V17H8.5V15.5ZM1 8.5V9.5H2.5V8.5H1ZM15.5 8.5V9.5H17V8.5H15.5Z" fill="currentColor" opacity="0.8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
