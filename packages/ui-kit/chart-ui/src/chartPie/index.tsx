import { Card } from 'antd';
import { memo } from 'react';
import Chart from '../chart';
import useChart from '../useChart';

const ChartPie = ({
  config = {},
  height = 240
}: {
  config?: any;
  height?: number;
}) => {
  const { series = [], ...restConfig } = config;
  const chartOptions = useChart(
    restConfig
    // {
    //   dataLabels: {
    //     enabled: true,
    //   },
    //   stroke: {
    //     width: [0, 2, 3],
    //   },
    //   plotOptions: {
    //     bar: { columnWidth: '20%' },
    //   },
    //   fill: {
    //     type: ['solid', 'gradient', 'solid'],
    //   },
    //   // labels: [
    //   //   '01/01/2003',
    //   //   '02/01/2003',
    //   //   '03/01/2003',
    //   //   '04/01/2003',
    //   //   '05/01/2003',
    //   //   '06/01/2003',
    //   //   '07/01/2003',
    //   //   '08/01/2003',
    //   //   '09/01/2003',
    //   //   '10/01/2003',
    //   //   '11/01/2003',
    //   // ],
    //   // xaxis: {
    //   //   type: 'datetime',
    //   // },
    //   // yaxis: {
    //   //   title: { text: 'Points' },
    //   //   min: -0,
    //   // },
    //   tooltip: {
    //     shared: true,
    //     intersect: false,
    //     y: {
    //       formatter: (value: number) => {
    //         if (typeof value !== 'undefined') {
    //           return `${value.toFixed(0)} points`;
    //         }
    //         return value;
    //       },
    //     },
    //   },
    // }
  );

  return <Chart type='pie' series={series} options={chartOptions} height={height} />;
}

const ChartPiePanel = ({
  title,
  config = {},
  height = 240,
  style = {}
}: {
  title?: string;
  config: any;
  height?: number;
  style?: React.CSSProperties;
}) => {
  return (
    <Card
      title={title}
      style={{
        ...style,
      }}
    >
      <ChartPie config={config} height={height} />
    </Card>
  );
};

export default memo(ChartPiePanel);
