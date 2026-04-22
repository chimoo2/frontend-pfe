import React from "react";
import "./skill.css";

const LEVEL_MAP = {
  Expert:        { color: "#059669", bg: "#ecfdf5", pct: 100 },
  Senior:        { color: "#2563eb", bg: "#eff6ff", pct: 75 },
  Intermediate:  { color: "#d97706", bg: "#fffbeb", pct: 50 },
  Junior:        { color: "#64748b", bg: "#f1f5f9", pct: 25 },
};

const COLUMNS = [
  { key: "name",       label: "Skill",      icon: "💡" },
  { key: "category",   label: "Category",   icon: "📂" },
  { key: "family",     label: "Family",     icon: "🏷️" },
  { key: "type",       label: "Type",       icon: "⚙️" },
  { key: "level",      label: "Level",      icon: "📊" },
  { key: "domain",     label: "Domain",     icon: "🌐" },
  { key: "experience", label: "Experience", icon: "⏱️" },
];

export default function SkillSection({
  aiSkills,
  editingAiSkill,
  editAiForm,
  onStartEditingAiSkill,
  onCancelEditingAiSkill,
  onSaveAiSkill,
  onDeleteAiSkill,
  onAiEditInputChange,
  sectionId = "skills",
}) {
  const levelInfo = (lvl) => LEVEL_MAP[lvl] || LEVEL_MAP.Junior;

  return (
    <section id={sectionId} className="sk-section">
      {/* ---- Banner ---- */}
      <div className="sk-banner">
        <div className="sk-banner-dots" />
        <div className="sk-banner-content">
          <div>
            <h1 className="sk-title">My Skills</h1>
            <p className="sk-subtitle">
              AI-extracted skills from your CV — edit, review or remove entries.
            </p>
          </div>
          <span className="sk-count">{aiSkills.length} skill{aiSkills.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* ---- Content ---- */}
      {aiSkills.length === 0 ? (
        <div className="sk-empty">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <circle cx="28" cy="28" r="28" fill="#eff6ff" />
            <path d="M20 30l4 4 12-12" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h3>No skills detected yet</h3>
          <p>Upload your CV to let the AI extract your competencies automatically.</p>
        </div>
      ) : (
        <div className="sk-table-wrap">
          <table className="sk-table">
            <thead>
              <tr>
                <th className="sk-th-num">#</th>
                {COLUMNS.map((c) => (
                  <th key={c.key}>
                    <span className="sk-th-icon">{c.icon}</span> {c.label}
                  </th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {aiSkills.map((skill, index) => {
                const editing = editingAiSkill === index;
                const lv = levelInfo(editing ? editAiForm.level : skill.level);

                return (
                  <tr key={index} className={editing ? "sk-row-editing" : ""}>
                    <td className="sk-cell-num">{index + 1}</td>

                    {COLUMNS.map((c) => {
                      if (c.key === "level") {
                        return (
                          <td key={c.key}>
                            {editing ? (
                              <select
                                className="sk-input sk-select"
                                name="level"
                                value={editAiForm.level}
                                onChange={onAiEditInputChange}
                              >
                                {Object.keys(LEVEL_MAP).map((l) => (
                                  <option key={l} value={l}>{l}</option>
                                ))}
                              </select>
                            ) : (
                              <span className="sk-level-badge" style={{ color: lv.color, background: lv.bg }}>
                                <span className="sk-level-dot" style={{ background: lv.color }} />
                                {skill.level || "—"}
                              </span>
                            )}
                          </td>
                        );
                      }

                      if (c.key === "experience") {
                        return (
                          <td key={c.key}>
                            {editing ? (
                              <input
                                className="sk-input sk-input-num"
                                name="experience"
                                type="number"
                                value={editAiForm.experience}
                                onChange={onAiEditInputChange}
                                min="0"
                                max="120"
                              />
                            ) : (
                              <span className="sk-exp">
                                {skill.experience ? `${skill.experience} mois` : "0 mois"}
                              </span>
                            )}
                          </td>
                        );
                      }

                      return (
                        <td key={c.key}>
                          {editing ? (
                            <input
                              className="sk-input"
                              name={c.key}
                              value={editAiForm[c.key]}
                              onChange={onAiEditInputChange}
                            />
                          ) : (
                            <span className="sk-cell-text">{skill[c.key] || "—"}</span>
                          )}
                        </td>
                      );
                    })}

                    <td>
                      <div className="sk-actions">
                        {editing ? (
                          <>
                            <button className="sk-btn sk-btn-save" onClick={() => onSaveAiSkill(index)} title="Save">
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </button>
                            <button className="sk-btn sk-btn-cancel" onClick={onCancelEditingAiSkill} title="Cancel">
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                            </button>
                          </>
                        ) : (
                          <>
                            <button className="sk-btn sk-btn-edit" onClick={() => onStartEditingAiSkill(skill, index)} title="Edit">
                              <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M10.586 1.586a2 2 0 012.828 2.828L5.5 12.328 1.5 13.5l1.172-4L10.586 1.586z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </button>
                            <button className="sk-btn sk-btn-delete" onClick={() => onDeleteAiSkill(index)} title="Delete">
                              <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2 4h11M5.5 4V2.5a1 1 0 011-1h2a1 1 0 011 1V4m1.5 0v8a1.5 1.5 0 01-1.5 1.5h-5A1.5 1.5 0 013.5 12V4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
