import { get, post } from '@gbeata/app-global';

// 获取外设参数
export const getPeripheralControlParam = (): Promise<any> => {
  return get('/robot_config/peripheral_param/config_interactor_peripheral');
};

// 更新外设参数
export const postPeripheralControlParam = (params: any): Promise<any> => {
  return post('/robot_config/peripheral_param/config_interactor_peripheral', params);
};

// 获取充电历史
export const postChargingHistory = (params: any): Promise<any> => {
  return post('/mwrobot/get_charge_record', params);
};

// 累计充电度数
export const getAccumulatedChargingDegrees = (): Promise<any> => {
  return get('/mwrobot/get_charge_degree');
};

// 累计充电次数
export const getAccumulatedChargingTimes = (): Promise<any> => {
  return get('/mwrobot/get_charge_times');
};

// 获取上次满电时间
export const getLastFullChargeTime = (): Promise<any> => {
  return get('/mwrobot/get_last_full_battery_time');
};
