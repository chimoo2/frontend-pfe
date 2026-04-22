import React from 'react';
import ProjectForm from '../../components/project/ProjectForm';
import { useNavigate } from 'react-router-dom';
import { createProject as apiCreateProject } from '../../api/projectApi';
import './CreateProject.css';

export default function CreateProject() {
  const [projectData, setProjectData] = React.useState({});
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    if (!data.name || !data.manager || !data.startDate) {
      alert('Name, manager and start date are required');
      return;
    }

    const payload = {
      ...data,
      status: data.status || 'To Do',
      count: data.count ? parseInt(data.count) : null,
      requiredSkills: (data.skillsNeeded || []).map(s => ({
        skillName: s.skill || s.skillName || s.name,
        level: s.level,
        count: s.count,
        criticality: s.criticality,
        domain: s.domain,
        family: s.family,
        category: s.category,
        type: s.type
      })),
      categoryRequirements: (data.categoryRequirements || []).map(r => ({
        filterType: r.filterType,
        filterValue: r.filterValue,
        description: r.description,
        minCriticality: r.minCriticality
      }))
    };

    try {
      await apiCreateProject(payload);
      navigate('/manager/projects');
    } catch (err) {
      alert('Failed to save project: ' + err.message);
    }
  };

  const statusColors = {
    'To Do': '#6366f1',
    'In Progress': '#f59e0b',
    'Completed': '#10b981'
  };

  return (
    <div className="cp-page">
      <div className="cp-container">
        {/* Page Header */}
        <div className="cp-page-header">
          <h1 className="cp-page-title">Créer un projet</h1>
          <div className="cp-page-accent" />
          <p className="cp-page-desc">
            Remplissez le formulaire ci-dessous pour ajouter un nouveau projet. Toutes les informations peuvent être modifiées plus tard.
          </p>
        </div>

        {/* Grid: Form + Preview */}
        <div className="cp-grid">
          <div>
            <ProjectForm
              value={projectData}
              onChange={setProjectData}
              onSubmit={handleSubmit}
            />
          </div>

          {/* Sidebar Preview */}
          <div className="cp-preview">
            <div className="cp-preview-card">
              <div className="cp-preview-header">
                <svg width="18" height="18" fill="none" viewBox="0 0 18 18"><path d="M2 4.5A1.5 1.5 0 013.5 3h11A1.5 1.5 0 0116 4.5v9a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 012 13.5v-9z" stroke="#6366f1" strokeWidth="1.4"/><path d="M5 7.5h8M5 10.5h5" stroke="#6366f1" strokeWidth="1.3" strokeLinecap="round"/></svg>
                <h3 className="cp-preview-title">Aperçu</h3>
              </div>
              <div className="cp-preview-body">
                <div className="cp-preview-field">
                  <span className="cp-preview-label">Nom</span>
                  <span className="cp-preview-value">{projectData.name || '—'}</span>
                </div>
                <div className="cp-preview-divider" />
                <div className="cp-preview-field">
                  <span className="cp-preview-label">Manager</span>
                  <span className="cp-preview-value">{projectData.manager || '—'}</span>
                </div>
                <div className="cp-preview-divider" />
                <div className="cp-preview-field">
                  <span className="cp-preview-label">Statut</span>
                  {projectData.status ? (
                    <span className="cp-preview-status" style={{ color: statusColors[projectData.status] || '#64748b', background: `${statusColors[projectData.status] || '#64748b'}15` }}>
                      <span className="cp-preview-status-dot" style={{ background: statusColors[projectData.status] || '#64748b' }} />
                      {projectData.status}
                    </span>
                  ) : (
                    <span className="cp-preview-value">—</span>
                  )}
                </div>
                <div className="cp-preview-divider" />
                <div className="cp-preview-field">
                  <span className="cp-preview-label">Compétences requises</span>
                  <span className="cp-preview-value">
                    {(projectData.skillsNeeded || []).map(s => s.skill || s.skillName || '').filter(Boolean).join(', ') || '—'}
                  </span>
                </div>
                <div className="cp-preview-divider" />
                <div className="cp-preview-stats">
                  <div className="cp-preview-stat">
                    <span className="cp-preview-stat-val">{projectData.count || '—'}</span>
                    <span className="cp-preview-stat-label">Personnes</span>
                  </div>
                  <div className="cp-preview-stat">
                    <span className="cp-preview-stat-val">{(projectData.skillsNeeded || []).length}</span>
                    <span className="cp-preview-stat-label">Skills</span>
                  </div>
                  <div className="cp-preview-stat">
                    <span className="cp-preview-stat-val">{(projectData.categoryRequirements || []).length}</span>
                    <span className="cp-preview-stat-label">Catégories</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}