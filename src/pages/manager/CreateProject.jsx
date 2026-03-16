import React from 'react';
import { Box, Typography, Grid, Paper, Fade } from '@mui/material';
import ProjectForm from '../../components/project/ProjectForm';
import Topbar from '../../components/layout/Topbar';
import { useNavigate } from 'react-router-dom';
import { createProject as apiCreateProject } from '../../api/projectApi';

export default function CreateProject() {
  const [projectData, setProjectData] = React.useState({});

  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    console.log('Created project', data);
    // validate required fields
    if (!data.name || !data.manager || !data.startDate) {
      alert('Name, manager and start date are required');
      return;
    }

    // backend expects "requiredSkills" not "skills".
    const payload = {
      ...data,
      status: data.status || 'To Do',
      requiredSkills: (data.skillsNeeded || []).map(s => ({
        skillName: s.skill || s.skillName || s.name,
        level: s.level,
        count: s.count,
        domain: s.domain,
        family: s.family,
        category: s.category,
        type: s.type
      })),
      categoryRequirements: (data.categoryRequirements || []).map(r => ({
  filterType: r.filterType,
  filterValue: r.filterValue,
  description: r.description,
  minCriticality: r.minCriticality,
  count: r.count
}))

    };

    try {
      const res = await apiCreateProject(payload);
      console.log('Project saved', res);
      navigate('/manager/projects');
    } catch (err) {
      console.error('Failed to save project', err);
      alert('Failed to save project: ' + err.message);
    }
  };

  return (
    <Box sx={{
      bgcolor: 'linear-gradient(135deg, #eef2f7 0%, #ffffff 100%)',
      minHeight: '100vh',
      pb: 8
    }}>
      <Topbar />
      <Box sx={{ p: 4, maxWidth: 1400, mx: 'auto' }}>
        <Typography variant="h4" sx={{
          fontWeight: 800,
          mb: 1,
          letterSpacing: 0.5,
          background: 'linear-gradient(90deg, #6366f1, #4f46e5)',
          WebkitBackgroundClip: 'text',
          color: 'transparent'
        }}>
          Créer un projet
        </Typography>
        <Box sx={{ height: 4, width: 80, bgcolor: '#6366f1', mb: 2, borderRadius: 2 }} />
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4, maxWidth: 800 }}>
          Remplissez le formulaire ci-dessous pour ajouter un nouveau projet. Toutes les informations peuvent être modifiées plus tard.
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Fade in timeout={600}>
              <Box>
                <ProjectForm
                  value={projectData}
                  onChange={setProjectData}
                  onSubmit={handleSubmit}
                />
              </Box>
            </Fade>
          </Grid>
          <Grid item xs={12} md={4}>
            <Fade in timeout={800}>
              <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 10px 40px rgba(15,23,42,0.1)', borderLeft: '6px solid #6366f1' }}>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>Aperçu</Typography>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>Nom :</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>{projectData.name || '—'}</Typography>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>Manager :</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>{projectData.manager || '—'}</Typography>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>Statut :</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>{projectData.status || '—'}</Typography>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>Compétences requises :</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {(projectData.skillsNeeded || []).map(s=>s.skill || s.skillName || '').filter(Boolean).join(', ') || '—'}
                </Typography>
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>Exigences catégories :</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>{(projectData.categoryRequirements||[]).length}</Typography>
              </Paper>
            </Fade>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}