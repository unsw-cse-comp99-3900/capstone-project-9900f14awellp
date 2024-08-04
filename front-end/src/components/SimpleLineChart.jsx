import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Box } from '@mui/material';

// for line chart in the dashboard
export default function SimpleLineChart({ xLabels, aLine, bLIne }) {
  return (
    <Box style={{ overflowX: 'scroll', width: '100%' }}>
      <Box style={{ width: '700px' }}>
        <LineChart
          width={700}
          height={300}
          series={[
            { data: aLine, label: 'Total Invoices', color: ' #B2BA81' }, 
            { data: bLIne, label: 'Sent Invoices', color: '#FAEEC7' }, 
          ]}
          xAxis={[
            {
              scaleType: 'point',
              data: xLabels,
              axisLine: { stroke: '#cccccc' }, 
              tickLine: { stroke: '#cccccc' }, 
              tickLabel: {
                fill: '#666666', 
                fontSize: 12,
              },
            },
          ]}
          yAxis={[
            {
              axisLine: { stroke: '#cccccc' }, 
              tickLine: { stroke: '#cccccc' }, 
              tickLabel: {
                fill: '#666666', 
                fontSize: 12,
              },
            },
          ]}
        />
      </Box>
    </Box>
  );
}
