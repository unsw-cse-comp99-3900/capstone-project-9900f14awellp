import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Box } from '@mui/material';

export default function SimpleLineChart({ xLabels, aLine, bLIne }) {
  return (
    <Box style={{ overflowX: 'scroll', width: '100%' }}>
      <Box style={{ width: '700px' }}>
        <LineChart
          width={700}
          height={300}
          series={[
            { data: aLine, label: 'Total Invoices', color: ' #B2BA81' }, // 蓝色
            { data: bLIne, label: 'Sent Invoices', color: '#FAEEC7' }, // 橙色
          ]}
          xAxis={[
            {
              scaleType: 'point',
              data: xLabels,
              axisLine: { stroke: '#cccccc' }, // x轴颜色
              tickLine: { stroke: '#cccccc' }, // x轴刻度线颜色
              tickLabel: {
                fill: '#666666', // x轴标签颜色
                fontSize: 12,
              },
            },
          ]}
          yAxis={[
            {
              axisLine: { stroke: '#cccccc' }, // y轴颜色
              tickLine: { stroke: '#cccccc' }, // y轴刻度线颜色
              tickLabel: {
                fill: '#666666', // y轴标签颜色
                fontSize: 12,
              },
            },
          ]}
        />
      </Box>
    </Box>
  );
}
