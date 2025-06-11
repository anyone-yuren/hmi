import { defHttp } from '../axios';
// 获取权限列表
export const getPermission = () =>
  defHttp.get<any>({
    url: '/permission',
  });

// 获取枚举数据
export const getEnum = () =>
  defHttp.get<any>({
    url: '/enum',
  });

export const getProfile = () =>
  defHttp.get<any>({
    url: '/profile',
  });

export const getWmsVersion = () =>
  defHttp.get<any>({
    url: '/version',
  });

// 物料列表
export const getMaterialOptions = () =>
  defHttp.get<any>({
    url: '/material/options',
  });

// 单位列表
export const getUnitOptions = (materialId = '') =>
  defHttp.get<any>({
    url: `/unit/options?materialId=${materialId}`,
  });

// 供应商列表
export const getSupplierOptions = () =>
  defHttp.get<any>({
    url: '/supplier/options',
  });

// 客户列表
export const getCustomerOptions = () =>
  defHttp.get<any>({
    url: '/customer/options',
  });
// 获取库位选项列表
export const getSlotOptions = (areaId: any) => defHttp.get<any>({ url: `/slot/options?areaId=${areaId}` });

// 获取入库单列表
export const getReceiveOrderOptions = () =>
  defHttp.get<any>({
    url: '/receiving-order/options',
  });

// 获取出库单列表
export const getShippingOrderOptions = () =>
  defHttp.get<any>({
    url: '/shipping-order/options',
  });

// 获取物料类型列表
export const getMaterialTypeOptions = () =>
  defHttp.get<any>({
    url: '/material-type/options',
  });

// 获取订单类型列表
export const getOrderTypeOptions = (orderType: 'ReceivingOrderType' | 'ShippingOrderType') =>
  defHttp.get<any>({
    url: `/dictionary/options?value=${orderType}`,
  });
