import { defHttp } from '../axios';

// 获取区域列表哦
export const getMission = (params: any) =>
  defHttp.get<any>({
    url: '/mission',
    params,
  });

// 取消一条任务
export const cancelMission = (params: any) =>
  defHttp.post<any>({
    url: '/mission/cancel',
    data: params,
  });

// 创建点到点任务
export const createPointToPointMission = (params: any) =>
  defHttp.post<any>({
    url: '/mission/slot-to-slot',
    data: params,
  });
// 创建区域任务
export const createAreaMission = (params: any) =>
  defHttp.post<any>({
    url: '/mission/slot-to-area',
    data: params,
  });
// 手动完成一条任务
export const completeMission = (params: any) =>
  defHttp.post<any>({
    url: `/mission/${params}/manual-complete`,
  });
