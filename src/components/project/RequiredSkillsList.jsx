import React from 'react';

export default function RequiredSkillsList({ skills = [], onChange }) {
  const handleFieldChange = (index, field) => (e) => {
    const newSkills = [...skills];
    newSkills[index] = { ...newSkills[index], [field]: e.target.value };
    onChange && onChange(newSkills);
  };

  const addSkill = () => {
    onChange && onChange([...skills, { skillName: '', level: '', count: '' }]);
  };

  const removeSkill = (index) => {
    if (!onChange) return;
    onChange(skills.filter((_, i) => i !== index));
  };

  return (
    <div className="cp-section">
      <div className="cp-section-header">
        <h4 className="cp-section-title">
          <svg width="17" height="17" fill="none" viewBox="0 0 17 17"><path d="M8.5 2.5l2 4 4.5.65-3.25 3.17.77 4.47L8.5 12.5l-4.02 2.29.77-4.47L2 7.15l4.5-.65 2-4z" stroke="#6366f1" strokeWidth="1.2" strokeLinejoin="round"/></svg>
          Compétences requises
          {skills.length > 0 && <span className="cp-count-pill">{skills.length}</span>}
        </h4>
        <button className="cp-btn cp-btn-sm cp-btn-add" onClick={addSkill}>
          <svg width="14" height="14" fill="none" viewBox="0 0 14 14"><path d="M7 3v8M3 7h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
          Ajouter
        </button>
      </div>

      {skills.length > 0 ? (
        <div className="cp-table-wrap">
          <table className="cp-table">
            <thead>
              <tr>
                <th>Compétence</th>
                <th>Domaine</th>
                <th>Famille</th>
                <th>Catégorie</th>
                <th>Type</th>
                <th style={{width:80}}>Criticité</th>
                <th>Niveau</th>
                <th style={{width:70}}>Nombre</th>
                <th style={{width:44}}></th>
              </tr>
            </thead>
            <tbody>
              {skills.map((s, i) => (
                <tr key={i}>
                  <td><input className="cp-table-input" value={s.skillName || ''} onChange={handleFieldChange(i, 'skillName')} placeholder="Nom" /></td>
                  <td><input className="cp-table-input" value={s.domain || ''} onChange={handleFieldChange(i, 'domain')} /></td>
                  <td><input className="cp-table-input" value={s.family || ''} onChange={handleFieldChange(i, 'family')} /></td>
                  <td><input className="cp-table-input" value={s.category || ''} onChange={handleFieldChange(i, 'category')} /></td>
                  <td><input className="cp-table-input" value={s.type || ''} onChange={handleFieldChange(i, 'type')} /></td>
                  <td><input className="cp-table-input" type="number" value={s.criticality || ''} onChange={handleFieldChange(i, 'criticality')} style={{maxWidth:70}} min="1" max="5" /></td>
                  <td><input className="cp-table-input" value={s.level || ''} onChange={handleFieldChange(i, 'level')} /></td>
                  <td><input className="cp-table-input" type="number" value={s.count || ''} onChange={handleFieldChange(i, 'count')} style={{maxWidth:70}} /></td>
                  <td>
                    <button className="cp-btn-icon-sm cp-btn-danger-sm" onClick={() => removeSkill(i)} title="Supprimer">
                      <svg width="14" height="14" fill="none" viewBox="0 0 14 14"><path d="M2 3.5h10M4.67 3.5V2.33a.83.83 0 01.83-.83h3a.83.83 0 01.83.83V3.5m1.34 0v6.67a.83.83 0 01-.84.83H4.17a.83.83 0 01-.84-.83V3.5h7.34z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="cp-empty">
          <svg width="40" height="40" fill="none" viewBox="0 0 40 40"><rect x="4" y="4" width="32" height="32" rx="8" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4"/><path d="M20 14v12M14 20h12" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <p style={{margin:0, fontWeight:600, color:'#64748b'}}>Aucune compétence ajoutée</p>
          <span style={{fontSize:'0.8rem', color:'#94a3b8'}}>Utilisez le sélecteur ci-dessus ou ajoutez manuellement</span>
        </div>
      )}
    </div>
  );
}