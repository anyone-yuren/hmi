import { Spin } from 'antd';
import { useTheme } from 'antd-style';
import { useTranslation } from 'react-i18next';
import Chart from '../chart';
import useChart from '../useChart';

function ChartMixed() {
  const theme = useTheme();
  const { t } = useTranslation();
  const generateData = (count: number, opts: { min: number; max: number }) => {
    const data = [];
    const { min = 0, max = 100 } = opts || {};
    for (let i = 0; i < count; i += 1) {
      data.push(Math.floor(Math.random() * (max - min + 1) + min));
    }
    return data;
  };
  // if (!series || !labels) {
  //   return (
  //     <div className='h-full flex items-center justify-center'>
  //       <Empty />
  //     </div>
  //   );
  // }
  const chartOptions = useChart({
    dataLabels: {
      enabled: true,
    },
    stroke: {
      width: [0, 2, 3],
    },
    plotOptions: {
      bar: { columnWidth: '20%' },
      heatmap: {
        colorScale: {
          ranges: [
            {
              from: 0,
              to: 5,
              color: theme.colorPrimaryBorder,
            },
            {
              from: 5,
              to: 10,
              color: theme.colorPrimary,
            },
            {
              from: 10,
              to: 30,
              color: theme.colorWarning,
            },
          ],
        },
      },
    },
    fill: {
      type: ['solid', 'gradient', 'solid'],
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'center',
      formatter: (seriesName: string) => {
        return seriesName;
      },
    },
    // labels: labels,
    yaxis: {
      title: { text: 'Points' },
      min: -0,
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number) => {
          if (typeof value !== 'undefined') {
            return `${value.toFixed(0)}`;
          }
          return value;
        },
      },
    },
  });

  return (
    <Chart
      type='heatmap'
      series={[
        {
          name: 'Jan',
          data: generateData(31, {
            min: 0,
            max: 30,
          }),
        },
        {
          name: 'Feb',
          data: generateData(31, {
            min: 0,
            max: 30,
          }),
        },
        {
          name: 'Mar',
          data: generateData(31, {
            min: 0,
            max: 30,
          }),
        },
        {
          name: 'Apr',
          data: generateData(31, {
            min: 0,
            max: 30,
          }),
        },
        {
          name: 'May',
          data: generateData(31, {
            min: 0,
            max: 30,
          }),
        },
        {
          name: 'Jun',
          data: generateData(31, {
            min: 0,
            max: 30,
          }),
        },
        {
          name: 'Jul',
          data: generateData(31, {
            min: 0,
            max: 30,
          }),
        },
        {
          name: 'Aug',
          data: generateData(31, {
            min: 0,
            max: 30,
          }),
        },
        {
          name: 'Sep',
          data: generateData(31, {
            min: 0,
            max: 30,
          }),
        },
      ]}
      options={chartOptions}
      height={200}
    />
  );
}

export default function ChartMixedPanel({ loading }) {
  const { t } = useTranslation();
  return !loading ? (
    <ChartMixed />
  ) : (
    <div className='h-full flex items-center justify-center'>
      <Spin />
    </div>
  );
}
