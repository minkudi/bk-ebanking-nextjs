'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

export default function DashboardChart() {
  const options = useMemo(
    () => ({
      chart: {
        id: 'balance-transactions',
        toolbar: { show: false },
        zoom: { enabled: false },
        fontFamily: 'inherit',
      },
      dataLabels: { enabled: false },
      stroke: {
        curve: 'smooth',
        width: 3,
      },
      grid: {
        borderColor: '#e5e7eb',
        strokeDashArray: 4,
        yaxis: { lines: { show: true } },
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'left',
        fontSize: '11px',
        markers: { radius: 12 },
      },
      colors: ['#3b82f6', '#10b981'],
      xaxis: {
        categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: {
            colors: '#94a3b8',
            fontSize: '11px',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: '#94a3b8',
            fontSize: '11px',
          },
        },
      },
      tooltip: {
        shared: true,
        intersect: false,
      },
    }),
    []
  );

  const series = useMemo(
    () => [
      {
        name: 'Solde',
        type: 'area',
        data: [1200, 1500, 1800, 1600, 2100, 2400],
      },
      {
        name: 'Transactions',
        type: 'line',
        data: [8, 10, 12, 9, 14, 16],
      },
    ],
    []
  );

  return (
    <div className="w-full h-[260px]">
      <ReactApexChart
        options={options}
        series={series}
        type="line"
        height="100%"
      />
    </div>
  );
}
