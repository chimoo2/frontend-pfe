import React from 'react';
import { Box, Card, CardContent, Typography, Divider, IconButton } from '@mui/material';
import MiniChart from './MiniChart';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

export default function PopularList({ projects = [], title = 'Managers les plus actifs', items = null }) {
  // If explicit items are provided, use them (e.g., top skills)
  const computedItems = items ?? (() => {
    // compute top managers by number of projects
    const managerCounts = {};
    projects.forEach(p => {
      const m = p.manager || 'Inconnu';
      managerCounts[m] = (managerCounts[m] || 0) + 1;
    });
    return Object.entries(managerCounts)
      .sort((a,b) => b[1] - a[1])
      .slice(0,4)
      .map(([name,count]) => ({
        name,
        value: `${count} projet${count>1?'s':''}`,
        note: `${count} assigné${count>1?'s':''}`,
        positive: true
      }));
  })();
  const effectiveTitle = items ? title : 'Managers les plus actifs';

  return (
    <Card sx={{ borderRadius: '16px', border: '1px solid #e5e7eb' }}>
      <CardContent sx={{ padding: '28px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '16px' }}>{effectiveTitle}</Typography>
          <IconButton size="small" sx={{ '&:hover': { bgcolor: '#f0f4f8' } }}>
            <MoreVertIcon />
          </IconButton>
        </Box>

        <Box sx={{ mt: 2.5, background: 'linear-gradient(135deg, #f5f0ff 0%, #faf9ff 100%)', borderRadius: '12px', p: 1.5, border: '1px solid #f0e8ff' }}>
          <MiniChart />
        </Box>

        <Divider sx={{ my: 2.5 }} />

        {computedItems.map((it, idx) => (
          <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.2, px: 1, borderRadius: '10px', transition: 'all 200ms ease', '&:hover': { bgcolor: '#f8fafc', transform: 'translateX(8px)' } }}>
            <div>
              <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>{it.name}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mt: 0.4 }}>
                <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: it.positive ? '#10b981' : '#ef4444' }} />
                <Typography variant="caption" sx={{ fontWeight: 600, color: it.positive ? '#10b981' : '#ef4444' }}>
                  {it.note}
                </Typography>
              </Box>
            </div>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>{it.value}</Typography>
              {it.positive ? (
                <ArrowUpwardIcon color="success" fontSize="small" />
              ) : (
                <ArrowDownwardIcon color="error" fontSize="small" />
              )}
            </Box>
          </Box>
        ))}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Typography component="a" href="/manager/projects" sx={{ color: '#2563eb', fontWeight: 700, textDecoration: 'none', fontSize: '13px', letterSpacing: '0.5px', '&:hover': { color: '#1d4ed8' } }}>Voir tous</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
