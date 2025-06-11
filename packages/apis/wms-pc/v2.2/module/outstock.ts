import { defHttp } from '../axios';

// 获取入库单列表
export const getShippingOrderList = (params: any) =>
  defHttp.get<any>({
    url: '/shipping-order',
    params,
  });

/**
 * 获取一条记录
 * @param id
 * @returns
 */
export const getShippingOrderRecord = (id: string) =>
  defHttp.get<any>({
    url: `/shipping-order/${id}`,
  });

/**
 * 更新
 * @param data
 * @returns
 */
export const updateShippingOrder = (data: any) =>
  defHttp.put<any>({
    url: `/shipping-order/${data.id}`,
    data,
  });

/**
 * 创建
 * @param data
 * @returns
 */
export const addShippingOrder = (data: any) =>
  defHttp.post<any>({
    url: '/shipping-order',
    data,
  });

/**
 * 取消
 * @param id
 * @returns
 */
export const cancelShippingOrder = (id: string) =>
  defHttp.post<any>({
    url: `/shipping-order/${id}/cancel`,
  });

/**
 * 手动完成
 * @param id
 * @returns
 */
export const completeShippingOrder = (id: string) =>
  defHttp.post<any>({
    url: `/shipping-order/${id}/manual-complete`,
  });

/**
 * 获取入库单行列表
 * @param id
 * @returns
 */
export const getShippingOrderLines = (id: number) =>
  defHttp.get<any>({
    url: `/shipping-order/${id}/lines`,
  });

/**
 * 获取出库单行分配详情
 * @param id
 * @returns
 */
export const getShippingAllocationDetail = (id: number) =>
  defHttp.get<any>({
    url: `/shipping-allocation/detail/${id}`,
  });

/**
 * 执行库存分配
 * @param data
 * @returns
 */
export const executeShippingAllocation = (data: any) =>
  defHttp.post<any>({
    url: '/shipping-allocation/execute',
    data,
  });

/**
 *  一键搬运
 */
export const applyShippingAllocation = (data: any) =>
  defHttp.post<any>({
    url: '/shipping-allocation/apply-to-workbench',
    data,
  });

/**
 * 取消分配
 * @param data
 * @returns
 */
export const cancelShippingAllocation = (data: any) =>
  defHttp.post<any>({
    url: '/shipping-allocation/cancel',
    data,
  });

/**
 * 确认分配
 * @param data
 * @returns
 */
export const confirmShippingAllocation = (data: any) =>
  defHttp.post<any>({
    url: '/shipping-allocation/confirm',
    data,
  });

/**
 * 获取分配记录的库位分组列表
 * @param params
 * @returns
 */
export const getShippingSlotGroupList = (params: any) =>
  defHttp.get<any>({
    url: '/shipping-allocation/slot-group-list',
    params,
  });
