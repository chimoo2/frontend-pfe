
import React from 'react';
import {
  HomeOutlined,
  DashboardOutlined,
  StarOutline,
  SchoolOutlined,
  DescriptionOutlined,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';
import './EmployeSidebar.css';

const sections = [
  { id: 'overview', label: 'Overview', Icon: HomeOutlined },
  { id: 'dashboard', label: 'Dashboard', Icon: DashboardOutlined },
  { id: 'skills', label: 'Skills', Icon: StarOutline },
  { id: 'career', label: 'Career', Icon: SchoolOutlined },
  { id: 'resume', label: 'Resume', Icon: DescriptionOutlined },
];

export default function EmployeSidebar({
  activeSection,
  onSectionChange,
  notificationsCount = 0,
  onOpenNotifications,
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-avatar">CT</div>
        <div>
          <div className="brand-title">CapTalent</div>
          <div className="brand-subtitle">Talent Intelligence</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-title">Navigation</div>
        <ul className="nav-menu">
          {sections.map((section) => {
            const Icon = section.Icon;
            return (
              <li key={section.id}>
                <button
                  className={`nav-item${activeSection === section.id ? ' active' : ''}`}
                  onClick={() => onSectionChange(section.id)}
                >
                  <span className="nav-icon-wrapper">
                    <Icon className="nav-icon" />
                  </span>
                  <span className="nav-label">{section.label}</span>
                  <span className="nav-indicator" />
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button
          className="sidebar-cta"
          type="button"
          onClick={() => {
            if (onOpenNotifications) {
              onOpenNotifications();
            }
          }}
        >
          <span className="sidebar-cta-text">View recommendations</span>
          {notificationsCount > 0 && (
            <span className="sidebar-cta-badge">{notificationsCount > 99 ? '99+' : notificationsCount}</span>
          )}
        </button>
      </div>
    </aside>
  );
}
