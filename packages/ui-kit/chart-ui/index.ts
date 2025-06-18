import Chart from './src/Chart';
import ChartMixed from './src/chartMixed';
import TotalCard from './src/components/total-card';
import ChartArea from './src/demo1';
import useChart from './src/useChart';

export { default as ChartPie } from './src/chartPie';

import BatteryChart from './src/Battery';
import echarts from './src/charts/index';
import DeviceChart from './src/deviceChart';
import LogChart from './src/LogChart';
import title1 from './src/title/title1';
import title2 from './src/title/title2';

const title = { title1, title2 };
// const echarts = {
//   vehicleRunTime: vehicleTime,
//   allEfficiencyStatistics: efficiencyCount,
//   vehicleUtilization: vehicleUtilization,
//   vehicleMissionItemss: vehicleTask,
//   vehicleAbnormals: vehicleError,
//   vehicleStates: vehicleState,
// };
export { BatteryChart, Chart, ChartArea, ChartMixed, DeviceChart, echarts, LogChart, title, TotalCard, useChart };
