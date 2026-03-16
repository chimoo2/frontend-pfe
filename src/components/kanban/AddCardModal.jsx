import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

export default function AddCardModal({ open, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [label, setLabel] = useState('');

  const handleSave = () => {
    if (title.trim()) {
      onSave({ title, label, avatars: [], comments: 0 });
      setTitle('');
      setLabel('');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>Add New Task</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Title"
          type="text"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Label (optional)"
          type="text"
          fullWidth
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">Add</Button>
      </DialogActions>
    </Dialog>
  );
}
