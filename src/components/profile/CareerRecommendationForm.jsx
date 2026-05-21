import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/apiClient';
import './CareerRecommendationForm.css';

const AVAILABLE_ROLES = [
  'Junior Developer', 'Developer', 'Senior Developer', 'Tech Lead', 'Architect',
  'Junior QA Engineer', 'QA Engineer', 'Senior QA Engineer', 'QA Lead', 'QA Manager',
  'Junior DevOps Engineer', 'DevOps Engineer', 'Senior DevOps Engineer', 'DevOps Lead', 'DevOps Architect',
  'Data Analyst', 'Senior Data Analyst', 'Data Scientist', 'Data Architect', 'Chief Data Officer',
  'Junior Data Engineer', 'Data Engineer', 'Senior Data Engineer', 'Data Engineering Lead', 'Data Platform Architect',
  'ML Engineer', 'Senior ML Engineer', 'ML Architect', 'AI Research Lead', 'Chief AI Officer',
  'Business Analyst', 'Senior Business Analyst', 'BI Analyst', 'BI Manager', 'BI Director',
  'Junior Designer', 'Designer', 'Senior Designer', 'Design Lead', 'Creative Director',
  'Junior Consultant', 'Consultant', 'Senior Consultant', 'Manager', 'Director',
  'Financial Analyst', 'Senior Financial Analyst', 'Finance Manager', 'Finance Director', 'CFO',
  'Security Analyst', 'Senior Security Engineer', 'Security Architect', 'Security Manager', 'CISO',
];

const EDUCATION_LEVELS = ['Bachelor', 'Master', 'PhD'];
const DOMAINS = ['Technology', 'Design', 'Finance', 'Consulting'];
const INTERESTS = [
  'Data Science', 'Machine Learning', 'Artificial Intelligence', 'Web Development',
  'Mobile Development', 'DevOps', 'Cloud Computing', 'Cybersecurity', 'UI/UX Design',
  'Product Management', 'Business Analysis', 'Financial Analysis', 'Consulting',
  'Project Management', 'Quality Assurance', 'Database Administration', 'Network Engineering'
];

const deriveCareerStage = (yearsExperience) => {
  const years = Number(yearsExperience);
  if (!Number.isFinite(years) || years < 0) return 'Entry';
  if (years < 3) return 'Entry';
  if (years < 7) return 'Mid';
  if (years < 12) return 'Advanced';
  if (years < 18) return 'Management';
  return 'Leadership';
};

const deriveCareerTrack = (domain, currentRole) => {
  const role = (currentRole || '').toLowerCase();
  const dom = (domain || '').toLowerCase();

  if (role.includes('qa') || role.includes('quality') || role.includes('test')) return 'Quality Engineering';
  if (role.includes('devops') || role.includes('platform') || role.includes('cloud')) return 'Cloud & Platform';
  if (role.includes('data') || role.includes('bi') || role.includes('analytics')) return 'Data & Analytics';
  if (role.includes('ml') || role.includes('ai')) return 'AI Engineering';
  if (role.includes('security') || role.includes('cyber')) return 'Cybersecurity';
  if (role.includes('consult') || role.includes('business analyst')) return 'Consulting';
  if (role.includes('design') || role.includes('ux') || role.includes('ui')) return 'Design';
  if (role.includes('finance') || role.includes('financial') || role.includes('cfo')) return 'Finance';
  if (dom.includes('consulting')) return 'Consulting';
  if (dom.includes('design')) return 'Design';
  if (dom.includes('finance')) return 'Finance';
  return 'Software Engineering';
};

const extractApiErrorMessage = (errorData) => {
  if (!errorData) return 'Failed to get recommendation';

  if (typeof errorData.detail === 'string') {
    return errorData.detail;
  }

  if (Array.isArray(errorData.detail)) {
    return errorData.detail
      .map((item) => {
        if (item?.msg && Array.isArray(item?.loc)) {
          return `${item.loc.join('.')} : ${item.msg}`;
        }
        if (item?.msg) return item.msg;
        return JSON.stringify(item);
      })
      .join('\n');
  }

  if (typeof errorData.message === 'string') {
    return errorData.message;
  }

  return 'Failed to get recommendation';
};

const CareerRecommendationForm = ({ employeeSkills = [] }) => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    current_role: '',
    years_experience: '',
    education_level: '',
    skills: employeeSkills.join(', '),
    performance_rating: '',
    domain: '',
    certifications: '',
    interests: [],
  });

  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    setFormData(prev => ({ ...prev, skills: employeeSkills.join(', ') }));
  }, [employeeSkills]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const toggleInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }));
    setError(null);
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.current_role.trim()) errors.push('Current role is required');
    else if (!AVAILABLE_ROLES.includes(formData.current_role)) errors.push('Selected role is not available');
    if (!formData.years_experience || formData.years_experience < 0 || formData.years_experience > 50) errors.push('Years of experience must be between 0 and 50');
    if (!formData.education_level) errors.push('Education level is required');
    if (!formData.performance_rating || formData.performance_rating < 1 || formData.performance_rating > 5) errors.push('Performance rating must be between 1 and 5');
    if (!formData.domain) errors.push('Domain is required');
    if (!formData.skills.trim()) errors.push('Skills cannot be empty');
    if (!formData.interests || formData.interests.length === 0) errors.push('Please select at least one interest');
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const errors = validateForm();
    if (errors.length > 0) { setError(errors.join('\n')); return; }
    setLoading(true);

    try {
      const careerStage = deriveCareerStage(formData.years_experience);
      const careerTrack = deriveCareerTrack(formData.domain, formData.current_role);
      const payload = {
        current_role: formData.current_role,
        education_level: formData.education_level,
        career_stage: careerStage,
        career_track: careerTrack,
        years_experience: parseInt(formData.years_experience),
        performance_rating: parseInt(formData.performance_rating),
        skills: formData.skills,
        certifications: formData.certifications || '',
        domain: formData.domain,
        interests: formData.interests.join(', '),
      };

      let data;
      try {
        data = await apiClient('/api/career/recommend', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      } catch (callErr) {
        let errorData = null;
        try {
          errorData = JSON.parse(callErr.message);
        } catch (_) {
          // Keep fallback message when body is not JSON.
        }
        throw new Error(extractApiErrorMessage(errorData) || callErr.message || 'Failed to get recommendation');
      }

      const normalizedConfidence = typeof data.confidence === 'number'
        ? (data.confidence > 1 ? data.confidence / 100 : data.confidence)
        : data.next_role_probability;
      const normalized = {
        ...data,
        current_role: data.current_role || formData.current_role,
        next_role_probability: normalizedConfidence,
        confidence: normalizedConfidence,
        top_3_recommendations: (data.top_3_recommendations || []).map((rec) => ({
          ...rec,
          confidence_percentage: rec.confidence ?? rec.confidence_percentage ?? 0,
        })),
        career_path: (data.career_path || []).map((s) => ({
          ...s,
          step: s.position ?? s.step,
        })),
        total_path_length: (data.career_path || []).length,
        current_position_in_path: data.current_position_in_path ?? null,
      };
      setRecommendation(normalized);
      setSuccess(true);
      setStep(1);
    } catch (err) {
      setError(err.message || 'Failed to connect to recommendation service');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      current_role: '',
      years_experience: '',
      education_level: '',
      skills: employeeSkills.join(', '),
      performance_rating: '',
      domain: '',
      certifications: '',
      interests: [],
    });
    setRecommendation(null);
    setSuccess(false);
    setError(null);
    setStep(0);
  };

  /* ───── Stepper ───── */
  const Stepper = () => (
    <div className="crf-stepper">
      <div className={`crf-step ${step >= 0 ? 'crf-step-active' : ''}`}>
        <span className="crf-step-num">1</span>
        <span className="crf-step-label">Fill Profile</span>
      </div>
      <div className="crf-step-line" />
      <div className={`crf-step ${step >= 1 ? 'crf-step-active' : ''}`}>
        <span className="crf-step-num">2</span>
        <span className="crf-step-label">View Recommendation</span>
      </div>
    </div>
  );

  /* ───── Step 0 : Form ───── */
  if (step === 0) {
    return (
      <div className="crf-root">
        <Stepper />

        {error && (
          <div className="crf-alert crf-alert-error">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8" stroke="#dc2626" strokeWidth="1.6"/><path d="M9 5.5v4M9 12h.01" stroke="#dc2626" strokeWidth="1.6" strokeLinecap="round"/></svg>
            <span>{error}</span>
          </div>
        )}

        <form className="crf-form" onSubmit={handleSubmit}>
          <div className="crf-grid">
            {/* Current Role */}
            <div className="crf-field">
              <label className="crf-label">Current Role <span className="crf-req">*</span></label>
              <select className="crf-select" name="current_role" value={formData.current_role} onChange={handleInputChange} required>
                <option value="">Select a role...</option>
                {AVAILABLE_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {/* Years of Experience */}
            <div className="crf-field">
              <label className="crf-label">Years of Experience <span className="crf-req">*</span></label>
              <input className="crf-input" type="number" name="years_experience" placeholder="e.g. 5" value={formData.years_experience} onChange={handleInputChange} min="0" max="50" required />
            </div>

            {/* Education Level */}
            <div className="crf-field">
              <label className="crf-label">Education Level <span className="crf-req">*</span></label>
              <select className="crf-select" name="education_level" value={formData.education_level} onChange={handleInputChange} required>
                <option value="">Select level...</option>
                {EDUCATION_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            {/* Domain */}
            <div className="crf-field">
              <label className="crf-label">Domain <span className="crf-req">*</span></label>
              <select className="crf-select" name="domain" value={formData.domain} onChange={handleInputChange} required>
                <option value="">Select domain...</option>
                {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {/* Performance Rating */}
            <div className="crf-field">
              <label className="crf-label">Performance Rating <span className="crf-req">*</span></label>
              <select className="crf-select" name="performance_rating" value={formData.performance_rating} onChange={handleInputChange} required>
                <option value="">Select rating...</option>
                {[1, 2, 3, 4, 5].map(r => <option key={r} value={r}>{r} — {'⭐'.repeat(r)}</option>)}
              </select>
            </div>

            {/* Certifications */}
            <div className="crf-field">
              <label className="crf-label">Certifications</label>
              <input className="crf-input" name="certifications" placeholder="e.g. AWS Certified, PMP" value={formData.certifications} onChange={handleInputChange} />
            </div>
          </div>

          {/* Interests */}
          <div className="crf-field crf-field-full">
            <label className="crf-label">Interests <span className="crf-req">*</span></label>
            <div className="crf-chips">
              {INTERESTS.map(interest => (
                <button type="button" key={interest}
                  className={`crf-chip ${formData.interests.includes(interest) ? 'crf-chip-active' : ''}`}
                  onClick={() => toggleInterest(interest)}>
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="crf-field crf-field-full">
            <label className="crf-label">Skills (from CV) <span className="crf-req">*</span></label>
            <textarea className="crf-textarea" name="skills" rows="3" value={formData.skills} onChange={handleInputChange} required />
            <span className="crf-hint">Skills extracted from your CV</span>
          </div>

          {/* Buttons */}
          <div className="crf-actions">
            <button type="submit" className="crf-btn crf-btn-primary" disabled={loading}>
              {loading ? (
                <span className="crf-spinner" />
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 9.5l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Get Recommendation
                </>
              )}
            </button>
            <button type="button" className="crf-btn crf-btn-outline" onClick={handleReset} disabled={loading}>Reset</button>
          </div>
        </form>
      </div>
    );
  }

  /* ───── Step 1 : Results ───── */
  return (
    <div className="crf-root">
      <Stepper />

      {success && (
        <div className="crf-alert crf-alert-success">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8" stroke="#059669" strokeWidth="1.6"/><path d="M6 9.5l2 2 4-4" stroke="#059669" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span>Recommendation generated successfully!</span>
        </div>
      )}

      {recommendation && (
        <div className="crf-results">
          {/* Main recommendation */}
          <div className="crf-result-card crf-result-main">
            <span className="crf-result-tag">Current Role</span>
            <span className="crf-current-role">{recommendation.current_role}</span>
            <div className="crf-next-role">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M4 11h14M13 5l5 6-5 6" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <div>
                <h3>Next Role: {recommendation.next_role}</h3>
              </div>
            </div>
          </div>

          {/* Top 3 */}
          {recommendation.top_3_recommendations?.length > 0 && (
            <div className="crf-result-card">
              <h3 className="crf-card-title">Top 3 Recommendations</h3>
              <div className="crf-top3">
                {recommendation.top_3_recommendations.map((rec, i) => {
                  const colors = ['#059669', '#2563eb', '#d97706'];
                  return (
                    <div className="crf-top3-item" key={i}>
                      <span className="crf-top3-rank" style={{ background: colors[i] }}>{i + 1}</span>
                      <span className="crf-top3-role">{rec.role}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Career Path */}
          {recommendation.career_path?.length > 0 && (
            <div className="crf-result-card">
              <h3 className="crf-card-title">Your Career Path ({recommendation.total_path_length} steps)</h3>
              {recommendation.current_position_in_path && (
                <div className="crf-alert crf-alert-info" style={{ marginBottom: '1rem' }}>
                  You are at step {recommendation.current_position_in_path} of {recommendation.total_path_length}
                </div>
              )}
              <div className="crf-path">
                {recommendation.career_path.map((s, i) => {
                  const pos = recommendation.current_position_in_path;
                  const state = pos === s.step ? 'current' : pos > s.step ? 'done' : 'future';
                  return (
                    <div className={`crf-path-step crf-path-${state}`} key={i}>
                      <span className="crf-path-num">{s.step}</span>
                      <div className="crf-path-info">
                        <strong>{s.role}</strong>
                        {s.description && <span>{s.description}</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="crf-actions">
            <button className="crf-btn crf-btn-primary" onClick={handleReset}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 9a7 7 0 1114 0A7 7 0 012 9z" stroke="currentColor" strokeWidth="1.8"/><path d="M9 5v4l2.5 2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              New Recommendation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerRecommendationForm;
