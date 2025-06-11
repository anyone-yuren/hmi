import { defHttp } from '../axios';

// 获取区域列表哦
export const getArea = (params: any) =>
  defHttp.get<any>({
    url: '/area',
    params,
  });

// 获取区域详情
export const getAreaDetail = (params: any) =>
  defHttp.get<any>({
    url: `/area/${params.id}`,
  });

// 编辑区域
export const updateArea = (params: any) =>
  defHttp.put<any>({
    url: `/area/${params.id}`,
    data: params,
  });
// 新增区域
export const addArea = (params: any) =>
  defHttp.post<any>({
    url: '/area',
    data: params,
  });
// 删除区域
export const deleteArea = (params: any) =>
  defHttp.delete<any>({
    url: `/area/${params}`,
  });
export const getAreaOptions = () =>
  defHttp.get<any>({
    url: '/area/options',
  });
