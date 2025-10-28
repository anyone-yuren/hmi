import { get, post } from '@gbeata/app-global';

export const clientLogin = (params: { username: string; password: string }) => {
  return post('/mwrobot/wireless_client/login', {
    ...params,
  });
};
// 获取无线AP列表
export const getApList = (): Promise<any> => {
  return get('/mwrobot/wireless_client/scan_ap_list');
};
// 获取当前无线AP信息
export const getApInfo = (): Promise<any> => {
  return get('/mwrobot/wireless_client/get_ap_info');
};
// 获取当前WAN网络信息
export const getWanInfo = (data: any) => {
  return get('/mwrobot/wireless_client/get_wan_net_info');
};

// 获取当前LAN网络信息
export const getLanInfo = (): Promise<any> => {
  return get('/mwrobot/wireless_client/get_lan_net_info');
};
// 获取端口转发列表
export const getPortList = (): Promise<any> => {
  return get('/mwrobot/wireless_client/get_port_fwd_list');
};
// 设置连接无线AP
export const postConnectAp = (data: any) => post('/mwrobot/wireless_client/connect_ap', data);

// 设置WAN网络信息
export const postWanNet = (data: any) => {
  return post('/mwrobot/wireless_client/set_wan_net_info', data);
};
// 设置LAN网络信息
export const postLanNet = (data: any) => {
  return post('/mwrobot/wireless_client/set_lan_net_info', data);
};
// 设置端口转发
export const postPortFwdList = (data: any) => {
  return post('/mwrobot/wireless_client/set_port_fwd', data);
};
// 删除LAN网络信息
export const postDeletePort = (data: any) => {
  return post('/mwrobot/wireless_client/delete_port_fwd', data);
};
// 修改LAN网络信息
export const postUpdatePort = (data: any) => {
  return post('/mwrobot/wireless_client/update_port_fwd', data);
};

// 导入端口列表
export const postImportPortList = (data: any) => {
  return post('/mwrobot/wireless_client/set_port_fwd_list', data);
};
