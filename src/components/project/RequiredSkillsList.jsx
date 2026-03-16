import React from 'react';
import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow, TextField, IconButton } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Lightbulb as LightbulbIcon } from '@mui/icons-material';

export default function RequiredSkillsList({ skills = [], onChange }) {
  const handleFieldChange = (index, field) => (e) => {
    const newSkills = [...skills];
    newSkills[index] = { ...newSkills[index], [field]: e.target.value };
    onChange && onChange(newSkills);
  };

  const addSkill = () => {
    onChange && onChange([...skills, { skillName: '', level: '', count: '' }]);
  };

  const removeSkill = (index) => {
    if (!onChange) return;
    onChange(skills.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LightbulbIcon sx={{ color: '#6366f1' }} />
          <Box component="span" sx={{ fontWeight: 600, fontSize: '1rem' }}>Compétences requises</Box>
        </Box>
        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={addSkill}
          sx={{ textTransform: 'none', bgcolor: '#6366f1', color: '#fff', '&:hover': { bgcolor: '#4f46e5' } }}
        >
          Ajouter
        </Button>
      </Box>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Compétence</TableCell>
            <TableCell>Domaine</TableCell>
            <TableCell>Famille</TableCell>
            <TableCell>Catégorie</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Niveau</TableCell>
            <TableCell style={{ width: 80 }}>Nombre</TableCell>
            <TableCell style={{ width: 40 }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {skills.map((s, i) => (
            <TableRow key={i}>
              <TableCell>
                <TextField
                  value={s.skillName || ''}
                  onChange={handleFieldChange(i, 'skillName')}
                  size="small"
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={s.domain || ''}
                  onChange={handleFieldChange(i, 'domain')}
                  size="small"
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={s.family || ''}
                  onChange={handleFieldChange(i, 'family')}
                  size="small"
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={s.category || ''}
                  onChange={handleFieldChange(i, 'category')}
                  size="small"
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={s.type || ''}
                  onChange={handleFieldChange(i, 'type')}
                  size="small"
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={s.level || ''}
                  onChange={handleFieldChange(i, 'level')}
                  size="small"
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <TextField
                  value={s.count || ''}
                  onChange={handleFieldChange(i, 'count')}
                  size="small"
                  type="number"
                  sx={{ maxWidth: 80 }}
                />
              </TableCell>
              <TableCell>
                <IconButton size="small" color="error" onClick={() => removeSkill(i)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}