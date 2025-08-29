import { get, post } from '@gbeata/app-global';

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

// 重置维保
export const resetMaintenance = (): Promise<any> => {
  return post('/sirius/topics/resetData');
};
// 维保
export const maintenance = (params: { subsystem: number }): Promise<any> => {
  return post('/sirius/topics/alreadyMaintain', params);
};
