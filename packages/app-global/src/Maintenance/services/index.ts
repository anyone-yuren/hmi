import { get } from '@gbeata/app-global';

// 获取累计行走系统数据
export const getRunningData = (): Promise<any> => {
  return get('/mwrobot/get_running_data');
};
// 获取电机累计工作时间
export const getMotorWorkingTime = (): Promise<any> => {
  return get('/mwrobot/get_motor_working_time');
};

// 获取维保数据
export const getMaintenanceData = (): Promise<any> => {
  return get('/sirius/topics/getVehicleMaintenanceInfo');
};
