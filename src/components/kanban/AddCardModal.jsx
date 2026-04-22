import React, { useState, useEffect, useRef } from 'react';
import './KanbanBoard.css';

export default function AddCardModal({ open, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [label, setLabel] = useState('');
  const titleRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTitle('');
      setLabel('');
      setTimeout(() => titleRef.current?.focus(), 120);
    }
  }, [open]);

  const handleSave = () => {
    if (title.trim()) {
      onSave({ title, label, avatars: [], comments: 0 });
      setTitle('');
      setLabel('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  if (!open) return null;

  return (
    <div className="km-overlay" onClick={onClose}>
      <div className="km-modal km-modal-sm" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="km-header">
          <div className="km-header-icon">
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
              <rect x="2" y="2" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.6"/>
              <path d="M10 6v8M6 10h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <h3 className="km-title">New Project</h3>
            <p className="km-subtitle">Add a new project to the board</p>
          </div>
          <button className="km-close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M5 5l8 8M13 5l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="km-body">
          <div className="km-field">
            <label className="km-label">Project Name</label>
            <input
              ref={titleRef}
              className="km-input"
              type="text"
              placeholder="e.g. Data Migration Platform"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="km-field">
            <label className="km-label">Label <span className="km-optional">optional</span></label>
            <input
              className="km-input"
              type="text"
              placeholder="e.g. High Priority"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="km-footer">
          <button className="km-btn km-btn-cancel" onClick={onClose}>Cancel</button>
          <button
            className="km-btn km-btn-primary"
            onClick={handleSave}
            disabled={!title.trim()}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
}
