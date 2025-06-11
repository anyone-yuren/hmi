import { Card, Select, Typography } from 'antd';
import { useState } from 'react';

import { useTranslation } from 'react-i18next';
import Chart from '../chart';
import useChart from '../useChart';

export default function LogCharts() {
  const { t } = useTranslation();
  const [year, setYear] = useState('2023');
  const series: Record<string, ApexAxisChartSeries> = {
    '2022': [
      { name: t('global.logs.types.error'), data: [10, 41, 35, 51, 49, 61, 69, 91, 148, 35, 51, 1] },
      { name: t('global.logs.types.warn'), data: [10, 34, 13, 56, 77, 88, 99, 45, 13, 56, 77, 2] },
    ],

    '2023': [
      { name: t('global.logs.types.error'), data: [51, 35, 41, 10, 91, 69, 62, 148, 91, 35, 51, 133] },
      { name: t('global.logs.types.warn'), data: [56, 13, 34, 10, 77, 99, 88, 45, 13, 56, 77, 12] },
    ],
  };
  return (
    <Card
      className='flex-col'
      size='small'
      title={
        <header className='flex w-full justify-between self-start items-center'>
          <Typography.Title className='!m-0' level={5}>
            {t('global.charts.errorList')}
          </Typography.Title>
          <Select
            size='small'
            defaultValue={year}
            onChange={(value) => setYear(value)}
            options={[
              { value: 2023, label: '2023' },
              { value: 2022, label: '2022' },
            ]}
          />
        </header>
      }
    >
      <main className='w-full'>
        <ChartArea series={series[year]} />
      </main>
    </Card>
  );
}

function ChartArea({ series }: { series: ApexAxisChartSeries }) {
  const chartOptions = useChart({
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      type: 'category',
      // categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jut', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    },
    tooltip: {},
  });

  return <Chart type='area' series={series} options={chartOptions} height={220} />;
}
