import React, { useState } from 'react';
import RequiredSkillsList from './RequiredSkillsList';
import SmartSkillSelector from './SmartSkillSelector';
import SkillCategoryRequirementsTable from './SkillCategoryRequirementsTable';
import { useAuth } from '../../context/AuthContext';

export default function ProjectForm({ initial = {}, value, onChange, onSubmit }) {
  const { user } = useAuth();
  const [form, setForm] = useState(value || {
    name: '',
    manager: user?.email || '',
    startDate: '',
    duration: '',
    status: '',
    description: '',
    skillsNeeded: [],
    categoryRequirements: [],
    ...initial
  });

  React.useEffect(() => {
    if (value) {
      setForm(value);
    }
  }, [value]);

  React.useEffect(() => {
    if (user?.email && !form.manager) {
      setForm(prev => ({ ...prev, manager: user.email }));
    }
  }, [user?.email, form.manager]);

  const handleChange = (field) => (e) => {
    const updated = { ...form, [field]: e.target.value };
    setForm(updated);
    onChange && onChange(updated);
  };

  const handleSkillsChange = (skills) => {
    const updated = { ...form, skillsNeeded: skills };
    setForm(updated);
    onChange && onChange(updated);
  };

  const handleCategoryRequirementsChange = (categoryRequirements) => {
    const updated = { ...form, categoryRequirements };
    setForm(updated);
    onChange && onChange(updated);
  };

  const handleSubmit = () => {
    onSubmit && onSubmit(form);
  };

  return (
    <div className="cp-card">
      <div className="cp-card-header">
        <div className="cp-card-icon">
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="3" y="3" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.5"/><path d="M7 7h6M7 10h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
        </div>
        <div>
          <h2 className="cp-card-title">Create a new project</h2>
          <p className="cp-card-subtitle">Fill in the project information</p>
        </div>
      </div>
      <div className="cp-card-body">
        <div className="cp-form">
          {/* Form Fields */}
          <div className="cp-form-grid">
            <div className="cp-field">
              <label className="cp-label">Project name</label>
              <div className="cp-input-wrap">
                <span className="cp-input-icon">
                  <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><rect x="2" y="2" width="12" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.3"/><path d="M5 6h6M5 8.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                </span>
                <input className="cp-input has-icon" value={form.name || ''} onChange={handleChange('name')} placeholder="Project name" />
              </div>
            </div>
            <div className="cp-field">
              <label className="cp-label">Manager</label>
              <div className="cp-input-wrap">
                <span className="cp-input-icon">
                  <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.3"/><path d="M2.5 14c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                </span>
                <input className="cp-input has-icon" value={form.manager || ''} onChange={handleChange('manager')} readOnly />
              </div>
              <span className="cp-helper">Automatically set to your email</span>
            </div>
            <div className="cp-field">
              <label className="cp-label">Start date</label>
              <div className="cp-input-wrap">
                <span className="cp-input-icon">
                  <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M2 6.5h12M5.5 1.5v3M10.5 1.5v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                </span>
                <input className="cp-input has-icon" type="date" value={form.startDate || ''} onChange={handleChange('startDate')} />
              </div>
            </div>
            <div className="cp-field">
              <label className="cp-label">Duration</label>
              <div className="cp-input-wrap">
                <span className="cp-input-icon">
                  <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/><path d="M8 5v3.5l2.5 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <input className="cp-input has-icon" value={form.duration || ''} onChange={handleChange('duration')} placeholder="e.g. 6 months" />
              </div>
            </div>
            <div className="cp-field">
              <label className="cp-label">Status</label>
              <div className="cp-input-wrap">
                <span className="cp-input-icon">
                  <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M3 3h10v3l-3.5 3L13 12v3H3v-3l3.5-3L3 6V3z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <select className="cp-input cp-select has-icon" value={form.status || ''} onChange={handleChange('status')}>
                  <option value="">--</option>
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>
            <div className="cp-field">
              <label className="cp-label">Number of people</label>
              <div className="cp-input-wrap">
                <span className="cp-input-icon">
                  <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><circle cx="5.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3"/><circle cx="11" cy="5" r="2" stroke="currentColor" strokeWidth="1.2"/><path d="M1 13c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5" stroke="currentColor" strokeWidth="1.3"/><path d="M10 8.8c1.8.3 3.2 1.6 3.2 3.7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                </span>
                <input className="cp-input has-icon" type="number" min={1} value={form.count || ''} onChange={handleChange('count')} placeholder="e.g. 5" />
              </div>
              <span className="cp-helper">Number of people required for the project</span>
            </div>
          </div>

          <div className="cp-field">
            <label className="cp-label">Description</label>
            <textarea
              className="cp-input cp-textarea"
              rows={4}
              value={form.description || ''}
              onChange={handleChange('description')}
              placeholder="Describe the project, its goals, and the key deliverables..."
            />
          </div>

          {/* Skill Selector */}
          <SmartSkillSelector onSkillsSelected={handleSkillsChange} />

          {/* Required Skills List */}
          <RequiredSkillsList skills={form.skillsNeeded} onChange={handleSkillsChange} />

          {/* Category Requirements */}
          <SkillCategoryRequirementsTable
            requirements={form.categoryRequirements || []}
            onChange={handleCategoryRequirementsChange}
          />

          {/* Submit */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <button className="cp-btn cp-btn-primary" onClick={handleSubmit}>
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M13.3 4.7L6.5 11.5 2.7 7.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Save project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}