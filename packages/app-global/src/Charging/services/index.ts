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
