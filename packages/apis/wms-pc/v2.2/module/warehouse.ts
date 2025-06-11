import { defHttp } from '../axios';

// 获取区域列表哦
export const getWarehouse = (params: any) =>
  defHttp.get<any>({
    url: '/warehouse',
    params,
  });

// 获取区域详情
export const getWarehouseDetail = (params: any) =>
  defHttp.get<any>({
    url: `/warehouse/${params.id}`,
  });

// 编辑区域
export const updateWarehouse = (params: any) =>
  defHttp.put<any>({
    url: `/warehouse/${params.id}`,
    data: params,
  });
// 新增区域
export const addWarehouse = (params: any) =>
  defHttp.post<any>({
    url: '/warehouse',
    data: params,
  });
// 删除区域
export const deleteWarehouse = (params: any) =>
  defHttp.delete<any>({
    url: `/warehouse/${params}`,
  });
