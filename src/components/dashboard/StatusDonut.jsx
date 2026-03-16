import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardContent, Box, Typography, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function StatusDonut({ data = { todo: 0, inprogress: 0, completed: 0 } }) {
  const series = [data.todo, data.inprogress, data.completed];
  const labels = ['À faire', 'En cours', 'Terminés'];

  const options = {
    chart: { type: 'donut', toolbar: { show: false } },
    labels,
    legend: { position: 'bottom', horizontalAlign: 'center', fontSize: '12px', markers: { width: 10, height: 10 } },
    colors: ['#6366f1', '#f59e0b', '#10b981'],
    dataLabels: { enabled: true, style: { fontSize: '12px', fontWeight: 600 } },
    tooltip: { theme: 'light' },
  };

  return (
    <Card sx={{ borderRadius: '16px', border: '1px solid #e5e7eb' }}>
      <CardContent sx={{ padding: '28px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '16px' }}>Répartition des statuts</Typography>
          <IconButton size="small" sx={{ '&:hover': { bgcolor: '#f0f4f8' } }}>
            <MoreVertIcon />
          </IconButton>
        </Box>
        <Box sx={{ width: '100%', minHeight: 240 }}>
          <Chart options={options} series={series} type="donut" height={240} />
        </Box>
      </CardContent>
    </Card>
  );
}
