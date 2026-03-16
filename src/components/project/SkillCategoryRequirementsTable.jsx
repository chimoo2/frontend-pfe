import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Typography,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

/**
 * SkillCategoryRequirementsTable
 * Allows manager to add skill family/category/type requirements
 * without specifying individual skills
 */
export default function SkillCategoryRequirementsTable({ requirements, onChange }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    filterType: 'family',
    filterValue: '',
    description: '',
    minCriticality: 3,
    count: 1,
  });

  const filterOptions = {
    domain: ['Software Engineering', 'Data Engineering', 'Data & AI', 'Mobile', 'Infrastructure', 'Security', 'Business', 'HR Tech', 'Enterprise IT'],
    family: ['Backend', 'Frontend', 'DevOps', 'Data Science', 'Artificial Intelligence', 'Big Data', 'Mobile', 'QA', 'Analytics', 'Architecture', 'Testing', 'Monitoring', 'Soft Skill', 'Management', 'Methodology', 'Cloud', 'System', 'Database', 'Streaming', 'Workflow', 'Data Pipeline', 'Visualization', 'Certification', 'Leadership', 'LLM Engineering', 'MLOps', 'NLP', 'Computer Vision', 'Consulting'],
    category: ['Programming Language', 'Framework', 'Runtime', 'API Design', 'System Design', 'Design Pattern', 'Distributed Systems', 'Core AI', 'Advanced AI', 'Model Architecture', 'AI Domain', 'Technique', 'Operations', 'Data Preparation', 'Production', 'ML Framework', 'ML Library', 'Data Warehouse', 'Processing Engine', 'Distributed System', 'Event Streaming', 'Orchestration', 'Data Integration', 'Storage', 'Cloud Platform', 'Containerization', 'Infrastructure as Code', 'Automation', 'CI Tool', 'Operating System', 'Query Language', 'Relational DB', 'NoSQL DB', 'Cache', 'Enterprise DB', 'Data Processing', 'EDA', 'Modeling', 'Statistical Testing', 'Time Series', 'Markup', 'Styling', 'Core Security', 'Testing', 'Standard', 'Security', 'Management', 'People Management', 'Interpersonal', 'Framework', 'Design', 'Code Quality', 'Artifact Repository', 'Metrics', 'Visualization', 'Logging', 'Cognitive', 'Collaboration', 'Communication', 'Strategy', 'Generative AI', 'LLM', 'LLM Model', 'AI API', 'LLM Technique', 'Model Optimization', 'RAG', 'Vector Storage', 'Vector Database', 'Representation Learning', 'Experiment Tracking', 'Data Versioning', 'ML Orchestration', 'Monitoring', 'Model Monitoring', 'Model Validation', 'Feature Engineering', 'Data Management', 'Model Lifecycle', 'Identity', 'Scaled Agile', 'ITSM', 'Adaptability', 'Strategic Thinking', 'Innovation', 'Analysis', 'Documentation', 'Design', 'Advisory', 'Facilitation', 'Pre-Sales', 'Sales', 'Compute', 'Serverless', 'Version Control', 'CI/CD', 'Kubernetes Tooling', 'Processing', 'API Management', 'Authentication', 'API', 'Analytics', 'BI', 'Performance', 'Reporting', 'Cloud', 'ITSM', 'Compliance', 'Data Protection', 'Authorization', 'Role Management', 'Security Model', 'Audit', 'Risk Management', 'DevOps Platform', 'ML Platform', 'Governance', 'Quality', 'MDM', 'Traceability', 'Metadata', 'Discovery', 'Client Relations', 'Transformation', 'Financial Management', 'Program Delivery', 'Certification', 'Skill Assessment', 'Career Development', 'Resource Allocation', 'Competency Modeling', 'Planning', 'Leadership Development', 'Talent Analytics', 'Performance Management', 'AI Recommendation', 'Learning Strategy', 'Skill Transition', 'IT Strategy', 'Framework', 'IT Management', 'Innovation', 'Modeling', 'Modeling Standard', 'Enterprise Software', 'Customer Management', 'Relational DB', 'Regulatory', 'Privacy', 'Service Management', 'Generative AI'],
    type: ['Technical', 'Soft Skill', 'Strategic', 'Certification', 'Regulatory'],
  };

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({
      filterType: 'family',
      filterValue: '',
      description: '',
      minCriticality: 3,
      count: 1,
    });
    setOpenDialog(true);
  };

  const handleEditClick = (req) => {
    setEditingId(req.id);
    setFormData(req);
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (!formData.filterValue) {
      alert('Veuillez sélectionner une valeur');
      return;
    }

    if (editingId) {
      // Update existing
      const updated = requirements.map((r) =>
        r.id === editingId ? { ...formData, id: editingId } : r
      );
      onChange(updated);
    } else {
      // Add new
      const newReq = {
        id: Date.now(), // temporary ID
        ...formData,
      };
      onChange([...requirements, newReq]);
    }

    setOpenDialog(false);
  };

  const handleDelete = (id) => {
    onChange(requirements.filter((r) => r.id !== id));
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Exigences de compétences par catégorie
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
        Ajoutez des exigences par famille, catégorie ou type de compétences
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f0f4f8' }}>
                <TableCell sx={{ fontWeight: 700 }}>Type de filtre</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Valeur</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Min Criticité</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Nombre</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requirements.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
                    Aucune exigence catégorie ajoutée
                  </TableCell>
                </TableRow>
              ) : (
                requirements.map((req) => (
                  <TableRow key={req.id} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                    <TableCell>{req.filterType}</TableCell>
                    <TableCell>{req.filterValue}</TableCell>
                    <TableCell>{req.description || '—'}</TableCell>
                    <TableCell>{req.minCriticality || '—'}</TableCell>
                    <TableCell>{req.count}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleEditClick(req)}
                        sx={{ color: '#6366f1', mr: 1 }}
                      >
                        ✏️
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(req.id)}
                        sx={{ color: '#ef4444' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <Button
            startIcon={<AddIcon />}
            onClick={handleAddClick}
            sx={{
              mt: 2,
              textTransform: 'none',
              color: '#6366f1',
              '&:hover': { bgcolor: '#eef2ff' },
            }}
          >
            Ajouter une exigence catégorie
          </Button>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingId ? 'Modifier l\'exigence' : 'Ajouter une exigence de catégorie'}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Type de filtre</InputLabel>
            <Select
              value={formData.filterType}
              label="Type de filtre"
              onChange={(e) => {
                setFormData({
                  ...formData,
                  filterType: e.target.value,
                  filterValue: '',
                });
              }}
            >
              <MenuItem value="domain">Domaine</MenuItem>
              <MenuItem value="family">Famille</MenuItem>
              <MenuItem value="category">Catégorie</MenuItem>
              <MenuItem value="type">Type</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Valeur</InputLabel>
            <Select
              value={formData.filterValue}
              label="Valeur"
              onChange={(e) =>
                setFormData({ ...formData, filterValue: e.target.value })
              }
            >
              {(filterOptions[formData.filterType] || []).map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Description (optionnel)"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            fullWidth
            sx={{ mb: 2 }}
            multiline
            rows={2}
          />

          <TextField
            label="Criticité minimum (1-5)"
            type="number"
            value={formData.minCriticality}
            onChange={(e) =>
              setFormData({ ...formData, minCriticality: parseInt(e.target.value) })
            }
            fullWidth
            inputProps={{ min: 1, max: 5 }}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Nombre requis"
            type="number"
            value={formData.count}
            onChange={(e) =>
              setFormData({ ...formData, count: parseInt(e.target.value) })
            }
            fullWidth
            inputProps={{ min: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Annuler</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{ bgcolor: '#6366f1' }}
          >
            Enregistrer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
