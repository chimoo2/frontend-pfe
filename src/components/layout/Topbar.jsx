import React, { useState } from "react";
import "./Topbar.css";

export default function Topbar({
  isSidebarOpen,
  toggleSidebar,
  search,
  setSearch,
  onRefresh,
  loading,
  searchPlaceholder = "Search...",
  userName,
  userRole,
  onLogout
}) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const initials = userName
    ? userName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className={`topbar ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <div className="topbar-inner" role="navigation" aria-label="Topbar">
        {/* Center: Search */}
        <div className={`topbar-search-wrapper ${isSearchFocused ? "focused" : ""}`}>
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
            <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            className="topbar-search-input"
            placeholder={searchPlaceholder}
            value={search || ""}
            onChange={(e) => setSearch && setSearch(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            aria-label="Search"
          />
          <kbd className="search-kbd">⌘K</kbd>
        </div>

        {/* Right Section */}
        <div className="topbar-right">
          {onRefresh && (
            <button
              className="topbar-icon-btn"
              onClick={onRefresh}
              disabled={loading}
              title="Refresh"
              aria-label="Refresh data"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" fill="currentColor" opacity="0.75"/>
              </svg>
            </button>
          )}

          

          {/* User profile chip */}
          <div className="topbar-user-chip">
            <div className="topbar-user-avatar">
              <span>{initials}</span>
            </div>
            {userName && (
              <div className="topbar-user-info">
                <span className="topbar-user-name">{userName}</span>
                {userRole && <span className="topbar-user-role">{userRole}</span>}
              </div>
            )}
          </div>

          {onLogout && (
            <button className="topbar-logout-btn" onClick={onLogout} title="Disconnect" aria-label="Logout">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="currentColor"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
