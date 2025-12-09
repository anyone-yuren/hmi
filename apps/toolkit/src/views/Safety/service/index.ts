import { get, post } from '@gbeata/app-global';

export const postFloorList = () => post('/navigation/floor_list');

export const addFloor = (num: any) => {
  return post('/navigation/add_new_floor_number', {
    floor_number: num,
  });
};

export const getFootPrint = (): Promise<any> => {
  return get('/sirius/topics/safety_foot_print');
};

export const safetyConfig = (): Promise<any> => {
  return get('/robot_config/control_param/config_safety');
};

export const updateSafety = (data: any) => {
  return post('/robot_config/control_param/config_safety', data);
};

// 获取可活动机构列表
export const getActiveDevices = (): Promise<Result<[]>> => {
  return get('/mwrobot/config/get_active_devices');
};
export const getDeviceList = (): Promise<Result<[]>> => {
  return get('/mwrobot/config/get_device_info');
};

export const config_agv_info = () => get('/robot_config/base_param/config_agv_info');

export const postSubscription = (data: any) => {
  return post('/topics/subscription', data);
};

export const postUnSubscription = (data: any) => {
  return post('/topics/unsubscription', data);
};

export const getConfig_h7 = () => get('/robot_config/driver_param/config_h7', {}, '10009');
