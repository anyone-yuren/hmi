import { defHttp } from '../axios';

// 获取入库单列表
export const getReceiveOrderList = (params: any) =>
  defHttp.get<any>({
    url: '/receiving-order',
    params,
  });

/**
 * 获取一条记录
 * @param id
 * @returns
 */
export const getReceiveOrderRecord = (id: string) =>
  defHttp.get<any>({
    url: `/receiving-order/${id}`,
  });

/**
 * 更新
 * @param data
 * @returns
 */
export const updateReceiveOrder = (data: any) =>
  defHttp.put<any>({
    url: `/receiving-order/${data.id}`,
    data,
  });

/**
 * 创建
 * @param data
 * @returns
 */
export const addReceiveOrder = (data: any) =>
  defHttp.post<any>({
    url: '/receiving-order',
    data,
  });

/**
 * 取消
 * @param id
 * @returns
 */
export const cancelReceiveOrder = (id: string) =>
  defHttp.post<any>({
    url: `/receiving-order/${id}/cancel`,
  });

/**
 * 手动完成
 * @param id
 * @returns
 */
export const completeReceiveOrder = (id: string) =>
  defHttp.post<any>({
    url: `/receiving-order/${id}/manual-complete`,
  });

/**
 * 获取入库单行列表
 * @param id
 * @returns
 */
export const getReceiveOrderLines = (id: number) =>
  defHttp.get<any>({
    url: `/receiving-order/${id}/lines`,
  });
