import React from 'react';
import { useNavigate } from 'react-router-dom';
import SkillCategoryRequirementsTable from '../project/SkillCategoryRequirementsTable';
import { markProjectMatched } from '../../utils/matchingHistory';
import './KanbanBoard.css';

export default function ProjectDetailModal({ open, onClose, project, onSave, onDelete, showMatchingAction = true }) {
  const navigate = useNavigate();
  const [form, setForm] = React.useState(project || {});
  const [activeTab, setActiveTab] = React.useState('info');

  React.useEffect(() => {
    setForm(project || {});
    setActiveTab('info');
  }, [project]);

  if (!open || !project) return null;

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSkillChange = (index, field) => (e) => {
    const newSkills = [...(form.skillsNeeded || [])];
    newSkills[index] = { ...newSkills[index], [field]: e.target.value };
    setForm(prev => ({ ...prev, skillsNeeded: newSkills }));
  };

  const addSkill = () => {
    setForm(prev => ({
      ...prev,
      skillsNeeded: [...(prev.skillsNeeded || []),
        { skill: '', level: 'Intermediate', count: 1, domain: '', family: '', category: '', type: '' }
      ]
    }));
  };

  const removeSkill = (index) => {
    const newSkills = (form.skillsNeeded || []).filter((_, i) => i !== index);
    setForm(prev => ({ ...prev, skillsNeeded: newSkills }));
  };

  const statusMeta = {
    'To Do': { color: '#6366f1', bg: 'rgba(99,102,241,0.1)', icon: '📋', pct: 0 },
    'In Progress': { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: '⚡', pct: 50 },
    'Completed': { color: '#10b981', bg: 'rgba(16,185,129,0.1)', icon: '✅', pct: 100 },
  };
  const sm = statusMeta[form.status] || { color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', icon: '—', pct: 0 };

  const tabs = [
    { id: 'info', label: 'Details', icon: <svg width="15" height="15" fill="none" viewBox="0 0 16 16"><path d="M2 4.5A1.5 1.5 0 013.5 3h9A1.5 1.5 0 0114 4.5v7a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 012 11.5v-7z" stroke="currentColor" strokeWidth="1.3"/><path d="M5 7h6M5 9.5h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> },
    { id: 'skills', label: 'Skills', count: (form.skillsNeeded || []).length, icon: <svg width="15" height="15" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/><path d="M8 5v3l2 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { id: 'team', label: 'Team', count: (form.teamAssigned || []).length, icon: <svg width="15" height="15" fill="none" viewBox="0 0 16 16"><circle cx="6" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1.5 13c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth="1.1"/><path d="M14.5 12.5c0-1.8-1-3-2.5-3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg> },
  ];

  return (
    <div className="km-overlay" onClick={onClose}>
      <div className="km-modal km-modal-lg" onClick={(e) => e.stopPropagation()}>

        {/* ===== Premium Header Banner ===== */}
        <div className="km-banner">
          <div className="km-banner-bg" />
          <div className="km-banner-content">
            <div className="km-banner-left">
              <div className="km-banner-icon">{sm.icon}</div>
              <div className="km-banner-info">
                <h2 className="km-banner-title">{form.name || 'Untitled Project'}</h2>
                <div className="km-banner-meta">
                  <span className="km-status-chip" style={{ background: sm.bg, color: sm.color }}>
                    <span className="km-status-dot" style={{ background: sm.color }} />
                    {form.status || 'No status'}
                  </span>
                  {form.manager && <span className="km-banner-tag">👤 {form.manager}</span>}
                  {form.startDate && <span className="km-banner-tag">📅 {form.startDate}</span>}
                  {form.duration && <span className="km-banner-tag">⏱ {form.duration}</span>}
                </div>
              </div>
            </div>
            <div className="km-banner-actions">
              <button
                className="km-ghost-btn km-ghost-danger"
                onClick={() => {
                  if (window.confirm('Confirm deletion of this project?')) {
                    onDelete && onDelete(form.id);
                    onClose();
                  }
                }}
                title="Delete project"
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M2 4h12M5.33 4V2.67a1.33 1.33 0 011.34-1.34h2.66a1.33 1.33 0 011.34 1.34V4m2 0v9.33a1.33 1.33 0 01-1.34 1.34H4.67a1.33 1.33 0 01-1.34-1.34V4h9.34z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button className="km-ghost-btn" onClick={onClose} title="Close">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M5 5l8 8M13 5l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
              </button>
            </div>
          </div>

          {/* Tab Bar */}
          <div className="km-tab-bar">
            {tabs.map(t => (
              <button
                key={t.id}
                className={`km-tab ${activeTab === t.id ? 'km-tab-active' : ''}`}
                onClick={() => setActiveTab(t.id)}
              >
                {t.icon}
                {t.label}
                {t.count != null && <span className="km-tab-count">{t.count}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* ===== Body ===== */}
        <div className="km-body km-detail-body">
          <div className="km-detail-grid">
            {/* Left - Main Content */}
            <div className="km-detail-main">

              {/* Tab: Details */}
              {activeTab === 'info' && (
                <div className="km-card-section">
                  <div className="km-form-grid">
                    <div className="km-field">
                      <label className="km-label">Project Name</label>
                      <input className="km-input" value={form.name || ''} onChange={handleChange('name')} placeholder="Project name" />
                    </div>
                    <div className="km-field">
                      <label className="km-label">Manager</label>
                      <input className="km-input" value={form.manager || ''} onChange={handleChange('manager')} placeholder="Manager name" />
                    </div>
                    <div className="km-field">
                      <label className="km-label">Start Date</label>
                      <input className="km-input" type="date" value={form.startDate || ''} onChange={handleChange('startDate')} />
                    </div>
                    <div className="km-field">
                      <label className="km-label">Duration</label>
                      <input className="km-input" value={form.duration || ''} onChange={handleChange('duration')} placeholder="e.g. 6 months" />
                    </div>
                    <div className="km-field">
                      <label className="km-label">Status</label>
                      <select className="km-input km-select" value={form.status || ''} onChange={handleChange('status')}>
                        <option value="">--</option>
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>
                  <div className="km-field" style={{ marginTop: 16 }}>
                    <label className="km-label">Description</label>
                    <textarea
                      className="km-input km-textarea"
                      rows={4}
                      value={form.description || ''}
                      onChange={handleChange('description')}
                      placeholder="Describe the project scope, objectives, and key deliverables..."
                    />
                  </div>
                </div>
              )}

              {/* Tab: Skills */}
              {activeTab === 'skills' && (
                <>
                  <div className="km-card-section">
                    <div className="km-section-header">
                      <h4 className="km-section-title">
                        <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/><path d="M8 5v3l2 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Required Skills
                        <span className="km-count-pill">{(form.skillsNeeded || []).length}</span>
                      </h4>
                      <button className="km-btn-sm km-btn-add" onClick={addSkill}>
                        <svg width="14" height="14" fill="none" viewBox="0 0 14 14"><path d="M7 3v8M3 7h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                        Add Skill
                      </button>
                    </div>
                    {(form.skillsNeeded || []).length > 0 ? (
                      <div className="km-table-wrap">
                        <table className="km-table">
                          <thead>
                            <tr>
                              <th>Skill</th>
                              <th>Domain</th>
                              <th>Family</th>
                              <th>Category</th>
                              <th>Type</th>
                              <th>Level</th>
                              <th style={{width:70}}>Count</th>
                              <th style={{width:44}}></th>
                            </tr>
                          </thead>
                          <tbody>
                            {(form.skillsNeeded||[]).map((s,i)=>(
                              <tr key={i}>
                                <td>
                                  <input className="km-table-input" value={s.skill || ''} onChange={handleSkillChange(i, 'skill')} placeholder="Skill name" />
                                </td>
                                <td><span className="km-table-text">{s.domain || '—'}</span></td>
                                <td><span className="km-table-text">{s.family || '—'}</span></td>
                                <td><span className="km-table-text">{s.category || '—'}</span></td>
                                <td><span className="km-table-text">{s.type || '—'}</span></td>
                                <td>
                                  <input className="km-table-input" value={s.level || ''} onChange={handleSkillChange(i, 'level')} />
                                </td>
                                <td>
                                  <input className="km-table-input km-table-num" type="number" value={s.count || ''} onChange={handleSkillChange(i, 'count')} />
                                </td>
                                <td>
                                  <button className="km-btn-icon-sm km-btn-danger-sm" onClick={() => removeSkill(i)} title="Remove">
                                    <svg width="14" height="14" fill="none" viewBox="0 0 14 14"><path d="M2 3.5h10M4.67 3.5V2.33a.83.83 0 01.83-.83h3a.83.83 0 01.83.83V3.5m1.34 0v6.67a.83.83 0 01-.84.83H4.17a.83.83 0 01-.84-.83V3.5h7.34z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="km-empty-section">
                        <svg width="40" height="40" fill="none" viewBox="0 0 40 40"><rect x="4" y="4" width="32" height="32" rx="8" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4"/><path d="M20 14v12M14 20h12" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/></svg>
                        <p>No skills added yet</p>
                        <button className="km-btn-sm km-btn-add" onClick={addSkill} style={{marginTop: 4}}>+ Add first skill</button>
                      </div>
                    )}
                  </div>

                  {/* Category Requirements */}
                  <SkillCategoryRequirementsTable
                    requirements={form.categoryRequirements || []}
                    onChange={(reqs) => setForm(prev => ({ ...prev, categoryRequirements: reqs }))}
                  />
                </>
              )}

              {/* Tab: Team */}
              {activeTab === 'team' && (
                <div className="km-card-section">
                  <h4 className="km-section-title" style={{ marginBottom: 4 }}>
                    <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><circle cx="6" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M1.5 13c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth="1.1"/><path d="M14.5 12.5c0-1.8-1-3-2.5-3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>
                    Assigned Team
                    <span className="km-count-pill">{(form.teamAssigned || []).length}</span>
                  </h4>
                  {(form.teamAssigned || []).length > 0 ? (
                    <div className="km-team-grid">
                      {(form.teamAssigned||[]).map((e,i) => {
                        const colors = ['#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981','#3b82f6'];
                        const c = colors[i % colors.length];
                        return (
                          <div className="km-team-card" key={i}>
                            <div className="km-team-card-avatar" style={{ background: `linear-gradient(135deg, ${c}, ${c}dd)` }}>
                              {(e.name || '?')[0].toUpperCase()}
                            </div>
                            <div className="km-team-card-info">
                              <span className="km-team-card-name">{e.name}</span>
                              <span className="km-team-card-role">{e.role}</span>
                            </div>
                            <span className="km-level-badge">{e.level}</span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="km-empty-section">
                      <svg width="40" height="40" fill="none" viewBox="0 0 40 40"><circle cx="20" cy="16" r="6" stroke="#cbd5e1" strokeWidth="1.5"/><path d="M8 36c0-6.6 5.4-12 12-12s12 5.4 12 12" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      <p>No team members assigned yet</p>
                      <span style={{fontSize:'0.8rem', color:'#94a3b8'}}>Use matching to find the best candidates</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right - Sidebar */}
            <div className="km-detail-sidebar">
              {/* Progress Card */}
              <div className="km-sidebar-card km-sidebar-progress">
                <div className="km-progress-ring-wrap">
                  <svg className="km-progress-ring" width="80" height="80" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                    <circle
                      cx="40" cy="40" r="34"
                      fill="none"
                      stroke={sm.color}
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 34}`}
                      strokeDashoffset={`${2 * Math.PI * 34 * (1 - sm.pct / 100)}`}
                      style={{ transition: 'stroke-dashoffset 0.6s ease', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                    />
                  </svg>
                  <span className="km-progress-pct" style={{ color: sm.color }}>{sm.pct}%</span>
                </div>
                <span className="km-progress-label">Completion</span>
              </div>

              {/* Overview Card */}
              <div className="km-sidebar-card">
                <h5 className="km-sidebar-label">Quick Overview</h5>
                <div className="km-sidebar-stat">
                  <span className="km-sidebar-stat-label">Manager</span>
                  <span className="km-sidebar-stat-val">{form.manager || '—'}</span>
                </div>
                <div className="km-sidebar-divider" />
                <div className="km-sidebar-stat">
                  <span className="km-sidebar-stat-label">Start Date</span>
                  <span className="km-sidebar-stat-val">{form.startDate || '—'}</span>
                </div>
                <div className="km-sidebar-divider" />
                <div className="km-sidebar-stat">
                  <span className="km-sidebar-stat-label">Duration</span>
                  <span className="km-sidebar-stat-val">{form.duration || '—'}</span>
                </div>
                <div className="km-sidebar-divider" />
                <div className="km-sidebar-row">
                  <div className="km-sidebar-mini">
                    <span className="km-sidebar-mini-val">{(form.skillsNeeded || []).length}</span>
                    <span className="km-sidebar-mini-label">Skills</span>
                  </div>
                  <div className="km-sidebar-mini">
                    <span className="km-sidebar-mini-val">{(form.teamAssigned || []).length}</span>
                    <span className="km-sidebar-mini-label">Members</span>
                  </div>
                  <div className="km-sidebar-mini">
                    <span className="km-sidebar-mini-val">{(form.categoryRequirements || []).length}</span>
                    <span className="km-sidebar-mini-label">Categories</span>
                  </div>
                </div>
              </div>

              {/* Actions Card */}
              <div className="km-sidebar-card">
                <div className="km-sidebar-actions">
                  {showMatchingAction && (
                    <button
                      className="km-btn km-btn-matching"
                      onClick={() => {
                        markProjectMatched(form.id);
                        navigate(`/manager/matching/${form.id}`);
                        onClose();
                      }}
                    >
                      <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M6 3l4 5-4 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      View Matching
                    </button>
                  )}
                  <button className="km-btn km-btn-primary-full" onClick={() => onSave && onSave(form)}>
                    <svg width="15" height="15" fill="none" viewBox="0 0 16 16"><path d="M13.3 4.7L6.5 11.5 2.7 7.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
