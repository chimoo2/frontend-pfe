import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardContent, Box, Typography, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function GrowthChart({
  height = 360,
  title = 'Total Growth',
  value = '$0',
  categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  series = [],
  legendItems = []
}) {
  const options = {
    chart: { stacked: true, toolbar: { show: false }, animations: { enabled: true }, fontFamily: '\"Inter\", sans-serif' },
    plotOptions: { bar: { columnWidth: '48%', borderRadius: 4 } },
    colors: ['#bfdbfe', '#0284c7', '#7c3aed', '#e9d5ff'],
    xaxis: { categories, labels: { style: { colors: '#9ca3af', fontWeight: 500 } } },
    grid: { show: true, borderColor: '#f0f4f8', strokeDasharray: 4, xaxis: { lines: { show: false } } },
    legend: { show: false },
    dataLabels: { enabled: false },
    yaxis: { labels: { style: { colors: '#9ca3af', fontWeight: 500 } } },
    tooltip: { theme: 'light', style: { fontSize: '12px', fontWeight: 500 } },
  };

  // legendItems passed in props if needed

  return (
    <Card sx={{ borderRadius: '16px', border: '1px solid #e5e7eb' }}>
      <CardContent sx={{ padding: '28px' }}>
        <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <div>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '12px', letterSpacing: '0.6px', textTransform: 'uppercase', opacity: 0.7 }}>{title}</Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mt: 1, letterSpacing: '-0.5px' }}>{value}</Typography>
          </div>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ bgcolor: '#f3f4f6', borderRadius: '8px', px: 1.5, py: 0.8 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#374151' }}>Today</Typography>
            </Box>
            <IconButton size="small" sx={{ '&:hover': { bgcolor: '#f0f4f8' } }}>
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ borderRadius: 2, overflow: 'hidden', bgcolor: 'background.paper', p: 1, animation: 'fadeInUp 420ms ease both' }}>
          <Chart options={options} series={series} type="bar" height={height} />
        </Box>

        {legendItems && legendItems.length > 0 && (
          <Box sx={{ display: 'flex', gap: 2, mt: 2, alignItems: 'center' }}>
            {legendItems.map((l) => (
              <Box key={l.name} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 12, height: 12, bgcolor: l.color, borderRadius: 1 }} />
                <Typography variant="caption" color="text.secondary">{l.name}</Typography>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
