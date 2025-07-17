import { get } from '@/https';

export const getConfig_h7 = () => get('/robot_config/driver_param/config_h7', {}, '10009');
