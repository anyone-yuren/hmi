import { defHttp } from '../axios';
// 获取区域列表哦
export const getContainer = (params: any) =>
  defHttp.get<any>({
    url: '/container',
    params,
  });

// 获取区域详情
export const getContainerDetail = (params: any) =>
  defHttp.get<any>({
    url: `/container/${params.id}`,
  });

// 编辑区域
export const updateContainer = (params: any) =>
  defHttp.put<any>({
    url: `/container/${params.id}`,
    data: params,
  });
// 新增区域
export const addContainer = (params: any) =>
  defHttp.post<any>({
    url: '/container',
    data: params,
  });
// 删除区域
export const deleteContainer = (params: any) =>
  defHttp.delete<any>({
    url: `/container/${params}`,
  });
