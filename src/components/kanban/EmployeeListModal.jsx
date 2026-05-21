import React, { useEffect, useState } from 'react';
import { getAllEmployees, assignEmployeeToProject } from '../../api/projectApi';
import './EmployeeListModal.css';

const normalizeUserSkills = (rawSkills) => {
  if (!Array.isArray(rawSkills)) return [];

  return rawSkills
    .map((skill) => {
      const name = String(skill?.name || skill?.skill_name || skill?.skillName || '').trim();
      if (!name) return null;

      return {
        name,
        level: String(skill?.level || 'Junior').trim(),
        experienceMonths: Number(skill?.years_experience ?? skill?.experience ?? 0) || 0,
        domain: String(skill?.domain || '').trim(),
        family: String(skill?.family || '').trim(),
        category: String(skill?.category || '').trim(),
        type: String(skill?.type || '').trim(),
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.experienceMonths - a.experienceMonths);
};

export default function EmployeeListModal({ project, onClose, onProjectUpdated }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [assigning, setAssigning] = useState(null);
  const [assignedIds, setAssignedIds] = useState(new Set());
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    getAllEmployees()
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setEmployees(list.filter((emp) => String(emp?.role || '').toUpperCase() === 'ROLE_USER'));
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load employees.');
        setLoading(false);
      });
  }, []);

  const handleAssign = async (employee) => {
    setAssigning(employee.id);
    try {
      const updatedProject = await assignEmployeeToProject(project.id, String(employee.id));
      setAssignedIds(prev => new Set(prev).add(employee.id));
      onProjectUpdated && onProjectUpdated(updatedProject);
      setSuccessMsg(`${employee.prenom} ${employee.nom} assigned to "${project.name}"`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      alert('Failed to assign employee. Please try again.');
    } finally {
      setAssigning(null);
    }
  };

  const toggleExpand = (id) => {
    setExpanded(prev => (prev === id ? null : id));
  };

  return (
    <div className="elm-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="elm-modal">
        <div className="elm-header">
          <div>
            <h2 className="elm-title">Assign Employee</h2>
            <p className="elm-subtitle">Project: <strong>{project.name}</strong></p>
          </div>
          <button className="elm-close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {successMsg && (
          <div className="elm-success">{successMsg}</div>
        )}

        {loading ? (
          <div className="elm-loading">Loading employees…</div>
        ) : error ? (
          <div className="elm-error">{error}</div>
        ) : employees.length === 0 ? (
          <div className="elm-empty">No employees found.</div>
        ) : (
          <ul className="elm-list">
            {employees.map(emp => {
              const isAssigned = assignedIds.has(emp.id);
              const isExpanded = expanded === emp.id;
              const initials = `${(emp.prenom || '?')[0]}${(emp.nom || '?')[0]}`.toUpperCase();
              const userSkills = normalizeUserSkills(emp.skills);
              const currentRole = emp.currentRole || emp.position || 'Not specified';
              const assignedProjects = Array.isArray(emp.assignedProjects) ? emp.assignedProjects : [];
              return (
                <li key={emp.id} className={`elm-item ${isAssigned ? 'elm-item--assigned' : ''}`}>
                  <div className="elm-item-main">
                    <div className="elm-avatar">{initials}</div>
                    <div className="elm-info" onClick={() => toggleExpand(emp.id)}>
                      <span className="elm-name">{emp.prenom} {emp.nom}</span>
                      <span className="elm-meta">{emp.email}</span>
                      <span className="elm-position">Current role: {currentRole}</span>
                      {emp.position && <span className="elm-position">{emp.position}</span>}
                    </div>
                    <div className="elm-actions">
                      <button
                        className="elm-toggle-btn"
                        onClick={() => toggleExpand(emp.id)}
                        title={isExpanded ? 'Hide details' : 'View details'}
                      >
                        {isExpanded ? '▲' : '▼'}
                      </button>
                      <button
                        className={`elm-assign-btn ${isAssigned ? 'elm-assign-btn--done' : ''}`}
                        onClick={() => !isAssigned && handleAssign(emp)}
                        disabled={assigning === emp.id || isAssigned}
                      >
                        {assigning === emp.id ? '…' : isAssigned ? '✓ Assigned' : 'Assign'}
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="elm-details">
                      <div className="elm-detail-item elm-detail-item--full" style={{ marginBottom: 10 }}>
                        <span className="elm-detail-label">Assigned projects ({assignedProjects.length})</span>
                        {assignedProjects.length > 0 ? (
                          <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {assignedProjects.map((p) => (
                              <span key={`${emp.id}-${p.projectId || p.projectName}`} style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                border: '1px solid #dbe3ff',
                                color: '#334155',
                                background: '#f8faff',
                                borderRadius: 8,
                                padding: '4px 8px',
                                fontSize: '0.78rem',
                                fontWeight: 600
                              }}>
                                {p.projectName || 'Unnamed project'}
                                {p.status && (
                                  <span style={{ color: '#6366f1', fontWeight: 700 }}>{p.status}</span>
                                )}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="elm-detail-value">No assigned projects yet</span>
                        )}
                      </div>

                      {userSkills.length > 0 ? (
                        <div className="elm-skills-section">
                          <span className="elm-detail-label">Skills</span>
                          <div className="elm-skills-grid">
                            {userSkills.map((sk, idx) => (
                              <div key={idx} className="elm-skill-badge">
                                <span className="elm-skill-name">{sk.name}</span>
                                <span className={`elm-skill-level elm-skill-level--${(sk.level || 'junior').toLowerCase().replace(/\s+/g, '-')}`}>
                                  {sk.level}
                                </span>
                                {sk.experienceMonths > 0 && (
                                  <span className="elm-skill-years">{sk.experienceMonths} mois</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="elm-no-skills">No user_skill data yet.</div>
                      )}
                      <div className="elm-detail-grid">
                        {emp.company && (
                          <div className="elm-detail-item">
                            <span className="elm-detail-label">Company</span>
                            <span className="elm-detail-value">{emp.company}</span>
                          </div>
                        )}
                        {emp.phone && (
                          <div className="elm-detail-item">
                            <span className="elm-detail-label">Phone</span>
                            <span className="elm-detail-value">{emp.phone}</span>
                          </div>
                        )}
                        {emp.position && (
                          <div className="elm-detail-item elm-detail-item--full">
                            <span className="elm-detail-label">Position</span>
                            <span className="elm-detail-value">{emp.position}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
