import { useEventListener } from 'ahooks';
import { Empty } from 'antd';
import ReactECharts from 'echarts-for-react';
import React from 'react';
interface IProps {
  data: any;
}
const VehicleCheckSuccessRate = (props: IProps) => {
  const ref = React.useRef<any>(null);

  React.useEffect(() => {
    console.log('data', props.data);
  }, [props]);

  useEventListener('resize', () => {
    ref?.current?.getEchartsInstance()?.resize();
  });

  const colorBox = ['#4caf50', '#FF5722', '#17a7f5'];
  const series = React.useMemo(() => {
    const { values } = props?.data || {};
    if (!values || !values.length) return [];
    return values.map((item, index) => {
      return {
        name: item.title,
        type: 'bar',
        stack: 'total' + index,
        label: {
          show: true,
          formatter: (params) => params.value + '%',
          color: 'white',
        },
        data: item.list,
        itemStyle: {
          color: colorBox[index],
        },
      };
    });
  }, [props?.data]);

  const option = {
    grid: {
      top: 50,
      bottom: 35,
      right: 18,
      left: 30,
    },
    legend: {
      top: '5%',
      left: 'center',
      type: 'scroll',
      textStyle: {
        color: 'white',
      },
      pageTextStyle: {
        color: 'white',
      },
      padding: [0, 10, 0, 10],
    },
    yAxis: {
      type: 'value',
      splitLine: {
        show: false,
      },
      axisLabel: {
        fontSize: 12,
      },
    },
    xAxis: {
      type: 'category',
      data: props?.data?.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    series,
  };
  if (!props?.data?.labels.length) {
    return (
      <div className='flex h-full w-full items-center justify-center'>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </div>
    );
  }
  return (
    <>
      <ReactECharts ref={ref} option={option} style={{ height: '100%' }} />
    </>
  );
};

export default React.memo(VehicleCheckSuccessRate);
