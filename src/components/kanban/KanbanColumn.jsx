import React, { useState } from 'react';
import AddCardModal from './AddCardModal';
import KanbanCard from './KanbanCard';

export default function KanbanColumn({ name, color, icon, cards = [], onAdd, onCardClick, hideAdd = false, isMatching = false }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`kb-column ${isMatching ? 'kb-column-matching' : ''}`}>
      {/* Column header */}
      <div className="kb-col-header">
        <div className="kb-col-title-row">
          <span className="kb-col-icon">{icon || '📌'}</span>
          <h3 className="kb-col-title">{name}</h3>
          <span className="kb-col-count" style={{ background: `${color}15`, color }}>{cards.length}</span>
        </div>
        <div className="kb-col-bar" style={{ background: color }} />
      </div>

      {/* Add button */}
      {!hideAdd && (
        <button
          className="kb-add-btn"
          style={{ '--accent': color }}
          onClick={() => setOpen(true)}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 14 14"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          Add New Task
        </button>
      )}

      {/* Cards */}
      <div className="kb-col-cards">
        {cards.length === 0 ? (
          <div className="kb-empty">
            <svg width="40" height="40" fill="none" viewBox="0 0 40 40"><rect x="4" y="8" width="32" height="24" rx="4" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 3"/><path d="M14 18h12M14 22h8" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <span>No projects yet</span>
          </div>
        ) : (
          cards.map(c => (
            <KanbanCard key={c.id} {...c} accentColor={color} onClick={() => onCardClick && onCardClick(c)} />
          ))
        )}
      </div>

      {!hideAdd && (
        <AddCardModal
          open={open}
          onClose={() => setOpen(false)}
          onSave={(card) => { onAdd(card); setOpen(false); }}
        />
      )}
    </div>
  );
}
