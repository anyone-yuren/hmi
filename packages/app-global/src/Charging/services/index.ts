import { get, post } from '@gbeata/app-global';

// 获取外设参数
export const getPeripheralControlParam = (): Promise<any> => {
  return get('/robot_config/peripheral_param/config_interactor_peripheral');
};

// 更新外设参数
export const postPeripheralControlParam = (params: any): Promise<any> => {
  return post('/robot_config/peripheral_param/config_interactor_peripheral', params);
};

// 获取充电设置参数
export const getChargingConfig = (): Promise<any> => {
  return get('/mwrobot/config/get_charge_config');
};

// 设置充电参数
export const postChargingConfig = (data: any): Promise<any> => {
  return post('/mwrobot/config/set_charge_config', { ...data });
};

// 获取充电历史
export const postChargingHistory = (data: any): Promise<any> => {
  return post('/mwrobot/get_charge_record', { ...data });
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

// 充电指令
export const postChargingFunction = (data: any): Promise<any> => {
  return post('/sirius/topics/charge_function', { ...data });
};
