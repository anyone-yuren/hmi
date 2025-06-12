import { get } from '@/https';

// 获取语言
export const getLanguage = (params: any) => get('/sirius/robot_config/language_type', params);
// 获取点位列表
export const getPointsList = (params: any) => get('/sirius/topics/point_info_list');

// 获取线数据
export const getSegmentsInfo = () => get('/mwrobot/get_segments_info');
