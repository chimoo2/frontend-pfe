import React from 'react';
import Chart from 'react-apexcharts';

export default function MiniChart({ width = '100%', height = 110 }) {
  const options = {
    chart: { sparkline: { enabled: true } },
    stroke: { curve: 'smooth', width: 2 },
    colors: ['#7c3aed'],
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.22, opacityTo: 0.04 } },
    tooltip: { enabled: false },
  };

  const series = [{ name: 'trend', data: [5, 25, 15, 50, 40, 60, 45] }];

  return (
    <div style={{ borderRadius: 12, overflow: 'hidden' }}>
      <Chart options={options} series={series} type="area" width={width} height={height} />
    </div>
  );
}
