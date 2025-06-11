import { get } from '../axios';

/**
 * 库存分页
 * @param params
 * @returns
 */
export const getInventoryList = (params: any) =>
  get('/inventory', params);

/**
 * 库位库存
 * @param params
 * @returns
 */
export const getInventoryGroupBySlot = (params: any) =>
  get('/inventory/inventory-group-by-slot', params);

/**
 * 库位批次
 * @param params
 * @returns
 */
export const getInventoryGroupByBatchNo = (params: any) =>
  get('/inventory/inventory-group-by-batch-no', params);

/**
 * 库龄查询
 * @param params
 * @returns
 */
export const getInventoryStatisticsByDate = (params: any) =>
  get('/inventory/inventory-statistics-by-date', params);

/**
 * 库龄查询 - 根据时间查询库存
 * @param params
 * @returns
 */
export const getInventoryByDate = (params: any) =>
  get('/inventory/inventory-by-date', params);

/**
 * 库存追溯查询
 * @param params
 * @returns
 */
export const getInventoryTransactionList = (params: any) =>
  get('/transaction', params);
