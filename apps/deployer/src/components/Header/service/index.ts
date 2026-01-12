import { get, post } from '@gbeata/app-global';

export const config_agv_info = () => get('/robot_config/base_param/config_agv_info');

export const change_language_type = (params: any) => post('/sirius/robot_config/language_type', params);
