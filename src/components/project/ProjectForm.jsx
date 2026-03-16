import React, { useState } from 'react';
import { Box, TextField, Typography, Button, Grid, Paper, InputAdornment } from '@mui/material';
import { Business as BusinessIcon, Person as PersonIcon, DateRange as DateRangeIcon, Timer as TimerIcon, Flag as FlagIcon, Description as DescriptionIcon } from '@mui/icons-material';
import RequiredSkillsList from './RequiredSkillsList';
import SmartSkillSelector from './SmartSkillSelector';
import SkillCategoryRequirementsTable from './SkillCategoryRequirementsTable';
import { useAuth } from '../../context/AuthContext';

export default function ProjectForm({ initial = {}, value, onChange, onSubmit }) {
  const { user } = useAuth();
  const [form, setForm] = useState(value || {
    name: '',
    manager: user?.email || '',
    startDate: '',
    duration: '',
    status: '',
    description: '',
    skillsNeeded: [],
    categoryRequirements: [],
    ...initial
  });

  React.useEffect(() => {
    if (value) {
      setForm(value);
    }
  }, [value]);

  React.useEffect(() => {
    if (user?.email && !form.manager) {
      setForm(prev => ({ ...prev, manager: user.email }));
    }
  }, [user?.email, form.manager]);

  const handleChange = (field) => (e) => {
    const updated = { ...form, [field]: e.target.value };
    setForm(updated);
    onChange && onChange(updated);
  };

  const handleSkillsChange = (skills) => {
    const updated = { ...form, skillsNeeded: skills };
    setForm(updated);
    onChange && onChange(updated);
  };

  const handleCategoryRequirementsChange = (categoryRequirements) => {
    const updated = { ...form, categoryRequirements };
    setForm(updated);
    onChange && onChange(updated);
  };

  const handleSubmit = () => {
    onSubmit && onSubmit(form);
  };

  return (
    <Paper sx={{ p: 5, borderRadius: 3, boxShadow: '0 10px 40px rgba(15,23,42,0.08)', borderLeft: '6px solid #6366f1', bgcolor: '#fbfdff' }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, letterSpacing: 0.5, color: '#334155' }}>
        Créer un nouveau projet
      </Typography>
      <Box sx={{ height: 3, width: 50, bgcolor: '#6366f1', mb: 4, borderRadius: 2 }} />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Nom du projet"
            value={form.name}
            onChange={handleChange('name')}
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BusinessIcon sx={{ color: '#6366f1', mr: 1 }} />
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Manager"
            value={form.manager}
            onChange={handleChange('manager')}
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon sx={{ color: '#6366f1', mr: 1 }} />
                </InputAdornment>
              ),
              readOnly: true
            }}
            helperText="Automatiquement défini avec votre email"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Date de début"
            value={form.startDate}
            onChange={handleChange('startDate')}
            type="date"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DateRangeIcon sx={{ color: '#6366f1', mr: 1 }} />
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Durée"
            value={form.duration}
            onChange={handleChange('duration')}
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <TimerIcon sx={{ color: '#6366f1', mr: 1 }} />
                </InputAdornment>
              )
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Statut"
            value={form.status}
            onChange={handleChange('status')}
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FlagIcon sx={{ color: '#6366f1', mr: 1 }} />
                </InputAdornment>
              )
            }}
            SelectProps={{
              native: true
            }}
          >
            <option value="">--</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Description"
            value={form.description}
            onChange={handleChange('description')}
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <DescriptionIcon sx={{ color: '#6366f1', mr: 1 }} />
                </InputAdornment>
              )
            }}
          />
        </Grid>
      </Grid>

      <SmartSkillSelector onSkillsSelected={handleSkillsChange} />

      <RequiredSkillsList skills={form.skillsNeeded} onChange={handleSkillsChange} />

      <SkillCategoryRequirementsTable 
        requirements={form.categoryRequirements || []} 
        onChange={handleCategoryRequirementsChange} 
      />

      <Box sx={{ mt: 4, textAlign: 'right' }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            textTransform: 'none',
            bgcolor: 'linear-gradient(90deg, #6366f1, #4f46e5)',
            px: 4,
            py: 1.5,
            '&:hover': { bgcolor: 'linear-gradient(90deg, #4f46e5, #6366f1)' }
          }}
        >
          Enregistrer le projet
        </Button>
      </Box>
    </Paper>
  );
}