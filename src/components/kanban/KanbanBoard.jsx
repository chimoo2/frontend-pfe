import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import KanbanColumn from './KanbanColumn';
import ProjectDetailModal from './ProjectDetailModal';
import { getProjectsByManager, updateProject, deleteProject } from '../../api/projectApi';
import { useAuth } from '../../context/AuthContext';

const initialData = { todo: [], inprogress: [], completed: [] };

export default function KanbanBoard() {
  const { user } = useAuth();
  const [data, setData] = useState(initialData);
  const [selected, setSelected] = useState(null);

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
            duration: p.duration,
            status: p.status,
            manager: p.manager,
            skillsNeeded: (p.requiredSkills || []).map(s => ({
                skill: s.skillName,
                level: s.level,
                count: s.count,
                domain: s.domain,
                family: s.family,
                category: s.category,
                type: s.type
            })),
            categoryRequirements: p.categoryRequirements || [],
            teamAssigned: []
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
        requiredSkills: (updated.skillsNeeded || []).map(s => ({
          skillName: s.skill,
          level: s.level,
          count: s.count,
          domain: s.domain,
          family: s.family,
          category: s.category,
          type: s.type
        })),
        categoryRequirements: updated.categoryRequirements || []
      };
      const res = await updateProject(updated.id, payload);
      console.log('Project updated on server', res);

      // update local state
      setData(prev => {
        const columns = ['todo','inprogress','completed'];
        let newData = { ...prev };
        columns.forEach(col => {
          newData[col] = newData[col].map(item => item.id === res.id ? {
            ...item,
            ...res,
            skillsNeeded: (res.requiredSkills || []).map(s => ({
                skill: s.skillName,
                level: s.level,
                count: s.count,
                domain: s.domain,
                family: s.family,
                category: s.category,
                type: s.type
            })),
            categoryRequirements: res.categoryRequirements || []
          } : item);
        });
        return newData;
      });
      setSelected(res);
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

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6, px: 4, bgcolor: '#eef2f7' }}>
        <Box sx={{ width: '100%', maxWidth: 1320, bgcolor: '#ffffff', borderRadius: 14, p: 4, boxShadow: '0 18px 50px rgba(15,23,42,0.06)' }}>
          <Box sx={{ display: 'flex', gap: 28, overflowX: 'auto', alignItems: 'flex-start', minHeight: 520 }}>
            <KanbanColumn
              name="To Do"
              color="#6366f1"
              cards={data.todo}
              onCardClick={(c)=>setSelected(c)}
              hideAdd
            />
            <KanbanColumn
              name="In Progress"
              color="#f59e0b"
              cards={data.inprogress}
              onCardClick={(c)=>setSelected(c)}
              hideAdd
            />
            <KanbanColumn
              name="Completed"
              color="#10b981"
              cards={data.completed}
              onCardClick={(c)=>setSelected(c)}
              hideAdd
            />
          </Box>
        </Box>
      </Box>
      <ProjectDetailModal
        open={!!selected}
        onClose={()=>setSelected(null)}
        project={selected}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </>
  );
}
