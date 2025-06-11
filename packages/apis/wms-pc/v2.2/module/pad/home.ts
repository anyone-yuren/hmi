import { defHttp } from '../../axios';

const get = (url: string, params?: any) => defHttp.get({ url, params });
const post = (url: string, data?: any) => defHttp.post({ url, data });

/**
 * 获取所有库位列表
 * @returns
 */
export const getAllSlots = () => get('/slot-display');

/**
 * 获取车
 */
export const getVehicles = () => get('/slot-display/virtual-list');
/**
 * 获取 区域-库位 列表
 * @param params
 * @returns
 */
export const getAreaLocationList = (params: any = { pageIndex: 1, pageSize: 200 }) =>
  get('/slot-display/area-slots', params);

/**
 * 获取容器列表
 * @returns
 */
export const getTrayOptions = () => get('/container/options');

/**
 * 绑定容器
 * @param params
 * @returns
 */
export const containerBind = (params: any) => post('/container-bind/bind', params);

/**
 * 解绑容器
 * @param id string
 * @returns
 */
export const containerUnbind = (id: string) => post(`/container-bind/${id}/unbind`);

/**
 * 库位解绑
 * @param id string
 * @returns
 */
export const slotUnbind = (id: string) => post(`/container-bind/unbind-by-slot/${id}`);

/**
 * 库位到库位搬运
 * @param params
 * @returns
 */
export const slot2slot = (params: any) => post('/mission/slot-to-slot', params);

/**
 * 库位到区域搬运
 * @param params
 * @returns
 */
export const slot2area = (params: any) => post('/mission/slot-to-area', params);

/**
 * 呼叫容器
 * @param params
 * @returns
 */
export const applyContainer = (params: any) => post('/container-mission/apply-container', params);

/**
 * 批量呼叫容器
 * @param params
 * @returns
 */
export const applyMultiplyContainers = (params: any) => post('/container-mission/apply-multiply-containers', params);

/**
 * 申请入库
 * @param params
 * @returns
 */
export const apply2Storage = (params: any) => post('/container-mission/apply-to-storage', params);

/**
 * 组盘
 * @param data
 * @returns
 */
export const combine = (data: any) => post('/storage/combine', data);

/**
 * 获取入库单行列表
 * @param receivingOrderId
 * @returns
 */
export const getCombineListByOrder = (receivingOrderId: string) =>
  get(`/storage/combine-list-by-order/${receivingOrderId}`);

/**
 * 获取出库单 分配列表
 * @param shippingOrderId
 * @returns
 */
export const getPickingListByOrder = (shippingOrderId: string) =>
  get(`/storage/picking-list-by-order/${shippingOrderId}`);

/**
 * 获取库位 分配列表
 * @param slotId
 * @returns
 */
export const getPickingListBySlot = (slotId: string) => get(`/storage/picking-list-by-slot/${slotId}`);

/**
 * 获取库位详情
 * @param slotId
 * @returns
 */
export const getSlotDetail = (slotId: string) => get(`/slot-display/detail/${slotId}`);

/**
 * 批量绑盘
 * @param data
 * @returns
 */
export const multiSlotBind = (data: any) => post('/container-bind/bind-containers', data);

/**
 * 批量解绑
 * @param data
 * @returns
 */
export const multiSlotUnbind = (data: any) => post('/container-bind/unbind-containers', data);
