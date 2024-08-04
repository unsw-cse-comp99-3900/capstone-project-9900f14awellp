import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';


// for the pie chart in the dashboard
export default function PieActiveArc({data}) {
  return (
    <PieChart
      series={[
        {
          data,
          highlightScope: { faded: 'global', highlighted: 'item' },
          faded: { innerRadius: 35, additionalRadius: -30, color: 'orange' },
        },
      ]}
      height={200}
    />
  );
}
