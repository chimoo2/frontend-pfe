import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Avatar,
  Divider,
  Grid,
  Paper,
  Fade,
  Zoom,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  Link as LinkIcon
} from '@mui/icons-material';

// Fonction utilitaire pour rendre les URLs cliquables
const renderTextWithLinks = (text) => {
  if (!text) return text;

  // Regex pour détecter les URLs (améliorée)
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  // Diviser le texte et remplacer les URLs par des composants Link
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      // Nettoyer l'URL
      const cleanUrl = part.trim();

      // Extraire le nom de domaine pour l'afficher
      try {
        const url = new URL(cleanUrl);
        const domain = url.hostname.replace('www.', '');
        const displayText = domain.length > 20 ? domain.substring(0, 20) + '...' : domain;

        return (
          <Box key={index} sx={{ display: 'inline-block', mx: 0.5, my: 0.5 }}>
            <Button
              component="a"
              href={cleanUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              size="small"
              startIcon={<LinkIcon />}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                py: 0.5,
                px: 1.5,
                fontSize: '0.85rem',
                minHeight: 'auto',
                borderColor: '#667eea',
                color: '#667eea',
                fontWeight: 500,
                '&:hover': {
                  borderColor: '#5a67d8',
                  bgcolor: 'rgba(102, 126, 234, 0.1)',
                  textDecoration: 'none',
                  transform: 'scale(1.02)'
                },
                transition: 'all 0.2s ease-in-out',
                maxWidth: '200px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
              title={`Ouvrir ${cleanUrl} dans un nouvel onglet`}
            >
              {displayText}
            </Button>
          </Box>
        );
      } catch (error) {
        // Si l'URL n'est pas valide, afficher un bouton générique
        return (
          <Box key={index} sx={{ display: 'inline-block', mx: 0.5, my: 0.5 }}>
            <Button
              component="a"
              href={cleanUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              size="small"
              startIcon={<LinkIcon />}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                py: 0.5,
                px: 1,
                fontSize: '0.8rem',
                minHeight: 'auto',
                borderColor: '#667eea',
                color: '#667eea',
                '&:hover': {
                  borderColor: '#5a67d8',
                  bgcolor: 'rgba(102, 126, 234, 0.1)',
                  textDecoration: 'none'
                }
              }}
            >
              Lien
            </Button>
          </Box>
        );
      }
    }
    // Pour le texte normal, préserver les sauts de ligne
    return (
      <span key={index} style={{ whiteSpace: 'pre-line' }}>
        {part}
      </span>
    );
  });
};

export default function CourseRecommendations() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};

  const training = Array.isArray(state.training) ? state.training : [];
  const employeeName = state.employeeName || 'Candidat';
  const projectName = state.projectName || '';
  const missingSkills = Array.isArray(state.missingSkills) ? state.missingSkills : [];

  return (
    <Box sx={{
      flex: 1,
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      py: 4,
      px: 2
    }}>
      {/* Header Section */}
      <Fade in={true} timeout={800}>
        <Paper
          elevation={0}
          sx={{
            mb: 4,
            p: 4,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c)',
              backgroundSize: '400% 400%',
              animation: 'gradientShift 3s ease infinite',
            },
            '@keyframes gradientShift': {
              '0%': { backgroundPosition: '0% 50%' },
              '50%': { backgroundPosition: '100% 50%' },
              '100%': { backgroundPosition: '0% 50%' },
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Tooltip title="Retour au matching">
              <IconButton
                onClick={() => navigate(-1)}
                sx={{
                  mr: 2,
                  bgcolor: 'rgba(102, 126, 234, 0.1)',
                  color: '#667eea',
                  '&:hover': {
                    bgcolor: 'rgba(102, 126, 234, 0.2)',
                    transform: 'scale(1.05)'
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
            <Avatar sx={{
              bgcolor: 'linear-gradient(45deg, #667eea, #764ba2)',
              mr: 2,
              width: 56,
              height: 56
            }}>
              <SchoolIcon sx={{ fontSize: 28 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{
                fontWeight: 800,
                mb: 1,
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Formations Recommandées
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#64748b', fontWeight: 500 }}>
                Suggestions personnalisées pour {employeeName}
                {projectName && ` • Projet "${projectName}"`}
              </Typography>
            </Box>
          </Box>

          {/* Stats Cards */}
          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: 'rgba(102, 126, 234, 0.1)',
                border: '1px solid rgba(102, 126, 234, 0.2)',
                textAlign: 'center'
              }}>
                <PersonIcon sx={{ fontSize: 32, color: '#667eea', mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#667eea' }}>
                  {employeeName}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Candidat
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: 'rgba(118, 75, 162, 0.1)',
                border: '1px solid rgba(118, 75, 162, 0.2)',
                textAlign: 'center'
              }}>
                <WorkIcon sx={{ fontSize: 32, color: '#764ba2', mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#764ba2' }}>
                  {training.length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Recommandations
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: 'rgba(245, 87, 108, 0.1)',
                border: '1px solid rgba(245, 87, 108, 0.2)',
                textAlign: 'center'
              }}>
                <TrendingUpIcon sx={{ fontSize: 32, color: '#f5576c', mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#f5576c' }}>
                  {missingSkills.length}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Compétences à développer
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                textAlign: 'center'
              }}>
                <StarIcon sx={{ fontSize: 32, color: '#10b981', mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#10b981' }}>
                  IA
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  Recommandations intelligentes
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Missing Skills Alert */}
          {missingSkills.length > 0 && (
            <Paper sx={{
              mt: 3,
              p: 3,
              borderRadius: 2,
              bgcolor: 'rgba(245, 193, 7, 0.1)',
              border: '1px solid rgba(245, 193, 7, 0.3)',
              borderLeft: '4px solid #f59e0b'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#92400e', mb: 2 }}>
                🎯 Compétences à développer
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {missingSkills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    sx={{
                      bgcolor: 'rgba(245, 193, 7, 0.2)',
                      color: '#92400e',
                      fontWeight: 600,
                      '&:hover': { bgcolor: 'rgba(245, 193, 7, 0.3)' }
                    }}
                  />
                ))}
              </Stack>
            </Paper>
          )}
        </Paper>
      </Fade>

      {/* Content Section */}
      {training.length === 0 ? (
        <Zoom in={true} timeout={600}>
          <Paper sx={{
            p: 6,
            borderRadius: 4,
            textAlign: 'center',
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.1)'
          }}>
            <Avatar sx={{
              width: 80,
              height: 80,
              bgcolor: 'rgba(100, 116, 139, 0.1)',
              mx: 'auto',
              mb: 3
            }}>
              <SchoolIcon sx={{ fontSize: 40, color: '#64748b' }} />
            </Avatar>
            <Typography variant="h5" sx={{ mb: 2, color: '#1e293b', fontWeight: 700 }}>
              Aucune recommandation disponible
            </Typography>
            <Typography sx={{ color: '#64748b', mb: 3, fontSize: '1.1rem' }}>
              Sélectionnez un candidat dans le tableau de matching pour afficher ses formations recommandées.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate(-1)}
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5a67d8, #6b46c1)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)'
                },
                transition: 'all 0.3s ease-in-out'
              }}
            >
              Retour au matching
            </Button>
          </Paper>
        </Zoom>
      ) : (
        <Stack spacing={3}>
          {training.map((item, index) => (
            <Zoom in={true} timeout={600 + (index * 200)} key={index}>
              <Card
                sx={{
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.15)',
                    border: '1px solid rgba(102, 126, 234, 0.3)'
                  },
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '4px',
                    height: '100%',
                    background: `linear-gradient(180deg, ${['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe'][index % 5]}, ${['#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'][index % 5]})`
                  }
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                    <Avatar sx={{
                      bgcolor: `linear-gradient(45deg, ${['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe'][index % 5]}, ${['#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'][index % 5]})`,
                      mr: 3,
                      width: 60,
                      height: 60
                    }}>
                      <CheckCircleIcon sx={{ fontSize: 28 }} />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{
                        mb: 2,
                        fontWeight: 700,
                        color: '#1e293b',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        Recommandation #{index + 1}
                        <Chip
                          label={`${index + 1}/${training.length}`}
                          size="small"
                          sx={{
                            ml: 2,
                            bgcolor: 'rgba(102, 126, 234, 0.1)',
                            color: '#667eea',
                            fontWeight: 600
                          }}
                        />
                      </Typography>
                      <Box sx={{
                        color: '#374151',
                        lineHeight: 1.7,
                        fontSize: '1.05rem'
                      }}>
                        {renderTextWithLinks(item)}
                      </Box>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 3, borderColor: 'rgba(0, 0, 0, 0.08)' }} />

                  <Stack direction="row" spacing={2} flexWrap="wrap" alignItems="center">
                    <Chip
                      icon={<PersonIcon />}
                      label={employeeName}
                      sx={{
                        bgcolor: 'rgba(102, 126, 234, 0.1)',
                        color: '#667eea',
                        fontWeight: 600,
                        '& .MuiChip-icon': { color: '#667eea' }
                      }}
                    />
                    {projectName && (
                      <Chip
                        icon={<WorkIcon />}
                        label={projectName}
                        variant="outlined"
                        sx={{
                          borderColor: '#764ba2',
                          color: '#764ba2',
                          fontWeight: 600,
                          '& .MuiChip-icon': { color: '#764ba2' }
                        }}
                      />
                    )}
                    <Chip
                      icon={<StarIcon />}
                      label="Recommandation IA"
                      sx={{
                        bgcolor: 'rgba(16, 185, 129, 0.1)',
                        color: '#10b981',
                        fontWeight: 600,
                        '& .MuiChip-icon': { color: '#10b981' }
                      }}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Zoom>
          ))}
        </Stack>
      )}
    </Box>
  );
}
