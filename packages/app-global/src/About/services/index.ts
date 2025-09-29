import { get } from '@gbeata/app-global';

// 根据节点名称获取节点日志列表
export const getNodeLogs = (params: any) => get('/mwrobot/get_node_logs', params);
export const getChangeLogs = (params: any) => get('/mwrobot/change_log', params);

export const config_agv_info = () => get('/robot_config/base_param/config_agv_info');
