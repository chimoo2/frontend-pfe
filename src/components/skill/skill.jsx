import React, { useState } from "react";
import "./skill.css";

const LEVEL_MAP = {
  Expert:        { color: "#059669", bg: "#ecfdf5", pct: 100 },
  Senior:        { color: "#2563eb", bg: "#eff6ff", pct: 75 },
  Intermediate:  { color: "#d97706", bg: "#fffbeb", pct: 50 },
  Junior:        { color: "#64748b", bg: "#f1f5f9", pct: 25 },
};

const COLUMNS = [
  { key: "skill_name",  label: "Skill",      icon: "💡" },
  { key: "category",   label: "Category",   icon: "📂" },
  { key: "family",     label: "Family",     icon: "🏷️" },
  { key: "type",       label: "Type",       icon: "⚙️" },
  { key: "level",      label: "Level",      icon: "📊" },
  { key: "domain",     label: "Domain",     icon: "🌐" },
  { key: "experience", label: "Experience", icon: "⏱️" },
];

const getSkillFieldValue = (skill, key) => {
  if (key === "skill_name") {
    return skill?.skill_name || skill?.name || "";
  }
  return skill?.[key] ?? "";
};

export default function SkillSection({
  skills = [],
  editingSkill,
  editForm,
  onStartEditingSkill,
  onCancelEditingSkill,
  onSaveSkill,
  onDeleteSkill,
  onEditInputChange,
  onAddSkillClick,
  isAddingSkill = false,
  sectionId = "skills",
}) {
  const levelInfo = (lvl) => LEVEL_MAP[lvl] || LEVEL_MAP.Junior;
  const [deleteTarget, setDeleteTarget] = useState(null); // { rowId, name }

  const requestDelete = (rowId, skill) => {
    setDeleteTarget({
      rowId,
      name: getSkillFieldValue(skill, "skill_name") || "this skill",
    });
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      onDeleteSkill(deleteTarget.rowId);
      setDeleteTarget(null);
    }
  };

  const cancelDelete = () => setDeleteTarget(null);

  const rows = editingSkill === "new"
    ? [{ __new: true, skill_name: "", category: "", family: "", type: "Technical", level: "Intermediate", domain: "", experience: 0 }, ...skills]
    : skills;

  return (
    <section id={sectionId} className="sk-section">
      {/* ---- Banner ---- */}
      <div className="sk-banner">
        <div className="sk-banner-dots" />
        <div className="sk-banner-content">
          <div>
            <h1 className="sk-title">My Skills</h1>
            <p className="sk-subtitle">
              Vos compétences enregistrées — ajoutez, modifiez ou supprimez-les.
            </p>
          </div>
          <span className="sk-count">{skills.length} skill{skills.length !== 1 ? "s" : ""}</span>
          <button className="sk-btn sk-btn-add" style={{marginLeft: 16}} onClick={onAddSkillClick}>+ Add Skill</button>
        </div>
      </div>

      {/* ---- Content ---- */}
      {skills.length === 0 && editingSkill !== "new" ? (
        <div className="sk-empty">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <circle cx="28" cy="28" r="28" fill="#eff6ff" />
            <path d="M20 30l4 4 12-12" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h3>No skills detected yet</h3>
          <p>Ajoutez vos compétences pour commencer.</p>
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
              {rows.map((skill, index) => {
                const rowId = skill.__new ? "new" : (editingSkill === "new" ? index - 1 : index);
                const editing = editingSkill === rowId;
                const lv = levelInfo(editing ? editForm.level : skill.level);

                return (
                  <tr key={skill.__new ? "new-row" : index} className={editing ? "sk-row-editing" : ""}>
                    <td className="sk-cell-num">{index + 1}</td>

                    {COLUMNS.map((c) => {
                      if (c.key === "level") {
                        return (
                          <td key={c.key}>
                            {editing ? (
                              <select
                                className="sk-input sk-select"
                                name="level"
                                value={editForm.level}
                                onChange={onEditInputChange}
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
                                value={editForm.experience}
                                onChange={onEditInputChange}
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
                              value={editForm[c.key] ?? ""}
                              onChange={onEditInputChange}
                            />
                          ) : (
                            <span className="sk-cell-text">{getSkillFieldValue(skill, c.key) || "—"}</span>
                          )}
                        </td>
                      );
                    })}

                    <td>
                      <div className="sk-actions">
                        {editing ? (
                          <>
                            <button className="sk-btn sk-btn-save" onClick={() => onSaveSkill(rowId)} title="Save">
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </button>
                            <button className="sk-btn sk-btn-cancel" onClick={onCancelEditingSkill} title="Cancel">
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                            </button>
                          </>
                        ) : (
                          <>
                           <button
  className="sk-btn sk-btn-edit"
  onClick={() => onStartEditingSkill(skill, rowId)}
  title="Modifier"
>
  ✏️
</button>
                            <button
  className="sk-btn sk-btn-delete"
  onClick={() => requestDelete(rowId, skill)}
  title="Delete"
>
  🗑️
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

      {deleteTarget && (
        <div
          className="sk-modal-overlay"
          onClick={cancelDelete}
          role="dialog"
          aria-modal="true"
        >
          <div className="sk-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sk-modal-icon" aria-hidden="true">⚠️</div>
            <h3 className="sk-modal-title">Delete skill?</h3>
            <p className="sk-modal-text">
              Are you sure you want to delete <strong>{deleteTarget.name}</strong>?
              This action cannot be undone.
            </p>
            <div className="sk-modal-actions">
              <button
                className="sk-btn sk-modal-btn sk-modal-cancel"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="sk-btn sk-modal-btn sk-modal-confirm"
                onClick={confirmDelete}
                autoFocus
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
