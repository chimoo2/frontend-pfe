import React, { useState, useEffect } from 'react';
import KanbanColumn from './KanbanColumn';
import ProjectDetailModal from './ProjectDetailModal';
import EmployeeListModal from './EmployeeListModal';
import { getProjectsByManager, updateProject, deleteProject } from '../../api/projectApi';
import { useAuth } from '../../context/AuthContext';
import './KanbanBoard.css';

const initialData = { todo: [], inprogress: [], completed: [] };

const mapTeamMembers = (teamMembers = []) =>
  (Array.isArray(teamMembers) ? teamMembers : []).map((member) => ({
    id: member.id,
    name: `${member.firstName || ''} ${member.lastName || ''}`.trim() || member.email || 'Unknown',
    role: member.role || 'Member',
    level: member.level || ''
  }));

export default function KanbanBoard({ search = '' }) {
  const { user } = useAuth();
  const [data, setData] = useState(initialData);
  const [selected, setSelected] = useState(null);
  const [assignProject, setAssignProject] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      if (!user?.email) return;

      try {
        const projects = await getProjectsByManager(user.email);
        // map projects into columns
        const columns = { todo: [], inprogress: [], completed: [] };
        projects.forEach(p => {
          const card = {
            id: p.id,
            name: p.name,
            description: p.description,
            startDate: p.startDate,
            endDate: p.endDate,
            duration: p.duration,
            status: p.status,
            manager: p.manager,
            count: p.count,
            skillsNeeded: (p.requiredSkills || []).map(s => ({
                skill: s.skillName,
                criticality: s.criticality,
                domain: s.domain,
                family: s.family,
                category: s.category,
                type: s.type
            })),
            categoryRequirements: p.categoryRequirements || [],
            teamAssigned: mapTeamMembers(p.teamMembers)
          };

          const st = (p.status || '').toLowerCase();
          if (st.includes('progress') || st.includes('in progress')) columns.inprogress.push(card);
          else if (st.includes('complete') || st.includes('done')) columns.completed.push(card);
          else columns.todo.push(card);
        });

        setData(columns);
      } catch (err) {
        console.error('Failed to load projects', err);
      }
    };

    fetch();
  }, [user?.email]);

  // debug helper to show current loaded data in console
  useEffect(() => {
    console.log('Kanban data updated', data);
  }, [data]);

  const handleSave = async (updated) => {
    // send update to backend, then refresh local state with returned project or refetch all
    try {
      const payload = {
        ...updated,
        categoryRequirements: updated.categoryRequirements || []
      };

      if (updated.requiredSkills !== undefined) {
        payload.requiredSkills = updated.requiredSkills;
      } else if (updated.skillsNeeded !== undefined) {
        payload.requiredSkills = (updated.skillsNeeded || []).map(s => ({
          skillName: s.skill || s.skillName || '',
          criticality: s.criticality,
          domain: s.domain,
          family: s.family,
          category: s.category,
          type: s.type
        }));
      }

      const res = await updateProject(updated.id, payload);
      console.log('Project updated on server', res);

      const normalizedRes = {
        ...res,
        duration: res.duration || updated.duration || '',
        count: res.count != null ? res.count : updated.count,
        skillsNeeded: (res.requiredSkills || []).map(s => ({
          skill: s.skillName,
          criticality: s.criticality,
          domain: s.domain,
          family: s.family,
          category: s.category,
          type: s.type
        })),
        categoryRequirements: res.categoryRequirements || [],
        teamAssigned: mapTeamMembers(res.teamMembers),
      };

      // update local state
      setData(prev => {
        const columns = ['todo','inprogress','completed'];
        let newData = { ...prev };
        columns.forEach(col => {
          newData[col] = newData[col].map(item => item.id === res.id ? { ...item, ...normalizedRes } : item);
        });
        return newData;
      });
      setSelected(normalizedRes);
    } catch (err) {
      console.error('Failed to update project', err);
      alert('Update failed: ' + err.message);
    }
  };

  const handleDelete = async (projectId) => {
    try {
      await deleteProject(projectId);
      setData(prev => {
        const columns = ['todo','inprogress','completed'];
        let newData = { ...prev };
        columns.forEach(col => {
          newData[col] = newData[col].filter(item => item.id !== projectId);
        });
        return newData;
      });
      setSelected(null);
    } catch (err) {
      console.error('Failed to delete project', err);
      alert('Delete failed: ' + err.message);
    }
  };

  const filterCards = (cards) => {
    if (!search || !search.trim()) return cards;
    const q = search.toLowerCase();
    return cards.filter(c =>
      (c.name || '').toLowerCase().includes(q) ||
      (c.description || '').toLowerCase().includes(q) ||
      (c.manager || '').toLowerCase().includes(q)
    );
  };

  const handleProjectAssignmentUpdated = (updatedProject) => {
    if (!updatedProject?.id) return;

    const normalizedProject = {
      ...updatedProject,
      skillsNeeded: (updatedProject.requiredSkills || []).map(s => ({
        skill: s.skillName,
        criticality: s.criticality,
        domain: s.domain,
        family: s.family,
        category: s.category,
        type: s.type
      })),
      categoryRequirements: updatedProject.categoryRequirements || [],
      teamAssigned: mapTeamMembers(updatedProject.teamMembers)
    };

    setData(prev => {
      const columns = ['todo', 'inprogress', 'completed'];
      const next = { ...prev };
      columns.forEach(col => {
        next[col] = next[col].map(item => item.id === updatedProject.id ? { ...item, ...normalizedProject } : item);
      });
      return next;
    });

    setSelected(prev => prev && prev.id === updatedProject.id ? { ...prev, ...normalizedProject } : prev);
  };

  return (
    <>
      <div className="kb-board">
        <div className="kb-columns">
          <KanbanColumn
            name="To Do"
            color="#6366f1"
            icon="📋"
            cards={filterCards(data.todo)}
            onCardClick={(c) => setSelected(c)}
            onAssignClick={(c) => setAssignProject(c)}
            hideAdd
          />
          <KanbanColumn
            name="In Progress"
            color="#f59e0b"
            icon="⚡"
            cards={filterCards(data.inprogress)}
            onCardClick={(c) => setSelected(c)}
            onAssignClick={(c) => setAssignProject(c)}
            hideAdd
          />
          <KanbanColumn
            name="Completed"
            color="#10b981"
            icon="✅"
            cards={filterCards(data.completed)}
            onCardClick={(c) => setSelected(c)}
            onAssignClick={(c) => setAssignProject(c)}
            hideAdd
          />
        </div>
      </div>
      <ProjectDetailModal
        open={!!selected}
        onClose={() => setSelected(null)}
        project={selected}
        onSave={handleSave}
        onDelete={handleDelete}
      />
      {assignProject && (
        <EmployeeListModal
          project={assignProject}
          onProjectUpdated={handleProjectAssignmentUpdated}
          onClose={() => setAssignProject(null)}
        />
      )}
    </>
  );
}
