import { defHttp } from '../axios';

export const slotOptions = () =>
  defHttp.get<any>({
    url: '/slot/options',
  });

export const slotList = (params: any) =>
  defHttp.get<any>({
    url: '/slot',
    params,
  });

export const bindSlot = (params: any) =>
  defHttp.post<any>({
    url: '/container-bind/bind',
    params,
  });

// 解绑
export const unbindSlot = (params: any) =>
  defHttp.post<any>({
    url: `/container-bind/${params}/unbind`,
  });

// 容器列表
export const trayList = (params: any) =>
  defHttp.get<any>({
    // url: '/container-bind/options',
    url: '/container/options',
    params,
  });

export const getVersion = () =>
  defHttp.get<any>({
    url: '/slot-editor/version',
  });

// 同步库位
export const syncSlot = () =>
  defHttp.post<any>({
    url: '/slot-editor/synchronize',
  });

// 修改库位
export const editSlot = (params: any) =>
  defHttp.put<any>({
    url: `/slot/${params.id}`,
    params,
  });

/**
 * 同步WCS库位
 * @returns
 */
export const wcsSlotSynchronize = () =>
  defHttp.post<any>({
    url: '/wcs-slot/synchronize',
  });

/**
 * 获取库位状态列表
 */
export const getSlotStatusOptions = () =>
  defHttp.get<any>({
    url: '/slot-display/slot-goods',
  });
