import { Progress, theme } from 'antd';
import { useTranslation } from 'react-i18next';
import { BaseCard, SvgIcon } from 'ui';
import Chart from '../chart';
import useChart from '../useChart';

type Props = {
  title: string;
  increase: boolean;
  percent: string;
  count: string;
  chartData?: number[];
  loading?: boolean;
  progress?: {
    percent: number;
    strokeColor: string;
    // steps: number;
  };
  bar?: any;
};
export default function TotalCard({ title, increase, count, percent, chartData, loading, progress, bar }: Props) {
  const { useToken } = theme;
  const { token } = useToken();
  const conicColors = {
    '0%': token.colorPrimary,
    '50%': token.colorWarning,
    '100%': token.colorError,
  };
  return (
    <BaseCard loading={loading}>
      <div className='flex flex-col  p-2'>
        <h6 className='text-sm font-medium'>{title}</h6>
        <div className='flex items-center gap-4 justify-between'>
          {chartData ? (
            <div className=' flex flex-col'>
              <div className='flex flex-row'>
                {increase ? (
                  <SvgIcon
                    name='ic_rise'
                    size={24}
                    style={{
                      color: token.colorPrimary,
                    }}
                  />
                ) : (
                  <SvgIcon
                    name='ic_decline'
                    size={24}
                    style={{
                      color: token.colorError,
                    }}
                  />
                )}
                <div className='ml-2'>
                  <span>{increase ? '+' : '-'}</span>
                  <span>{percent}</span>
                </div>
              </div>
              <h3 className='text-2xl font-bold'>{count}</h3>
            </div>
          ) : null}
          {progress || bar ? (
            <div>
              <h3 className='text-2xl font-bold'>{count}</h3>
              <span>{percent}</span>
            </div>
          ) : null}

          {chartData?.length ? <ChartLine data={chartData} /> : null}
          {bar ? <ChartPolarArea data={Object.values(bar)} /> : null}
          {progress ? (
            <Progress percent={progress.percent} type='dashboard' size={[80, 80]} strokeColor={conicColors} />
          ) : null}
        </div>
      </div>
    </BaseCard>
  );
}

function ChartLine({ data }: { data: number[] }) {
  const series = [
    {
      name: '',
      data,
    },
  ];
  const chartOptions = useChart({
    tooltip: {
      x: {
        show: false,
      },
    },
    xaxis: {
      labels: {
        show: false,
        showDuplicates: false,
      },
      tooltip: {
        enabled: false,
      },
      crosshairs: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
      crosshairs: {
        show: false,
      },
    },
    grid: {
      show: false,
    },
  });

  return <Chart type='line' series={series} options={chartOptions} width={120} height={68} />;
}

function ChartPolarArea({ data }: { data: number[] }) {
  const { t } = useTranslation();
  const series = data;
  const chartOptions = useChart({
    labels: [t('global.charts.container.half'), t('global.charts.container.empty'), t('global.charts.container.full')],
    // labels: ['半', '空', '满'],
    plotOptions: {
      pie: {
        donut: {
          labels: {
            total: {
              show: false,
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number, opts) {
        const seriesIndex = opts.seriesIndex;
        const value = opts.w.config.series[seriesIndex];
        return value;
      },
      style: {
        fontSize: '12px',
        colors: ['#333'],
      },
    },
    legend: {
      show: true, // 开启 legend
      position: 'right', // 👈 让它在右侧
      horizontalAlign: 'center', // 上下居中对齐
      fontSize: '12px',
      labels: {
        colors: '#333',
      },
      offsetY: -12, // 👈 向下偏移 0 个单位
      offsetX: 0, // 👈 向右偏移 0 个单位
      itemMargin: {
        vertical: 2, // 👈 垂直间距
        horizontal: 4, // 👈 水平间距
      },
      markers: {
        size: 4,
      },
    },
    tooltip: {
      x: {
        show: true,
      },
    },
  });
  return <Chart type='pie' series={series} options={chartOptions} width={280} height={80} />;
}
