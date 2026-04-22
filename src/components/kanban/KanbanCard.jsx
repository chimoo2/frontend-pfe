import React from 'react';

export default function KanbanCard({ title, name, label, status, description, skillsNeeded = [], categoryRequirements = [], startDate, duration, onClick, accentColor }) {
  const displayTitle = title || name;
  const displayLabel = label || status;

  const skillsArr = skillsNeeded.slice(0, 3).map(s => s.skill || s.skillName || s);
  const extraSkills = skillsNeeded.length > 3 ? skillsNeeded.length - 3 : 0;

  const getStatusClass = () => {
    const s = (status || '').toLowerCase();
    if (s.includes('progress')) return 'kc-badge-amber';
    if (s.includes('complete') || s.includes('done')) return 'kc-badge-green';
    return 'kc-badge-indigo';
  };

  return (
    <div className="kc-card" onClick={onClick} style={{ '--accent': accentColor || '#6366f1' }}>
      <div className="kc-card-accent" />
      <div className="kc-card-body">
        {/* Header row */}
        <div className="kc-card-top">
          <h4 className="kc-card-title">{displayTitle}</h4>
          {displayLabel && (
            <span className={`kc-badge ${getStatusClass()}`}>{displayLabel}</span>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className="kc-card-desc">{description}</p>
        )}

        {/* Skills tags */}
        {skillsArr.length > 0 && (
          <div className="kc-skills">
            {skillsArr.map((s, i) => (
              <span key={i} className="kc-skill-tag">{s}</span>
            ))}
            {extraSkills > 0 && <span className="kc-skill-tag kc-skill-more">+{extraSkills}</span>}
          </div>
        )}

        {/* Footer */}
        <div className="kc-card-footer">
          <div className="kc-meta">
            {startDate && (
              <span className="kc-meta-item">
                <svg width="12" height="12" fill="none" viewBox="0 0 12 12"><rect x="1" y="2" width="10" height="9" rx="2" stroke="currentColor" strokeWidth="1.2"/><path d="M1 5h10M4 1v2M8 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                {new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            )}
            {duration && (
              <span className="kc-meta-item">
                <svg width="12" height="12" fill="none" viewBox="0 0 12 12"><circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M6 3.5V6l2 1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                {duration}
              </span>
            )}
          </div>
          {categoryRequirements.length > 0 && (
            <span className="kc-cat-count">{categoryRequirements.length} cat.</span>
          )}
        </div>
      </div>
    </div>
  );
}
