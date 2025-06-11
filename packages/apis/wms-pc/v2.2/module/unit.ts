import { defHttp } from '../axios';

// 获取区域列表哦
export const getUnit = (params: any) =>
  defHttp.get<any>({
    url: '/unit',
    params,
  });

// 获取区域详情
export const getUnitDetail = (params: any) =>
  defHttp.get<any>({
    url: `/unit/${params.id}`,
  });

// 编辑区域
export const updateUnit = (params: any) =>
  defHttp.put<any>({
    url: `/unit/${params.id}`,
    data: params,
  });
// 新增区域
export const addUnit = (params: any) =>
  defHttp.post<any>({
    url: '/unit',
    data: params,
  });
// 删除区域
export const deleteUnit = (params: any) =>
  defHttp.delete<any>({
    url: `/unit/${params}`,
  });
