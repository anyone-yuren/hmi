import { get } from '@gbeata/app-global';

// 根据节点名称获取节点日志列表
export const getNodeLogs = (params: any) => get('/mwrobot/get_node_logs', params);
