import { defHttp } from '../axios';

// 获取区域列表哦
export const getMissionDaysTaskCount = (params: any) =>
  defHttp.get<any>({
    url: '/dashboard-mission/days-task-count',
    params,
  });
export const geMissionTaskByRoute = (params: any) =>
  defHttp.get<any>({
    url: '/dashboard-mission/task-group-by-route',
    params,
  });

export const getSlotStatus = () =>
  defHttp.get<any>({
    url: '/dashboard-slot/slot-and-container-status-monitor',
  });
