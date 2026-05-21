import React, { useState, useEffect } from 'react';
import { Box, Dialog, DialogTitle, DialogContent, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import KanbanColumn from '../../components/kanban/KanbanColumn';
import { getMatchedProjects } from '../../utils/matchingHistory';
import { getAllProjects } from '../../api/projectApi';
import Matching from './Matching';
import { useOutletContext } from 'react-router-dom';

export default function MatchingKanban() {
  const [columns, setColumns] = useState({ todo: [], inprogress: [], completed: [] });
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const { search } = useOutletContext() || {};

  const filterCards = (cards) => {
    if (!search || !search.trim()) return cards;
    const q = search.toLowerCase();
    return cards.filter(c =>
      (c.name || '').toLowerCase().includes(q) ||
      (c.description || '').toLowerCase().includes(q)
    );
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projects = await getAllProjects();
        const matchedIds = getMatchedProjects();
        // only include those the user has opened for matching
        const filtered = projects.filter(p => matchedIds.includes(p.id));
        const cols = { todo: [], inprogress: [], completed: [] };
        filtered.forEach(p => {
          const card = { id: p.id, name: p.name, description: p.description, status: p.status, isMatching: true };
          const st = (p.status || '').toLowerCase();
          if (st.includes('progress') || st.includes('in progress')) cols.inprogress.push(card);
          else if (st.includes('complete') || st.includes('done')) cols.completed.push(card);
          else cols.todo.push(card);
        });
        setColumns(cols);
      } catch (err) {
        console.error('could not load projects for matching kanban', err);
      }
    };
    fetchProjects();
  }, []);

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6, px: 4, bgcolor: '#f3f4f6' }}>
        <Box sx={{ width: '100%', maxWidth: 1320, bgcolor: '#ffffff', borderRadius: 14, p: 4, boxShadow: '0 20px 60px rgba(15,23,42,0.1)' }}>
          <Typography variant="h4" align="center" sx={{ mb: 4, fontWeight: 700 }}>Matching Board</Typography>
          {columns.todo.length === 0 && columns.inprogress.length === 0 && columns.completed.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
              No projects have been opened for matching yet.<br />
              Use the "View Matching" button on a project to make it visible here.
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 28, overflowX: 'auto', alignItems: 'flex-start', minHeight: 520 }}>
              <KanbanColumn
                name="To Do"
                color="#6366f1"
                cards={filterCards(columns.todo)}
                onCardClick={c => setSelectedProjectId(c.id)}
                hideAdd
                isMatching
              />
              <KanbanColumn
                name="In Progress"
                color="#f59e0b"
                cards={filterCards(columns.inprogress)}
                onCardClick={c => setSelectedProjectId(c.id)}
                hideAdd
                isMatching
              />
              <KanbanColumn
                name="Completed"
                color="#10b981"
                cards={filterCards(columns.completed)}
                onCardClick={c => setSelectedProjectId(c.id)}
                hideAdd
                isMatching
              />
            </Box>
          )}
        </Box>
      </Box>

      <Dialog
        open={!!selectedProjectId}
        onClose={() => setSelectedProjectId(null)}
        fullWidth
        maxWidth="xl"
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Matching Details
          <IconButton
            aria-label="close"
            onClick={() => setSelectedProjectId(null)}
            sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedProjectId && <Matching projectIdProp={selectedProjectId} embedded />}
        </DialogContent>
      </Dialog>
    </>
  );
}
