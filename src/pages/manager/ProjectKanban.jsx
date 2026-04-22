import React from 'react';
import KanbanBoard from '../../components/kanban/KanbanBoard';
import { useNavigate } from 'react-router-dom';
import '../../components/kanban/KanbanBoard.css';

export default function ProjectKanban() {
  const navigate = useNavigate();

  return (
    <div className="kb-page">
      <div className="kb-page-header">
        <div>
          <h1 className="kb-page-title">My Projects</h1>
          <p className="kb-page-subtitle">Visualize, manage and track all your projects at a glance</p>
        </div>
        <button className="kb-new-btn" onClick={() => navigate('/manager/projects/new')}>
          <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          New Project
        </button>
      </div>
      <KanbanBoard />
    </div>
  );
}
