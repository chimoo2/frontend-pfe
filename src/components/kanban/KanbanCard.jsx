import React from 'react';
import { Card, CardContent, Typography, Box, Avatar, Chip } from '@mui/material';

export default function KanbanCard({ title, name, label, status, description, skillsNeeded = [], categoryRequirements = [], avatars = [], comments, onClick, isMatching = false }) {
  const displayTitle = title || name;
  const displayLabel = label || status;
  // build a brief skills string (max 3)
  const skillsText = skillsNeeded && skillsNeeded.length
    ? skillsNeeded.slice(0,3).map(s=>s.skill || s.skillName || s).join(', ') + (skillsNeeded.length>3?` (+${skillsNeeded.length-3})`:'')
    : null;
  const catsText = categoryRequirements && categoryRequirements.length
    ? `${categoryRequirements.length} cat.`
    : null;
  return (
    <Card
      onClick={onClick}
      sx={{
        mb: 2,
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: isMatching ? '0 8px 24px rgba(76,29,149,0.15)' : '0 6px 18px rgba(15,23,42,0.06)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 180ms ease, box-shadow 180ms ease',
        '&:hover': onClick ? { transform: 'translateY(-6px)', boxShadow: isMatching ? '0 14px 36px rgba(76,29,149,0.2)' : '0 12px 30px rgba(15,23,42,0.12)' } : {}
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'stretch' }}>
        <Box sx={{ width: 6, bgcolor: isMatching ? '#8b5cf6' : (status ? (status==='Completed'? '#10b981' : status==='In Progress'? '#f59e0b' : '#6366f1') : '#6b7280') }} />
        <CardContent sx={{ p: 2, position: 'relative', width: '100%' }}>
          {displayLabel && (
            <Chip label={displayLabel} size="small" sx={{ position: 'absolute', top: 10, right: 10, bgcolor: '#f3f4f6', fontWeight: 600 }} />
          )}
          <Typography variant="body1" sx={{ mt: displayLabel ? 1.5 : 0, fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>
            {displayTitle}
          </Typography>
          {description && (
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1, lineHeight: 1.4, maxHeight: 48, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {description}
            </Typography>
          )}
          {skillsText && (
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1, display: 'block' }}>
              Skills: {skillsText}
            </Typography>
          )}
          {catsText && (
            <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
              {catsText}
            </Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {avatars.slice(0,3).map((a,i)=>(
                <Avatar key={i} sx={{ width: 28, height: 28, fontSize: '12px', ml: i===0?0:-0.5 }}>{a}</Avatar>
              ))}
              {avatars.length>3 && (
                <Avatar sx={{ width:28,height:28,fontSize:'12px',ml:-0.5,bgcolor:'#e5e7eb'}}>+{avatars.length-3}</Avatar>
              )}
            </Box>
            {typeof comments === 'number' && (
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>{comments}</Typography>
            )}
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
}
