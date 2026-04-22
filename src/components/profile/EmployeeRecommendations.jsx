import React, { useState } from 'react';
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
  Button,
  Badge,
  Fade,
  Zoom,
  IconButton,
} from '@mui/material';
import {
  School as SchoolIcon,
  Work as WorkIcon,
  CheckCircle as CheckCircleIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  Link as LinkIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  EmojiEvents as TrophyIcon,
  Build as BuildIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';

// Parse a "Title - URL" string into { title, url }
const parseCourse = (raw) => {
  if (!raw) return { title: raw, url: null };
  const httpIdx = raw.indexOf('http');
  if (httpIdx === -1) return { title: raw.trim(), url: null };
  const dashIdx = raw.lastIndexOf(' - http');
  if (dashIdx !== -1) {
    return {
      title: raw.substring(0, dashIdx).trim(),
      url: raw.substring(dashIdx + 3).trim(),
    };
  }
  return { title: raw.substring(0, httpIdx).trim(), url: raw.substring(httpIdx).trim() };
};

const ScoreGauge = ({ score }) => {
  const pct = score != null ? Math.round(Number(score) * 100) : null;
  const color =
    pct == null ? '#94a3b8'
    : pct >= 70 ? '#10b981'
    : pct >= 40 ? '#f59e0b'
    : '#ef4444';
  const label = pct == null ? '-' : `${pct}%`;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
          Score de compatibilité
        </Typography>
        <Typography variant="caption" sx={{ color, fontWeight: 800 }}>
          {label}
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={pct ?? 0}
        sx={{
          height: 8,
          borderRadius: 4,
          bgcolor: 'rgba(0,0,0,0.06)',
          '& .MuiLinearProgress-bar': {
            borderRadius: 4,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
          },
        }}
      />
    </Box>
  );
};

const CourseChip = ({ raw, index }) => {
  const { title, url } = parseCourse(raw);
  const gradients = [
    'linear-gradient(135deg,#667eea,#764ba2)',
    'linear-gradient(135deg,#f093fb,#f5576c)',
    'linear-gradient(135deg,#4facfe,#00f2fe)',
    'linear-gradient(135deg,#43e97b,#38f9d7)',
    'linear-gradient(135deg,#fa709a,#fee140)',
    'linear-gradient(135deg,#a18cd1,#fbc2eb)',
  ];
  const bg = gradients[index % gradients.length];

  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        p: '10px 14px',
        borderRadius: 3,
        background: 'rgba(248,250,252,1)',
        border: '1px solid #e2e8f0',
        transition: 'all 0.22s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
          border: '1px solid #c7d2fe',
        },
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: 2,
          background: bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <SchoolIcon sx={{ fontSize: 16, color: '#fff' }} />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            color: '#1e293b',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title || raw}
        </Typography>
        {url && (
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            {(() => { try { return new URL(url).hostname.replace('www.',''); } catch { return url.slice(0,30); } })()}
          </Typography>
        )}
      </Box>
      {url && (
        <Tooltip title="Ouvrir le cours">
          <IconButton
            component="a"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            sx={{
              color: '#667eea',
              '&:hover': { bgcolor: 'rgba(102,126,234,0.1)' },
            }}
          >
            <OpenInNewIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Paper>
  );
};

const ProjectNotifCard = ({ item, index }) => {
  const [open, setOpen] = useState(false);
  const isAssignment = item.assigned;
  const courses = Array.isArray(item.recommendedCourses) ? item.recommendedCourses : [];
  const missing = Array.isArray(item.missingSkills) ? item.missingSkills : [];

  // DEBUG: Voir les champs disponibles
  console.log('ProjectNotifCard item:', item, 'missing:', missing);

  const accentColors = [
    { from: '#667eea', to: '#764ba2' },
    { from: '#f093fb', to: '#f5576c' },
    { from: '#4facfe', to: '#00f2fe' },
    { from: '#43e97b', to: '#38f9d7' },
    { from: '#fa709a', to: '#fee140' },
    { from: '#a18cd1', to: '#fbc2eb' },
  ];
  const { from, to } = accentColors[index % accentColors.length];

  return (
    <Zoom in timeout={300 + index * 80}>
      <Card
        elevation={0}
        sx={{
          borderRadius: 4,
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            borderColor: from,
          },
        }}
      >
        {/* Top gradient bar */}
        <Box sx={{ height: 5, background: `linear-gradient(90deg, ${from}, ${to})` }} />

        <CardContent sx={{ p: 3 }}>
          {/* Header row */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
            <Avatar
              sx={{
                width: 52,
                height: 52,
                background: `linear-gradient(135deg, ${from}, ${to})`,
                flexShrink: 0,
              }}
            >
              {isAssignment ? <AssignmentIcon /> : <TrendingUpIcon />}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 0.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                  {item.projectName}
                </Typography>
                <Chip
                  label={isAssignment ? 'Affecté' : 'Matching'}
                  size="small"
                  icon={isAssignment ? <CheckCircleIcon /> : <TrendingUpIcon />}
                  sx={{
                    background: isAssignment
                      ? 'linear-gradient(135deg,#10b981,#059669)'
                      : 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                    '& .MuiChip-icon': { color: '#fff' },
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PersonIcon sx={{ fontSize: 14, color: '#64748b' }} />
                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                  {item.managerName || 'Manager'}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Missing skills - VISIBLE EN HAUT */}
          {missing.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1 }}>
                <BuildIcon sx={{ fontSize: 16, color: '#ef4444' }} />
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#7f1d1d' }}>
                  Compétences à développer
                </Typography>
              </Box>
              <Stack direction="row" flexWrap="wrap" gap={0.8}>
                {missing.map((skill, i) => (
                  <Chip
                    key={i}
                    label={skill}
                    size="small"
                    icon={<BuildIcon sx={{ fontSize: 12 }} />}
                    sx={{
                      bgcolor: 'rgba(239,68,68,0.1)',
                      color: '#7f1d1d',
                      fontWeight: 600,
                      border: '1px solid rgba(239,68,68,0.3)',
                      '& .MuiChip-icon': { color: '#ef4444 !important' },
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          {/* Score gauge */}
          <Box sx={{ mb: 2 }}>
            <ScoreGauge score={item.score} />
          </Box>

          <Divider sx={{ mb: 2, borderColor: '#f1f5f9' }} />

          {/* Courses toggle */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              mb: open ? 2 : 0,
            }}
            onClick={() => setOpen((p) => !p)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SchoolIcon sx={{ fontSize: 18, color: from }} />
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                Formations recommandées
              </Typography>
              <Chip
                label={courses.length}
                size="small"
                sx={{
                  background: `linear-gradient(135deg,${from},${to})`,
                  color: '#fff',
                  fontWeight: 800,
                  minWidth: 28,
                  height: 20,
                  fontSize: '0.7rem',
                }}
              />
            </Box>
            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>
              {open ? 'Masquer ▲' : 'Voir ▼'}
            </Typography>
          </Box>

          {open && courses.length > 0 && (
            <Fade in>
              <Stack spacing={1}>
                {courses.map((c, i) => (
                  <CourseChip key={i} raw={c} index={i} />
                ))}
              </Stack>
            </Fade>
          )}
          {open && courses.length === 0 && (
            <Fade in>
              <Typography variant="body2" sx={{ color: '#94a3b8', fontStyle: 'italic' }}>
                Aucune formation recommandée pour ce projet.
              </Typography>
            </Fade>
          )}
        </CardContent>
      </Card>
    </Zoom>
  );
};

export default function EmployeeRecommendations({ notifications = [] }) {
  // Dédupliquer par projectId (garder la première occurrence)
  const uniqueNotifications = notifications.reduce((acc, notif) => {
    if (!acc.find(n => n.projectId === notif.projectId)) {
      acc.push(notif);
    }
    return acc;
  }, []);

  const totalCourses = uniqueNotifications.reduce(
    (acc, n) => acc + (Array.isArray(n.recommendedCourses) ? n.recommendedCourses.length : 0),
    0
  );
  const assigned = uniqueNotifications.filter((n) => n.assigned).length;
  const matching = uniqueNotifications.filter((n) => !n.assigned).length;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        p: { xs: 2, md: 4 },
      }}
    >
      {/* ── Hero header ── */}
      <Fade in timeout={400}>
        <Paper
          elevation={0}
          sx={{
            mb: 4,
            p: { xs: 3, md: 4 },
            borderRadius: 5,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            position: 'relative',
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: -60,
              right: -60,
              width: 240,
              height: 240,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
              pointerEvents: 'none',
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              bottom: -80,
              left: -40,
              width: 280,
              height: 280,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.04)',
              pointerEvents: 'none',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, position: 'relative' }}>
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <TrophyIcon sx={{ fontSize: 32, color: '#fff' }} />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: -0.5 }}>
                Mes Recommandations
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.85, fontWeight: 400 }}>
                Formations et parcours personnalisés par projet
              </Typography>
            </Box>
          </Box>

          {/* Stats row */}
          <Grid container spacing={2} sx={{ position: 'relative' }}>
            {[
              { label: 'Projets', value: uniqueNotifications.length, icon: <WorkIcon /> },
              { label: 'Affectations', value: assigned, icon: <AssignmentIcon /> },
              { label: 'Matching', value: matching, icon: <TrendingUpIcon /> },
              { label: 'Formations', value: totalCourses, icon: <SchoolIcon /> },
            ].map(({ label, value, icon }) => (
              <Grid item xs={6} sm={3} key={label}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    textAlign: 'center',
                  }}
                >
                  <Box sx={{ color: 'rgba(255,255,255,0.8)', mb: 0.5 }}>{icon}</Box>
                  <Typography variant="h5" sx={{ fontWeight: 900, color: '#fff' }}>
                    {value}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>
                    {label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Fade>

      {/* ── Cards grid ── */}
      {uniqueNotifications.length === 0 ? (
        <Zoom in timeout={400}>
          <Paper
            elevation={0}
            sx={{
              p: 8,
              borderRadius: 5,
              textAlign: 'center',
              border: '1px solid #e2e8f0',
              bgcolor: '#fff',
            }}
          >
            <Avatar sx={{ width: 80, height: 80, bgcolor: '#f1f5f9', mx: 'auto', mb: 3 }}>
              <NotificationsIcon sx={{ fontSize: 40, color: '#94a3b8' }} />
            </Avatar>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
              Aucune recommandation pour le moment
            </Typography>
            <Typography sx={{ color: '#64748b', fontSize: '1.05rem' }}>
              Votre manager n'a pas encore effectué de matching pour vos projets.
            </Typography>
          </Paper>
        </Zoom>
      ) : (
        <Grid container spacing={3}>
          {uniqueNotifications.map((item, idx) => (
            <Grid item xs={12} md={6} xl={4} key={`${item.projectId}-${idx}`}>
              <ProjectNotifCard item={item} index={idx} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
