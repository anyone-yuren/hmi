import { Icon } from '@iconify/react';
import { useEventListener } from 'ahooks';
import { Empty } from 'antd';
import ReactECharts from 'echarts-for-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Circle from './circle.png';
interface IProps {
  data: any;
}

const VehicleTask = (props: IProps) => {
  const { data } = props;
  if (!props?.data) return null;
  const { t } = useTranslation();
  const { missionItemList = [], completed = 0, uncompleted = 0 } = props?.data;
  const ref = React.useRef<any>(null);

  useEventListener('resize', () => {
    ref?.current?.getEchartsInstance()?.resize();
  });
  const vehicleData = React.useMemo(() => {
    if (!missionItemList) return [];
    return missionItemList
      ?.sort((a, b) => b.missionQty - a.missionQty)
      ?.slice(0, 5)
      ?.map((item, index) => {
        return {
          name: item.vehicleNum,
          value: item.missionQty,
        };
      })
      .reverse();
  }, [missionItemList]);

  const option = {
    backgroundColor: 'transparent',
    grid: {
      top: 20,
      bottom: 10,
      right: 50,
      left: 50,
    },
    xAxis: [
      {
        show: false,
      },
    ],
    yAxis: [
      {
        name: t('车号'),
        nameLocation: 'end',
        nameTextStyle: {
          padding: [0, 0, -10, -40],
          color: 'white',
        },
        axisTick: 'none',
        axisLine: 'none',
        axisLabel: {
          show: true,
          interval: 0,
          textStyle: {
            color: 'white',
            fontSize: '12',
            padding: [0, 4, 0, 0],
          },
        },
        data: vehicleData?.map((item) => item.name),
      },
      {
        axisTick: 'none',
        axisLine: 'none',
        name: t('完成'),
        nameLocation: 'end',
        nameTextStyle: {
          padding: [0, 0, -10, 40],
          color: 'white',
          textAlign: 'center',
        },
        axisLabel: {
          show: true,
          interval: 0,
          textStyle: {
            color: 'white',
            fontSize: '14',
            padding: [0, 4, 0, 2],
            textAlign: 'center',
          },
        },
        data: vehicleData,
      },
      {
        axisLine: {
          lineStyle: {
            color: 'rgba(0,0,0,0)',
          },
        },
        data: [],
      },
    ],
    series: [
      {
        type: 'bar',
        stack: 'circle',
        yAxisIndex: 0,
        data: vehicleData,
        barWidth: 5,
        showBackground: true,
        backgroundStyle: {
          color: '#011d27',
        },
        itemStyle: {
          normal: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                {
                  offset: 0,
                  color: '#64e4ac30',
                },
                {
                  offset: 1,
                  color: '#64e4ac',
                },
              ],
            },
            barBorderRadius: 0,
          },
        },
        z: 2,
      },
      {
        type: 'scatter',
        stack: 'circle',
        yAxisIndex: 0,
        data: vehicleData?.map((item) => 0),
        label: false,
        symbolSize: 10,
        itemStyle: {
          normal: {
            color: '#64e4ac',
            opacity: 1,
          },
        },
        z: 11,
      },
      {
        type: 'scatter',
        stack: 'circle',
        yAxisIndex: 0,
        data: vehicleData?.map(() => 0),
        label: false,
        symbolSize: 17,
        itemStyle: {
          normal: {
            borderColor: '#cce3ff',
            borderWidth: 1,
            color: '#e3f0ff',
            opacity: 0.2,
          },
        },
        z: 10,
      },
    ],
  };
  return (
    <>
      <div className='flex flex-col h-full'>
        <div className='flex'>
          <div className='flex-1 flex items-center justify-center pt-[10px]'>
            <div className='flex items-center justify-between text-[#64e4ac]'>
              <div className='w-[40px] relative'>
                <img src={Circle} alt='' />
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                  <Icon className='text-[20px] ' icon='mdi:tick-all'></Icon>
                </div>
              </div>
              <div className='flex-1 pl-[5px]'>
                <div className='text-[15px]'>{completed}</div>
                <div className='text-[12px]'>{t('已完成')}</div>
              </div>
            </div>
          </div>
          <div className='flex-1 flex items-center justify-center pt-[10px]'>
            <div className='flex items-center justify-between text-[#17a6f3]'>
              <div className='w-[40px] relative'>
                <img src={Circle} alt='' />
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
                  <Icon className='text-[20px]' icon='fluent-mdl2:progress-ring-dots'></Icon>
                </div>
              </div>
              <div className='flex-1 pl-[5px]'>
                <div className='text-[15px]'>{uncompleted}</div>
                <div className='text-[12px]'>{t('进行中')}</div>
              </div>
            </div>
          </div>
        </div>
        <div className='flex-1'>
          {vehicleData && vehicleData?.length ? (
            <ReactECharts ref={ref} option={option} style={{ paddingTop: '5px', height: '100%' }} />
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </div>
      </div>
    </>
  );
};

export default VehicleTask;
