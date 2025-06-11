import { defHttp } from '../axios';

// 获取区域列表哦
export const getMaterial = (params: any) =>
  defHttp.get<any>({
    url: '/material',
    params,
  });

// 获取区域详情
export const getMaterialDetail = (params: any) =>
  defHttp.get<any>({
    url: `/material/${params.id}`,
  });

// 编辑区域
export const updateMaterial = (params: any) =>
  defHttp.put<any>({
    url: `/material/${params.id}`,
    data: params,
  });
// 新增区域
export const addMaterial = (params: any) =>
  defHttp.post<any>({
    url: '/material',
    data: params,
  });
// 删除区域
export const deleteMaterial = (params: any) =>
  defHttp.delete<any>({
    url: `/material/${params}`,
  });
