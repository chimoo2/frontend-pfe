import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Paper, LinearProgress, Tooltip, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Collapse, Chip, Stack } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Topbar from '../../components/layout/Topbar';
import ManagerSidebar from '../../components/layout/ManagerSidebar';
import { SidebarProvider } from '../../context/SidebarContext';
import { getMatchingCandidates, getProjectById } from '../../api/projectApi';

export default function Matching({ projectIdProp, embedded }) {
  const params = useParams();
  const projectId = projectIdProp || params.projectId;
  const [matches, setMatches] = useState(null);
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());

  useEffect(() => {
    if (projectId) {
      getProjectById(projectId)
        .then(res => setProject(res))
        .catch(err => console.error(err));

      getMatchingCandidates(projectId)
        .then(res => setMatches(res))
        .catch(err => setError(err.message || 'Failed to load matches'));
    }
  }, [projectId]);


  const formatScore = v => (typeof v === 'number' ? v.toFixed(2) : '-');

  const formatRequirementLabel = r => {
    let label = '';
    if (r.skill_name) label = r.skill_name;
    else if (r.filterType && r.value) {
      if (r.filterType === 'family') {
        label = `${r.value} (min ${r.min_criticality || 0})`;
      } else if (r.filterType === 'category') {
        label = `Categorie: ${r.value}`;
      } else {
        label = `${r.filterType} = ${r.value}`;
      }
    } else if (r.value) {
      label = r.value;
    }
    if (r.min_criticality && !label.includes('min')) {
      label += ` (crit ${r.min_criticality})`;
    }
    return label.trim();
  };

  const renderMissingSkills = missing => {
    if (!missing) return '-';
    const arr = Array.isArray(missing)
      ? missing
      : String(missing)
          .split(/,\s*/)
          .filter(Boolean);
    if (arr.length === 0) return '-';

    const visible = arr.slice(0, 3);
    const remaining = arr.length - visible.length;
    const tooltipContent = arr.join(', ');

    return (
      <Tooltip title={tooltipContent} placement="top">
        <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap', maxWidth: 250 }}>
          {visible.map((s, i) => (
            <Chip key={i} label={s} size="small" sx={{ mb: 0.5 }} />
          ))}
          {remaining > 0 && <Chip label={`+${remaining} others`} size="small" sx={{ mb: 0.5 }} />}
        </Stack>
      </Tooltip>
    );
  };

  const toggleRow = idx => {
    const newSet = new Set(expandedRows);
    if (newSet.has(idx)) {
      newSet.delete(idx);
    } else {
      newSet.add(idx);
    }
    setExpandedRows(newSet);
  };

  const content = (
    <Box sx={{ flex: 1, p: embedded ? 2 : 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#1a237e' }}>
            Matching des candidats{project ? ` pour "${project.name}"` : ''}
          </Typography>

          <Typography variant="body2" sx={{ mb: 3, color: '#555', lineHeight: 1.6 }}>
            Le tableau ci-dessous classe les employes selon un score global calcule
            automatiquement en combinant leurs competences, leur experience et la
            criticite des exigences du projet. Cliquez sur une ligne pour visualiser
            l'analyse detaillee de chaque profil et comprendre les raisons du classement.
          </Typography>

          {project && project.requirements && project.requirements.length > 0 && (
            <Box sx={{ mb: 3, p: 2, bgcolor: '#e3f2fd', borderRadius: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                Exigences du projet ({project.requirements.length})
              </Typography>
              <ul style={{ margin: 0, paddingLeft: 20, color: '#1976d2' }}>
                {project.requirements.map((r, idx) => {
                  const label = formatRequirementLabel(r);
                  return (
                    <li key={idx} style={{ marginBottom: 4 }}>
                      {label || <em>Non spécifiée</em>}
                    </li>
                  );
                })}
              </ul>
            </Box>
          )}

          {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

          {!matches && <Typography>Chargement en cours...</Typography>}

          {matches && (
            <Paper sx={{ mt: 3, borderRadius: 2.5, boxShadow: '0 4px 20px rgba(0,0,0,0.12)', overflow: 'hidden' }}>
              {matches.message && (
                <Typography color="warning.main" sx={{ p: 2, mb: 0, bgcolor: '#fff3cd' }}>
                  {matches.message}
                </Typography>
              )}
              <Box sx={{ p: 3, pb: 2.5, bgcolor: 'rgba(25, 118, 210, 0.05)', borderBottom: '3px solid #1976d2' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2' }}>
                  Total candidats : {matches.totalCandidates || matches.matches?.length || 0}
                </Typography>
              </Box>
              <Table sx={{ minWidth: 600 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#1976d2' }}>
                    <TableCell align="center" sx={{ width: 50, color: 'white', fontWeight: 700, fontSize: '0.95rem', py: 2 }}>#</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '0.95rem', py: 2 }}>Nom</TableCell>
                    <TableCell align="center" sx={{ color: 'white', fontWeight: 700, fontSize: '0.95rem', py: 2 }}>Score global</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '0.95rem', py: 2 }}>Manquantes</TableCell>
                    <TableCell align="center" sx={{ width: 50, color: 'white', fontWeight: 700, fontSize: '0.95rem', py: 2 }}>Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(matches.matches || []).map((m, idx) => {
                    const overallScore = formatScore(m.overall_score || m.matchingScore);
                    const directScore = formatScore(m.direct_skill_score ?? m.skill_match_score ?? m.matchingScore);
                    const relatedScore = formatScore(m.related_skill_score ?? m.related_skills_score);
                    const semanticScore = formatScore(m.semantic_skill_score ?? 0);
                    const expScore = formatScore(m.experience_score);

                    const missingSkills = Array.isArray(m.missing_skills) ? m.missing_skills : [];
                    const training = Array.isArray(m.recommended_training) ? m.recommended_training.join('; ') : '';
                    const isExpanded = expandedRows.has(idx);

                    return (
                      <React.Fragment key={idx}>
                        <TableRow
                          hover
                          sx={{
                            bgcolor: idx % 2 === 0 ? '#fafafa' : 'white',
                            '&:hover': { bgcolor: '#f0f7ff' },
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <TableCell align="center" sx={{ fontWeight: 700, color: '#1976d2', fontSize: '1.05rem', py: 1.5 }}>
                            {idx + 1}
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600, color: '#1a237e', py: 1.5 }}>
                            {m.employee_name || m.name || m.employeeId || '-'}
                          </TableCell>
                          <TableCell align="center" sx={{ py: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                              <Typography sx={{ fontWeight: 700, minWidth: 35, color: '#1976d2', fontSize: '1.1rem' }}>
                                {overallScore}
                              </Typography>
                              <Box sx={{ width: 70 }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={Math.min(parseFloat(overallScore) * 100, 100)}
                                  sx={{
                                    height: 7,
                                    borderRadius: 3,
                                    bgcolor: '#e8eaf6',
                                    '& .MuiLinearProgress-bar': {
                                      borderRadius: 3,
                                      backgroundColor: parseFloat(overallScore) > 0.7 ? '#4caf50' : parseFloat(overallScore) > 0.4 ? '#ff9800' : '#f44336',
                                    },
                                  }}
                                />
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ maxWidth: 250, whiteSpace: 'normal', wordBreak: 'break-word', fontSize: '0.9rem', color: '#555', py: 1.5 }}>
                            {renderMissingSkills(missingSkills)}
                          </TableCell>
                          <TableCell align="center" sx={{ py: 1.5 }}>
                            <IconButton
                              size="small"
                              onClick={() => toggleRow(idx)}
                              sx={{
                                color: '#1976d2',
                                '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.1)' },
                              }}
                            >
                              {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={5} sx={{ p: 0 }}>
                            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                              <Box sx={{ p: 3, bgcolor: '#f9fafb', borderTop: '2px solid #e0e0e0' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#1976d2', fontSize: '1.05rem' }}>
                                  Analyse detaillee
                                </Typography>
                                <Paper sx={{ p: 2, mb: 2, bgcolor: '#e3f2fd', border: '1px solid #90caf9' }}>
                                  <Typography sx={{ fontStyle: 'italic', fontSize: '0.95rem', color: '#1565c0' }}>
                                    <strong>Score global calculé comme :</strong><br />
                                    0.5 × compétences directes ({directScore}) + 0.3 × compétences liées ({relatedScore}) + 0.2 × compétences sémantiques ({semanticScore})
                                  </Typography>
                                </Paper>

                                {m.skill_match_explanation?.matched_direct_skills && (
                                  <Box sx={{ mb: 1.5 }}>
                                    <Typography sx={{ fontWeight: 600, color: '#1976d2' }}>
                                      Competences directes:
                                    </Typography>
                                    <Typography sx={{ ml: 1, fontSize: '0.9rem', color: '#555' }}>
                                      {m.skill_match_explanation.matched_direct_skills.join(', ')}
                                    </Typography>
                                  </Box>
                                )}

                                {m.skill_match_explanation?.matched_related_skills && (
                                  <Box sx={{ mb: 1.5 }}>
                                    <Typography sx={{ fontWeight: 600, color: '#1976d2' }}>
                                      Competences liees:
                                    </Typography>
                                    <Typography sx={{ ml: 1, fontSize: '0.9rem', color: '#555' }}>
                                      {m.skill_match_explanation.matched_related_skills.join(', ')}
                                    </Typography>
                                  </Box>
                                )}

                                {training && (
                                  <Box sx={{ mb: 2, p: 1.5, bgcolor: '#ffebee', borderLeft: '4px solid #f44336' }}>
                                    <Typography sx={{ fontWeight: 600, color: '#c62828', fontSize: '0.95rem' }}>
                                      Formation recommandee:
                                    </Typography>
                                    <Typography sx={{ ml: 1, fontSize: '0.9rem', color: '#d32f2f' }}>
                                      {training}
                                    </Typography>
                                  </Box>
                                )}

                                {m.matched_requirements && (
                                  <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: '#1976d2' }}>
                                      Exigences du projet:
                                    </Typography>
                                    <ul style={{ margin: '8px 0', paddingLeft: 24, color: '#555' }}>
                                      {m.matched_requirements.map((req, reqIdx) => {
                                        const r = req.requirement || {};
                                        let label = '';
                                        if (r.skill_name) label = r.skill_name;
                                        else if (r.filterType && r.value) {
                                          if (r.filterType === 'family') {
                                            label = `${r.value} (min ${r.min_criticality || 0})`;
                                          } else if (r.filterType === 'category') {
                                            label = `Categorie: ${r.value}`;
                                          } else {
                                            label = `${r.filterType} = ${r.value}`;
                                          }
                                        } else if (r.value) {
                                          label = r.value;
                                        }

                                        if (r.min_criticality && !label.includes('min')) {
                                          label += ` (crit ${r.min_criticality})`;
                                        }

                                        const matchDetails = req.match_details || {};
                                        const directMatches = Array.isArray(matchDetails.direct_matches)
                                          ? matchDetails.direct_matches
                                          : [];
                                        const relatedMatches = Array.isArray(matchDetails.matched_related_skills)
                                          ? matchDetails.matched_related_skills
                                          : Array.isArray(matchDetails.related_matches)
                                          ? matchDetails.related_matches
                                          : [];
                                        const semanticMatches = Array.isArray(matchDetails.matched_semantic_skills)
                                          ? matchDetails.matched_semantic_skills
                                          : [];

                                        const isSatisfied =
                                          r.skill_name &&
                                          directMatches.some((dm) => dm && dm.toString().toLowerCase() === r.skill_name.toString().toLowerCase());

                                        return (
                                          <li key={reqIdx} style={{ marginBottom: 10 }}>
                                            <strong>{label || '(Non spécifiée)'}</strong>
                                            {matchDetails.overall_skill_score != null && (
                                              <span style={{ marginLeft: 8, color: '#1976d2' }}>
                                                ({matchDetails.overall_skill_score.toFixed(2)})
                                              </span>
                                            )}

                                            <ul style={{ margin: '4px 0 0 16px', paddingLeft: 16, color: '#555' }}>
                                              {isSatisfied && (
                                                <li>
                                                  <strong>✓ Directement satisfait</strong>
                                                </li>
                                              )}

                                              {directMatches?.length > 0 && (
                                                <li>
                                                  <strong>Compétences directes:</strong> {directMatches.join(', ')}
                                                </li>
                                              )}

                                              {relatedMatches?.length > 0 && (
                                                <li>
                                                  <strong>Compétences liées:</strong> {relatedMatches.join(', ')}
                                                </li>
                                              )}

                                              {semanticMatches?.length > 0 && (
                                                <li>
                                                  <strong>Compétences sémantiques:</strong> {semanticMatches.join(', ')}
                                                </li>
                                              )}

                                              {!isSatisfied && r.skill_name && (
                                                <li>
                                                  <strong>Manquante:</strong> {r.skill_name}
                                                </li>
                                              )}
                                            </ul>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  </Box>
                                )}
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
              <Box sx={{ p: 2, bgcolor: '#fafafa', borderTop: '1px solid #e0e0e0', textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: '#757575', fontStyle: 'italic' }}>
                  Cliquez sur une ligne pour voir le detail du calcul et des recommandations
                </Typography>
              </Box>
            </Paper>
          )}
        </Box>
    );

  // render differently when embedded in modal/kanban
  if (embedded) {
    return content;
  }

  return (
    <SidebarProvider>
      <Topbar />
      {content}
    </SidebarProvider>
  );
}

