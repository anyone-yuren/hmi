import { defHttp } from '../axios';

// 获取区域列表哦
export const getAllocationRule = (params: any) =>
  defHttp.get<any>({
    url: '/allocation-rule',
    params,
  });
// 获取区域详情
export const getAllocationRuleDetail = (id: any) =>
  defHttp.get<any>({
    url: `/allocation-rule/${id}`,
  });
// 编辑区域
export const updateAllocationRule = (params: any) =>
  defHttp.put<any>({
    url: `/allocation-rule/${params.id}`,
    data: params,
  });
// 新增区域
export const addAllocationRule = (params: any) =>
  defHttp.post<any>({
    url: '/allocation-rule',
    data: params,
  });
// 删除区域
export const deleteAllocationRule = (params: any) =>
  defHttp.delete<any>({
    url: `/allocation-rule/${params}`,
  });

// 库存分配规则
export const getInventoryRule = (params: any) =>
  defHttp.get<any>({
    url: '/inventory-rule',
    params,
  });
// 获取库存分配规则详情
export const getInventoryRuleDetail = (id: any) =>
  defHttp.get<any>({
    url: `/inventory-rule/${id}`,
  });
// create库存分配规则
export const addInventoryRule = (data: any) =>
  defHttp.post<any>({
    url: '/inventory-rule',
    data,
  });
// update库存分配规则
export const updateInventoryRule = (params: any) =>
  defHttp.put<any>({
    url: `/inventory-rule/${params.id}`,
    data: params,
  });
// delete库存分配规则
export const deleteInventoryRule = (params: any) =>
  defHttp.delete<any>({
    url: `/inventory-rule/${params}`,
  });

/**
 * 获取同物料同列规则（获取库位规则的设置）
 * @returns
 */
export const getSlotRuleSetting = () =>
  defHttp.get<any>({
    url: '/slot-rule-setting',
  });

/**
 * 更新同物料同列规则（更新库位规则的设置）
 * @param smsc
 * @returns
 */
export const updateSlotRuleSetting = (smsc: boolean) =>
  defHttp.put<any>({
    url: '/slot-rule-setting',
    data: {
      smsc,
    },
  });
/**
 * 获取库存规则设置
 * @returns
 */
export const getStorageRuleSetting = () =>
  defHttp.get<any>({
    url: '/inventory-rule-setting',
  });

/**
 * 更新库存规则设置
 * @param params
 * @returns
 */
export const updateStorageRuleSetting = (sorting: 0 | 1) =>
  defHttp.put<any>({
    url: '/inventory-rule-setting',
    data: {
      sorting,
    },
  });
