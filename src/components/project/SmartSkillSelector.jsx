import React, { useState, useEffect } from 'react';
import { getDomains, getSkillsByDomain } from '../../api/skillApi';

/**
 * SmartSkillSelector - Let manager select skills by Domain, Family, or Category
 * Instead of typing individual skill names
 */
export default function SmartSkillSelector({ onSkillsSelected }) {
  // Dropdown filters
  const [domains, setDomains] = useState([]);
  const [families, setFamilies] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Selected values
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedFamily, setSelectedFamily] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Results
  const [suggestedSkills, setSuggestedSkills] = useState([]);
  const [domainSkills, setDomainSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load domains on mount
  useEffect(() => {
    const loadDomains = async () => {
      try {
        setLoading(true);
        const domainsList = await getDomains();
        setDomains(domainsList || []);
      } catch (err) {
        console.error('Failed to load domains:', err);
        setError('Could not load skill domains');
      } finally {
        setLoading(false);
      }
    };
    loadDomains();
  }, []);

  // When domain changes, fetch skills for that domain
  useEffect(() => {
    if (selectedDomain) {
      const loadSkills = async () => {
        try {
          const skills = await getSkillsByDomain(selectedDomain);
          setDomainSkills(skills || []);
          setSuggestedSkills(skills || []);
          const familiesSet = new Set();
          const categoriesSet = new Set();
          (skills || []).forEach(skill => {
            if (skill.family) familiesSet.add(skill.family);
            if (skill.category) categoriesSet.add(skill.category);
          });
          setFamilies(Array.from(familiesSet));
          setCategories(Array.from(categoriesSet));
        } catch (err) {
          console.error('Failed to load skills for domain:', err);
        }
      };
      loadSkills();
    } else {
      setDomainSkills([]);
      setSuggestedSkills([]);
      setFamilies([]);
      setCategories([]);
      setSelectedFamily('');
      setSelectedCategory('');
    }
  }, [selectedDomain]);

  // When family changes, filter skills and update categories
  useEffect(() => {
    if (selectedFamily) {
      const filtered = (domainSkills || []).filter(s => s.family === selectedFamily);
      setSuggestedSkills(filtered);
      const categoriesSet = new Set();
      filtered.forEach(skill => {
        if (skill.category) categoriesSet.add(skill.category);
      });
      setCategories(Array.from(categoriesSet));
    } else {
      setSuggestedSkills(domainSkills);
      const categoriesSet = new Set();
      (domainSkills || []).forEach(skill => {
        if (skill.category) categoriesSet.add(skill.category);
      });
      setCategories(Array.from(categoriesSet));
    }
    setSelectedCategory('');
  }, [selectedFamily, domainSkills]);

  // When category changes, filter skills
  useEffect(() => {
    let baseSkills = domainSkills;
    if (selectedFamily) {
      baseSkills = domainSkills.filter(s => s.family === selectedFamily);
    }
    if (selectedCategory) {
      const filtered = baseSkills.filter(s => s.category === selectedCategory);
      setSuggestedSkills(filtered);
    } else {
      setSuggestedSkills(baseSkills);
    }
  }, [selectedCategory, selectedFamily, domainSkills]);

  const toggleSkillSelection = (skillName) => {
    const exists = selectedSkills.find(s => s.skillName === skillName);
    let updated;
    if (exists) {
      updated = selectedSkills.filter(s => s.skillName !== skillName);
    } else {
      const meta = (domainSkills || []).find(s => s.skillName === skillName) ||
                   (suggestedSkills || []).find(s => s.skillName === skillName) || {};
      updated = [...selectedSkills, {
        skillName: skillName,
        domain: meta.domain,
        family: meta.family,
        category: meta.category,
        type: meta.type,
        criticality: meta.criticality || null,
        level: 'Intermediate',
        count: 1
      }];
    }

    setSelectedSkills(updated);

    const skillsData = updated.map(s => ({
      skillName: s.skillName,
      level: s.level,
      count: s.count,
      criticality: s.criticality,
      domain: s.domain,
      family: s.family,
      category: s.category,
      type: s.type
    }));

    onSkillsSelected && onSkillsSelected(skillsData);
  };

  const clearSelection = () => {
    setSelectedSkills([]);
    onSkillsSelected && onSkillsSelected([]);
  };

  return (
    <div className="cp-section">
      <h4 className="cp-section-title">
        <svg width="17" height="17" fill="none" viewBox="0 0 17 17"><circle cx="8.5" cy="8.5" r="6.5" stroke="#6366f1" strokeWidth="1.3"/><path d="M8.5 5.5v3.5l2.5 1.5" stroke="#6366f1" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        Select required skills
      </h4>

      {error && <div className="cp-alert cp-alert-error">{error}</div>}

      <div className="cp-selector-grid">
        <div className="cp-field">
          <label className="cp-label">Domain</label>
          <select
            className="cp-input cp-select"
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            disabled={loading || domains.length === 0}
          >
            <option value="">-- Select --</option>
            {domains.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="cp-field">
          <label className="cp-label">Family</label>
          <select
            className="cp-input cp-select"
            value={selectedFamily}
            onChange={(e) => setSelectedFamily(e.target.value)}
            disabled={!selectedDomain || families.length === 0}
          >
            <option value="">-- Select --</option>
            {families.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div className="cp-field">
          <label className="cp-label">Category</label>
          <select
            className="cp-input cp-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            disabled={!selectedDomain || categories.length === 0}
          >
            <option value="">-- Select --</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Available Skills */}
      {suggestedSkills.length > 0 && (
        <div className="cp-chips-card">
          <p className="cp-chips-label">Available skills</p>
          <div className="cp-chips-wrap">
            {suggestedSkills.map((skill) => {
              const isSelected = selectedSkills.some(s => s.skillName === skill.skillName);
              return (
                <button
                  key={skill.skillName}
                  className={`cp-chip ${isSelected ? 'cp-chip-selected' : ''}`}
                  onClick={() => toggleSkillSelection(skill.skillName)}
                  style={{ opacity: skill.criticality >= 4 ? 1 : 0.75 }}
                >
                  {skill.skillName}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Skills */}
      {selectedSkills.length > 0 && (
        <div className="cp-selected-card">
          <div className="cp-selected-header">
            <span className="cp-selected-count">
              Selected skills ({selectedSkills.length})
            </span>
            <button className="cp-btn cp-btn-sm cp-btn-danger-text" onClick={clearSelection}>
              Clear
            </button>
          </div>
          <div className="cp-chips-wrap">
            {selectedSkills.map((s) => (
              <span key={s.skillName} className="cp-chip cp-chip-selected">
                {s.skillName}
                <span className="cp-chip-delete" onClick={() => toggleSkillSelection(s.skillName)}>
                  <svg width="12" height="12" fill="none" viewBox="0 0 12 12"><path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="cp-loading">
          <div className="cp-spinner" />
          <span>Loading domains...</span>
        </div>
      )}
    </div>
  );
}
