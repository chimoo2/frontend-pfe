import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Typography, 
  Card, 
  CardContent, 
  Chip, 
  Alert, 
  CircularProgress,
  Button,
  Grid
} from '@mui/material';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { getDomains, getSkillsByDomain, getSkillsByFamily } from '../../api/skillApi';

/**
 * SmartSkillSelector - Let manager select skills by Domain, Family, or Category
 * Instead of typing individual skill names
 */
export default function SmartSkillSelector({ onSkillsSelected }) {
  // Dropdown filters
  const [domains, setDomains] = useState([]);
  const [families, setFamilies] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Selected values
  const [selectedDomain, setSelectedDomain] = useState('');
  const [selectedFamily, setSelectedFamily] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Results
  const [suggestedSkills, setSuggestedSkills] = useState([]);
  const [domainSkills, setDomainSkills] = useState([]); // Store full domain skills
  // when user toggles a skill we keep the full object so metadata is preserved
  const [selectedSkills, setSelectedSkills] = useState([]);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // derived values
  const selectedSkillNames = selectedSkills.map(s => s.skillName);

  // Load domains on mount
  useEffect(() => {
    const loadDomains = async () => {
      try {
        setLoading(true);
        const domainsList = await getDomains();
        setDomains(domainsList || []);
      } catch (err) {
        console.error('Failed to load domains:', err);
        setError('Could not load skill domains');
      } finally {
        setLoading(false);
      }
    };

    loadDomains();
  }, []);

  // When domain changes, fetch skills for that domain
  useEffect(() => {
    if (selectedDomain) {
      const loadSkills = async () => {
        try {
          const skills = await getSkillsByDomain(selectedDomain);
          setDomainSkills(skills || []);
          setSuggestedSkills(skills || []);
          // Extract unique families and categories
          const familiesSet = new Set();
          const categoriesSet = new Set();
          (skills || []).forEach(skill => {
            if (skill.family) familiesSet.add(skill.family);
            if (skill.category) categoriesSet.add(skill.category);
          });
          setFamilies(Array.from(familiesSet));
          setCategories(Array.from(categoriesSet));
        } catch (err) {
          console.error('Failed to load skills for domain:', err);
        }
      };
      loadSkills();
    } else {
      setDomainSkills([]);
      setSuggestedSkills([]);
      setFamilies([]);
      setCategories([]);
      setSelectedFamily('');
      setSelectedCategory('');
    }
  }, [selectedDomain]);

  // When family changes, filter skills and update categories
  useEffect(() => {
    if (selectedFamily) {
      const filtered = (domainSkills || []).filter(s => s.family === selectedFamily);
      setSuggestedSkills(filtered);
      // Extract categories from filtered skills
      const categoriesSet = new Set();
      filtered.forEach(skill => {
        if (skill.category) categoriesSet.add(skill.category);
      });
      setCategories(Array.from(categoriesSet));
    } else {
      // No family selected, show all domain skills and categories
      setSuggestedSkills(domainSkills);
      const categoriesSet = new Set();
      (domainSkills || []).forEach(skill => {
        if (skill.category) categoriesSet.add(skill.category);
      });
      setCategories(Array.from(categoriesSet));
    }
    // Reset category selection when family changes
    setSelectedCategory('');
  }, [selectedFamily, domainSkills]);

  // When category changes, filter skills
  useEffect(() => {
    let baseSkills = domainSkills;
    if (selectedFamily) {
      baseSkills = domainSkills.filter(s => s.family === selectedFamily);
    }
    if (selectedCategory) {
      const filtered = baseSkills.filter(s => s.category === selectedCategory);
      setSuggestedSkills(filtered);
    } else {
      setSuggestedSkills(baseSkills);
    }
  }, [selectedCategory, selectedFamily, domainSkills]);

  const toggleSkillSelection = (skillName) => {
    const exists = selectedSkills.find(s => s.skillName === skillName);
    let updated;
    if (exists) {
      // remove
      updated = selectedSkills.filter(s => s.skillName !== skillName);
    } else {
      // find metadata from domainSkills or suggestedSkills
      const meta = (domainSkills || []).find(s => s.skillName === skillName) ||
                   (suggestedSkills || []).find(s => s.skillName === skillName) || {};
      updated = [...selectedSkills, {
        skillName: skillName,
        domain: meta.domain,
        family: meta.family,
        category: meta.category,
        type: meta.type,
        level: 'Intermediate',
        count: 1
      }];
    }

    setSelectedSkills(updated);

    // tell parent the full objects including metadata
    const skillsData = updated.map(s => ({
      skillName: s.skillName,
      level: s.level,
      count: s.count,
      domain: s.domain,
      family: s.family,
      category: s.category,
      type: s.type
    }));

    onSkillsSelected && onSkillsSelected(skillsData);
  };

  const clearSelection = () => {
    setSelectedSkills([]);
    onSkillsSelected && onSkillsSelected([]);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Sélectionner les compétences requises
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* Domain Selector */}
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth disabled={loading || domains.length === 0}>
            <InputLabel>Domaine</InputLabel>
            <Select
              value={selectedDomain}
              label="Domaine"
              onChange={(e) => setSelectedDomain(e.target.value)}
            >
              <MenuItem value="">-- Sélectionner --</MenuItem>
              {domains.map(domain => (
                <MenuItem key={domain} value={domain}>{domain}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Family Selector */}
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth disabled={!selectedDomain || families.length === 0}>
            <InputLabel>Famille</InputLabel>
            <Select
              value={selectedFamily}
              label="Famille"
              onChange={(e) => setSelectedFamily(e.target.value)}
            >
              <MenuItem value="">-- Sélectionner --</MenuItem>
              {families.map(family => (
                <MenuItem key={family} value={family}>{family}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Category Selector */}
        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth disabled={!selectedDomain || categories.length === 0}>
            <InputLabel>Catégorie</InputLabel>
            <Select
              value={selectedCategory}
              label="Catégorie"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="">-- Sélectionner --</MenuItem>
              {categories.map(category => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Skills Display */}
      {suggestedSkills.length > 0 && (
        <Card sx={{ mb: 3, bgcolor: '#f8fafc' }}>
          <CardContent>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Compétences disponibles
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {suggestedSkills.map((skill) => (
                <Chip
                  key={skill.skillName}
                  label={skill.skillName}
                  onClick={() => toggleSkillSelection(skill.skillName)}
                  variant={selectedSkills.some(s=>s.skillName===skill.skillName) ? 'filled' : 'outlined'}
                  color={selectedSkills.some(s=>s.skillName===skill.skillName) ? 'primary' : 'default'}
                  sx={{
                    fontWeight: selectedSkills.some(s=>s.skillName===skill.skillName) ? 700 : 400,
                    opacity: skill.criticality >= 4 ? 1 : 0.7,
                  }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Selected Skills */}
      {selectedSkills.length > 0 && (
        <Card sx={{ mb: 3, border: '2px solid #6366f1' }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Compétences sélectionnées ({selectedSkillNames.length})
              </Typography>
              <Button size="small" onClick={clearSelection} color="error">
                Effacer
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {selectedSkills.map((s) => (
                <Chip
                  key={s.skillName}
                  label={s.skillName}
                  onDelete={() => toggleSkillSelection(s.skillName)}
                  color="primary"
                  variant="filled"
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
}
