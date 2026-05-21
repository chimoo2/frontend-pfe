import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, LinearProgress, Tooltip, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Collapse, Chip, Stack, Button } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Topbar from '../../components/layout/Topbar';
import ManagerSidebar from '../../components/layout/ManagerSidebar';
import { SidebarProvider } from '../../context/SidebarContext';
import { assignEmployeeToProject, getMatchingCandidates, getProjectById } from '../../api/projectApi';

export default function Matching({ projectIdProp, embedded }) {
  const params = useParams();
  const navigate = useNavigate();
  const projectId = projectIdProp || params.projectId;
  const [matches, setMatches] = useState(null);
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [assigningEmployeeId, setAssigningEmployeeId] = useState(null);
  const [assignedEmployeeIds, setAssignedEmployeeIds] = useState(new Set());

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


  const formatScore = v => {
    if (typeof v === 'number') return v.toFixed(2);
    if (typeof v === 'string' && !Number.isNaN(Number(v))) return Number(v).toFixed(2);
    return '-';
  };

  // Mirror Python normalize_skill so JS comparisons match backend keys
  const normalizeSkill = s => {
    if (!s) return '';
    const aliases = {
      'node.js': 'nodejs', 'node js': 'nodejs',
      'react.js': 'react', 'reactjs': 'react',
      'vue.js': 'vue', 'vuejs': 'vue',
      'angular.js': 'angular', 'angularjs': 'angular',
      'next.js': 'nextjs', 'nuxt.js': 'nuxtjs',
      'express.js': 'express',
      'spring boot': 'spring', 'springboot': 'spring',
      'postgres': 'postgresql', 'postgre': 'postgresql',
      'mongo': 'mongodb', 'mongo db': 'mongodb',
      'docker-compose': 'docker', 'k8s': 'kubernetes',
      'c++': 'cpp', 'c#': 'csharp',
      'js': 'javascript', 'ts': 'typescript',
      'py': 'python', 'golang': 'go',
    };
    let n = s.toLowerCase().trim().replace(/[^a-z0-9+#.\s]/g, '').replace(/\s+/g, ' ');
    return aliases[n] || n;
  };

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

  // Compute skills that are not directly satisfied from matched_requirements.
  // A skill is "manquante" when there is no direct match entry for it, even if a
  // related/semantic match partially covers it.
  const computeMissingSkills = (match) => {
    if (!Array.isArray(match.matched_requirements) || match.matched_requirements.length === 0) {
      return Array.isArray(match.missing_skills) ? match.missing_skills : [];
    }
    const explanation = match.skill_match_explanation || {};
    const directNorm = new Set(
      (explanation.matched_direct_skills || []).map(d => normalizeSkill(d.split(' ')[0]))
    );
    return match.matched_requirements
      .filter(req => {
        const r = req.requirement || {};
        return !!r.skill_name && !directNorm.has(normalizeSkill(r.skill_name));
      })
      .map(req => req.requirement.skill_name);
  };

  // Compute a stable overall score from detailed per-skill scores when available.
  // Display the overall_score computed by the backend:
  // overall = unified_skill_score × 0.60 + experience_score × 0.25 + criticality_score × 0.15
  const computeOverallScoreRaw = (match) => {
    return match?.overall_score ?? match?.skill_match_score ?? match?.matchingScore ?? 0;
  };

  const viewTrainingPage = (match, missingSkillsForTraining) => {
    const trainingData = Array.isArray(match.recommended_training)
      ? match.recommended_training
      : typeof match.recommended_training === 'string'
      ? match.recommended_training.split(/;\s*/).filter(Boolean)
      : [];

    navigate(`/manager/matching/${projectId}/courses`, {
      state: {
        training: trainingData,
        employeeName: match.employee_name || match.name || match.employeeId || 'Candidat',
        projectName: project?.name || '',
        missingSkills: missingSkillsForTraining || computeMissingSkills(match),
      },
    });
  };

  const handleAssignEmployee = async (employeeId) => {
    if (!employeeId || !projectId) return;

    try {
      setAssigningEmployeeId(employeeId);
      await assignEmployeeToProject(projectId, employeeId);
      setAssignedEmployeeIds((prev) => new Set(prev).add(employeeId));
    } catch (err) {
      setError(err.message || 'Failed to assign employee');
    } finally {
      setAssigningEmployeeId(null);
    }
  };

  const content = (
    <Box sx={{ flex: 1, p: embedded ? 2 : 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#1a237e' }}>
            Candidate Matching{project ? ` for "${project.name}"` : ''}
          </Typography>

          <Typography variant="body2" sx={{ mb: 3, color: '#555', lineHeight: 1.6 }}>
            The table below ranks employees according to the score returned by the
            matching service. For a clear test, use a project with precise
            requirements such as Python, FastAPI and Machine Learning: the
            candidate David Engels should then stand out as the best match.
          </Typography>

          {project && project.requirements && project.requirements.length > 0 && (
            <Box sx={{ mb: 3, p: 2, bgcolor: '#e3f2fd', borderRadius: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1976d2', mb: 1 }}>
                Project Requirements ({project.requirements.length})
              </Typography>
              <ul style={{ margin: 0, paddingLeft: 20, color: '#1976d2' }}>
                {project.requirements.map((r, idx) => {
                  const label = formatRequirementLabel(r);
                  return (
                    <li key={idx} style={{ marginBottom: 4 }}>
                      {label || <em>Not specified</em>}
                    </li>
                  );
                })}
              </ul>
            </Box>
          )}

          {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

          {!matches && <Typography>Loading...</Typography>}

          {matches && (
            <Paper sx={{ mt: 3, borderRadius: 2.5, boxShadow: '0 4px 20px rgba(0,0,0,0.12)', overflow: 'hidden' }}>
              {matches.message && (
                <Typography color="warning.main" sx={{ p: 2, mb: 0, bgcolor: '#fff3cd' }}>
                  {matches.message}
                </Typography>
              )}
              <Box sx={{ p: 3, pb: 2.5, bgcolor: 'rgba(25, 118, 210, 0.05)', borderBottom: '3px solid #1976d2' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2' }}>
                  Total candidates: {matches.totalCandidates || matches.matches?.length || 0}
                </Typography>
              </Box>
              <Table sx={{ minWidth: 600 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#1976d2' }}>
                    <TableCell align="center" sx={{ width: 50, color: 'white', fontWeight: 700, fontSize: '0.95rem', py: 2 }}>#</TableCell>
                    <TableCell align="center" sx={{ color: 'white', fontWeight: 700, fontSize: '0.95rem', py: 2 }}>Assign</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '0.95rem', py: 2 }}>Name</TableCell>
                    <TableCell align="center" sx={{ color: 'white', fontWeight: 700, fontSize: '0.95rem', py: 2 }}>Overall Score</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 700, fontSize: '0.95rem', py: 2 }}>Missing Skills</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(matches.matches || []).map((m, idx) => {
                    const overallScoreRaw = computeOverallScoreRaw(m);
                    const overallScore = formatScore(overallScoreRaw);
                    const directScore = formatScore(m.direct_score ?? m.direct_skill_score ?? 0);
                    const relatedScore = formatScore(m.related_score ?? m.related_skill_score ?? m.related_skills_score ?? 0);
                    const semanticScore = formatScore(m.semantic_score ?? m.semantic_skill_score ?? 0);
                    const expScore = formatScore(m.experience_score);

                    const overallPercent = typeof overallScoreRaw === 'number' ? Math.min(overallScoreRaw * 100, 100) : !isNaN(Number(overallScoreRaw)) ? Math.min(Number(overallScoreRaw) * 100, 100) : 0;
                    const missingSkills = computeMissingSkills(m);
                    const training = Array.isArray(m.recommended_training) ? m.recommended_training.join('; ') : '';
                    const isExpanded = expandedRows.has(idx);
                    const employeeId = m.employee_id || m.id || m.employeeId;
                    const isAssigned = assignedEmployeeIds.has(employeeId);
                    const isAssigning = assigningEmployeeId === employeeId;

                    return (
                      <React.Fragment key={idx}>
                        <TableRow
                          hover
                          onClick={() => toggleRow(idx)}
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
                          <TableCell align="center" sx={{ py: 1.5 }} onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant={isAssigned ? 'contained' : 'outlined'}
                              size="small"
                              disabled={!employeeId || isAssigned || isAssigning}
                              onClick={() => handleAssignEmployee(employeeId)}
                              sx={{ textTransform: 'none', minWidth: 96 }}
                            >
                              {isAssigned ? 'Assigned' : isAssigning ? 'Assigning...' : 'Assign'}
                            </Button>
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
                                  value={overallPercent}
                                  sx={{
                                    height: 7,
                                    borderRadius: 3,
                                    bgcolor: '#e8eaf6',
                                    '& .MuiLinearProgress-bar': {
                                      borderRadius: 3,
                                      backgroundColor: overallPercent > 70 ? '#4caf50' : overallPercent > 40 ? '#ff9800' : '#f44336',
                                    },
                                  }}
                                />
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ maxWidth: 250, whiteSpace: 'normal', wordBreak: 'break-word', fontSize: '0.9rem', color: '#555', py: 1.5 }}>
                            {renderMissingSkills(missingSkills)}
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
                                    <strong>Score global :</strong> {overallScore} (moyenne des scores individuels par compétence requise)
                                  </Typography>
                                  <Typography sx={{ mt: 1, fontSize: '0.9rem', color: '#1565c0' }}>
                                    Scores moyens par type de correspondance : direct ({directScore}) · lié ({relatedScore}) · sémantique ({semanticScore})
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



                                {m.matched_requirements && (
                                  <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: '#1976d2' }}>
                                      Exigences du projet:
                                    </Typography>
                                    
                                    {/* Display detailed requirement explanations if available (includes both named and group requirements) */}
                                    {m.detailed_requirement_explanations && m.detailed_requirement_explanations.length > 0 ? (
                                      <Box sx={{ mb: 2 }}>
                                        {m.detailed_requirement_explanations.map((detailReq, detailIdx) => {
                                          const reqLabel = detailReq.requirement_label || 'Unknown';
                                          const reqDetails = detailReq.requirement_details || {};
                                          const score = detailReq.score != null ? detailReq.score : 0;
                                          const criticality = detailReq.criticality_weight != null ? Math.round(detailReq.criticality_weight * 5) : 3;
                                          const expandedSkills = detailReq.taxonomy_expanded_skills || [];
                                          const employeeMatched = detailReq.employee_matched_skills || [];
                                          const missing = detailReq.missing_skills || [];
                                          const matchedByType = detailReq.matched_by_type || {};
                                          
                                          const isNamedSkill = !!reqDetails.skill_name;
                                          const isGroupReq = !isNamedSkill;
                                          
                                          return (
                                            <Paper
                                              key={detailIdx}
                                              sx={{
                                                p: 1.5,
                                                mb: 1.5,
                                                bgcolor: isGroupReq ? '#fff3e0' : '#f5f5f5',
                                                border: isGroupReq ? '2px solid #ff9800' : '1px solid #ccc',
                                                borderRadius: 1
                                              }}
                                            >
                                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                                <Box>
                                                  <Typography sx={{ fontWeight: 700, color: isGroupReq ? '#e65100' : '#1976d2', fontSize: '0.95rem' }}>
                                                    {reqLabel}
                                                  </Typography>
                                                  {isGroupReq && (
                                                    <Typography sx={{ fontSize: '0.8rem', color: '#ff6f00', fontStyle: 'italic' }}>
                                                      Requirement groupe
                                                    </Typography>
                                                  )}
                                                </Box>
                                                <Box sx={{ textAlign: 'right' }}>
                                                  <Typography sx={{ fontWeight: 700, color: score > 0.7 ? '#4caf50' : score > 0.4 ? '#ff9800' : '#f44336', fontSize: '0.95rem' }}>
                                                    {score.toFixed(2)}
                                                  </Typography>
                                                  <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>
                                                    Crit: {criticality}/5
                                                  </Typography>
                                                </Box>
                                              </Box>
                                              
                                              {/* Show expanded taxonomy skills for group requirements */}
                                              {isGroupReq && expandedSkills.length > 0 && (
                                                <Box sx={{ mb: 1, pl: 1, borderLeft: '3px solid #ff9800' }}>
                                                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#666', mb: 0.5 }}>
                                                    Skills du groupe ({expandedSkills.length}):
                                                  </Typography>
                                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {expandedSkills.slice(0, 8).map((skill, i) => (
                                                      <Chip
                                                        key={i}
                                                        label={skill}
                                                        size="small"
                                                        variant={employeeMatched.includes(skill) ? 'filled' : 'outlined'}
                                                        color={employeeMatched.includes(skill) ? 'success' : 'default'}
                                                        sx={{ height: 20, fontSize: '0.75rem' }}
                                                      />
                                                    ))}
                                                    {expandedSkills.length > 8 && (
                                                      <Chip
                                                        label={`+${expandedSkills.length - 8}`}
                                                        size="small"
                                                        sx={{ height: 20, fontSize: '0.75rem' }}
                                                      />
                                                    )}
                                                  </Box>
                                                </Box>
                                              )}
                                              
                                              {/* Show match breakdown */}
                                              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, fontSize: '0.85rem' }}>
                                                {matchedByType.direct_matches && matchedByType.direct_matches.length > 0 && (
                                                  <Box>
                                                    <Typography sx={{ fontWeight: 600, color: '#4caf50', fontSize: '0.8rem' }}>
                                                      ✓ Directes ({matchedByType.direct_matches.length}):
                                                    </Typography>
                                                    <Typography sx={{ fontSize: '0.75rem', color: '#333', pl: 1 }}>
                                                      {matchedByType.direct_matches.join(', ')}
                                                    </Typography>
                                                  </Box>
                                                )}
                                                
                                                {matchedByType.related_matches && matchedByType.related_matches.length > 0 && (
                                                  <Box>
                                                    <Typography sx={{ fontWeight: 600, color: '#ff9800', fontSize: '0.8rem' }}>
                                                      → Liées ({matchedByType.related_matches.length}):
                                                    </Typography>
                                                    <Typography sx={{ fontSize: '0.75rem', color: '#333', pl: 1 }}>
                                                      {matchedByType.related_matches.join(', ')}
                                                    </Typography>
                                                  </Box>
                                                )}
                                                
                                                {matchedByType.semantic_matches && matchedByType.semantic_matches.length > 0 && (
                                                  <Box>
                                                    <Typography sx={{ fontWeight: 600, color: '#9c27b0', fontSize: '0.8rem' }}>
                                                      ≈ Sémantiques ({matchedByType.semantic_matches.length}):
                                                    </Typography>
                                                    <Typography sx={{ fontSize: '0.75rem', color: '#333', pl: 1 }}>
                                                      {matchedByType.semantic_matches.join(', ')}
                                                    </Typography>
                                                  </Box>
                                                )}
                                                
                                                {missing && missing.length > 0 && (
                                                  <Box>
                                                    <Typography sx={{ fontWeight: 600, color: '#d32f2f', fontSize: '0.8rem' }}>
                                                      ✗ Manquantes ({missing.length}):
                                                    </Typography>
                                                    <Typography sx={{ fontSize: '0.75rem', color: '#d32f2f', pl: 1 }}>
                                                      {missing.slice(0, 3).join(', ')}
                                                      {missing.length > 3 && ` +${missing.length - 3}`}
                                                    </Typography>
                                                  </Box>
                                                )}
                                              </Box>
                                            </Paper>
                                          );
                                        })}
                                      </Box>
                                    ) : (
                                      /* Fallback to old display format if detailed_requirement_explanations not available */
                                      <ul style={{ margin: '8px 0', paddingLeft: 24, color: '#555' }}>
                                        {m.matched_requirements.filter(req => !!(req.requirement || {}).skill_name).map((req, reqIdx) => {
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

                                        // Resolve match type from global explanation (original skill names, not expanded set)
                                        const explanation = m.skill_match_explanation || {};
                                        const reqNorm = normalizeSkill(r.skill_name);

                                        // Use individual_skill_scores from the top-level explanation.
                                        // These are computed per ORIGINAL skill name (no expansion dilution)
                                        // and are already correct — same source as the direct/lié summary scores.
                                        const indScores = explanation.individual_skill_scores || {};
                                        const reqScore = r.skill_name
                                          ? (indScores[reqNorm] != null ? indScores[reqNorm] : (matchDetails.req_score ?? matchDetails.overall_skill_score))
                                          : (matchDetails.req_score ?? matchDetails.overall_skill_score);

                                        const directEntry = (explanation.matched_direct_skills || []).find(d => {
                                          const skillPart = d.split(' ')[0];
                                          return normalizeSkill(skillPart) === reqNorm;
                                        });
                                        const relatedEntry = (explanation.matched_related_skills || []).find(d => {
                                          const skillPart = d.split(' ')[0];
                                          return normalizeSkill(skillPart) === reqNorm;
                                        });
                                        const semanticEntry = (explanation.matched_semantic_skills || []).find(d => {
                                          const skillPart = d.split(' ')[0];
                                          return normalizeSkill(skillPart) === reqNorm;
                                        });

                                        const isSatisfied = !!directEntry;
                                        const isMissing = !directEntry && !relatedEntry && !semanticEntry && !!r.skill_name;

                                        return (
                                          <li key={reqIdx} style={{ marginBottom: 10 }}>
                                            <strong>{label || '(Non spécifiée)'}</strong>
                                            {reqScore != null && (
                                              <span style={{ marginLeft: 8, color: '#1976d2' }}>
                                                ({typeof reqScore === 'number' ? reqScore.toFixed(2) : reqScore})
                                              </span>
                                            )}

                                            <ul style={{ margin: '4px 0 0 16px', paddingLeft: 16, color: '#555' }}>
                                              {isSatisfied && (
                                                <li>
                                                  <strong>✓ Directement satisfait</strong>
                                                  {directEntry && (
                                                    <span style={{ marginLeft: 6, color: '#388e3c' }}>
                                                      — {directEntry}
                                                    </span>
                                                  )}
                                                </li>
                                              )}

                                              {relatedEntry && (
                                                <li>
                                                  <strong>Compétence liée:</strong>{' '}
                                                  <span style={{ color: '#f57c00' }}>{relatedEntry}</span>
                                                </li>
                                              )}

                                              {semanticEntry && (
                                                <li>
                                                  <strong>Compétence sémantique:</strong>{' '}
                                                  <span style={{ color: '#7b1fa2' }}>{semanticEntry}</span>
                                                </li>
                                              )}

                                              {isMissing && (
                                                <li>
                                                  <strong style={{ color: '#d32f2f' }}>Manquante:</strong>{' '}
                                                  <span style={{ color: '#d32f2f' }}>{r.skill_name}</span>
                                                </li>
                                              )}

                                              {!r.skill_name && !directEntry && !relatedEntry && !semanticEntry && (
                                                <li><strong>Aucune correspondance trouvée</strong></li>
                                              )}
                                            </ul>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                    )}
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

