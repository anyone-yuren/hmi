import { defHttp } from '../axios';

// 获取区域列表哦
export const getRoute = (params: any) =>
  defHttp.get<any>({
    url: '/route',
    params,
  });

// 获取区域详情
export const getRouteDetail = (params: any) =>
  defHttp.get<any>({
    url: `/route/${params.id}`,
  });

// 编辑区域
export const updateRoute = (params: any) =>
  defHttp.put<any>({
    url: `/route/${params.id}`,
    data: params,
  });
// 新增区域
export const addRoute = (params: any) =>
  defHttp.post<any>({
    url: '/route',
    data: params,
  });
// 删除区域
export const deleteRoute = (params: any) =>
  defHttp.delete<any>({
    url: `/route/${params}`,
  });

// 获取路径下拉列表
export const getRouteOptions = (params: any) =>
  defHttp.get<any>({
    url: '/route/options',
    params,
  });
