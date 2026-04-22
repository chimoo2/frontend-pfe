import React, { useState } from 'react';
import '../../pages/manager/CreateProject.css';

/**
 * SkillCategoryRequirementsTable
 * Allows manager to add skill family/category/type requirements
 * without specifying individual skills
 */
export default function SkillCategoryRequirementsTable({ requirements, onChange }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    filterType: 'family',
    filterValue: '',
    description: '',
    minCriticality: 3,
  });

  const filterOptions = {
    domain: ['Software Engineering', 'Data Engineering', 'Data & AI', 'Mobile', 'Infrastructure', 'Security', 'Business', 'HR Tech', 'Enterprise IT'],
    family: ['Backend', 'Frontend', 'DevOps', 'Data Science', 'Artificial Intelligence', 'Big Data', 'Mobile', 'QA', 'Analytics', 'Architecture', 'Testing', 'Monitoring', 'Soft Skill', 'Management', 'Methodology', 'Cloud', 'System', 'Database', 'Streaming', 'Workflow', 'Data Pipeline', 'Visualization', 'Certification', 'Leadership', 'LLM Engineering', 'MLOps', 'NLP', 'Computer Vision', 'Consulting'],
    category: ['Programming Language', 'Framework', 'Runtime', 'API Design', 'System Design', 'Design Pattern', 'Distributed Systems', 'Core AI', 'Advanced AI', 'Model Architecture', 'AI Domain', 'Technique', 'Operations', 'Data Preparation', 'Production', 'ML Framework', 'ML Library', 'Data Warehouse', 'Processing Engine', 'Distributed System', 'Event Streaming', 'Orchestration', 'Data Integration', 'Storage', 'Cloud Platform', 'Containerization', 'Infrastructure as Code', 'Automation', 'CI Tool', 'Operating System', 'Query Language', 'Relational DB', 'NoSQL DB', 'Cache', 'Enterprise DB', 'Data Processing', 'EDA', 'Modeling', 'Statistical Testing', 'Time Series', 'Markup', 'Styling', 'Core Security', 'Testing', 'Standard', 'Security', 'Management', 'People Management', 'Interpersonal', 'Framework', 'Design', 'Code Quality', 'Artifact Repository', 'Metrics', 'Visualization', 'Logging', 'Cognitive', 'Collaboration', 'Communication', 'Strategy', 'Generative AI', 'LLM', 'LLM Model', 'AI API', 'LLM Technique', 'Model Optimization', 'RAG', 'Vector Storage', 'Vector Database', 'Representation Learning', 'Experiment Tracking', 'Data Versioning', 'ML Orchestration', 'Monitoring', 'Model Monitoring', 'Model Validation', 'Feature Engineering', 'Data Management', 'Model Lifecycle', 'Identity', 'Scaled Agile', 'ITSM', 'Adaptability', 'Strategic Thinking', 'Innovation', 'Analysis', 'Documentation', 'Design', 'Advisory', 'Facilitation', 'Pre-Sales', 'Sales', 'Compute', 'Serverless', 'Version Control', 'CI/CD', 'Kubernetes Tooling', 'Processing', 'API Management', 'Authentication', 'API', 'Analytics', 'BI', 'Performance', 'Reporting', 'Cloud', 'ITSM', 'Compliance', 'Data Protection', 'Authorization', 'Role Management', 'Security Model', 'Audit', 'Risk Management', 'DevOps Platform', 'ML Platform', 'Governance', 'Quality', 'MDM', 'Traceability', 'Metadata', 'Discovery', 'Client Relations', 'Transformation', 'Financial Management', 'Program Delivery', 'Certification', 'Skill Assessment', 'Career Development', 'Resource Allocation', 'Competency Modeling', 'Planning', 'Leadership Development', 'Talent Analytics', 'Performance Management', 'AI Recommendation', 'Learning Strategy', 'Skill Transition', 'IT Strategy', 'Framework', 'IT Management', 'Innovation', 'Modeling', 'Modeling Standard', 'Enterprise Software', 'Customer Management', 'Relational DB', 'Regulatory', 'Privacy', 'Service Management', 'Generative AI'],
    type: ['Technical', 'Soft Skill', 'Strategic', 'Certification', 'Regulatory'],
  };

  const filterTypeLabels = {
    domain: 'Domaine',
    family: 'Famille',
    category: 'Catégorie',
    type: 'Type',
  };

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({
      filterType: 'family',
      filterValue: '',
      description: '',
      minCriticality: 3,
    });
    setOpenDialog(true);
  };

  const handleEditClick = (req) => {
    setEditingId(req.id);
    setFormData(req);
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (!formData.filterValue) {
      alert('Veuillez sélectionner une valeur');
      return;
    }

    if (editingId) {
      const updated = requirements.map((r) =>
        r.id === editingId ? { ...formData, id: editingId } : r
      );
      onChange(updated);
    } else {
      const newReq = {
        id: Date.now(),
        ...formData,
      };
      onChange([...requirements, newReq]);
    }

    setOpenDialog(false);
  };

  const handleDelete = (id) => {
    onChange(requirements.filter((r) => r.id !== id));
  };

  return (
    <div className="cp-section">
      <div className="cp-section-header">
        <h4 className="cp-section-title">
          <svg width="17" height="17" fill="none" viewBox="0 0 17 17"><rect x="2" y="2" width="13" height="13" rx="3" stroke="#6366f1" strokeWidth="1.2"/><path d="M5.5 6.5h6M5.5 8.7h4M5.5 10.9h5" stroke="#6366f1" strokeWidth="1.1" strokeLinecap="round"/></svg>
          Exigences par catégorie
          {requirements.length > 0 && <span className="cp-count-pill">{requirements.length}</span>}
        </h4>
        <button className="cp-btn cp-btn-sm cp-btn-add" onClick={handleAddClick}>
          <svg width="14" height="14" fill="none" viewBox="0 0 14 14"><path d="M7 3v8M3 7h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
          Ajouter
        </button>
      </div>
      <p className="cp-section-desc">Ajoutez des exigences par famille, catégorie ou type de compétences</p>

      {requirements.length > 0 ? (
        <div className="cp-table-wrap">
          <table className="cp-table">
            <thead>
              <tr>
                <th>Type de filtre</th>
                <th>Valeur</th>
                <th>Description</th>
                <th>Min Criticité</th>
                <th style={{ width: 90 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requirements.map((req) => (
                <tr key={req.id}>
                  <td>
                    <span className="cp-chip" style={{ cursor: 'default', fontSize: '0.78rem', padding: '3px 10px' }}>
                      {filterTypeLabels[req.filterType] || req.filterType}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{req.filterValue}</td>
                  <td style={{ color: req.description ? '#334155' : '#94a3b8' }}>{req.description || '—'}</td>
                  <td>{req.minCriticality || '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="cp-btn-icon-sm" onClick={() => handleEditClick(req)} title="Modifier">
                        <svg width="13" height="13" fill="none" viewBox="0 0 13 13"><path d="M9.1 1.9l2 2-7.2 7.2H1.9V9.1l7.2-7.2z" stroke="#6366f1" strokeWidth="1.1" strokeLinejoin="round"/></svg>
                      </button>
                      <button className="cp-btn-icon-sm cp-btn-danger-sm" onClick={() => handleDelete(req.id)} title="Supprimer">
                        <svg width="13" height="13" fill="none" viewBox="0 0 13 13"><path d="M2 3.25h9M4.5 3.25V2.17a.83.83 0 01.83-.84h2.34a.83.83 0 01.83.84V3.25m1.25 0v6.58a.83.83 0 01-.83.84H4.08a.83.83 0 01-.83-.84V3.25h6.5z" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="cp-empty">
          <svg width="40" height="40" fill="none" viewBox="0 0 40 40"><rect x="4" y="4" width="32" height="32" rx="8" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4"/><path d="M14 16h12M14 20h8M14 24h10" stroke="#94a3b8" strokeWidth="1.3" strokeLinecap="round"/></svg>
          <p style={{ margin: 0, fontWeight: 600, color: '#64748b' }}>Aucune exigence catégorie ajoutée</p>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Cliquez sur "Ajouter" pour définir des exigences</span>
        </div>
      )}

      {/* Add/Edit Modal */}
      {openDialog && (
        <div className="cp-modal-overlay" onClick={() => setOpenDialog(false)}>
          <div className="cp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cp-modal-header">
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="3" y="3" width="14" height="14" rx="3" stroke="#6366f1" strokeWidth="1.4"/><path d="M7 7.5h6M7 10h4M7 12.5h5" stroke="#6366f1" strokeWidth="1.2" strokeLinecap="round"/></svg>
              <h3 className="cp-modal-title">
                {editingId ? "Modifier l'exigence" : 'Ajouter une exigence de catégorie'}
              </h3>
            </div>
            <div className="cp-modal-body">
              <div className="cp-field">
                <label className="cp-label">Type de filtre</label>
                <select
                  className="cp-input cp-select"
                  value={formData.filterType}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      filterType: e.target.value,
                      filterValue: '',
                    });
                  }}
                >
                  <option value="domain">Domaine</option>
                  <option value="family">Famille</option>
                  <option value="category">Catégorie</option>
                  <option value="type">Type</option>
                </select>
              </div>

              <div className="cp-field">
                <label className="cp-label">Valeur</label>
                <select
                  className="cp-input cp-select"
                  value={formData.filterValue}
                  onChange={(e) =>
                    setFormData({ ...formData, filterValue: e.target.value })
                  }
                >
                  <option value="">-- Sélectionner --</option>
                  {(filterOptions[formData.filterType] || []).map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="cp-field">
                <label className="cp-label">Description (optionnel)</label>
                <textarea
                  className="cp-input cp-textarea"
                  rows={2}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Description de l'exigence..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }}>
                <div className="cp-field">
                  <label className="cp-label">Criticité minimum (1-5)</label>
                  <input
                    className="cp-input"
                    type="number"
                    min={1}
                    max={5}
                    value={formData.minCriticality}
                    onChange={(e) =>
                      setFormData({ ...formData, minCriticality: parseInt(e.target.value) || 1 })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="cp-modal-footer">
              <button className="cp-btn cp-btn-sm cp-btn-cancel" onClick={() => setOpenDialog(false)}>
                Annuler
              </button>
              <button className="cp-btn cp-btn-sm cp-btn-primary" onClick={handleSave}>
                <svg width="14" height="14" fill="none" viewBox="0 0 14 14"><path d="M11.5 4.5L5.75 10.25 2.5 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
