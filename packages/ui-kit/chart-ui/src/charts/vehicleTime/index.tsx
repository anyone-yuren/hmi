import { useEventListener } from 'ahooks';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts/core';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
interface IProps {
  data: any;
}
const VehicleTime = (props: IProps) => {
  const { data: vehicleRunTime } = props;
  const ref = React.useRef<any>(null);
  const { t, i18n } = useTranslation();

  useEventListener('resize', () => {
    ref?.current?.getEchartsInstance()?.resize();
  });

  const WORK_COLOR = '#15c7c5';
  const FREE_COLOR = '#18adfe';
  const ERROR_COLOR = 'rgba(247, 86, 79, 0.7)';
  const AVERAGE_COLOR = '#fe9c5e';
  const vehicleRunTimeConfig = React.useMemo(() => {
    const sortAry = vehicleRunTime
      ?.sort((a: any, b: any) => b.missionQty - a.missionQty)
      .slice(0, 7)
      .reverse();
    const xAxis: any = [];
    const workTimeAry: any = [];
    const freeTimeAry: any = [];
    const errorTimeAry: any = [];
    const averageTaskAry: any = [];
    const tableRenderList: any = [];

    sortAry?.forEach((item: any, index: number) => {
      xAxis.push(item.vehicleNum);
      workTimeAry.push(item.workTime);
      freeTimeAry.push(item.freeTime);
      errorTimeAry.push(item.errorTime);
      averageTaskAry.push(item.averageTask);
      tableRenderList.push([item.vehicleNum, item.workTime, item.freeTime, item.errorTime, item.averageTask]);
    });
    const series = [
      {
        name: t('有效'),
        type: 'bar',
        stack: 'time',
        showBackground: true,
        backgroundStyle: {
          color: '#011d27',
        },
        tooltip: {
          valueFormatter(value) {
            return `${value}h`;
          },
        },
        data: workTimeAry,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: WORK_COLOR }, // 起始颜色
            { offset: 1, color: '#15c7c500' }, // 结束颜色
          ]),
          borderRadius: [0, 0, 0, 0],
        },
      },
      {
        name: t('空闲'),
        type: 'bar',
        stack: 'time2',
        showBackground: true,
        backgroundStyle: {
          color: '#011d27',
        },
        tooltip: {
          confine: true,
          valueFormatter(value) {
            return `${value}h`;
          },
        },
        data: freeTimeAry,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: FREE_COLOR }, // 起始颜色
            { offset: 1, color: '#18adfe00' }, // 结束颜色
          ]),
          borderRadius: [0, 0, 0, 0],
        },
      },
      {
        name: t('故障'),
        type: 'bar',
        stack: 'time3',
        showBackground: true,
        backgroundStyle: {
          color: '#011d27',
        },
        tooltip: {
          valueFormatter(value) {
            return `${value}h`;
          },
        },
        data: errorTimeAry,

        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: ERROR_COLOR }, // 起始颜色
            { offset: 1, color: 'rgba(247, 86, 79, 0)' }, // 结束颜色
          ]),
          borderRadius: [0, 0, 0, 0],
        },
      },
      {
        name: t('时均任务'),
        type: 'line',
        yAxisIndex: 1,
        tooltip: {
          valueFormatter(value) {
            return `${value}`;
          },
        },
        data: averageTaskAry,

        itemStyle: {
          color: AVERAGE_COLOR,
        },
      },
    ];

    return { xAxis, series, tableRenderList };
  }, [vehicleRunTime, i18n.language]);

  const option = {
    backgroundColor: 'transparent',
    legend: {
      type: 'scroll',
      textStyle: {
        fontSize: 12,
        color: '#fff',
        fontWeight: 700,
      },
      itemWidth: 15,
      pageTextStyle: {
        color: 'white',
      },
    },
    dataZoom: {
      type: 'inside',
    },
    grid: {
      left: 0,
      right: 0,
      bottom: 10,
      // top: 50,
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: vehicleRunTimeConfig.xAxis || [],
        axisPointer: {
          type: 'shadow',
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: t('时间(h)'),
        nameTextStyle: {
          padding: [0, 20, 0, 20],
        },
        min: 0,
        max: 24,
        interval: 4,
        axisLabel: {
          formatter: '{value}',
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
      {
        type: 'value',
        name: t('时均任务(个)'),
        nameTextStyle: {
          padding: [0, 20, 0, 0],
        },
        axisLabel: {
          formatter: (value: number) => `${value}`,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
    ],
    series: vehicleRunTimeConfig.series,
  };

  return (
    <div className='h-full w-full px-[10px]'>
      <ReactECharts ref={ref} option={option} style={{ paddingTop: '5px', height: '100%' }} />
    </div>
  );
};

export default memo(VehicleTime);
