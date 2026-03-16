import React from 'react';
import { Box, Typography } from '@mui/material';
import Topbar from '../../components/layout/Topbar';
import KanbanBoard from '../../components/kanban/KanbanBoard';

export default function ProjectKanban() {
  return (
    <Box sx={{ bgcolor: '#f4f7fb', minHeight: '100vh' }}>
      <Topbar />
      <Box sx={{ p: 4, maxWidth: '1800px', width: '100%', mx: 'auto', mt: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>Mes Projets</Typography>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>Vue tableau de bord</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>Visualisez et modifiez rapidement les détails de chaque projet.</Typography>
        </Box>
        <KanbanBoard />
      </Box>
    </Box>
  );
}
