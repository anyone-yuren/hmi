import { Card, Empty, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import Chart from '../chart';
import useChart from '../useChart';

function ChartMixed({ series, labels }) {
  const { t } = useTranslation();
  if (!series || !labels) {
    return (
      <div className='h-full flex items-center justify-center'>
        <Empty />
      </div>
    );
  }
  const chartOptions = useChart({
    dataLabels: {
      enabled: true,
    },
    stroke: {
      width: [0, 2, 3],
    },
    plotOptions: {
      bar: { columnWidth: '20%' },
    },
    fill: {
      type: ['solid', 'gradient', 'solid'],
    },
    labels: labels,
    xaxis: {
      type: 'datetime',
    },
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

  return <Chart type='line' series={series} options={chartOptions} height={320} />;
}

export default function ChartMixedPanel({ series, labels, loading }) {
  const { t } = useTranslation();
  return (
    <Card
      title={t('sys.charts.capacity')}
      styles={{
        body: {
          minHeight: 320,
        },
      }}
    >
      {!loading ? (
        <ChartMixed series={series} labels={labels} />
      ) : (
        <div className='h-full flex items-center justify-center'>
          <Spin />
        </div>
      )}
    </Card>
  );
}
