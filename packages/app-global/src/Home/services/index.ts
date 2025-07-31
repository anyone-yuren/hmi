import { get } from '@gbeata/app-global';

// 获取点位列表
export const getPointsList = (params: any) => get('/sirius/topics/point_info_list');

// 获取线数据
export const getSegmentsInfo = () => get('/mwrobot/get_segments_info');

// 获取车辆轮廓
export const getVehicleShape = () => get('/sirius/topics/safety_foot_print');

export const getAgvInfo = (params: any) => get('/robot_config/base_param/config_agv_info', params);
