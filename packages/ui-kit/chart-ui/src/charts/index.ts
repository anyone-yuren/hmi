import efficiencyCount from './efficiencyCount';
import vehicleCheckSuccessRate from './vehicleCheckSuccessRate';
import vehicleError from './vehicleError';
import vehicleState from './vehicleState';
import vehicleTask from './vehicleTask';
import vehicleTime from './vehicleTime';
import vehicleUtilization from './vehicleUtilization';
// 直接给出i18n的key,由外面的系统传进来
const echarts = {
  vehicleRunTime: {
    title: '车辆时间统计',
    component: vehicleTime,
  },
  allEfficiencyStatistics: {
    title: '效率统计',
    component: efficiencyCount,
  },
  vehicleUtilization: {
    title: '稼动率统计',
    component: vehicleUtilization,
  },
  vehicleMissionItemss: {
    title: '车辆任务统计',
    component: vehicleTask,
  },
  vehicleAbnormals: {
    title: '车辆异常信息',
    component: vehicleError,
  },
  vehicleStates: {
    title: '车辆状态',
    component: vehicleState,
  },
  vehicleCheckSuccessRate: {
    title: '车辆校准成功率',
    component: vehicleCheckSuccessRate,
  },
};

export default echarts;
