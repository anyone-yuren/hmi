import { get, post } from '../axios';

/**
 * 获取分配记录（拣选）分页列表
 * @param params
 * @returns
 */
export const getShippingAllocationList = (params: any) => get('/shipping-allocation', params);

/**
 * 拣选
 * @param data
 * @returns
 */
export const picking = (data: any) => post('/storage/picking', data);
