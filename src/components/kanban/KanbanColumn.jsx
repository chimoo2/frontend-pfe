import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, Button, Divider } from '@mui/material';
import AddCardModal from './AddCardModal';
import KanbanCard from './KanbanCard';

export default function KanbanColumn({ name, color, cards = [], onAdd, onCardClick, hideAdd = false, isMatching = false }) {
  const [open, setOpen] = useState(false);

  // slightly different appearance when used in matching context
  const containerStyle = {
    minWidth: 380,
    maxWidth: 420,
    flexShrink: 0,
    backgroundColor: isMatching ? '#fafbff' : '#ffffff',
    padding: 18,
    borderRadius: 12,
    boxShadow: isMatching ? '0 12px 40px rgba(15,23,42,0.1)' : '0 10px 30px rgba(15,23,42,0.05)'
  };

  return (
    <div style={containerStyle}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Box sx={{ height: 6, flex: 1, bgcolor: color, borderRadius: 8, mr: 1 }} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 0.6 }}>{name}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>{cards.length}</Typography>
        </Box>
      </Box>
      <Divider sx={{ mb: 1, borderColor: '#eef2f7' }} />
      {!hideAdd && (
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          sx={{ textTransform: 'none', bgcolor: color, '&:hover': { bgcolor: color }, width: '100%', mb: 1, borderRadius: 2 }}
        >
          + Add New Task
        </Button>
      )}
      <Box sx={{ minHeight: 160, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {cards.length === 0 ? (
          <Box sx={{ p: 2, borderRadius: 1, bgcolor: '#fbfdff', textAlign: 'center', color: 'text.secondary' }}>Aucun projet</Box>
        ) : (
          cards.map(c => (
            <KanbanCard key={c.id} {...c} onClick={() => onCardClick && onCardClick(c)} />
          ))
        )}
      </Box>

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
