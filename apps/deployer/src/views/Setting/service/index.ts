import { get, post } from '@gbeata/app-global';

export const postFloorList = () => post('/navigation/floor_list');

export const addFloor = (num: any) => {
  return post('/navigation/add_new_floor_number', {
    floor_number: num,
  });
};

export const getBasicControlParam = (): Promise<any> => {
  return get('/robot_config/control_param/basic_control_param');
};
export const postBasicControlParam = (params: any): Promise<any> => {
  return post('/robot_config/control_param/basic_control_param', params);
};

// 获取底盘参数
export const getActionControlParam = (): Promise<any> => {
  return get('/robot_config/control_param/action_control_param');
};
// 更新底盘参数
export const postActionControlParam = (params: any): Promise<any> => {
  return post('/robot_config/control_param/action_control_param', params);
};

// 获取外设参数
export const getPeripheralControlParam = (): Promise<any> => {
  return get('/robot_config/peripheral_param/config_interactor_peripheral');
};

// 更新外设参数
export const postPeripheralControlParam = (params: any): Promise<any> => {
  return post('/robot_config/peripheral_param/config_interactor_peripheral', params);
};
