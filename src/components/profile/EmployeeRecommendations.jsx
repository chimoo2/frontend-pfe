import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Avatar,
  Divider,
  Grid,
  Paper,
  LinearProgress,
  Tooltip,
  Fade,
  Zoom,
  IconButton,
  InputBase,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
} from '@mui/material';
import {
  School as SchoolIcon,
  Work as WorkIcon,
  CheckCircle as CheckCircleIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  EmojiEvents as TrophyIcon,
  Build as BuildIcon,
  OpenInNew as OpenInNewIcon,
  AutoAwesome as AutoAwesomeIcon,
  KeyboardArrowDown as ArrowDownIcon,
  KeyboardArrowUp as ArrowUpIcon,
  Search as SearchIcon,
  InfoOutlined as InfoIcon,
  BoltOutlined as BoltIcon,
} from '@mui/icons-material';

// Parse "Title - URL" or bare URL into { title, url }
const parseCourse = (raw) => {
  if (!raw) return { title: raw, url: null };
  const httpIdx = raw.indexOf('http');
  if (httpIdx === -1) return { title: raw.trim(), url: null };
  const dashIdx = raw.lastIndexOf(' - http');
  if (dashIdx !== -1) return { title: raw.substring(0, dashIdx).trim(), url: raw.substring(dashIdx + 3).trim() };
  return { title: raw.substring(0, httpIdx).trim(), url: raw.substring(httpIdx).trim() };
};

const ACCENTS = [
  { from: '#4f46e5', to: '#7c3aed', soft: '#eef2ff' },
  { from: '#0891b2', to: '#0ea5e9', soft: '#ecfeff' },
  { from: '#059669', to: '#10b981', soft: '#ecfdf5' },
  { from: '#d97706', to: '#f59e0b', soft: '#fffbeb' },
  { from: '#db2777', to: '#ec4899', soft: '#fdf2f8' },
  { from: '#7c3aed', to: '#a855f7', soft: '#faf5ff' },
];

const BRAND = { primary: '#4f46e5', primaryDark: '#3730a3', accent: '#7c3aed' };

const ScoreRing = ({ score, size = 84 }) => {
  const raw = Number(score);
  const hasScore = score != null && Number.isFinite(raw);
  const normalized = !hasScore ? null : (raw > 1 ? Math.min(raw / 100, 1) : Math.max(raw, 0));
  const pct = normalized == null ? null : Math.round(normalized * 100);
  const color =
    pct == null ? '#cbd5e1' :
    pct >= 75 ? '#059669' :
    pct >= 50 ? '#0891b2' :
    pct >= 25 ? '#d97706' : '#dc2626';

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={100}
        size={size}
        thickness={4}
        sx={{ color: '#f1f5f9', position: 'absolute' }}
      />
      <CircularProgress
        variant="determinate"
        value={pct ?? 0}
        size={size}
        thickness={4}
        sx={{
          color,
          '& .MuiCircularProgress-circle': { strokeLinecap: 'round' },
        }}
      />
      <Box sx={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <Typography sx={{ fontWeight: 800, fontSize: '1.15rem', color: '#0f172a', lineHeight: 1 }}>
          {pct != null ? `${pct}` : '—'}
        </Typography>
        <Typography sx={{ fontSize: '0.62rem', color: '#64748b', fontWeight: 600, mt: 0.2 }}>
          {pct != null ? '/ 100' : 'no score'}
        </Typography>
      </Box>
    </Box>
  );
};

const CourseRow = ({ raw, index }) => {
  const { title, url } = parseCourse(raw);
  const { from, to } = ACCENTS[index % ACCENTS.length];
  return (
    <Box sx={{
      display: 'flex', alignItems: 'center', gap: 1.5,
      p: '12px 14px', borderRadius: 2,
      bgcolor: '#f8fafc',
      border: '1px solid #e2e8f0',
      transition: 'all 0.2s ease',
      '&:hover': {
        bgcolor: '#fff',
        borderColor: from,
        boxShadow: '0 4px 12px rgba(15,23,42,0.08)',
        transform: 'translateX(2px)',
      },
    }}>
      <Box sx={{
        width: 34, height: 34, borderRadius: '10px', flexShrink: 0,
        background: `linear-gradient(135deg,${from},${to})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 4px 10px ${from}33`,
      }}>
        <SchoolIcon sx={{ fontSize: 16, color: '#fff' }} />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" sx={{
          fontWeight: 600, color: '#0f172a',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {title || raw}
        </Typography>
        {url && (
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            {(() => { try { return new URL(url).hostname.replace('www.', ''); } catch { return url.slice(0, 30); } })()}
          </Typography>
        )}
      </Box>
      {url && (
        <Tooltip title="Open course">
          <IconButton component="a" href={url} target="_blank" rel="noopener noreferrer" size="small"
            sx={{ color: '#64748b', '&:hover': { color: from, bgcolor: `${from}11` } }}>
            <OpenInNewIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

const ProjectCard = ({ item, index }) => {
  const [open, setOpen] = useState(false);
  const isAssignment = item.assigned;
  const courses = Array.isArray(item.recommendedCourses) ? item.recommendedCourses : [];
  const missing = Array.isArray(item.missingSkills) ? item.missingSkills : [];
  const { from, to, soft } = ACCENTS[index % ACCENTS.length];
  const displayScore = item.score ?? item.matchingScore ?? item.overallScore;
  const hasScore = displayScore != null && Number.isFinite(Number(displayScore));
  const assignedWithoutScore = isAssignment && !hasScore;

  return (
    <Zoom in timeout={250 + index * 70} style={{ transitionDelay: `${index * 40}ms` }}>
      <Card elevation={0} sx={{
        borderRadius: 3, overflow: 'hidden',
        bgcolor: '#fff',
        border: '1px solid #e2e8f0',
        transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
        height: '100%',
        display: 'flex', flexDirection: 'column',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 20px 40px -10px ${from}33, 0 8px 20px rgba(15,23,42,0.06)`,
          borderColor: from,
        },
      }}>
        {/* Top accent strip */}
        <Box sx={{ height: 4, background: `linear-gradient(90deg,${from},${to})` }} />

        <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Header row : avatar + title + score ring */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2.5 }}>
            <Avatar sx={{
              width: 48, height: 48, flexShrink: 0,
              background: `linear-gradient(135deg,${from},${to})`,
              boxShadow: `0 6px 16px ${from}40`,
              fontSize: '1rem',
            }}>
              {isAssignment ? <AssignmentIcon sx={{ fontSize: 22 }} /> : <TrendingUpIcon sx={{ fontSize: 22 }} />}
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Tooltip title={item.projectName || ''} placement="top-start">
                <Typography variant="h6" sx={{
                  fontWeight: 800, color: '#0f172a', lineHeight: 1.25,
                  fontSize: '1.05rem',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  mb: 0.5,
                }}>
                  {item.projectName}
                </Typography>
              </Tooltip>
              <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                <Chip
                  label={isAssignment ? 'Assigned' : 'Suggested'}
                  size="small"
                  icon={isAssignment ? <CheckCircleIcon sx={{ fontSize: 13 }} /> : <BoltIcon sx={{ fontSize: 13 }} />}
                  sx={{
                    height: 22,
                    bgcolor: isAssignment ? '#ecfdf5' : '#eef2ff',
                    color: isAssignment ? '#059669' : '#4f46e5',
                    fontWeight: 700, fontSize: '0.68rem',
                    border: `1px solid ${isAssignment ? '#a7f3d0' : '#c7d2fe'}`,
                    '& .MuiChip-icon': { color: 'inherit', ml: '6px' },
                  }}
                />
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <PersonIcon sx={{ fontSize: 13, color: '#94a3b8' }} />
                  <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 500 }}>
                    {item.managerName || 'Manager'}
                  </Typography>
                </Stack>
              </Stack>
            </Box>

            <ScoreRing score={displayScore} size={68} />
          </Box>

          {assignedWithoutScore && (
            <Box sx={{
              mb: 2, p: '10px 12px', borderRadius: 2,
              display: 'flex', alignItems: 'flex-start', gap: 1,
              bgcolor: '#eff6ff',
              border: '1px solid #bfdbfe',
            }}>
              <InfoIcon sx={{ fontSize: 16, color: '#2563eb', mt: '1px' }} />
              <Typography variant="caption" sx={{ color: '#1e40af', fontWeight: 600, lineHeight: 1.4 }}>
                Project assigned without matching analysis — no score available yet.
              </Typography>
            </Box>
          )}

          {/* Missing skills */}
          {missing.length > 0 && (
            <Box sx={{ mb: 2.5 }}>
              <Stack direction="row" alignItems="center" spacing={0.8} sx={{ mb: 1 }}>
                <BuildIcon sx={{ fontSize: 14, color: '#dc2626' }} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: 0.3, textTransform: 'uppercase', fontSize: '0.68rem' }}>
                  Skills to develop
                </Typography>
                <Chip label={missing.length} size="small" sx={{
                  height: 16, fontSize: '0.62rem', fontWeight: 700,
                  bgcolor: '#fee2e2', color: '#b91c1c', border: 'none',
                }} />
              </Stack>
              <Stack direction="row" flexWrap="wrap" gap={0.7}>
                {missing.map((skill, i) => (
                  <Chip key={i} label={skill} size="small" sx={{
                    bgcolor: '#fef2f2', color: '#b91c1c',
                    fontWeight: 600, fontSize: '0.72rem',
                    border: '1px solid #fecaca',
                    '&:hover': { bgcolor: '#fee2e2' },
                  }} />
                ))}
              </Stack>
            </Box>
          )}

          {/* Spacer pushes courses block to bottom for equal-height cards */}
          <Box sx={{ flex: 1 }} />

          <Divider sx={{ borderColor: '#f1f5f9', mb: 1.5 }} />

          {/* Courses toggle */}
          <Box
            onClick={() => setOpen(p => !p)}
            sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              cursor: 'pointer', borderRadius: 2, p: '8px 10px',
              bgcolor: open ? soft : 'transparent',
              '&:hover': { bgcolor: soft },
              transition: 'background 0.2s',
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <SchoolIcon sx={{ fontSize: 18, color: from }} />
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>
                Recommended courses
              </Typography>
              <Box sx={{
                minWidth: 22, height: 22, borderRadius: '11px', px: 0.8,
                background: `linear-gradient(135deg,${from},${to})`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Typography sx={{ fontSize: '0.68rem', fontWeight: 800, color: '#fff' }}>
                  {courses.length}
                </Typography>
              </Box>
            </Stack>
            {open ? (
              <ArrowUpIcon sx={{ fontSize: 18, color: '#64748b' }} />
            ) : (
              <ArrowDownIcon sx={{ fontSize: 18, color: '#64748b' }} />
            )}
          </Box>

          {open && (
            <Fade in>
              <Stack spacing={1} sx={{ mt: 1.5 }}>
                {courses.length > 0
                  ? courses.map((c, i) => <CourseRow key={i} raw={c} index={i} />)
                  : <Typography variant="body2" sx={{ color: '#94a3b8', fontStyle: 'italic', pl: 1, py: 1 }}>
                      No courses available for this project.
                    </Typography>
                }
              </Stack>
            </Fade>
          )}
        </CardContent>
      </Card>
    </Zoom>
  );
};

const StatCard = ({ label, value, icon, color, delay = 0 }) => (
  <Fade in timeout={500} style={{ transitionDelay: `${delay}ms` }}>
    <Paper elevation={0} sx={{
      p: 2.5, borderRadius: 3,
      bgcolor: '#fff',
      border: '1px solid #e2e8f0',
      transition: 'all 0.25s ease',
      display: 'flex', alignItems: 'center', gap: 2,
      '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: '0 12px 24px -8px rgba(15,23,42,0.10)',
        borderColor: color,
      },
    }}>
      <Box sx={{
        width: 48, height: 48, borderRadius: '14px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        color: '#fff',
        boxShadow: `0 6px 14px ${color}55`,
      }}>
        {icon}
      </Box>
      <Box>
        <Typography sx={{ fontWeight: 900, fontSize: '1.7rem', color: '#0f172a', lineHeight: 1 }}>
          {value}
        </Typography>
        <Typography sx={{ color: '#64748b', fontSize: '0.78rem', mt: 0.4, fontWeight: 600, letterSpacing: 0.2 }}>
          {label}
        </Typography>
      </Box>
    </Paper>
  </Fade>
);

export default function EmployeeRecommendations({ notifications = [] }) {
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  const unique = useMemo(() => (
    notifications.reduce((acc, n) => {
      if (!acc.find(x => x.projectId === n.projectId)) acc.push(n);
      return acc;
    }, [])
  ), [notifications]);

  const totalCourses = unique.reduce((a, n) => a + (Array.isArray(n.recommendedCourses) ? n.recommendedCourses.length : 0), 0);
  const totalMissing = unique.reduce((a, n) => a + (Array.isArray(n.missingSkills) ? n.missingSkills.length : 0), 0);
  const assigned = unique.filter(n => n.assigned).length;
  const matching = unique.filter(n => !n.assigned).length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return unique.filter(n => {
      if (filter === 'assigned' && !n.assigned) return false;
      if (filter === 'matching' && n.assigned) return false;
      if (!q) return true;
      const inName = (n.projectName || '').toLowerCase().includes(q);
      const inMgr = (n.managerName || '').toLowerCase().includes(q);
      const inSkill = Array.isArray(n.missingSkills) && n.missingSkills.some(s => String(s).toLowerCase().includes(q));
      return inName || inMgr || inSkill;
    });
  }, [unique, filter, query]);

  return (
    <Box sx={{
      minHeight: '100vh',
      background: `
        radial-gradient(1200px 600px at 0% -10%, ${BRAND.primary}14, transparent 60%),
        radial-gradient(1000px 500px at 100% 0%, ${BRAND.accent}14, transparent 60%),
        linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)
      `,
      p: { xs: 2, md: 4 },
    }}>
      {/* ─── Hero ─── */}
      <Fade in timeout={400}>
        <Box sx={{ maxWidth: 1200, mx: 'auto', mb: 4 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between" spacing={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box sx={{
                width: 56, height: 56, borderRadius: '18px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.accent})`,
                boxShadow: `0 12px 28px ${BRAND.primary}40`,
              }}>
                <TrophyIcon sx={{ fontSize: 28, color: '#fff' }} />
              </Box>
              <Box>
                <Typography sx={{
                  fontWeight: 900, color: '#0f172a',
                  fontSize: { xs: '1.5rem', md: '1.9rem' },
                  letterSpacing: '-0.5px', lineHeight: 1.1,
                }}>
                  My Recommendations
                </Typography>
                <Stack direction="row" alignItems="center" spacing={0.8} sx={{ mt: 0.6 }}>
                  <AutoAwesomeIcon sx={{ fontSize: 14, color: BRAND.accent }} />
                  <Typography sx={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 500 }}>
                    AI-powered insights for your career growth
                  </Typography>
                </Stack>
              </Box>
            </Stack>

            {/* Search + filter */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ width: { xs: '100%', md: 'auto' } }}>
              <Paper elevation={0} sx={{
                display: 'flex', alignItems: 'center', gap: 1,
                px: 1.5, py: 0.5, borderRadius: 2.5,
                bgcolor: '#fff', border: '1px solid #e2e8f0',
                minWidth: { sm: 260 },
                transition: 'all 0.2s',
                '&:focus-within': { borderColor: BRAND.primary, boxShadow: `0 0 0 4px ${BRAND.primary}1a` },
              }}>
                <SearchIcon sx={{ fontSize: 18, color: '#94a3b8' }} />
                <InputBase
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search project, skill, manager…"
                  sx={{ flex: 1, fontSize: '0.88rem', color: '#0f172a' }}
                />
              </Paper>
              <ToggleButtonGroup
                value={filter}
                exclusive
                size="small"
                onChange={(_, v) => v && setFilter(v)}
                sx={{
                  bgcolor: '#fff', borderRadius: 2.5, p: 0.5,
                  border: '1px solid #e2e8f0',
                  '& .MuiToggleButton-root': {
                    border: 0, borderRadius: '10px !important',
                    px: 1.6, py: 0.6, textTransform: 'none',
                    fontWeight: 700, fontSize: '0.78rem',
                    color: '#64748b',
                    '&.Mui-selected': {
                      bgcolor: BRAND.primary, color: '#fff',
                      '&:hover': { bgcolor: BRAND.primaryDark },
                    },
                  },
                }}
              >
                <ToggleButton value="all">All</ToggleButton>
                <ToggleButton value="assigned">Assigned</ToggleButton>
                <ToggleButton value="matching">Suggested</ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          </Stack>
        </Box>
      </Fade>

      {/* ─── Stats ─── */}
      <Box sx={{ maxWidth: 1200, mx: 'auto', mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <StatCard label="Projects" value={unique.length} icon={<WorkIcon />} color="#4f46e5" delay={0} />
          </Grid>
          <Grid item xs={6} md={3}>
            <StatCard label="Assigned" value={assigned} icon={<AssignmentIcon />} color="#059669" delay={80} />
          </Grid>
          <Grid item xs={6} md={3}>
            <StatCard label="Suggested" value={matching} icon={<TrendingUpIcon />} color="#0891b2" delay={160} />
          </Grid>
          <Grid item xs={6} md={3}>
            <StatCard label="Courses · Gaps" value={`${totalCourses} · ${totalMissing}`} icon={<SchoolIcon />} color="#db2777" delay={240} />
          </Grid>
        </Grid>
      </Box>

      {/* ─── Cards ─── */}
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {filtered.length === 0 ? (
          <Zoom in timeout={400}>
            <Paper elevation={0} sx={{
              maxWidth: 520, mx: 'auto', textAlign: 'center',
              p: { xs: 5, md: 7 }, borderRadius: 4,
              bgcolor: '#fff',
              border: '1px dashed #cbd5e1',
            }}>
              <Box sx={{
                width: 80, height: 80, borderRadius: '50%', mx: 'auto', mb: 3,
                background: `linear-gradient(135deg, ${BRAND.primary}11, ${BRAND.accent}11)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <NotificationsIcon sx={{ fontSize: 36, color: BRAND.primary }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a', mb: 1 }}>
                {unique.length === 0 ? 'No recommendations yet' : 'No results'}
              </Typography>
              <Typography sx={{ color: '#64748b', fontSize: '0.95rem', maxWidth: 380, mx: 'auto' }}>
                {unique.length === 0
                  ? "Your manager hasn't run a matching analysis for your projects yet. Check back soon!"
                  : "Try adjusting your search or filter to find what you're looking for."}
              </Typography>
            </Paper>
          </Zoom>
        ) : (
          <Grid container spacing={3}>
            {filtered.map((item, idx) => (
              <Grid item xs={12} md={6} xl={4} key={`${item.projectId}-${idx}`}>
                <ProjectCard item={item} index={idx} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
}
