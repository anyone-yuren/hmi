import { useEventListener } from 'ahooks';
import ReactECharts from 'echarts-for-react';
import React from 'react';
interface IProps {
  data: any;
}
const VehicleUtilization = (props: IProps) => {
  const ref = React.useRef<any>(null);

  useEventListener('resize', () => {
    ref?.current?.getEchartsInstance()?.resize();
  });
  const utilizationConfig = React.useMemo(() => {
    console.log('props.data?.values', props.data?.values);
    let maxCountAry: any = [];
    const series = props.data?.values.map((item: any) => {
      console.log('item', item);
      const max = Math.max(...item?.list);
      maxCountAry.push(max);
      return {
        // name: t('稼动率'),
        type: 'line',
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#148df0',
        },
        areaStyle: {
          opacity: 0.8,
          // color: 'rgba(28, 68, 135, 0.7)',
        },
        emphasis: {
          focus: 'series',
        },
        data: item?.list || [],
        label: {
          show: true,
          color: '#fff',
        },
      };
    });
    return {
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: props.data?.labels || [],
          splitLine: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            fontSize: 12,
          },
        },
      ],

      series,
      max: Math.max(...maxCountAry),
    };
  }, [props.data]);

  const option = {
    grid: {
      top: 40,
      bottom: 35,
      right: 18,
      left: 30,
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(164, 165, 166, 0.38)',
      borderColor: 'transparent',
      borderRadius: 10,
      textStyle: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 700,
      },
    },
    xAxis: utilizationConfig?.xAxis,
    yAxis: [
      {
        type: 'value',
        min: 0,
        max: utilizationConfig?.max || 100,
        splitNumber: 5,
        splitLine: {
          show: false,
        },
        axisLabel: {
          fontSize: 12,
        },
      },
    ],

    dataZoom: {
      type: 'inside',
    },
    series: utilizationConfig.series,
  };

  return (
    <>
      <ReactECharts ref={ref} option={option} style={{ height: '100%' }} />
    </>
  );
};

export default React.memo(VehicleUtilization);
