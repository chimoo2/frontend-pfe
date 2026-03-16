import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

export default function StatCard({ title, value, subtitle, icon: Icon, sx }) {
  return (
    <Card sx={{
      borderRadius: '16px',
      overflow: 'hidden',
      position: 'relative',
      color: sx && sx.color ? sx.color : 'inherit',
      transition: 'transform 280ms cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 280ms ease',
      border: sx && sx.background ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e5e7eb',
      '&:hover': {
        transform: 'translateY(-12px)',
        boxShadow: '0 28px 56px rgba(15,23,42,0.15)'
      },
      ...sx
    }}>
      {/* decorative background shapes */}
      <Box sx={{ position: 'absolute', right: -50, top: -30, width: 200, height: 200, pointerEvents: 'none', background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.08), transparent 50%), radial-gradient(circle at 70% 70%, rgba(255,255,255,0.05), transparent 70%)' }} />
      <Box sx={{ position: 'absolute', left: -40, bottom: -40, width: 140, height: 140, pointerEvents: 'none', borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />

      <CardContent sx={{ position: 'relative', zIndex: 1, padding: '28px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '12px', letterSpacing: '0.6px', opacity: 0.88, textTransform: 'uppercase' }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 1.5, letterSpacing: '-0.6px' }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" sx={{ display: 'block', mt: 1.5, fontWeight: 500, opacity: 0.74, letterSpacing: '0.3px' }}>
                {subtitle}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.85)', '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' } }}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
            {Icon && (
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.16)', width: 52, height: 52, mt: 1.5, transition: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)', '&:hover': { transform: 'scale(1.1) rotate(8deg)', bgcolor: 'rgba(255,255,255,0.24)' } }}>
                <Icon sx={{ fontSize: 26 }} />
              </Avatar>
            )}
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.1)', width: 32, height: 32, mt: 1.5 }}>
              <ArrowUpwardIcon sx={{ fontSize: 16 }} />
            </Avatar>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
