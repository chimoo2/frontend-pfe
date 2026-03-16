import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Table, TableBody, TableCell, TableHead, TableRow, TextField, Grid, Card, CardContent, IconButton } from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import SkillCategoryRequirementsTable from '../project/SkillCategoryRequirementsTable';
import { markProjectMatched } from '../../utils/matchingHistory';

export default function ProjectDetailModal({ open, onClose, project, onSave, onDelete }) {
  const navigate = useNavigate();
  const [form, setForm] = React.useState(project || {});

  React.useEffect(() => {
    setForm(project || {});
  }, [project]);

  if (!project) return null;

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSkillChange = (index, field) => (e) => {
    const newSkills = [...(form.skillsNeeded || [])];
    newSkills[index] = { ...newSkills[index], [field]: e.target.value };
    setForm(prev => ({ ...prev, skillsNeeded: newSkills }));
  };

  const addSkill = () => {
    setForm(prev => ({
      ...prev,
      skillsNeeded: [...(prev.skillsNeeded || []),
        { skill: '', level: 'Intermediate', count: 1, domain: '', family: '', category: '', type: '' }
      ]
    }));
  };

  const removeSkill = (index) => {
    const newSkills = (form.skillsNeeded || []).filter((_, i) => i !== index);
    setForm(prev => ({ ...prev, skillsNeeded: newSkills }));
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle sx={{ bgcolor: '#f7fafc' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{form.name}</Typography>
          <Box>
            <Button
              color="error"
              variant="outlined"
              sx={{ mr: 1 }}
              startIcon={<DeleteIcon />}
              onClick={() => {
                if (window.confirm('Confirmer la suppression de ce projet ?')) {
                  onDelete && onDelete(form.id);
                  onClose();
                }
              }}
            >
              Supprimer
            </Button>
            <Button color="primary" variant="contained" onClick={() => onSave && onSave(form)}>Save</Button>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Box sx={{ mb: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="Name"
                value={form.name || ''}
                onChange={handleChange('name')}
                fullWidth
              />
              <TextField
                label="Manager"
                value={form.manager || ''}
                onChange={handleChange('manager')}
                fullWidth
              />
              <TextField
                label="Start Date"
                value={form.startDate || ''}
                onChange={handleChange('startDate')}
                fullWidth
              />
              <TextField
                label="Duration"
                value={form.duration || ''}
                onChange={handleChange('duration')}
                fullWidth
              />
              <TextField
                select
                label="Status"
                value={form.status || ''}
                onChange={handleChange('status')}
                fullWidth
                SelectProps={{ native: true }}
              >
                <option value="">--</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </TextField>
              <TextField
                label="Description"
                value={form.description || ''}
                onChange={handleChange('description')}
                fullWidth
                multiline
                rows={3}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle1">Required Skills</Typography>
              <Button size="small" startIcon={<AddIcon />} onClick={addSkill} sx={{ textTransform: 'none' }}>Add Skill</Button>
            </Box>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Skill</TableCell>
                  <TableCell>Domain</TableCell>
                  <TableCell>Family</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Level Required</TableCell>
                  <TableCell style={{ width: 80 }}>Count</TableCell>
                  <TableCell style={{ width: 40 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(form.skillsNeeded||[]).map((s,i)=>(
                  <TableRow key={i}>
                    <TableCell>
                      <TextField
                        value={s.skill || ''}
                        onChange={handleSkillChange(i, 'skill')}
                        size="small"
                        fullWidth
                        sx={{ maxWidth: 150 }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={s.domain || ''}
                        disabled
                        size="small"
                        fullWidth
                        sx={{ maxWidth: 120 }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={s.family || ''}
                        disabled
                        size="small"
                        fullWidth
                        sx={{ maxWidth: 120 }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={s.category || ''}
                        disabled
                        size="small"
                        fullWidth
                        sx={{ maxWidth: 120 }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={s.type || ''}
                        disabled
                        size="small"
                        fullWidth
                        sx={{ maxWidth: 120 }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={s.level || ''}
                        onChange={handleSkillChange(i, 'level')}
                        size="small"
                        fullWidth
                        sx={{ maxWidth: 140 }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={s.count || ''}
                        onChange={handleSkillChange(i, 'count')}
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

            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>Category requirements</Typography>
            {/* reuse SkillCategoryRequirementsTable so manager can edit directly from modal */}
            <SkillCategoryRequirementsTable
              requirements={form.categoryRequirements || []}
              onChange={(reqs) => setForm(prev => ({ ...prev, categoryRequirements: reqs }))}
            />

            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>Assigned Team</Typography>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Actual Level</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(form.teamAssigned||[]).map((e,i)=>(
                  <TableRow key={i}>
                    <TableCell>{e.name}</TableCell>
                    <TableCell>{e.role}</TableCell>
                    <TableCell>{e.level}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>

          <Grid item xs={4}>
            <Card sx={{ bgcolor: '#fbfdff', height: '100%' }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>Overview</Typography>
                <Typography variant="h6" sx={{ mt: 1, fontWeight: 700 }}>{form.manager || '—'}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>Start: {form.startDate || '—'}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Duration: {form.duration || '—'}</Typography>
                <Box sx={{ mt: 2 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{ mb: 1 }}
                    onClick={() => {
                      // remember that user opened matching for this project
                      markProjectMatched(form.id);
                      navigate(`/manager/matching/${form.id}`);
                      onClose();
                    }}
                  >
                    Voir Matching
                  </Button>
                  <Button fullWidth variant="contained" onClick={() => onSave && onSave(form)}>
                    Enregistrer
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
